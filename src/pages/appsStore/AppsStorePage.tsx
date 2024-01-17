//** Import react
import React, { useRef, useState, useEffect } from 'react';


//** Import i18n
import { useTranslation } from 'react-i18next';

//** Import Redux kit
import { RootState } from '../../store';
import { handleInitRoom } from '../../store/room';
import { useSelector, useDispatch } from 'react-redux';

//**Import Mui
import { useTheme } from '@mui/material/styles';
import { ThemeProvider, Box, Menu, MenuItem, IconButton } from '@mui/material';

//** Imort components
import RoomLeftDrawer from '../../components/room/RoomLeftDrawer';
import AppsStoreAIAgentPage from './AppsStoreAIAgentPage';
import AppBarHeader from  'components/common/AppBarHeader';


export default function AppsStorePage() {
  //use
  const dispatch = useDispatch();
  const theme = useTheme();

  const { t } = useTranslation();

  const orgInfo = useSelector((state: RootState) => state.org.orgInfo);

  //** Effect events
  useEffect(() => {
    dispatch(handleInitRoom(''));
    document.title = t('pages.listPage.recentBoardsTagTitle');
  }, []);

  useEffect(() => {
    if (!orgInfo?.orgId) return;
  }, [orgInfo]);



  return (

    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'stretch' }}>
      <RoomLeftDrawer parentComponent="AppsStorePage" />
      <Box sx={{ flexFlow: 'column', flexGrow:1 }} id="mainBoard2">
        <AppBarHeader />

        <AppsStoreAIAgentPage />

      </Box>
    </Box>

  );
}
