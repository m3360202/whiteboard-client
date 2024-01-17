//** Import react
import React, { useEffect } from 'react';

import { styled } from '@mui/material/styles';

//** Import i18n

import { useTranslation } from 'react-i18next';

//** Import Redux kit
import store, { RootState } from '../../store'
import { useSelector, useDispatch } from 'react-redux';
import { useGetBoardListInTheRoomQuery } from '../../redux/RoomAPISlice';
import DashBoardTeamTutorials from '../../components/onBoarding/DashBoardTeamTutorials';

import { ThemeProvider } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import lightTheme from '../../mui/theme/lightTheme';

//** Imort components
import RoomPage from '../../components/room/RoomPage';
import RoomLeftDrawer from '../../components/room/RoomLeftDrawer';
import { useTheme } from '@emotion/react';
import Box from '@mui/material/Box';
 
const drawerWidth = 240;

let showTutorial = false;
if (
  localStorage.getItem('IfRoomTutorialShown') !== 'true' &&
  window.innerWidth >= 600
) {
  showTutorial = true;
  setTimeout(() => {
    localStorage.setItem('IfRoomTutorialShown', 'true');
  }, 500);
}


export default function RoomHome() {
  //use
  const dispatch = useDispatch();
  const theme = useTheme();

  const roomId = useSelector((state: RootState) => state.room.roomId);

  const { data: loadedRoomInfo } = useGetBoardListInTheRoomQuery({
    startIndex: 0,
    limit: 100,
    searchKey: '',
    roomId,
  });

  return (
    <Box >
      <Box sx={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'row' }}>
        <RoomLeftDrawer parentComponent="roomPage" />
        <Box sx={{
          width: '100%',
          height: '100%',
          flexGrow: 1,
        }}
          id="mainBoard2">
          <Box sx={{
            flexGrow: 1,
            width: '100%'
          }}>
            <RoomPage />
          </Box>
          <DashBoardTeamTutorials />
        </Box>
      </Box>
    </Box >
  );
}