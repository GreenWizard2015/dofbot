"use client";

/**
 * DofbotApi class for handling all API communication with the Dofbot robot
 * @typedef {Object} DofbotApi
 * @property {Function} connectToRobot - Connect to the robot
 * @property {Function} refreshAngles - Refresh the current angles
 * @property {Function} moveToHome - Move to home position
 * @property {Function} setAngles - Set the robot angles
 * @property {Function} cleanup - Clean up resources
 * @property {number} moveTime - The move time in milliseconds
 * @property {Array<number>} currentAngles - The current angles of the robot
 * @property {Array<number>} newAngles - The new angles to set
 */
class DofbotApi {
  /**
   * Create a new DofbotApi instance
   * @param {string} ipAddress - The IP address of the Dofbot robot
   * @param {Object} callbacks - Callback functions for state updates
   */
  constructor(ipAddress = null, callbacks = {}) {
    console.log("DofbotApi constructor called with ipAddress:", ipAddress);
    this.ipAddress = ipAddress;
    this.callbacks = {
      onStatusChange: callbacks.onStatusChange || (() => {}),
      onAnglesChange: callbacks.onAnglesChange || (() => {}),
      onNewAnglesChange: callbacks.onNewAnglesChange || (() => {}),
      onConnectionChange: callbacks.onConnectionChange || (() => {}),
      onImageUrlChange: callbacks.onImageUrlChange || (() => {}),
      onConnectionDataChange: callbacks.onConnectionDataChange || (() => {}),
      onQueueIndexChange: callbacks.onQueueIndexChange || (() => {}),
      onPlayingChange: callbacks.onPlayingChange || (() => {})
    };
    this.isMounted = true;
    this.connected = false;
    this.currentAngles = [90, 90, 90, 90, 90, 90];
    this.newAngles = [90, 90, 90, 90, 90, 90];
    this.moveTime = 1000;

    // If we have an IP address, we should try to connect automatically
    if (ipAddress) {
      console.log("DofbotApi: IP address provided, will attempt to connect");
      // Use setTimeout to ensure the constructor completes before attempting to connect
      setTimeout(() => {
        if (this.isMounted) {
          this.connectToRobot();
        }
      }, 100);
    }
  }

  /**
   * Clean up resources when the API is no longer needed
   */
  cleanup() {
    this.isMounted = false;
  }

