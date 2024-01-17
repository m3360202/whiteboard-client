//** Import react
import React, { useState, useRef } from 'react';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';

//** Import i18n
import { useTranslation } from 'react-i18next';

//** Import Redux toolkit
import { RootState } from '../../store';
import { useSelector, useDispatch } from 'react-redux';
import { updateContextMenuStatus } from '../../store/contextMenu';
import { useCreateTemplateMutation } from '../../redux/TemplateApiSlice';

//** Import Mui
import { useTheme } from '@mui/material/styles';
import Popover from '@mui/material/Popover';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Switch from '@mui/material/Switch';
import Button from '@mui/material/Button';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';

const PREFIX = 'BoardCreateTemplate';

const classes = {
  templateHeader: `${PREFIX}-templateHeader`,
  templateName: `${PREFIX}-templateName`,
  templateClose: `${PREFIX}-templateClose`,
  templateNameHeader: `${PREFIX}-templateNameHeader`,
  templateNameTitle: `${PREFIX}-templateNameTitle`,
  templateShare: `${PREFIX}-templateShare`,
  templateShareHeader: `${PREFIX}-templateShareHeader`,
  templateCreate: `${PREFIX}-templateCreate`,
  endAdornment: `${PREFIX}-endAdornment`,
  autocompleteRoot: `${PREFIX}-autocompleteRoot`,
  autocompleteInputRoot: `${PREFIX}-autocompleteInputRoot`,
  autocompleteInput: `${PREFIX}-autocompleteInput`,
  autocompleteFocused: `${PREFIX}-autocompleteFocused`,
  addCategoryButton: `${PREFIX}-addCategoryButton`,
  autocompleteEndAdornment: `${PREFIX}-autocompleteEndAdornment`
};

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const StyledPopover = styled(Popover)(({ theme }) => ({
  [`& .${classes.templateHeader}`]: {
    display: 'flex',
    alignItems: 'center',
    padding: '32px 32px 0 32px',
    justifyContent: 'space-between',
    width: '480px'
  },

  [`& .${classes.templateName}`]: {
    color: '#232930',
    fontSize: '28px'
  },

  [`& .${classes.templateClose}`]: {
    //paddingLeft: '460px'
  },

  [`& .${classes.templateNameHeader}`]: {
    width: '100%',
    textAlign: 'left',
    padding: '24px 32px 0 32px'
  },

  [`& .${classes.templateNameTitle}`]: {
    color: '#232930',
    fontSize: '16px',
    width: '360px',
    marginBottom: '24px'
  },

  [`& .${classes.templateShare}`]: {
    color: '#232930',
    fontSize: '16px'
  },

  [`& .${classes.templateShareHeader}`]: {
    display: 'flex',
    alignItems: 'center',
    padding: '32px 32px 0 32px'
  },

  [`& .${classes.templateCreate}`]: {
    textAlign: 'right',
    padding: '32px 32px 32px 0px'
  },

  [`& .${classes.endAdornment}`]: {
    top: 0
  },

  [`& .${classes.autocompleteRoot}`]: {
    width: '450px'
  },

  [`& .${classes.autocompleteInputRoot}`]: {
    minHeight: '45px',
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

  [`& .${classes.addCategoryButton}`]: {
    marginTop: '35px'
  },

  [`& .${classes.autocompleteEndAdornment}`]: {
    top: 'unset !important'
  }
}));

const boardCategoryList = [
  'AI',
  'Featured',
  'Basics',
  'Workshop & Meeting',
  'Project Management',
  'Design Thinking',
  'Strategy & Planning',
  'Lean Manufacturing',
  'Storytelling',
  'Education',
  'Games'
];

export default function BoardCreateTemplate(props) {

  const { board, handleClose } = props;

  const { t } = useTranslation();
  //use
  const dispatch = useDispatch();
  const orgId = useSelector((state) => state.org.orgInfo.orgId); //org
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [saveTemplatePop, setSaveTemplatePop] = useState(false);
  const [templateName, setTemplateName] = useState(null);
  const [description, setDescription] = useState(null);
  const [shareToTeam, setShareToTeam] = useState(true);
  const [selectedCategoryList, setSelectedCategoryList] = useState([]);

  const [open, setOpen] = useState(false);
  const theme = useTheme();

  const [createTemplate] = useCreateTemplateMutation();

  const handleOpen = () => {
    handleClose();
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handleCloseTemplatePop = () => {
    setSaveTemplatePop(false);
    setDescription(null);
    setTemplateName(null);
    setSelectedCategoryList([]);
    setShareToTeam(false);
  };
  const handleShareToTeam = (event) => {
    setShareToTeam(event.target.checked);
  };

  const handleOpenSaveTemplate = event => {
    setAnchorEl(event.currentTarget);
    setSaveTemplatePop(true);
    dispatch(updateContextMenuStatus(false));
  };

  const handleSaveTemplate = async () => {
    let onlyMe = shareToTeam ? false : true;
    //选择整个board内容作为template
    const data = {
      boardId: board._id,
      boardName: templateName,
      onlyMe: onlyMe,
      orgId: orgId,
      description: description,
      tags: selectedCategoryList
    };

    await createTemplate({ data: data, type: 'allBoard' });
    handleCloseTemplatePop();
    Boardx.Util.Msg.info(t('board.contextMenu.createdTemplate'));
  };

  return (
    <>
      <ListItemText
        aria-label="edit"
        onClick={handleOpenSaveTemplate}
        primary={t('board.contextMenu.saveAsTemplate')}
      />

      <StyledPopover
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
        id="templatePop"
        onClose={handleCloseTemplatePop}
        open={saveTemplatePop}
      >
        <Box className={classes.templateHeader}>
          <Typography className={classes.templateName}>
            {t('board.contextMenu.saveAsTemplate')}
          </Typography>
          <svg
            onClick={handleCloseTemplatePop}
            className={classes.templateClose}
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13.3 0.709971C12.91 0.319971 12.28 0.319971 11.89 0.709971L7 5.58997L2.11 0.699971C1.72 0.309971 1.09 0.309971 0.700001 0.699971C0.310001 1.08997 0.310001 1.71997 0.700001 2.10997L5.59 6.99997L0.700001 11.89C0.310001 12.28 0.310001 12.91 0.700001 13.3C1.09 13.69 1.72 13.69 2.11 13.3L7 8.40997L11.89 13.3C12.28 13.69 12.91 13.69 13.3 13.3C13.69 12.91 13.69 12.28 13.3 11.89L8.41 6.99997L13.3 2.10997C13.68 1.72997 13.68 1.08997 13.3 0.709971Z"
              fill="#232930"
            />
          </svg>
        </Box>
        <Box className={classes.templateNameHeader}>
          <Typography className={classes.templateNameTitle}>
            {t('board.contextMenu.saveAsTemplate')}
          </Typography>
          <TextField
            id="templateNameInput"
            style={{
              height: '40px',
              fontSize: '12px',
              width: '320px'
            }}
            type="text"
            onChange={e => setTemplateName(e.target.value)}
          />
        </Box>
        <Box
          className={classes.templateNameHeader}
          style={{ marginTop: '24px' }}
        >
          <Typography className={classes.templateNameTitle}>
            {t('board.contextMenu.templateDescription')}
          </Typography>
          <TextField
            id="templateDesInput"
            style={{
              fontSize: '12px',
              width: '320px'
            }}
            multiline
            rows={4}
            type="text"
            onChange={e => setDescription(e.target.value)}
          />
        </Box>
        <Box
          className={classes.templateNameHeader}
          style={{ marginTop: '24px' }}
        >
          <Typography className={classes.templateNameTitle}>
            {t('components.board.setCategory')}
          </Typography>
          <Autocomplete
            id="tags-outlined"
            multiple
            options={boardCategoryList.map(option => option)}
            getOptionLabel={option => option}
            filterSelectedOptions
            onChange={(event, value) => {
              setSelectedCategoryList(value);
            }}
            value={selectedCategoryList}
            classes={{
              root: classes.autocompleteRoot,
              inputRoot: classes.autocompleteInputRoot,
              input: classes.autocompleteInput,
              focused: classes.autocompleteFocused,
              endAdornment: classes.autocompleteEndAdornment
            }}
            renderInput={params => (
              <TextField
                onBlur={event => {
                  if (event.target.value.trim() !== '') {
                    setSelectedCategoryList([
                      ...selectedCategoryList,
                      event.target.value
                    ]);
                  }
                }}
                {...params}
                placeholder="Category"
              />
            )}
          />
        </Box>
        <Box
          className={classes.templateShareHeader}
          style={{ marginTop: '24px' }}
        >
          <Switch checked={shareToTeam} onChange={handleShareToTeam} />
          <Typography className={classes.templateShare}>
            {t('board.contextMenu.shareTemplate')}
          </Typography>
        </Box>
        <Box className={classes.templateCreate} style={{ marginTop: '24px' }}>
          <Button
            onClick={handleSaveTemplate}
            sx={{ fontSize: '12px' }}
            variant="contained"
            size="small"
          >
            {t('board.contextMenu.createTemplate')}
          </Button>
        </Box>
      </StyledPopover>
    </>
  );
}

BoardCreateTemplate.propTypes = {
  board: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired,
  getUserIsRevisionBoard: PropTypes.func
};
