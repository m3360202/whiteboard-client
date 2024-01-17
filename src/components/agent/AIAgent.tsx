//** Import react
import React, { useEffect, useState, useRef } from 'react';
import { styled } from '@mui/material/styles';

//** Import i18n
import { useTranslation } from 'react-i18next';

//** Import Redux kit
import store, { RootState } from 'store';
import { useSelector, useDispatch } from 'react-redux';

//** Import Material UI
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
 

import CreateAIAgent from './CreateAIAgent';
import UpdateAIAgent from './UpdateAIAgent';
import AIAgentChat from './AIAgentChat';
 

function AIAgent(props) {
  const { openAiAgentDialog, setOpenAiAgentDialog, type } = props;
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const handleClickReturn = () => {
    setOpenAiAgentDialog(false);
  };

  const currentAgent = useSelector(
    (state: RootState) => state.AIAssist.currentAgent
  );

  return (
    <Box>
      <Dialog
        id="aiAgentDialog"
        open={openAiAgentDialog}
        BackdropProps={{ invisible: true }}
        disableEnforceFocus={true}
        fullScreen={true}
      >
        <Box sx={{ borderBottom: '1px solid #CCC' }}>
          <IconButton onClick={handleClickReturn}>
            <KeyboardArrowLeftIcon />
          </IconButton>
        </Box>

        <Box sx={{ display: 'flex', height: 'calc(100%  - 45px)' }}>
          <Box
            sx={{
              width: '50%',
              height: '100%',
              borderRight: '1px solid #d5d5d6'
            }}
          >
            {Boolean(currentAgent) ? (
              <UpdateAIAgent type={type} />
            ) : (
              <CreateAIAgent type={type} />
            )}
          </Box>
          <Box
            sx={{
              width: '50%',
              height: '90%',
              borderLeft: '1px solid #d5d5d6'
            }}
          >
            <AIAgentChat />
          </Box>
        </Box>
      </Dialog>
    </Box>
  );
}

export default AIAgent;
