//** Import react
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { useEffect, useState } from 'react';

//** Import Redux kit
import store from '../../../store';
import { useSelector, useDispatch } from 'react-redux';
import { useGetAdminPageAllAiCommandQuery } from '../../../redux/AiAssistApiSlice';

import { handleSetCurrentAdminAiPromptData } from '../../../store/AIAssist';

//** Import i18n
import { useTranslation } from 'react-i18next';

//** Import Mui
import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

//** Import components
import AIAssistantContentAddNewPrompt from './AIAssistantContentAddNewPrompt';
import AIPrompt from './AIPrompt';

const PREFIX = 'AIAssistantContentAdminPage';

const classes = {
  tabPanelBoxContent: `${PREFIX}-tabPanelBoxContent`,
  addNewPromptButton: `${PREFIX}-addNewPromptButton`,
  buttonBox: `${PREFIX}-buttonBox`,
  newPromptBox: `${PREFIX}-newPromptBox`,
  newPromptTitleBox: `${PREFIX}-newPromptTitleBox`,
  titleText: `${PREFIX}-titleText`,
  symbolStyle: `${PREFIX}-symbolStyle`,
  tabRoot: `${PREFIX}-tabRoot`,
  tabPanelRoot: `${PREFIX}-tabPanelRoot`,
  textFieldRoot: `${PREFIX}-textFieldRoot`,
  selecIcon: `${PREFIX}-selecIcon`,
  select: `${PREFIX}-select`
};

const StyledBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-start',
  height: '100%',
  marginTop: '30px',

  [`& .${classes.tabPanelBoxContent}`]: {
    width: '100%',
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

  [`& .${classes.newPromptTitleBox}`]: {
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
    padding: '8px 10px',
    fontSize: '14px'
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

  [`& .${classes.selecIcon}`]: {
    color: '#150D33'
  },

  [`& .${classes.select}`]: {
    padding: '8px 17px',
    fontSize: '14px',
    borderRadius: '6px'
  }
}));

