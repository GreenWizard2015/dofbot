"use client";

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setMoveTime } from "../../redux/slices/robotSlice";
import styles from "../../app/page.module.css";
import { Typography, Input } from "../ui";

const MoveTimeControl = ({ disabled = false }) => {
  const dispatch = useDispatch();
  const { moveTime } = useSelector((state) => state.robot);

  const handleMoveTimeChange = (value) => {
    if (disabled) return;
    dispatch(setMoveTime(parseInt(value)));
  };

  return (
    <div className={styles.sliderGroup}>
      <Typography variant="body1">Movement Time (ms):</Typography>
      <div className={styles.sliderWithValue}>
        <input
          type="range"
          min="100"
          max="5000"
          step="100"
          value={moveTime}
          onChange={(e) => handleMoveTimeChange(e.target.value)}
          className={styles.slider}
          disabled={disabled}
        />
        <Input
          type="number"
          min="100"
          max="5000"
          step="100"
          value={moveTime.toString()}
          onChange={(e) => handleMoveTimeChange(e.target.value)}
          style={{ width: '60px', textAlign: 'center' }}
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default MoveTimeControl;
