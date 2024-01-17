//** Import react
import React, { useState } from 'react';

import { styled } from '@mui/material/styles';

//** Import Redux kit
import {
  useGetAiModelTrainedAllDataQuery,
  useAdminDeleteAiModelRowTrainedDataMutation,
  useAdminUpdateAiModelMutation,
  useAdminAddAiModelTrainedMutation
} from '../../../redux/AiAssistApiSlice';

//** Import Mui
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import AddIcon from '@mui/icons-material/Add';
import LoadingButton from '@mui/lab/LoadingButton';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import AIModelAddTrainedData from './AIModelAddTrainedData';

//** Import i18n
import { useTranslation } from 'react-i18next';

//** Import services
import { UtilityService } from '../../../services';

import store from '../../../store';
import server from '../../../startup/serverConnect';

const PREFIX = 'AIModelTrainedDataGrid';

const classes = {
  addAndDeleteButtonBox: `${PREFIX}-addAndDeleteButtonBox`,
  addButton: `${PREFIX}-addButton`,
  deleteButton: `${PREFIX}-deleteButton`,
  saveAndSubmitButtonBox: `${PREFIX}-saveAndSubmitButtonBox`,
  saveButton: `${PREFIX}-saveButton`,
  submitButton: `${PREFIX}-submitButton`
};

const StyledBox = styled(Box)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  
  [`& .${classes.addAndDeleteButtonBox}`]: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '20px',
    marginBottom: '40px'
  },

  [`& .${classes.addButton}`]: {
    letterSpacing: '0.4px',
    textTransform: 'uppercase',
    fontWeight: 500,
    fontSize: '14px',
    lineHeight: '24px',
    color: '#F21D6B'
  },

  [`& .${classes.deleteButton}`]: {
    letterSpacing: '0.4px',
    textTransform: 'uppercase',
    fontWeight: 500,
    fontSize: '14px',
    lineHeight: '24px',
    color: 'rgba(0, 0, 0, 0.32)'
  },

  [`& .${classes.saveAndSubmitButtonBox}`]: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: '24px'
  },

  [`& .${classes.saveButton}`]: {
    letterSpacing: '0.4px',
    textTransform: 'uppercase',
    fontWeight: 500,
    fontSize: '14px',
    lineHeight: '24px',
    color: '#8A8D93',
    border: '1px solid #8A8D93'
  },

  [`& .${classes.submitButton}`]: {
    padding: '7px 22px',
    margin: '0px 16px 0px 16px',
    background: '#F21D6B',
    fontSize: '14px',
    lineHeight: '24px'
  }
}));

