//** Import react
import React, { useState, useEffect } from 'react';

import { styled } from '@mui/material/styles';

//** Import Redux kit
import { useRetagBoardByIdMutation } from '../../redux/RoomAPISlice';

import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import TextField from '@mui/material/TextField';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
import ListItemText from '@mui/material/ListItemText';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import BootstrapDialog, {
  BootstrapDialogTitle
} from '../../mui/components/BootstrapDialog';

const PREFIX = 'BoardSetCategory';

const classes = {
  autocompleteRoot: `${PREFIX}-autocompleteRoot`,
  autocompleteInputRoot: `${PREFIX}-autocompleteInputRoot`,
  autocompleteInput: `${PREFIX}-autocompleteInput`,
  autocompleteFocused: `${PREFIX}-autocompleteFocused`,
  addCategoryButton: `${PREFIX}-addCategoryButton`,
  autocompleteEndAdornment: `${PREFIX}-autocompleteEndAdornment`
};

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const StyledBootstrapDialog = styled(BootstrapDialog)(({ theme }) => ({
  [`& .${classes.autocompleteRoot}`]: {
    width: '100%'
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

export default function BoardSetCategory(props) {
  const { board } = props;

  const theme = useTheme();
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);
  const [selectedCategoryList, setSelectedCategoryList] = useState([]);
  const fullScreen = useMediaQuery(theme.breakpoints.up('xl'));

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

  // boardList
  const [retagBoardById, { isLoading, isError, isSuccess }] =
    useRetagBoardByIdMutation();

  const handleOpen = () => {
    props.handleClose();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (board.tags && board.tags !== '') {
      setSelectedCategoryList(
        typeof board.tags === 'string' ? [board.tags] : board.tags
      );
    } else {
      setSelectedCategoryList([]);
    }
  }, [board]);

  const handleClickSetCategory = async () => {
    setOpen(false);
    await retagBoardById({
      boardId: board._id,
      selectedCategoryList: selectedCategoryList
    });

    Boardx.Util.Msg.success(t('pages.listPage.addCategorySucceeded'));

    if (isError) {
      return Boardx.Util.Msg.warning(
        t('pages.listPage.addCategoryFailed')
      );
    }
  };

  return (
    <Box>
      <ListItemText
        aria-label="edit"
        onClick={handleOpen}
        primary={t('components.board.setCategory')}
      />

      <StyledBootstrapDialog
        PaperProps={{
          style: { width: 600, overflow: 'hidden', height: 'auto' }
        }}
        aria-labelledby="responsive-dialog-title"
        fullScreen={fullScreen}
        open={open}
      >
        <BootstrapDialogTitle
          id="responsive-dialog-title"
          onClose={handleClose}
          style={{
            height: 50,
            width: 251,
            left: 264,
            top: 108
          }}
        >
          {t('components.board.setCategory')}
        </BootstrapDialogTitle>
        <DialogContent
          style={{
            paddingLeft: 32,
            paddingRight: 32,
            paddingTop: 0,
            paddingBottom: 32,
            height: 172
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              mt: '16px',
              overflow: 'hidden'
            }}
          >
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
            <Button
              color="primary"
              onClick={handleClickSetCategory}
              size="small"
              className={classes.addCategoryButton}
              variant="contained"
            >
              {t('components.board.add')}
            </Button>
          </Box>
        </DialogContent>
      </StyledBootstrapDialog>
    </Box>
  );
}

BoardSetCategory.propTypes = {
  board: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired
};
