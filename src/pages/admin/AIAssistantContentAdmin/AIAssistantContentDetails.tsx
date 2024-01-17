//** Import react
import React, { useRef, Component, useEffect, useState } from 'react';

import { styled } from '@mui/material/styles';

//** Import i18n
import { useTranslation } from 'react-i18next';

//** Import Redux kit
import store, { RootState } from '../../../store';
import { useSelector, useDispatch } from 'react-redux';
import {
  useAdminDeleteAiCommandMutation,
  useAdminUpdateAiCommandMutation,
  useGetAIFineTuneModelQuery
} from '../../../redux/AiAssistApiSlice';
import { handleSetCurrentAdminAiPromptData } from '../../../store/AIAssist';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Switch from '@mui/material/Switch';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Slider from '@mui/material/Slider';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import Autocomplete from '@mui/material/Autocomplete';

//** Import services
import { UtilityService, FileService } from '../../../services';

//** Import components
import AIAssistantCommandBindingTemplates from './AIAssistantCommandBindingTemplates';
import AIAssistantCommandCustomizedOutputFormat from './AIAssistantCommandCustomizedOutputFormat';

const PREFIX = 'AIAssistantContentDetails';

const classes = {
  selecIcon: `${PREFIX}-selecIcon`,
  select: `${PREFIX}-select`,
  inputBox: `${PREFIX}-inputBox`,
  inputTitle: `${PREFIX}-inputTitle`,
  textFieldRoot: `${PREFIX}-textFieldRoot`,
  textFieldRoot2: `${PREFIX}-textFieldRoot2`,
  textFieldRoot3: `${PREFIX}-textFieldRoot3`,
  sliderThumb: `${PREFIX}-sliderThumb`,
  sliderTrack: `${PREFIX}-sliderTrack`,
  sliderRail: `${PREFIX}-sliderRail`,
  buttonBox: `${PREFIX}-buttonBox`,
  deleteButton: `${PREFIX}-deleteButton`,
  saveAndPreview: `${PREFIX}-saveAndPreview`,
  propertyBox: `${PREFIX}-propertyBox`,
  propertyBoxTitle: `${PREFIX}-propertyBoxTitle`,
  propertyBoxTitleTextNum: `${PREFIX}-propertyBoxTitleTextNum`,
  userInfoBox: `${PREFIX}-userInfoBox`,
  userNameText: `${PREFIX}-userNameText`,
  timeText: `${PREFIX}-timeText`,
  backgroundImgBox: `${PREFIX}-backgroundImgBox`,
  textAreaStyle: `${PREFIX}-textAreaStyle`,
  autocompleteInputRoot: `${PREFIX}-autocompleteInputRoot`,
  autocompleteInput: `${PREFIX}-autocompleteInput`,
  autocompleteFocused: `${PREFIX}-autocompleteFocused`,
  selectTemplateBtn: `${PREFIX}-selectTemplateBtn`,
  selectTemplateBtn2: `${PREFIX}-selectTemplateBtn2`,
  descriptionText: `${PREFIX}-descriptionText`,
  myfile2Input: `${PREFIX}-myfile2Input`,
  fileUpload1Button: `${PREFIX}-fileUpload1Button`
};

const StyledBox = styled(Box)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',

  [`& .${classes.selecIcon}`]: {
    color: '#150D33'
  },

  [`& .${classes.select}`]: {
    padding: '8px 17px',
    fontSize: '14px',
    border: '1px solid #908EA5',
    borderRadius: '6px'
  },

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
    width: '100%',
    '& .MuiInputBase-input': {
      padding: '9px 17px'
    },
    '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#F21D6B'
    }
  },

  [`& .${classes.textFieldRoot2}`]: {
    '& .MuiInputBase-input': {
      padding: '9px 17px'
    },
    '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#F21D6B'
    }
  },

  [`& .${classes.textFieldRoot3}`]: {
    '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#F21D6B'
    }
  },

  [`& .${classes.sliderThumb}`]: {
    color: '#F21D6B'
  },

  [`& .${classes.sliderTrack}`]: {
    color: '#F21D6B',
    height: '4px !important',
    border: 'none'
  },

  [`& .${classes.sliderRail}`]: {
    color: '#beccf8'
  },

  [`& .${classes.buttonBox}`]: {
    display: 'flex',
    justifyContent: 'flex-end',
    position: 'absolute',
    bottom: '0px',
    right: '12px',
    backgroundColor: '#FFF',
    height: '88px',
    alignItems: 'center',
    width: '100%'
  },

  [`& .${classes.deleteButton}`]: {
    padding: '7px 22px',
    fontSize: '14px',
    lineHeight: '24px',
    border: '1px solid #8A8D93',
    color: '#8A8D93',
    marginRight: '16px'
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

  [`& .${classes.propertyBox}`]: {
    width: '184px'
  },

  [`& .${classes.propertyBoxTitle}`]: {
    display: 'flex',
    justifyContent: 'space-between'
  },

  [`& .${classes.propertyBoxTitleTextNum}`]: {
    fontWeight: 400,
    fontSize: '12px',
    letterSpacing: '0.4px',
    color: 'rgba(0, 0, 0, 0.48)'
  },

  [`& .${classes.userInfoBox}`]: {
    display: 'flex',
    alignItems: 'center'
  },

  [`& .${classes.userNameText}`]: {
    letterSpacing: '0.15px',
    fontWeight: 400,
    fontSize: '12px',
    lineHeight: '24px',
    color: 'rgba(58, 53, 65, 0.68)'
  },

  [`& .${classes.timeText}`]: {
    marginLeft: '22px',
    letterSpacing: '0.15px',
    fontWeight: 400,
    fontSize: '12px',
    lineHeight: '24px',
    color: 'rgba(58, 53, 65, 0.68)'
  },

  [`& .${classes.backgroundImgBox}`]: {
    display: 'flex',
    height: '40px',
    alignItems: 'flex-end'
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

  [`& .${classes.selectTemplateBtn}`]: {
    textTransform: 'none',
    minWidth: 'unset',
    padding: '2px 3px',
    marginLeft: '8px',
    marginRight: '90px'
  },

  [`& .${classes.selectTemplateBtn2}`]: {
    textTransform: 'none',
    minWidth: 'unset',
    padding: '2px 3px',
    marginLeft: '8px',
    marginRight: '20px',
    background: '#F21D6B !important',
    border: '1px solid #F21D6B'
  },

  [`& .${classes.descriptionText}`]: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    width: '280px'
  },

  [`& .${classes.myfile2Input}`]: {
    width: '150px',
    height: '30px',
    position: 'absolute',
    opacity: 0,
    cursor: 'pointer',
    left: '0px',
    lineHeight: 7
  },

  [`& .${classes.fileUpload1Button}`]: {
    textTransform: 'none',
    minWidth: 'unset',
    padding: '2px 3px',
    marginRight: '130px',
    color: '#1976d2',
    border: '1px solid rgba(25, 118, 210, 0.5)',
    background: 'none !important',
    fontSize: '14px',
    height: '30px',
    width: '150px',
    cursor: 'pointer'
  }
}));

