//** Import react
import * as React from 'react';
import { styled } from '@mui/material/styles';

//** Import Redux kit
import { useGetAiAllCustomStyleCommandQuery } from '../../../redux/AiAssistApiSlice';
import { useSelector, useDispatch } from 'react-redux';
import { handleSetCurrentAdminAiImagePromptData } from '../../../store/AIAssist';

import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import AIAssistantImagesAddNewPrompt from './AIAssistantImagesAddNewPrompt';
import AIImagePrompt from './AIImagePrompt';

const PREFIX = 'AIAssistantImagesAdminPage';

const classes = {
  tabPanelBoxContent: `${PREFIX}-tabPanelBoxContent`,
  deleteButton: `${PREFIX}-deleteButton`,
  addNewPromptButton: `${PREFIX}-addNewPromptButton`,
  buttonBox: `${PREFIX}-buttonBox`,
  newPromptBox: `${PREFIX}-newPromptBox`,
  newPromptTitleBox: `${PREFIX}-newPromptTitleBox`,
  titleText: `${PREFIX}-titleText`,
  symbolStyle: `${PREFIX}-symbolStyle`,
  tabRoot: `${PREFIX}-tabRoot`,
  tabPanelRoot: `${PREFIX}-tabPanelRoot`,
  textFieldRoot: `${PREFIX}-textFieldRoot`
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

  [`& .${classes.deleteButton}`]: {
    padding: '7px 22px',
    fontSize: '14px',
    lineHeight: '24px',
    border: '1px solid #8A8D93',
    color: '#8A8D93'
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

export default function AIAssistantImagesAdminPage() {
  const dispatch = useDispatch();
  const commandNameRef: any = React.useRef('');
  const [searchKeyWord, setSearchKeyWord] = React.useState('');
  const [openAddNewPromptDialog, setOpenAddNewPromptDialog] =
    React.useState(false);

  const [openAiImagePromptDialog, setOpenAiImagePromptDialog] =
    React.useState(false);

  let { data: customStylecommandData = [] } =
    useGetAiAllCustomStyleCommandQuery(undefined);

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
    { field: 'category', headerName: 'Category', width: 100 },
    { field: 'name', headerName: 'Name', width: 100 },
    {
      field: 'type',
      headerName: 'Type',
      width: 100,
      type: 'string'
    },
    {
      field: 'weight',
      headerName: 'Weight',
      width: 100,
      type: 'number'
    },
    {
      field: 'description',
      headerName: 'Description',
      width: 100
    },
    { field: 'command', headerName: 'Command', width: 100 },
    {
      field: 'usedTimes',
      headerName: 'Used Times',
      type: 'number',
      editable: false
    },
    {
      field: 'isFeatured',
      headerName: 'Featured',
      type: 'boolean'
    },
    { field: 'width', headerName: 'Width', type: 'number' },
    { field: 'height', headerName: 'Height', type: 'number' },
    {
      field: 'icon',
      headerName: 'Icon',
      type: 'string',
      renderCell: params => IconCellDOM(params)
    },
    {
      field: 'backgroundImage',
      headerName: 'Background Image',
      type: 'string',
      width: 200,
      renderCell: params => BackgroundImgCellDOM(params)
    }
  ];

  const handleCloseAddNewPromptDialog = () => {
    setOpenAddNewPromptDialog(false);
  };

  const handleSearchCommand = e => {
    const keyword = commandNameRef.current.value;
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
          inputRef={commandNameRef}
          label="Filter"
          variant="outlined"
          onKeyDown={handleSearchCommand}
        />
        <DataGrid
          style={{ flex: 1 }}
          columns={columns}
          disableColumnMenu
          rows={customStylecommandData.filter(item =>
            item.name.toLowerCase().includes(searchKeyWord.toLowerCase())
          )}
          sortModel={[{ field: 'category', sort: 'desc' }]}
          onRowClick={(params, event) => {
            dispatch(handleSetCurrentAdminAiImagePromptData(params.row));
            setOpenAiImagePromptDialog(true);
          }}
        />
        <Box className={classes.buttonBox}>
          <Button
            className={classes.addNewPromptButton}
            sx={{ mr: '16px', ml: '16px' }}
            variant="contained"
            onClick={() => setOpenAddNewPromptDialog(true)}
          >
            ADD NEW PROMPT
          </Button>
        </Box>
        <AIAssistantImagesAddNewPrompt
          openAddNewPromptDialog={openAddNewPromptDialog}
          handleCloseAddNewPromptDialog={handleCloseAddNewPromptDialog}
          setOpenAiImagePromptDialog={setOpenAiImagePromptDialog}
        />
      </Box>

      <AIImagePrompt
        openAiImagePromptDialog={openAiImagePromptDialog}
        setOpenAiImagePromptDialog={setOpenAiImagePromptDialog}
      />
    </StyledBox>
  );
}
