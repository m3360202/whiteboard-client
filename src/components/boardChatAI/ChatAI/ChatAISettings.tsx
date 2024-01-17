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
import {
  handleSetCurrentChatSession,
  handleSetChatSessionList,
  handleSetShowChatAiMaskingLayer
} from '../../../store/AIAssist';

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
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import AIModelSelectComponent from '../AIModelSelectComponent';
import { AIService } from 'services';

 
function ChatAISettings(props) {
  const { openChatAISettings, setOpenChatAISettings } = props;
  const dispatch = useDispatch();


  const valueRefChatName: any = useRef('');
  const { t } = useTranslation();
  const [chatName, setChatName] = React.useState('');
  const [gptModel, setGptModel] = useState('gpt-3.5-turbo');

  const [isIncludeBoardContent, setIsIncludeBoardContent] = useState(true);
  const [systemMessage, setSystemMessage] = useState(
    t('chatAi.youAreBoardXAIAssistantAva')
  );

  const [selectContext, setSelectContext] = useState('0');
  const selectContextList = [
    t('chatAi.noContext'),
    t('chatAi.addVisibleContentAsContext')
  ];

  const isShowCheckBox = location.pathname.includes('/board/');

  const currentChatSession: any = useSelector(
    (state: RootState) => state.AIAssist.currentChatSession
  );

  const chatSessionList = useSelector(
    (state: RootState) => state.AIAssist.chatSessionList
  );

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
    if (currentChatSession.isIncludeBoardContent) {
      setSelectContext('1');
    } else {
      setSelectContext('0');
    }
  }, [currentChatSession]);

  const handleClose = () => {
    setOpenChatAISettings(false);
    store.dispatch(handleSetAiToolBar(false));
    dispatch(handleSetShowChatAiMaskingLayer(false));
  };

  const handleChangeGptModel = (model) => {
    setGptModel(model);
  };

  const handleChangeCurrentChatName = event => {
    setChatName(event.target.value);
  };

  const handleSaveChatSettings = async () => {
    await AIService.getInstance().handleSaveChatSettings(gptModel, chatName, systemMessage, isIncludeBoardContent);
    Boardx.Util.Msg.success(t('chatAi.saveSuccessfully'));

    handleClose();
  };

  return (
    <Dialog
      open={openChatAISettings}
      onClose={handleClose}
      sx={{
        paper: {
          width: '650px',
          maxWidth: '700px'
        }
        
      }}
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
      <DialogContent sx={{ pb: 0, minWidth: 500 }}>
        <Box>
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
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
          </Box>

          {isShowCheckBox && (
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <Select
                fullWidth
                id="avaSelectContext"
                value={selectContext}

                onChange={event => {
                  setSelectContext(event.target.value);
                  if (Number(event.target.value) === 0) {
                    setIsIncludeBoardContent(false);
                  } else {
                    setIsIncludeBoardContent(true);
                  }
                }}
                IconComponent={ExpandMoreIcon}
              >
                {selectContextList && selectContextList.length > 0
                  ? selectContextList.map((item, index) => {
                    return (
                      <MenuItem
                        key={index}
                        sx={{ fontWeight: 'bolder', fontSize: '14px' }}
                        value={index}
                      >
                        {item}
                      </MenuItem>
                    );
                  })
                  : null}
              </Select>
            </Box>
          )}

          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            {/* <Box>
              <Typography sx={{
                fontSize: '14px',
                fontWeight: 'bolder'
              }} variant="body1">
                {t('chatAi.chatModel')}
              </Typography>
            </Box> */}
            <AIModelSelectComponent save={false} changeModel={handleChangeGptModel} />

          </Box>

          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{
                fontSize: '14px',
                fontWeight: 'bolder'
              }} variant="body1">
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
                  maxHeight: '300px',
                  minHeight: '80px',
                  marginTop: '6px',
                  boxSizing: 'border-box'
                }}
                onChange={e => setSystemMessage(e.target.value)}
              />
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          {t('chatAi.cancel')}
        </Button>
        <Button onClick={handleSaveChatSettings} color="primary">
          {t('chatAi.save')}
        </Button>
      </DialogActions>
    </Dialog >
  );
}

export default ChatAISettings;
