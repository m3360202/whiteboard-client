/* eslint-disable no-undef */
import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import store from '../store';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import useMediaQuery from '@mui/material/useMediaQuery';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Button from '@mui/material/Button';
import BootstrapDialog, {
  BootstrapDialogTitle,
} from '../mui/components/BootstrapDialog';
import ClipboardService from '../services/ClipboardService';

const PREFIX = 'InviteModal';

const classes = {
  paper: `${PREFIX}-paper`,
  bootstrapDialogBox: `${PREFIX}-bootstrapDialogBox`,
  paperScrollPaper: `${PREFIX}-paperScrollPaper`,
  inviteLink: `${PREFIX}-inviteLink`,
  orgDialogTitle: `${PREFIX}-orgDialogTitle`,
  btnCopyInviteLink: `${PREFIX}-btnCopyInviteLink`,
  orgDialogContent: `${PREFIX}-orgDialogContent`
};

const Root = styled('div')((
  {
    theme
  }
) => ({
  [`& .${classes.paper}`]: {
    position: 'absolute',
    maxWidth: 400,
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '0px solid #000',
    outline: 'none',
    padding: theme.spacing(2, 4, 3),
  },

  [`&.${classes.bootstrapDialogBox}`]: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  [`& .${classes.paperScrollPaper}`]: {
    width: '734px',
    height: 'auto',
    maxWidth: 'unset',
    padding: '32px',
    boxSizing: 'border-box',
  },

  [`& .${classes.inviteLink}`]: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
  },

  [`& .${classes.orgDialogTitle}`]: {
    padding: 0,
    fontSize: '28px',
    color: '#000000',
    lineHeight: '34px',
    marginBottom: '24px',
  },

  [`& .${classes.btnCopyInviteLink}`]: {
    width: 120,
  },

  [`& .${classes.orgDialogContent}`]: {
    padding: '0px 17px 0px 0px',
  }
}));

export default function InviteModal() {

  const { t } = useTranslation();
  const [openRegister, setOpenRegister] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.up('xl'));
  const getInviteLink = () => {
    return `http://${location.host}/join?invite=${store.getState().user.userInfo.userId}`;
  };

  const handleRegisterOpen = () => {
    setOpenRegister(true);
  };

  const handleRegisterClose = () => {
    setOpenRegister(false);
  };
  const handleCopy = () => {
    ClipboardService.getInstance().clipboardCopy(getInviteLink());
    Boardx.Util.Msg.info(
      t('components.connectionNotification.youHaveCopiedShareLink'),
    );
  };


  return (
    <Root className={classes.bootstrapDialogBox}>
      <Button
        color="primary"
        id="id_Register"
        onClick={handleRegisterOpen}
        sx={{ mr: (theme) => theme.spacing(2) }}
        type="button"
        variant="contained"
      >
        {t('pages.inviteRegister')}
      </Button>
      <BootstrapDialog
        aria-labelledby="responsive-dialog-title"
        classes={{ paperScrollPaper: classes.paperScrollPaper }}
        fullScreen={fullScreen}
        fullWidth
        onBackdropClick={handleRegisterClose}
        open={openRegister}
      >
        <BootstrapDialogTitle
          className={classes.orgDialogTitle}
          id="inviteMembersOrg"
          onClose={handleRegisterClose}
        >
          {t('pages.invite.title')}
        </BootstrapDialogTitle>
        <DialogContent className={classes.orgDialogContent}>
          <DialogContentText />
          <div className={classes.inviteLink}>
            {getInviteLink()}
            <Button
              className={classes.btnCopyInviteLink}
              color="primary"
              id="btnCopyShareLink"
              onClick={handleCopy}
              variant="contained"
            >
              {t('board.header.shareBoard.copyLink')}
            </Button>
          </div>
        </DialogContent>
      </BootstrapDialog>
    </Root>
  );
}
