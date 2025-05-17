'use client';

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  ipAddress: "",
  connected: false,
  currentAngles: [90, 90, 90, 90, 90, 90],
  newAngles: [90, 90, 90, 90, 90, 90],
  moveTime: 1000,
  status: "",
  imageUrl: "",
  positionQueue: [],
  isLooping: false,
  isPlaying: false,
  currentQueueIndex: 0
};

export const robotSlice = createSlice({
  name: 'robot',
  initialState,
  reducers: {
    setIpAddress: (state, action) => {
      state.ipAddress = action.payload;
    },
    setConnectionStatus: (state, action) => {
      state.connected = action.payload;
    },
    setCurrentAngles: (state, action) => {
      state.currentAngles = action.payload;
    },
    setNewAngles: (state, action) => {
      state.newAngles = action.payload;
    },
    updateSingleAngle: (state, action) => {
      const { index, value } = action.payload;
      state.newAngles[index] = value;
    },
    setMoveTime: (state, action) => {
      state.moveTime = action.payload;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    setImageUrl: (state, action) => {
      state.imageUrl = action.payload;
    },
    resetState: () => initialState,
    updateConnectionData: (state, action) => {
      const { angles, status, imageUrl } = action.payload;
      state.currentAngles = angles;
      state.newAngles = [...angles];
      state.connected = true;
      state.status = status || "Connected successfully";
      state.imageUrl = imageUrl;
    },
    addPositionToQueue: (state) => {
      // Store position as an object with angles and time
      state.positionQueue.push({
        angles: [...state.currentAngles],
        time: state.moveTime
      });
      state.status = "Position added to queue";
    },
    updatePositionTime: (state, action) => {
      const { index, time } = action.payload;
      if (state.positionQueue[index]) {
        state.positionQueue[index].time = time;
      }
    },
    removePositionFromQueue: (state, action) => {
      state.positionQueue.splice(action.payload, 1);
      if (state.currentQueueIndex >= state.positionQueue.length) {
        state.currentQueueIndex = Math.max(0, state.positionQueue.length - 1);
      }
    },
    clearPositionQueue: (state) => {
      state.positionQueue = [];
      state.currentQueueIndex = 0;
      state.isPlaying = false;
    },
    setIsLooping: (state, action) => {
      state.isLooping = action.payload;
    },
    setIsPlaying: (state, action) => {
      state.isPlaying = action.payload;
      if (!action.payload) {
        state.currentQueueIndex = 0;
      }
    },
    setCurrentQueueIndex: (state, action) => {
      state.currentQueueIndex = action.payload;
    }
  }
});

export const {
  setIpAddress,
  setConnectionStatus,
  setCurrentAngles,
  setNewAngles,
  updateSingleAngle,
  setMoveTime,
  setStatus,
  setImageUrl,
  resetState,
  updateConnectionData,
  addPositionToQueue,
  updatePositionTime,
  removePositionFromQueue,
  clearPositionQueue,
  setIsLooping,
  setIsPlaying,
  setCurrentQueueIndex
} = robotSlice.actions;

export default robotSlice.reducer;
