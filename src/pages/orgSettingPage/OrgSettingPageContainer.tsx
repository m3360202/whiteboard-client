//** Import react
import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { useLocation, useHistory } from 'react-router-dom';

//** Import i18n
import { useTranslation } from 'react-i18next';

//** Import Redux kit
import { RootState } from '../../store';
import {
  handleInitRoom,
} from '../../store/room';
import { useSelector, useDispatch } from 'react-redux';


//**Import Mui

import { useTheme } from '@mui/material/styles';

import { ThemeProvider, Box, Menu, MenuItem } from '@mui/material';

//**Import Services
import { UserService } from '../../services';

//** Imort components
import RoomLeftDrawer from '../../components/room/RoomLeftDrawer';

import OrganizationSettings from '../../components/org/OrganizationSettings';
import AppBarHeader from '../../components/common/AppBarHeader';



export default function OrgSettingPageContainer() {
  //use
  const dispatch = useDispatch();
  const theme = useTheme();

  const { t } = useTranslation();
  //** Effect events
  useEffect(() => {
    UserService.getInstance(); //initialize user service

    dispatch(handleInitRoom(''));
    document.title = t('pages.listPage.recentBoardsTagTitle');
  }, []);


  return (

    <Box
      id="organizationSettings"
    >
      <Box sx={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'row' }}>
        <RoomLeftDrawer parentComponent="recentPage" />
        <Box sx={{
          width: '100%',
          height: '100%',
          flexGrow: 1,
          backgroundColor: theme.palette.background.paper
        }}
          id="mainBoard2">
          <Box sx={{
            flexGrow: 1,
            width: '100%'
          }}>
            <AppBarHeader />
          <Box sx={{ flexGrow: 1, width: '100%', padding:'10px' }}>
            <OrganizationSettings />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
