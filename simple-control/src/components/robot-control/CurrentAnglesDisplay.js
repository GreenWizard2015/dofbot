"use client";

import React from "react";
import { useSelector } from "react-redux";
import styles from "../../app/page.module.css";
import { Button, Typography } from "../ui";

const CurrentAnglesDisplay = ({ onRefresh }) => {
  const { currentAngles } = useSelector((state) => state.robot);

  return (
    <div className={styles.currentAngles}>
      <Typography variant="h3">Current Angles</Typography>
      <Typography variant="body1">{currentAngles.join(', ')}</Typography>
      <Button
        variant="primary"
        size="small"
        onClick={onRefresh}
        style={{ alignSelf: 'flex-start' }}
      >
        Refresh
      </Button>
    </div>
  );
};

export default CurrentAnglesDisplay;
