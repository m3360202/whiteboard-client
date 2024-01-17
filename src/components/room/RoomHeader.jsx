//** Import react
import React, { useState, useEffect } from 'react';

import { styled } from '@mui/material/styles';

//** Import i18n
import { useTranslation } from 'react-i18next';

//** Import Redux kit
import {
  handleSetInRoom,
  handleSetCurrentSortBoardListOptions,
  handleSetCurrentFilterBoardListOptions
} from '../../store/room';
import { handleSetCurrentBoardList } from '../../store/boardList';
import { useSelector, useDispatch } from 'react-redux';
import store, { RootState } from '../../store';

//** Import Mui
import { useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Tooltip, Switch } from '@mui/material';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import useMediaQuery from '@mui/material/useMediaQuery';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';

//** Imort components
import MemberList from './MemberList';
import RoomSettings from './RoomSettings';
import AutoSearchBoard from '../search/AutoSearchBoard';
import UserMenu from '../user/UserMenu';
import OrganizationInviteMembersModal from '../org/OrganizationInviteMembersModal';
import DashBoardRoomTutorials from '../onBoarding/DashBoardRoomTutorials';
import { useLoadRoomInfoQuery } from '../../redux/RoomAPISlice';
import { useHistory } from 'react-router-dom';
//** Import others
import {UserService} from '../../services';

import AppBarHeader from '../common/AppBarHeader';


const drawerWidth = 240;

