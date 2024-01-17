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


import { useTheme } from '@mui/material/styles';
import { ThemeProvider, Box, Menu, MenuItem, IconButton, Grid } from '@mui/material';


//** Imort components
import RoomLeftDrawer from '../../components/room/RoomLeftDrawer';

import AIAssistantAvaChatPage from './AIAssistantAvaChatPage'



import AppBarHeader from '../../components/common/AppBarHeader';

export default function AiAssistantPage() {
  //use
  const dispatch = useDispatch();
  const theme = useTheme();



  const { t } = useTranslation();


  //** Effect events
  useEffect(() => {
    dispatch(handleInitRoom(''));
    document.title = t('pages.listPage.recentBoardsTagTitle');
  }, []);


  return (
    <Box sx={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'row' }}>
      <RoomLeftDrawer parentComponent="AIAssistantPage" />
        <Box sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
        
          <AIAssistantAvaChatPage chatType="dashboard" />

        </Box>
  
    </Box>

  );
}