export default function AIModelTrainedDataGrid({
  currentRowData,
  setCurrentRowData
}) {

  const { t } = useTranslation();
  const [openAddNewRowDialog, setOpenAddNewRowDialog] = useState(false);
  const [currentRowTrainedData, setCurrentRowTrainedData] = useState(null);
  const [loadingSubmitButton, setLoadingSubmitButton] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [csvFile, setCsvFile] = useState(null);

  const { data: AiModelTrainedData = [] } = useGetAiModelTrainedAllDataQuery({
    modelId: currentRowData ? currentRowData._id : ''
  });

  const [adminDeleteAiModelRowTrainedData] =
    useAdminDeleteAiModelRowTrainedDataMutation();

  const [adminUpdateAiModel] = useAdminUpdateAiModelMutation();

  const [adminAddAiModelTrained] = useAdminAddAiModelTrainedMutation();

  const handleCloseAddNewRowDialog = () => {
    setOpenAddNewRowDialog(false);
  };

  const handleClickDeleteCurrentRowTrainedData = async () => {
    if (!currentRowTrainedData) {
      Boardx.Util.Msg.info(t('adminPage.selectTableContent'));
      return;
    }
    await adminDeleteAiModelRowTrainedData({
      trainedDataId: currentRowTrainedData._id
    });
  };

  const handleSubmitTraining = async () => {
    if (!currentRowData) {
      Boardx.Util.Msg.info(t('adminPage.pleaseSelectAModel'));
      return;
    }
    if (currentRowData.status !== 'Draft') {
      Boardx.Util.Msg.info(t('adminPage.modelDraftStatus'));
      return;
    }

    setLoadingSubmitButton(true);
    let newAiModelTrainedData = [];
    AiModelTrainedData.map(item => {
      newAiModelTrainedData.push({
        prompt: item.prompt,
        completion: item.completion
      });
    });

    const utcString = new Date().toUTCString();
    const easternTime = new Date(utcString + ' UTC+1300');
    const options: any = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true
    };
    const formatter = new Intl.DateTimeFormat('en-US', options);
    const submittedTime = formatter.format(easternTime);

    server.call('ai.submittedModelDataTraining',
      currentRowData,
      newAiModelTrainedData).then(async res => {
        setLoadingSubmitButton(false);
        setCurrentRowData({
          ...currentRowData,
          status: 'Submitted',
          submittedTime: submittedTime
        });
        await adminUpdateAiModel({
          newModelData: {
            ...currentRowData,
            status: 'Submitted',
            submittedTime: submittedTime
          }
        });
        Boardx.Util.Msg.info(t('adminPage.trainingSuccessfully'));
    }).catch(err => {
      Boardx.Util.Msg.info(err.reason);
      return;
    });

  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleCloseOverrideDialog = () => {
    handleCloseDialog();
    getCsvFileData(csvFile);
  };

  const handleOverride = async () => {
    handleCloseDialog();
    await adminDeleteAiModelRowTrainedData({
      trainedDataId: AiModelTrainedData
    });
    getCsvFileData(csvFile);
  };

  const handleUploadFile = e => {
    e.preventDefault();
    if (!currentRowData) {
      Boardx.Util.Msg.info(t('adminPage.pleaseSelectAModel'));
      return;
    }

    const file = e.target.files[0];
    if (AiModelTrainedData && AiModelTrainedData.length > 0) {
      e.target.value = '';
      setOpenDialog(true);
      setCsvFile(file);
    } else {
      e.target.value = '';
      getCsvFileData(file);
    }
  };

  const getCsvFileData = file => {
    csvToJson(file, async result => {
      await adminAddAiModelTrained({ modelTrainedData: result });
    });
  };

  const csvToJson = (file, callback) => {
    const reader = new FileReader();
    reader.onload = function (event) {
      const csvData:any = event.target.result;
      const lines = csvData.split('\n');
      const result = [];
      const headers = lines[0].split(',');
      for (let i = 1; i < lines.length; i++) {
        let obj = {};
        const currentLine = lines[i].split(',');
        if (currentLine.length !== headers.length) {
          continue;
        }
        for (let j = 0; j < headers.length; j++) {
          let objAttribute = headers[j].replace(/(\r\n|\n|\r)/gm, '');
          obj[objAttribute.toLocaleLowerCase()] = currentLine[j];
        }
        obj = {
          ...obj,
          createdAt: new Date(),
          createUser: store.getState().user.userInfo.userName,
          createUserId: store.getState().user.userInfo.userId,
          lastUpdateUser: store.getState().user.userInfo.userName,
          lastUpdateUserId: store.getState().user.userInfo.userId,
          lastUpdateAt: new Date(),
          _id: UtilityService.getInstance().generateWidgetID(),
          modelId: currentRowData._id
        };
        result.push(obj);
      }
      callback(result);
    };
    reader.readAsText(file);
  };

  const columns = [
    {
      field: 'prompt',
      headerName: 'prompt',
      type: 'string',
      width: 300
    },
    {
      field: 'completion',
      headerName: 'completion',
      type: 'string',
      width: 300
    }
  ];

  return (
    <StyledBox>
      <Box sx={{ flex: 1 }}>
        <DataGrid
          style={{ minHeight: '170px', height: '90%' }}
          rows={AiModelTrainedData}
          columns={columns}
          disableColumnMenu
          rowsPerPageOptions={[25, 50, 100]}
          pageSize={25}
          getRowId={row => row._id}
          onRowClick={(params, event) => {
            setCurrentRowTrainedData(params.row);
          }}
        />
        <Box className={classes.addAndDeleteButtonBox}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button
              className={classes.addButton}
              sx={{ mr: '8px' }}
              onClick={() => setOpenAddNewRowDialog(true)}
              variant="text"
              disabled={
                currentRowData && currentRowData.status !== 'Draft'
                  ? true
                  : false
              }
            >
              <AddIcon sx={{ mr: '11px' }} /> ADD NEW ROW
            </Button>
            <input type="file" accept=".csv" onChange={handleUploadFile} />
          </Box>
          <Button
            onClick={handleClickDeleteCurrentRowTrainedData}
            className={classes.addButton}
            variant="text"
            disabled={
              currentRowData && currentRowData.status !== 'Draft' ? true : false
            }
          >
            DELETE
          </Button>
        </Box>
      </Box>

      <Box className={classes.saveAndSubmitButtonBox}>
        <Button
          disabled={
            currentRowData && currentRowData.status !== 'Draft' ? true : false
          }
          className={classes.saveButton}
          variant="outlined"
        >
          SAVE
        </Button>
        <LoadingButton
          disabled={
            currentRowData && currentRowData.status !== 'Draft' ? true : false
          }
          loading={loadingSubmitButton}
          className={classes.submitButton}
          onClick={handleSubmitTraining}
          variant="contained"
        >
          SUBMIT TRAINING
        </LoadingButton>
      </Box>
      <AIModelAddTrainedData
        handleCloseAddNewRowDialog={handleCloseAddNewRowDialog}
        openAddNewRowDialog={openAddNewRowDialog}
        currentModelData={currentRowData}
      />
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogContent>
          Whether to override existing model training data?
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleCloseOverrideDialog}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleOverride}>
            Override
          </Button>
        </DialogActions>
      </Dialog>
    </StyledBox>
  );
}
