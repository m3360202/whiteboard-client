//** Import react
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { useState, useRef } from 'react';

//** Import i18n
import { useTranslation } from 'react-i18next';

//** Import Redux kit
import store, { RootState } from '../../store';
import { useSelector } from 'react-redux';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
//**Import Mui
import Box from '@mui/material/Box';
import DialogContent from '@mui/material/DialogContent';
import { useTheme } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import useMediaQuery from '@mui/material/useMediaQuery';
import { ThemeProvider } from '@mui/material';
import lightTheme from '../../mui/theme/lightTheme';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import BootstrapDialog, {
  BootstrapDialogTitle,
} from '../../mui/components/BootstrapDialog';
import { TextField } from '@mui/material';
import ClipboardService from '../../services/ClipboardService';

const PREFIX = 'InviteFriendMobile';

const classes = {
  inviteLink: `${PREFIX}-inviteLink`,
  paper: `${PREFIX}-paper`,
  roomSetting: `${PREFIX}-roomSetting`,
  container: `${PREFIX}-container`,
  input: `${PREFIX}-input`,
  profileLink: `${PREFIX}-profileLink`,
  title: `${PREFIX}-title`,
  content: `${PREFIX}-content`,
  profileDialogContent: `${PREFIX}-profileDialogContent`,
  profileDialogTitle: `${PREFIX}-profileDialogTitle`,
  stepTitle: `${PREFIX}-stepTitle`,
  stepContent: `${PREFIX}-stepContent`,
  note: `${PREFIX}-note`,
  noteBold: `${PREFIX}-noteBold`,
  shareLink: `${PREFIX}-shareLink`,
  shareLinkNote: `${PREFIX}-shareLinkNote`,
  emailFlexbox: `${PREFIX}-emailFlexbox`,
  divider: `${PREFIX}-divider`
};

const StyledThemeProvider = styled('div')((
  {
    theme
  }
) => ({
  [`& .${classes.inviteLink}`]: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
  },

  [`& .${classes.paper}`]: {
    position: 'absolute',
    backgroundColor: theme.palette.background.paper,
    border: '0px solid #000',
    outline: 'none',
    margin: '15px 0px',
    width: '90%',
    height: 'auto !important',
    paddingBottom: '20px'
  },

  [`& .${classes.roomSetting}`]: {
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      float: 'left',
    },
  },

  [`& .${classes.container}`]: {
  },

  [`& .${classes.input}`]: {
    size: 100,
    fontFamily: 'Inter'
  },

  [`& .${classes.profileLink}`]: {
    padding: 0,
    fontSize: '16px',
  },

  [`& .${classes.title}`]: {
    fontSize: '20px',
    fontWeight: '500',
    fontFamily: 'Inter'

  },

  [`& .${classes.content}`]: {
    fontSize: '12px',
    fontWeight: '400',
    margin: '0 auto',
    marginTop: '12px',
    lineHeight: '20px',
    color: "rgba(58, 53, 65, 0.68)",
    fontFamily: 'Inter',
    width: '90%'

  },

  [`& .${classes.profileDialogContent}`]: {
    padding: '0 !important',
    textAlign: 'center'
  },

  [`& .${classes.profileDialogTitle}`]: {
    height: 50,
 
    left: 264,
    top: 108,
  },

  [`& .${classes.stepTitle}`]: {
    margin: '10px 0', fontSize: '12px', fontWeight: '600',
    fontFamily: 'Inter'
  },

  [`& .${classes.stepContent}`]: {
    fontSize: '12px',
    fontWeight: '400',
    lineHeight: '20px',
    color: "rgba(58, 53, 65, 0.68)",
    fontFamily: 'Inter',
    wordWrap: 'break-word'
  },

  [`& .${classes.note}`]: {
    margin: '0 auto',
    marginTop: '36px',
    marginBottom: '26px',
    fontSize: '12px',
    fontWeight: '400',
    lineHeight: '20px',
    color: "rgba(58, 53, 65, 0.68)",
    width: '90%',
    fontFamily: 'Inter',
    letterSpacing: '0.15px'
  },

  [`& .${classes.noteBold}`]: {
    fontSize: '15px',
    fontWeight: 'bold',
    color: "rgba(58, 53, 65, 0.68)",
    fontFamily: 'Inter'
  },

  [`& .${classes.shareLink}`]: {
    fontSize: '16px',
    fontWeight: '500',
    marginTop: '18px'
  },

  [`& .${classes.shareLinkNote}`]: {
    fontSize: '12px',
    fontWeight: '400',
    color: "rgba(58, 53, 65, 0.68)",
    marginTop: '6px',
    marginBottom: '12px',
    fontFamily: 'Inter',
    width: '90%',
    lineHeight: '20px'
  },

  [`& .${classes.emailFlexbox}`]: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    rowGap: 2,
  },

  [`& .${classes.divider}`]: {
    marginTop: 24,
    marginBottom: 24,
  }
}));

