//** Import react
import React, { useRef, Component, useEffect, useState } from 'react';

import { styled } from '@mui/material/styles';

//** Import i18n
import { useTranslation } from 'react-i18next';
import store, { RootState } from '../../../store';
import { useSelector, useDispatch } from 'react-redux';
import { handleSetCurrentAdminAiImagePromptData } from '../../../store/AIAssist';

//** Import Redux kit
import {
  useAdminUpdateAiCustomStyleCommandMutation,
  useAdminDeleteAiCustomStyleCommandMutation
} from '../../../redux/AiAssistApiSlice';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Switch from '@mui/material/Switch';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';

import { FileService, UtilityService } from '../../../services';

const PREFIX = 'AIAssistantImagesDetails';

const classes = {
  selecIcon: `${PREFIX}-selecIcon`,
  select: `${PREFIX}-select`,
  inputBox: `${PREFIX}-inputBox`,
  inputTitle: `${PREFIX}-inputTitle`,
  textFieldRoot: `${PREFIX}-textFieldRoot`,
  textFieldRoot2: `${PREFIX}-textFieldRoot2`,
  textFieldRoot3: `${PREFIX}-textFieldRoot3`,
  buttonBox: `${PREFIX}-buttonBox`,
  deleteButton: `${PREFIX}-deleteButton`,
  saveAndPreview: `${PREFIX}-saveAndPreview`,
  userInfoBox: `${PREFIX}-userInfoBox`,
  userNameText: `${PREFIX}-userNameText`,
  timeText: `${PREFIX}-timeText`,
  textAreaStyle: `${PREFIX}-textAreaStyle`,
  backgroundImgBox: `${PREFIX}-backgroundImgBox`
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

  [`& .${classes.userInfoBox}`]: {
    display: 'flex'
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

  [`& .${classes.backgroundImgBox}`]: {
    display: 'flex',
    height: '40px',
    alignItems: 'flex-end'
  }
}));

