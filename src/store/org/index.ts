import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

function getNewMemberByRole(memberList, userId, role) {
  let newMemberList = [];
  memberList.map((item) => {
    if (item.userId === userId) {
      item = { ...item, role: role };
    }
    newMemberList.push(item);
  });
  return newMemberList;
}

function sortOrgMemberList(memberList) {
  memberList.sort((v1, v2) => {
    return ('' + v1.username).localeCompare(v2.username);
  });
  return memberList;
}

export const orgSlice = createSlice({
  name: 'org',
  initialState: {
    orgInfo: {
      name: '',
      orgId: '',
      role: '',
      ghostUrl: '',
      ghostKey: ''
    },
    orgList: [],
    orgMemberList: [],
    currentOrgName: '',
    currentOrgList: [],
    teamsManagementTabPanel: '1',
  },
  reducers: {
    handleSetCurrentOrgList(state, action) {
      state.currentOrgList = action.payload;
    },
    handleChangeCurrentOrgName(state, action) {
      state.currentOrgName = action.payload;
    },
    initializeOrgByLocalstorage(state, action) {
      const orgInfo = action.payload;
      state.orgInfo.name = orgInfo.name;
      state.orgInfo.orgId = orgInfo.orgId;
      state.orgInfo.role = orgInfo.role;
    },
    handleSetOrgList(state, action) {
      state.orgList = action.payload;
    },
    handleSetOrgInfo(state, action) {
      const orgInfo = action.payload;
      state.orgInfo.name = orgInfo.name;
      state.orgInfo.orgId = orgInfo.orgId;
      state.orgInfo.role = orgInfo.role;
      state.orgInfo.ghostUrl = orgInfo.ghostUrl;
      state.orgInfo.ghostKey = orgInfo.ghostKey;
    },
    handleSetOrgMemberList(state, action) {
      const newOrgMemberList = sortOrgMemberList(action.payload);
      state.orgMemberList = newOrgMemberList;
    },
    handleSetOrgMemberRole(state, action) {
      const newMemberList = getNewMemberByRole(
        state.orgMemberList,
        action.payload.userId,
        action.payload.role
      );
      state.orgMemberList = newMemberList;
    },
    handleSetGhost(state, action) {
      const orgInfo = action.payload;
      state.orgInfo.ghostUrl = orgInfo.ghostUrl;
      state.orgInfo.ghostKey = orgInfo.ghostKey;
    },
    handleSetTeamsManagementTabPanel(state, action) {
      state.teamsManagementTabPanel = action.payload;
    }
  }
});

export const {
  handleSetOrgList,
  handleSetOrgInfo,
  handleSetOrgMemberList,
  handleSetOrgMemberRole,
  handleChangeCurrentOrgName,
  handleSetGhost,
  handleSetTeamsManagementTabPanel
} = orgSlice.actions;
export default orgSlice;
