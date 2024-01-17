//** Import react
import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { useLocation, useParams } from 'react-router-dom';
import LazyLoad from 'react-lazyload';
//** Import i18n

import { useTranslation } from 'react-i18next';
//** Import Redux kit
import store, { RootState } from '../../store';
import { useSelector, useDispatch } from 'react-redux';
import { handleSetCurrentBoardList } from '../../store/boardList';
import { handleSetRoomId } from '../../store/room';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import lightTheme from '../../mui/theme/lightTheme';
import { ThemeProvider, Box, Snackbar } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
//** Import Services
import { BoardService, EventService, OrgService } from '../../services';
//** Imort components
import BoardCreateBoardModal from '../board/BoardCreateBoardModal';
import RoomHeader from './RoomHeader';
import { Board } from '../board/Board';
import { RoomCard } from './RoomCard';
import {
  useGetBoardListInTheRoomQuery,
  useLoadRoomInfoQuery
} from '../../redux/RoomAPISlice';
import { useGetRoomListByOrgIdQuery } from '../../redux/OrgAPISlice';
import EventNames from '../../util/EventNames';
import MenuChatAITouch from '../boardChatAI/MobileChatAI/MenuChatAITouch';
import DesktopChatAI from '../boardChatAI/ChatAI/DesktopChatAI';
import i18n from '../../i18n';
 