export default function InviteFriendMobile() {
  //use now
  const theme = useTheme();

  const { t } = useTranslation();
  const orgInfo = useSelector((state) => state.org.orgInfo);
  const [openDialog, setOpenDialog] = useState(false);
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const language = localStorage.getItem('boardx-lang-pref');
  const rsBtn = useRef(null);
  const userInfo = useSelector((state) => state.user.userInfo);

  const handleClickOpen = () => {
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const stopTabPropagation = (event) => {
    if (event.key === 'Tab') {
      event.stopPropagation();
    }
  };
  const inviteLink = 'http://' + location.host + '/join?invite=' + store.getState().user.userInfo.userId;
  const getInviteLink = () => {
    return `http://${location.host}/join?invite=${store.getState().user.userInfo.userId}`;
  };

  const handleCopy = () => {
    ClipboardService.getInstance().clipboardCopy(getInviteLink());
    Boardx.Util.Msg.info(
      t('components.connectionNotification.youHaveCopiedShareLink'),
    );
  };

  const userProfileBtnCOM = (
    <div id="rsButton" ref={rsBtn}>
      <div
        className={classes.profileLink}
        id="id_roomsetting"
        onClick={handleClickOpen}
      >
        {t('components.userMenu.ReferAFriend')}
      </div>
    </div>
  );
  const title = t('components.referFriend.title').replace('&amp;', '&');

  return (
    <StyledThemeProvider theme={lightTheme}>
      <div className={classes.roomSetting}>
        <div style={{ width: '100%' }}>
          {userProfileBtnCOM}
          <BootstrapDialog
            PaperProps={{ className: classes.paper }}
            aria-labelledby="responsive-dialog-title"
            classes={{ container: classes.container }}
            fullScreen={fullScreen}
            onBackdropClick={handleClose}
            onKeyDown={stopTabPropagation}
            open={openDialog}
          >
            <DialogTitle
              className={classes.profileDialogTitle}
              id="responsive-dialog-title"
              // onClose={handleClose}
            >
               {title} 
            </DialogTitle>
            <DialogContent className={classes.profileDialogContent}>
           
             <Box style={{color:'#f21d6b'}}> You have invited {userInfo.referalUsers} users</Box> 
              {/* {language === 'en' ? <Box className={classes.content} style={{ paddingLeft: '5px' }}>  {t('components.referFriend.content')}</Box>
                : <Box className={classes.content}>  {t('components.referFriend.content')}</Box>}
              <Box style={{ display: 'flex', margin: '0 auto', marginTop: '20px', justifyContent: 'space-between', width: '90%' }}>
                <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Box style={{ width: '50px', height: '50px' }}><svg width="50" height="50" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50" cy="50" r="50" fill="#9155FD" />
                    <circle cx="50" cy="50" r="50" fill="white" fillOpacity="0.88" />
                    <path d="M63.3333 33.3333H36.6667C34.8333 33.3333 33.3333 34.8333 33.3333 36.6667V66.6667L40 60H63.3333C65.1667 60 66.6667 58.5 66.6667 56.6667V36.6667C66.6667 34.8333 65.1667 33.3333 63.3333 33.3333ZM63.3333 56.6667H40L36.6667 60V36.6667H63.3333V56.6667Z" fill="#F21D6B" />
                  </svg>
                  </Box>
                  <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '105px' }}>
                    <Typography className={classes.stepTitle}>{t('components.referFriend.steptitle1')} 👍🏻</Typography>
                    <Typography className={classes.stepContent}>{t('components.referFriend.stepcontent1')}</Typography>
                  </Box>
                </Box>

                <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Box style={{ width: '50px', height: '50px' }}>
                    <svg width="50" height="50" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="50" cy="50" r="50" fill="#9155FD" />
                      <circle cx="50" cy="50" r="50" fill="white" fillOpacity="0.88" />
                      <path d="M61.6667 33.3333H54.7C54 31.4 52.1667 30 50 30C47.8333 30 46 31.4 45.3 33.3333H38.3333C36.5 33.3333 35 34.8333 35 36.6667V63.3333C35 65.1667 36.5 66.6667 38.3333 66.6667H61.6667C63.5 66.6667 65 65.1667 65 63.3333V36.6667C65 34.8333 63.5 33.3333 61.6667 33.3333ZM50 33.3333C50.9167 33.3333 51.6667 34.0833 51.6667 35C51.6667 35.9167 50.9167 36.6667 50 36.6667C49.0833 36.6667 48.3333 35.9167 48.3333 35C48.3333 34.0833 49.0833 33.3333 50 33.3333ZM61.6667 63.3333H38.3333V36.6667H41.6667V41.6667H58.3333V36.6667H61.6667V63.3333Z" fill="#F21D6B" />
                    </svg>
                  </Box>
                  <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography className={classes.stepTitle}>{t('components.referFriend.steptitle2')} 😎</Typography>
                    {language === 'en' ? <Typography className={classes.stepContent} style={{ paddingLeft: '10px' }}>{t('components.referFriend.stepcontent2')}</Typography> : <Typography className={classes.stepContent}>{t('components.referFriend.stepcontent2')}</Typography>}
                  </Box>
                </Box>

                <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Box style={{ width: '50px', height: '50px' }}><svg width="50" height="50" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50" cy="50" r="50" fill="#9155FD" />
                    <circle cx="50" cy="50" r="50" fill="white" fillOpacity="0.88" />
                    <path d="M63.3333 33.3333H36.6667C34.8333 33.3333 33.3333 34.8333 33.3333 36.6667V66.6667L40 60H63.3333C65.1667 60 66.6667 58.5 66.6667 56.6667V36.6667C66.6667 34.8333 65.1667 33.3333 63.3333 33.3333ZM63.3333 56.6667H40L36.6667 60V36.6667H63.3333V56.6667Z" fill="#F21D6B" />
                  </svg>
                  </Box>
                  <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography className={classes.stepTitle} style={{ maxWidth: '130px' }}>{t('components.referFriend.steptitle3')} 🎉</Typography>
                    {language === 'en' ? <Typography className={classes.stepContent} style={{ paddingLeft: '5px' }}>{t('components.referFriend.stepcontent3')}</Typography> : <Typography className={classes.stepContent}>{t('components.referFriend.stepcontent3')}</Typography>}
                  </Box>
                </Box>

              </Box> */}
              {/* <Box className={classes.note}>{t('components.referFriend.note1')}{" " + orgInfo.name + " "}{t('components.referFriend.note2')}
                <span className={classes.noteBold}>{t('components.referFriend.note3')}</span>
                {t('components.referFriend.note4')}
              </Box>
              <Divider light /> */}
              <Box style={{ textAlign: 'left', width: '90%', marginLeft: '20px', marginBottom: '10px' }}>
                <Typography className={classes.shareLink}>{t('components.referFriend.shareLink')}</Typography>
                {/* <Typography className={classes.shareLinkNote}>{t('components.referFriend.shareLinkNote')} 🚀</Typography> */}
                <Box style={{ position: 'relative', marginBottom: '10px' }}>
                  <TextField
                    name="share"
                    sx={{ width: '90%', height: '40px', }}
                    inputProps={{ style: { borderRadius: '8px', color: '#ccc', fontSize: '12px', width: '50%', overflow: 'hidden' } }}
                    value={inviteLink}
                    readOnly
                  />
                  <Typography onClick={handleCopy} style={{ color: '#F21D6B', fontSize: '12px', position: 'absolute', top: '16px', right: '45px', zIndex: '999', cursor: 'pointer' }}>{t('components.referFriend.copy')}</Typography>
                </Box>
              </Box>
              {/* <Box style={{ textAlign: 'left', marginLeft: '20px', width: '90%' }}>
                <Typography className={classes.shareLinkNote}>{t('components.referFriend.maxUsers')} </Typography>
                <Box style={{ position: 'relative', marginBottom: '30px' }}>
                  <TextField
                    name="share"
                    sx={{ width: '90%', height: '40px',}}
                    inputProps={{ style: { borderRadius: '8px', color: '#ccc', fontSize: '14px' } }}
                    value="10"
                    readOnly
                  />
                </Box>
              </Box> */}
            </DialogContent>
        
            <DialogActions>
            <Button onClick={handleClose}>{'Close'}</Button>
            </DialogActions>
          </BootstrapDialog>
        </div>
      </div>
    </StyledThemeProvider>
  );
}
