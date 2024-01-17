import { CLOUD_FUNCTION_URL } from '../startup/serverConnect';
import axios from 'axios';
import {
  handleSetShowRecordButton,
  handleSetShowRecordingImg,
  handleSetShowAiChatLoading,
  handleSetIsReading
} from '../store/board';
import UtilityService from './UtilityService';
import FileService from './FileService';
import { AiAssistApi } from '../redux/AiAssistApiSlice';

import { handleSetAIChatRows } from '../store/AIAssist';

import { handleSetCurrentChatSession, handleSetChatSessionList, handleSetCurrentChatAiPersonaData } from '../store/AIAssist';

import { handleOpenChatUI } from '../store/sideBar';
import { handleSetAIChatMessages } from '../store/AIAssist';
import { handleSetOpenTemplate } from '../store/resource';
import BoardService from './BoardService';

import { handleSetIsPanMode, handleSetDrawingEraseMode, handleSetBoardPanelClicked } from '../store/board';
export default class AIService {


  public chatSessionId = null;
  public chatLimit = 25;
  public chatSubscription = null;


  static service = null;

  static getInstance(): AIService {

    if (AIService.service == null) {

      AIService.service = new AIService();

      Boardx.Instance.AIService = AIService.service;

    }

    return AIService.service;
  }

  constructor() {



  }

  async requestGPT4Process(prompt, temperature = 0.6) {
    const response = await this.handleRequestAIWidget('gpt-4', prompt, "", temperature, null);
    return response['data']['content'];
  }

  async requestGPT3Process(prompt, temperature = 0.6) {
    const response = await this.handleRequestAIWidget('gpt-3', prompt, "", temperature, null);
    return response['data']['content'];
  }

  ///call GPT3 to handel text
  async handleRequestAIWidget(gptModel, promptTemplate, targetData, temperature, outputFormat) {

    const url = `${CLOUD_FUNCTION_URL}/handleRequestAIWidget`;

    const result = await axios.post(url, { gptModel, promptTemplate, targetData, temperature, outputFormat });

    return result;



  }


  ///call GPT3 to handle text
  async handleSaveChatSummary(sessionId, prompt, response) {

    if (!sessionId) return;
    const url = `${CLOUD_FUNCTION_URL}/handleSaveChatSummary`;

    const result = await axios.post(url, { sessionId, prompt, response });

    return result;



  }


  ///call GPT3 to handel text
  async handleDocSummarization(text, prompt) {

    const url = `${CLOUD_FUNCTION_URL}/handleDocSummarization`;

    const result = await axios.post(url, { text, prompt });

    return result?.data;



  }

  async deleteChatSessionById(sessionId) {

  }

  getDefaultAIModel() {
    const userInfo = store.getState().user.userInfo;
    const aiModel = userInfo.status == 'free'? 'gpt-3.5-turbo' : 'gpt-4';
    return aiModel;
  }

  async loadChatSessionForBoard(){

  }

  async loadChatSessionList(chatSessionList, chatType) {
    let newChatSessionList = [];
    const roomInfo = store.getState().room.roomInfo;
    const boardId = store.getState().board.board._id;
    const userId = store.getState().user.userInfo.userId;
    const orgId = store.getState().org.orgInfo.orgId;

    if (chatType === 'boardChat') {
       let boardSessions = [];
      chatSessionList.forEach(chatSession => {
        if (chatSession.entityId === boardId) {
          // newChatSessionList.unshift(chatSession);
          boardSessions.push(chatSession);
          return;
        }
        newChatSessionList.push(chatSession);
      });
      newChatSessionList=[...boardSessions, ...newChatSessionList];


      store.dispatch(handleSetChatSessionList(newChatSessionList));
      if(boardSessions.length===0){
        const aiModel=this.getDefaultAIModel();
        const newSession = await this.createNewChatSession(userId, orgId, true, aiModel);

        store.dispatch(handleSetCurrentChatSession(newSession));
        return;

      }else{
        store.dispatch(handleSetCurrentChatSession(boardSessions[0]));
        this.loadChatSession(boardSessions[0]);
        return;
      }

    }

    if (chatType === 'agent') {
      chatSessionList.forEach(chatSession => {
        if (chatSession.entityId === 'agent') {
          newChatSessionList.unshift(chatSession);
          return;
        }
        newChatSessionList.push(chatSession);
      });
      store.dispatch(handleSetChatSessionList(newChatSessionList));
      return;
    }

    if (chatSessionList.length > 0) {

      store.dispatch(handleSetChatSessionList([...chatSessionList]));
      store.dispatch(handleSetCurrentChatSession(chatSessionList[0]));
      this.loadChatSession(chatSessionList[0]);
      if (chatSessionList[0].promptPersonaData) {
        store.dispatch(handleSetCurrentChatAiPersonaData(
          chatSessionList[0].promptPersonaData
            ? chatSessionList[0].promptPersonaData
            : null));
      }
    }
  }


