//** Import react
import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import { useLocation } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
//** Import i18n
import { useTranslation } from 'react-i18next';

//** Import Redux kit
import store, { RootState } from '../../../store';
import { handleOpenChatUI } from '../../../store/sideBar';
import { useSelector, useDispatch } from 'react-redux';
import { handleSetOpenTemplate } from '../../../store/resource';
import {
  useGetAIChatSessionListQuery,
  useGetAllAiCommandQuery
} from '../../../redux/AiAssistApiSlice';
import { changeMode } from '../../../store/mode';
import {
  handleSetIsPanMode,
  handleSetBoardPanelClicked,
  handleSetDrawingEraseMode,
  handleSetShowMobileAiChatLoading
} from '../../../store/board';
import { useCheckCreditsIsEnoughMutation } from '../../../redux/PricingApiSlice';
import AIService from '../../../services/AIService';
//** Import Mui
import Tooltip from '@mui/material/Tooltip';
import ToggleButton from '@mui/material/ToggleButton';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import CloseIcon from '@mui/icons-material/Close';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import DialogTitle from '@mui/material/DialogTitle';

//** Import MUI Icons
import ChatAIIcon from '../../../mui/icons/ChatAIIcon';
import ChatAIIcon20x20 from '../../../mui/icons/ChatAIIcon20x20';
import ChatAIIcon20x20v3 from '../../../mui/icons/ChatAIIcon20x20v3';
import SettingsIcon from '@mui/icons-material/Settings';

//**Import Services
import { BoardService, UtilityService, SysService } from '../../../services';

import {
  handleSetCurrentChatSession,
  handleSetChatSessionList,
  handleSetCurrentChatAiPersonaData,
  handleSetShowChatAiMaskingLayer
} from '../../../store/AIAssist';

//** Import Component
// import ChatDialogContentTouch from './ChatDialogContentTouch';
import ChatDialogContent from 'components/boardChatAI/ChatAI/ChatDialogContent';
import ChatAITouchSettings from './ChatAITouchSettings';


