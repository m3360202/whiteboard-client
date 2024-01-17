//** Import react
import React, { useState } from 'react';

import { styled } from '@mui/material/styles';

//** Import i18n
import { useTranslation } from 'react-i18next';

//** Import Redux kit
import store, { RootState } from '../../store';
import { useSelector, useDispatch } from 'react-redux';
import {
  useGetAllAiAgentListQuery,
  useDeleteAiAgentMutation,
 
} from '../../redux/AiAssistApiSlice';
import { handleSetCurrentAgent } from '../../store/AIAssist';
import { handleSetAIChatRows } from '../../store/AIAssist';

import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import Box from '@mui/material/Box';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AIService from '../../services/AIService';
import { BoardService } from '../../services';

import AIAgent from 'components/agent/AIAgent';

const AppsStoreAIAgentPage = props => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [openAiAgentDialog, setOpenAiAgentDialog] = useState(false);

  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  const agentType='personal';

  const { data: agentData = [] } = useGetAllAiAgentListQuery(
    { orgId: store.getState().org.orgInfo.orgId, type: 'personal'}
  );
  const [deleteAiAgent] = useDeleteAiAgentMutation();

  const handleCreateAiAgent = () => {
    //if user is free user prompt user to upgrad to pro users
    if (userInfo && userInfo.status === 'free') {
      alert('Please upgrade to Pro user to create an agent.');
      return;
    }

    setOpenAiAgentDialog(true);
    dispatch(handleSetCurrentAgent(null));
    dispatch(handleSetAIChatRows([]));
  };

  const handleClickDeleteAiAgent = async (event, aiAgent) => {
    event.stopPropagation();
    let text = 'Confirm to delete the agent: ' + aiAgent.name + '?';

    if (confirm(text) === false) {
      return;
    }

    await deleteAiAgent({ agentId: aiAgent._id });
  };

  const handleClickUpdateAiAgent = aiAgent => {
    dispatch(handleSetAIChatRows([]));
    dispatch(handleSetCurrentAgent(aiAgent));
    setOpenAiAgentDialog(true);

    const chatSessionId = aiAgent.chatSessionId ? aiAgent.chatSessionId : '';
    AIService.getInstance().InitializeChatSessionByID(
      chatSessionId,
      userInfo.userId
    );
  };

  return (
    <Box sx={{
      flexFlow: 'column',
    }}>
      <Box sx={{margin: '20px'}}>
        <Typography variant="h4">My Agents</Typography>
      </Box>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
      }}>
        <ListItemButton
          sx={{
            m: '3px 10px 3px 0px',
            alignItems: 'flex-start',
            padding: '8px',
            borderRadius: '4px',
            transition: 'none',
            display: 'flex',
            width: '500px',
            '&:hover': {
              backgroundColor: '#EEEEEE'
            }
          }}

          onClick={handleCreateAiAgent}
        >
          <AddCircleOutlineIcon style={{ width: '30px', height: '30px', margin: '20px', alignSelf: 'center' }} />
          <ListItemText
            primary="Create an Agent"
            secondary="Create an Agent"
            sx={{
              fontSize: '12px',
              fontWeight: 500,
              lineHeight: '16px',
              marginLeft: '12px',
              margin: '0px',
              alignSelf: 'center'
            }}

          />
        </ListItemButton>
      </Box>

      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',

      }}>
        {agentData &&
          agentData.map((aiAgent, index) => (
            <ListItemButton
              key={index}
              sx={{
                m: '3px 10px 3px 0px',
                alignItems: 'flex-start',
                // padding: '8px',
                borderRadius: '4px',
                transition: 'none',
                display: 'flex',
                width: '500px',
                '&:hover': {
                  backgroundColor: '#EEEEEE'
                }
              }}

              onClick={() => handleClickUpdateAiAgent(aiAgent)}
            >
              <img
                style={{ width: '32px', height: '32px', margin: '20px' }}
                src={
                  aiAgent.icon ? aiAgent.icon : '/images/android-icon-36x36.png'
                }
                alt="AiAgent icon"
              />
              <ListItemText
                primary={aiAgent.name}
                secondary={aiAgent.description}
                sx={{
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
              <Button
                sx={{ alignSelf: 'center' }}
                onClick={event => handleClickDeleteAiAgent(event, aiAgent)}
              >
                Delete
              </Button>
            </ListItemButton>
          ))}
      </Box>

      <AIAgent
        openAiAgentDialog={openAiAgentDialog}
        setOpenAiAgentDialog={setOpenAiAgentDialog}
        type ={agentType}
      />
    </Box>
  );
};

export default AppsStoreAIAgentPage;
