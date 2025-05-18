"use client";

/**
 * Class to manage the position queue state
 * This replaces the Redux state management for the position queue
 */
class PositionQueueManager {
  /**
   * Create a new PositionQueueManager
   * @param {Object} callbacks - Callback functions for state updates
   * @param {Function} callbacks.onStatusChange - Called when status changes
   * @param {Function} callbacks.onQueueChange - Called when the queue changes
   * @param {Function} callbacks.onIsLoopingChange - Called when isLooping changes
   * @param {Function} callbacks.onIsPlayingChange - Called when isPlaying changes
   * @param {Function} callbacks.onCurrentQueueIndexChange - Called when currentQueueIndex changes
   */
  constructor(callbacks = {}) {
    this.callbacks = {
      onStatusChange: callbacks.onStatusChange || (() => {}),
      onQueueChange: callbacks.onQueueChange || (() => {}),
      onIsLoopingChange: callbacks.onIsLoopingChange || (() => {}),
      onIsPlayingChange: callbacks.onIsPlayingChange || (() => {}),
      onCurrentQueueIndexChange: callbacks.onCurrentQueueIndexChange || (() => {})
    };

    // Initialize state
    this.positionQueue = [];
    this.isLooping = false;
    this.isPlaying = false;
    this.currentQueueIndex = 0;
  }

  /**
   * Add a position to the queue
   * @param {Array<number>} angles - The angles to add
   * @param {number} time - The move time in milliseconds
   */
  addPositionToQueue(angles, time) {
    if (!Array.isArray(angles)) {
      console.error("Cannot add position: angles is not an array");
      this.callbacks.onStatusChange("Error: Invalid angles format");
      return;
    }

    // Store position as an object with angles and time
    this.positionQueue.push({
      angles: [...angles],
      time: time
    });

    this.callbacks.onStatusChange("Position added to queue");
    this.callbacks.onQueueChange(this.positionQueue);
  }

  /**
   * Update the time for a position in the queue
   * @param {number} index - The index of the position to update
   * @param {number} time - The new move time in milliseconds
   */
  updatePositionTime(index, time) {
    if (this.positionQueue[index]) {
      this.positionQueue[index].time = time;
      this.callbacks.onQueueChange(this.positionQueue);
    }
  }

  /**
   * Remove a position from the queue
   * @param {number} index - The index of the position to remove
   */
  removePositionFromQueue(index) {
    this.positionQueue.splice(index, 1);
    
    // Adjust currentQueueIndex if needed
    if (this.currentQueueIndex >= this.positionQueue.length) {
      this.currentQueueIndex = Math.max(0, this.positionQueue.length - 1);
      this.callbacks.onCurrentQueueIndexChange(this.currentQueueIndex);
    }
    
    this.callbacks.onQueueChange(this.positionQueue);
  }

  /**
   * Clear the position queue
   */
  clearPositionQueue() {
    this.positionQueue = [];
    this.currentQueueIndex = 0;
    this.isPlaying = false;
    
    this.callbacks.onQueueChange(this.positionQueue);
    this.callbacks.onCurrentQueueIndexChange(this.currentQueueIndex);
    this.callbacks.onIsPlayingChange(this.isPlaying);
  }

  /**
   * Set the looping state
   * @param {boolean} isLooping - Whether to loop the queue
   */
  setIsLooping(isLooping) {
    this.isLooping = isLooping;
    this.callbacks.onIsLoopingChange(this.isLooping);
  }

  /**
   * Set the playing state
   * @param {boolean} isPlaying - Whether the queue is playing
   */
  setIsPlaying(isPlaying) {
    this.isPlaying = isPlaying;
    
    // Reset index when stopping
    if (!isPlaying) {
      this.currentQueueIndex = 0;
      this.callbacks.onCurrentQueueIndexChange(this.currentQueueIndex);
    }
    
    this.callbacks.onIsPlayingChange(this.isPlaying);
  }

  /**
   * Set the current queue index
   * @param {number} index - The new index
   */
  setCurrentQueueIndex(index) {
    this.currentQueueIndex = index;
    this.callbacks.onCurrentQueueIndexChange(this.currentQueueIndex);
  }

  /**
   * Get the current position in the queue
   * @returns {Object|null} The current position or null if queue is empty
   */
  getCurrentPosition() {
    if (this.positionQueue.length === 0) {
      return null;
    }
    return this.positionQueue[this.currentQueueIndex];
  }

  /**
   * Get the next position in the queue
   * @returns {Object|null} The next position or null if at the end of the queue and not looping
   */
  getNextPosition() {
    if (this.positionQueue.length === 0) {
      return null;
    }

    let nextIndex = this.currentQueueIndex + 1;
    
    // Check if we've reached the end of the queue
    if (nextIndex >= this.positionQueue.length) {
      if (this.isLooping) {
        // If looping is enabled, go back to the beginning
        nextIndex = 0;
      } else {
        // If not looping, return null
        return null;
      }
    }
    
    return this.positionQueue[nextIndex];
  }
}

export default PositionQueueManager;
