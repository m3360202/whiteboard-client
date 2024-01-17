//** Import react
import React, { useEffect, useState, useRef } from 'react';
import { styled } from '@mui/material/styles';
import { useLocation } from 'react-router-dom';

//** Import i18n
import { useTranslation } from 'react-i18next';

//** Import Redux kit
import store, { RootState } from '../../../store';
import { handleOpenChatUI } from '../../../store/sideBar';
import { useSelector, useDispatch } from 'react-redux';
import { handleSetOpenTemplate } from '../../../store/resource';
import {
  handleSetIsPanMode,
  handleSetBoardPanelClicked,
  handleSetDrawingEraseMode,
  handleSetShowAiChatLoading
} from '../../../store/board';
import { changeMode } from '../../../store/mode';
import { handleSetAiToolBar } from '../../../store/domArea';
import {

  useGetAIChatSessionListQuery,
  useGetAllAiCommandQuery
} from '../../../redux/AiAssistApiSlice';
import { useCheckCreditsIsEnoughMutation } from '../../../redux/PricingApiSlice';
import {
  handleSetCurrentChatSession,
  handleSetChatSessionList,
  handleSetCurrentChatAiPersonaData,
  handleSetShowChatAiMaskingLayer
} from '../../../store/AIAssist';
import AIService from '../../../services/AIService';
//** Import Material UI
import Tooltip from '@mui/material/Tooltip';
import { Dialog, DialogTitle, DialogActions } from '@mui/material';
import Paper, { PaperProps } from '@mui/material/Paper';
import Draggable from 'react-draggable';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import FitScreenIcon from '@mui/icons-material/FitScreen';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import clsx from 'clsx';


//** Import MUI Icons
import ChatAIIcon20x20 from '../../../mui/icons/ChatAIIcon20x20';
import ClosePopupIcon from '../../../mui/icons/ClosePopupIcon';
import ChatAIIcon20x20v2 from '../../../mui/icons/ChatAIIcon20x20v2';
import ChatAIIcon24x24 from '../../../mui/icons/ChatAIIcon24x24';
import ClosePopupIcon24x24 from '../../../mui/icons/ClosePopupIcon24x24';
import ChatAIIcon24x24v2 from '../../../mui/icons/ChatAIIcon24x24v2';
import SettingsIcon from '@mui/icons-material/Settings';
import AIAssistanChatRecordList from 'pages/aiAssistantPage/AIAssistanChatRecordList';

//**Import Services
import { BoardService, UtilityService, SysService } from '../../../services';

//**Import Components
import ChatDialogContent from 'components/boardChatAI/ChatAI/ChatDialogContent';
import ChatAISettings from './ChatAISettings';

import Grid from '@mui/material/Grid';

import SendMsgForm from './SendMsgForm';
import { handleSetChatWindowPosition } from '../../../store/AIAssist/index';

import FullScreenChat from './FullScreenChat';
import ChatAgentComponent from '../agent/ChatAgentComponent';

Boardx.Instance.handlechatpos = handleSetChatWindowPosition



function PaperComponent(props: PaperProps) {

  const chatWindowPosition = useSelector((state: RootState) => state.AIAssist.chatWindowPosition);
  const dispatch = useDispatch();

  return (
    <Draggable

      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
      defaultPosition={{
        x: window.innerWidth / 2 - 260,
        y: window.innerHeight / 2 - 440
      }}
      position={chatWindowPosition}
    >
      <Paper {...props} style={{ overflow: 'hidden' }} />
    </Draggable>
  );
}

