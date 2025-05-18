"use client";

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setNewAngles } from "../../redux/slices/robotSlice";
import { usePositionQueue } from "../../api/PositionQueueContext";
import styles from "../../app/page.module.css";
import { Button, Typography, Card } from "../ui";

const PositionQueue = () => {
  const dispatch = useDispatch();

  // Get the position queue context
  const {
    positionQueue,
    isLooping,
    isPlaying,
    currentQueueIndex,
    manager,
    playPosition
  } = usePositionQueue();

  // We still need to access currentAngles and moveTime from Redux
  const { currentAngles, moveTime } = useSelector((state) => state.robot);

  const handleAddPosition = () => {
    manager.addPositionToQueue(currentAngles, moveTime);
  };

  const handleRemovePosition = (index) => {
    manager.removePositionFromQueue(index);
  };

  const handleClearQueue = () => {
    manager.clearPositionQueue();
  };

  const handleLoopToggle = (e) => {
    manager.setIsLooping(e.target.checked);
  };

  const handlePlayToggle = () => {
    console.log("Play/Stop button clicked, current state:", { isPlaying, queueLength: positionQueue.length });

    if (isPlaying) {
      console.log("Stopping playback");
      // When stopping, immediately set isPlaying to false to stop the recursion
      manager.setIsPlaying(false);
    } else {
      if (positionQueue.length > 0) {
        // Start from the first position
        const position = positionQueue[0];

        // Check if position is a valid object with angles array
        if (!position || !position.angles || !Array.isArray(position.angles)) {
          console.error("Invalid position format:", position);
          return;
        }

        console.log("Starting playback from position:", position);

        // First set the current queue index to ensure we start from the beginning
        manager.setCurrentQueueIndex(0);

        // Then set isPlaying to true
        manager.setIsPlaying(true);

        // Add a small delay to ensure the state is updated before calling playPosition
        setTimeout(() => {
          console.log("Calling playPosition after delay");
          playPosition(position);
        }, 100);
      } else {
        console.log("Cannot play: Queue is empty");
      }
    }
  };

  const handleSelectPosition = (index) => {
    const position = positionQueue[index];

    // Check if position is a valid object with angles array
    if (!position || !position.angles || !Array.isArray(position.angles)) {
      return;
    }

    // We still need to use Redux for this since it affects the servo controls
    dispatch(setNewAngles(position.angles));
  };

  const handleTimeChange = (index, newTime) => {
    // Ensure time is a valid number and within reasonable limits
    const time = Math.max(100, Math.min(5000, parseInt(newTime) || 1000));
    manager.updatePositionTime(index, time);
  };

  // We don't need to define playPosition here as we're using the one from the context

  return (
    <Card className={styles.positionQueue}>
      <Typography variant="h3">Position Queue</Typography>

      <div className={styles.queueControls}>
        <Button
          variant="secondary"
          size="small"
          onClick={handleAddPosition}
          disabled={isPlaying}
        >
          Add Current Position
        </Button>
        <Button
          variant="danger"
          size="small"
          onClick={handleClearQueue}
          disabled={isPlaying || positionQueue.length === 0}
        >
          Clear Queue
        </Button>
      </div>

      <div className={styles.loopControl}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={isLooping}
            onChange={handleLoopToggle}
            disabled={isPlaying}
            className={styles.checkbox}
          />
          <span>Loop Playback</span>
        </label>
      </div>

      <div className={styles.playControl}>
        <Button
          variant={isPlaying ? "danger" : "primary"}
          onClick={handlePlayToggle}
          disabled={positionQueue.length === 0}
          style={{ width: '100%' }}
        >
          {isPlaying ? "Stop" : "Play Queue"}
        </Button>
      </div>

      {positionQueue.length > 0 ? (
        <div className={styles.queueList}>
          {positionQueue.map((position, index) => (
            <div
              key={index}
              className={`${styles.queueItem} ${currentQueueIndex === index && isPlaying ? styles.activeQueueItem : ''}`}
            >
              <div className={styles.queueItemContent} onClick={() => handleSelectPosition(index)}>
                <Typography variant="body2">
                  Position {index + 1}: [{position && position.angles && Array.isArray(position.angles)
                    ? position.angles.join(', ')
                    : 'Invalid position'}]
                </Typography>
                <div className={styles.queueItemTime}>
                  <span>Time:</span>
                  <input
                    type="number"
                    min="100"
                    max="5000"
                    step="100"
                    value={position && position.time ? position.time : 1000}
                    onChange={(e) => handleTimeChange(index, e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    disabled={isPlaying}
                    className={styles.timeInput}
                  />
                  <span>ms</span>
                </div>
              </div>
              <Button
                variant="danger"
                size="small"
                onClick={() => handleRemovePosition(index)}
                disabled={isPlaying}
                style={{ padding: '2px 6px', fontSize: '10px' }}
              >
                ✕
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <Typography variant="body2" style={{ textAlign: 'center', marginTop: '10px' }}>
          No positions in queue
        </Typography>
      )}
    </Card>
  );
};

export default PositionQueue;
