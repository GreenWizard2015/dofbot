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
