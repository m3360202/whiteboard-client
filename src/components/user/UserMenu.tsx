//** Import react
import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import { useHistory } from 'react-router-dom';

//** Import i18n

import { useTranslation } from 'react-i18next';

//** Import Redux kit
import store, { RootState } from '../../store';
import { useSelector, useDispatch } from 'react-redux';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Link from '@mui/material/Link';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { BootstrapDialogTitle } from '../../mui/components/BootstrapDialog';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import Typography from '@mui/material/Typography';
import ArrowRight from '@mui/icons-material/ArrowRight';

//**Import Services
import { SysService, UserService } from '../../services';

//**Import others
import PropTypes from 'prop-types';
import UserProfile from './UserProfile';
import InviteFriend from './InviteFriend';
import InviteFriendMobile from './InviteFriendMobile';
import data, { versionNo } from '../../util/update';
import UserBasicInfo from './UserBasicInfo';


const UserMenu = ({ logout }) => {
  const history = useHistory();

  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [menuPosition, setMenuPosition] = useState(null);
  const userInfo: any = useSelector((state: RootState) => state.user.userInfo);
  const userAdminRole = userInfo.roles.includes('BoardX Admin');
  const uiType = localStorage.getItem('currentUIType');
  const [open, setOpen] = useState(false);

  const handleClick = event => {
    if (menuPosition) {
      return;
    }
    event.preventDefault();
    setMenuPosition({
      top: event.pageY,
      left: event.pageX
    });
  };

  const handleClose = () => {
    setMenuPosition(null);
  };

  const handleClickGoToProfileLink = () => {
    history.push('/profile');
    handleClose()
  }

  const handleClickLanguageSwitch = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseLanguageSwitch = () => {
    setAnchorEl(null);
  }

  const onChangeLanguage = (event, language) => {
    event.preventDefault();
    if (language) {
      SysService.setLocale(language);
      window.location.reload();
    }
  };

  const renderLoggedIn = () => (

    <Box
      data-cy="user-menu"
      onClick={handleClick}
      sx={{
        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'd',
        '.menuPaper': {
          minWidth: '260px',
          marginTop: '12px',
          padding: '24px 0px 0px 0px',
          overflow: 'hidden'
        },
        '.menuList': { padding: 0 },
        '.menuItemRoot': { padding: '0px 16px' },
        '.gutters': {
          height: '40px',
          paddingTop: '8px',
          paddingBottom: '8px',
          paddingRight: 0,
          justifyContent: 'space-between'
        }
      }}
    >
      <Box style={{
        letterSpacing: '0.16px',
        fontWeight: 400,
        fontSize: '13px',
        lineHeight: '18px',
        color: '#FFB400',
        padding: '3px 10px ',
        margin: '2px',
        background:
          'linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #ED6C02',
        borderRadius: '4px'
      }}>
        {userInfo.status == 'pro' ? 'Pro' : 'Free'}
      </Box>
      <Avatar
        aria-label="user"
        id="avatarMenu"
        {...Boardx.Util.stringAvatar(userInfo.nickName)}
        alt={
          userInfo.avatarType === 'data'
            ? userInfo.nickName
            : userInfo.nickName?.toUpperCase()
        }

        sx={{
          width: '28px',
          height: '28px',
          fontSize: '12px',
          display: 'flex',
          alignItems: 'center'
        }}
        src={userInfo.avatar}
      />

      <Menu
        classes={{ paper: 'menuPaper', list: 'menuList' }}
        anchorEl={document.getElementById('avatarMenu')}
        onClose={() => setMenuPosition(null)}
        open={!!menuPosition}
      // open={true}
      >
        <MenuItem
          classes={{ root: 'menuItemRoot' }}
          style={{ backgroundColor: 'transparent' }}
        >
          <UserBasicInfo />
        </MenuItem>
        <Divider light />
        {store.getState().user.userInfo &&
          store.getState().user.userInfo.type &&
          store.getState().user.userInfo.type === 'user' && (
            <MenuItem
              classes={{ root: 'menuItemRoot' }}
              data-cy="account"
            >
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 400,
                  fontSize: '14px',
                  lineHeight: '24px',
                  color: '#232930',
                  padding: 0,
                  margin: '8px 0',
                  flex: 1
                }}
                onClick={handleClickGoToProfileLink}
              >
                {t('components.userMenu.accounts')} &{' '}
                {t('components.userMenu.settings')}
              </Typography>
            </MenuItem>
          )}
        <MenuItem classes={{ root: 'menuItemRoot' }} data-cy="invite">
          {uiType !== 'mobile' ? <InviteFriend /> : <InviteFriendMobile />}
        </MenuItem>

        {userAdminRole && (<MenuItem
          classes={{ gutters: 'gutters' }}
          onClick={() => history.push('/admin')}
          value="AdminConsole"
        >
          Admin Console
        </MenuItem>)}

        <MenuItem
          classes={{ gutters: 'gutters' }}
          onClick={handleClickLanguageSwitch}
          value="languages"
        >
          {t('board.header.moreLanguage')}
          <ArrowRight />
        </MenuItem>

        <Menu
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left'
          }}
          keepMounted
          onClose={handleCloseLanguageSwitch}
          open={Boolean(anchorEl)}
          style={{ boxShadow: '1px 1px 4px 2px #D9A1B18A', marginLeft: -8 }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
        >
          <MenuItem onClick={event => onChangeLanguage(event, 'en')}>
            English
          </MenuItem>
          <MenuItem onClick={event => onChangeLanguage(event, 'zh-CN')}>
            中文
          </MenuItem>
        </Menu>

        <MenuItem classes={{ root: 'menuItemRoot' }} onClick={logout}>
          <Box sx={{
            fontWeight: 400,
            fontSize: '14px',
            lineHeight: '24px',
            padding: 0,
            margin: '8px 0',
            color: '#FF4C51'
          }}>
            {t('components.userMenu.logout')}
          </Box>
        </MenuItem>
      </Menu>

      <Dialog
        aria-describedby="alert-dialog-description"
        aria-labelledby="alert-dialog-title"
        fullWidth
        onClose={() => {
          setOpen(false);
          handleClose();
        }}
        open={false}
      >
        <BootstrapDialogTitle
          onClose={() => {
            setOpen(false);
            handleClose();
          }}
        >
          {t('components.userMenu.version')}
        </BootstrapDialogTitle>
        <DialogContent>
          <Timeline position="right">
            {data.map((e, index) => (
              <TimelineItem key={index}>
                <TimelineOppositeContent>{e.time}</TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot variant="outlined" color="primary" />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent
                  dangerouslySetInnerHTML={{ __html: e.content }}
                ></TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        </DialogContent>
      </Dialog>
    </Box>
  );

  const renderLoggedOut = () => (
    <div className="user-menu">
      <Link className="btn-primary" href="/signin">
        {t('components.userMenu.login')}
      </Link>
      <Link className="btn-primary" href="/join">
        {t('components.userMenu.join')}
      </Link>
    </div>
  );

  return renderLoggedIn();
};

UserMenu.propTypes = {
  logout: PropTypes.func
};

export default UserMenu;
