"use client";

import React from "react";
import styles from "../../app/page.module.css";
import { Button } from "../ui";

const ControlButtons = ({ onMove, onHome, disabled = false }) => {
  const handleMoveClick = (e) => {
    e.preventDefault();
    console.log("Move Servos button clicked");
    if (typeof onMove === 'function') {
      onMove();
    } else {
      console.error("onMove is not a function:", onMove);
    }
  };

  const handleHomeClick = (e) => {
    e.preventDefault();
    console.log("Home Position button clicked");
    if (typeof onHome === 'function') {
      onHome();
    } else {
      console.error("onHome is not a function:", onHome);
    }
  };

  return (
    <div className={styles.buttonGroup}>
      <Button
        variant="secondary"
        onClick={handleMoveClick}
        style={{ flex: 1 }}
        disabled={disabled}
      >
        Move Servos
      </Button>
      <Button
        variant="danger"
        onClick={handleHomeClick}
        style={{ flex: 1 }}
        disabled={disabled}
      >
        Home Position
      </Button>
    </div>
  );
};

export default ControlButtons;
