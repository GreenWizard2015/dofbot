"use client";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "../app/page.module.css";
import {
  setIsPlaying,
  setCurrentQueueIndex
} from "../redux/slices/robotSlice";
import { useSafeApi } from "../api/ApiContext";

import ConnectionPanel from "./connection/ConnectionPanel";
import RobotControlPanel from "./robot-control/RobotControlPanel";
import CameraFeed from "./camera/CameraFeed";
import { Typography } from "./ui";

const DofbotController = () => {
  const dispatch = useDispatch();
  const { connected, newAngles, moveTime } = useSelector((state) => state.robot);
  const [isApiReady, setIsApiReady] = useState(false);

  // Get the API instance from context using the safe hook that doesn't throw
  const api = useSafeApi();

  // Update API ready state when the API becomes available
  useEffect(() => {
    if (api && !isApiReady) {
      console.log("API is now available:", api);
      setIsApiReady(true);
    } else if (!api) {
      console.log("API is not available yet");
    }
  }, [api, isApiReady]);

  // Reset queue state on mount
  useEffect(() => {
    // Reset queue-related state on mount to ensure it's not persisted
    dispatch(setIsPlaying(false));
    dispatch(setCurrentQueueIndex(0));
  }, [dispatch]);

  // Safe API call functions that check if API is available first
  const safeConnectToRobot = () => {
    console.log("safeConnectToRobot called, API available:", !!api);
    if (api) {
      console.log("Calling api.connectToRobot");
      api.connectToRobot();
    } else {
      console.warn("Cannot connect: API not ready");
    }
  };

  const safeRefreshAngles = () => {
    console.log("safeRefreshAngles called, API available:", !!api, "connected:", api?.connected);
    if (api) {
      if (api.connected) {
        console.log("Calling api.refreshAngles");
        api.refreshAngles();
      } else {
        console.warn("Cannot refresh angles: Not connected to robot");
        // Try to connect first
        api.connectToRobot().then(() => {
          if (api.connected) {
            console.log("Connected successfully, now refreshing angles");
            api.refreshAngles();
          }
        });
      }
    } else {
      console.warn("Cannot refresh angles: API not ready");
    }
  };

  const safeSetAngles = (customAngles, customTime) => {
    console.log("safeSetAngles called, API available:", !!api, "connected:", api?.connected);
    // Use the Redux state's newAngles if no custom angles are provided
    const anglesToUse = customAngles || newAngles;
    // Use the Redux state's moveTime if no custom time is provided
    const timeToUse = customTime || moveTime;

    console.log("Using angles from Redux state:", anglesToUse);
    console.log("Using time from Redux state:", timeToUse);

    if (api) {
      if (api.connected) {
        console.log("Calling api.setAngles with:", anglesToUse, timeToUse);
        api.setAngles(anglesToUse, timeToUse);
      } else {
        console.warn("Cannot set angles: Not connected to robot");
        // Try to connect first
        api.connectToRobot().then(() => {
          if (api.connected) {
            console.log("Connected successfully, now setting angles");
            api.setAngles(anglesToUse, timeToUse);
          }
        });
      }
    } else {
      console.warn("Cannot set angles: API not ready");
    }
  };

  const safeMoveToHome = () => {
    console.log("safeMoveToHome called, API available:", !!api, "connected:", api?.connected);
    if (api) {
      if (api.connected) {
        console.log("Calling api.moveToHome");
        api.moveToHome();
      } else {
        console.warn("Cannot move to home: Not connected to robot");
        // Try to connect first
        api.connectToRobot().then(() => {
          if (api.connected) {
            console.log("Connected successfully, now moving to home");
            api.moveToHome();
          }
        });
      }
    } else {
      console.warn("Cannot move to home: API not ready");
    }
  };

  const safePlayQueuePosition = (position) => {
    console.log("safePlayQueuePosition called, API available:", !!api, "connected:", api?.connected);
    if (api) {
      if (api.connected) {
        console.log("Calling api.playQueuePosition with:", position);
        api.playQueuePosition(position);
      } else {
        console.warn("Cannot play position: Not connected to robot");
        // Try to connect first
        api.connectToRobot().then(() => {
          if (api.connected) {
            console.log("Connected successfully, now playing position");
            api.playQueuePosition(position);
          }
        });
      }
    } else {
      console.warn("Cannot play position: API not ready");
    }
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <ConnectionPanel onConnect={safeConnectToRobot} />

        {connected && (
          <>
            <div className={styles.controlPanel}>
              <RobotControlPanel
                onRefreshAngles={safeRefreshAngles}
                onSetAngles={safeSetAngles}
                onMoveToHome={safeMoveToHome}
                onPlayPosition={safePlayQueuePosition}
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
