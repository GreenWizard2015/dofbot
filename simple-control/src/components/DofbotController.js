"use client";

import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "../app/page.module.css";
import {
  setCurrentAngles,
  setNewAngles,
  setStatus,
  updateConnectionData,
  setConnectionStatus,
  setIsPlaying,
  setCurrentQueueIndex
} from "../redux/slices/robotSlice";
import { store } from "../redux/redux-store";

import ConnectionPanel from "./connection/ConnectionPanel";
import RobotControlPanel from "./robot-control/RobotControlPanel";
import CameraFeed from "./camera/CameraFeed";
import { Typography } from "./ui";

const DofbotController = () => {
  const dispatch = useDispatch();
  const {
    ipAddress,
    connected,
    moveTime,
    newAngles,
    positionQueue,
    isPlaying,
    currentQueueIndex
  } = useSelector((state) => state.robot);

  // Reference to track if component is mounted
  const isMounted = useRef(true);

  // Reset queue state on mount and cleanup on unmount
  useEffect(() => {
    // Reset queue-related state on mount to ensure it's not persisted
    dispatch(setIsPlaying(false));
    dispatch(setCurrentQueueIndex(0));

    return () => {
      isMounted.current = false;
    };
  }, [dispatch]);

  // No automatic image refresh - images will only update when the refresh button is clicked

  const connectToRobot = async () => {
    if (!ipAddress) {
      dispatch(setStatus("Please enter an IP address"));
      return;
    }

    try {
      dispatch(setStatus("Connecting..."));
      const response = await fetch(`http://${ipAddress}:5000/angles`);

      if (!response.ok) {
        throw new Error(`Failed to connect: ${response.statusText}`);
      }

      const data = await response.json();
      dispatch(updateConnectionData({
        angles: data.angles,
        status: "Connected successfully",
        imageUrl: `http://${ipAddress}:5000/image`
      }));
    } catch (error) {
      dispatch(setStatus(`Error: ${error.message}`));
      dispatch(setConnectionStatus(false));
    }
  };

  const refreshAngles = async () => {
    if (!connected) return;

    try {
      const response = await fetch(`http://${ipAddress}:5000/angles`);

      if (!response.ok) {
        throw new Error(`Failed to get angles: ${response.statusText}`);
      }

      const data = await response.json();
      dispatch(setCurrentAngles(data.angles));
    } catch (error) {
      dispatch(setStatus(`Error refreshing angles: ${error.message}`));
    }
  };

  const moveToHome = async () => {
    if (!connected) return;

    try {
      dispatch(setStatus("Moving to home position..."));
      const response = await fetch(`http://${ipAddress}:5000/home`);

      if (!response.ok) {
        throw new Error(`Failed to move to home: ${response.statusText}`);
      }

      const data = await response.json();
      dispatch(setCurrentAngles(data.angles));
      dispatch(setNewAngles([...data.angles]));
      dispatch(setStatus("Moved to home position"));
    } catch (error) {
      dispatch(setStatus(`Error moving to home: ${error.message}`));
    }
  };

  const setAngles = async (customAngles = null, customTime = null) => {
    if (!connected) return;

    try {
      dispatch(setStatus("Moving servos..."));

      // Simple fix: ensure angles is an array
      const angles = customAngles || newAngles;
      if (!Array.isArray(angles)) {
        console.log("angles is not an array", angles);
        throw new Error("angles is not an array");
      }

      // Use custom time if provided, otherwise use global moveTime
      const time = customTime || moveTime;

      const anglesStr = angles.join(',');
      const response = await fetch(`http://${ipAddress}:5000/set_angles?angles=${anglesStr}&t=${time}`);

      if (!response.ok) {
        throw new Error(`Failed to set angles: ${response.statusText}`);
      }

      const data = await response.json();
      dispatch(setCurrentAngles(data.angles));
      dispatch(setStatus("Movement completed"));
      return true;
    } catch (error) {
      dispatch(setStatus(`Error setting angles: ${error.message}`));
      return false;
    }
  };

  // Function to play a position from the queue
  const playPosition = async (position) => {
    console.log("playPosition called with:", position);
    console.log("Current state:", { connected, isPlaying, currentQueueIndex, queueLength: positionQueue.length });

    // Store the current isPlaying state to avoid race conditions with state updates
    const wasPlaying = isPlaying;

    if (!connected) {
      console.log("Not connected, returning");
      return;
    }

    // Don't check isPlaying here - it might have changed between the call and execution
    // Instead, we'll use the wasPlaying variable to track the state at the time of the call

    try {
      // Check if position is a valid object with angles array and time
      if (!position || !position.angles || !Array.isArray(position.angles)) {
        console.error("Invalid position format:", position);
        throw new Error("Invalid position format");
      }

      const { angles, time } = position;
      console.log("Playing position with angles:", angles, "and time:", time);

      dispatch(setNewAngles(angles));
      console.log("Setting angles...");
      const success = await setAngles(angles, time);
      console.log("setAngles result:", success);

      // Re-check the current state after the async operation
      const currentState = store.getState().robot;
      const stillPlaying = currentState.isPlaying;

      console.log("After movement - stillPlaying:", stillPlaying, "wasPlaying:", wasPlaying);

      if (success && stillPlaying && isMounted.current) {
        // Move to the next position in the queue
        const nextIndex = currentState.currentQueueIndex + 1;
        console.log("Current index:", currentState.currentQueueIndex, "Next index:", nextIndex, "Queue length:", currentState.positionQueue.length);

        if (nextIndex < currentState.positionQueue.length) {
          // Continue to the next position
          console.log("Moving to next position in queue");
          dispatch(setCurrentQueueIndex(nextIndex));

          // Use setTimeout to ensure state is updated before next call
          setTimeout(() => {
            if (store.getState().robot.isPlaying) {
              playPosition(currentState.positionQueue[nextIndex]);
            } else {
              console.log("Playback was stopped during timeout");
            }
          }, 50);
        } else if (currentState.isLooping && currentState.positionQueue.length > 0) {
          // Loop back to the beginning
          console.log("End of queue reached, looping back to beginning");
          dispatch(setCurrentQueueIndex(0));

          // Use setTimeout to ensure state is updated before next call
          setTimeout(() => {
            if (store.getState().robot.isPlaying) {
              playPosition(currentState.positionQueue[0]);
            } else {
              console.log("Playback was stopped during timeout");
            }
          }, 50);
        } else {
          // End of queue, stop playing
          console.log("End of queue reached, stopping playback");
          dispatch(setIsPlaying(false));
        }
      } else {
        console.log("Not continuing to next position. Success:", success, "stillPlaying:", stillPlaying, "isMounted:", isMounted.current);
        if (!stillPlaying) {
          console.log("Playback was stopped during movement");
        }
      }
    } catch (error) {
      console.error("Error playing position:", error);
      dispatch(setStatus(`Error playing position: ${error.message}`));
      dispatch(setIsPlaying(false));
    }
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <ConnectionPanel onConnect={connectToRobot} />

        {connected && (
          <>
            <div className={styles.controlPanel}>
              <RobotControlPanel
                onRefreshAngles={refreshAngles}
                onSetAngles={setAngles}
                onMoveToHome={moveToHome}
                onPlayPosition={playPosition}
              />
              <CameraFeed />
            </div>
          </>
        )}
      </main>

      <footer className={styles.footer}>
        <Typography variant="body2">Dofbot Simple Control Interface</Typography>
      </footer>
    </div>
  );
};

export default DofbotController;
