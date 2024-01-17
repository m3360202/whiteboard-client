//** Import react
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { useEffect, useState } from 'react';

//** Import Redux kit
import { useDispatch, useSelector } from 'react-redux';
import store, { RootState } from '../../store';
import {
  useGetAllTeamsAiCommandQuery,
  useGetAllAiCommandQuery
} from '../../redux/AiAssistApiSlice';

//** Import i18n
import { useTranslation } from 'react-i18next';

//** Import Mui
import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import TextField from '@mui/material/TextField';

//** Import components
import AIAssistantContentDetails from './AIAssistantPromptTeamsDetails';
import AIAssistantContentPreview from './AIAssistantPromptTeamsPreview';
import AIAssistantContentAddNewPrompt from './AIAssistantPromptTeamsAddNewPrompt';
import AIAssistantPromptTeamsImportPrompt from './AIAssistantPromptTeamsImportPrompt';


const PREFIX = 'AIAssistantPromptTeamsAdminPage';

const classes = {
  tabPanelBoxContent: `${PREFIX}-tabPanelBoxContent`,
  addNewPromptButton: `${PREFIX}-addNewPromptButton`,
  buttonBox: `${PREFIX}-buttonBox`,
  newPromptBox: `${PREFIX}-newPromptBox`,
  tabRoot: `${PREFIX}-tabRoot`,
  tabPanelRoot: `${PREFIX}-tabPanelRoot`,
  textFieldRoot: `${PREFIX}-textFieldRoot`,
  dataGridFooterContainer: `${PREFIX}-dataGridFooterContainer`
};

const StyledBox = styled(Box)((
  { theme }
) => ({
  [`& .${classes.tabPanelBoxContent}`]: {
    width: '40%',
    borderRadius: '6px 0px 0px 6px',
    background: '#FFFFFF',
    display: 'flex',
    flexDirection: 'column'
  },

  [`& .${classes.addNewPromptButton}`]: {
    padding: '7px 22px',
    margin: '0px 16px 0px 16px',
    background: '#F21D6B !important',
    fontSize: '14px',
    lineHeight: '24px'
  },

  [`& .${classes.buttonBox}`]: {
    margin: '30px 0px 24px',
    display: 'flex',
    justifyContent: 'flex-end'
  },

  [`& .${classes.newPromptBox}`]: {
    flex: 1,
    borderRadius: '0px 6px 6px 0px',
    display: 'flex',
    flexDirection: 'column',
    background: '#FFFFFF',
    padding: '0px 18px 0px 18px',
    position: 'relative'
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
  },

  [`& .${classes.dataGridFooterContainer}`]: {
    '& .MuiSelect-iconStandard': {
      color: '#232930'
    }
  }
}));


