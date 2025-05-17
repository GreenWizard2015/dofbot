"use client";

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addPositionToQueue,
  removePositionFromQueue,
  clearPositionQueue,
  setIsLooping,
  setIsPlaying,
  setCurrentQueueIndex,
  setNewAngles,
  setStatus,
  updatePositionTime
} from "../../redux/slices/robotSlice";
import styles from "../../app/page.module.css";
import { Button, Typography, Card } from "../ui";

const PositionQueue = ({ onPlayPosition }) => {
  const dispatch = useDispatch();
  const {
    positionQueue,
    isLooping,
    isPlaying,
    currentQueueIndex
  } = useSelector((state) => state.robot);

  const handleAddPosition = () => {
    dispatch(addPositionToQueue());
  };

  const handleRemovePosition = (index) => {
    dispatch(removePositionFromQueue(index));
  };

  const handleClearQueue = () => {
    dispatch(clearPositionQueue());
  };

  const handleLoopToggle = (e) => {
    dispatch(setIsLooping(e.target.checked));
  };

  const handlePlayToggle = () => {
    if (isPlaying) {
      dispatch(setIsPlaying(false));
    } else {
      if (positionQueue.length > 0) {
        const position = positionQueue[0];

        // Check if position is a valid object with angles array
        if (!position || !position.angles || !Array.isArray(position.angles)) {
          dispatch(setStatus("Error: Invalid position format in queue"));
          return;
        }

        // First set the current queue index to ensure we start from the beginning
        dispatch(setCurrentQueueIndex(0));

        // Then set isPlaying to true
        dispatch(setIsPlaying(true));

        // Add a small delay to ensure the Redux state is updated before calling onPlayPosition
        setTimeout(() => {
          onPlayPosition(position);
        }, 100);
      }
    }
  };

  const handleSelectPosition = (index) => {
    const position = positionQueue[index];

    // Check if position is a valid object with angles array
    if (!position || !position.angles || !Array.isArray(position.angles)) {
      dispatch(setStatus("Error: Invalid position format in queue"));
      return;
    }

    dispatch(setNewAngles(position.angles));
  };

  const handleTimeChange = (index, newTime) => {
    // Ensure time is a valid number and within reasonable limits
    const time = Math.max(100, Math.min(5000, parseInt(newTime) || 1000));
    dispatch(updatePositionTime({ index, time }));
  };

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
