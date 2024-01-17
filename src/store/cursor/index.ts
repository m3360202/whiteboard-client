//** Import Redux
import { createSlice } from '@reduxjs/toolkit'
//comment cursor
 
//** Create sliderSlice
export const cursorSlice = createSlice({
  name: 'cursor',
  initialState: {
    commentcursor: false,
    tutorialcursor: false,
    slidecursor: false,
    marginRightTop: '0px',
    marginRightBottom: '0px',

  },
  reducers: {
    handleOpenCommentcursor(state, action) {
      state.commentcursor = true
      state.tutorialcursor = false
      state.slidecursor = false
      state.marginRightTop = '365px'
      state.marginRightBottom = '455px'
    },
    handleOpenTutorialcursor(state, action) {
      state.commentcursor = false
      state.slidecursor = false
      state.tutorialcursor = true
      state.marginRightTop = '0px'
      state.marginRightBottom = '0px'
    },
    handleOpenSlidecursor(state, action) {
      state.commentcursor = false
      state.slidecursor = true
      state.tutorialcursor = false
      state.marginRightTop = '0px'
      state.marginRightBottom = '0px'
    }

  },

})

export const { handleOpenCommentcursor, handleOpenTutorialcursor, handleOpenSlidecursor } = cursorSlice.actions
export default cursorSlice;