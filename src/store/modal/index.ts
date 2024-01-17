import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const modalSlice = createSlice({
  name: 'modal',
  initialState: {
    interactionMode:'',
  },
  reducers: {
    // handleSetStateList(state, action) {
    //   state.backupList = action.payload
    // },
    handleSetInteractionMode(state, action) {
        state.interactionMode = action.payload
      },
  },
});

export const { 
  // handleSetStateList,
  handleSetInteractionMode,
} = modalSlice.actions;
export default modalSlice;
