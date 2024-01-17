import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const AIAssistSlice = createSlice({
  name: 'AIAssist',
  initialState: {
    commandData: [],
    teamsCommandData: [],
    adminCommandData: [],
    recentCommandData: [],
    searchCommandData: [],
    allCommandData: [],
    allPromptPersonaData: [],
    customizeCommandData: [],
    allCustomStyleCommand: [],
    currentBoardFilesContent: [],
    currentChatSession: {
      _id: undefined,
      name: undefined,
      userId: undefined,
      createdAt: undefined,
      orgId: undefined,
      entityId: undefined,
      systemMessage: undefined,
      gptModel: undefined,
      isIncludeBoardContent: undefined,
      isIncludeBoardFilesContent: undefined
    },
    chatSessionList: [],
    openWidgetMenuAIAssist: false,
    currentChatAiPersonaData: null,
    isShowChatAiMaskingLayer: false,
    currentAgent: null,
    myAgentList: null,
    aiAgentList: [],
    currentAdminAiPromptData: null,
    currentAdminAiImagePromptData: null,
    aiChatRows: [],
    aiChatMessages: [],
    chatWindowPosition:null,
  },
  reducers: {
    handleSetCommandData(state, action) {
      state.commandData = action.payload;
    },
    handleSetTeamsCommandData(state, action) {
      state.teamsCommandData = action.payload;
    },
    handleSetAdminCommandData(state, action) {
      state.adminCommandData = action.payload;
    },
    handleSetRecentCommandData(state, action) {
      state.recentCommandData = action.payload;
    },
    handleSetSearchCommandData(state, action) {
      state.searchCommandData = action.payload;
    },
    handleSetCustomizeCommandData(state, action) {
      state.customizeCommandData = action.payload;
    },
    handleSetAllCustomStyleCommand(state, action) {
      state.allCustomStyleCommand = action.payload;
    },
    handleSetOpenWidgetMenuAIAssist(state, action) {
      state.openWidgetMenuAIAssist = action.payload;
    },
    handleSetAllCommandData(state, action) {
      state.allCommandData = action.payload;
    },
    handleSetAllPromptPersonaData(state, action) {
      state.allPromptPersonaData = action.payload;
    },
    handleSetCurrentBoardFilesContent(state, action) {
      state.currentBoardFilesContent = action.payload;
    },
    handleSetCurrentChatSession(state, action) {
      state.currentChatSession = action.payload;
    },
    handleSetChatSessionList(state, action) {
      state.chatSessionList = action.payload;
    },
    handleSetCurrentChatAiPersonaData(state, action) {
      state.currentChatAiPersonaData = action.payload;
    },
    handleSetShowChatAiMaskingLayer(state, action) {
      state.isShowChatAiMaskingLayer = action.payload;
    },
    handleSetAiAgentList(state, action) {
      state.aiAgentList = action.payload;
    },
    handleSetCurrentAgent(state, action) {
      state.currentAgent = action.payload;
    },
    handleSetMyAgentList(state, action) {
      state.myAgentList = action.payload;
    },
    handleSetCurrentAdminAiPromptData(state, action) {
      state.currentAdminAiPromptData = action.payload;
    },
    handleSetCurrentAdminAiImagePromptData(state, action) {
      state.currentAdminAiImagePromptData = action.payload;
    },
    handleSetAIChatRows(state, action) {
      state.aiChatRows = action.payload;
    },
    handleSetAIChatMessages(state, action) {
      state.aiChatMessages = action.payload;
    },
    handleSetChatWindowPosition(state, action) {
      state.chatWindowPosition = action.payload;
    }

  }
});

export const {
  handleSetCommandData,
  handleSetTeamsCommandData,
  handleSetAdminCommandData,
  handleSetRecentCommandData,
  handleSetSearchCommandData,
  handleSetCustomizeCommandData,
  handleSetAllCustomStyleCommand,
  handleSetOpenWidgetMenuAIAssist,
  handleSetAllCommandData,
  handleSetAllPromptPersonaData,
  handleSetCurrentBoardFilesContent,
  handleSetCurrentChatSession,
  handleSetChatSessionList,
  handleSetCurrentChatAiPersonaData,
  handleSetShowChatAiMaskingLayer,
  handleSetAiAgentList,
  handleSetCurrentAgent,
  handleSetCurrentAdminAiPromptData,
  handleSetCurrentAdminAiImagePromptData,
  handleSetMyAgentList,
  handleSetAIChatRows,
  handleSetAIChatMessages,
  handleSetChatWindowPosition,
} = AIAssistSlice.actions;
export default AIAssistSlice;
