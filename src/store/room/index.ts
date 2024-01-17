import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

//functions
function getNewMemberByRole(memberList, userId, role) {
  let newMemberList = [];
  memberList.map((item) => {
    if (item._id === userId) {
      item = { ...item, 'role': role }
    }
    newMemberList.push(item);
  })
  return newMemberList;
}

function delMemberFromList(memberList, userId) {
  let newMemberList = [];
  memberList.map((item) => {
    if (item._id !== userId) {
      newMemberList.push(item);
    }
  });
  return newMemberList;
}

function sortRoomMemberList(memberList) {
  memberList.sort((v1, v2) =>
    v1.name.toLowerCase() > v2.name.toLowerCase()
      ? 1
      : v1.name.toLowerCase() < v2.name.toLowerCase()
      ? -1
      : 0,
  );
  return memberList;
}

export const roomSlice = createSlice({
  name: 'room',
  initialState: {
    roomId: '',
    roomInfo: {
      roomId: '',
      name: '',
      role: '',
    },
    currentRoomName: '',
    currentRoomList: [],
    roomMemberList: [],
    roomList: [],
    currentRoomAllData: null,
    inRoom: true,
    currentFilterBoardListOptions: '',
    currentSortBoardListOptions: '',
  },
  reducers: {
    handleSetRoomId(state, action) {
      if(action.payload  && action.payload !== state.roomId && action.payload !== '' )
      state.roomId = action.payload;
    },
    handleInitRoom(state, action) {
      // state.currentRoomId = '',
      state.currentRoomList = [];
      state.roomList = [];
      state.currentRoomName = '';
      state.currentFilterBoardListOptions = 'ownedByAnyone';
      state.currentSortBoardListOptions = 'lastEdited';
    },
    handleSetRoomInfo(state, action) {
      const roomInfo = action.payload;
      state.roomInfo.name = roomInfo.name;
      state.roomInfo.roomId = roomInfo.roomId;
      state.roomInfo.role = roomInfo.role;
    },
    handleSetRoomList(state, action) {
      state.roomList = action.payload;
    },
    handleSetCurrentRoomName(state, action) {
      state.currentRoomName = action.payload;
    },
    handleSetCurrentRoomAllData(state, action) {
      state.currentRoomAllData = action.payload;
    },
    handleSetRoomMemberList(state, action) {
      const newRoomMemberList = sortRoomMemberList(action.payload);
      state.roomMemberList = newRoomMemberList;
    },
    handleSetInRoom(state, action) {
      state.inRoom = action.payload;
    },
    handleSetCurrentRoomList(state, action) {
      const roomlist = action.payload;
      state.currentRoomList = roomlist;
    },
    handleSetCurrentFilterBoardListOptions(state, action) {
      state.currentFilterBoardListOptions = action.payload;
    },
    handleSetCurrentSortBoardListOptions(state, action) {
      state.currentSortBoardListOptions = action.payload;
    },
    handleSetRoomMemberRole(state, action) {
      const newMemberList = getNewMemberByRole(
        state.roomMemberList,
        action.payload.userId,
        action.payload.role,
      );
      state.roomMemberList = newMemberList;
    },
    handleDelMemberFromList(state, action) {
      const newMemberList = delMemberFromList(
        state.roomMemberList,
        action.payload.userId,
      );
      state.roomMemberList = newMemberList;
    },
  },
});

export const {
  handleInitRoom,
  handleSetInRoom,
  handleSetRoomInfo,
  handleSetRoomList,
  handleSetCurrentRoomAllData,
  handleSetCurrentRoomName,
  handleSetRoomMemberList,
  handleSetCurrentRoomList,
  handleSetCurrentFilterBoardListOptions,
  handleSetCurrentSortBoardListOptions,
  handleSetRoomMemberRole,
  handleDelMemberFromList,
  handleSetRoomId,
} = roomSlice.actions;
export default roomSlice;
