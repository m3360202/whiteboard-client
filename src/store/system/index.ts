//** Import Redux
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'



//** Create systemSlice
export const systemSlice = createSlice({
  name: 'system',
  initialState: {
    showBoardTutorial: false,
    connectionStatus:false,
    currentUIType:'',
    isFireFox:false,
    isSafari:false,
    isEdge:false,
    isChrome:false,
    isMac:false,
    eventFlag:false,
    settings:null,
    keyCommand:null,
    localConnection:'disconnected',
    initDone:false,
    addOnlineUser:false
  },
  reducers: {
    handleSetInitDone(state, action) {
      state.initDone = action.payload
    },
    handleSetShowBoardTutorial(state, action) {
      state.showBoardTutorial = action.payload
    },
    handleSetConnectionStatus(state, action) {
      state.connectionStatus = action.payload
    },
    handleSetCurrentUIType(state, action) {
      state.currentUIType = action.payload
    },
    handleSetEventFlag(state, action) {
      state.eventFlag = action.payload
    },
    handleSetSettings(state, action) {
      state.settings = action.payload
    },
    handleSetKeyCommand(state, action) {
      state.keyCommand = action.payload
    },
    handleSetLocalConnection(state, action) {
      state.localConnection = action.payload
    },
    handleAddOnlineUser(state, action) {
      state.addOnlineUser = action.payload
    },
  },
})

export const {
  handleSetInitDone,
    handleSetConnectionStatus,
    handleSetCurrentUIType,
    handleSetEventFlag,
    handleSetSettings,
    handleSetKeyCommand,
    handleSetLocalConnection,
    handleAddOnlineUser
  } = systemSlice.actions
export default systemSlice;