  generateNewChatSessionName = (entityId) => {
    let newChatSessionName = '';
    const orgInfo = store.getState().org.orgInfo;
    const board = store.getState().board.board;
    const roomInfo = store.getState().room.roomInfo;

    if (entityId === 'recent') {
      newChatSessionName = orgInfo.name;
    } else if (entityId === board._id && entityId !=="") {
      newChatSessionName = board.name;
    }  else {
      newChatSessionName = orgInfo.name;
    }

    return newChatSessionName;
  }


  getChatSessionEntityId = () => {
    let newChatSessionName = '';
    const orgInfo = store.getState().org.orgInfo;
    const board = store.getState().board.board;
    const roomInfo = store.getState().room.roomInfo;
    let entityId = '';

    if (location.pathname.includes('/board/')) {
      entityId = board._id;

    } else if (location.pathname.includes('/aiAssistant')) {
      entityId = 'aiassistant';

    } else if (location.pathname.includes('/admin')) {
      entityId = 'agent';
    }

    return entityId;
  }


  // 创建新的Chat
  createNewChatSession = async (userId, orgId, includeContext, gptModel) => {

    const entityId = this.getChatSessionEntityId();
    // let entityId = 'recent';
    let newChatSessionName = this.generateNewChatSessionName(entityId);

    const newAiChatSession = {
      _id: UtilityService.getInstance().generateWidgetID(),
      name: newChatSessionName,
      userId: userId,
      createdAt: new Date().getTime(),
      orgId: orgId,
      entityId: entityId,
      systemMessage: "",
      gptModel: gptModel,
      isIncludeBoardContent: includeContext,
      isIncludeBoardFilesContent: false
    };

    const result = await store.dispatch(AiAssistApi.endpoints.addNewAIChatSession.initiate({ newAIChatdata: newAiChatSession }));

    let chatSessionList = store.getState().AIAssist.chatSessionList;
    let newChatSessionList = [newAiChatSession, ...chatSessionList];
    store.dispatch(handleSetChatSessionList(newChatSessionList));

    this.loadChatSession(newAiChatSession);
    return newAiChatSession;
  };
  // addNewAIChatSession({ newAIChatdata: newAiChatSession });
  // store.handleClickOpenChatUI(e, newAiChatSession);

  loadChatSession = async newAiChatSession => {
    console.log('##loadChatSession');
    const userInfo = store.getState().user.userInfo;
    await AIService.getInstance().InitializeChatSessionByID(
      newAiChatSession._id,
      userInfo.userId
    );
    store.dispatch(handleOpenChatUI(true));
    store.dispatch(handleSetCurrentChatSession(newAiChatSession));
    store.dispatch(
      handleSetCurrentChatAiPersonaData(
        newAiChatSession.promptPersonaData
          ? newAiChatSession.promptPersonaData
          : null
      )
    );
    store.dispatch(handleSetIsPanMode(false));
    store.dispatch(handleSetOpenTemplate(false));

    BoardService.getInstance().resetBoardMenuEvents();
    setTimeout(() => window.dispatchEvent(new CustomEvent('resize')), 0);
    store.dispatch(handleSetDrawingEraseMode(false));
    store.dispatch(handleSetBoardPanelClicked(false));
  };


  /***
   * initialize chat session by id
   * @param chatSessionId the session id
   * @param userId the user id
   */
  async InitializeChatSessionByID(chatSessionId, userId) {

    this.chatSessionId = chatSessionId;
    if (!this.chatSessionId) return;
    if (this.chatSubscription) await this.chatSubscription.remove();

    const aiChatCollection = server.collection('aiChat');
    aiChatCollection.onChange(async () => {
      const aiChats = await aiChatCollection
        .fetch()
        .filter(aiChat => aiChat.chatSessionId === chatSessionId)
        .map(aiChat => ({
          ...aiChat,
          _id: aiChat.id
        }))
        .sort((a, b) => a.createdAt - b.createdAt);
      this.loadChatMessages(aiChats);
      await store.dispatch(handleSetAIChatRows(aiChats));

    });
    //subscription aichat


    this.chatSubscription = server
      .subscribe('aiChat', this.chatSessionId, this.chatLimit);

    await this.chatSubscription.ready();

  }

