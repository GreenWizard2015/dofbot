"use client";

import React from "react";
import { useSafePositionQueue } from "../../api/PositionQueueContext";
import PositionQueue from "./PositionQueue";
import { Card, Typography } from "../ui";
import styles from "../../app/page.module.css";

/**
 * A wrapper component that safely renders the PositionQueue component
 * only when the PositionQueueContext is available
 */
const SafePositionQueue = () => {
  // Use the safe version of the hook that doesn't throw an error
  const positionQueueContext = useSafePositionQueue();

  // If the context is not available, render a placeholder
  if (!positionQueueContext) {
    return (
      <Card className={styles.positionQueue}>
        <Typography variant="h3">Position Queue</Typography>
        <Typography variant="body2" style={{ textAlign: 'center', marginTop: '10px' }}>
          Position queue is not available
        </Typography>
      </Card>
    );
  }

  // If the context is available, render the actual PositionQueue component
  return <PositionQueue />;
};

export default SafePositionQueue;
