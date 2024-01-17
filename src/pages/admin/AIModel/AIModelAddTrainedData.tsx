//** Import react
import React, { useState } from 'react';

import { styled } from '@mui/material/styles';

//** Import Redux kit
import { useAdminAddAiModelTrainedMutation } from '../../../redux/AiAssistApiSlice';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';

//** Import i18n
import { useTranslation } from 'react-i18next';

//** Import services
import { UtilityService } from '../../../services';

import store from '../../../store';

const PREFIX = 'AIModelAddTrainedData';

const classes = {
  inputBox: `${PREFIX}-inputBox`,
  inputTitle: `${PREFIX}-inputTitle`,
  textFieldRoot: `${PREFIX}-textFieldRoot`,
  saveAndPreview: `${PREFIX}-saveAndPreview`,
  selecIcon: `${PREFIX}-selecIcon`,
  select: `${PREFIX}-select`,
  textAreaStyle: `${PREFIX}-textAreaStyle`
};

const StyledDialog = styled(Dialog)(({ theme }) => ({
  [`& .${classes.inputBox}`]: {
    marginTop: '12px'
  },

  [`& .${classes.inputTitle}`]: {
    fontWeight: 600,
    fontSize: '12px',
    lineHeight: '15px',
    marginBottom: '6px'
  },

  [`& .${classes.textFieldRoot}`]: {
    width: '500px',
    '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#F21D6B'
    }
  },

  [`& .${classes.saveAndPreview}`]: {
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

  [`& .${classes.selecIcon}`]: {
    color: '#150D33'
  },

  [`& .${classes.select}`]: {
    padding: '8px 17px',
    fontSize: '14px',
    border: '1px solid #908EA5',
    borderRadius: '6px',
    color: '#908EA5'
  },

  [`& .${classes.textAreaStyle}`]: {
    width: '500px',
    resize: 'none',
    border: '1px solid rgba(0, 0, 0, 0.23)',
    fontSize: '16px',
    fontWeight: 400,
    fontFamily: 'Roboto',
    lineHeight: '24px',
    letterSpacing: '0.15px',
    padding: '5px'
  }
}));

export default function AIModelAddTrainedData({
  openAddNewRowDialog,
  handleCloseAddNewRowDialog,
  currentModelData
}) {

  const { t } = useTranslation();
  const [propmpt, setPropmpt] = useState('');
  const [completion, setCompletion] = useState('');

  const [adminAddAiModelTrained] = useAdminAddAiModelTrainedMutation();

  const handleAddCommand = async () => {
    if (!currentModelData) {
      Boardx.Util.Msg.info(t('adminPage.pleaseSelectAModel'));
      return;
    }

    if (propmpt === '') {
      Boardx.Util.Msg.info(t('adminPage.pleaseFillAllFields'));
      return;
    }

    const data = {
      _id: UtilityService.getInstance().generateWidgetID(),
      modelId: currentModelData._id,
      prompt: propmpt,
      completion: completion,
      createdAt: new Date(),
      createUser: store.getState().user.userInfo,
      createUserId: store.getState().user.userInfo.userId,
      lastUpdateUser: store.getState().user.userInfo.userName,
      lastUpdateUserId: store.getState().user.userInfo.userId,
      lastUpdateAt: new Date()
    };
    await adminAddAiModelTrained({ modelTrainedData: data });
    Boardx.Util.Msg.info(t('adminPage.addSuccessfully'));
    handleCloseAddNewRowDialog();
    // Boardx.Util.Msg.info(err.reason);
  };

  return (
    <StyledDialog open={openAddNewRowDialog} onClose={handleCloseAddNewRowDialog}>
      <DialogContent>
        {/* Prompt */}
        <Box className={classes.inputBox}>
          <Typography className={classes.inputTitle} variant="body1">
            PROMPT
          </Typography>
          <TextareaAutosize
            className={classes.textAreaStyle}
            autoFocus
            id="prompt"
            placeholder="prompt"
            onChange={e => setPropmpt(e.target.value)}
          />
        </Box>

        {/* Completion */}
        <Box className={classes.inputBox}>
          <Typography className={classes.inputTitle} variant="body1">
            COMPLETION
          </Typography>
          <TextareaAutosize
            id="completion"
            className={classes.textAreaStyle}
            placeholder="completion"
            onChange={e => setCompletion(e.target.value)}
          />
        </Box>
      </DialogContent>

      {/* save button */}
      <DialogActions
        className={classes.inputBox}
        sx={{ display: 'flex', justifyContent: 'flex-end' }}
      >
        <Button
          className={classes.saveAndPreview}
          variant="contained"
          onClick={handleAddCommand}
        >
          Save
        </Button>
      </DialogActions>
    </StyledDialog>
  );
}
