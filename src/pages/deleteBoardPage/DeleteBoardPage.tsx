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

import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import { useTheme } from '@mui/material/styles';

import { ThemeProvider, Box, Menu, MenuItem } from '@mui/material';
import AppBarHeader from '../../components/common/AppBarHeader';
//**Import Services
//** Imort components
import { Board } from '../../components/board/Board';
import RoomLeftDrawer from '../../components/room/RoomLeftDrawer';

const winHeight = window.innerHeight;

export default function DeleteBoardPage() {
  //use
  const dispatch = useDispatch();
  const theme = useTheme();

  const contentRef: any = useRef();
  const { t } = useTranslation();
  //user
  const userInfo = useSelector((state: RootState) => state.user.userInfo);

  //board
  const boardList = useSelector(
    (state: RootState) => state.boardList.currentBoardList
  );

  const deletedBoardList = useSelector(
    (state: RootState) => state.boardList.pendingDeleteBoardList
  );

  //** Effect events
  useEffect(() => {
    dispatch(handleInitRoom(''));
    document.title = t('pages.listPage.recentBoardsTagTitle');
  }, []);

  useEffect(() => {
    if (
      userInfo &&
      userInfo.userName &&
      userInfo.userName.indexOf('vistor_') > -1
    ) {
      window.location.href = location.origin + '/signin';
    }
  }, [userInfo]);

  if (!boardList) return null;

  return (

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
          width: '100%',
          display: 'flex',
          flexDirection: 'column',

        }}>
          <AppBarHeader />
          <Toolbar sx={{
            padding: '16px',
            background: 'rgba(255,255,255,0.85)',
            width: '100%',
            justifyContent: 'space-between',
            zIndex: 1001
          }}>
            <Box sx={{
              display: 'flex',
              alignItems: 'center'
            }}>
              <Typography sx={{
                display: 'flex',
                minWidth: 100,
                fontSize: '1.5rem',
                [theme.breakpoints.down('sm')]: {
                  fontSize: '1.2rem'
                }
              }} variant="h4">
                {t('pages.listPage.deletedBoards')}
              </Typography>
            </Box>
          </Toolbar>
          <Box
            id="content2"
            ref={contentRef}
            style={{
              overflowY: 'scroll',
              height: winHeight
            }}
          >
            <Box sx={{
              flexGrow: 1,
              paddingLeft: (theme) => theme.spacing(3),
              paddingRight: (theme) => theme.spacing(3),
              overflowX: 'hidden',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '1rem',
            }} id="deleteBoardContent">
              {deletedBoardList &&
                deletedBoardList.map(d => (
                  <Board board={d} key={d._id} type="recentPageBoard" />
                ))}
            </Box>
          </Box>
        </Box>

      </Box>
    </Box>

  );
}
