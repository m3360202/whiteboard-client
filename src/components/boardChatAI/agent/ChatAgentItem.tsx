//** Import react
import React from 'react';

//** Import i18n
import { useTranslation } from 'react-i18next';

//** Import Redux kit
import store, { RootState } from '../../../store';
import { useSelector, useDispatch } from 'react-redux';
import { useUpdateAIChatSessionMutation } from '../../../redux/AiAssistApiSlice';
import { handleSetAiToolBar } from '../../../store/domArea';
import {
  handleSetCurrentChatAiPersonaData,
  handleSetCurrentChatSession,
  handleSetChatSessionList
} from '../../../store/AIAssist';

 

import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';





const ChatAgentItem = props => {
    const { data, dataIndex, handleClose } = props;
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const currentChatSession: any = useSelector(
      (state: RootState) => state.AIAssist.currentChatSession
    );
  
    const chatSessionList = useSelector(
      (state: RootState) => state.AIAssist.chatSessionList
    );
  
    const [updateAIChatSession] = useUpdateAIChatSessionMutation();
  
  
  
    const handleClickSelectPromptPersona = async data => {
      dispatch(handleSetCurrentChatAiPersonaData(data));
  
      const result = await updateAIChatSession({
        aiChatSessionId: currentChatSession._id,
        updateData: {
          promptPersonaData: data
        }
      })
  
      //update current chat session
      dispatch(
        handleSetCurrentChatSession({
          ...currentChatSession,
          promptPersonaData: result
        })
      );
  
      //update chat session list
      const newChatSessionList = chatSessionList.map(item => {
        if (item._id === currentChatSession._id) {
          return {
            ...item,
            promptPersonaData: result
          };
        }
        return item;
      });
      dispatch(handleSetChatSessionList(newChatSessionList));
  
  
      handleClose();
    };
  
    return (
      <ListItemButton
        key={dataIndex}
        onClick={() => handleClickSelectPromptPersona(data)}
        sx={{
          m: '3px 10px 3px 0px',
          alignItems: 'flex-start',
          padding: '8px',
          borderRadius: '4px',
          transition: 'none',
          minWidth: '300px',
          '&:hover': {
            backgroundColor: '#EEEEEE',
            '& #AiFavoriteCommandIcon': {
              display: 'block',
              top: '0px'
            }
          }
        }}
  
      >
        <img
          style={{ width: '32px', height: '32px', alignSelf: 'center', margin: 20 }}
          src={data.icon ? data.icon : '/images/android-icon-36x36.png'}
          alt="command icon"
        />
        <ListItemText
          primary={data.name}
          secondary={data.description}
          sx={{
            // whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            /* letter-spacing: 0.15px; */
            overflow: 'hidden',
  
            root: {
              margin: '0px'
            },
            primary: {
              fontSize: '14px',
  
              fontWeight: 600,
              lineHeight: '16px',
              marginLeft: '12px',
  
            },
            secondary: {
              fontSize: '14px',
              lineHeight: '16px',
              marginTop: '4px',
              marginLeft: '12px'
            }
          }}
  
        />
      </ListItemButton>
    );
  };

  export default ChatAgentItem;