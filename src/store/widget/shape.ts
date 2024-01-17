import { createSlice } from '@reduxjs/toolkit';

interface IShapeState {
  type: number;
}

const initialState: IShapeState = {
  type: 4
};

const shape = createSlice({
  name: 'defaultShape',
  initialState,
  reducers: {
    updateShapeType(state, { payload }) {
      state.type = payload;
    }
  },
});

export const { updateShapeType } = shape.actions;
export default shape.reducer;