function DesktopChatAI(props) {
  const { chatType, fullScreen, showChat } = props;
  const dispatch = useDispatch();

  const location = useLocation();
  const { t } = useTranslation();
  const [openChatAISettings, setOpenChatAISettings] = useState(false);
  const [dialogChatList, setDialogChatList] = useState(false);
  const [dialogFullScreen, setDialogFullScreen] = useState(fullScreen);


  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  const isOpenChatUI = useSelector(
    (state: RootState) => state.sideBar.openChatUI
  );

  const board = useSelector((state: RootState) => state.board.board);
  const roomInfo = useSelector((state: RootState) => state.room.roomInfo);
  const orgInfo = useSelector((state: RootState) => state.org.orgInfo);
  const boardId = useSelector((state: RootState) => state.board.boardId);

  const currentChatSession: any = useSelector(
    (state: RootState) => state.AIAssist.currentChatSession
  );

  const { data: chatSessionList = [], isLoading: isLoadingChatSessionList } =
    useGetAIChatSessionListQuery({
      userId: userInfo.userId,
      orgId: orgInfo.orgId
    });

  const handleOpenChatDialog = async e => {
    // dispatch(handleOpenChatUI(true));
    AIService.getInstance().loadChatSessionList(chatSessionList, chatType);
    // setDialogChatList(!dialogChatList);
    // handleClickNewChat(e);
    // const result = await handleCheckCreditsIsEnough();
    // setCheckCreditsIsEnoughResult(result);
  };

  const handleCloseChatUI = () => {
    dispatch(changeMode('default'));
    dispatch(handleOpenChatUI(false));
    setDialogFullScreen(false);
    store.dispatch(handleSetAiToolBar(false));
  };

  const handleFullScreen = async () => {
    if (dialogFullScreen) {
      store.dispatch(handleSetAiToolBar(false));
      setDialogFullScreen(!dialogFullScreen);

      //this is a workaround for Dialog Transform location caused fullscreen issue
      await store.dispatch(handleSetChatWindowPosition({
        x: window.innerWidth / 2 - 260,
        y: window.innerHeight / 2 - 440
      }));
      await store.dispatch(handleSetChatWindowPosition(null));


      return;

    }
    setDialogFullScreen(!dialogFullScreen);
    store.dispatch(handleSetChatWindowPosition({ x: 0, y: 0 }))

  };


  useEffect(() => {
    handleCloseChatUI();
    return () => {
      store.dispatch(handleSetAiToolBar(false));
    };
  }, []);

  const handleClickOpenChatAISettings = () => {
    setOpenChatAISettings(true);
    dispatch(handleSetShowChatAiMaskingLayer(true));
  };

  const handleOnMouseEnter = e => {
    store.dispatch(handleSetAiToolBar(true));
  };

  const handleOnMouseLeave = e => {
    store.dispatch(handleSetAiToolBar(false));
  };



  const ChatUIDialog = () => {

    const HeaderChatUIDialog = () => {
      return (
        <Box style={{
          width: '100%',
          boxSizing: 'border-box',
          padding: '6px 12px',
          background: 'rgb(239 233 233)',
          display: 'flex',
          justifyContent: 'space-between',
          height: '50px', pointerEvents: 'all',
          alignItems: 'center'
        }}>
          <Box
            id={dialogFullScreen ? 'dialog-title' : 'draggable-dialog-title'}
            sx={{
              display: 'flex',
              alignItems: 'center',
              flex: 1,
              justifyContent: 'space-between',
              cursor: 'move'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <AIAssistanChatRecordList setOpenChatAISettings={setOpenChatAISettings} currentSessionName={currentChatSession?.name} />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {/* <Typography className={classes.creditText}>
              {t('chatAi.creditBalance')}{' '}
              {userInfo.credits
                ? userInfo.credits.toLocaleString('en-US')
                : 0}
            </Typography> */}

              <IconButton
                style={{
                  // color: '#a3a3a3',
                  padding: 0,
                  width: '14px',
                  height: '24px'
                }}
                onClick={handleClickOpenChatAISettings}
              >
                <SettingsIcon />
              </IconButton>
              {/* <ChatAISettings
                openChatAISettings={openChatAISettings}
                setOpenChatAISettings={setOpenChatAISettings}
              /> */}
            </Box>
          </Box>

          <Box>
            <IconButton
              onClick={handleFullScreen}
              style={{
                // color: '#FFFFFF',
                padding: 0,
                width: '14px',
                height: '24px',
                marginRight: '15px',
                marginLeft: '15px',
                alignItems: 'center'
              }}
            >
              {dialogFullScreen ? <CloseFullscreenIcon /> : <FitScreenIcon />}
            </IconButton>
            <IconButton
              onClick={handleCloseChatUI}
              style={{ padding: 0, width: '14px', height: '14px', color: '#333' }}
            >
              <ClosePopupIcon />
            </IconButton>
          </Box>

        </Box>
      );
    }

    return (


      <Box sx={{ height: 600, width: 500, pointerEvents: "all", overflow: 'hidden', marginBottom:'10px' }}>
        <Box sx={{ overflow: 'hidden' }}>
          <HeaderChatUIDialog />

        </Box>
        <Box sx={{overflow: 'hidden', height: '552px'}} >
        <Box sx={{ display: 'flex', flexDirection: 'row', 'justifyContent': 'center', height: '50px', alignItems: 'center' }}>
          <ChatAgentComponent />
        </Box>

        <ChatDialogContent
          dialogFullScreen={false}
          chatType={'boardChat'}

        />
        </Box>
    

      </Box>

    )


  }
  return (
    <Box sx={{ overflow: 'hidden' }}>
      <Tooltip
        title={t('chatAi.BoardXAIAssistant')}
        placement="left"
        arrow
        style={props.style}
        sx={{
          position: 'fixed',
          bottom: '80px',
          right: '24px',
          cursor: 'pointer',
          background: '#FFFFFF',
          boxShadow: '0px 2px 10px rgba(58, 53, 65, 0.1)',
          borderRadius: '36px'
        }}
      >
        <IconButton id="ChatAI" onClick={handleOpenChatDialog}>
          {/* <ChatAIIcon /> */}
          <img
            style={{ width: '28px', height: '28px' }}
            src="/images/aiChat/ChatAI.png"
          />
        </IconButton>
      </Tooltip>
      {/* chat page */}
      <Dialog
        id="ChatAiDialogBox"
        open={isOpenChatUI}
        PaperComponent={PaperComponent}
        BackdropProps={{ invisible: true }}
        disableEnforceFocus={true}
        aria-labelledby="draggable-dialog-title"
        fullScreen={dialogFullScreen}
        style={{ pointerEvents: 'none', overflow: 'hidden' }}
        onMouseEnter={e => handleOnMouseEnter(e)}
        onMouseLeave={e => handleOnMouseLeave(e)}
      >

        {dialogFullScreen && <FullScreenChat chatType={'boardChat'} exitAction={handleFullScreen} />}

        {!dialogFullScreen && <ChatUIDialog />}

        <ChatAISettings
          openChatAISettings={openChatAISettings}
          setOpenChatAISettings={setOpenChatAISettings}
        />
      </Dialog>
    </Box>
  );
}

export default DesktopChatAI;
