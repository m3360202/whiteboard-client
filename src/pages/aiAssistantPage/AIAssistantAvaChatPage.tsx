//** Import react
import React, { useEffect, useState, useRef } from 'react';
import { styled } from '@mui/material/styles';
import { useLocation } from 'react-router-dom';
import { MenuItem, Select } from '@mui/material';
//** Import i18n
import { useTranslation } from 'react-i18next';
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
//** Import Redux kit
import store, { RootState } from '../../store';
import { useSelector, useDispatch } from 'react-redux';
import { handleSetAiToolBar } from '../../store/domArea';
import {
  useGetAIChatSessionListQuery,
} from '../../redux/AiAssistApiSlice';
 
import AIService from '../../services/AIService';

//** Import Material UI
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

//**Import Services
import { BoardService, UtilityService, SysService } from '../../services';

//**Import Components
import ChatDialogContent from '../../components/boardChatAI/ChatAI/ChatDialogContent';
import ChatAISettings from '../../components/boardChatAI/ChatAI/ChatAISettings';
import AIAssistanChatRecordList from './AIAssistanChatRecordList';
import AIModelSelectComponent from '../../components/boardChatAI/AIModelSelectComponent';

import ChatAgentComponent from 'components/boardChatAI/agent/ChatAgentComponent';




function AIAssistantAvaChatPage(props) {
  const { chatType } = props;
  const dispatch = useDispatch();

  const location = useLocation();
  const { t } = useTranslation();
  const [openChatAISettings, setOpenChatAISettings] = useState(false);
  const [checkCreditsIsEnoughResult, setCheckCreditsIsEnoughResult] =
    useState(null);

  const userInfo = useSelector((state: RootState) => state.user.userInfo);

  const board = useSelector((state: RootState) => state.board.board);
  const roomInfo = useSelector((state: RootState) => state.room.roomInfo);
  const orgInfo = useSelector((state: RootState) => state.org.orgInfo);

  const currentChatSession: any = useSelector(
    (state: RootState) => state.AIAssist.currentChatSession
  );
 
 
  const { data: chatSessionList = [], isLoading: isLoadingChatSessionList } =
    useGetAIChatSessionListQuery({
      userId: userInfo.userId,
      orgId: orgInfo.orgId
    });

    useEffect(() => {
      AIService.getInstance().loadChatSessionList(chatSessionList, chatType);
   }, [chatSessionList]);

 


  useEffect(() => {
    return () => {
      store.dispatch(handleSetAiToolBar(false));
    };
  }, []);

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
    }}>
      <Box sx={{
        backgroundColor: '#FFF',
        zIndex: 1,
        display: 'flex',
        height: '60px',
        alignItems: 'center',
        borderBottom: '1px solid #E0E0E0',
        width: '100%',
      }}>
        <IconButton
          aria-label="open drawer"
          style={{ color: '#828282' }}
          sx={{ml:2, mr: 2, display: { sm: 'none' } }}
          color="inherit"
          edge="start"
          onClick={() => (window as any).setMobileOpen(true)}
          size="large"
        >
          <MenuIcon />
        </IconButton>

        <AIAssistanChatRecordList
          setOpenChatAISettings={setOpenChatAISettings}
          currentSessionName={currentChatSession?.name}
        />
        <ChatAgentComponent />
      </Box>

      <ChatDialogContent
        dialogFullScreen={true}
        chatType={'dashboard'}
        checkCreditsIsEnoughResult={checkCreditsIsEnoughResult}
      />

      <ChatAISettings
        openChatAISettings={openChatAISettings}
        setOpenChatAISettings={setOpenChatAISettings}
      />
    </Box>
  );
}

export default AIAssistantAvaChatPage;
