//** Import react
import React, { useState } from 'react';
import PropTypes from 'prop-types';

//** Import i18n
import { useTranslation } from 'react-i18next';

//** Import Redux toolkit
import { RootState } from '../../store';
import { useSelector, useDispatch } from 'react-redux';
import {
  handleSetCurrentBoardList,
  handleSetBoardList
} from '../../store/boardList';
import {useMoveBoardByIdMutation} from '../../redux/RoomAPISlice';
import { useGetRoomListByOrgIdQuery } from '../../redux/OrgAPISlice';

//** Import Mui
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import ListItemText from '@mui/material/ListItemText';

export default function BoardMoveModal(props) {
  const { board, handleClose, getUserIsRevisionBoard, isAll } = props;
  //use
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.up('xl'));
  const [roomId, setRoomId] = useState('');
  const orgId = useSelector((state: RootState) => state.org.orgInfo.orgId); 

  const [moveBoard, { isLoading, isError, isSuccess }] =
    useMoveBoardByIdMutation();

  //room
  let { data: roomList = [] } = useGetRoomListByOrgIdQuery(orgId);
  roomList = roomList.filter(obj => obj.rid !== board.roomId);
  const buttonDisabled = roomList.length > 0 ? false : true;

  const handleOpen = () => {
    handleClose();
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handleChange = e => {
    setRoomId(e.target.value);
  };

  const moveBoardById = async () => {
    await moveBoard({ boardId: board._id, roomId: roomId });
  };

  const handleMoveBoard = () => {
    handleCloseDialog();
    const isRevision = getUserIsRevisionBoard();
    if (isRevision) {
      return moveBoardById();
    }
    Boardx.Util.Msg.info(
      t('pages.autoPageUpdateInfo.moveBoardtoTargetRoomForbidden')
    );
  };

  return (
    <>
      <ListItemText
        aria-label="edit"
        onClick={() => handleOpen()}
        primary={t('components.board.move')}
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
          {t('pages.listPage.movetheBoard')}
        </DialogTitle>

        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <span>{t('pages.listPage.seleteRoomtoMove')}</span>
          </DialogContentText>
          <Select
            MenuProps={{
              PaperProps: { style: { overflow: 'auto' } }
            }}
            defaultValue
            id="demo-simple-select"
            labelId="demo-simple-select-label"
            onChange={handleChange}
            style={{ width: 300, overflow: 'auto' }}
            // value={roomId}
            variant="standard"
          >
            {(roomList || []).map(r => (
              <MenuItem key={r.rid?r.rid:r._id} value={r.rid}>
                {r.fname}
              </MenuItem>
            ))}
          </Select>
        </DialogContent>

        <DialogActions>
          <Button color="primary" onClick={handleCloseDialog} variant="text">
            {t('pages.cancel')}
          </Button>
          <Button
            color="primary"
            onClick={handleMoveBoard}
            variant="contained"
            disabled={buttonDisabled}
          >
            {t('pages.move')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

BoardMoveModal.propTypes = {
  board: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired,
  getUserIsRevisionBoard: PropTypes.func
};
