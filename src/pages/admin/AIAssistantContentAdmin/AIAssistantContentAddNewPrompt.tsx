//** Import react
import React, { useRef, Component, useEffect, useState } from 'react';

import { styled } from '@mui/material/styles';

//** Import Redux kit
import { useAdminAddAiCommandMutation } from '../../../redux/AiAssistApiSlice';
import { useSelector, useDispatch } from 'react-redux';
import { handleSetCurrentAdminAiPromptData } from '../../../store/AIAssist';

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
import { UtilityService } from '../../../services';

import store from '../../../store';
const PREFIX = 'AIAssistantContentAddNewPrompt';

const classes = {
  inputBox: `${PREFIX}-inputBox`,
  inputTitle: `${PREFIX}-inputTitle`,
  textFieldRoot: `${PREFIX}-textFieldRoot`,
  saveAndPreview: `${PREFIX}-saveAndPreview`,
  autocompleteInputRoot: `${PREFIX}-autocompleteInputRoot`,
  autocompleteInput: `${PREFIX}-autocompleteInput`,
  autocompleteFocused: `${PREFIX}-autocompleteFocused`
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
  }
}));

export default function AIAssistantContentAddNewPrompt({
  languageData,
  languageSelect,
  openAddNewPromptDialog,
  handleCloseAddNewPromptDialog,
  setOpenAiPromptDialog
}) {
  const dispatch = useDispatch();

  const { t } = useTranslation();
  /**
   * Create a reference ('ref') for storing an input element's value.
   * The initial value is set to an empty string.
   */
  const valueRefName: any = useRef('');

  /**
   * Create a state variable 'sectionSelect' and its setter function using the 'React.useState' hook.
   * This variable is used to manage selected sections or items and is initialized as an empty array.
   */
  const [sectionSelect, setSectionSelect] = React.useState([]);

  /**
   * Create a state variable 'switchValue' and its setter function using the 'React.useState' hook.
   * This variable is used to manage the state of a switch or toggle component and is initialized as 'false'.
   * 'false' typically represents the 'off' state.
   */
  const [switchValue, setSwitchValue] = React.useState(false);

  /**
   * Create a state variable 'teamsPrompt' and its setter function using the 'useState' hook.
   * This variable is used to manage the visibility of a prompt related to teams.
   * It is initialized as 'false', indicating that the prompt should initially be hidden.
   */
  const [teamsPrompt, setTeamsPrompt] = useState(false);

  const [adminAddAiCommand, { isError, isSuccess, isLoading }] =
    useAdminAddAiCommandMutation();

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

  /**
   * Handles the addition of a new command.
   * - Checks if the input value is empty and displays a message if it is.
   * - Constructs the data object for the new command.
   * - Calls the 'adminAddAiCommand' function to add the new command.
   * - Displays a success message.
   * - Resets the 'sectionSelect' state to an empty array.
   * - Closes the 'Add New Prompt' dialog.
   */
  const handleAddCommand = async () => {
    // Check if the input value is empty.
    if (valueRefName.current.value === '') {
      // Display an information message if the input is empty.
      Boardx.Util.Msg.info(t('adminPage.pleaseFillAllFields'));
      return;
    }

    // Create a data object for the new command.
    const data = {
      _id: UtilityService.getInstance().generateWidgetID(),
      name: valueRefName.current.value,
      section: sectionSelect,
      isFeatured: switchValue,
      isTeamsPrompt: teamsPrompt,
      typeOfUse: 'Prompt',
      language: languageData[languageSelect],
      usedTimes: 0,
      createdAt: new Date(),
      createUser: store.getState().user.userInfo.userName,
      createUserId: store.getState().user.userInfo.userId,
      lastUpdateUser: store.getState().user.userInfo.userName,
      lastUpdateUserId: store.getState().user.userInfo.userId,
      lastUpdateAt: new Date()
    };

    // Call the 'adminAddAiCommand' function to add the new command.
    await adminAddAiCommand({ commandData: data })
      .unwrap()
      .then(result => {
        dispatch(handleSetCurrentAdminAiPromptData(data));
        Boardx.Util.Msg.info(t('adminPage.addSuccessfully'));
        setOpenAiPromptDialog(true);
      })
      .catch(err => {
        console.log('updateAIChatSession err', err);
      });

    setSectionSelect([]);

    handleCloseAddNewPromptDialog();
  };

  /**
   * Handles the change event of a switch or toggle.
   * Toggles the value of the 'switchValue' state variable when the switch changes.
   *
   * @param {object} event - The event object.
   */
  const handleSwitchChange = event => {
    // Toggle the value of the 'switchValue' state variable.
    setSwitchValue(!switchValue);
  };

  /**
   * Handles the change event for a Teams prompt.
   * Toggles the value of the 'teamsPrompt' state variable when the change event occurs.
   *
   * @param {object} event - The event object.
   */
  const handleChangeTeamsPrompt = event => {
    // Toggle the value of the 'teamsPrompt' state variable.
    setTeamsPrompt(!teamsPrompt);
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
              focused: classes.autocompleteFocused
            }}
            sx={{
              '& .MuiAutocomplete-endAdornment': {
                top: '0px',
                right: '0px !important'
              }
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

        <Box
          className={classes.inputBox}
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <Typography
            className={classes.inputTitle}
            sx={{ mb: '0 !important' }}
            variant="body1"
          >
            {t('promptManagement.isTeamsPrompt')}:{' '}
          </Typography>
          <Switch
            onChange={handleChangeTeamsPrompt}
            checked={teamsPrompt}
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
