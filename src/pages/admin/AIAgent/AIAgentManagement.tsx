//** Import react
import React, { useState } from 'react';

import { styled } from '@mui/material/styles';

//** Import i18n
import { useTranslation } from 'react-i18next';

//** Import Redux kit
import store, { RootState } from '../../../store';
import { useSelector, useDispatch } from 'react-redux';
import {
  useGetAllAiAgentListQuery,
  useDeleteAiAgentMutation
} from '../../../redux/AiAssistApiSlice';
import { handleSetCurrentAgent } from '../../../store/AIAssist';
import { handleSetAIChatRows } from '../../../store/AIAssist';
import { AIService } from '../../../services';

import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import Box from '@mui/material/Box';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

import { BoardService } from '../../../services';

import AIAgent from 'components/agent/AIAgent';

 
const ListItemButtonStyled = styled(ListItemButton)(({ theme }) => ({
  padding: '8px',
  borderRadius: '4px',
  transition: 'none',
  display: 'flex',
  alignItems: 'center',
  '&:hover': {
    backgroundColor: '#EEEEEE'
  }
}));

const ListItemTextStyled = styled(ListItemText)(({ theme }) => ({
  margin: '0px',
  '& .MuiListItemText-primary': {
    fontSize: '12px',
    fontWeight: 500,
    lineHeight: '16px',
    marginLeft: '12px'
  },
  '& .MuiListItemText-secondary': {
    fontSize: '12px',
    lineHeight: '16px',
    marginTop: '4px',
    marginLeft: '12px'
  }
}));

const AIAgentManagement = props => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [openAiAgentDialog, setOpenAiAgentDialog] = useState(false);

  const userInfo = useSelector((state: RootState) => state.user.userInfo);

  const { data: aiAgentData } = useGetAllAiAgentListQuery({type:'standard'});
  const [deleteAiAgent] = useDeleteAiAgentMutation();
  const agentType = "standard"

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
      marginTop: '10px',
      padding: '50px 100px 20px',
      backgroundColor: '#FFFFFF'
    }}>
      <Box>
        <Typography variant="h4">My Agents</Typography>
      </Box>
      <Box>
        <ListItemButton
          sx={{ m: '3px 10px 3px 0px', alignItems: 'flex-start', }}
          onClick={handleCreateAiAgent}
        >
          <AddCircleOutlineIcon style={{ width: '30px', height: '30px' }} />
          <ListItemTextStyled
            primary="Create an Agent"
            secondary="Create an Agent"
          />
        </ListItemButton>
      </Box>

      <Box>
        {aiAgentData &&
          aiAgentData.map((aiAgent, index) => (
            <ListItemButtonStyled
              key={index}
              sx={{ m: '3px 10px 3px 0px', alignItems: 'flex-start' }}
              onClick={() => handleClickUpdateAiAgent(aiAgent)}
            >
              <img
                style={{ width: '32px', height: '32px' }}
                src={
                  aiAgent.icon ? aiAgent.icon : '/images/android-icon-36x36.png'
                }
                alt="AiAgent icon"
              />
              <ListItemTextStyled
                primary={aiAgent.name}
                secondary={aiAgent.description}
              />
              <Button
                onClick={event => handleClickDeleteAiAgent(event, aiAgent)}
              >
                Delete
              </Button>
            </ListItemButtonStyled>
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

export default AIAgentManagement;
