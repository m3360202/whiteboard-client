//** Import react
import React from 'react';
import PropTypes from 'prop-types';

//** Import i18n
import { useTranslation } from 'react-i18next';

//** Import Redux kit
import store, { RootState } from '../../store';
import { useSelector, useDispatch } from 'react-redux';
import { useDeleteBoardByIdMutation } from '../../redux/BoardAPISlice';

//** Import Mui
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

export default function BoardDeleteModal(props) {
  //props && boardInfo
  const { board, getUserIsRevisionBoard, handleClose } = props;

  //use
  const dispatch = useDispatch();
  const theme = useTheme();
  const { t } = useTranslation();

  //dom
  const fullScreen = useMediaQuery(theme.breakpoints.up('xl'));
  const [open, setOpen] = React.useState(false);

  const [deleteBoardByIdMutation] = useDeleteBoardByIdMutation();

  //Dom funcitons 
  const handleOpen = () => {
    handleClose();
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const getBoardList = (boardId, boardList) => {
    let newList = [];
    boardList.map((obj) => {
      if (obj._id !== boardId) {
        newList.push(obj);
      }
    });
    return newList;
  }

  const deleteBoardById = async () => {
    const deletedInfo = {
      deletedAt: Date.now(),
      deletedByUserId: store.getState().user.userInfo.userId,
    };

    await deleteBoardByIdMutation({
      boardId: board._id,
      deletedInfo: { deletedAt: Date.now(), deletedByUserId: store.getState().user.userInfo.userId }
    });
  }

  const handleDeleteBoard = () => {
    handleCloseDialog();
    const isRevision = getUserIsRevisionBoard();
    if (isRevision) {
      return deleteBoardById();
    }
    Boardx.Util.Msg.warning(t('pages.listPage.deleteFailed'));
  };

  return (
    <>
      <ListItemText
        aria-label="edit"
        onClick={handleOpen}
        primary={t('components.board.delete')}
      />
      <Dialog
        PaperProps={{ style: { width: 350, height: 200 } }}
        aria-labelledby="responsive-dialog-title"
        fullScreen={fullScreen}
        fullWidth
        onClose={handleCloseDialog}
        open={open}
      >
        <DialogTitle id="responsive-dialog-title">
          {t('pages.listPage.deletetheBoard')}
        </DialogTitle>

        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {`${t('pages.listPage.deleteConfirm')}: ${
              board.name
              } ${t('pages.listPage.deleteBoard')}?`}
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button
            color="primary"
            onClick={handleCloseDialog}
            size="small"
            variant="text"
          >
            {t('pages.cancel')}
          </Button>

          <Button
            color="primary"
            onClick={handleDeleteBoard}
            size="small"
            type="button"
            variant="contained"
          >
            {t('pages.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

BoardDeleteModal.propTypes = {
  board: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired,
  getUserIsRevisionBoard: PropTypes.func,
};
