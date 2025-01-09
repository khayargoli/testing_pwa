// recordingSlice.js
import { createSlice } from '@reduxjs/toolkit';

const recordingSlice = createSlice({
  name: 'recording',
  initialState: {
    reaction: false,
    recordingData: null,
  },
  reducers: {
    setReaction: (state, action) => {
      state.reaction = action.payload;
    },
    setRecordingData: (state, action) => {
      state.recordingData = action.payload;
    },
  },
});

export const { setReaction, setRecordingData } = recordingSlice.actions;
export default recordingSlice.reducer;
