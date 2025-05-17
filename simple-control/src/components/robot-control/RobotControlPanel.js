"use client";

import React from "react";
import { useSelector } from "react-redux";
import styles from "../../app/page.module.css";
import ServoControl from "./ServoControl";
import MoveTimeControl from "./MoveTimeControl";
import CurrentAnglesDisplay from "./CurrentAnglesDisplay";
import ControlButtons from "./ControlButtons";
import PositionQueue from "./PositionQueue";
import { Card, Typography } from "../ui";

const RobotControlPanel = ({ onRefreshAngles, onSetAngles, onMoveToHome, onPlayPosition }) => {
  const { newAngles, isPlaying } = useSelector((state) => state.robot);

  console.log("RobotControlPanel props:", {
    onRefreshAngles: !!onRefreshAngles,
    onSetAngles: !!onSetAngles,
    onMoveToHome: !!onMoveToHome,
    onPlayPosition: !!onPlayPosition
  });

  // Wrap the functions to add logging
  const handleSetAngles = () => {
    console.log("handleSetAngles called in RobotControlPanel");
    if (typeof onSetAngles === 'function') {
      onSetAngles();
    } else {
      console.error("onSetAngles is not a function:", onSetAngles);
    }
  };

  const handleMoveToHome = () => {
    console.log("handleMoveToHome called in RobotControlPanel");
    if (typeof onMoveToHome === 'function') {
      onMoveToHome();
    } else {
      console.error("onMoveToHome is not a function:", onMoveToHome);
    }
  };

  return (
    <>
      <Card className={styles.angleControls}>
        <Typography variant="h2">Servo Controls</Typography>

        <CurrentAnglesDisplay onRefresh={onRefreshAngles} />

        <div className={`${styles.sliderContainer} ${isPlaying ? styles.disabledControl : ''}`}>
          {newAngles.map((angle, index) => (
            <ServoControl key={index} index={index} angle={angle} disabled={isPlaying} />
          ))}

          <MoveTimeControl disabled={isPlaying} />
        </div>

        <ControlButtons onMove={handleSetAngles} onHome={handleMoveToHome} disabled={isPlaying} />
      </Card>

      <PositionQueue onPlayPosition={onPlayPosition} />
    </>
  );
};

export default RobotControlPanel;
