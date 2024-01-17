//** Import react
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { useState, useRef } from 'react';

//** Import i18n
import { useTranslation } from 'react-i18next';

//** Import Redux kit
import store, { RootState } from '../../store';
import { useSelector } from 'react-redux';

//**Import Mui
import Box from '@mui/material/Box';
import DialogContent from '@mui/material/DialogContent';
import { useTheme } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import useMediaQuery from '@mui/material/useMediaQuery';
import { ThemeProvider } from '@mui/material';
import lightTheme from '../../mui/theme/lightTheme';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import { TextField } from '@mui/material';
import ClipboardService from '../../services/ClipboardService';


export default function InviteFriend() {
  //use now
  const theme = useTheme();

  const { t } = useTranslation();
  const orgInfo = useSelector(state => state.org.orgInfo);
  const [openDialog, setOpenDialog] = useState(false);
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const language = localStorage.getItem('boardx-lang-pref');
  const rsBtn = useRef(null);
const userInfo = useSelector(state => state.user.userInfo);
  const handleClickOpen = () => {
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const stopTabPropagation = event => {
    if (event.key === 'Tab') {
      event.stopPropagation();
    }
  };
  const inviteLink =
    'http://' +
    location.host +
    '/join?invite=' +
    store.getState().user.userInfo.userId;
  const getInviteLink = () => {
    return `http://${location.host}/join?invite=${
      store.getState().user.userInfo.userId
    }`;
  };

  const handleCopy = () => {
    ClipboardService.getInstance().clipboardCopy(getInviteLink());
    Boardx.Util.Msg.info(
      t('components.connectionNotification.youHaveCopiedShareLink')
    );
  };

  const userProfileBtnCOM = (
    <Box id="rsButton" ref={rsBtn}>
      <Box
        sx={{
          fontWeight: 400,
          fontSize: '14px',
          lineHeight: '24px',
          color: '#232930',
          padding: 0,
          margin: '8px 0'
        }}
        id="id_roomsetting"
        onClick={handleClickOpen}
      >
        {t('components.userMenu.ReferAFriend')}
      </Box>
    </Box>
  );

  const title = t('components.referFriend.title').replace('&amp;', '&');

  return (
    <ThemeProvider theme={lightTheme}>
      <Box
        sx={{
          width: '100%',
          [theme.breakpoints.up('sm')]: {
            float: 'left'
          }
        }}
      >
        <Box sx={{ width: '100%' }}>
          {userProfileBtnCOM}

          <Dialog
            aria-labelledby="responsive-dialog-title"
            onClose={handleClose}
            onKeyDown={stopTabPropagation}
            open={openDialog}
            classes={{ container: {    height: '100%'}, paper: {  position: 'absolute',
            width: '900px',
            maxWidth: '900px',
            backgroundColor: theme.palette.background.paper,
            border: '0px solid #000',
            outline: 'none'} }}
            fullScreen={fullScreen}
          >
            <DialogTitle
              sx={{ height: 50,
                left: 264,
                top: 108,
                color: '#f21d6b'}}
              id="responsive-dialog-title"
              onClose={handleClose}
            >  
            </DialogTitle>
            <DialogContent 
            sx={{ 
              textAlign: 'center'
            }}
            >
              <Box sx={{ fontSize: '24px',
    fontWeight: '500',
    fontFamily: 'Inter'}}> {title}</Box>
             <Box sx={{color: "#f21d6b"}}> You have invited: {userInfo.referalUsers} users </Box>
              {/* {language === 'en' ? (
                <Box className={classes.content} style={{ paddingLeft: '5px' }}>
                  {' '}
                  {t('components.referFriend.content')} 
                </Box>
              ) : (
                <Box className={classes.content}>
                  {' '}
                  {t('components.referFriend.content')}
                </Box>
              )} */}
     
              {/* <Divider light /> */}
              <Box sx={{ textAlign: 'left', marginLeft: '20px' }}>
                <Typography sx={{  fontSize: '18px',
    fontWeight: '400',
    marginTop: '28px'}}>
                  {t('components.referFriend.shareLink')}
                </Typography>
                {/* <Typography className={classes.shareLinkNote}>
                  {t('components.referFriend.shareLinkNote')} 🚀
                </Typography> */}
                <Box sx={{ position: 'relative', marginBottom: '50px' }}>
                  <TextField
                    name="share"
                    sx={{ width: '440px', height: '40px' }}
                    inputProps={{
                      style: {
                        borderRadius: '8px',
                        color: '#ccc',
                        fontSize: '12px'
                      }
                    }}
                    value={inviteLink}
                    readOnly
                  />
                  <Typography
                    onClick={handleCopy}
                    sx={{
                      color: '#F21D6B',
                      fontSize: '12px',
                      position: 'absolute',
                      top: '16px',
                      left: '370px',
                      zIndex: '999',
                      cursor: 'pointer'
                    }}
                  >
                    {t('components.referFriend.copy')}
                  </Typography>
                </Box>
              </Box>
              {/* <Box style={{ textAlign: 'left', marginLeft: '30px' }}>
                <Typography className={classes.shareLinkNote}>{t('components.referFriend.maxUsers')} </Typography>
                <Box style={{ position: 'relative', marginBottom: '50px' }}>
                  <TextField
                    name="share"
                    sx={{ width: '540px', height: '40px', }}
                    inputProps={{ style: { borderRadius: '8px', color: '#ccc', fontSize: '14px' } }}
                    value="10"
                    readOnly
                  />
                </Box>
              </Box> */}
            </DialogContent>
          </Dialog>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
