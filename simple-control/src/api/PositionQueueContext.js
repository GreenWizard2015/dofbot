"use client";

import React, { createContext, useContext, useRef, useState, useEffect } from 'react';
import PositionQueueManager from './PositionQueueManager';
import { useSafeApi } from './ApiContext';

// Create the context
const PositionQueueContext = createContext(null);

/**
 * Provider component for the position queue context
 * @param {Object} props Component props
 * @param {React.ReactNode} props.children Child components
 * @returns {JSX.Element} Provider component
 */
export function PositionQueueProvider({ children }) {
  // Create a ref to hold the queue manager instance
  const queueManagerRef = useRef();
  // Get the API instance
  const api = useSafeApi();
  
  // State for the UI to react to
  const [positionQueue, setPositionQueue] = useState([]);
  const [isLooping, setIsLooping] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentQueueIndex, setCurrentQueueIndex] = useState(0);
  const [status, setStatus] = useState("");
  
  // Track if the component is mounted
  const isMountedRef = useRef(true);

  // Set mounted flag on mount, clear on unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Create the queue manager instance if it doesn't exist
  useEffect(() => {
    if (!queueManagerRef.current) {
      queueManagerRef.current = new PositionQueueManager({
        onStatusChange: (newStatus) => {
          if (isMountedRef.current) setStatus(newStatus);
        },
        onQueueChange: (newQueue) => {
          if (isMountedRef.current) setPositionQueue([...newQueue]);
        },
        onIsLoopingChange: (newIsLooping) => {
          if (isMountedRef.current) setIsLooping(newIsLooping);
        },
        onIsPlayingChange: (newIsPlaying) => {
          if (isMountedRef.current) setIsPlaying(newIsPlaying);
        },
        onCurrentQueueIndexChange: (newIndex) => {
          if (isMountedRef.current) setCurrentQueueIndex(newIndex);
        }
      });
    }
  }, []);

  // Create a playPosition function that uses the API
  const playPosition = (position) => {
    if (!queueManagerRef.current) return;
    
    // Get the current state from the manager
    const manager = queueManagerRef.current;
    
    console.log("playPosition called with:", position);

    // Check if we should stop playback
    if (!manager.isPlaying) {
      console.log("Playback stopped, not proceeding to next position");
      return;
    }

    // Validate position object
    if (!position || !position.angles || !Array.isArray(position.angles)) {
      console.error("Invalid position format:", position);
      setStatus("Error: Invalid position format in queue");
      manager.setIsPlaying(false);
      return;
    }

    // Check if API is available
    if (!api) {
      console.error("API not available");
      setStatus("Error: API not available");
      manager.setIsPlaying(false);
      return;
    }

    // Update status
    setStatus(`Playing position ${manager.currentQueueIndex + 1}/${manager.positionQueue.length}`);

    // Set the angles using the API
    api.setAngles(position.angles, position.time)
      .then(success => {
        if (success) {
          console.log("Position played successfully");

          // Check if we should stop playback
          if (!manager.isPlaying) {
            console.log("Playback stopped after position completed");
            return;
          }

          // Calculate the next index
          let nextIndex = manager.currentQueueIndex + 1;

          // Check if we've reached the end of the queue
          if (nextIndex >= manager.positionQueue.length) {
            if (manager.isLooping) {
              // If looping is enabled, go back to the beginning
              console.log("End of queue reached, looping back to start");
              nextIndex = 0;
            } else {
              // If not looping, stop playback
              console.log("End of queue reached, stopping playback");
              setStatus("Playback completed");
              manager.setIsPlaying(false);
              return;
            }
          }

          // Update the current queue index
          manager.setCurrentQueueIndex(nextIndex);

          // Get the next position
          const nextPosition = manager.positionQueue[nextIndex];

          // Add a small delay before playing the next position
          setTimeout(() => {
            // Recursively call playPosition with the next position
            playPosition(nextPosition);
          }, 100); // Small delay to ensure state is updated
        } else {
          console.error("Failed to play position");
          setStatus("Error: Failed to play position");
          manager.setIsPlaying(false);
        }
      })
      .catch(error => {
        console.error("Error playing position:", error);
        setStatus(`Error: ${error.message}`);
        manager.setIsPlaying(false);
      });
  };

  // Create the context value
  const contextValue = {
    positionQueue,
    isLooping,
    isPlaying,
    currentQueueIndex,
    status,
    manager: queueManagerRef.current,
    playPosition
  };

  return (
    <PositionQueueContext.Provider value={contextValue}>
      {children}
    </PositionQueueContext.Provider>
  );
}

/**
 * Hook to access the position queue context
 * @returns {Object} The position queue context
 */
export function usePositionQueue() {
  const context = useContext(PositionQueueContext);
  
  if (!context) {
    throw new Error('usePositionQueue must be used within a PositionQueueProvider');
  }
  
  return context;
}

/**
 * Hook to access the position queue context without throwing an error
 * @returns {Object|null} The position queue context or null if not available
 */
export function useSafePositionQueue() {
  return useContext(PositionQueueContext);
}
