//** Import react
import React, { useState } from 'react';
import PropTypes from 'prop-types';

//** Import Redux kit
import { RootState } from '../../store';
import { useSelector, useDispatch } from 'react-redux';
import { handleSetCurrentBoardList, handleSetBoardList } from '../../store/boardList';
import { useRenameBoardByIdMutation } from '../../redux/BoardAPISlice';
//** Import i18n
import { useTranslation } from 'react-i18next';

//** Import Mui
import TextField from '@mui/material/TextField';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import ListItemText from '@mui/material/ListItemText';

//** Import Services
import { BoardService } from '../../services';
import $ from 'jquery';

export default function BoardRenameModal(props) {
  const { board, getUserIsRevisionBoard } = props;
  //use
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.up('xl'));
const [renameBoardById] = useRenameBoardByIdMutation();
  //boardList
  const boardList = useSelector((state: RootState) => state.boardList.currentBoardList);

  const handleOpen = () => {
    props.handleClose();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleRenameBoardById = async() => {
    const newName = $('#newBoardName').val();
    const boardId = board._id;
    await renameBoardById({boardId,newName});
    Boardx.Util.Msg.info(t('pages.listPage.renamed'));
          let newBoardList = [];
          boardList.forEach((item) => {
            if (item._id === board._id) {
              item = { ...item, 'name': newName }
            }
            newBoardList.push(item);
          });
          dispatch(handleSetCurrentBoardList(newBoardList));
          dispatch(handleSetBoardList(newBoardList));
  }

  const handleRenameBoard = () => {
    handleClose();
    const isRevision = getUserIsRevisionBoard();
    if (isRevision) {
      return handleRenameBoardById();
    }

    Boardx.Util.Msg.warning(t('pages.listPage.renameFailed'));
  };

  return (
    <>
      <ListItemText
        aria-label="edit"
        onClick={handleOpen}
        primary={t('components.board.rename')}
      />
      <Dialog
        PaperProps={{ style: { width: 350, height: 200 } }}
        aria-labelledby="responsive-dialog-title"
        fullScreen={fullScreen}
        fullWidth
        onClose={handleClose}
        open={open}
      >
        <DialogTitle id="responsive-dialog-title">
          {t('pages.listPage.renametheBoard')}
        </DialogTitle>

        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <span>{t('pages.listPage.newBoardName')}</span>
          </DialogContentText>
          <TextField
            defaultValue={board.name}
            id="newBoardName"
            inputProps={{ style: { padding: 5, width: 300 } }}
            style={{ display: 'block', height: '35px', width: '100%' }}
            variant="standard"
          />
        </DialogContent>

        <DialogActions>
          <Button color="primary" onClick={handleClose} variant="text">
            {t('pages.cancel')}
          </Button>
          <Button
            color="primary"
            onClick={handleRenameBoard}
            variant="contained"
          >
            {t('pages.confirm')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

BoardRenameModal.propTypes = {
  board: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired,
  getUserIsRevisionBoard: PropTypes.func,
};
