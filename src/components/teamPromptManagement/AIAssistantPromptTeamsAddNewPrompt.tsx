//** Import react
import React, { useRef, Component, useEffect, useState } from 'react';

import { styled } from '@mui/material/styles';

//** Import Redux kit
import store, { RootState } from '../../store';
import { useSelector, useDispatch } from 'react-redux';
import { useTeamsAddAiCommandMutation } from '../../redux/AiAssistApiSlice';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Switch from '@mui/material/Switch';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Autocomplete from '@mui/material/Autocomplete';

//** Import i18n
import { useTranslation } from 'react-i18next';

//** Import services
import { UtilityService } from '../../services';

const PREFIX = 'AIAssistantPromptTeamsAddNewPrompt';

const classes = {
  inputBox: `${PREFIX}-inputBox`,
  inputTitle: `${PREFIX}-inputTitle`,
  textFieldRoot: `${PREFIX}-textFieldRoot`,
  saveAndPreview: `${PREFIX}-saveAndPreview`,
  autocompleteInputRoot: `${PREFIX}-autocompleteInputRoot`,
  autocompleteInput: `${PREFIX}-autocompleteInput`,
  autocompleteFocused: `${PREFIX}-autocompleteFocused`,
  autocompletePopupIndicator: `${PREFIX}-autocompletePopupIndicator`
};

const StyledDialog = styled(Dialog)((
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

  [`& .${classes.autocompleteInputRoot}`]: {
    minHeight: '40px',
    padding: '0px !important'
  },

  [`& .${classes.autocompleteInput}`]: {
    paddingLeft: '15px !important'
  },

  [`& .${classes.autocompleteFocused}`]: {
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#F21D6B !important'
    }
  },

  [`& .${classes.autocompletePopupIndicator}`]: {
    marginTop: '-7px'
  }
}));

const  AIAssistantPromptTeamsAddNewPrompt = ({
  openAddNewPromptDialog,
  handleCloseAddNewPromptDialog
}) => {

  const { t } = useTranslation();
  const valueRefName: any = useRef(''); //creating a refernce for TextField Component
  const [sectionSelect, setSectionSelect] = React.useState([]);
  const [switchValue, setSwitchValue] = React.useState(false);
  const orgInfo = useSelector((state: RootState) => state.org.orgInfo);

  const [teamsAddAiCommand, { isError, isSuccess, isLoading }] =
    useTeamsAddAiCommandMutation();

  const sectionSelectData = [
    'General',
    'Ideate',
    'Extract',
    'Blog',
    'Email',
    'Sales & Marketing',
    'Product',
    'Persona',
    'Storytelling',
    'Social Media',
    'Video',
    'SEO',
    'Translation',
    'Unclassified'
  ];

  const handleAddCommand = async () => {
    if (valueRefName.current.value === '') {
      Boardx.Util.Msg.info(t('adminPage.pleaseFillAllFields'));
      return;
    }

    const data = {
      _id: UtilityService.getInstance().generateWidgetID(),
      orgId: orgInfo.orgId,
      name: valueRefName.current.value,
      section: sectionSelect,
      isFeatured: switchValue,
      usedTimes: 0,
      createdAt: new Date(),
      createUser: store.getState().user.userInfo.userName,
      createUserId: store.getState().user.userInfo.userId,
      lastUpdateUser: store.getState().user.userInfo.userName,
      lastUpdateUserId: store.getState().user.userInfo.userId,
      lastUpdateAt: new Date()
    };

    await teamsAddAiCommand({ commandData: data });
    Boardx.Util.Msg.info(t('adminPage.addSuccessfully'));
    setSectionSelect([]);
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
            {t('promptManagement.category')}
          </Typography>
          <Autocomplete
            id="commandSectionSelect"
            multiple
            options={sectionSelectData.map(option => option)}
            getOptionLabel={option => option}
            filterSelectedOptions
            onChange={(event, value) => setSectionSelect(value)}
            value={sectionSelect}
            classes={{
              inputRoot: classes.autocompleteInputRoot,
              input: classes.autocompleteInput,
              focused: classes.autocompleteFocused,
              popupIndicator: classes.autocompletePopupIndicator
            }}
            renderInput={params => (
              <TextField
                onBlur={event => {
                  if (event.target.value.trim() !== '')
                    return setSectionSelect([
                      ...sectionSelect,
                      event.target.value
                    ]);
                }}
                {...params}
                placeholder={t('promptManagement.category')}
              />
            )}
          />
        </Box>

        {/* Name */}
        <Box className={classes.inputBox}>
          <Typography className={classes.inputTitle} variant="body1">
            {t('promptManagement.name')}
          </Typography>
          <TextField
            id="name"
            inputRef={valueRefName}
            placeholder={t('promptManagement.name')}
            type="text"
            variant="outlined"
            classes={{ root: classes.textFieldRoot }}
          />
        </Box>

        <Box
          className={classes.inputBox}
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <Typography
            className={classes.inputTitle}
            sx={{ mb: '0 !important' }}
            variant="body1"
          >
            {t('promptManagement.isFeatured')}:{' '}
          </Typography>
          <Switch
            onChange={handleSwitchChange}
            checked={switchValue}
            size="small"
          />
        </Box>
      </DialogContent>

      {/* save button */}
      <DialogActions
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          pl: '24px',
          pr: '24px',
          pb: '20px'
        }}
      >
        <Button
          className={classes.saveAndPreview}
          variant="contained"
          onClick={handleAddCommand}
        >
          {t('promptManagement.saveAndPreview')}
        </Button>
      </DialogActions>
    </StyledDialog>
  );
}


export default AIAssistantPromptTeamsAddNewPrompt;