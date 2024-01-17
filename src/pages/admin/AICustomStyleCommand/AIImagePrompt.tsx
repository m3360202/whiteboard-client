//** Import react
import React, { useEffect, useState, useRef } from 'react';
import { styled } from '@mui/material/styles';

//** Import i18n
import { useTranslation } from 'react-i18next';

//** Import Redux kit
import store, { RootState } from '../../../store';
import { useSelector, useDispatch } from 'react-redux';

//** Import Material UI
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';

import AIAssistantImagesDetails from './AIAssistantImagesDetails';
import AIAssistantImagesPreview from './AIAssistantImagesPreview';

const PREFIX = 'AIImagePrompt';

const classes = {
  dialogPaperFull: `${PREFIX}-dialogPaperFull`
};

const AiImagePromptDialog = styled(Dialog)({
  [`& .${classes.dialogPaperFull}`]: {
    overflow: 'hidden',
    transform: 'translate(0px, 0px) !important',
    borderRadius: '0px'
  }
});

function AIImagePrompt(props) {
  const { openAiImagePromptDialog, setOpenAiImagePromptDialog } = props;
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const handleClickReturn = () => {
    setOpenAiImagePromptDialog(false);
  };

  return (
    <AiImagePromptDialog
      id="aiAgentDialog"
      open={openAiImagePromptDialog}
      BackdropProps={{ invisible: true }}
      disableEnforceFocus={true}
      classes={{
        paper: classes.dialogPaperFull
      }}
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
          <AIAssistantImagesDetails
            setOpenAiImagePromptDialog={setOpenAiImagePromptDialog}
          />
        </Box>
        <Box
          sx={{
            width: '50%',
            height: '100%',
            borderLeft: '1px solid #d5d5d6'
          }}
        >
          <AIAssistantImagesPreview />
        </Box>
      </Box>
    </AiImagePromptDialog>
  );
}

export default AIImagePrompt;