  /**
   * Connect to the robot
   * @param {string} ipAddressOverride - Optional IP address to override the instance's IP
   * @returns {Promise<void>}
   */
  async connectToRobot(ipAddressOverride = null) {
    console.log("connectToRobot called, current IP:", this.ipAddress, "override:", ipAddressOverride);

    // Use override if provided
    if (ipAddressOverride) {
      console.log("Using IP address override:", ipAddressOverride);
      this.ipAddress = ipAddressOverride;
    }

    if (!this.ipAddress) {
      const status = "Please enter an IP address";
      console.warn(status);
      this.callbacks.onStatusChange(status);
      return;
    }

    try {
      const connectingStatus = "Connecting...";
      this.callbacks.onStatusChange(connectingStatus);
      console.log("Attempting to connect to:", `http://${this.ipAddress}:5000/angles`);

      const response = await fetch(`http://${this.ipAddress}:5000/angles`);
      console.log("Connection response status:", response.status);

      if (!response.ok) {
        throw new Error(`Failed to connect: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Connection response data:", data);
      this.currentAngles = data.angles;
      this.newAngles = [...data.angles];
      this.connected = true;

      const connectionData = {
        angles: data.angles,
        status: "Connected successfully",
        imageUrl: `http://${this.ipAddress}:5000/image`
      };

      console.log("Connection successful, setting connected state to true");

      // Call callbacks
      this.callbacks.onStatusChange(connectionData.status);
      this.callbacks.onAnglesChange(data.angles);
      this.callbacks.onNewAnglesChange([...data.angles]);
      this.callbacks.onConnectionChange(true);
      this.callbacks.onImageUrlChange(connectionData.imageUrl);
      this.callbacks.onConnectionDataChange(connectionData);

      return true;
    } catch (error) {
      console.error("Error in connectToRobot:", error);
      const errorStatus = `Error: ${error.message}`;
      this.connected = false;
      this.callbacks.onStatusChange(errorStatus);
      this.callbacks.onConnectionChange(false);
      return false;
    }
  }

  /**
   * Refresh the current angles from the robot
   * @returns {Promise<void>}
   */
  async refreshAngles() {
    console.log("refreshAngles called, connected:", this.connected, "ipAddress:", this.ipAddress);
    if (!this.connected || !this.ipAddress) {
      console.warn("Cannot refresh angles: not connected or no IP address");
      return;
    }

    try {
      console.log("Fetching from:", `http://${this.ipAddress}:5000/angles`);
      const response = await fetch(`http://${this.ipAddress}:5000/angles`);
      console.log("Refresh angles response status:", response.status);

      if (!response.ok) {
        throw new Error(`Failed to get angles: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Refresh angles response data:", data);
      this.currentAngles = data.angles;
      this.callbacks.onAnglesChange(data.angles);
    } catch (error) {
      console.error("Error in refreshAngles:", error);
      const errorStatus = `Error refreshing angles: ${error.message}`;
      this.callbacks.onStatusChange(errorStatus);
    }
  }

  /**
   * Move the robot to the home position
   * @returns {Promise<void>}
   */
  async moveToHome() {
    console.log("moveToHome called, connected:", this.connected, "ipAddress:", this.ipAddress);
    if (!this.connected || !this.ipAddress) {
      console.warn("Cannot move to home: not connected or no IP address");
      return;
    }

    try {
      const movingStatus = "Moving to home position...";
      this.callbacks.onStatusChange(movingStatus);
      console.log("Fetching from:", `http://${this.ipAddress}:5000/home`);

      const response = await fetch(`http://${this.ipAddress}:5000/home`);
      console.log("Home position response status:", response.status);

      if (!response.ok) {
        throw new Error(`Failed to move to home: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Home position response data:", data);
      this.currentAngles = data.angles;
      this.newAngles = [...data.angles];

      const completedStatus = "Moved to home position";
      this.callbacks.onStatusChange(completedStatus);
      this.callbacks.onAnglesChange(data.angles);
      this.callbacks.onNewAnglesChange([...data.angles]);
    } catch (error) {
      console.error("Error in moveToHome:", error);
      const errorStatus = `Error moving to home: ${error.message}`;
      this.callbacks.onStatusChange(errorStatus);
    }
  }

  /**
   * Set the robot angles
   * @param {Array<number>} customAngles Optional custom angles to set
   * @param {number} customTime Optional custom move time
   * @returns {Promise<boolean>} Whether the operation was successful
   */
  async setAngles(customAngles = null, customTime = null) {
    console.log("setAngles called, connected:", this.connected, "ipAddress:", this.ipAddress);
    console.log("customAngles:", customAngles, "customTime:", customTime);

    if (!this.connected || !this.ipAddress) {
      console.warn("Cannot set angles: not connected or no IP address");
      return false;
    }

    try {
      const movingStatus = "Moving servos...";
      this.callbacks.onStatusChange(movingStatus);

      // Use provided angles or instance's newAngles
      const angles = customAngles || this.newAngles;
      console.log("Using angles:", angles);

      if (!Array.isArray(angles)) {
        throw new Error("angles is not an array");
      }

      // Use custom time if provided, otherwise use instance's moveTime
      const time = customTime || this.moveTime;
      console.log("Using move time:", time);

      const anglesStr = angles.join(',');
      const url = `http://${this.ipAddress}:5000/set_angles?angles=${anglesStr}&t=${time}`;
      console.log("Fetching from:", url);

      const response = await fetch(url);
      console.log("Set angles response status:", response.status);

      if (!response.ok) {
        throw new Error(`Failed to set angles: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Set angles response data:", data);
      this.currentAngles = data.angles;

      const completedStatus = "Movement completed";
      this.callbacks.onStatusChange(completedStatus);
      this.callbacks.onAnglesChange(data.angles);
      return true;
    } catch (error) {
      console.error("Error in setAngles:", error);
      const errorStatus = `Error setting angles: ${error.message}`;
      this.callbacks.onStatusChange(errorStatus);
      return false;
    }
  }
}

export default DofbotApi;
