//** Import react
import React, { useState } from 'react';
import { styled } from '@mui/material/styles';

//** Import i18n
import { useTranslation } from 'react-i18next';

//** Import Redux kit
import store, { RootState } from '../../store';
import { handleOpenChatUI } from '../../store/sideBar';
import { useSelector, useDispatch } from 'react-redux';
import { handleSetOpenTemplate } from '../../store/resource';
import {
  handleSetIsPanMode,
  handleSetBoardPanelClicked,
  handleSetDrawingEraseMode,
  handleSetShowAiChatLoading
} from '../../store/board';
import { changeMode } from '../../store/mode';
import { handleSetAiToolBar } from '../../store/domArea';
 import AIService from '../../services/AIService';
import {
  handleSetShowChatAiMaskingLayer
} from '../../store/AIAssist';

//** Import Material UI
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';
import Popover from '@mui/material/Popover';
import clsx from 'clsx';
import SettingsIcon from '@mui/icons-material/Settings';

//** Import MUI Icons
import ChatAIIcon20x20 from '../../mui/icons/ChatAIIcon20x20';
import ChatAIIcon20x20v2 from '../../mui/icons/ChatAIIcon20x20v2';

//**Import Services
import { BoardService, UtilityService } from '../../services';



function AIAssistanChatRecordList(props) {
  const { setOpenChatAISettings, currentSessionName } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [openPopover, setOpenPopover] = useState(false);

  const board = useSelector((state: RootState) => state.board.board);
  const roomInfo = useSelector((state: RootState) => state.room.roomInfo);
  const orgInfo = useSelector((state: RootState) => state.org.orgInfo);
  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  const chatSessionList = useSelector(
    (state: RootState) => state.AIAssist.chatSessionList || []
  );

  const currentChatSession: any = useSelector(
    (state: RootState) => state.AIAssist.currentChatSession
  );


  const handleClickOpenPopover = () => {
    setOpenPopover(true);
    dispatch(handleSetShowChatAiMaskingLayer(true));
  };

  const handleClosePopover = () => {
    setOpenPopover(false);
    dispatch(handleSetShowChatAiMaskingLayer(false));
    dispatch(changeMode('default'));
    dispatch(handleSetAiToolBar(false));
  };

  const handleClickChatSession = async (e, chatSession) => {
    handleClosePopover();
    dispatch(handleSetShowAiChatLoading(false));
    AIService.getInstance().loadChatSession(chatSession);
 
  };

  const handleClickNewChat = async e => {
    dispatch(handleSetShowAiChatLoading(false));
    const userId = userInfo.userId;
    const orgId = orgInfo.orgId;
    const includeContext = true;
    const gptModel = userInfo.status == 'free'? 'gpt-3.5-turbo' : 'gpt-4';

    const sessiondata = await AIService.getInstance().createNewChatSession(userId, orgId, includeContext, gptModel)
    setOpenPopover(false);

  };

 

  const handleClickOpenChatAISettings = () => {
    setOpenChatAISettings(true);
    dispatch(handleSetShowChatAiMaskingLayer(true));
  };

  return (
    <Box>
      <Box id="ChatSessionList" sx={{ width: '180px', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <Typography sx={{
          fontWeight: 600,
          fontSize: '16px',
          lineHeight: '19px',
          // color: '#FFFFFF',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          letterSpacing: '0.15px',
          overflow: 'hidden',
          minWidth: '120px',
          maxWidth: '160px',
          cursor: 'pointer'
        }} variant="body1" onClick={handleClickOpenPopover}>
          {currentChatSession?.name}
        </Typography>
        <IconButton
          sx={{
            width: '32px',
            height: '32px',
            marginRight: '6px'
          }}
          onClick={handleClickOpenPopover}
        >
          <ExpandMoreIcon sx={{}} />
        </IconButton>

      </Box>

      <Popover
        open={openPopover}
        onClose={handleClosePopover}
        anchorEl={document.getElementById('ChatSessionList')}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        sx={{ marginTop: '40px' }}
      >
        <Box
          sx={{
            overflowY: 'scroll',
            width: '300px',
            maxHeight: '350px',
            pt: '10px',
            pl: '6px',
            overflowX: 'hidden'
          }}
        >
          {chatSessionList?.map(chatSession => {
            return (
              <MenuItem
                sx={{
                  backgroundColor: chatSession?._id === currentChatSession?._id ? '#D3F4F4' : 'transparent',

                  root: {
                    padding: '8px 20px',
                    overflowX: 'hidden',
                 
                  }
                }}


                key={chatSession._id}
                onClick={e => {
                  handleClickChatSession(e, chatSession);
                }}
              >
                <ListItemIcon>
                  {chatSession &&
                    chatSession.promptPersonaData &&
                    chatSession.promptPersonaData.icon &&
                    chatSession.promptPersonaData.icon.length > 0 ? (
                    <img
                      src={chatSession.promptPersonaData.icon}
                      style={{ width: '20px', height: '20px' }}
                    />
                  ) : (
                    <ChatAIIcon20x20v2 />
                  )}
                </ListItemIcon>
                <ListItemText
                  sx={{
                    primary: {
                      fontStyle: 'normal',
                      fontWeight: 400,
                      fontSize: '14px',
                      lineHeight: '20px',
                      letterSpacing: '0.15px',
                      color: chatSession._id === currentChatSession._id ? 'rgba(58, 53, 65, 0.87)' : 'rgba(0, 0, 0, 0.48)',
                      overflow: 'hidden',
                      maxWidth: '135px',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',

                    }
                  }}

                >
                  {chatSession.name}
                </ListItemText>
                {/* <Typography
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
                  {new Date(chatSession.createdAt).toLocaleDateString('en-US', {
                    month: '2-digit',
                    day: '2-digit',
                    year: 'numeric'
                  })}
                </Typography> */}
              </MenuItem>
            );
          })}
        </Box>

        <Box
          sx={{
            p: '0 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mt: '8px',
            borderTop: '1px solid rgba(0, 0, 0, 0.12)'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <ChatAIIcon20x20 />
            <Button
              sx={{
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

          <IconButton
            style={{
              padding: 0,
              height: '36px'
            }}
            onClick={handleClickOpenChatAISettings}
          >
            <SettingsIcon />
          </IconButton>
        </Box>
      </Popover>
    </Box>
  );
}

export default AIAssistanChatRecordList;
