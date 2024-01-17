//** Import react
import React, { useRef, useState, useEffect } from 'react';

import { styled } from '@mui/material/styles';

//** Import i18n
import { useTranslation } from 'react-i18next';

//** Import Redux kit
import { RootState } from '../../store';
import { handleInitRoom } from '../../store/room';
import { useSelector, useDispatch } from 'react-redux';

//**Import Mui
import currentTheme from '../../mui/theme/lightTheme';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { ThemeProvider, Box, Menu, MenuItem, IconButton } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';

//**Import Services
import { UserService } from '../../services';

 
import UserMenu from '../../components/user/UserMenu';
import OrganizationInviteMembersModal from '../../components/org/OrganizationInviteMembersModal';
import AutoSearchBoard from '../../components/search/AutoSearchBoard';
 


const drawerWidth = 240;
const winHeight = window.innerHeight;



function DesktopHeader({ isOrgAdmin, logout }) {


  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
      maxHeight: '50px',
      justifyContent: 'space-between'
    }}>
      <AutoSearchBoard />
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {isOrgAdmin && <OrganizationInviteMembersModal />}
        <UserMenu logout={logout} />
      </div>
    </Box>
  );
}

function MobileUIHeader({ logout, isOrgAdmin }) {
  //dom & control
  const [openMenu, setOpenMenu] = useState(false);
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        flexGrow: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        mt: '10px'
      }}
    >
      <IconButton
        aria-label="open drawer"
        sx={{ color: '#828282' }}
        color="inherit"
        edge="start"
        onClick={() => (window as any).setMobileOpen(true)}
        size="large"
      >
        <MenuIcon />
      </IconButton>
      <AutoSearchBoard />
      <Box sx={{display:'flex', flexDirection:'row', flexWrap:'nowrap' }}> 
      <UserMenu logout={logout} />
      <IconButton
        aria-label="show 17 new notifications"
        color="inherit"
        id="moreMenuRecentPageHeader"
        onClick={() => setOpenMenu(true)}
        size="large"
      >
        {isOrgAdmin && <MoreVertOutlinedIcon
          style={{ color: openMenu ? '#F21d6B' : 'rgba(0,0,0,0.54)' }}
        />}
      </IconButton>
      {isOrgAdmin && <Menu
        anchorEl={document.getElementById('moreMenuRecentPageHeader')}
        onClose={() => {
          setOpenMenu(false);
        }}
        open={openMenu}
      >
        <MenuItem>
          <OrganizationInviteMembersModal />
        </MenuItem>
      </Menu>}
      </Box>
    </Box>
  )
}

export default function MainHeader() {
  const theme = useTheme();
  //org
  const isOrgAdmin =
    useSelector((state: RootState) => state.org.orgInfo.role) !== 'member'
      ? true
      : false;
  //mobile
  const smallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const logout = () => {
    UserService.getInstance().logout();
    // history.push('/signin');
    window.location.href = '/signin';
  };


  return (
 
      <Box
        sx={{
          display: 'flex',
          flexGrow:1, 
          flexDirection: 'row',
          alignItems: 'center',
          zIndex: 1002,
          paddingTop: 0,
          minHeight: 60,
          width: '100%',
          boxShadow: '0px 1px 12px rgba(68, 68, 103, 0.07)',
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E0E0E0',
          
        }}
 

      >
        <Toolbar
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            height: '100%'
          }}
        >
          {smallScreen && <MobileUIHeader isOrgAdmin={isOrgAdmin} logout={logout}></MobileUIHeader>}
          {!smallScreen && <DesktopHeader isOrgAdmin={isOrgAdmin} logout={logout} />}

        </Toolbar>
      </Box>
 
  );
}