  async loadChatMessages(aiChat) {
    const newMsg = [];
    const newAiChat = [...aiChat].reverse();

    for (const chat of newAiChat) {
      if (chat.type === 'user') {
        newMsg.push({ role: 'user', content: chat.message });
      }
      if (chat.type === 'AI') {
        newMsg.push({ role: 'assistant', content: chat.message });
      }
    }
    await store.dispatch(handleSetAIChatMessages(newMsg.reverse()));
  }

  updateChatMessage = async (chatId, message) => {

    const result = await server.call(
      'ai.AIChat.UpdateMsg',
      chatId,
      message
    );


  };

  insertMessage = async (
    userMessage,
    newCurrentChatSession,
    orgId, messageType = 'user'
  ) => {
    try {
      const result = await server.call('ai.AIChat.InsertMsg',
        userMessage,
        newCurrentChatSession,
        orgId,
        messageType);
      return result;
    } catch (err) {
      console.log('err', err);
      store.dispatch(handleSetShowAiChatLoading(false));
    }
  };

  async handleRequestAIChat(msg, abortController, contentOnTheBoard = '', chatType) {

    console.log('##chatType', chatType)
    try {
      Boardx.Instance.abordController = abortController;
      const orgId = store.getState().org.orgInfo.orgId;
      const currentChatSession = store.getState().AIAssist.currentChatSession;
      const url = `${CLOUD_FUNCTION_URL}/handleRequestAIChat`;
      const AIChatMessages = store.getState().AIAssist.aiChatMessages;
      const messages = [...AIChatMessages];
      const contextContent = chatType == "agent" ? "" : this.getContextContentForBoardAndRoomAndTeam();
      const currentChatAiPersonaData = store.getState().AIAssist.currentChatAiPersonaData;
      const currentAgent = store.getState().AIAssist.currentAgent;
      let systemMessage

      if (chatType !== 'agent') {
        systemMessage = currentChatSession && currentChatSession.systemMessage
          ? currentChatSession.systemMessage
          : ""
      } else {
        systemMessage = currentAgent.command;
      }


      const chatAiPersonaSystemMessage = currentChatAiPersonaData ? currentChatAiPersonaData.command : '';

      messages.unshift({
        role: 'system',
        content: `${chatAiPersonaSystemMessage} \n ${systemMessage} \n  ${contentOnTheBoard} \n ${contextContent}`
      });

      let requestData;
      if (chatType == 'agent') {
        requestData = {
          prompt: msg,
          messages: messages,
          promptPersonaData: null,
          model: currentAgent.gptModel,
          sessionId: currentAgent.chatSessionId
        };
      } else {
        requestData = {
          prompt: msg,
          messages: messages,
          promptPersonaData: currentChatAiPersonaData,
          model: currentChatSession.gptModel,
          sessionId: currentChatSession._id
        };
      }


      let newCurrentChatSession = {
        _id: chatType == 'agent' ? currentAgent.chatSessionId : currentChatSession._id,
        message: msg,
        contentOnTheBoard: contentOnTheBoard,
      }

      // if (contentOnTheBoard) {
      //   newCurrentChatSession = {
      //     ...currentChatSession,
      //     contentOnTheBoard: contentOnTheBoard
      //   };
      // } else {
      //   contentOnTheBoard = '';
      // }

      await this.insertMessage(msg, newCurrentChatSession, orgId, 'user');

      const responses = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData),
        // signal: abortController.signal
      });

      const reader = responses.body.getReader();

      let AIMessage = '';



      const AIChatMessageId = await this.insertMessage(
        AIMessage,
        newCurrentChatSession,
        orgId,
        'AI'
      );



      let response = '';

      const readStream = async () => {
        const { done, value } = await reader.read();
        store.dispatch(handleSetShowAiChatLoading(false));
        if (done) {
          await AIService.getInstance().updateChatMessage(AIChatMessageId, AIMessage);
          store.dispatch(handleSetShowAiChatLoading(false));
          store.dispatch(handleSetIsReading(false));
          // setIsShowCancelTheAvaRequestBtn(false);

          if (chatType !== 'agent') {
            await AIService.getInstance().handleSaveChatSummary(store.getState().AIAssist.currentChatSession._id, msg, response);

          }
          return;
        }

        const text = new TextDecoder().decode(value);
        response += text;
        const characters = text.split('');

        const printCharacter = async index => {
          if (index < characters.length) {
            setTimeout(() => {
              AIMessage = AIMessage + characters[index];

              let aiChatArr = store.getState().AIAssist.aiChatRows;

              store.dispatch(
                handleSetAIChatRows(
                  aiChatArr.map(chat =>
                    chat._id === AIChatMessageId
                      ? { ...chat, message: AIMessage }
                      : chat
                  )
                )
              );

              printCharacter(index + 1);
            }, 0); // 设置时间间隔，例如100毫秒

          } else {
            readStream();
          }
        };

        printCharacter(0);
      };

      readStream();

    } catch (error) {
      console.error(error);
      store.dispatch(handleSetShowAiChatLoading(false));
      // setIsShowCancelTheAvaRequestBtn(false);
    }
  }

  getContextContentForBoardAndRoomAndTeam = async () => {
    try {
      let contextContent = '';
      const orgId = store.getState().org.orgInfo.orgId;
      const boardId = store.getState().board.board._id;
      const roomId = store.getState().board.board.roomId;

      const { data: teamContext } = await store.dispatch(
        AiAssistApi.endpoints.getTeamAiContextContent.initiate(orgId)
      );

      const { data: roomContext } = await store.dispatch(
        AiAssistApi.endpoints.getRoomAiContextContent.initiate(roomId)
      );

      const { data: boardContext } = await store.dispatch(
        AiAssistApi.endpoints.getBoardAiContextContent.initiate(boardId)
      );

      contextContent = teamContext ? teamContext?.data?.teamContext : "" + '\n' + roomContext ? roomContext?.data?.roomContext : "" + '\n' + boardContext ? boardContext?.data?.boardContext : "" + '\n';
      return contextContent;
    } catch (error) {
      console.log('error', error);
      return;
    }


    // if (teamAiContextContent.teamContext) {
    //   contextContent += teamAiContextContent.teamContext + '\n';
    // }

    // if (roomAiContextContent.roomContext) {
    //   contextContent += roomAiContextContent.roomContext + '\n';
    // }

    // if (boardAiContextContent.boardContext) {
    //   contextContent += boardAiContextContent.boardContext + '\n';
    // }


  };


  handleVoiceChat = async (recordAudioFile, currentChatSession, contentOnTheBoard, abortController) => {
    // TODO: 处理录音文件
    let board = store.getState().board.board;
    let r2UploadPath =
      UtilityService.getInstance().getr2UploadPath(board);
    let audioLink = "";
    audioLink = await FileService.getInstance().uploadRecordToR2(
      r2UploadPath,
      recordAudioFile
    );

    let msgType = 'voice';
    let key = audioLink.replace('https://files.boardx.us/', '');
    let userChatId;
    const fileData = {
      fileUrl: audioLink,
    }
    store.dispatch(handleSetShowAiChatLoading(true));
    userChatId = await server.call('ai.SendUserChat', 'record', currentChatSession, msgType, fileData);

    const userMsg = await server.call('ai.audioToTextOpenAi', key, userChatId);
    await AIService.getInstance().handleRequestAIChat(userMsg, abortController, contentOnTheBoard, 'audio');
    // setIsShowCancelTheAvaRequestBtn(false);
  };

  handleSaveChatSettings = async (gptModel, chatName, systemMessage, isIncludeBoardContent) => {
    try {
      const currentChatSession = store.getState().AIAssist.currentChatSession;
      const chatSessionList = store.getState().AIAssist.chatSessionList;

      const updateData = {
        ...(chatName !== null ? { name: chatName } : {}),
        ...(gptModel !== null ? { gptModel: gptModel } : {}),
        ...(systemMessage !== null ? { systemMessage: systemMessage } : {}),
        ...(isIncludeBoardContent !== null ? { isIncludeBoardContent: isIncludeBoardContent } : {}),
      };

      // Perform the API call to update the AI chat session
      const response = await store.dispatch(AiAssistApi.endpoints.updateAIChatSession.initiate({
        aiChatSessionId: currentChatSession._id,
        updateData: updateData
      }));

      // If the update is successful, then update the Redux store
      if (response.data) {
        const updatedCurrentChatSession = {
          ...currentChatSession,
          ...updateData
        };
        await store.dispatch(handleSetCurrentChatSession(updatedCurrentChatSession));

        const newChatSessionList = chatSessionList.map(item =>
          item._id === currentChatSession._id ? { ...item, ...updateData } : item
        );
        store.dispatch(handleSetChatSessionList(newChatSessionList));
      }
    } catch (error) {
      console.error('Error updating chat session:', error);
      // Handle the error appropriately here
    }
  };


}