export default function RoomHeader() {
  //use
  const dispatch = useDispatch();
  const theme = useTheme();

  const { t } = useTranslation();
  const roomId = useSelector((state) => state.room.roomId);
  //search
  const keywords = useSelector((state) => state.boardList.keyword);
  const { data: loadRoomInfo } = useLoadRoomInfoQuery(roomId);
  //room
  const [roomData, setRoomData] = useState({});

  const history = useHistory();
  
  useEffect(() => {
    setRoomData(loadRoomInfo?.roomInfo||{});
  }, [loadRoomInfo]);

  //org
  const orgData = useSelector((state) => state.org.orgInfo);
  const isOrgAdmin = useSelector((state) => state.org.orgInfo.role) !== 'member' ? true : false;

  //board
  const originBoardList = useSelector((state) => state.boardList.boardList);

  //dom & view
  const inRoom = useSelector((state) => state.room.inRoom);
  const smallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [boardFilterMenuOpen, setBoardFilterMenuOpen] = useState(false);
  const [boardSortMenuOpen, setBoardSortMenuOpen] = useState(false);
  const [boardFilterMenuAnchorEl, setBoardFilterMenuAnchorEl] = useState(null);
  const [boardSortMenuAnchorEl, setBoardSortMenuAnchorEl] = useState(null);
  const [boardFilterMenuBtnText, setBoardFilterMenuBtnText] = useState(
    t('pages.listPage.boardFilter.ownedByAnyone'),
  );
  const [boardSortMenuBtnText, setBoardSortMenuBtnText] = useState(
    t('pages.listPage.boardFilter.lastEdited'),
  );

  useEffect(() => {
    document.title = roomData && roomData.name ? roomData.name : '';
  }, [roomData]);

  // useEffect(() => {
  //   // 暂未使用
  //   initialBoardFilterMenuBtnText();
  //   initialBoardSortMenuBtnText();
  // });

  const logout = () => {
    UserService.getInstance().logout();
    // history.push( '/signin');
    window.location.href = '/signin';
  };

  const initialBoardFilterMenuBtnText = () => {
    if (!localStorage.getItem('filterBoardInfo'))
      return setBoardFilterMenuBtnText(
        t('pages.listPage.boardFilter.ownedByAnyone'),
      );

    let filterBoardInfo = JSON.parse(localStorage.getItem('filterBoardInfo'));
    if (filterBoardInfo.userId !== localStorage.getItem('userId'))
      return;
    dispatch(handleSetCurrentFilterBoardListOptions(filterBoardInfo.filterOptions));
    setBoardFilterMenuBtnText(
      t('pages.listPage.boardFilter.' + filterBoardInfo.filterOptions),
    );
  };

  const initialBoardSortMenuBtnText = () => {
    if (!localStorage.getItem('filterBoardInfo'))
      return setBoardSortMenuBtnText(
        t('pages.listPage.boardFilter.lastEdited'),
      );

    let filterBoardInfo = JSON.parse(localStorage.getItem('filterBoardInfo'));
    if (filterBoardInfo.userId !== localStorage.getItem('userId'))
      return;
    dispatch(handleSetCurrentSortBoardListOptions(filterBoardInfo.sortOptions));
    setBoardSortMenuBtnText(
      t('pages.listPage.boardFilter.' + filterBoardInfo.sortOptions),
    );
  };

  const handleClickMoreMenu = (event) => {
    if (!moreMenuOpen) {
      setMoreMenuOpen(true);
    } else {
      setMoreMenuOpen(false);
    }
  };

  const handleClose = () => {
    setMoreMenuOpen(false);
  };

  const handleOrganizationInviteMembersModalDOM = () => {
    if (!isOrgAdmin) return null;
    return <OrganizationInviteMembersModal />;
  };
  const handleClickFilterBoardOwner = (event) => {
    setBoardFilterMenuOpen(true);
    setBoardFilterMenuAnchorEl(event.currentTarget);
  };
  const changeSearchInRoom = () => {
    if (inRoom) {
      dispatch(handleSetInRoom(false))
    } else {
      dispatch(handleSetInRoom(true))
    }
  };
  const handleClickSortBoardOwner = (event) => {
    setBoardSortMenuOpen(true);
    setBoardSortMenuAnchorEl(event.currentTarget);
  };

  const handleCloseBoardFilterMenu = () => {
    setBoardFilterMenuOpen(false);
    setBoardFilterMenuAnchorEl(null);
  };

  const handleCloseBoardSortMenu = () => {
    setBoardSortMenuOpen(false);
    setBoardSortMenuAnchorEl(null);
  };

  // BoardFilter
  const handleClickBoardFilterOptions = (event) => {
    handleCloseBoardFilterMenu();
    let list = [];
    if (event.currentTarget.id === 'ownedByMe') {
      list = originBoardList.filter(
        (item) => item.createdBy === store.getState().user.userInfo.userId,
      );
      dispatch(handleSetCurrentBoardList(list));
    } else if (event.currentTarget.id === 'notOwnedByMe') {
      list = originBoardList.filter(
        (item) => item.createdBy !== store.getState().user.userInfo.userId,
      );
      dispatch(handleSetCurrentBoardList(list));
    } else {
      dispatch(handleSetCurrentBoardList(originBoardList));
    }
    setBoardFilterMenuBtnText(event.currentTarget.innerText);
  };

  //BoardSort
  const handleClickBoardSortOptions = (event) => {
    if (event.currentTarget.id === 'lastEdited') {
      dispatch(handleSetCurrentBoardList(getNewBoardListBySort('lastEdited', originBoardList)));
    }
    if (event.currentTarget.id === 'lastCreated') {
      dispatch(handleSetCurrentBoardList(getNewBoardListBySort('lastCreated', originBoardList)));
    }
    handleCloseBoardSortMenu();
    setBoardSortMenuBtnText(event.currentTarget.innerText);
  };

  const getNewBoardListBySort = (type, list) => {
    let newList = [];
    list.map((item) => {
      newList.push(item);
    });
    if (type === 'lastEdited') {
      newList.sort((a, b) => {
        return b.lastUpdateTime - a.lastUpdateTime;
      });
    }
    if (type === 'lastCreated') {
      newList.sort((a, b) => {
        return b.createtime - a.createtime;
      });
    }
    return newList;
  }

  const id = moreMenuOpen ? 'moremenuRoomTouch-popover' : undefined;

  const handleCreateMoreMenuIconDOM = () => {
    if (!isOrgAdmin) return null;
    return (
      <MoreVertOutlinedIcon
        style={{
          color: moreMenuOpen ? '#F21d6B' : 'rgba(0,0,0,0.54)',
        }}
      />
    );
  };

  return (
    <Box  sx={{display:'flex', flexDirection:'column', justifyContent:'stretch', }}>
      <AppBarHeader />
      <Toolbar sx={{display:'flex', flexDirection:'row', justifyContent: 'space-between', alignItems:'center', height: '50px'}}>
        <Typography  variant="h3">
          {keywords
            ? t('pages.listPage.boardFilter.searchResult')
            : roomData.name}
        </Typography>

        <Box sx={{display:'flex', flexDirection:'row', flexWrap:'nowrap', '.paper':{marginTop: '4px',
    background: '#FFFFFF',
    boxShadow: '0px 1px 3px 2px rgba(222, 222, 222, 0.64)'},
    
    '.boardOwnerBtn': {
      marginLeft: '25px',
      fontFamily: 'Inter',
      fontStyle: 'normal',
      fontWeight: 400,
      fontSize: '14px',
      lineHeight: '20px',
      padding: 0,
      color: 'rgba(35, 41, 48, 0.65)',
      backgroundColor: 'transparent',
      textTransform: 'unset'}
    }}>
        {!keywords && (
          <MemberList roomData={roomData}   />
        )}
        {/* {!keywords && !smallScreen && (
          <Button
            className={'boardOwnerBtn'}
            endIcon={<DashboardArrow />}
            onClick={handleClickFilterBoardOwner}
            variant="text"
          >
            {boardFilterMenuBtnText}
          </Button>
        )} */}
        {!keywords && (
          <Menu
            anchorEl={boardFilterMenuAnchorEl}
            classes={{ paper: 'paper'}}
            onClose={handleCloseBoardFilterMenu}
            open={boardFilterMenuOpen}
          >
            <MenuItem
              id="ownedByAnyone"
              onClick={handleClickBoardFilterOptions}
            >
              {t('pages.listPage.boardFilter.ownedByAnyone')}
            </MenuItem>
            <MenuItem id="ownedByMe" onClick={handleClickBoardFilterOptions}>
              {t('pages.listPage.boardFilter.ownedByMe')}
            </MenuItem>
            <MenuItem id="notOwnedByMe" onClick={handleClickBoardFilterOptions}>
              {t('pages.listPage.boardFilter.notOwnedByMe')}
            </MenuItem>
          </Menu>
        )}
        {/* {!keywords && !smallScreen && (
          <Button
            className={'boardOwnerBtn'}
            endIcon={<DashboardArrow />}
            onClick={handleClickSortBoardOwner}
            variant="text"
          >
            {boardSortMenuBtnText}
          </Button>
        )} */}
        {!keywords && (
          <Menu
            anchorEl={boardSortMenuAnchorEl}
            classes={{ paper: 'paper' }}
            onClose={handleCloseBoardSortMenu}
            open={boardSortMenuOpen}
          >
            <MenuItem id="lastEdited" onClick={handleClickBoardSortOptions}>
              {t('pages.listPage.boardFilter.lastEdited')}
            </MenuItem>
            <MenuItem id="lastOpen" onClick={handleClickBoardSortOptions}>
              {t('pages.listPage.boardFilter.lastOpen')}
            </MenuItem>
            <MenuItem id="lastCreated" onClick={handleClickBoardSortOptions}>
              {t('pages.listPage.boardFilter.lastCreated')}
            </MenuItem>
          </Menu>
        )}
        {!keywords && <RoomSettings sx={{ padding: '10px' }} />}
        </Box>
     
      </Toolbar>
      <DashBoardRoomTutorials />
    </Box>
  );
}
