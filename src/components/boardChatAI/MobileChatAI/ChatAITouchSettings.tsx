//** Import react
import React, { useEffect, useState, useRef } from 'react';
import { styled } from '@mui/material/styles';
import { useLocation } from 'react-router-dom';

//** Import i18n
import { useTranslation } from 'react-i18next';

//** Import Redux kit
import store, { RootState } from '../../../store';
import { useSelector, useDispatch } from 'react-redux';
import { useUpdateAIChatSessionMutation } from '../../../redux/AiAssistApiSlice';
import { handleSetAiToolBar } from '../../../store/domArea';

import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import MenuItem from '@mui/material/MenuItem';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import Checkbox from '@mui/material/Checkbox';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';

//** Import components
import ChatPromptPersonaListTouch from './ChatPromptPersonaListTouch';
import AIModelSelectComponent from '../AIModelSelectComponent';

import {
  handleSetCurrentChatAiPersonaData,
  handleSetCurrentChatSession,
  handleSetChatSessionList
} from '../../../store/AIAssist';

const StyledBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '20px'
}))


const ChatAITouchSettings = props => {
  const {
    openChatAITouchSettings,
    setOpenChatAITouchSettings,
    currentChatSession,
    setCurrentChatSession,
    chatSessionList,
    setChatSessionList
  } = props;

  const valueRefChatName: any = useRef('');
  const { t } = useTranslation();
  const [chatName, setChatName] = React.useState('');
  const [gptModel, setGptModel] = useState('gpt-3.5-turbo');
  const [openPromptPersonaSelectDialog, setOpenPromptPersonaSelectDialog] =
    useState(false);
  const [isIncludeBoardContent, setIsIncludeBoardContent] = useState(true);
  const [promptPersonaIconLink, setPromptPersonaIconLink] = useState('');
  const [promptPersonaDescription, setPromptPersonaDescription] = useState('');
  const [systemMessage, setSystemMessage] = useState(
    t('chatAi.youAreBoardXAIAssistantAva')
  );

  const isShowCheckBox = location.pathname.includes('/board/');

  useEffect(() => {
    setChatName(currentChatSession.name || '');
    setSystemMessage(
      currentChatSession && currentChatSession.systemMessage
        ? currentChatSession.systemMessage
        : t('chatAi.youAreBoardXAIAssistantAva')
    );
    setGptModel(
      currentChatSession && currentChatSession.gptModel
        ? currentChatSession.gptModel
        : 'gpt-3.5-turbo'
    );
    setIsIncludeBoardContent(currentChatSession.isIncludeBoardContent || false);
  }, [currentChatSession]);

  const [updateAIChatSession] = useUpdateAIChatSessionMutation();

  const handleClose = () => {
    setOpenChatAITouchSettings(false);
    store.dispatch(handleSetAiToolBar(false));
  };

  const handleChangeGptModel = (event: SelectChangeEvent) => {
    setGptModel(event.target.value);
  };

  const handleChangeCurrentChatName = event => {
    setChatName(event.target.value);
  };

  const handleSaveChatSetttings = async () => {
    setCurrentChatSession({ ...currentChatSession, gptModel: gptModel });
    handleClose();

    await updateAIChatSession({
      aiChatSessionId: currentChatSession._id,
      updateData: {
        name: chatName,
        gptModel: gptModel,
        systemMessage: systemMessage,
        isIncludeBoardContent: isIncludeBoardContent,
        promptPersonaIconLink: promptPersonaIconLink,
        promptPersonaDescription: promptPersonaDescription
      }
    })
      .unwrap()
      .then(data => {
        setCurrentChatSession({
          ...currentChatSession,
          name: chatName,
          gptModel: gptModel,
          systemMessage: systemMessage,
          isIncludeBoardContent: isIncludeBoardContent,
          promptPersonaIconLink: promptPersonaIconLink,
          promptPersonaDescription: promptPersonaDescription
        });
        let newChatSessionList = [];
        chatSessionList.forEach(item => {
          if (item._id === currentChatSession._id) {
            item = {
              ...item,
              name: chatName,
              gptModel: gptModel,
              systemMessage: systemMessage,
              isIncludeBoardContent: isIncludeBoardContent,
              promptPersonaIconLink: promptPersonaIconLink,
              promptPersonaDescription: promptPersonaDescription
            };
          }
          newChatSessionList.push(item);
        });
        
        store.dispatch(handleSetChatSessionList(newChatSessionList));
        Boardx.Util.Msg.success(t('chatAi.saveSuccessfully'));
      })
      .catch(err => {
        Boardx.Util.Msg.error(t('chatAi.saveFailed'));
        console.log('updateAIChatSession err', err);
      });
  };

  const handleOpenPromptPersonaSelectDialog = () => {
    setOpenPromptPersonaSelectDialog(true);
  };

  const handleChangeIsIncludeBoardContent = bool => {
    setIsIncludeBoardContent(bool);
  };

  return (
    <Dialog
      open={openChatAITouchSettings}
      onClose={handleClose}
      fullScreen={store.getState().system.currentUIType === 'mobile'}
    >
      <DialogTitle sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography sx={{
          fontSize: '16px',
          fontWeight: 'bolder'
        }}>
          {t('chatAi.currentDialogSettings')}
        </Typography>
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ pb: 0 }}>
        <Box>
          <StyledBox>
            <TextField
              sx={{
                '& .MuiInputBase-input': {
                  padding: '10px 17px'
                }
              }}
              fullWidth
              value={chatName}
              id="chatName"
              inputRef={valueRefChatName}
              placeholder={t('promptManagement.name')}
              type="text"
              variant="outlined"
              onChange={event => handleChangeCurrentChatName(event)}
            />
          </StyledBox>

          <StyledBox  >
            <Box>
              <Typography sx={{
                fontSize: '14px',
                fontWeight: 'bolder'
              }} variant="body1">
                {t('chatAi.selectPersonaTips')}
              </Typography>
            </Box>
            <Button
              variant="outlined"
              onClick={handleOpenPromptPersonaSelectDialog}
              sx={{
                color: '#F21D6B',
                background: 'transparent !important',
                border: '1px solid #F21D6B'
              }}
            >
              {t('chatAi.selectPersona')}
            </Button>
          </StyledBox>

          {isShowCheckBox && (
            <StyledBox  >
              <Box>
                <Typography sx={{
                  fontSize: '14px',
                  fontWeight: 'bolder'
                }} variant="body1">
                  {t('chatAi.whetherToIncludeBoardContentAsContext')}
                </Typography>
              </Box>
              <Checkbox
                onChange={e =>
                  handleChangeIsIncludeBoardContent(e.target.checked)
                }
                checked={isIncludeBoardContent}
              />
            </StyledBox>
          )}

          <StyledBox  >
            <Box>
              <Typography sx={{
                fontSize: '14px',
                fontWeight: 'bolder'
              }} variant="body1">
                {t('chatAi.chatModel')}
              </Typography>
            </Box>
            <AIModelSelectComponent save={true} changeModel={() => { }} />
          </StyledBox>

          <StyledBox  >
            <Box sx={{ flex: 1 }}>
              <Typography sx={{}} variant="body1">
                {t('chatAi.Memory.Title')}
              </Typography>
              <TextareaAutosize
                value={systemMessage}
                id="systemText"
                style={{
                  width: '100%',
                  resize: 'none',
                  border: '1px solid rgba(0, 0, 0, 0.23)',
                  fontSize: '16px',
                  fontWeight: 400,
                  lineHeight: '24px',
                  letterSpacing: '0.15px',
                  padding: '5px',
                  overflow: 'unset !important',
                  maxHeight: '260px',
                  minHeight: '80px',
                  marginTop: '6px',
                  boxSizing: 'border-box'
                }}
                onChange={e => setSystemMessage(e.target.value)}
              />
            </Box>
          </StyledBox>
        </Box>
      </DialogContent>
      <DialogActions sx={{ mb: '20px' }}>
        <Button onClick={handleClose} color="primary">
          {t('chatAi.cancel')}
        </Button>
        <Button onClick={handleSaveChatSetttings} color="primary">
          {t('chatAi.save')}
        </Button>
      </DialogActions>

      <ChatPromptPersonaListTouch
        openPromptPersonaSelectDialog={openPromptPersonaSelectDialog}
        setOpenPromptPersonaSelectDialog={setOpenPromptPersonaSelectDialog}
        setSystemMessage={setSystemMessage}
        setPromptPersonaIconLink={setPromptPersonaIconLink}
        setPromptPersonaDescription={setPromptPersonaDescription}
      />
    </Dialog>
  );
};

export default ChatAITouchSettings;
