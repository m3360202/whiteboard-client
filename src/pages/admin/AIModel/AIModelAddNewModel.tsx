//** Import react
import React, { useRef, Component, useEffect, useState } from 'react';

import { styled } from '@mui/material/styles';

//** Import Redux kit
import { useAdminAddAiModelMutation } from '../../../redux/AiAssistApiSlice';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

//** Import i18n
import { useTranslation } from 'react-i18next';

//** Import services
import { UtilityService } from '../../../services';

import store from '../../../store';

const PREFIX = 'AIModelAddNewModel';

const classes = {
  inputBox: `${PREFIX}-inputBox`,
  inputTitle: `${PREFIX}-inputTitle`,
  textFieldRoot: `${PREFIX}-textFieldRoot`,
  saveAndPreview: `${PREFIX}-saveAndPreview`,
  selecIcon: `${PREFIX}-selecIcon`,
  select: `${PREFIX}-select`
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
  }
}));

export default function AIModelAddNewModel({
  openAddNewModelDialog,
  handleCloseAddNewModelDialog
}) {

  const { t } = useTranslation();
  const valueRefName:any = useRef(''); //creating a refernce for TextField Component

  const [adminAddAiModel, { isError, isSuccess, isLoading }] =
    useAdminAddAiModelMutation();

  const handleAddCommand = async () => {
    if (
      valueRefName.current.value === ''
    ) {
      Boardx.Util.Msg.info(t('adminPage.pleaseFillAllFields'));
      return;
    }

    const data = {
      _id: UtilityService.getInstance().generateWidgetID(),
      name: valueRefName.current.value,
      status: 'Draft',
      model: 'ada',
      n_epochs: 4,
      batch_size: null,
      learning_rate_multiplier: null,
      prompt_loss_weight: 0.01,
      compute_classification_metrics: false,
      classification_n_classes: null,
      classification_positive_class: null,
      classification_betas: null,
      suffix: null,
      createdAt: new Date(),
      createUser: store.getState().user.userInfo.userName,
      createUserId: store.getState().user.userInfo.userId,
      lastUpdateUser: store.getState().user.userInfo.userName,
      lastUpdateUserId: store.getState().user.userInfo.userId,
      lastUpdateAt: new Date()
    };

    await adminAddAiModel({ modelData: data });
    Boardx.Util.Msg.info(t('adminPage.addSuccessfully'));
    handleCloseAddNewModelDialog();
    // Boardx.Util.Msg.info(err.reason);
  };

  return (
    <StyledDialog open={openAddNewModelDialog} onClose={handleCloseAddNewModelDialog}>
      <DialogContent>
        {/* Name */}
        <Box className={classes.inputBox}>
          <Typography className={classes.inputTitle} variant="body1">
            NAME
          </Typography>
          <TextField
            autoFocus
            id="name"
            inputRef={valueRefName}
            placeholder="name"
            type="text"
            variant="outlined"
            classes={{ root: classes.textFieldRoot }}
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