export default function AIAssistantContentDetails({
  setOpenAiPromptDialog
}) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const valueRefName: any = useRef(''); //creating a refernce for TextField Component
  const valueRefWeight: any = useRef(''); //creating a refernce for TextField Component
  const valueRefDescriiption: any = useRef(''); //creating a refernce for TextField Component
  const valueRefWidth: any = useRef(''); //creating a refernce for TextField Component
  const valueRefHeight: any = useRef(''); //creating a refernce for TextField Component

  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [commandText, setCommandText] = React.useState('');
  const [switchValue, setSwitchValue] = React.useState(false);
  const [teamsPrompt, setTeamsPrompt] = useState(false);
  const [bindingTemplates, setBindingTemplates] = React.useState(false);
  const [openBindingTemplatesDialog, setOpenBindingTemplatesDialog] =
    React.useState(false);
  const [
    openCustomizedOutputFormatDialog,
    setOpenCustomizedOutputFormatDialog
  ] = React.useState(false);
  const [customizedContentOutputFormat, setCustomizedContentOutputFormat] =
    React.useState([]);
  const [currentBindingTemplatesData, setCurrentBindingTemplatesData] =
    React.useState(null);
  const [templateId, setTemplateId] = React.useState(undefined);
  const [templateThumbnail, setTemplateThumbnail] = React.useState(undefined);
  const [weight, setWeight] = React.useState(undefined);
  const [iconSrc, setIconSrc] = React.useState('');
  const [backgroundUrl, setBackgroundUrl] = React.useState('');
  const [temperatureNum, setTemperatureNum] = React.useState(0.7);
  const [maximumLengthNum, setMaximumLengthNum] = React.useState(256);
  const [topPNum, setTopPNum] = React.useState(1);
  const [frequencyPenaltyNum, setFrequencyPenaltyNum] = React.useState(0);
  const [presencePenaltyNum, setPresencePenaltyNum] = React.useState(0);
  const [bestOfNum, setBestOfNum] = React.useState(1);
  const [AIModelSelect, setAIModelSelect] = React.useState('0');
  const [typeSelect, setTypeSelect] = React.useState('0');
  const [typeOfUseSelect, setTypeOfUseSelect] = React.useState('0');
  const [languageSelect, setLanguageSelect] = React.useState('0');
  const [sectionSelect, setSectionSelect] = React.useState([]);

  const currentRowData = useSelector(
    (state: RootState) => state.AIAssist.currentAdminAiPromptData
  );

  const { data: aiFineTuneModelData = [] } =
    useGetAIFineTuneModelQuery(undefined);

  const AIModelSelectData = [
    t('promptManagement.none'),
    'text-davinci-003',
    'text-curie-001',
    'text-babbage-001',
    'text-ada-001',
    'text-davinci-002',
    'text-davinci-001',
    'davinci-instruct-beta',
    'davinci',
    'curie-instruct-beta',
    'curie',
    'babbage',
    'ada',
    ...aiFineTuneModelData
  ];

  const typeSelectData = [t('promptManagement.none'), 'Diverge', 'Converge'];

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

  const typeOfUseSelectData = [t('promptManagement.none'), 'Prompt', 'Persona'];

  const languageData = ['en', 'zh-CN'];

  const [adminUpdateAiCommand] = useAdminUpdateAiCommandMutation();
  const [adminDeleteAiCommand] = useAdminDeleteAiCommandMutation();

  /**
   * useEffect hook that updates component state based on the currentRowData when it changes.
   * This effect is triggered whenever currentRowData changes.
   */
  useEffect(() => {
    if (!currentRowData) return;
    setName(currentRowData.name || '');
    setTypeSelect(
      String(
        typeSelectData.indexOf(currentRowData.type) > -1
          ? typeSelectData.indexOf(currentRowData.type)
          : 0
      )
    );
    setTypeOfUseSelect(
      String(
        typeOfUseSelectData.indexOf(currentRowData.typeOfUse) > -1
          ? typeOfUseSelectData.indexOf(currentRowData.typeOfUse)
          : 0
      )
    );
    setLanguageSelect(
      String(
        languageData.indexOf(currentRowData.language) > -1
          ? languageData.indexOf(currentRowData.language)
          : 0
      )
    );
    setAIModelSelect(
      String(
        AIModelSelectData.indexOf(currentRowData.AIModel) > -1
          ? AIModelSelectData.indexOf(currentRowData.AIModel)
          : 0
      )
    );
    setWeight(currentRowData.weight || 0);
    setDescription(currentRowData.description || '');
    setCommandText(currentRowData.command || '');
    setTemperatureNum(currentRowData.temperature || 0.7);
    setMaximumLengthNum(currentRowData.maximumLength || 256);
    setTopPNum(currentRowData.topP || 1);
    setFrequencyPenaltyNum(currentRowData.frequencyPenalty || 0);
    setPresencePenaltyNum(currentRowData.presencePenalty || 0);
    setBestOfNum(currentRowData.bestOf || 1);
    setIconSrc(currentRowData.icon || '');
    setBackgroundUrl(currentRowData.backgroundUrl || '');
    setSwitchValue(currentRowData.isFeatured || false);
    setTeamsPrompt(currentRowData.isTeamsPrompt || false);
    setBindingTemplates(
      (currentRowData.bindingTemplates && currentRowData.bindingTemplates) ||
        false
    );
    setTemplateThumbnail(currentRowData.templateThumbnail || undefined);
    setTemplateId(currentRowData.templateId || undefined);
    setCustomizedContentOutputFormat(
      currentRowData.customizedContentOutputFormat || []
    );

    if (currentRowData.section && currentRowData.section !== '') {
      setSectionSelect(
        typeof currentRowData.section === 'string'
          ? [currentRowData.section]
          : currentRowData.section
      );
    } else {
      setSectionSelect([]);
    }
  }, [currentRowData]);

  /**
   * Handles the saving of edited command data.
   * Validates that required fields are not empty before saving.
   */
  const handleSaveEditCommand = async () => {
    // Check if any of the required fields are empty.
    if (
      valueRefName.current.value === '' ||
      valueRefDescriiption.current.value === '' ||
      commandText === ''
    ) {
      // Display an info message if any required fields are empty.
      Boardx.Util.Msg.info(t('adminPage.pleaseFillAllFields'));
      return;
    }

    // Prepare the data for the updated command.
    const data = {
      _id: currentRowData._id,
      name: valueRefName.current.value,
      type: typeSelectData[typeSelect],
      typeOfUse: typeOfUseSelectData[typeOfUseSelect],
      section: sectionSelect,
      weight: valueRefWeight.current.value,
      description: valueRefDescriiption.current.value,
      command: commandText,
      AIModel: AIModelSelectData[AIModelSelect],
      temperature: temperatureNum,
      maximumLength: maximumLengthNum,
      topP: topPNum,
      frequencyPenalty: frequencyPenaltyNum,
      presencePenalty: presencePenaltyNum,
      bestOf: bestOfNum,
      width: valueRefWidth.current.value,
      height: valueRefHeight.current.value,
      icon: iconSrc,
      backgroundUrl: backgroundUrl,
      isFeatured: switchValue,
      isTeamsPrompt: teamsPrompt,
      language: languageData[languageSelect],
      bindingTemplates: bindingTemplates,
      templateId: Boolean(currentBindingTemplatesData)
        ? currentBindingTemplatesData._id
        : templateId
          ? templateId
          : undefined,
      templateThumbnail: Boolean(currentBindingTemplatesData)
        ? currentBindingTemplatesData.thumbnail2
          ? currentBindingTemplatesData.thumbnail2
          : currentBindingTemplatesData.thumbnail
        : templateThumbnail
          ? templateThumbnail
          : undefined,
      customizedContentOutputFormat: customizedContentOutputFormat,
      lastUpdateUser: store.getState().user.userInfo.userName,
      lastUpdateUserId: store.getState().user.userInfo.userId,
      lastUpdateAt: new Date()
    };

    // Call the function to update the AI command with new and old data.
    await adminUpdateAiCommand({
      newCommandData: data,
      oldCommandData: currentRowData
    });

    // Display a success message after successfully updating the command.
    Boardx.Util.Msg.success(t('adminPage.updateSuccessfully'));
  };

  /**
   * Handles the deletion of a command.
   * Displays a confirmation dialog before proceeding with the deletion.
   */
  const handleDeleteCommand = async () => {
    // Store the currentRowData in a variable for reference.
    const row = currentRowData;

    // Create a confirmation message with the command name.
    let text = 'Confirm to delete the command: ' + currentRowData.name + '?';

    // Display a confirmation dialog and check if the user confirmed.
    if (confirm(text) === false) {
      return; // Exit the function if the user cancels the deletion.
    }

    if (row) {
      // Call the function to delete the AI command with the specified commandId.
      await adminDeleteAiCommand({ commandId: row._id });

      // Display an info message after successfully deleting the command.
      Boardx.Util.Msg.info(t('adminPage.deleteSuccessfully'));

      // Clear the currentRowData to reset the selection.
      dispatch(handleSetCurrentAdminAiPromptData(null));
    } else {
      // Display an info message if no row is selected.
      Boardx.Util.Msg.info(t('adminPage.selectTableContent'));
    }

    setOpenAiPromptDialog(false);
  };

  /**
   * Handles the change of a switch (toggle) input.
   * Toggles the 'isFeatured' property of the currentRowData and updates the state accordingly.
   * Displays an info message if no row is selected.
   *
   * @param {object} event - The event object.
   */
  const handleSwitchChange = event => {
    // Check if currentRowData is not defined.
    if (!currentRowData) {
      // Display an info message and exit the function if no row is selected.
      return Boardx.Util.Msg.info(t('adminPage.selectTableContent'));
    }

    // Toggle the 'switchValue' state and update 'isFeatured' in currentRowData accordingly.
    setSwitchValue(!switchValue);

    dispatch(
      handleSetCurrentAdminAiPromptData({
        ...currentRowData,
        isFeatured: !switchValue
      })
    );
  };

  /**
   * Handles the change of a switch (toggle) input for teamsPrompt.
   * Toggles the 'isTeamsPrompt' property of the currentRowData and updates the state accordingly.
   * Displays an info message if no row is selected.
   *
   * @param {object} event - The event object.
   */
  const handleChangeTeamsPrompt = event => {
    // Check if currentRowData is not defined.
    if (!currentRowData) {
      // Display an info message and exit the function if no row is selected.
      return Boardx.Util.Msg.info(t('adminPage.selectTableContent'));
    }

    // Toggle the 'teamsPrompt' state and update 'isTeamsPrompt' in currentRowData accordingly.
    setTeamsPrompt(!teamsPrompt);

    dispatch(
      handleSetCurrentAdminAiPromptData({
        ...currentRowData,
        isTeamsPrompt: !teamsPrompt
      })
    );
  };

  /**
   * Handles the change of a switch (toggle) input for bindingTemplates.
   * Toggles the 'bindingTemplates' property of the currentRowData and updates the state accordingly.
   * Displays an info message if no row is selected.
   *
   * @param {object} event - The event object.
   */
  const handleChangeBindingTemplates = event => {
    // Check if currentRowData is not defined.
    if (!currentRowData) {
      // Display an info message and exit the function if no row is selected.
      return Boardx.Util.Msg.info(t('adminPage.selectTableContent'));
    }

    // Toggle the 'bindingTemplates' state and update 'bindingTemplates' in currentRowData accordingly.
    setBindingTemplates(!bindingTemplates);

    dispatch(
      handleSetCurrentAdminAiPromptData({
        ...currentRowData,
        bindingTemplates: !bindingTemplates
      })
    );
  };

  /**
   * Handles the opening of the binding templates dialog.
   * Displays an info message if no row is selected or if binding templates are not enabled for the current row.
   */
  const handleClickOpenBindingTemplatesDialog = () => {
    // Check if currentRowData is not defined.
    if (!currentRowData) {
      // Display an info message and exit the function if no row is selected.
      return Boardx.Util.Msg.info(t('adminPage.selectTableContent'));
    }

    // Check if bindingTemplates is not enabled for the current row.
    if (!bindingTemplates) {
      // Display an info message and exit the function if binding templates are not enabled.
      return Boardx.Util.Msg.info(t('adminPage.bindingTemplates'));
    }

    // Open the binding templates dialog.
    setOpenBindingTemplatesDialog(true);
  };

  /**
   * Handles the opening of the customized output format dialog.
   * Displays an info message if no row is selected or if binding templates are not enabled for the current row.
   */
  const handleClickOpenCustomizedOutputFormatDialog = () => {
    // Check if currentRowData is not defined.
    if (!currentRowData) {
      // Display an info message and exit the function if no row is selected.
      return Boardx.Util.Msg.info(t('adminPage.selectTableContent'));
    }

    // Check if bindingTemplates is not enabled for the current row.
    if (!bindingTemplates) {
      // Display an info message and exit the function if binding templates are not enabled.
      return Boardx.Util.Msg.info(t('adminPage.bindingTemplates'));
    }

    // Open the customized output format dialog.
    setOpenCustomizedOutputFormatDialog(true);
  };

  /**
   * Handles the upload of an icon file.
   *
   * @param {object} e - The event object.
   */
  const handleUploadIconFile = async e => {
    e.preventDefault();

    // Check if currentRowData is not defined.
    if (!currentRowData) {
      // Display an info message and reset the file input value if no row is selected.
      Boardx.Util.Msg.info(t('adminPage.selectTableContent'));
      const v = document.getElementById('iconFile') as HTMLInputElement;
      v.value = '';
      return;
    }

    const files = e.target.files;

    // Check if more than one file is selected.
    if (files.length > 1) {
      // Reset the file input value and display an alert message if multiple files are selected.
      const v = document.getElementById('iconFile') as HTMLInputElement;
      v.value = '';

      alert('Please select a single file to upload!');
      return;
    }

    // Get the upload path for the icon file.
    const r2UploadPath = UtilityService.getInstance().getr2UploadPath(
      store.getState().board.board
    );

    // Upload the selected file to the specified path and get the file key.
    const key: any = await FileService.getInstance().uploadFileToR2Async(
      r2UploadPath,
      files[0],
      {
        progress(ee) {}
      }
    );

    // Set the iconSrc state with the uploaded file key.
    setIconSrc(key);
  };

  /**
   * Handles the upload of a background image file.
   *
   * @param {object} e - The event object.
   */
  const handleUploadBgImageFile = async e => {
    e.preventDefault();

    // Check if currentRowData is not defined.
    if (!currentRowData) {
      // Display an info message and reset the file input value if no row is selected.
      Boardx.Util.Msg.info(t('adminPage.selectTableContent'));
      const v = document.getElementById(
        'backgroundImageFile'
      ) as HTMLInputElement;
      v.value = '';
      return;
    }

    const files = e.target.files;

    // Check if more than one file is selected.
    if (files.length > 1) {
      // Reset the file input value and display an alert message if multiple files are selected.
      const v = document.getElementById(
        'backgroundImageFile'
      ) as HTMLInputElement;
      v.value = '';
      alert('Please select a single file to upload!');
      return;
    }

    // Get the upload path for the background image file.
    const r2UploadPath = UtilityService.getInstance().getr2UploadPath(
      store.getState().board.board
    );

    // Upload the selected file to the specified path and get the file key.
    const key: any = await FileService.getInstance().uploadFileToR2Async(
      r2UploadPath,
      files[0],
      {
        progress(ee) {}
      }
    );

    // Set the backgroundUrl state with the uploaded file key.
    setBackgroundUrl(key);
  };

  /**
   * Generates a customized output format content string based on the provided data.
   *
   * @param {Array} data - An array of objects containing title and description properties.
   * @returns {string} - The generated customized output format content string.
   */
  const getCustomizedOutputFormatContent = data => {
    let result = '';

    for (var i = 0; i < data.length; i++) {
      var item = data[i];
      result +=
        item.title + ': ' + item.description + (i < data.length - 1 ? ' ' : '');
    }

    return result;
  };

  return (
    <StyledBox>
      <Box
        sx={{
          flex: 1,
          p: '0 20px 100px',
          overflowY: 'scroll',
          overflowX: 'hidden'
        }}
      >
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
            onChange={(event, value) => {
              if (!currentRowData) return;
              setSectionSelect(value);
              dispatch(
                handleSetCurrentAdminAiPromptData({
                  ...currentRowData,
                  section: value
                })
              );
            }}
            value={sectionSelect}
            classes={{
              inputRoot: classes.autocompleteInputRoot,
              input: classes.autocompleteInput,
              focused: classes.autocompleteFocused
            }}
            renderInput={params => (
              <TextField
                onBlur={event => {
                  if (event.target.value.trim() !== '') {
                    setSectionSelect([...sectionSelect, event.target.value]);
                    dispatch(
                      handleSetCurrentAdminAiPromptData({
                        ...currentRowData,
                        section: [...sectionSelect, event.target.value]
                      })
                    );
                  }
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
            classes={{ root: classes.textFieldRoot2 }}
            fullWidth
            value={name}
            id="name"
            inputRef={valueRefName}
            placeholder={t('promptManagement.name')}
            type="text"
            variant="outlined"
            onChange={() => {
              if (!currentRowData) return;
              setName(valueRefName.current.value);
            }}
            onBlur={() => {
              dispatch(
                handleSetCurrentAdminAiPromptData({
                  ...currentRowData,
                  name: valueRefName.current.value
                })
              );
            }}
          />
        </Box>

        {/* Type  section 、 type Of Use*/}
        <Box sx={{ display: 'flex' }} className={classes.inputBox}>
          <Box sx={{ mr: '12px', width: '30%' }}>
            <Typography className={classes.inputTitle} variant="body1">
              {t('promptManagement.generationType')}
            </Typography>
            <Select
              sx={{ width: '100%' }}
              id="commandTypeSelect"
              onChange={event => {
                if (!currentRowData) return;
                setTypeSelect(event.target.value);
                dispatch(
                  handleSetCurrentAdminAiPromptData({
                    ...currentRowData,
                    type: typeSelectData[event.target.value]
                  })
                );
              }}
              value={typeSelect}
              classes={{
                select: classes.select,
                icon: classes.selecIcon
              }}
              IconComponent={ExpandMoreIcon}
            >
              {typeSelectData && typeSelectData.length > 0
                ? typeSelectData.map((type, index) => {
                    return (
                      <MenuItem
                        key={index}
                        sx={{ fontSize: '14px' }}
                        value={index}
                      >
                        {type}
                      </MenuItem>
                    );
                  })
                : null}
            </Select>
          </Box>

          <Box sx={{ mr: '12px', width: '30%' }}>
            <Typography className={classes.inputTitle} variant="body1">
              {t('promptManagement.typeOfUse')}
            </Typography>
            <Select
              sx={{ width: '100%' }}
              id="commandTypeOfUseSelect"
              onChange={event => {
                if (!currentRowData) return;
                setTypeOfUseSelect(event.target.value);
                dispatch(
                  handleSetCurrentAdminAiPromptData({
                    ...currentRowData,
                    typeOfUse: typeOfUseSelectData[event.target.value]
                  })
                );
              }}
              value={typeOfUseSelect}
              classes={{
                select: classes.select,
                icon: classes.selecIcon
              }}
              IconComponent={ExpandMoreIcon}
            >
              {typeOfUseSelectData && typeOfUseSelectData.length > 0
                ? typeOfUseSelectData.map((type, index) => {
                    return (
                      <MenuItem
                        key={index}
                        sx={{ fontSize: '14px' }}
                        value={index}
                      >
                        {type}
                      </MenuItem>
                    );
                  })
                : null}
            </Select>
          </Box>

          <Box sx={{ width: '30%' }}>
            <Typography className={classes.inputTitle} variant="body1">
              {t('promptManagement.language')}
            </Typography>
            <Select
              sx={{ width: '100%' }}
              id="commandLanguageSelect"
              onChange={event => {
                if (!currentRowData) return;
                setLanguageSelect(event.target.value);
                dispatch(
                  handleSetCurrentAdminAiPromptData({
                    ...currentRowData,
                    language: languageData[event.target.value]
                  })
                );
              }}
              value={languageSelect}
              classes={{
                select: classes.select,
                icon: classes.selecIcon
              }}
              IconComponent={ExpandMoreIcon}
            >
              {languageData && languageData.length > 0
                ? languageData.map((language, index) => {
                    return (
                      <MenuItem
                        key={index}
                        sx={{ fontSize: '14px' }}
                        value={index}
                      >
                        {language}
                      </MenuItem>
                    );
                  })
                : null}
            </Select>
          </Box>
        </Box>

 

        {/* Desription */}
        <Box className={classes.inputBox}>
          <Typography className={classes.inputTitle} variant="body1">
            {t('promptManagement.description')}
          </Typography>
          <TextField
            id="desription"
            value={description}
            classes={{ root: classes.textFieldRoot3 }}
            inputRef={valueRefDescriiption}
            placeholder={t('promptManagement.description')}
            type="text"
            variant="outlined"
            fullWidth
            onChange={() => {
              if (!currentRowData) return;
              setDescription(valueRefDescriiption.current.value);
              dispatch(
                handleSetCurrentAdminAiPromptData({
                  ...currentRowData,
                  description: valueRefDescriiption.current.value
                })
              );
            }}
            onBlur={() => {
              dispatch(
                handleSetCurrentAdminAiPromptData({
                  ...currentRowData,
                  description: valueRefDescriiption.current.value
                })
              );
            }}
          />
        </Box>

        {/* Command */}
        <Box className={classes.inputBox}>
          <Typography className={classes.inputTitle} variant="body1">
            {t('promptManagement.prompt')}
          </Typography>
          <TextareaAutosize
            value={commandText}
            id="command"
            placeholder={t('promptManagement.prompt')}
            className={classes.textAreaStyle}
            onChange={e => {
              if (!currentRowData) return;
              setCommandText(e.target.value);
              dispatch(
                handleSetCurrentAdminAiPromptData({
                  ...currentRowData,
                  command: e.target.value
                })
              );
            }}
            onBlur={e => {
              dispatch(
                handleSetCurrentAdminAiPromptData({
                  ...currentRowData,
                  command: e.target.value
                })
              );
            }}
          />
        </Box>

        {/* Temperature  Maximum Length  TopP */}
        <Box
          className={classes.inputBox}
          sx={{ display: 'flex', justifyContent: 'space-between' }}
        >
          {/* Temperature */}
          <Box className={classes.propertyBox}>
            <Box className={classes.propertyBoxTitle}>
              <Typography className={classes.inputTitle} variant="body1">
                {t('promptManagement.temperature')}
              </Typography>
              <span className={classes.propertyBoxTitleTextNum}>
                {temperatureNum}
              </span>
            </Box>

            <Slider
              id="temperatureSlider"
              onChange={(event: any, newValue) => {
                if (!currentRowData) return;
                setTemperatureNum(event.target.value);
                dispatch(
                  handleSetCurrentAdminAiPromptData({
                    ...currentRowData,
                    temperature: event.target.value
                  })
                );
              }}
              classes={{
                thumb: classes.sliderThumb,
                track: classes.sliderTrack,
                rail: classes.sliderRail
              }}
              max={1}
              defaultValue={0.7}
              value={temperatureNum ? temperatureNum : 0}
              min={0}
              aria-label="Default"
              valueLabelDisplay="auto"
              step={0.01}
            />
          </Box>
          {/* Maximum Length */}
          <Box className={classes.propertyBox}>
            <Box className={classes.propertyBoxTitle}>
              <Typography className={classes.inputTitle} variant="body1">
                {t('promptManagement.maximumLength')}
              </Typography>
              <span className={classes.propertyBoxTitleTextNum}>
                {maximumLengthNum}
              </span>
            </Box>

            <Slider
              id="MaximumLengthSlider"
              onChange={(event: any, newValue) => {
                if (!currentRowData) return;
                setMaximumLengthNum(event.target.value);
                dispatch(
                  handleSetCurrentAdminAiPromptData({
                    ...currentRowData,
                    maximumLength: event.target.value
                  })
                );
              }}
              classes={{
                thumb: classes.sliderThumb,
                track: classes.sliderTrack,
                rail: classes.sliderRail
              }}
              max={4000}
              defaultValue={256}
              value={maximumLengthNum ? maximumLengthNum : 0}
              min={0}
              aria-label="Default"
              valueLabelDisplay="auto"
              step={1}
            />
          </Box>
          {/* TopP */}
          <Box className={classes.propertyBox}>
            <Box className={classes.propertyBoxTitle}>
              <Typography className={classes.inputTitle} variant="body1">
                {t('promptManagement.topP')}
              </Typography>
              <span className={classes.propertyBoxTitleTextNum}>{topPNum}</span>
            </Box>

            <Slider
              id="TopPSlider"
              onChange={(event: any, newValue) => {
                if (!currentRowData) return;
                setTopPNum(event.target.value);
                dispatch(
                  handleSetCurrentAdminAiPromptData({
                    ...currentRowData,
                    topP: event.target.value
                  })
                );
              }}
              classes={{
                thumb: classes.sliderThumb,
                track: classes.sliderTrack,
                rail: classes.sliderRail
              }}
              max={1}
              defaultValue={1}
              value={topPNum ? topPNum : 0}
              min={0}
              aria-label="Default"
              valueLabelDisplay="auto"
              step={0.01}
            />
          </Box>
        </Box>

        {/* Frequency Penalty   Presence Penalty   Best Of */}
        <Box
          className={classes.inputBox}
          sx={{ display: 'flex', justifyContent: 'space-between' }}
        >
          {/* Frequency Penalty */}
          <Box className={classes.propertyBox}>
            <Box className={classes.propertyBoxTitle}>
              <Typography className={classes.inputTitle} variant="body1">
                {t('promptManagement.frequencyPenalty')}
              </Typography>
              <span className={classes.propertyBoxTitleTextNum}>
                {frequencyPenaltyNum}
              </span>
            </Box>

            <Slider
              id="frequencyPenaltySlider"
              onChange={(event: any, newValue) => {
                if (!currentRowData) return;
                setFrequencyPenaltyNum(event.target.value);
                dispatch(
                  handleSetCurrentAdminAiPromptData({
                    ...currentRowData,
                    frequencyPenalty: event.target.value
                  })
                );
              }}
              classes={{
                thumb: classes.sliderThumb,
                track: classes.sliderTrack,
                rail: classes.sliderRail
              }}
              max={2}
              defaultValue={0}
              value={frequencyPenaltyNum ? frequencyPenaltyNum : 0}
              min={0}
              aria-label="Default"
              valueLabelDisplay="auto"
              step={0.01}
            />
          </Box>
          {/* Presence Penalty  */}
          <Box className={classes.propertyBox}>
            <Box className={classes.propertyBoxTitle}>
              <Typography className={classes.inputTitle} variant="body1">
                {t('promptManagement.presencePenalty')}
              </Typography>
              <span className={classes.propertyBoxTitleTextNum}>
                {presencePenaltyNum}
              </span>
            </Box>

            <Slider
              id="presencePenaltySlider"
              onChange={(event: any, newValue) => {
                if (!currentRowData) return;
                setPresencePenaltyNum(event.target.value);
                dispatch(
                  handleSetCurrentAdminAiPromptData({
                    ...currentRowData,
                    presencePenalty: event.target.value
                  })
                );
              }}
              classes={{
                thumb: classes.sliderThumb,
                track: classes.sliderTrack,
                rail: classes.sliderRail
              }}
              max={2}
              defaultValue={0}
              value={presencePenaltyNum ? presencePenaltyNum : 0}
              min={0}
              aria-label="Default"
              valueLabelDisplay="auto"
              step={0.01}
            />
          </Box>
          {/* Best Of */}
          <Box className={classes.propertyBox}>
            <Box className={classes.propertyBoxTitle}>
              <Typography className={classes.inputTitle} variant="body1">
                {t('promptManagement.bestOf')}
              </Typography>
              <span className={classes.propertyBoxTitleTextNum}>
                {bestOfNum}
              </span>
            </Box>

            <Slider
              id="bestOfSlider"
              onChange={(event: any, newValue) => {
                if (!currentRowData) return;
                setBestOfNum(event.target.value);
                dispatch(
                  handleSetCurrentAdminAiPromptData({
                    ...currentRowData,
                    bestOf: event.target.value
                  })
                );
              }}
              classes={{
                thumb: classes.sliderThumb,
                track: classes.sliderTrack,
                rail: classes.sliderRail
              }}
              max={20}
              defaultValue={1}
              value={bestOfNum ? bestOfNum : 0}
              min={1}
              aria-label="Default"
              valueLabelDisplay="auto"
              step={1}
            />
          </Box>
        </Box>

        {/* Icon */}
        <Box className={classes.inputBox}>
          <Typography
            style={{ marginBottom: '0px' }}
            className={classes.inputTitle}
            variant="body1"
          >
            {t('promptManagement.icon')}
          </Typography>
          <Box className={classes.backgroundImgBox}>
            <Box sx={{ position: 'relative', overflow: 'hidden' }}>
              <Button
                variant="outlined"
                className={classes.fileUpload1Button}
                id="iconFileBtn"
              >
                {t('promptManagement.uploadFile')}
              </Button>
              <input
                className={classes.myfile2Input}
                id="iconFile"
                multiple
                name="files"
                onChange={handleUploadIconFile}
                type="file"
                accept=".png,.jpeg,.jpg,.webp,.gif,.svg"
              />
            </Box>

            <img
              style={{ width: '24px', height: '24px' }}
              src={
                Boolean(iconSrc)
                  ? iconSrc
                  : '/images/ImageCommandBackgroundImg.png'
              }
            />
          </Box>
        </Box>

        {/* Background Image */}
        <Box className={classes.inputBox}>
          <Typography
            style={{ marginBottom: '0px' }}
            className={classes.inputTitle}
            variant="body1"
          >
            {t('promptManagement.backgroundImage')}
          </Typography>
          <Box className={classes.backgroundImgBox}>
            <Box sx={{ position: 'relative', overflow: 'hidden' }}>
              <Button
                variant="outlined"
                className={classes.fileUpload1Button}
                id="imagesFileBtn"
              >
                {t('promptManagement.uploadFile')}
              </Button>
              <input
                className={classes.myfile2Input}
                id="backgroundImageFile"
                multiple
                name="files"
                onChange={handleUploadBgImageFile}
                type="file"
                accept=".png,.jpeg,.jpg,.webp,.gif,.svg"
              />
            </Box>

            <img
              style={{ width: '52px', height: '39px' }}
              src={
                Boolean(backgroundUrl)
                  ? backgroundUrl
                  : '/images/ImageCommandBackgroundImg.png'
              }
            />
          </Box>
        </Box>

        {/* Binding templates */}
        <Box className={classes.inputBox}>
          <Box className={classes.userInfoBox}>
            <Typography
              className={classes.userNameText}
              sx={{ mb: 0 }}
              variant="body1"
            >
              {t('promptManagement.bindingTemplates')}:{' '}
            </Typography>
            <Switch
              onChange={handleChangeBindingTemplates}
              checked={bindingTemplates}
              size="small"
            />
          </Box>
        </Box>

        {/* Content Output Format */}
        <Box className={classes.inputBox}>
          <Box className={classes.userInfoBox}>
            <Typography
              className={classes.userNameText}
              sx={{ mb: 0 }}
              variant="body1"
            >
              {t('promptManagement.contentOutputFormat')}:{' '}
            </Typography>
            <Button
              variant="outlined"
              className={classes.selectTemplateBtn2}
              onClick={handleClickOpenCustomizedOutputFormatDialog}
            >
              {t('promptManagement.customizable')}
            </Button>
            <Typography
              className={classes.descriptionText}
              sx={{ mb: 0 }}
              variant="body1"
            >
              {customizedContentOutputFormat.length === 0
                ? t('promptManagement.none')
                : getCustomizedOutputFormatContent(
                    customizedContentOutputFormat
                  )}
            </Typography>
          </Box>
        </Box>

        {/* Select Binding templates */}
        <Box className={classes.inputBox}>
          <Box className={classes.userInfoBox}>
            <Typography className={classes.userNameText} variant="body1">
              {t('promptManagement.templates')}:{' '}
            </Typography>
            <Button
              variant="outlined"
              className={classes.selectTemplateBtn}
              sx={{
                background: '#F21D6B !important',
                border: '1px solid #F21D6B'
              }}
              onClick={handleClickOpenBindingTemplatesDialog}
            >
              {t('promptManagement.selectTemplate')}
            </Button>
            <img
              style={{ width: '52px', height: '39px' }}
              src={
                Boolean(currentBindingTemplatesData)
                  ? currentBindingTemplatesData.thumbnail2
                    ? currentBindingTemplatesData.thumbnail2
                    : currentBindingTemplatesData.thumbnail
                  : templateThumbnail
                    ? templateThumbnail
                    : '/images/boardbg.png'
              }
            />
          </Box>
        </Box>

        <AIAssistantCommandBindingTemplates
          openBindingTemplatesDialog={openBindingTemplatesDialog}
          setOpenBindingTemplatesDialog={setOpenBindingTemplatesDialog}
          currentBindingTemplatesData={currentBindingTemplatesData}
          setCurrentBindingTemplatesData={setCurrentBindingTemplatesData}
        />

        <AIAssistantCommandCustomizedOutputFormat
          openCustomizedOutputFormatDialog={openCustomizedOutputFormatDialog}
          setOpenCustomizedOutputFormatDialog={
            setOpenCustomizedOutputFormatDialog
          }
          customizedContentOutputFormat={customizedContentOutputFormat}
          setCustomizedContentOutputFormat={setCustomizedContentOutputFormat}
        />

        {/* Switch */}
        <Box className={classes.inputBox}>
          <Box className={classes.userInfoBox}>
            <Typography
              className={classes.userNameText}
              sx={{ mb: 0 }}
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
        </Box>

        <Box className={classes.inputBox}>
          <Box className={classes.userInfoBox}>
            <Typography
              className={classes.userNameText}
              sx={{ mb: 0 }}
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
        </Box>

        {/* create User info */}
        <Box className={classes.inputBox}>
          <Box className={classes.userInfoBox}>
            <Typography className={classes.userNameText} variant="body1">
              {t('promptManagement.createdBy')}:{' '}
              {currentRowData && currentRowData.createUser
                ? currentRowData.createUser
                : 'admin'}
            </Typography>
            <Typography className={classes.timeText} variant="body1">
              {t('promptManagement.createdTime')}:{' '}
              {currentRowData && currentRowData.createdAt
                ? currentRowData.createdAt.toLocaleString()
                : '2021/08/01 00:00:00'}
            </Typography>
          </Box>
        </Box>

        {/* Last Update User info */}
        <Box className={classes.inputBox}>
          <Box className={classes.userInfoBox}>
            <Typography className={classes.userNameText} variant="body1">
              {t('promptManagement.lastUpdatedBy')}:{' '}
              {currentRowData && currentRowData.lastUpdateUser
                ? currentRowData.createUser
                : 'admin'}
            </Typography>
            <Typography className={classes.timeText} variant="body1">
              {t('promptManagement.lastUpdatedTime')}:{' '}
              {currentRowData && currentRowData.lastUpdateAt
                ? currentRowData.lastUpdateAt.toLocaleString()
                : '2021/08/01 00:00:00'}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box className={classes.buttonBox} style={{display:'flex'}}>
        <Button
          onClick={handleDeleteCommand}
          className={classes.deleteButton}
          variant="outlined"
        >
          {t('promptManagement.delete')}
        </Button>
        <Button
          className={classes.saveAndPreview}
          variant="contained"
          onClick={handleSaveEditCommand}
        >
          {t('promptManagement.save')}
        </Button>
      </Box>
    </StyledBox>
  );
}
