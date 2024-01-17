//** Import react
import React, { useRef, Component, useEffect, useState } from 'react';

import { styled } from '@mui/material/styles';

//** Import i18n
import { useTranslation } from 'react-i18next';

//** Import Redux kit
import {
  useAdminDeleteAiModelMutation,
  useAdminUpdateAiModelMutation,
  useAdminDeleteAiModelAllTrainedDataMutation
} from '../../../redux/AiAssistApiSlice';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import store from '../../../store';

const PREFIX = 'AIModelParameter';

const classes = {
  selecIcon: `${PREFIX}-selecIcon`,
  select: `${PREFIX}-select`,
  inputBox: `${PREFIX}-inputBox`,
  inputTitle: `${PREFIX}-inputTitle`,
  textFieldRoot: `${PREFIX}-textFieldRoot`,
  textFieldRoot2: `${PREFIX}-textFieldRoot2`,
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
  timeText: `${PREFIX}-timeText`
};

const StyledBox = styled(Box)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  
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
    background: '#F21D6B'
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
  }
}));

export default function AIModelParameter({
  currentRowData,
  setCurrentRowData
}) {

  const valueRefName:any = useRef(''); //creating a refernce for TextField Component
  const { t } = useTranslation();
  const [name, setName] = React.useState('');
  const [modelSelect, setModelSelect] = React.useState('0');
  const [fineTunedModel, setFineTunedModel] = React.useState('');
  const [nEpochs, setNEpochs] = React.useState(4); // null 4
  const [batchSize, setBatchSize] = React.useState(null); //1~256
  const [learningRateMultiplier, setLearningRateMultiplier] =
    React.useState(null); // 0.02~0.2
  const [promptLossWeight, setPromptLossWeight] = React.useState(0.01); // 0.01~1.0
  const [computeClassificationMetrics, setComputeClassificationMetrics] =
    React.useState(false); // fasle true
  const [classificationNClasses, setClassificationNClasses] =
    React.useState(null);
  const [classificationPositiveClass, setClassificationPositiveClass] =
    React.useState(null);
  const [classificationBetas, setClassificationBetas] = React.useState(null);
  const [suffix, setSuffix] = React.useState(null);
  const [statusSelect, setStatusSelect] = React.useState('0');
  const statusSelectData = ['Draft', 'Trained', 'Submitted'];
  const modelSelectData = ['curie', 'babbage', 'ada', 'davinci'];

  const [adminDeleteAiModel] = useAdminDeleteAiModelMutation();
  const [adminUpdateAiModel] = useAdminUpdateAiModelMutation();
  const [adminDeleteAiModelAllTrainedData] =
    useAdminDeleteAiModelAllTrainedDataMutation();

  useEffect(() => {
    if (!currentRowData) return;
    setName(currentRowData.name);
    setModelSelect(
      String(
        modelSelectData.indexOf(currentRowData.model) > -1
          ? modelSelectData.indexOf(currentRowData.model)
          : 0
      )
    );
    setFineTunedModel(
      currentRowData.modelTrainingInfo &&
        currentRowData.modelTrainingInfo.fine_tuned_model
        ? currentRowData.modelTrainingInfo.fine_tuned_model
        : ''
    );
    setNEpochs(currentRowData.n_epochs);
    setBatchSize(currentRowData.batch_size);
    setLearningRateMultiplier(currentRowData.learning_rate_multiplier);
    setPromptLossWeight(currentRowData.prompt_loss_weight);
    setComputeClassificationMetrics(
      currentRowData.compute_classification_metrics
    );
    setClassificationNClasses(currentRowData.classification_n_classes);
    setClassificationPositiveClass(
      currentRowData.classification_positive_class
    );
    setClassificationBetas(currentRowData.classification_betas);
    setSuffix(currentRowData.suffix);
  }, [currentRowData]);

  const handleSaveEditCommand = async () => {
    const data = {
      ...currentRowData,
      name: valueRefName.current.value,
      model: modelSelectData[Number(modelSelect)],
      lastUpdateUser: store.getState().user.userInfo.userName,
      lastUpdateUserId: store.getState().user.userInfo.userId,
      lastUpdateAt: new Date()
    };
console.log('data', data)
    await adminUpdateAiModel({
      newModelData: data
    });
    Boardx.Util.Msg.info(t('adminPage.updateSuccessfully'));
  };

  const handleDeleteCommand = async () => {
    let text =
      'confirm to delete the AI modeld data: ' + currentRowData.name + '?';
    if (confirm(text) == false) {
      return;
    }

    if (currentRowData) {
      await adminDeleteAiModel({ modelId: currentRowData._id,});
      // 删除当前 AI model 时，同时删除所有的 trained data
      await adminDeleteAiModelAllTrainedData({ modelId: currentRowData._id });
      // Boardx.Util.Msg.info(err.reason);
      Boardx.Util.Msg.info(t('adminPage.deleteSuccessfully'));
      setCurrentRowData(null);
    } else {
      Boardx.Util.Msg.info(t('adminPage.selectTableContent'));
    }
  };

  return (
    <StyledBox>
      <Box sx={{ flex: 1, p: '0 0 100px' }}>
        {/* Name */}
        <Box className={classes.inputBox}>
          <Typography className={classes.inputTitle} variant="body1">
            NAME
          </Typography>
          <TextField
            autoFocus
            classes={{ root: classes.textFieldRoot2 }}
            fullWidth
            value={name}
            id="name"
            inputRef={valueRefName}
            placeholder="name"
            type="text"
            variant="outlined"
            onChange={() => setName(valueRefName.current.value)}
            onBlur={() =>
              setCurrentRowData({
                ...currentRowData,
                name: valueRefName.current.value
              })
            }
            disabled={
              currentRowData && currentRowData.status !== 'Draft' ? true : false
            }
          />
        </Box>

        {/* Model */}
        <Box className={classes.inputBox}>
          <Typography className={classes.inputTitle} variant="body1">
            Model
          </Typography>
          <Select
            sx={{ width: '220px' }}
            id="modelSelect"
            onChange={event => {
              setModelSelect(event.target.value);
              setCurrentRowData({
                ...currentRowData,
                model: modelSelectData[Number(event.target.value)]
              });
            }}
            value={modelSelect}
            classes={{
              select: classes.select,
              icon: classes.selecIcon
            }}
            disabled={
              currentRowData && currentRowData.status !== 'Draft' ? true : false
            }
            IconComponent={ExpandMoreIcon}
          >
            {modelSelectData && modelSelectData.length > 0
              ? modelSelectData.map((type, index) => {
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

        {/* fine_tuned_model */}
        <Box className={classes.inputBox}>
          <Typography className={classes.inputTitle} variant="body1">
            Fine Tuned Model
          </Typography>
          <TextField
            classes={{ root: classes.textFieldRoot2 }}
            value={fineTunedModel}
            disabled={true}
            id="fine_tuned_model"
            type="text"
            variant="outlined"
            fullWidth
          />
        </Box>

        {/* N Epochs、Batch Size、learning rate multiplier */}
        <Box className={classes.inputBox} sx={{ display: 'flex' }}>
          {/* N Epochs */}
          <Box sx={{ mr: '12px' }}>
            <Typography className={classes.inputTitle} variant="body1">
              N Epochs
            </Typography>
            <TextField
              classes={{ root: classes.textFieldRoot }}
              value={nEpochs}
              disabled={true}
              id="n_epochs"
              type="text"
              variant="outlined"
            />
          </Box>

          {/* batch size */}
          <Box sx={{ mr: '12px' }}>
            <Typography className={classes.inputTitle} variant="body1">
              Batch Size
            </Typography>
            <TextField
              classes={{ root: classes.textFieldRoot }}
              // value={batchSize}
              disabled={true}
              id="batch_size"
              type="text"
              variant="outlined"
              placeholder=""
            />
          </Box>

          {/* learning rate multiplier */}
          <Box sx={{ mr: '12px' }}>
            <Typography className={classes.inputTitle} variant="body1">
              Learning Rate Multiplier
            </Typography>
            <TextField
              classes={{ root: classes.textFieldRoot }}
              // value={learningRateMultiplier}
              disabled={true}
              id="learning_rate_multiplier"
              type="text"
              variant="outlined"
              placeholder=""
            />
          </Box>
        </Box>

        {/* prompt loss weight、compute classification metrics、classification n */}
        <Box className={classes.inputBox} sx={{ display: 'flex' }}>
          {/* prompt loss weight */}
          <Box sx={{ mr: '12px' }}>
            <Typography className={classes.inputTitle} variant="body1">
              Prompt Loss Weight
            </Typography>
            <TextField
              classes={{ root: classes.textFieldRoot }}
              value={promptLossWeight}
              disabled={true}
              id="prompt_loss_weight"
              type="text"
              variant="outlined"
            />
          </Box>

          {/* compute classification metrics */}
          <Box sx={{ mr: '12px' }}>
            <Typography className={classes.inputTitle} variant="body1">
              Compute Classification Metrics
            </Typography>
            <TextField
              classes={{ root: classes.textFieldRoot }}
              // value={computeClassificationMetrics}
              disabled={true}
              id="compute_classification_metrics"
              type="text"
              variant="outlined"
              placeholder=""
            />
          </Box>

          {/* classification n */}
          <Box sx={{ mr: '12px' }}>
            <Typography className={classes.inputTitle} variant="body1">
              Classification N Classes
            </Typography>
            <TextField
              classes={{ root: classes.textFieldRoot }}
              // value={classificationNClasses}
              disabled={true}
              id="classification_n_classes"
              type="text"
              variant="outlined"
              placeholder=""
            />
          </Box>
        </Box>

        {/*classification positive class、classification betas、classification n */}
        <Box className={classes.inputBox} sx={{ display: 'flex' }}>
          {/* prompt loss weight */}
          <Box sx={{ mr: '12px' }}>
            <Typography className={classes.inputTitle} variant="body1">
              Classification Positive Class
            </Typography>
            <TextField
              classes={{ root: classes.textFieldRoot }}
              // value={classificationPositiveClass}
              disabled={true}
              id="classification_positive_class"
              type="text"
              variant="outlined"
              placeholder=""
            />
          </Box>

          {/* classification betas */}
          <Box sx={{ mr: '12px' }}>
            <Typography className={classes.inputTitle} variant="body1">
              Classification Betas
            </Typography>
            <TextField
              classes={{ root: classes.textFieldRoot }}
              // value={classificationBetas}
              disabled={true}
              id="classification_betas"
              type="text"
              variant="outlined"
              placeholder=""
            />
          </Box>

          {/* suffix */}
          <Box sx={{ mr: '12px' }}>
            <Typography className={classes.inputTitle} variant="body1">
              Suffix
            </Typography>
            <TextField
              classes={{ root: classes.textFieldRoot }}
              // value={suffix}
              disabled={true}
              id="suffix"
              type="text"
              variant="outlined"
              placeholder=""
            />
          </Box>
        </Box>
      </Box>

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
          disabled={
            currentRowData && currentRowData.status !== 'Draft' ? true : false
          }
        >
          Save
        </Button>
      </Box>
    </StyledBox>
  );
}