export default function AIAssistantImagesDetails({
  setOpenAiImagePromptDialog
}) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const valueRefName: any = useRef(''); //creating a refernce for TextField Component
  const valueRefWeight: any = useRef(''); //creating a refernce for TextField Component
  const valueRefDescriiption: any = useRef(''); //creating a refernce for TextField Component
  const valueRefCategory: any = useRef(''); //creating a refernce for TextField Component
  const valueRefWidth: any = useRef(''); //creating a refernce for TextField Component
  const valueRefHeight: any = useRef(''); //creating a refernce for TextField Component

  const [switchValue, setSwitchValue] = React.useState(false);
  const [name, setName] = React.useState('');
  const [weight, setWeight] = React.useState(undefined);
  const [description, setDescription] = React.useState('');
  const [category, setCategory] = React.useState('');
  const [commandText, setCommandText] = React.useState('');
  const [width, setWidth] = React.useState('');
  const [height, setHeight] = React.useState('');
  const [iconSrc, setIconSrc] = React.useState('');
  const [backgroundUrl, setBackgroundUrl] = React.useState('');
  const [typeSelect, setTypeSelect] = React.useState('0');
  const typeSelectData = ['', 'Artists', 'Styles', 'Medium'];

  const currentRowData = useSelector(
    (state: RootState) => state.AIAssist.currentAdminAiImagePromptData
  );

  const [adminUpdateAiCustomStyleCommand, { isError, isSuccess, isLoading }] =
    useAdminUpdateAiCustomStyleCommandMutation();
  const [adminDeleteAiCustomStyleCommand] =
    useAdminDeleteAiCustomStyleCommandMutation();

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
    setWeight(currentRowData.weight || '');
    setDescription(currentRowData.description || '');
    setCategory(currentRowData.category || '');
    setCommandText(currentRowData.command || '');
    setSwitchValue(currentRowData.isFeatured || false);
    setWidth(currentRowData.width || '');
    setHeight(currentRowData.height || '');
    setIconSrc(currentRowData.icon || '');
    setBackgroundUrl(currentRowData.backgroundUrl || '');
  }, [currentRowData]);

  const handleSaveEditCommand = async () => {
    if (
      valueRefName.current.value === '' ||
      // valueRefDescriiption.current.value === '' ||
      valueRefCategory.current.value === ''
      // ||
      // commandText === ''
    ) {
      Boardx.Util.Msg.info(t('adminPage.pleaseFillAllFields'));
      return;
    }

    const data = {
      _id: currentRowData._id,
      name: valueRefName.current.value,
      type: typeSelectData[typeSelect],
      weight: valueRefWeight.current.value,
      description: valueRefDescriiption.current.value,
      category: valueRefCategory.current.value,
      command: commandText,
      width: valueRefWidth.current.value,
      height: valueRefHeight.current.value,
      icon: iconSrc,
      backgroundUrl: backgroundUrl,
      isFeatured: switchValue,
      lastUpdateUser: store.getState().user.userInfo.userName,
      lastUpdateUserId: store.getState().user.userInfo.userId,
      lastUpdateAt: new Date()
    };

    await adminUpdateAiCustomStyleCommand({
      updateCommand: data,
      currentSelectCommand: currentRowData
    });
    // Boardx.Util.Msg.info(err.reason);
    Boardx.Util.Msg.info(t('adminPage.updateSuccessfully'));
  };

  const handleDeleteCommand = async () => {
    const row = currentRowData;
    let text = 'confirm to delete the commmand: ' + currentRowData.name + '?';
    if (confirm(text) == false) {
      return;
    }

    if (row) {
      await adminDeleteAiCustomStyleCommand({ commandId: row._id });
      Boardx.Util.Msg.info(t('adminPage.deleteSuccessfully'));
      dispatch(handleSetCurrentAdminAiImagePromptData(null));
      // Boardx.Util.Msg.info(err.reason);
    } else {
      Boardx.Util.Msg.info(t('adminPage.selectTableContent'));
    }
    setOpenAiImagePromptDialog(false);
  };

  const handleSwitchChange = event => {
    setSwitchValue(event.target.checked);
  };

  const handleUploadIconFile = async e => {
    e.preventDefault();
    const input = document.getElementById('iconFile') as HTMLInputElement;
    const files = input.files;
    if (files.length > 1) {
      const v = document.getElementById('iconFile') as HTMLInputElement;
      v.value = '';
      alert('Please select a single file to upload!');
      return;
    }
    const r2UploadPath = UtilityService.getInstance().getr2UploadPath(
      store.getState().board.board
    );
    const key: any = await FileService.getInstance().uploadFileToR2Async(
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
    const input = document.getElementById(
      'backgroundImageFile'
    ) as HTMLInputElement;
    const files = input.files;

    if (files.length > 1) {
      const v = document.getElementById(
        'backgroundImageFile'
      ) as HTMLInputElement;
      v.value = '';
      alert('Please select a single file to upload!');
      return;
    }
    const r2UploadPath = UtilityService.getInstance().getr2UploadPath(
      store.getState().board.board
    );
    const key: any = await FileService.getInstance().uploadFileToR2Async(
      r2UploadPath,
      files[0],
      {
        progress(ee) {}
      }
    );
    setBackgroundUrl(key);
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
            CATEGORY
          </Typography>
          <TextField
            classes={{ root: classes.textFieldRoot2 }}
            fullWidth
           
            inputRef={valueRefCategory}
            id="category"
            placeholder="Content"
            type="text"
            variant="outlined"
            onChange={() => setCategory(valueRefCategory.current.value)}
            onBlur={() =>
              dispatch(
                handleSetCurrentAdminAiImagePromptData({
                  ...currentRowData,
                  category: valueRefCategory.current.value
                })
              )
            }
            value={category}
          />
        </Box>

        {/* Name */}
        <Box className={classes.inputBox}>
          <Typography className={classes.inputTitle} variant="body1">
            NAME
          </Typography>
          <TextField
            classes={{ root: classes.textFieldRoot2 }}
            id="name"
            inputRef={valueRefName}
            placeholder="name"
            type="text"
            variant="outlined"
            value={name}
            fullWidth
            onChange={() => setName(valueRefName.current.value)}
            onBlur={() =>
              dispatch(
                handleSetCurrentAdminAiImagePromptData({
                  ...currentRowData,
                  name: valueRefName.current.value
                })
              )
            }
          />
        </Box>

        {/* Type  section */}
        <Box sx={{ display: 'flex' }} className={classes.inputBox}>
          <Box sx={{ mr: '12px', width: '30%' }}>
            <Typography className={classes.inputTitle} variant="body1">
              TYPE
            </Typography>
            <Select
              sx={{ width: '100%' }}
              id="commandTypeSelect"
              onChange={event => {
                setTypeSelect(event.target.value);
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

        {/* Weight  Width  Height */}
        <Box sx={{ display: 'flex' }} className={classes.inputBox}>
          <Box sx={{ mr: '12px', width: '30%' }}>
            <Typography className={classes.inputTitle} variant="body1">
              WEIGHT
            </Typography>
            <TextField
              id="weight"
              inputRef={valueRefWeight}
              placeholder="weight"
              type="text"
              variant="outlined"
              classes={{ root: classes.textFieldRoot }}
              onChange={() => setWeight(valueRefWeight.current.value)}
              onBlur={() =>
                dispatch(
                  handleSetCurrentAdminAiImagePromptData({
                    ...currentRowData,
                    weight: valueRefWeight.current.value
                  })
                )
              }
              value={weight}
            />
          </Box>

          <Box sx={{ mr: '12px', width: '30%' }}>
            <Typography className={classes.inputTitle} variant="body1">
              WIDTH
            </Typography>
            <TextField
              id="width"
              inputRef={valueRefWidth}
              placeholder="width"
              maxRows={4}
              type="text"
              variant="outlined"
              classes={{ root: classes.textFieldRoot }}
              onChange={() => setWidth(valueRefWidth.current.value)}
              onBlur={() =>
                dispatch(
                  handleSetCurrentAdminAiImagePromptData({
                    ...currentRowData,
                    width: valueRefWidth.current.value
                  })
                )
              }
              value={width}
            />
          </Box>

          <Box sx={{ width: '30%' }}>
            <Typography className={classes.inputTitle} variant="body1">
              HEIGHT
            </Typography>
            <TextField
              id="height"
              placeholder="height"
              inputRef={valueRefHeight}
              maxRows={4}
              type="text"
              variant="outlined"
              classes={{ root: classes.textFieldRoot }}
              onChange={() => setHeight(valueRefHeight.current.value)}
              onBlur={() =>
                dispatch(
                  handleSetCurrentAdminAiImagePromptData({
                    ...currentRowData,
                    height: valueRefHeight.current.value
                  })
                )
              }
              value={height}
            />
          </Box>
        </Box>

        {/* Desription */}
        <Box className={classes.inputBox}>
          <Typography className={classes.inputTitle} variant="body1">
            DESCRIPTION
          </Typography>
          <TextField
            id="desription"
            inputRef={valueRefDescriiption}
            classes={{ root: classes.textFieldRoot3 }}
            placeholder="desription"
            type="text"
            variant="outlined"
            fullWidth
            onChange={() => setDescription(valueRefDescriiption.current.value)}
            onBlur={() =>
              dispatch(
                handleSetCurrentAdminAiImagePromptData({
                  ...currentRowData,
                  description: valueRefDescriiption.current.value
                })
              )
            }
            value={description}
          />
        </Box>

        {/* Command */}
        <Box className={classes.inputBox}>
          <Typography className={classes.inputTitle} variant="body1">
            PROMPT
          </Typography>
          <TextareaAutosize
            id="command"
            placeholder="Prompt"
            className={classes.textAreaStyle}
            onChange={e => {
              setCommandText(e.target.value);
              dispatch(
                handleSetCurrentAdminAiImagePromptData({
                  ...currentRowData,
                  command: e.target.value
                })
              );
            }}
            value={commandText}
          />
        </Box>

        {/* Icon */}
        <Box className={classes.inputBox}>
          <Typography className={classes.inputTitle} variant="body1">
            ICON
          </Typography>
          <Box className={classes.backgroundImgBox}>
            <input
              data-shape="image"
              id="iconFile"
              multiple
              name="files"
              onChange={handleUploadIconFile}
              type="file"
              accept=".png,.jpeg,.jpg,.webp,.gif,.svg"
            />
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
          <Typography className={classes.inputTitle} variant="body1">
            BACKGROUND IMAGE
          </Typography>
          <Box className={classes.backgroundImgBox}>
            <input
              data-shape="image"
              id="backgroundImageFile"
              multiple
              name="files"
              onChange={handleUploadBgImageFile}
              type="file"
              accept=".png,.jpeg,.jpg,.webp,.gif,.svg"
            />
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
        <Box>
          <Switch onChange={handleSwitchChange} checked={switchValue} />
        </Box>

        {/* create User info */}
        <Box className={classes.inputBox}>
          <Box className={classes.userInfoBox}>
            <Typography className={classes.userNameText} variant="body1">
              Created by:{' '}
              {currentRowData && currentRowData.createUser
                ? currentRowData.createUser
                : 'admin'}
            </Typography>
            <Typography className={classes.timeText} variant="body1">
              Created Time:{' '}
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
              Last Updated by:{' '}
              {currentRowData && currentRowData.lastUpdateUser
                ? currentRowData.createUser
                : 'admin'}
            </Typography>
            <Typography className={classes.timeText} variant="body1">
              Last Updated Time:{' '}
              {currentRowData && currentRowData.lastUpdateAt
                ? currentRowData.lastUpdateAt.toLocaleString()
                : '2021/08/01 00:00:00'}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* save button */}
      <Box className={classes.buttonBox}>
        <Button
          onClick={handleDeleteCommand}
          className={classes.deleteButton}
          variant="outlined"
        >
          Delete
        </Button>
        <Button
          className={classes.saveAndPreview}
          variant="contained"
          onClick={handleSaveEditCommand}
        >
          Save
        </Button>
      </Box>
    </StyledBox>
  );
}