export function MenuChatAITouch(props) {
  const { chatType } = props;
  const dispatch = useDispatch();
  const history = useHistory();
  const { t } = useTranslation();
  const modeType = useSelector((state: RootState) => state.mode.type);
  const location = useLocation();
  const [dialogChatList, setDialogChatList] = useState(false);
  const [openChatAITouchSettings, setOpenChatAITouchSettings] = useState(false);
  const [currentChatSession, setCurrentChatSession] = useState({
    _id: '',
    name: '',
    userId: '',
    createdAt: '',
    orgId: '',
    entityId: '',
    systemMessage: '',
    gptModel: '',
    isIncludeBoardContent: false
  });
  const [isLoadMore, setIsLoadMore] = useState(false);
  // const [chatSessionList, setChatSessionList] = useState([]);
  const [checkCreditsIsEnoughResult, setCheckCreditsIsEnoughResult] =
    useState(null);
  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  const board = useSelector((state: RootState) => state.board.board);
  const roomInfo = useSelector((state: RootState) => state.room.roomInfo);
  const orgInfo = useSelector((state: RootState) => state.org.orgInfo);
 
 
  const { data: data = [] } = useGetAllAiCommandQuery({});

  const { data: chatSessionList = [], isLoading: isLoadingChatSessionList } =
    useGetAIChatSessionListQuery({
      userId: userInfo.userId,
      orgId: orgInfo.orgId
    });

    useEffect(() => {
      AIService.getInstance().loadChatSessionList(chatSessionList, chatType);
   }, [chatSessionList]);

  const isOpenChatUI = useSelector(
    (state: RootState) => state.sideBar.openChatUI
  );

  const handleGoBack = () => {
    dispatch(changeMode('default'));
    dispatch(handleOpenChatUI(false));
  };

 

  const handleOpenNewChatDialog = async (e) => {

    handleClickNewChat(e)
    // setDialogChatList(!dialogChatList);
    // const result = await handleCheckCreditsIsEnough();
    // setCheckCreditsIsEnoughResult(result);
  };

  // const handleClickOpenChatUI = (
  //   event: React.MouseEvent<HTMLButtonElement>,
  //   newAiChatSession
  // ) => {
  //   setCurrentChatSession(newAiChatSession);
  //   store.dispatch(handleSetIsPanMode(false));
  //   dispatch(handleSetOpenTemplate(false));
  //   AIService.getInstance().InitializeChatSessionByID(
  //     newAiChatSession._id,
  //     userInfo.userId
  //   );
  //   BoardService.getInstance().resetBoardMenuEvents();
  //   setTimeout(() => window.dispatchEvent(new CustomEvent('resize')), 0);
  //   dispatch(handleOpenChatUI(true));

  //   store.dispatch(handleSetDrawingEraseMode(false));
  //   store.dispatch(handleSetBoardPanelClicked(false));
  //   //  if (!isOpenChatUI) {
  //   //    dispatch(handleOpenChatUI(true));

  //   //    store.dispatch(handleSetDrawingEraseMode(false));
  //   //    store.dispatch(handleSetBoardPanelClicked(false));
  //   //  } else {
  //   //    dispatch(handleOpenChatUI(false));
  //   //  }
  //   // dispatch(changeMode('resource'));
  // };

  const handleCloseNewChatDialog = () => {
    setDialogChatList(false);
    setCurrentChatSession(null);
  };

   

  const handleClickNewChat = async e => {
    dispatch(handleSetShowMobileAiChatLoading(false));
    const userId = userInfo.userId;
    const orgId = orgInfo.orgId;
    const includeContext = true;
    const gptModel = userInfo.status == 'free'? 'gpt-3.5-turbo' : 'gpt-4';

    const sessiondata = await AIService.getInstance().createNewChatSession(userId, orgId, includeContext, gptModel)

  };

  const handleClickChatSession = async (e, chatSession) => {
    dispatch(handleSetShowMobileAiChatLoading(false));
    AIService.getInstance().InitializeChatSessionByID(
      chatSession._id,
      userInfo.userId
    );
  };

  const handleClickOpenChatAITouchSettings = () => {
    setOpenChatAITouchSettings(true);
  }

  return (
    <>
      <Tooltip title={'AI Assistant Chatbot'} placement="top" arrow>
        <ToggleButton
          id="MenuChatAI"
          selected={isOpenChatUI}
          value="resource"
          onClick={() => { history.push('/aiassistant') }}
          style={props.style}
        >

          <img
            style={{ width: '28px', height: '28px' }}
            src="/images/aiChat/ChatAI.png"
          />
        </ToggleButton>
      </Tooltip>

      <Dialog
        open={dialogChatList}
        sx={{
          paper: {
            overflowY: 'hidden',
            borderRadius: '0px'
          }
        }}
        onClose={handleCloseNewChatDialog}
        fullScreen={store.getState().system.currentUIType === 'mobile'}
      >
        <DialogTitle
          sx={{
            p: '14px 10px 0px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ChatAIIcon20x20 />
            <Button
              sx={{
                fontFamily: 'Inter',
                fontStyle: 'normal',
                fontWeight: 600,
                fontSize: '14px',
                lineHeight: '20px',
                letterSpacing: '0.15px',
                color: '#F21D6B !important',
                marginLeft: '10px',
                padding: 0
              }}
              onClick={handleClickNewChat}
              variant="text"
            >
              {t('chatAi.startANewChat')}
            </Button>
          </Box>
          <IconButton onClick={handleCloseNewChatDialog}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Divider sx={{ m: '8px 0' }} />
        <Box sx={{ overflowY: 'scroll' }}>
          <Typography sx={{
            fontFamily: 'Inter',
            fontStyle: 'normal',
            fontWeight: 500,
            fontSize: '14px',
            lineHeight: '157%',
            letterSpacing: '0.1px',
            color: 'rgba(58, 53, 65, 0.87)',
            padding: '0px 20px'
          }}>
            {t('chatAi.orContinueWithPreviousChat')}
          </Typography>
          <Box>
            {chatSessionList
              ?.slice(0, isLoadMore ? chatSessionList.length : 6)
              .map(chatSession => {
                return (
                  <MenuItem
                    sx={{
                      padding: '8px 20px',
                      backgroundColor: currentChatSession &&
                        chatSession._id === currentChatSession._id ? '#F2F2F3' : '#ffffff'
                    }}

                    key={chatSession._id}
                    onClick={e => {
                      handleClickChatSession(e, chatSession);
                    }}
                  >
                    <ListItemIcon>
                      {chatSession &&
                        chatSession.promptPersonaIconLink &&
                        chatSession.promptPersonaIconLink !== '' ? (
                        <img
                          src={chatSession.promptPersonaIconLink}
                          style={{ width: '20px', height: '20px' }}
                        />
                      ) : (
                        <ChatAIIcon20x20v3
                          fill={
                            currentChatSession &&
                              chatSession._id === currentChatSession._id
                              ? '#3A3541'
                              : 'black'
                          }
                          fillOpacity={
                            currentChatSession &&
                              chatSession._id === currentChatSession._id
                              ? '0.87'
                              : '0.48'
                          }
                        />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      sx={{
                        fontFamily: 'Inter',
                        fontStyle: 'normal',
                        fontWeight: 400,
                        fontSize: '14px',
                        lineHeight: '20px',
                        letterSpacing: '0.15px',
                        color: 'rgba(58, 53, 65, 0.87)',
                        overflow: 'hidden',
                        maxWidth: '135px',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {chatSession.name}
                    </ListItemText>
                    <Typography
                      sx={{
                        fontFamily: 'Inter',
                        fontStyle: 'normal',
                        fontWeight: 400,
                        fontSize: '12px',
                        lineHeight: '15px',
                        color: 'rgba(0, 0, 0, 0.4)'
                      }}
                      variant="body2"
                      color="text.secondary"
                    >
                      {new Date(chatSession.createdAt).toLocaleDateString(
                        'en-US',
                        {
                          month: '2-digit',
                          day: '2-digit',
                          year: 'numeric'
                        }
                      )}
                    </Typography>
                  </MenuItem>
                );
              })}
          </Box>
        </Box>
        <Divider sx={{ m: '8px 12px' }} />
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="text"
            sx={{
              fontFamily: 'Inter',
              fontStyle: 'normal',
              fontWeight: 400,
              fontSize: '12px',
              lineHeight: '20px',
              textAlign: 'center',
              letterSpacing: '0.4px',
              color: '#F21D6B'
            }}
            onClick={() => setIsLoadMore(!isLoadMore)}
          >
            {isLoadMore ? t('chatAi.fold') : t('chatAi.loadMore')}
          </Button>
        </Box>
      </Dialog>

      <Dialog
        open={isOpenChatUI}
        sx={{
          paper: {
            backgroundColor: '#F9FAFC',
            borderRadius: '0px'
          }
        }}
        fullScreen={store.getState().system.currentUIType === 'mobile'}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            borderBottom: '1px solid rgba(58, 53, 65, 0.12)',
            padding: '18px 16px 6px',
            boxSizing: 'border-box',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
          id="customized-dialog-title"
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton sx={{
              width: '40px',
              height: '40px',
              cursor: 'pointer',
              padding: 0,
              margin: 0
            }} onClick={handleGoBack}>
              <ChevronLeftIcon />
            </IconButton>
            <Typography sx={{
              fontStyle: 'normal',
              fontWeight: 600,
              fontSize: '16px',
              lineHeight: '24px',
              letterSpacing: '0.15px',
              color: 'rgba(58, 53, 65, 0.87)',
              maxWidth: '160px',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              marginLeft: '12px'
            }}>
              {currentChatSession
                ? currentChatSession.name
                : 'Boardx AI Assistant'}
            </Typography>
          </Box>

          <IconButton
            style={{
              padding: 0,
              width: '36px',
              height: '36px'
            }}
            onClick={handleClickOpenChatAITouchSettings}
          >
            <SettingsIcon />
          </IconButton>
        </DialogTitle>

        <ChatDialogContent
          currentChatSession={currentChatSession}
          chatType={chatType}
          checkCreditsIsEnoughResult={checkCreditsIsEnoughResult}
        />

        <ChatAITouchSettings
          openChatAITouchSettings={openChatAITouchSettings}
          setOpenChatAITouchSettings={setOpenChatAITouchSettings}
          currentChatSession={currentChatSession}
          setCurrentChatSession={setCurrentChatSession}
          chatSessionList={chatSessionList}
      
        />
      </Dialog>
    </>
  );
}

export default MenuChatAITouch;
