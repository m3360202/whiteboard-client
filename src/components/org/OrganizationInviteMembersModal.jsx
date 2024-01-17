//** Import react
import React, { useState, useEffect } from 'react';

import { styled } from '@mui/material/styles';

//** Import i18n
import { useTranslation } from 'react-i18next';

//** Import Redux kit
import { RootState } from '../../store';
import { useSelector, useDispatch } from 'react-redux';
import { handleSetOrgMemberList } from '../../store/org';

//** Import Mui
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Button from '@mui/material/Button';
import BootstrapDialog, {
  BootstrapDialogTitle,
} from '../../mui/components/BootstrapDialog';

//** Import others
import OrganizationSettingsInviteUsers from './OrganizationSettingsInviteUsers';

export default function OrganizationInviteMembersModal() {
  //use

  const theme = useTheme();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [open, setOpen] = React.useState(false);
  const fullScreen = useMediaQuery(theme.breakpoints.up('xl'));
  //org
  const orgInfo = useSelector((state) => state.org.orgInfo);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div style={{  display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',}}>
      <Button
        color="primary"
        id="id_inviteMembers"
        onClick={handleOpen}
        sx={{ mr: '24px', pl: '12px', pr: '12px', minWidth: '134px' }}
        type="button"
        variant="contained"
      >
        {t('pages.inviteMembers')}
      </Button>

      <BootstrapDialog
        aria-labelledby="responsive-dialog-title"
       /* classes={{ paperScrollPaper: {  width: '734px',
        height: 'auto',
        maxWidth: 'unset',
        padding: '32px',
        boxSizing: 'border-box'}}}*/
        fullScreen={fullScreen}
        fullWidth
        onBackdropClick={handleClose}
        open={open}
      >
        <BootstrapDialogTitle
          sx={{
          padding: 3,
          fontSize: '28px',
          color: '#000000',
          lineHeight: '34px',
          marginBottom: '0px'}}
          id="inviteMembersOrg"
          onClose={handleClose}
        >
          {t('pages.organizationAddMember')} {orgInfo.name}
        </BootstrapDialogTitle>
        <DialogContent 
        className={{    padding: '0px 17px 0px 0px'}}
        >
          <DialogContentText />
          <OrganizationSettingsInviteUsers />
        </DialogContent>
      </BootstrapDialog>
    </div>
  );
}
