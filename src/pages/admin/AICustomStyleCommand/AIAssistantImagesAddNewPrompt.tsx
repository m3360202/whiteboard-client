//** Import react
import React, { useRef, Component, useEffect, useState } from 'react';

import { styled } from '@mui/material/styles';

//** Import Redux kit
import store, { RootState } from '../../../store';
import { useAdminAddAiCustomStyleCommandMutation } from '../../../redux/AiAssistApiSlice';
import { useSelector, useDispatch } from 'react-redux';
import { handleSetCurrentAdminAiImagePromptData } from '../../../store/AIAssist';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Switch from '@mui/material/Switch';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

//** Import i18n
import { useTranslation } from 'react-i18next';

//** Import services
import { UtilityService } from '../../../services';

const PREFIX = 'AIAssistantImagesAddNewPrompt';

const classes = {
  inputBox: `${PREFIX}-inputBox`,
  inputTitle: `${PREFIX}-inputTitle`,
  textFieldRoot: `${PREFIX}-textFieldRoot`,
  saveAndPreview: `${PREFIX}-saveAndPreview`
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
  }
}));

export default function AIAssistantImagesAddNewPrompt({
  openAddNewPromptDialog,
  handleCloseAddNewPromptDialog,
  setOpenAiImagePromptDialog
}) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const valueRefName: any = useRef(''); //creating a refernce for TextField Component
  const valueRefCategory: any = useRef(''); //creating a refernce for TextField Component

  const [switchValue, setSwitchValue] = React.useState(false);

  const [adminAddAiCustomStyleCommand, { isError, isSuccess, isLoading }] =
    useAdminAddAiCustomStyleCommandMutation();

  const handleAddCommand = async () => {
    if (
      valueRefName.current.value === '' ||
      valueRefCategory.current.value === ''
    ) {
      Boardx.Util.Msg.info(t('adminPage.pleaseFillAllFields'));
      return;
    }

    const data = {
      _id: UtilityService.getInstance().generateWidgetID(),
      name: valueRefName.current.value,
      category: valueRefCategory.current.value,
      isFeatured: switchValue,
      usedTimes: 0,
      createdAt: new Date(),
      createUser: store.getState().user.userInfo.userName,
      createUserId: store.getState().user.userInfo.userId,
      lastUpdateUser: store.getState().user.userInfo.userName,
      lastUpdateUserId: store.getState().user.userInfo.userId,
      lastUpdateAt: new Date()
    };

    await adminAddAiCustomStyleCommand({ command: data })
      .unwrap()
      .then(result => {
        dispatch(handleSetCurrentAdminAiImagePromptData(data));
        Boardx.Util.Msg.info(t('adminPage.addSuccessfully'));
        setOpenAiImagePromptDialog(true);
      })
      .catch(err => {
        console.log('updateAIChatSession err', err);
      });
  
    handleCloseAddNewPromptDialog();
  };

  const handleSwitchChange = event => {
    setSwitchValue(!switchValue);
  };

  return (
    <StyledDialog
      open={openAddNewPromptDialog}
      onClose={handleCloseAddNewPromptDialog}
    >
      <DialogContent>
        {/* CATEGORY */}
        <Box className={classes.inputBox}>
          <Typography className={classes.inputTitle} variant="body1">
            CATEGORY
          </Typography>
          <TextField
            classes={{ root: classes.textFieldRoot }}
            // fullWidth
            autoFocus
            inputRef={valueRefCategory}
            id="category"
            placeholder="Content"
            type="text"
            variant="outlined"
          />
        </Box>

        {/* Name */}
        <Box className={classes.inputBox}>
          <Typography className={classes.inputTitle} variant="body1">
            NAME
          </Typography>
          <TextField
            id="name"
            inputRef={valueRefName}
            placeholder="name"
            type="text"
            variant="outlined"
            classes={{ root: classes.textFieldRoot }}
            // fullWidth
          />
        </Box>

        <Switch onChange={handleSwitchChange} checked={switchValue} />
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
          Save and preview
        </Button>
      </DialogActions>
    </StyledDialog>
  );
}
