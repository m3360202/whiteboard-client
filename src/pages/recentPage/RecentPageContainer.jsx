//** Import react
import React, { useRef, useState, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';

//** Import i18n
import { useTranslation } from 'react-i18next';

//** Import Redux kit
import store, { RootState } from '../../store';
import { handleSetUserInfo } from '../../store/user';
import {
  handleSetBoardList,
  handleSetCurrentBoardList,
  handleSetKeyword
} from '../../store/boardList';
import { handleInitRoom } from '../../store/room';
import { useSelector, useDispatch } from 'react-redux';
import {
  useGetOrgListQuery,
  useGetRoomListByOrgIdQuery
} from '../../redux/OrgAPISlice';
import { useGetLoadRecentBoardListQuery } from '../../redux/RoomAPISlice';
import Snackbar from '@mui/material/Snackbar';

//**Import Mui
import { styled } from '@mui/material/styles';
import currentTheme from '../../mui/theme/lightTheme';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { ThemeProvider, Box, Menu, MenuItem } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';

//* i18n */
import i18n from '../../i18n';

//**Import Services
import { UserService } from '../../services';

//** Imort components
import BoardCreateBoardModal from '../../components/board/BoardCreateBoardModal';
import { Board } from '../../components/board/Board';
import { RoomCard } from '../../components/room/RoomCard';
import RoomLeftDrawer from '../../components/room/RoomLeftDrawer';
import UserMenu from '../../components/user/UserMenu';
import AutoSearchBoard from '../../components/search/AutoSearchBoard';
import OrganizationInviteMembersModal from '../../components/org/OrganizationInviteMembersModal';
import DashBoardTeamTutorials from '../../components/onBoarding/DashBoardTeamTutorials';
import ExploreBoardXTemplates from '../../components/recentPageTemplates/ExploreBoardXTemplates';
import MenuChatAITouch from '../../components/boardChatAI/MobileChatAI/MenuChatAITouch';
import DesktopChatAI from '../../components/boardChatAI/ChatAI/DesktopChatAI';
import AppBarHeader from 'components/common/AppBarHeader';
 

const drawerWidth = 240;
const winHeight = window.innerHeight;

export default function RecentPage() {
  //use
  const dispatch = useDispatch();
  const theme = useTheme();

  const history = useHistory();
  const { t } = useTranslation();
  const contentRef = useRef();
  const [startIndex, setStartIndex] = useState(0);
  const [limit, setLimit] = useState(25);
  const orgId = useSelector((state) => state.org.orgInfo.orgId);

  //user
  const userInfo = useSelector((state) => state.user.userInfo);

  //org
  const isOrgAdmin =
    useSelector((state) => state.org.orgInfo.role) !== 'member'
      ? true
      : false;
  const orgInfo = useSelector((state) => state.org.orgInfo);

  //room
  const { data: roomList = [] } = useGetRoomListByOrgIdQuery(orgId);

  //search
  const keywords = useSelector((state) => state.boardList.keyword);

  const [shouldFetch, setShouldFetch] = useState(true);

  const {
    data: boardList = [],
    isLoading,
    isFetching
  } = useGetLoadRecentBoardListQuery({ orgId, keywords, startIndex, limit, user: userInfo },
    {
      enabled: shouldFetch
    });
  const originBoardList = boardList;

  //mobile
  const [value, setValue] = useState('1');
  const smallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  //dom & control
  const [openMenu, setOpenMenu] = useState(false);
  const [boardFilterMenuOpen, setBoardFilterMenuOpen] = useState(false);
  const [boardSortMenuOpen, setBoardSortMenuOpen] = useState(false);
  const [boardFilterMenuAnchorEl, setBoardFilterMenuAnchorEl] = useState(null);
  const [boardSortMenuAnchorEl, setBoardSortMenuAnchorEl] = useState(null);
  const [boardSortMenuBtnText, setBoardSortMenuBtnText] = useState(
    t('pages.listPage.boardFilter.lastEdited')
  );
  const [boardFilterMenuBtnText, setBoardFilterMenuBtnText] = useState(
    t('pages.listPage.boardFilter.ownedByAnyone')
  );
  //** Effect events
  useEffect(() => {
    UserService.getInstance(); //initialize user service

    dispatch(handleInitRoom(''));
    document.title = t('pages.listPage.recentBoardsTagTitle');
  }, []);

  useEffect(() => {
    if (keywords.length !== 0) {
      setShouldFetch(true);
    }
  }, [keywords]);

  useEffect(() => {
    if (isLoading || isFetching) {
      setShouldFetch(false);
    }
  }, [isLoading, isFetching]);

  useEffect(() => {
    if (!orgInfo?.orgId) return;

    setStartIndex(0);
    setLimit(25);
  }, [orgInfo]);

  useEffect(() => {
    setStartIndex(0);
    setLimit(25);

  }, [keywords]);

  const logout = () => {
    UserService.getInstance().logout();
    window.location.href = '/signin';
  };

  // undone
  const handleScroll = () => {
    if (contentRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = contentRef.current;

      if (scrollHeight - scrollTop - clientHeight < 1) {
        // useGetLoadRecentBoardListQuery({
        //   orgId: orgInfo.orgId,
        //   startIndex: originBoardList.length + 1,
        //   limit: 25
        // });
        setStartIndex(originBoardList.length + 1);
        // setLimit(30);
        // if (err) return Boardx.Util.Msg.info(err.message);
      }
    }
  };

  const handleClickFilterBoardOwner = event => {
    setBoardFilterMenuOpen(true);
    setBoardFilterMenuAnchorEl(event.currentTarget);
  };

  const handleClickSortBoardOwner = event => {
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
  const handleClickBoardFilterOptions = event => {
    handleCloseBoardFilterMenu();
    let list = [];
    if (event.currentTarget.id === 'ownedByMe') {
      list = originBoardList?.filter(item => item.createdBy === store.getState().user.userInfo.userId);
      dispatch(handleSetCurrentBoardList(list));
      setBoardFilterMenuBtnText(
        t('pages.listPage.boardFilter.ownedByMe')
      );
    } else if (event.currentTarget.id === 'notOwnedByMe') {
      list = originBoardList?.filter(item => item.createdBy !== store.getState().user.userInfo.userId);
      dispatch(handleSetCurrentBoardList(list));
      setBoardFilterMenuBtnText(
        t('pages.listPage.boardFilter.notOwnedByMe')
      );
    } else {
      setBoardFilterMenuBtnText(
        t('pages.listPage.boardFilter.ownedByAnyone')
      );
      dispatch(handleSetCurrentBoardList(originBoardList));
    }
  };

  //BoardSort
  const handleClickBoardSortOptions = event => {
    if (event.currentTarget.id === 'lastEdited') {
      dispatch(
        handleSetCurrentBoardList(
          getNewBoardListBySort('lastEdited', originBoardList)
        )
      );
    }
    if (event.currentTarget.id === 'lastCreated') {
      dispatch(
        handleSetCurrentBoardList(
          getNewBoardListBySort('lastCreated', originBoardList)
        )
      );
    }
    handleCloseBoardSortMenu();
    setBoardSortMenuBtnText(event.currentTarget.innerText);
  };

  const getNewBoardListBySort = (type, list) => {
    let newList = [];
    list.map(item => {
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
  };

  const handleIsMobileAndIsBoard = () => {
    if (boardList.length !== 0) {
      return boardList.map(d => <Board board={d} key={d._id} type="recentPageBoard" />);
    }
    else {
      return null;
    }
  };

  const handleBoardHeaderTitleDOM = () => {
    return (
      <>
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
            {keywords
              ? t('pages.listPage.boardFilter.searchResult')
              : t('pages.listPage.recentBoards')}
          </Typography>
          {!keywords ? (
            <BetaContentTooltip
              title={t('components.board.betaContent')}
              placement="bottom-start"
            >
              <BetaTypography>BETA</BetaTypography>
            </BetaContentTooltip>
          ) : null}
        </Box>
      </>
    );
  };

  const handleIsCreateOrgSettingsDOM = () => {
    return (
      <>
        <div style={{
          [theme.breakpoints.up('sm')]: {
            width: `calc(100% - ${drawerWidth}px)`,
            marginLeft: drawerWidth
          },
          flexGrow: 1,
          paddingLeft: theme.spacing(3),
          paddingRight: theme.spacing(3),
          overflowX: 'hidden',
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fill, minmax(var(--auto-grid-min-size), 1fr))',
          gridGap: '1rem',
          '--auto-grid-min-size': '300px',
 
        }} id="boardContent">
          {!keywords && (<BoardCreateBoardModal roomData={roomList} />)}

          {handleIsMobileAndIsBoard()}
          <Snackbar
            open={isFetching}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            message={'Loading Boards...'}
          />
        </div>

      </>
    );
  };

  const menuDom = () => {
    if (!keywords) {
      return (
        <>
          <Menu
            anchorEl={boardFilterMenuAnchorEl}
            sx={{
              paper: {
                marginTop: '4px',
                background: '#FFFFFF',
                boxShadow: '0px 1px 3px 2px rgba(222, 222, 222, 0.64)'
              }
            }}
            onClose={handleCloseBoardFilterMenu}
            open={boardFilterMenuOpen}
            style={{ display: keywords ? 'none' : 'block' }}
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
          <Menu
            anchorEl={boardSortMenuAnchorEl}
            sx={{
              paper: {
                marginTop: '4px',
                background: '#FFFFFF',
                boxShadow: '0px 1px 3px 2px rgba(222, 222, 222, 0.64)'
              }
            }}
            onClose={handleCloseBoardSortMenu}
            open={boardSortMenuOpen}
            style={{ display: keywords ? 'none' : 'block' }}
          >
            <MenuItem id="lastEdited" onClick={handleClickBoardSortOptions}>
              {t('pages.listPage.boardFilter.lastEdited')}
            </MenuItem>
            <MenuItem id="lastCreated" onClick={handleClickBoardSortOptions}>
              {t('pages.listPage.boardFilter.lastCreated')}
            </MenuItem>
          </Menu>
        </>
      );
    }
  };
  if (!boardList) return null;

  return (
    <Box theme={currentTheme}>
      <Box sx={{ height: '100%', width: '100%', display:'flex', flexDirection:'row' }}>
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
            <Toolbar sx={{
              background: 'rgba(255,255,255,0.85)',
              backdropFilter: 'blur(16px)',
              width: '100%',
              justifyContent: 'space-between',
              zIndex: 1001
            }}>
              {handleBoardHeaderTitleDOM()}
            </Toolbar>
          </Box>
          <Box
            id="content2"
            onScroll={handleScroll}
            ref={contentRef}
            style={{
              overflowY: 'scroll',
              height: '100vh'
            }}
          >


            {handleIsCreateOrgSettingsDOM()}
          </Box>
    
        </Box>
        {menuDom()}
      </Box>
      <DashBoardTeamTutorials />
    </Box>
  );
}

const BetaContentTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 230,
    width: '230px',
    padding: '10px',
    margin: '8px 0px !important',
    boxSizing: 'border-box',
    fontSize: '0.875rem',
    fontWeight: 400,
    fontStyle: 'normal',
    lineHeight: '20px'
  }
});

const BetaTypography = styled(Typography)({
  margin: '0px 22px 0px 8px',
  fontSize: '0.75rem',
  fontWeight: 700,
  width: '36px',
  height: '15px',
  backgroundColor: '#65E9E9',
  borderRadius: '2px',
  color: '#FFFFFF',
  textAlign: 'center',
  lineHeight: '15px',
  cursor: 'pointer'
});
