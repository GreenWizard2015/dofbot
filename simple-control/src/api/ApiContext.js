"use client";

import React, { createContext, useContext, useRef, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import DofbotApi from './DofbotApi';
import {
  setStatus,
  setConnectionStatus,
  setCurrentAngles,
  setNewAngles,
  updateConnectionData,
  setIsPlaying,
  setCurrentQueueIndex
} from '../redux/slices/robotSlice';

// Create the API context
const ApiContext = createContext(null);

/**
 * Provider component for the API context
 * @param {Object} props Component props
 * @param {React.ReactNode} props.children Child components
 * @returns {JSX.Element} Provider component
 */
export function ApiProvider({ children }) {
  const dispatch = useDispatch();
  // Create a ref to hold the API instance
  const apiRef = useRef();
  // Track if the component is mounted
  const isMountedRef = useRef(true);

  // Get the state from Redux
  const {
    ipAddress,
    positionQueue,
    currentQueueIndex,
    isPlaying,
    isLooping,
    moveTime
  } = useSelector((state) => state.robot);

  // Set mounted flag on mount, clear on unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Create or recreate the API instance when IP address changes
  useEffect(() => {
    // Only proceed if component is mounted
    if (!isMountedRef.current) return;

    console.log("ApiContext: IP address changed to:", ipAddress);

    // Clean up previous instance if it exists
    if (apiRef.current) {
      console.log("ApiContext: Cleaning up previous API instance");
      apiRef.current.cleanup();
    }

    try {
      console.log("ApiContext: Creating new DofbotApi instance with IP:", ipAddress);

      // Create a new instance with the current IP address and callbacks that update Redux
      apiRef.current = new DofbotApi(ipAddress, {
        onStatusChange: (status) => {
          console.log("API callback: onStatusChange:", status);
          if (isMountedRef.current) dispatch(setStatus(status));
        },
        onAnglesChange: (angles) => {
          console.log("API callback: onAnglesChange:", angles);
          if (isMountedRef.current) dispatch(setCurrentAngles(angles));
        },
        onNewAnglesChange: (angles) => {
          console.log("API callback: onNewAnglesChange:", angles);
          if (isMountedRef.current) dispatch(setNewAngles(angles));
        },
        onConnectionChange: (connected) => {
          console.log("API callback: onConnectionChange:", connected);
          if (isMountedRef.current) dispatch(setConnectionStatus(connected));
        },
        onImageUrlChange: (url) => {
          console.log("API callback: onImageUrlChange:", url);
          /* Image URL is part of connection data */
        },
        onConnectionDataChange: (data) => {
          console.log("API callback: onConnectionDataChange:", data);
          if (isMountedRef.current) dispatch(updateConnectionData(data));
        },
        onQueueIndexChange: (index) => {
          console.log("API callback: onQueueIndexChange:", index);
          if (isMountedRef.current) dispatch(setCurrentQueueIndex(index));
        },
        onPlayingChange: (playing) => {
          console.log("API callback: onPlayingChange:", playing);
          if (isMountedRef.current) dispatch(setIsPlaying(playing));
        }
      });

      // Update moveTime in the API when it changes in Redux
      if (apiRef.current) {
        console.log("ApiContext: Setting moveTime to:", moveTime);
        apiRef.current.moveTime = moveTime;
      }

      console.log("ApiContext: API instance created successfully:", apiRef.current);
    } catch (error) {
      console.error("Error initializing API:", error);
    }
  }, [ipAddress, dispatch, moveTime]);

  // Update moveTime in the API when it changes in Redux
  useEffect(() => {
    if (isMountedRef.current && apiRef.current) {
      apiRef.current.moveTime = moveTime;
    }
  }, [moveTime]);

  // Clean up the API when the provider is unmounted
  useEffect(() => {
    return () => {
      if (apiRef.current) {
        apiRef.current.cleanup();
      }
    };
  }, []);

  // Helper function to get the next position for queue playback
  const getNextPosition = useCallback((isLooping) => {
    if (!isMountedRef.current || !apiRef.current) return null;

    const nextIndex = currentQueueIndex + 1;

    // If we have a next position in the queue
    if (nextIndex < positionQueue.length) {
      if (isMountedRef.current) {
        dispatch(setCurrentQueueIndex(nextIndex));
      }
      return positionQueue[nextIndex];
    }
    // If we're looping and have positions
    else if (isLooping && positionQueue.length > 0) {
      if (isMountedRef.current) {
        dispatch(setCurrentQueueIndex(0));
      }
      return positionQueue[0];
    }

    // No more positions
    return null;
  }, [currentQueueIndex, positionQueue, dispatch]);

  // Wrap the playPosition method to include queue management
  const wrappedPlayPosition = useCallback((position) => {
    if (!isMountedRef.current || !apiRef.current) return;

    // If no position provided, use the current queue position
    if (!position && positionQueue.length > 0) {
      position = positionQueue[currentQueueIndex];
    }

    if (!position) return;

    apiRef.current.playPosition(
      position,
      getNextPosition,
      isPlaying,
      isLooping
    );
  }, [apiRef, positionQueue, currentQueueIndex, isPlaying, isLooping, getNextPosition]);

  // Set the wrapped method on the API instance
  useEffect(() => {
    if (isMountedRef.current && apiRef.current) {
      apiRef.current.playQueuePosition = wrappedPlayPosition;
    }
  }, [wrappedPlayPosition]);

  return (
    <ApiContext.Provider value={apiRef.current}>
      {children}
    </ApiContext.Provider>
  );
}

/**
 * Hook to access the API instance
 * @returns {DofbotApi} The API instance
 */
export function useApi() {
  const api = useContext(ApiContext);

  if (!api) {
    throw new Error('useApi must be used within an ApiProvider');
  }

  return api;
}

// Alternative hook that doesn't throw an error if API is not available
export function useSafeApi() {
  const api = useContext(ApiContext);
  return api; // Can be null if not within ApiProvider
}
