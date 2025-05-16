'use client';

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  ipAddress: "",
  connected: false,
  currentAngles: [90, 90, 90, 90, 90, 90],
  newAngles: [90, 90, 90, 90, 90, 90],
  moveTime: 1000,
  status: "",
  imageUrl: ""
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
  updateConnectionData
} = robotSlice.actions;

export default robotSlice.reducer;
