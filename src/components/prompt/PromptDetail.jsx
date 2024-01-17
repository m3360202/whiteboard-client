//**Import React */
import React, { useState, useEffect } from 'react';

import { styled } from '@mui/material/styles';

//**Import i18n */
import { useTranslation } from 'react-i18next';

//** Import Redux kit
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import store, { RootState } from '../../store';
import { handleSetOpenResources } from '../../store/sideBar';
import {
  handleSetBoardList,
  handleSetCurrentBoardList
} from '../../store/boardList';
import { changeMode } from '../../store/mode';
import { handleSetPromptDetail } from '../../store/resource';

import {
  Typography,
  Box,
  Chip,
  Card,
  CardMedia,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Autocomplete,
  Stack,
  Grid
} from '@mui/material';

const PREFIX = 'PromptDetail';

const classes = {
  promptPopUp: `${PREFIX}-promptPopUp`,
  promptInfoBox: `${PREFIX}-promptInfoBox`,
  promptName: `${PREFIX}-promptName`,
  promptDescription: `${PREFIX}-promptDescription`,
  promptImage: `${PREFIX}-promptImage`,
  promptExample: `${PREFIX}-promptExample`,
  promptDetailBackground: `${PREFIX}-promptDetailBackground`
};

const StyledDialog = styled(Dialog)((
  {
    theme
  }
) => ({
  [`& .${classes.promptPopUp}`]: {
    width: 'auto',
    height: '700px',
    display: 'flex',
    flexDirection: 'row',
    padding: '2rem'
  },

  [`& .${classes.promptInfoBox}`]: {
    width: 'auto',
    height: '700px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },

  [`& .${classes.promptName}`]: {},
  [`& .${classes.promptDescription}`]: {},

  [`& .${classes.promptImage}`]: {
    width: '600px',
    height: '300px',
    margin: '24px'
  },

  [`& .${classes.promptExample}`]: {
    width: 'auto',
    height: 'auto'
  },

  [`& .${classes.promptDetailBackground}`]: {
    width: '90%',
    maxWidth: '1164px',
    height: '700px',
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    margin: 'auto',
    alignItems: 'center',
    boxShadow: '0px 1px 3px 2px #00000014',
    borderRadius: '8px'
  }
}));

export function PromptDetail(props) {
  // Init useHooks

  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const id = open ? 'prompt-popover' : undefined;
  const promptDetail = useSelector(
    (state) => state.resource.promptDetail
  );
  const currentPrompt = useSelector(
    (state) => state.resource.currentPrompt
  );
  const openPrompt = useSelector(
    (state) => state.resource.openPrompt
  );

  const handleClose = () => {
    store.dispatch(handleSetPromptDetail(false));
    dispatch(changeMode('default'));
    setOpen(false);
  };

  let displayImage = '/images/ImageCommandBackgroundImg.png';
  if (currentPrompt)
    displayImage = currentPrompt.backgroundUrl
      ? currentPrompt.backgroundUrl
      : '/images/ImageCommandBackgroundImg.png';

  useEffect(() => {
    if (openPrompt) {
      setOpen(true);
    }
  }, [openPrompt]);
  // Prompt detail popup
  return promptDetail ? (
    <StyledDialog
      id={id}
      open={promptDetail}
      fullScreen
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      classes={{ root: classes.promptDetailBackground }}
    >
      <Grid container spacing={2} padding="2rem">
        <Grid item xs={6}>
          <Stack spacing={2} marginBottom={'24px'}>
            <Box
              component="img"
              src={displayImage}
              classes={classes.promptImage}
            ></Box>
            <Typography variant="h1" classes={classes.promptName}>
              {currentPrompt.name}
            </Typography>
            <Typography variant="body1" classes={classes.promptDescription}>
              {currentPrompt.description}
            </Typography>
          </Stack>
          <Chip label={currentPrompt.section} color="primary" />
        </Grid>
        <Grid item xs={6}>
          <Box classes={classes.promptExample} bgcolor={'info.main'}>
            Example usage
          </Box>
        </Grid>
      </Grid>
    </StyledDialog>
  ) : null;
}
