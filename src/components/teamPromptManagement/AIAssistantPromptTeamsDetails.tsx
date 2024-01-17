//** Import react
import React, { useRef, Component, useEffect, useState } from 'react';

import { styled } from '@mui/material/styles';

//** Import i18n
import { useTranslation } from 'react-i18next';

//** Import Redux kit
import store from '../../store';
import {
  useAdminDeleteAiCommandMutation,
  useTeamsDeleteAiCommandMutation,
  useAdminUpdateAiCommandMutation,
  useTeamsUpdateAiCommandMutation,
  useGetAIFineTuneModelQuery
} from '../../redux/AiAssistApiSlice';

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
import { UtilityService, FileService } from '../../services';

//** Import components
import AIAssistantCommandBindingTemplates from './AIAssistantPromptTeamsBindingTemplates';
import AIAssistantPromptTeamsCustomizedOutputFormat from './AIAssistantPromptTeamsCustomizedOutputFormat';

const PREFIX = 'AIAssistantPromptTeamsDetails';

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
  autocompleteEndAdornment: `${PREFIX}-autocompleteEndAdornment`,
  myfile2Input: `${PREFIX}-myfile2Input`,
  fileUpload1Button: `${PREFIX}-fileUpload1Button`
};

const StyledBox = styled(Box)(({ theme }) => ({
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
    width: '220px',
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
    marginRight: '16px',
    background: 'none !important'
  },

  [`& .${classes.saveAndPreview}`]: {
    fontWeight: 500,
    fontSize: '14px',
    lineHeight: '24px',
    letterSpacing: '0.4px',
    textTransform: 'uppercase',
    boxShadow: '0px 4px 8px -4px rgba(58, 53, 65, 0.42)',
    borderRadius: '5px',
    padding: '7px 22px !important'
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
    marginRight: '90px',
    color: '#F21D6B',
    border: '1px solid #F21D6B',
    background: 'none !important',
    fontSize: '14px',
    height: '30px'
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

  [`& .${classes.autocompleteEndAdornment}`]: {
    top: 'unset !important'
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
    color: '#F21D6B',
    border: '1px solid #F21D6B',
    background: 'none !important',
    fontSize: '14px',
    height: '30px',
    width: '150px',
    cursor: 'pointer'
  }
}));

