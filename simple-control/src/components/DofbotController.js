"use client";

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "../app/page.module.css";
import {
  setCurrentAngles,
  setNewAngles,
  setStatus,
  updateConnectionData,
  setConnectionStatus
} from "../redux/slices/robotSlice";

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
    newAngles
  } = useSelector((state) => state.robot);

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

  const setAngles = async () => {
    if (!connected) return;

    try {
      dispatch(setStatus("Moving servos..."));
      const anglesStr = newAngles.join(',');
      const response = await fetch(`http://${ipAddress}:5000/set_angles?angles=${anglesStr}&t=${moveTime}`);

      if (!response.ok) {
        throw new Error(`Failed to set angles: ${response.statusText}`);
      }

      const data = await response.json();
      dispatch(setCurrentAngles(data.angles));
      dispatch(setStatus("Movement completed"));
    } catch (error) {
      dispatch(setStatus(`Error setting angles: ${error.message}`));
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
