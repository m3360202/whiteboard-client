//** Import react
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { useEffect, useState } from 'react';

//** Import i18n
import { useTranslation } from 'react-i18next';

//** Import Redux kit
import {
  useGetAiModelAllDataQuery,
  useAdminUpdateAiModelMutation
} from '../../../redux/AiAssistApiSlice';

//** Import Mui
import { DataGrid } from '@mui/x-data-grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Chip from '@mui/material/Chip';
import LoadingButton from '@mui/lab/LoadingButton';
import TextField from '@mui/material/TextField';

import AIModelAddNewModel from './AIModelAddNewModel';
import AIModelParameter from './AIModelParameter';
import AIModelTrainedDataGrid from './AIModelTrainedDataGrid';
import server from '../../../startup/serverConnect';

const PREFIX = 'AIModelManagementPage';

const classes = {
  tabPanelBoxContent: `${PREFIX}-tabPanelBoxContent`,
  addNewModelButton: `${PREFIX}-addNewModelButton`,
  buttonBox: `${PREFIX}-buttonBox`,
  addNewModelBox: `${PREFIX}-addNewModelBox`,
  addNewModelTitleBox: `${PREFIX}-addNewModelTitleBox`,
  titleText: `${PREFIX}-titleText`,
  symbolStyle: `${PREFIX}-symbolStyle`,
  tabRoot: `${PREFIX}-tabRoot`,
  tabPanelRoot: `${PREFIX}-tabPanelRoot`,
  textFieldRoot: `${PREFIX}-textFieldRoot`
};

const StyledBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-start',
  marginTop: '30px',
  height: '97%',
  
  [`& .${classes.tabPanelBoxContent}`]: {
    width: '40%',
    borderRadius: '6px 0px 0px 6px',
    background: '#FFFFFF',
    display: 'flex',
    flexDirection: 'column'
  },

  [`& .${classes.addNewModelButton}`]: {
    padding: '7px 22px',
    margin: '0px 16px 0px 16px',
    background: '#F21D6B',
    fontSize: '14px',
    lineHeight: '24px'
  },

  [`& .${classes.buttonBox}`]: {
    margin: '30px 0px 24px',
    display: 'flex',
    justifyContent: 'flex-end'
  },

  [`& .${classes.addNewModelBox}`]: {
    flex: 1,
    borderRadius: '0px 6px 6px 0px',
    display: 'flex',
    flexDirection: 'column',
    background: '#FFFFFF',
    padding: '0px 18px 0px 18px',
    position: 'relative'
  },

  [`& .${classes.addNewModelTitleBox}`]: {
    display: 'flex',
    marginBottom: '15px'
  },

  [`& .${classes.titleText}`]: {
    fontWeight: 700,
    color: '#232930',
    fontSize: '16px',
    lineHeight: '19px',
    textTransform: 'capitalize',
    marginRight: '12px'
  },

  [`& .${classes.symbolStyle}`]: {
    color: 'rgba(58, 53, 65, 0.68)',
    letterSpacing: '0.15px',
    fontSize: '16px',
    lineHeight: '19px'
  },

  [`& .${classes.tabRoot}`]: {
    padding: '8px 10px'
  },

  [`& .${classes.tabPanelRoot}`]: {
    flex: 1,
    padding: 0,
    overflowY: 'scroll'
  },

  [`& .${classes.textFieldRoot}`]: {
    '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#F21D6B'
    },
    '& .Mui-focused': {
      color: '#F21D6B'
    }
  }
}));

