import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import TextField from '@mui/material/TextField';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import BootstrapDialog, {
  BootstrapDialogTitle,
} from '../../mui/components/BootstrapDialog';
import BoardService from '../../services/BoardService';
import {useUploadDescriptiontoBoardByIdMutation} from '../../redux/BoardAPISlice'
const PREFIX = 'BoardAddDescription';

const classes = {
  dialogContent: `${PREFIX}-dialogContent`,
  bootstrapDialogPaper: `${PREFIX}-bootstrapDialogPaper`,
  bootstrapDialogTitle: `${PREFIX}-bootstrapDialogTitle`,
  textField: `${PREFIX}-textField`,
  dialogActions: `${PREFIX}-dialogActions`
};

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const StyledDialog = styled(Dialog)(({ theme }) => ({
  [`& .${classes.dialogContent}`]: {
    paddingLeft: '32px',
    paddingRight: '32px',
    paddingTop: '16px !important'
  },

  [`& .${classes.bootstrapDialogPaper}`]: {
    width: '728px',
    overflow: 'hidden'
  },

  [`& .${classes.bootstrapDialogTitle}`]: {
    height: '50px',
    width: '251px',
    left: '264px',
    top: '108px'
  },

  [`& .${classes.textField}`]: {
    width: '532px',
    ' & input': {
      height: '160px'
    }
  },

  [`& .${classes.dialogActions}`]: {
    marginBottom: '16px',
    marginRight: '28px'
  }
}));

export default function BoardAddDescription(props) {
  const { board } = props;
  const { t } = useTranslation();
  const [description, setDescription] = useState(board.description);

  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const cancelText = t('components.board.cancel');
  const addText = t('components.board.add');
  const addDescriptionText = t('components.board.addDescription');
  const [uploadDes] = useUploadDescriptiontoBoardByIdMutation();
  const handleUploadDes =async(boardId, updatedDescription)=>{
    await uploadDes({
      boardId, updatedDescription
    })
  }
  React.useEffect(() => {
    if (board.description) {
      setDescription(board.description);
    } else {
      setDescription(' ');
    }
  }, [board]);

  const handleOpen = () => {
    props.handleClose();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSetDescption = () => {
    const updatedDescription = description;
    if (updatedDescription) {
      handleUploadDes(board._id,
        updatedDescription)
    } else {
      Boardx.Util.Msg.warning(t('pages.listPage.updateDescriptionFailed'));
    }
    setOpen(false);
  };

  return (
    <Box>
      <ListItemText
        onClick={handleOpen}
        primary={t('components.board.addDescription')}
      />

      <StyledDialog
        classes={{ paper: classes.bootstrapDialogPaper }}
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
      >
        <DialogTitle
          className={classes.bootstrapDialogTitle}
          // onClose={handleClose}
        >
          {addDescriptionText}
        </DialogTitle>
        <DialogContent className={classes.dialogContent}>
          <TextField
            className={classes.textField}
            id="outlined-multiline-static"
            label="Description"
            multiline
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            value={description}
          />
        </DialogContent>
        <DialogActions className={classes.dialogActions}>
          <Button color="primary" onClick={handleClose} variant="text">
            {cancelText}
          </Button>
          <Button
            color="primary"
            onClick={() => handleSetDescption()}
            size="small"
            variant="contained"
          >
            {addText}
          </Button>
        </DialogActions>
      </StyledDialog>
    </Box>
  );
}

BoardAddDescription.propTypes = {
  board: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired,
};
