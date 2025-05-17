"use client";

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateSingleAngle } from "../../redux/slices/robotSlice";
import styles from "../../app/page.module.css";
import { Typography, Input } from "../ui";

// Safe angle ranges from the Flask app
const SAFE_ANGLES = [
  [10, 170], // Servo 1 (Base rotation)
  [15, 165], // Servo 2 (Shoulder)
  [15, 165], // Servo 3 (Elbow)
  [10, 170], // Servo 4 (Wrist pitch)
  [10, 260], // Servo 5 (Wrist rotation)
  [10, 170]  // Servo 6 (Gripper)
];

const SERVO_NAMES = [
  "Base Rotation",
  "Shoulder",
  "Elbow",
  "Wrist Pitch",
  "Wrist Rotation",
  "Gripper"
];

const ServoControl = ({ index, angle, disabled = false }) => {
  const dispatch = useDispatch();

  const handleAngleChange = (value) => {
    if (disabled) return;

    // Ensure the angle is within safe range
    const [min, max] = SAFE_ANGLES[index];
    const safeValue = Math.max(min, Math.min(max, parseInt(value) || 0));

    dispatch(updateSingleAngle({ index, value: safeValue }));
  };

  return (
    <div className={styles.sliderGroup}>
      <Typography variant="body1">
        {SERVO_NAMES[index]} ({SAFE_ANGLES[index][0]}-{SAFE_ANGLES[index][1]}):
      </Typography>
      <div className={styles.sliderWithValue}>
        <input
          type="range"
          min={SAFE_ANGLES[index][0]}
          max={SAFE_ANGLES[index][1]}
          value={angle}
          onChange={(e) => handleAngleChange(e.target.value)}
          className={styles.slider}
          disabled={disabled}
        />
        <Input
          type="number"
          min={SAFE_ANGLES[index][0].toString()}
          max={SAFE_ANGLES[index][1].toString()}
          value={angle.toString()}
          onChange={(e) => handleAngleChange(e.target.value)}
          style={{ width: '60px', textAlign: 'center' }}
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export { SAFE_ANGLES, SERVO_NAMES };
export default ServoControl;