const AIAssistantPromptTeamsDetails = ({ currentRowData, setCurrentRowData }) => {

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
  const [sectionSelect, setSectionSelect] = React.useState([]);

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
  const typeSelectData = [
    t('promptManagement.none'),
    'Diverge',
    'Converge'
  ];
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

  const [teamsUpdateAiCommand] = useTeamsUpdateAiCommandMutation();
  const [teamsDeleteAiCommand] = useTeamsDeleteAiCommandMutation();

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
    // setCurrentBindingTemplatesData(null);
  }, [currentRowData]);

  const handleSaveEditCommand = async () => {
    if (
      valueRefName.current.value === '' ||
      valueRefDescriiption.current.value === '' ||
      commandText === ''
    ) {
      Boardx.Util.Msg.info(t('adminPage.pleaseFillAllFields'));
      return;
    }

    const data = {
      _id: currentRowData._id,
      name: valueRefName.current.value,
      type: typeSelectData[typeSelect],
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

    console.log('data2', data);
    await teamsUpdateAiCommand({
      newCommandData: data,
      oldCommandData: currentRowData
    });
    Boardx.Util.Msg.success(t('adminPage.updateSuccessfully'));
  };

  const handleDeleteCommand = async () => {
    const row = currentRowData;
    let text = 'confirm to delete the commmand: ' + currentRowData.name + '?';
    if (confirm(text) == false) {
      return;
    }

    if (row) {
      await teamsDeleteAiCommand({ commandId: row._id });
      Boardx.Util.Msg.info(t('adminPage.deleteSuccessfully'));
      setCurrentRowData(null);
    } else {
      Boardx.Util.Msg.info(t('adminPage.selectTableContent'));
    }
  };

  const handleSwitchChange = event => {
    if (!currentRowData)
      return Boardx.Util.Msg.info(t('adminPage.selectTableContent'));
    setSwitchValue(!switchValue);
    setCurrentRowData({
      ...currentRowData,
      isFeatured: !switchValue
    });
  };

  const handleChangeBindingTemplates = event => {
    if (!currentRowData)
      return Boardx.Util.Msg.info(t('adminPage.selectTableContent'));
    setBindingTemplates(!bindingTemplates);
    setCurrentRowData({
      ...currentRowData,
      bindingTemplates: !bindingTemplates
    });
  };

  const handleClickOpenBindingTemplatesDialog = () => {
    if (!currentRowData)
      return Boardx.Util.Msg.info(t('adminPage.selectTableContent'));
    if (!bindingTemplates)
      return Boardx.Util.Msg.info(t('adminPage.bindingTemplates'));
    setOpenBindingTemplatesDialog(true);
  };

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

  const handleUploadIconFile = async e => {
    e.preventDefault();
    if (!currentRowData) {
      Boardx.Util.Msg.info(t('adminPage.selectTableContent'));
      (document as any).getElementById('iconFile').value = '';
      return;
    }
    const files = e.target.files;

    if (files.length > 1) {
      (document as any).getElementById('iconFile').value = '';
      alert('Please select a single file to upload!');
      return;
    }
    const r2UploadPath = UtilityService.getInstance().getr2UploadPath(
      store.getState().board.board
    );
    const key:any = await FileService.getInstance().uploadFileToR2Async(
      r2UploadPath,
      files[0],
      {
        progress(ee) {}
      }
    );

    setIconSrc(key);
  };

  const handleUploadBgImageFile = async e => {
    e.preventDefault();
    if (!currentRowData) {
      Boardx.Util.Msg.info(t('adminPage.selectTableContent'));
      (document as any).getElementById('backgroundImageFile').value = '';
      return;
    }

    const files = e.target.files;

    if (files.length > 1) {
      (document as any).getElementById('backgroundImageFile').value = '';
      alert('Please select a single file to upload!');
      return;
    }
    const r2UploadPath = UtilityService.getInstance().getr2UploadPath(
      store.getState().board.board
    );
    const key:any = await FileService.getInstance().uploadFileToR2Async(
      r2UploadPath,
      files[0],
      {
        progress(ee) {}
      }
    );
    setBackgroundUrl(key);
  };

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
    <StyledBox
      sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
    >
      <Box sx={{ flex: 1, p: '0 10px 100px' }}>
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
              setCurrentRowData({
                ...currentRowData,
                section: value
              });
            }}
            value={sectionSelect}
            classes={{
              inputRoot: classes.autocompleteInputRoot,
              input: classes.autocompleteInput,
              focused: classes.autocompleteFocused,
              endAdornment: classes.autocompleteEndAdornment
            }}
            renderInput={params => (
              <TextField
                onBlur={event => {
                  if (event.target.value.trim() !== '') {
                    setSectionSelect([...sectionSelect, event.target.value]);
                    setCurrentRowData({
                      ...currentRowData,
                      section: [...sectionSelect, event.target.value]
                    });
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
              setCurrentRowData({
                ...currentRowData,
                name: valueRefName.current.value
              });
            }}
          />
        </Box>

        {/* Type  section */}
        <Box sx={{ display: 'flex' }} className={classes.inputBox}>
          <Box sx={{ mr: '12px' }}>
            <Typography className={classes.inputTitle} variant="body1">
              {t('promptManagement.generationType')}
            </Typography>
            <Select
              sx={{ width: '220px' }}
              id="commandTypeSelect"
              onChange={event => {
                if (!currentRowData) return;
                setTypeSelect(event.target.value);
                setCurrentRowData({
                  ...currentRowData,
                  type: typeSelectData[event.target.value]
                });
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
        </Box>

        {/* AI Model Weight */}
        <Box sx={{ display: 'flex' }} className={classes.inputBox}>
          {/* Model */}
          <Box sx={{ mr: '12px' }}>
            <Typography className={classes.inputTitle} variant="body1">
              {t('promptManagement.AIModel')}
            </Typography>
            <Select
              sx={{ width: '220px' }}
              id="AIModelSelect"
              onChange={event => {
                if (!currentRowData) return;
                setAIModelSelect(event.target.value);
                setCurrentRowData({
                  ...currentRowData,
                  AIModel: AIModelSelectData[event.target.value]
                });
              }}
              value={AIModelSelect}
              classes={{
                select: classes.select,
                icon: classes.selecIcon
              }}
              IconComponent={ExpandMoreIcon}
            >
              {AIModelSelectData && AIModelSelectData.length > 0
                ? AIModelSelectData.map((type, index) => {
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

          {/* Weight */}
          <Box sx={{ mr: '12px' }}>
            <Typography className={classes.inputTitle} variant="body1">
              {t('promptManagement.weight')}
            </Typography>
            <TextField
              value={weight}
              classes={{ root: classes.textFieldRoot }}
              id="weight"
              inputRef={valueRefWeight}
              placeholder={t('promptManagement.weight')}
              type="text"
              variant="outlined"
              onChange={() => {
                if (!currentRowData) return;
                setWeight(valueRefWeight.current.value);
                setCurrentRowData({
                  ...currentRowData,
                  weight: valueRefWeight.current.value
                });
              }}
              onBlur={() =>
                setCurrentRowData({
                  ...currentRowData,
                  weight: valueRefWeight.current.value
                })
              }
            />
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
              setCurrentRowData({
                ...currentRowData,
                description: valueRefDescriiption.current.value
              });
            }}
            onBlur={() =>
              setCurrentRowData({
                ...currentRowData,
                description: valueRefDescriiption.current.value
              })
            }
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
              setCurrentRowData({
                ...currentRowData,
                command: e.target.value
              });
            }}
            onBlur={e =>
              setCurrentRowData({
                ...currentRowData,
                command: e.target.value
              })
            }
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
                setCurrentRowData({
                  ...currentRowData,
                  temperature: event.target.value
                });
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
              onChange={(event, newValue) => {
                if (!currentRowData) return;
                const eventAny = event as any;
                setMaximumLengthNum(eventAny.target.value);
                setCurrentRowData({
                  ...currentRowData,
                  maximumLength: eventAny.target.value
                });
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
              onChange={(event, newValue) => {
                if (!currentRowData) return;
                const eventAny = event as any;
                setTopPNum(eventAny.target.value);
                setCurrentRowData({
                  ...currentRowData,
                  topP: eventAny.target.value
                });
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
              onChange={(event, newValue) => {
                if (!currentRowData) return;
                const eventAny = event as any;
                setFrequencyPenaltyNum(eventAny.target.value);
                setCurrentRowData({
                  ...currentRowData,
                  frequencyPenalty: eventAny.target.value
                });
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
              onChange={(event, newValue) => {
                if (!currentRowData) return;
                const eventAny = event as any;
                setPresencePenaltyNum(eventAny.target.value);
                setCurrentRowData({
                  ...currentRowData,
                  presencePenalty: eventAny.target.value
                });
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
              onChange={(event, newValue) => {
                if (!currentRowData) return;
                const eventAny = event as any;
                setBestOfNum(eventAny.target.value);
                setCurrentRowData({
                  ...currentRowData,
                  bestOf: eventAny.target.value
                });
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
              className={classes.selectTemplateBtn}
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

        <AIAssistantPromptTeamsCustomizedOutputFormat
          openCustomizedOutputFormatDialog={openCustomizedOutputFormatDialog}
          setOpenCustomizedOutputFormatDialog={
            setOpenCustomizedOutputFormatDialog
          }
          customizedContentOutputFormat={customizedContentOutputFormat}
          setCustomizedContentOutputFormat={setCustomizedContentOutputFormat}
          currentRowData={currentRowData}
          setCurrentRowData={setCurrentRowData}
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
          disabled={!(currentRowData && currentRowData.orgId)}
        >
          {t('promptManagement.delete')}
        </Button>
        <Button
          className={classes.saveAndPreview}
          variant="contained"
          onClick={handleSaveEditCommand}
          disabled={!(currentRowData && currentRowData.orgId)}
        >
          {t('promptManagement.save')}
        </Button>
      </Box>
    </StyledBox>
  );
}

export default AIAssistantPromptTeamsDetails;