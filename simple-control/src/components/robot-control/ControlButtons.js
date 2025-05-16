"use client";

import React from "react";
import styles from "../../app/page.module.css";
import { Button } from "../ui";

const ControlButtons = ({ onMove, onHome }) => {
  return (
    <div className={styles.buttonGroup}>
      <Button
        variant="secondary"
        onClick={onMove}
        style={{ flex: 1 }}
      >
        Move Servos
      </Button>
      <Button
        variant="danger"
        onClick={onHome}
        style={{ flex: 1 }}
      >
        Home Position
      </Button>
    </div>
  );
};

export default ControlButtons;
