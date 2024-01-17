//** Import react
import React, { useEffect, useState } from 'react';

import { styled } from '@mui/material/styles';

//** Import i18n
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import axios from 'axios';

import { AIService } from '../../services';

import { CLOUD_FUNCTION_URL } from '../../startup/serverConnect';

const PREFIX = 'AIAssistantPromptTeamsPreview';

const classes = {
  inputBox: `${PREFIX}-inputBox`,
  inputTitle: `${PREFIX}-inputTitle`,
  executeButton: `${PREFIX}-executeButton`,
  textareaAutosize: `${PREFIX}-textareaAutosize`,
  textAreaStyle: `${PREFIX}-textAreaStyle`
};

const StyledBox = styled(Box)((
  { theme }
) => ({
  [`& .${classes.inputBox}`]: {
    marginTop: '12px'
  },

  [`& .${classes.inputTitle}`]: {
    fontWeight: 600,
    fontSize: '12px',
    lineHeight: '15px',
    marginBottom: '6px'
  },

  [`& .${classes.executeButton}`]: {
    color: '#1976d2',
    border: '1px solid rgba(25, 118, 210, 0.5)',
    background: 'none !important',
    fontSize: '14px',
  },

  [`& .${classes.textareaAutosize}`]: {
    width: '100%',
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: '16px',
    lineHeight: '24px',
    color: 'rgba(58, 53, 65, 0.68)'
  },

  [`& .${classes.textAreaStyle}`]: {
    width: '100%',
    resize: 'none',
    border: '1px solid rgba(0, 0, 0, 0.23)',
    fontSize: '16px',
    fontWeight: 400,
    lineHeight: '24px',
    letterSpacing: '0.15px',
    padding: '5px',
    overflow: 'unset !important'
  }
}));

const AIAssistantPromptTeamsPreview = ({ currentRowData }) => {

  const { t } = useTranslation();
  const [resultsContent, setResultsContent] = useState('');
  const [targetContent, setTargetContent] = useState('');
  const [loadingExecute, setLoadingExecute] = useState(false);

  useEffect(() => {
    setResultsContent('');
  }, [currentRowData]);

  useEffect(() => {
    if (localStorage.getItem('targetContent')) {
      setTargetContent(localStorage.getItem('targetContent'));
    }
  }, []);

  const handleUseAiDiverge = async (commandData, prompt) => {

    let response = null;

    try {

      response = await AIService.getInstance().handleRequestAIWidget(commandData.gptModel, commandData.command, targetContent, commandData.temperature, commandData.customizedContentOutputFormat);
      const result = getDivergeResult(response.data);

      setResultsContent(result);
      setLoadingExecute(false);
    } catch (error) {
      Boardx.Util.Msg.clear();

      Boardx.Util.Msg.warning(error);

    }



  };

  const handleUseAiConverge = async (commandData, prompt) => {
    let response = null;
    try {
      response = await AIService.getInstance().handleRequestAIWidget(commandData.gptModel, commandData.command, targetContent, commandData.temperature, commandData.customizedContentOutputFormat);
      const content = response.data.content;
      setResultsContent(content);
      setLoadingExecute(false);
    } catch (error) {
      Boardx.Util.Msg.clear();
      Boardx.Util.Msg.warning(response.data.error);
      return;
    }
  };

  const handleExecutePreview = () => {
    if (targetContent.trim() === '') {
      Boardx.Util.Msg.info(
        t('components.aiAssist.aiCreateContent.tipContent')
      );
      return;
    }
    setLoadingExecute(true);
    const commandData = {
      ...currentRowData,
      targetContent: targetContent
    };

    const prompt = generatePrompt(commandData);

    if (commandData.type) {
      if (commandData.type.toLocaleLowerCase() === 'diverge') {
        handleUseAiDiverge(commandData, prompt);
      } else {
        handleUseAiConverge(commandData, prompt);
      }
    } else {
      handleUseAiDiverge(commandData, prompt);
    }
  };

  const getDivergeResult = function (data) {
    let result = data.content;
    let arr = result.split('\n');

    arr = arr.filter(obj => obj.trim().length > 0);
    arr = arr.map((item, index) => `${index + 1}、 ${item}`).join('\n');
    return arr;
  };

  const generatePrompt = commandData => {
    const text = targetContent;
    if (!text) return;
    const command = commandData.command.replace('{input}', text);
    return command;
  };

  return (
    <StyledBox>
      {/* target content */}
      <Box className={classes.inputBox}>
        <Typography className={classes.inputTitle} variant="body1">
          {t('promptManagement.targetPrompt')}
        </Typography>
        <TextareaAutosize
          className={classes.textAreaStyle}
          autoFocus
          value={targetContent}
          onChange={e => {
            setTargetContent(e.target.value);
            localStorage.setItem('targetContent', e.target.value);
          }}
          placeholder={t('promptManagement.pleaseEnterContent')}
        />
      </Box>
      <Box
        sx={{ display: 'flex', justifyContent: 'flex-end' }}
        className={classes.inputBox}
      >
        <LoadingButton
          loading={loadingExecute}
          className={classes.executeButton}
          onClick={handleExecutePreview}
          variant="outlined"
        >
          {t('promptManagement.execute')}
        </LoadingButton>
      </Box>
      <Box className={classes.inputBox}>
        <Typography className={classes.inputTitle} variant="body1">
          {t('promptManagement.results')}
        </Typography>
        <TextareaAutosize
          disabled
          className={classes.textareaAutosize}
          value={resultsContent}
          maxRows={20}
          minRows={10}
        />
      </Box>
    </StyledBox>
  );
}

export default AIAssistantPromptTeamsPreview;