const AIAssistantPromptTeamsAdminPage = () => {

  const { t } = useTranslation();
  const commandNameRef: any = React.useRef('');
  const [searchKeyWord, setSearchKeyWord] = React.useState('');
  const [currentRowData, setCurrentRowData] = React.useState(null);
  const [tabValue, setTabValue] = React.useState('1');
  const [openAddNewPromptDialog, setOpenAddNewPromptDialog] =
    React.useState(false);
  const [openImportPromptDialog, setOpenImportPromptDialog] =
    React.useState(false);
  const orgInfo = useSelector((state: RootState) => state.org.orgInfo);

  const {
    data: AICommandData = [],
    isLoading: useGetAllAiCommandQueryIsLoading,
    isError: useGetAllAiCommandQueryisLoadingIsError,
    isSuccess: useGetAllAiCommandQueryisLoadingIsSuccess
  } = useGetAllAiCommandQuery({});

  const {
    data: teamsCommandData = [],
    isLoading: useGetAllTeamsAiCommandQueryIsLoading,
    isError: useGetAllTeamsAiCommandQueryisLoadingIsError,
    isSuccess: useGetAllTeamsAiCommandQueryisLoadingIsSuccess
  } = useGetAllTeamsAiCommandQuery({ orgId: orgInfo.orgId });

  const allCommandDataInTheTeams = AICommandData.concat(teamsCommandData);

  const IconCellDOM = params => {
    return (
      <img
        style={{ width: '24px', height: '24px' }}
        src={
          Boolean(params.row.icon)
            ? params.row.icon
            : '/images/android-icon-36x36.png'
        }
        alt={params.row.name}
      />
    );
  };

  const BackgroundImgCellDOM = params => {
    return (
      <img
        style={{ width: '52px', height: '39px' }}
        src={
          Boolean(params.row.backgroundUrl)
            ? params.row.backgroundUrl
            : '/images/ImageCommandBackgroundImg.png'
        }
        alt={params.row.name}
      />
    );
  };

  const columns = [
    { field: 'name', headerName: t('promptManagement.name'), width: 180 },
    {
      field: 'type',
      headerName: t('promptManagement.generationType'),
      width: 100,
      type: 'string'
    },
    {
      field: 'section',
      headerName: t('promptManagement.category'),
      width: 100
    },
    {
      field: 'weight',
      headerName: t('promptManagement.weight'),
      width: 100,
      type: 'number'
    },
    {
      field: 'description',
      headerName: t('promptManagement.description'),
      width: 200
    },
    {
      field: 'command',
      headerName: t('promptManagement.command'),
      width: 200
    },
    {
      field: 'AIModel',
      headerName: t('promptManagement.AIModel'),
      type: 'number',
      width: 150
    },
    {
      field: 'temperature',
      headerName: t('promptManagement.temperature'),
      type: 'number',
      width: 150
    },
    {
      field: 'maximumLength',
      headerName: t('promptManagement.maximumLength'),
      type: 'number',
      width: 150
    },
    {
      field: 'topP',
      headerName: t('promptManagement.topP'),
      type: 'number',
      width: 100
    },
    {
      field: 'frequencyPenalty',
      headerName: t('promptManagement.frequencyPenalty'),
      type: 'number',

      width: 150
    },
    {
      field: 'presencePenalty',
      headerName: t('promptManagement.presencePenalty'),
      type: 'number',
      width: 150
    },
    {
      field: 'bestOf',
      headerName: t('promptManagement.bestOf'),
      type: 'number',
      width: 150
    },
    {
      field: 'usedTimes',
      headerName: t('promptManagement.usedTimes'),
      type: 'number',
      editable: false
    },
    {
      field: 'isFeatured',
      headerName: t('promptManagement.isFeatured'),
      type: 'boolean'
    },
    // { field: 'width', headerName: 'Width', type: 'number' },
    // { field: 'height', headerName: 'Height', type: 'number' },
    {
      field: 'icon',
      headerName: t('promptManagement.icon'),
      type: 'string',
      renderCell: params => IconCellDOM(params)
    },
    {
      field: 'backgroundImage',
      headerName: t('promptManagement.backgroundImage'),
      type: 'string',
      width: 200,
      renderCell: params => BackgroundImgCellDOM(params)
    }
  ];

  const handleRowClickSetCurrentRowData = params => {
    setCurrentRowData(params.row);
  };

  const handleChangeTabs = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleCloseAddNewPromptDialog = () => {
    setOpenAddNewPromptDialog(false);
  };

  const handleCloseImportPromptDialog = () => {
    setOpenImportPromptDialog(false);
  };

  const handleSearchCommand = e => {
    const keyword = commandNameRef.current.value;
    setSearchKeyWord(keyword);
  };

  const filterCommandByNameAndCategory = (command, searchKeyWord) => {
    if (
      command.name &&
      command.name.toLowerCase().includes(searchKeyWord.toLowerCase())
    ) {
      return true;
    } else if (command.section && command.section instanceof Array) {
      for (let i = 0; i < command.section.length; i++) {
        if (
          command.section[i].toLowerCase().includes(searchKeyWord.toLowerCase())
        ) {
          return true;
        }
      }
    } else if (
      command.section &&
      command.section.toLowerCase().includes(searchKeyWord.toLowerCase())
    ) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <StyledBox
      sx={{
        display: 'flex',
        justifyContent: 'flex-start',
        height: 'calc(100vh - 200px)'
      }}
    >
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
          inputRef={commandNameRef}
          label={t('promptManagement.search')}
          variant="outlined"
          onKeyDown={handleSearchCommand}
        />
        <DataGrid
          style={{ flex: 1 }}
          classes={{ footerContainer: classes.dataGridFooterContainer }}
          rows={allCommandDataInTheTeams.filter(item =>
            filterCommandByNameAndCategory(item, searchKeyWord)
          )}
          columns={columns}
          disableColumnMenu
          sortModel={[{ field: 'category', sort: 'desc' }]}
          rowsPerPageOptions={[25, 50, 100]}
          onRowClick={(params, event) =>
            handleRowClickSetCurrentRowData(params)
          }
          getRowId={row => row._id}
        />
        <Box className={classes.buttonBox}>
          <Button
            className={classes.addNewPromptButton}
            sx={{ m: '0 !important' }}
            variant="contained"
            onClick={() => setOpenImportPromptDialog(true)}
          >
            {t('promptManagement.importPrompt')}
          </Button>
          <Button
            className={classes.addNewPromptButton}
            sx={{ mr: '16px', ml: '16px' }}
            variant="contained"
            onClick={() => setOpenAddNewPromptDialog(true)}
          >
            {t('promptManagement.addNewPrompt')}
          </Button>
        </Box>
        <AIAssistantContentAddNewPrompt
          openAddNewPromptDialog={openAddNewPromptDialog}
          handleCloseAddNewPromptDialog={handleCloseAddNewPromptDialog}
        />
        <AIAssistantPromptTeamsImportPrompt
          openImportPromptDialog={openImportPromptDialog}
          handleCloseImportPromptDialog={handleCloseImportPromptDialog}
        />
      </Box>

      {currentRowData ? (
        <Box className={classes.newPromptBox}>
          <TabContext value={tabValue}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList
                onChange={handleChangeTabs}
                aria-label="lab API tabs example"
              >
                <Tab
                  classes={{ root: classes.tabRoot }}
                  label={t('promptManagement.details')}
                  value="1"
                />
                <Tab
                  classes={{ root: classes.tabRoot }}
                  label={t('promptManagement.preview')}
                  value="2"
                />
              </TabList>
            </Box>
            <TabPanel classes={{ root: classes.tabPanelRoot }} value="1">
              <AIAssistantContentDetails
                currentRowData={currentRowData}
                setCurrentRowData={setCurrentRowData}
              />
            </TabPanel>
            <TabPanel classes={{ root: classes.tabPanelRoot }} value="2">
              <AIAssistantContentPreview currentRowData={currentRowData} />
            </TabPanel>
          </TabContext>
        </Box>
      ) : (
        <Box
          className={classes.newPromptBox}
          sx={{ alignItems: 'center', justifyContent: 'center' }}
        >
          {t('promptManagement.pleaseSelectThePromptOnTheLeft')}
        </Box>
      )}
    </StyledBox>
  );
};

export default AIAssistantPromptTeamsAdminPage;
