//** Import react
import React, { useEffect, useState } from 'react';

import { styled } from '@mui/material/styles';

//** Import i18n
import { useTranslation } from 'react-i18next';

import store, { RootState } from '../../../store';
import { useSelector, useDispatch } from 'react-redux';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import axios from 'axios';
import { CLOUD_FUNCTION_URL } from '../../../startup/serverConnect';
import { AIService } from '../../../services';


const PREFIX = 'AIAssistantContentPreview';

const classes = {
  inputBox: `${PREFIX}-inputBox`,
  inputTitle: `${PREFIX}-inputTitle`,
  executeButton: `${PREFIX}-executeButton`,
  textareaAutosize: `${PREFIX}-textareaAutosize`,
  textFieldRoot3: `${PREFIX}-textFieldRoot3`,
  textAreaStyle: `${PREFIX}-textAreaStyle`
};

const StyledBox = styled(Box)(({ theme }) => ({
  padding: '0 20px',

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
    fontWeight: 500,
    fontSize: '14px',
    lineHeight: '24px',
    letterSpacing: '0.4px',
    textTransform: 'uppercase',
    boxShadow: '0px 4px 8px -4px rgba(58, 53, 65, 0.42)',
    borderRadius: '5px',
    padding: '7px 22px !important',
    background: '#F21D6B !important'
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

  [`& .${classes.textFieldRoot3}`]: {
    '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#F21D6B'
    }
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

export default function AIAssistantContentPreview(props) {

  const { t } = useTranslation();
  const [resultsContent, setResultsContent] = useState('');
  const [targetContent, setTargetContent] = useState('');
  const [loadingExecute, setLoadingExecute] = useState(false);

  const currentRowData = useSelector(
    (state: RootState) => state.AIAssist.currentAdminAiPromptData
  );

  useEffect(() => {
    setResultsContent('');
  }, [currentRowData]);

  useEffect(() => {
    if (localStorage.getItem('targetContent')) {
      setTargetContent(localStorage.getItem('targetContent'));
    }
  }, []);

  /**
   * Handles the use of the AI Diverge feature by making a POST request to the AI API.
   *
   * @param {object} commandData - The data related to the AI command being used.
   * @param {string} prompt - The input prompt for the AI Diverge request.
   */
  const handleUseAiDiverge = async (commandData, prompt) => {

    let response = null;

    try {
      response = await AIService.getInstance().handleRequestAIWidget(commandData.gptModel, commandData.command, targetContent, commandData.temperature, commandData.customizedContentOutputFormat);

      // Extract the result from the response data.
      const result = getDivergeResult(response.data);
      // Set the results content, mark loading as complete, and display an info message.
      setResultsContent(result);
      setLoadingExecute(false);

    } catch (error) {
      // Handle any errors that occur during the request and display a warning message.
      Boardx.Util.Msg.clear();

      Boardx.Util.Msg.warning(error);
    }

  };

  /**
   * Handles the use of the AI Converge feature by making a POST request to the AI API.
   *
   * @param {object} commandData - The data related to the AI command being used.
   * @param {string} prompt - The input prompt for the AI Converge request.
   */
  const handleUseAiConverge = async (commandData, prompt) => {

    let response = null;

    try {

      response = await AIService.getInstance().handleRequestAIWidget(commandData.gptModel, commandData.command, targetContent, commandData.temperature, commandData.customizedContentOutputFormat);
      // Extract the content from the response data.
      const content = response?.data?.content;
      // Set the results content, mark loading as complete, and display an info message.
      setResultsContent(content);
      setLoadingExecute(false);
    } catch (error) {
      // Handle any errors that occur during the request and display a warning message.
      Boardx.Util.Msg.clear();
      Boardx.Util.Msg.warning(error);
    }

  };

  /**
   * Handles the execution of a preview for the AI command based on the provided target content.
   */
  const handleExecutePreview = () => {
    // Check if the target content is empty.
    if (targetContent.trim() === '') {
      // Display an info message if the target content is empty.
      Boardx.Util.Msg.info(
        t('components.aiAssist.aiCreateContent.tipContent')
      );
      return;
    }

    // Set loading state to indicate the execution is in progress.
    setLoadingExecute(true);

    // Create the command data object by merging the currentRowData with the targetContent.
    const commandData = {
      ...currentRowData,
      targetContent: targetContent
    };

    // Check the type of command and execute either AI Diverge or AI Converge accordingly.
    if (commandData.type) {
      if (commandData.type.toLocaleLowerCase() === 'diverge') {
        handleUseAiDiverge(commandData, targetContent);
      } else {
        handleUseAiConverge(commandData, targetContent);
      }
    } else {
      // Default to AI Diverge if no specific type is provided.
      handleUseAiDiverge(commandData, targetContent);
    }
  };

  /**
   * Extracts and formats the content from a diverge response for display.
   *
   * @param {object} data - The data containing diverge content.
   * @returns {string} - The formatted diverge content.
   */
  const getDivergeResult = function (data) {
    // Extract the content from the data.
    let result = data.content;

    // Split the content into an array using line breaks.
    let arr = result.split('\n');

    // Remove line breaks, numbered list indicators, and empty lines.
    arr = arr.map(obj =>
      obj
        .replace('\n', '')
        .replace('1. ', '')
        .replace('2. ', '')
        .replace('3. ', '')
        .replace('4. ', '')
        .replace('5. ', '')
        .replace('6. ', '')
        .replace('7. ', '')
        .replace('8. ', '')
        .replace('9. ', '')
        .replace('10. ', '')
    );

    // Filter out empty lines.
    arr = arr.filter(obj => obj.trim().length > 0);

    // Add numbered list markers and join the lines back together.
    arr = arr.map((item, index) => `${index + 1}、 ${item}`).join('\n');

    // Return the formatted diverge content.
    return arr;
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
