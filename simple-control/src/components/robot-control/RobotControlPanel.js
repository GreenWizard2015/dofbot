"use client";

import React from "react";
import { useSelector } from "react-redux";
import styles from "../../app/page.module.css";
import ServoControl from "./ServoControl";
import MoveTimeControl from "./MoveTimeControl";
import CurrentAnglesDisplay from "./CurrentAnglesDisplay";
import ControlButtons from "./ControlButtons";
import { Card, Typography } from "../ui";

const RobotControlPanel = ({ onRefreshAngles, onSetAngles, onMoveToHome }) => {
  const { newAngles } = useSelector((state) => state.robot);

  return (
    <Card className={styles.angleControls}>
      <Typography variant="h2">Servo Controls</Typography>

      <CurrentAnglesDisplay onRefresh={onRefreshAngles} />

      <div className={styles.sliderContainer}>
        {newAngles.map((angle, index) => (
          <ServoControl key={index} index={index} angle={angle} />
        ))}

        <MoveTimeControl />
      </div>

      <ControlButtons onMove={onSetAngles} onHome={onMoveToHome} />
    </Card>
  );
};

export default RobotControlPanel;
