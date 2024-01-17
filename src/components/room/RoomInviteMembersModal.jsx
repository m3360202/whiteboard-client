//** Import react
import React from 'react';

import { styled } from '@mui/material/styles';

//** Import Redux kit
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';

//** Import Mui
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useHistory } from 'react-router-dom';
import DialogContent from '@mui/material/DialogContent';
import Avatar from '@mui/material/Avatar';
import RoomSettingsInviteUsers from './RoomSettingsInviteUsers';
import BootstrapDialog, {
  BootstrapDialogTitle,
} from '../../mui/components/BootstrapDialog';


export default function RoomInviteMembersModal() {
  //use
  const dispatch = useDispatch();

  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.up('xl'));
  const history = useHistory();
  // rooom


  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <div
      id="roomInviteMembersModal"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginLeft: 0
      }}
    >
      <Avatar
        alt="BB"
        onClick={handleOpen}
        sx={{
          bgcolor: 'rgba(235, 164, 189, 0.19)',
          cursor: 'pointer',
          width: '28px',
          height: '28px',
          color: '#F21D6B'
        }}
      >
        +
      </Avatar>
      <BootstrapDialog
        aria-labelledby="responsive-dialog-title"
        //classes={{ paper: classes.paper }}
        sx={{
          '& .MuiDialog-paper': {
            width: '758px',
            height: 'auto',
            overflowY: 'auto',
            maxWidth: '758px'
          },
 
        }}
        fullScreen={fullScreen}
        fullWidth
        onBackdropClick={handleClose}
        open={open}
      >
        <BootstrapDialogTitle
          sx={{
            height: '34px',
            padding: 0,
            fontSize: '28px',
            color: '#000000',
            lineHeight: '34px',
            fontWeight: 500,
            margin: '32px 0px 8px 32px'
            
          }}
          id="inviteMembersRoom"
          onClose={handleClose}
        >
          {t('pages.roomInviteMember')}
        </BootstrapDialogTitle>

        <DialogContent
          style={{
            paddingLeft: 32,
            paddingRight: 32,
            paddingTop: 0
          }}
        >
          <RoomSettingsInviteUsers />
        </DialogContent>
      </BootstrapDialog>
    </div>
  );
}
