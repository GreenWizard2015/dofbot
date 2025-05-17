"use client";

import React from "react";
import styles from "../../app/page.module.css";
import { Button } from "../ui";

const ControlButtons = ({ onMove, onHome, disabled = false }) => {
  return (
    <div className={styles.buttonGroup}>
      <Button
        variant="secondary"
        onClick={(e) => {
          e.preventDefault();
          onMove();
        }}
        style={{ flex: 1 }}
        disabled={disabled}
      >
        Move Servos
      </Button>
      <Button
        variant="danger"
        onClick={(e) => {
          e.preventDefault();
          onHome();
        }}
        style={{ flex: 1 }}
        disabled={disabled}
      >
        Home Position
      </Button>
    </div>
  );
};

export default ControlButtons;
