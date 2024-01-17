import * as React from 'react';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Select from '@mui/material/Select';
import { InputLabel } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import { useTranslation } from 'react-i18next';
import { switchInteractionMode } from '../../canvas/initialize/initializeCanvasEvents';
import { BoardService } from '../../../services';
//** Import Redux toolkit
import store, { RootState } from '../../../store';
import { useSelector } from 'react-redux';
import { handleSetInteractionMode } from '../../../store/modal'
import {handleSetShowMoreMenu} from '../../../store/board'


store.dispatch(handleSetInteractionMode(localStorage.getItem('interactionMode') || 'trackpad'));

export default function ModalSettings({ setSelectMore }) {

  const [open, setOpen] = React.useState(false);
  const { t } = useTranslation();
  const  interaction  = useSelector((state: RootState) => state.modal.interactionMode);

  const handleClickOpen = () => {
    setSelectMore(false);
    setOpen(true);
    store.dispatch(handleSetShowMoreMenu(false));
  };

  const handleClose = () => {
    setOpen(false);
  };

  const changeAnonymousVisit = (e) => {
    const boardId = store.getState().board.board._id;
    const mode = e.target.checked;
    BoardService.getInstance().updateCurrentBoard({
      allowAnonymous: mode,
    });
  };

  const handleInteractionChange = (e) => {
    e.preventDefault();
    const mode = e.target.value;
    canvas.state.set('interactionMode', mode);
    store.dispatch(handleSetInteractionMode(mode));
    localStorage.setItem('interactionMode', mode);
    switchInteractionMode(mode);
  };

  return (
    <div>
      <MenuItem
        sx={{ gutters: {  paddingTop: '8px',
        paddingBottom: '8px'}}}
        onClick={handleClickOpen}
      >
        {t('board.header.moreSettings')}
      </MenuItem>
      <Dialog onClose={handleClose} open={open}>
        <DialogTitle id="alert-dialog-title">
          {t('board.header.moreSettings')}
        </DialogTitle>
        <DialogContent>
          <InputLabel id="demo-simple-select-label">
            {t('board.header.moreSettingsInteractionMode')}:{' '}
          </InputLabel>
          <Select
            sx={{    width: '80%'}}
            disabled
            id="demo-simple-select"
            onChange={handleInteractionChange}
            value={interaction}
            variant="standard"
          >
            {/* <MenuItem value="mouse">Mouse</MenuItem> */}
            <MenuItem value="trackpad">Trackpad</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button
            color="primary"
            onClick={handleClose}
            size="small"
            variant="contained"
          >
            {t('board.done')}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