function RoomPage() {
  const { id } = useParams();
  const roomId = id;
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const theme = useTheme();
  const location = useLocation();

  const orgId = useSelector(state => state.org.orgInfo.orgId);
  const smallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  //search
  const keywords = useSelector(state => state.boardList.keyword);
  // const roomInfo= useSelector((state) => state.room.roomInfo);
  // const boardList = useSelector(
  //   (state) => state.boardList.currentBoardList,
  // );
  const [shouldFetch, setShouldFetch] = useState(true);
  const { data: boardList = [], isFetching } = useGetBoardListInTheRoomQuery(
    {
      startIndex: 0,
      limit: 100,
      searchKey: keywords,
      roomId: roomId
    },
    {
      enabled: shouldFetch
    }
  );

  //room
  const inRoom = useSelector(state => state.room.inRoom);
  const { data: roomList } = useGetRoomListByOrgIdQuery(orgId);
  const { data: loadedRoomInfo } = useLoadRoomInfoQuery(roomId);
  console.log('loadedRoomInfo', loadedRoomInfo)
  const [roomInfo, setRoomInfo] = useState(null);
  const [memberList, setMemberList] = useState(null);
  // const [roomData, setRoomData] = useState(null);

  useEffect(() => {
    if (!loadedRoomInfo || !loadedRoomInfo.roomInfo) return;

    setRoomInfo(loadedRoomInfo.roomInfo);
    setMemberList(loadedRoomInfo.memberList);
    if (
      loadedRoomInfo.roomInfo.orgId &&
      store.getState().org.orgInfo.orgId &&
      loadedRoomInfo.roomInfo.orgId !== store.getState().org.orgInfo.orgId
    ) {
      console.log(
        'load org',
        loadedRoomInfo.roomInfo,
        store.getState().org.orgInfo
      );
      OrgService.getInstance().loadOrganization(
        loadedRoomInfo.roomInfo.orgId
      );
    }
    // setRoomData(loadedRoomInfo.roomData);
  }, [loadedRoomInfo]);

  // const roomData = useSelector((state) => state.room.roomInfo);
  useEffect(() => {
    setShouldFetch(true);
  }, [keywords]);
  useEffect(() => {
    if (isFetching) {
      setShouldFetch(false);
    }
  }, [isFetching]);

  const onResize = () => {
    let windowHeight =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight;
    document.getElementById('boardContent').style.height = windowHeight + 'px';
  };

  useEffect(() => {
    onResize();
    EventService.getInstance().register(
      EventNames.WINDOW_RESIZE,
      onResize
    );
    return () => {
      EventService.getInstance().unregister(
        EventNames.WINDOW_RESIZE,
        onResize
      );
    };
  }, []);

  const currentFilterBoardListOptions = useSelector(
    state => state.room.currentFilterBoardListOptions
  );
  const currentSortBoardListOptions = useSelector(
    state => state.room.currentSortBoardListOptions
  );

  //dom
  const [value, setValue] = useState('1');
  const [chatOpen, setChatOpen] = useState(false);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    let filteredBoardList = boardList;

    // Filter the board list
    if (currentFilterBoardListOptions === 'ownedByMe') {
      filteredBoardList = filteredBoardList.filter(
        item => item.createdBy === store.getState().user.userInfo.userId
      );
    } else if (currentFilterBoardListOptions === 'notOwnedByMe') {
      filteredBoardList = filteredBoardList.filter(
        item => item.createdBy !== store.getState().user.userInfo.userId
      );
    }
    filteredBoardList = filteredBoardList.filter(
      item => item.deletedInfo === undefined
    );

    // Sort the filtered board list
    if (currentSortBoardListOptions === 'lastCreated') {
      filteredBoardList.sort((v1, v2) => v2.timestamp - v1.timestamp);
    } else {
      filteredBoardList.sort((v1, v2) => v2.lastUpdateTime - v1.lastUpdateTime);
    }

    dispatch(handleSetCurrentBoardList(filteredBoardList));
  }, []);

  useEffect(() => {
    if (!roomId) return;
    dispatch(handleSetRoomId(roomId));
  }, [roomId]);

  return (
    <Box>
      <RoomHeader />
      {keywords && (
        <ThemeProvider theme={lightTheme}>
          <TabContext value={value}>
            <TabList onChange={handleChange} sx={{
              flexGrow: 1,
              paddingLeft: theme.spacing(3),
              paddingRight: theme.spacing(3),
              marginBottom: '-120px',
              marginTop: '120px',
              fontSize: '12px'
            }}>
              <Tab
                label={
                  boardList.length > 1 && i18n.language === 'en'
                    ? boardList.length +
                    t('pages.listPage.roomSettings.boards') +
                    's'
                    : boardList.length + t('pages.listPage.roomSettings.boards')
                }
                value="1"
              />
              {!inRoom && (
                <Tab
                  label={
                    roomList.length > 1 && i18n.language === 'en'
                      ? roomList.length +
                      t('pages.listPage.roomSettings.rooms') +
                      's'
                      : roomList.length + t('pages.listPage.roomSettings.rooms')
                  }
                  value="2"
                />
              )}
            </TabList>
            <TabPanel sx={{ p: 0 }} value="1">
              <Box
                sx={{
                  flexGrow: 1,
                  overflowY: 'scroll',
                  height: window.innerHeight
                }}
              >
                {boardList.length > 0 && (
                  <Box sx={{
                    flexGrow: 1,
                    paddingLeft: (theme) => theme.spacing(3),
                    paddingRight: (theme) => theme.spacing(3),
                    overflowX: 'hidden',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: '1rem',
                  }} id="boardContent">
                    {boardList.map(d => (
                      <LazyLoad key={d._id} offset={100} once>
                        <Board
                          board={d}
                          isAll={true}
                          key={d._id}
                          type="roomPageBoard"
                        />
                      </LazyLoad>
                    ))}
                  </Box>
                )}
                {boardList.length == 0 && (
                  <div
                    id="boardContent"
                    style={{
                      width: '100%',
                      textAlign: 'center',
                      marginTop: '150px',
                      fontSize: '16px',
                      height: window.innerHeight
                    }}
                  >
                    {t('pages.listPage.roomSettings.noBoard')}
                  </div>
                )}
              </Box>
            </TabPanel>
            {!inRoom && (
              <TabPanel sx={{ p: 0 }} value="2">
                {roomList.length > 0 && (
                  <Box sx={{
                    flexGrow: 1,
                    paddingLeft: (theme) => theme.spacing(3),
                    paddingRight: (theme) => theme.spacing(3),
                    overflowX: 'hidden',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: '1rem',
                  }} id="boardContent">
                    {roomList.map(d => (
                      <RoomCard room={d} key={d._id} />
                    ))}
                  </Box>
                )}
                {roomList.length == 0 && (
                  <div
                    id="boardContent"
                    style={{
                      width: '100%',
                      textAlign: 'center',
                      marginTop: '150px',
                      fontSize: '16px'
                    }}
                  >
                    {t('pages.listPage.roomSettings.noRoom')}
                  </div>
                )}
              </TabPanel>
            )}
          </TabContext>
        </ThemeProvider>
      )}
      {!keywords && (
        <Box
          style={{ overflowY: 'scroll', height: window.innerHeight }}
          id="boardContent"
        >
          <Box sx={{
            flexGrow: 1,
            paddingLeft: (theme) => theme.spacing(3),
            paddingRight: (theme) => theme.spacing(3),
            overflowX: 'hidden',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1rem',
          }}>
            <BoardCreateBoardModal roomData={roomInfo} />
            {boardList &&
              boardList.length > 0 &&
              boardList.map(d => (
                <LazyLoad key={d._id} offset={100} once>
                  <Board
                    board={d}
                    isAll={false}
                    key={d._id}
                    type="roomPageBoard"
                  />
                </LazyLoad>
              ))}
          </Box>
        </Box>
      )}
      <Snackbar
        open={isFetching}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        message={'Loading Data...'}
      />
     
    </Box>
  );
}

export default RoomPage;
