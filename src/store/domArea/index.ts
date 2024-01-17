import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const domAreaSlice = createSlice({
  name: 'domArea',
  initialState: {
    isDomArea: false,

    aiToolBar: false,
    lexical: false,
    lexicalSelection: false,
  },
  reducers: {
    handleSetLexical(state, action) {
      state.lexical = action.payload;
    },
    handleSetLexicalSelection(state, action) {
      state.lexicalSelection = action.payload;
    },
    handleSetIsDomArea(state, action) {
      state.isDomArea = action.payload;
    },
    handleSetAiToolBar(state, action) {
      state.aiToolBar = action.payload;
    }
  },
});

export const {
  handleSetLexical,
  handleSetLexicalSelection,
  handleSetIsDomArea,
  handleSetAiToolBar
} = domAreaSlice.actions;
export default domAreaSlice;