export default function AIAssistantContentAdminPage() {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [openAiPromptDialog, setOpenAiPromptDialog] = React.useState(false);

  /**
   * Create a reference ('ref') for storing a command name.
   */
  const commandNameRef: any = React.useRef('');

  /**
   * Create a state variable 'searchKeyWord' and its setter function using the 'React.useState' hook.
   * It is used to manage the search keyword and is initially set to an empty string.
   */
  const [searchKeyWord, setSearchKeyWord] = React.useState('');

  /**
   * Create a state variable 'openAddNewPromptDialog' and its setter function using the 'React.useState' hook.
   * It is used to manage the visibility of the "Add New Prompt" dialog and is initially set to 'false'.
   */
  const [openAddNewPromptDialog, setOpenAddNewPromptDialog] =
    React.useState(false);

  let { data: commandData = [] } = useGetAdminPageAllAiCommandQuery(undefined);

  const languageData = ['en', 'zh-CN'];

  const [languageSelect, setLanguageSelect] = React.useState('0');

  const [currentSelectLanguage, setCurrentSelectLanguage] =
    React.useState('en');

  /**
   * Functional component for rendering an icon cell in a table.
   *
   * @param {object} params - An object containing information about the row and cell.
   * @returns {JSX.Element} - Returns JSX element representing an icon.
   */
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

  /**
   * Functional component for rendering a background image cell in a table.
   *
   * @param {object} params - An object containing information about the row and cell.
   * @returns {JSX.Element} - Returns JSX element representing a background image.
   */
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
    {
      field: 'name',
      headerName: t('promptManagement.name'),
      width: 180
    },
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
    {
      field: 'isTeamsPrompt',
      headerName: t('promptManagement.isTeamsPrompt'),
      type: 'boolean'
    },
    {
      field: 'width',
      headerName: t('promptManagement.width'),
      type: 'number'
    },
    {
      field: 'height',
      headerName: t('promptManagement.height'),
      type: 'number'
    },
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

  /**
   * Handles setting the current row data when a row in the table is clicked.
   *
   * @param {object} params - An object containing information about the clicked row.
   */
  const handleRowClickSetCurrentRowData = params => {
    dispatch(handleSetCurrentAdminAiPromptData(params.row));
    setOpenAiPromptDialog(true);
  };

  /**
   * Closes the "Add New Prompt" dialog.
   */
  const handleCloseAddNewPromptDialog = () => {
    // Close the "Add New Prompt" dialog.
    setOpenAddNewPromptDialog(false);
  };

  /**
   * Handles the search for commands based on the entered keyword.
   *
   * @param {object} e - The event object.
   */
  const handleSearchCommand = e => {
    // Retrieve the keyword from the commandNameRef input element.
    const keyword = commandNameRef.current.value;

    // Set the search keyword for filtering commands.
    setSearchKeyWord(keyword);
  };

  /**
   * Filters a command based on the search keyword and current selected language.
   *
   * @param {object} command - The command to be filtered.
   * @param {string} searchKeyWord - The search keyword for filtering.
   * @param {string} currentSelectLanguage - The currently selected language.
   * @returns {boolean} - Returns 'true' if the command matches the filter criteria, 'false' otherwise.
   */
  const filterCommandByNameAndCategory = (
    command,
    searchKeyWord,
    currentSelectLanguage
  ) => {
    if (currentSelectLanguage && searchKeyWord === '') {
      // Filter by language when a language is selected and no keyword is provided.
      if (
        currentSelectLanguage === 'zh-CN' &&
        command.language &&
        command.language === currentSelectLanguage
      ) {
        return true;
      } else if (
        currentSelectLanguage === 'en' &&
        command.language !== 'zh-CN'
      ) {
        return true;
      }
    } else if (
      command.name &&
      command.name.toLowerCase().includes(searchKeyWord.toLowerCase()) &&
      command.language === currentSelectLanguage
    ) {
      // Filter by command name and language when a keyword is provided.
      return true;
    } else if (command.section && command.section instanceof Array) {
      // Filter by section when the command has multiple sections.
      for (let i = 0; i < command.section.length; i++) {
        if (
          command.section[i]
            .toLowerCase()
            .includes(searchKeyWord.toLowerCase()) &&
          command.language === currentSelectLanguage
        ) {
          return true;
        }
      }
    } else if (
      command.section &&
      command.section.toLowerCase().includes(searchKeyWord.toLowerCase()) &&
      command.language === currentSelectLanguage
    ) {
      // Filter by section when the command has a single section.
      return true;
    } else {
      // If no criteria match, return 'false'.
      return false;
    }
  };

  /**
   * Handles the change event of a select input.
   *
   * @param {object} event - The event object.
   */
  const handleChangeSelect = event => {
    // Set the language selection to the value selected in the dropdown.
    setLanguageSelect(event.target.value);

    // Set the current selected language based on the selected value.
    // Assuming 'languageData' is an array, it selects the language at the specified index.
    setCurrentSelectLanguage(languageData[Number(event.target.value)]);
  };

  return (
    <StyledBox>
      <Box className={classes.tabPanelBoxContent}>
        <Box sx={{ display: 'flex' }}>
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
          <Select
            sx={{ width: '100px' }}
            id="commandLanguageSelect"
            onChange={event => {
              handleChangeSelect(event);
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

        <DataGrid
          style={{ flex: 1 }}
          rows={commandData.filter(item =>
            filterCommandByNameAndCategory(
              item,
              searchKeyWord,
              currentSelectLanguage
            )
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
            sx={{ mr: '16px', ml: '16px' }}
            variant="contained"
            onClick={() => setOpenAddNewPromptDialog(true)}
          >
            {t('promptManagement.addNewPrompt')}
          </Button>
        </Box>
        <AIAssistantContentAddNewPrompt
          languageData={languageData}
          languageSelect={languageSelect}
          openAddNewPromptDialog={openAddNewPromptDialog}
          handleCloseAddNewPromptDialog={handleCloseAddNewPromptDialog}
          setOpenAiPromptDialog={setOpenAiPromptDialog}
        />
      </Box>

      <AIPrompt
        openAiPromptDialog={openAiPromptDialog}
        setOpenAiPromptDialog={setOpenAiPromptDialog}
      />
    </StyledBox>
  );
}
