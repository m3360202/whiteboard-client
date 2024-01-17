//** Import Redux
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

interface DataParam {
  q?: string
  isLoad?: boolean

}

const handleLoading = createAsyncThunk('user/handleLoading', async () => {
  return true
})

//排序、获取未删除的board
function getFilterAndSortBoardList(boardList) {
  let newCurrentBoardList = [];
  let NoFavoriteBoardList = [];
  boardList.map((board) => {
    if (!board.deletedInfo && board.favoriteBoard) {
      newCurrentBoardList.push(board);
    }
    if (!board.deletedInfo && !board.favoriteBoard) {
      NoFavoriteBoardList.push(board);
    }
  });

  newCurrentBoardList.sort((a, b) => {
    if (a.favoriteBoard.favorite > b.favoriteBoard.favorite) return -1;
    if (a.favoriteBoard.favorite < b.favoriteBoard.favorite) return 1;
    return 0;
  });
  return [...newCurrentBoardList, ...NoFavoriteBoardList];
}

//** Create userSlice
export const boardListSlice = createSlice({
  name: 'boardList',
  initialState: {
    keyword: '',
    boardList: [],
    currentBoardList: [],
    favoriteBoardList: [],
    inFavoriteBoardPage: true,
    pendingDeleteBoardList: [],
    searchBoardList:[]
  },
  reducers: {
    handleSetBoardList(state, action) {
      const newBoardList = getFilterAndSortBoardList(action.payload);
      state.boardList = newBoardList;
    },
    handleSetCurrentBoardList(state, action) {
      const newBoardList = getFilterAndSortBoardList(action.payload);
      state.currentBoardList = newBoardList;
    },
    handleSetFavoriteBoardList(state, action) {
      state.favoriteBoardList = action.payload;
    },
    handleSetInFavoriteBoardPage(state, action){
      state.inFavoriteBoardPage = action.payload;
    },
    handleSetPendingDeleteBoardList(state, action) {
      state.pendingDeleteBoardList = action.payload;
    },
    handleSetKeyword(state, action) {
      state.keyword = action.payload;
    },
    handleSetSearchBoardList(state, action) {
      state.searchBoardList = action.payload
    },
  },
  //extraReducers: builder => {
  //builder.addCase(userLogin.fulfilled, (state, action) => {
  //  state.userInfo = action.payload
  //})
  //}
});

export const {
  handleSetBoardList,
  handleSetCurrentBoardList,
  handleSetFavoriteBoardList,
  handleSetInFavoriteBoardPage,
  handleSetKeyword,
  handleSetSearchBoardList,
  handleSetPendingDeleteBoardList,
} = boardListSlice.actions;
export default boardListSlice;