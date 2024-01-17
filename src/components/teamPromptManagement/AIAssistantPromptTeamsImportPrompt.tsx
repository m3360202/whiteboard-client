//** Import react
import React, { useEffect, useState } from 'react';

import { styled } from '@mui/material/styles';

//** Import Redux kit
import store, { RootState } from '../../store';
import { useSelector, useDispatch } from 'react-redux';
import {
  useTeamsAddManyAiCommandMutation,
  useGetAllAiCommandQuery,
  useGetAllTeamsAiCommandQuery
} from '../../redux/AiAssistApiSlice';

import { DataGrid, GridApi } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { UtilityService } from '../../services';

//** Import i18n
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';

const PREFIX = 'AIAssistantPromptTeamsImportPrompt';

const classes = {
  dialogPaper: `${PREFIX}-dialogPaper`,
  dialogActions: `${PREFIX}-dialogActions`,
  dataGridFooterContainer: `${PREFIX}-dataGridFooterContainer`,
  importBtn: `${PREFIX}-importBtn`,
  textFieldRoot: `${PREFIX}-textFieldRoot`
};

const StyledDialog = styled(Dialog)(({ theme }) => ({
  [`& .${classes.dialogPaper}`]: {
    maxWidth: '900px'
  },

  [`& .${classes.dialogActions}`]: {
    display: 'flex',
    justifyContent: 'flex-end',
    paddingLeft: '24px',
    paddingBottom: '20px',
    paddingRight: '24px'
  },

  [`& .${classes.dataGridFooterContainer}`]: {
    '& .MuiSelect-iconStandard': {
      color: '#232930'
    }
  },

  [`& .${classes.importBtn}`]: {
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

  [`& .${classes.textFieldRoot}`]: {
    '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#F21D6B'
    },
    '& .Mui-focused': {
      color: '#F21D6B'
    }
  }
}));

const AIAssistantPromptTeamsImportPrompt = ({
  openImportPromptDialog,
  handleCloseImportPromptDialog
}) => {

  const { t } = useTranslation();
  const searchValueRef: any = React.useRef('');
  const [searchKeyWord, setSearchKeyWord] = React.useState('');
  const [currentSelectCommand, setCurrentSelectCommand] = useState([]);
  const [commandDataInTheDataTable, setCommandDataInTheDataTable] = useState(
    []
  );
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

   const allCommandData = useSelector(
     (state: RootState) => state.AIAssist.allCommandData
   );

  const [teamsAddManyAiCommand] = useTeamsAddManyAiCommandMutation();

  useEffect(() => {
    handleRemoveCommandsThatAreAlreadyInTeam();
  }, [AICommandData, teamsCommandData, allCommandData]);

  // 去除已经在teams中的command
  const handleRemoveCommandsThatAreAlreadyInTeam = () => {
    const allCommandDataInTheTeams = new Set([
      ...AICommandData.map(item => item._id),
      ...teamsCommandData.map(item => item._id)
    ]);
    let newCommandData = allCommandData.filter(
      command => !allCommandDataInTheTeams.has(command._id)
    );
    const currentLanguage = i18n.language;
    if (currentLanguage.indexOf('en') > -1) {
      newCommandData = newCommandData.filter(
        item => !item.language || item.language !== 'zh-CN'
      );
    } else {
      newCommandData = newCommandData.filter(
        item => item.language && item.language === 'zh-CN'
      );
    }
    setCommandDataInTheDataTable(newCommandData);
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

  const handleSearchCommand = e => {
    const keyword = searchValueRef.current.value;
    setSearchKeyWord(keyword);
  };

  const handleClickImportCommand = async () => {
    handleCloseImportPromptDialog();
    const newCommandData = commandDataInTheDataTable
      .filter(command => currentSelectCommand.includes(command._id))
      .map(command => ({
        ...command,
        orgId: orgInfo.orgId,
        _id: UtilityService.getInstance().generateWidgetID()
      }));

    await teamsAddManyAiCommand({ commandData: newCommandData });
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
      field: 'typeOfUse',
      headerName: t('promptManagement.typeOfUse'),
      width: 100,
      type: 'string'
    },
    {
      field: 'section',
      headerName: t('promptManagement.category'),
      width: 100
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
    }
  ];

  return (
    <StyledDialog
      open={openImportPromptDialog}
      onClose={handleCloseImportPromptDialog}
      classes={{ paper: classes.dialogPaper }}
    >
      <DialogContent >
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
          inputRef={searchValueRef}
          label={t('promptManagement.search')}
          variant="outlined"
          onKeyDown={handleSearchCommand}
        />
        <DataGrid
          style={{ flex: 1, minHeight: '600px' }}
          classes={{ footerContainer: classes.dataGridFooterContainer }}
          rows={commandDataInTheDataTable.filter(item =>
            filterCommandByNameAndCategory(item, searchKeyWord)
          )}
          columns={columns}
          disableColumnMenu
          sortModel={[{ field: 'category', sort: 'desc' }]}
          rowsPerPageOptions={[25, 50, 100]}
          checkboxSelection
          onSelectionModelChange={(rowSelectionModel, details) => {
            setCurrentSelectCommand(rowSelectionModel);
          }}
          getRowId={row => row._id}
        />
      </DialogContent>

      {/* Import button */}
      <DialogActions className={classes.dialogActions}>
        <Button
          className={classes.importBtn}
          variant="contained"
          onClick={handleClickImportCommand}
        >
          {t('promptManagement.import')}
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};

export default AIAssistantPromptTeamsImportPrompt;