export default function AIModelManagementPage() {

  const modelNameRef:any = React.useRef('');
  const { t } = useTranslation();
  const [searchKeyWord, setSearchKeyWord] = React.useState('');
  const [currentRowData, setCurrentRowData] = React.useState(null);
  const [tabValue, setTabValue] = React.useState('1');
  const [loadingCancelButton, setLoadingCancelButton] = React.useState(false);
  const [openAddNewModelDialog, setOpenAddNewModelDialog] =
    React.useState(false);

  const { data: modelData = [] } = useGetAiModelAllDataQuery(undefined);
  const [adminUpdateAiModel] = useAdminUpdateAiModelMutation();

  const handleStatusCellDOM = params => {
    const status = params.row.status;
    return (
      <Chip
        label={status}
        style={{
          backgroundColor: '#F5F8F6',
          color:
            status === 'Draft'
              ? 'rgba(35, 41, 48, 0.65)'
              : status === 'Trained'
              ? '#00CA69'
              : '#FFB321'
        }}
      />
    );
  };

  const handleSubmittedTimeCellDOM = params => {
    const time = params.row.submittedTime ? params.row.submittedTime : '';
    return (
      <Typography variant="body2" color="text.secondary">
        {time}
      </Typography>
    );
  };

  const handleTrainedTimeCellDOM = params => {
    const time = params.row.trainedTime ? params.row.trainedTime : '';
    return (
      <Typography variant="body2" color="text.secondary">
        {time}
      </Typography>
    );
  };

  const columns = [
    {
      field: 'name',
      headerName: 'Name',
      width: 200
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
      renderCell: params => handleStatusCellDOM(params)
    },
    {
      field: 'submittedTime',
      headerName: 'Submitted Time',
      width: 180,
      renderCell: params => handleSubmittedTimeCellDOM(params)
    },
    {
      field: 'trainedTime',
      headerName: 'Trained Time',
      width: 180,
      renderCell: params => handleTrainedTimeCellDOM(params)
    }
  ];

  const handleChangeTabs = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleCloseAddNewModelDialog = () => {
    setOpenAddNewModelDialog(false);
  };

  const handleCancelCurrentModelTrainingStatus = () => {
    const modelFineTuneId = currentRowData.modelTrainingInfo.fineTuneId;
    setLoadingCancelButton(true);
    server.call('ai.cancelCurrentModelTraining',
    modelFineTuneId).then(async res => {
      setLoadingCancelButton(false);
      await adminUpdateAiModel({
        newModelData: {
          ...currentRowData,
          status: 'Draft'
        }
      });
      Boardx.Util.Msg.success(
        t('chatAi.cancelModelTrainingSuccessfully')
      );
    }).catch(err => {
      Boardx.Util.Msg.warning(err.reason);
      
    });

  };

  const handleSearchModel = e => {
    const keyword = modelNameRef.current.value;
    setSearchKeyWord(keyword);
  };

  return (
    <StyledBox>
      <Box className={classes.tabPanelBoxContent}>
        <TextField
          fullWidth
          id="fullname"
          inputProps={{
            style: {
              height: '18px',
              width: '95%',
              color: 'rgba(0, 0, 0, 0.87)'
            }
          }}
          classes={{ root: classes.textFieldRoot }}
          inputRef={modelNameRef}
          label="Filter"
          variant="outlined"
          onKeyDown={handleSearchModel}
        />
        <DataGrid
          style={{ flex: 1 }}
          columns={columns}
          rows={modelData.filter(item =>
            item.name.toLowerCase().includes(searchKeyWord.toLowerCase())
          )}
          rowHeight={64}
          disableColumnMenu
          rowsPerPageOptions={[25, 50, 100]}
          pageSize={25}
          onRowClick={(params, event) => {
            setCurrentRowData(params.row);
          }}
          getRowId={row => row._id}
        />
        <Box className={classes.buttonBox}>
          <LoadingButton
            loading={loadingCancelButton}
            disabled={
              currentRowData && currentRowData.status === 'Submitted'
                ? false
                : true
            }
            variant="contained"
            className={classes.addNewModelButton}
            onClick={handleCancelCurrentModelTrainingStatus}
          >
            CANCEL
          </LoadingButton>
          <Button
            className={classes.addNewModelButton}
            sx={{ mr: '16px', ml: '16px' }}
            variant="contained"
            onClick={() => setOpenAddNewModelDialog(true)}
          >
            ADD NEW MODEL <ArrowForwardIcon sx={{ ml: '8px' }} />
          </Button>
        </Box>
        <AIModelAddNewModel
          openAddNewModelDialog={openAddNewModelDialog}
          handleCloseAddNewModelDialog={handleCloseAddNewModelDialog}
        />
      </Box>

      <Box className={classes.addNewModelBox}>
        <TabContext value={tabValue}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList
              onChange={handleChangeTabs}
              aria-label="lab API tabs example"
            >
              <Tab
                classes={{ root: classes.tabRoot }}
                label="Parameter"
                value="1"
              />
              <Tab
                classes={{ root: classes.tabRoot }}
                label="Dataset"
                value="2"
              />
            </TabList>
          </Box>
          <TabPanel classes={{ root: classes.tabPanelRoot }} value="1">
            <AIModelParameter
              setCurrentRowData={setCurrentRowData}
              currentRowData={currentRowData}
            />
          </TabPanel>
          <TabPanel classes={{ root: classes.tabPanelRoot }} value="2">
            <AIModelTrainedDataGrid
              setCurrentRowData={setCurrentRowData}
              currentRowData={currentRowData}
            />
          </TabPanel>
        </TabContext>
      </Box>
    </StyledBox>
  );
}
