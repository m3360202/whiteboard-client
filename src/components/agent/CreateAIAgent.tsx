//** Import react
import React, { useRef } from 'react';

import { styled } from '@mui/material/styles';

//** Import i18n
import { useTranslation } from 'react-i18next';

//** Import Redux kit
import store, { RootState } from 'store';
import { useAddAiAgentMutation } from 'redux/AiAssistApiSlice';
import { useSelector, useDispatch } from 'react-redux';
import { handleSetCurrentAgent } from 'store/AIAssist';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Switch from '@mui/material/Switch';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import Autocomplete from '@mui/material/Autocomplete';
import AIService from 'services/AIService';

//** Import services
import { UtilityService, FileService, BoardService } from 'services'

const StyledTypography = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  fontSize: '12px',
  lineHeight: '15px',
  marginBottom: '6px'
}));

export default function CreateAIAgent(props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const valueRefName: any = useRef(''); //creating a refernce for TextField Component
  const valueRefDescriiption: any = useRef(''); //creating a refernce for TextField Component
  const {type} =  props;
  const [commandText, setCommandText] = React.useState('');
  const [switchValue, setSwitchValue] = React.useState(false);
  const [iconSrc, setIconSrc] = React.useState('');
  const [backgroundUrl, setBackgroundUrl] = React.useState('');
  const [temperatureNum, setTemperatureNum] = React.useState(0.7);
  const [maximumLengthNum, setMaximumLengthNum] = React.useState(1500);
  const [topPNum, setTopPNum] = React.useState(1);
  const [frequencyPenaltyNum, setFrequencyPenaltyNum] = React.useState(0);
  const [presencePenaltyNum, setPresencePenaltyNum] = React.useState(0);
  const [bestOfNum, setBestOfNum] = React.useState(1);
  const [sectionSelect, setSectionSelect] = React.useState([]);
  const [AIModelSelect, setAIModelSelect] = React.useState('0');

  const [saveBtnDisabled, setSaveBtnDisabled] = React.useState(false);

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

  const AIModelSelectData = [
    'gpt-3.5',
    'gpt-4'
  ];

  const [addAiAgent] = useAddAiAgentMutation();

  const userInfo = useSelector((state: RootState) => state.user.userInfo);

  const handleSaveAIAgent = async () => {
    if (
      valueRefName.current.value === '' ||
      valueRefDescriiption.current.value === '' ||
      commandText === ''
    ) {
      Boardx.Util.Msg.info(t('adminPage.pleaseFillAllFields'));
      return;
    }

    const data = {
      chatSessionId: UtilityService.getInstance().generateWidgetID(),
      name: valueRefName.current.value,
      description: valueRefDescriiption.current.value,
      command: commandText,
      section: sectionSelect,
      gptModel: AIModelSelectData[AIModelSelect],
      temperature: temperatureNum,
      maximumLength: maximumLengthNum,
      topP: topPNum,
      frequencyPenalty: frequencyPenaltyNum,
      presencePenalty: presencePenaltyNum,
      bestOf: bestOfNum,
      icon: iconSrc,
      type:type,
      backgroundUrl: backgroundUrl,
      isFeatured: switchValue,
      createdBy: store.getState().user.userInfo.userId,
      lastUpdateUser: store.getState().user.userInfo.userName,
      lastUpdateUserId: store.getState().user.userInfo.userId,
      lastUpdateAt: new Date()
    };

    const result = await addAiAgent({ agentData: data });



    dispatch(handleSetCurrentAgent({ _id: result, ...data }));
    AIService.getInstance().InitializeChatSessionByID(
      data.chatSessionId,
      userInfo.userId
    );


    // Display a success message after successfully updating the command.
    Boardx.Util.Msg.success(t('adminPage.saveSuccessfully'));
  };

  const handleSwitchChange = event => {
    setSwitchValue(!switchValue);
  };

  const handleUploadIconFile = async e => {
    e.preventDefault();

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
        progress(ee) { }
      }
    );

    // Set the iconSrc state with the uploaded file key.
    setIconSrc(key);
  };

  const handleUploadBgImageFile = async e => {
    e.preventDefault();

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
        progress(ee) { }
      }
    );

    // Set the backgroundUrl state with the uploaded file key.
    setBackgroundUrl(key);
  };

  return (
    <Box sx={{
      height: '100%',
      position: 'relative',
    }}>
      <Box
        sx={{
          height: '100%',
          overflowY: 'scroll',
          overflowX: 'hidden',
          padding: '0px 20px'
        }}
      >
        {/* CATEGORY */}
        <Box sx={{ marginTop: '12px' }}>
          <StyledTypography variant="body1">
            {t('promptManagement.category')}
          </StyledTypography>
          <Autocomplete
            id="agentSectionSelect"
            multiple
            options={sectionSelectData.map(option => option)}
            getOptionLabel={option => option}
            filterSelectedOptions
            onChange={(event, value) => setSectionSelect(value)}
            value={sectionSelect}
            sx={{
              '.MuiAutocomplete-endAdornment': {
                top: '0px',
                right: '0px'
              },
              '.MuiAutocomplete-inputRoot': {
                padding: '0px !important'
              },
              '.MuiAutocomplete-input': {
                padding: '9px 17px'
              },
              '.MuiAutocomplete-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#F21D6B'
              }
            }}

            renderInput={params => (
              <TextField
                onBlur={event => {
                  if (event.target.value.trim() !== '') {
                    setSectionSelect([...sectionSelect, event.target.value]);
                  }
                }}
                onKeyDown={(event: any) => {
                  if (
                    event.key === 'Enter' &&
                    event.target.value.trim() !== ''
                  ) {
                    setSectionSelect([...sectionSelect, event.target.value]);
                  }
                }}
                {...params}
                placeholder={t('promptManagement.category')}
              />
            )}
          />
        </Box>

        {/* Name */}
        <Box sx={{ marginTop: '12px' }}>
          <StyledTypography variant="body1">
            {t('promptManagement.name')}
          </StyledTypography>
          <TextField
            sx={{
              '& .MuiInputBase-input': {
                padding: '9px 17px'
              },
              '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#F21D6B'
              }
            }}
            fullWidth
            id="name"
            inputRef={valueRefName}
            placeholder={t('promptManagement.name')}
            type="text"
            variant="outlined"
          />
        </Box>

        {/* Desription */}
        <Box sx={{ marginTop: '12px' }}>
          <StyledTypography variant="body1">
            {t('promptManagement.description')}
          </StyledTypography>
          <TextField
            id="desription"
            sx={{
              '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#F21D6B'
              }
            }}
            inputRef={valueRefDescriiption}
            placeholder={t('promptManagement.description')}
            type="text"
            variant="outlined"
            fullWidth
          />
        </Box>

        {/* Command */}
        <Box sx={{ marginTop: '12px' }}>
          <StyledTypography variant="body1">
            {t('promptManagement.prompt')}
          </StyledTypography>
          <TextareaAutosize
            value={commandText}
            id="command"
            placeholder={t('promptManagement.prompt')}
            style={{
              width: '100%',
              resize: 'none',
              border: '1px solid rgba(0, 0, 0, 0.23)',
              fontSize: '16px',
              fontWeight: 400,
              lineHeight: '24px',
              letterSpacing: '0.15px',
              padding: '5px',
              overflow: 'unset !important'
            }}
            onChange={e => setCommandText(e.target.value)}
            minRows={4}
          />
        </Box>



        {/* Temperature  Maximum Length  TopP */}
        <Box

          sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px' }}
        >
          {/* Temperature */}
          <Box sx={{ width: '184px' }}>
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              <StyledTypography variant="body1">
                {t('promptManagement.temperature')}
              </StyledTypography>
              <Typography sx={{
                fontWeight: 400,
                fontSize: '12px',
                letterSpacing: '0.4px',
                color: 'rgba(0, 0, 0, 0.48)'
              }}>
                {temperatureNum}
              </Typography>
            </Box>

            <Slider
              id="temperatureSlider"

              onChange={(event: any, newValue) =>
                setTemperatureNum(event.target.value)
              }
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
          <Box sx={{ width: '184px' }}>
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              <StyledTypography variant="body1">
                {t('promptManagement.maximumLength')}
              </StyledTypography>
              <Typography sx={{
                fontWeight: 400,
                fontSize: '12px',
                letterSpacing: '0.4px',
                color: 'rgba(0, 0, 0, 0.48)'
              }}>
                {maximumLengthNum}
              </Typography>
            </Box>

            <Slider
              id="MaximumLengthSlider"
              onChange={(event: any, newValue) =>
                setMaximumLengthNum(event.target.value)
              }
              max={4000}
              defaultValue={256}
              value={maximumLengthNum ? maximumLengthNum : 0}
              min={0}
              aria-label="Default"
              valueLabelDisplay="auto"
              step={1}
            />
          </Box>

        </Box>

        {/* Frequency Penalty   Presence Penalty   Best Of */}
        <Box

          sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px' }}
        >


        </Box>

        {/* Icon */}
        <Box sx={{ marginTop: '12px' }}>
          <StyledTypography
            style={{ marginBottom: '0px' }}

            variant="body1"
          >
            {t('promptManagement.icon')}
          </StyledTypography>
          <Box sx={{
            display: 'flex',
            height: '40px',
            alignItems: 'flex-end'
          }}>
            <Box sx={{ position: 'relative', overflow: 'hidden' }}>
              <Button
                variant="outlined"
                sx={{
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
                }}
                id="iconFileBtn"
              >
                {t('promptManagement.uploadFile')}
              </Button>
              <input
                style={{
                  width: '150px',
                  height: '30px',
                  position: 'absolute',
                  opacity: 0,
                  cursor: 'pointer',
                  left: '0px',
                  lineHeight: 7
                }}
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
        <Box sx={{ marginTop: '12px' }}>
          <StyledTypography
            style={{ marginBottom: '0px' }}

            variant="body1"
          >
            {t('promptManagement.backgroundImage')}
          </StyledTypography>
          <Box sx={{
            display: 'flex',
            height: '40px',
            alignItems: 'flex-end'
          }}>
            <Box sx={{ position: 'relative', overflow: 'hidden' }}>
              <Button
                variant="outlined"
                sx={{
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
                }}
                id="imagesFileBtn"
              >
                {t('promptManagement.uploadFile')}
              </Button>
              <input
                style={{
                  width: '150px',
                  height: '30px',
                  position: 'absolute',
                  opacity: 0,
                  cursor: 'pointer',
                  left: '0px',
                  lineHeight: 7
                }}
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

        {/* Switch */}
        <Box sx={{ marginTop: '12px' }}>
          <Box sx={{
            display: 'flex',
            alignItems: 'center'
          }}>
            <StyledTypography
              sx={{ mb: 0 }}
              variant="body1"
            >
              {t('promptManagement.isFeatured')}:{' '}
            </StyledTypography>
            <Switch
              onChange={handleSwitchChange}
              checked={switchValue}
              size="small"
            />
          </Box>
        </Box>
      </Box>

      <Box sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        position: 'absolute',
        bottom: '0px',
        right: '20px',
        backgroundColor: '#FFF',
        height: '88px',
        alignItems: 'center',
        width: '100%'
      }}>
        <Button
          sx={{
            fontWeight: 500,
            fontSize: '14px',
            lineHeight: '24px',
            letterSpacing: '0.4px',
            textTransform: 'uppercase',
            boxShadow: '0px 4px 8px -4px rgba(58, 53, 65, 0.42)',
            borderRadius: '5px',
            padding: '7px 22px !important',
            background: '#F21D6B !important'
          }}
          variant="contained"
          onClick={handleSaveAIAgent}
        // disabled={saveBtnDisabled}
        >
          {t('promptManagement.save')}
        </Button>
      </Box>
    </Box>
  );
}
