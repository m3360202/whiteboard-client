//** Import react
import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import { useHistory, useParams } from 'react-router-dom';

//** Import i18n
import { useTranslation } from 'react-i18next';

//** Import Redux toolkit
import store, { RootState } from '../../store';
import { useSelector, useDispatch } from 'react-redux';
import { changeMode } from '../../store/mode';
import { handleSetBoardVisitorTutorial2, handleSetWidgetMenuList } from '../../store/board';
import { handleAddOnlineUser } from '../../store/system';
import { handleOpenChatUI } from '../../store/sideBar';
import { StyledEngineProvider } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import { Tooltip } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import Popover from '@mui/material/Popover';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import SyncService from '../../services/SyncService';
import clsx from 'clsx';

import { useTheme } from '@mui/material/styles';

//** Import components
import HeaderShareBoard from './shareBoardMenu/HeaderShareBoard';
import BoardTimerIcon from './timer/BoardTimerIcon';
import MoreMenu from './moreMenu/MoreMenu';
import HeaderBoardTitle from './boardTitle/HeaderBoardTitle';
import UserList from '../userList/UseList';
import FollowMeHeader from './followMe/FollowMeHeader';

import HeaderSlides from './slides/HeaderSlides';
import HeaderGoBackIcon from '../../mui/icons/HeaderGoBackIcon';

//** Import services
import {
  SysService,
  BoardService,
  UserService,
  EventService,
} from '../../services';
//** events
import EventNames from '../../util/EventNames';

const StyledBox = styled(Box)((
  { theme }
) => ({
  color: 'rgba(0,0,0,0.54)',
  cursor: 'pointer'
}));

const ToolbarStyled = styled(Toolbar)(({ theme }) => ({
  width: 'auto',
  height: '40px',
  paddingLeft: '0px !important',
  paddingRight: '0px !important',
  minHeight: '44px !important',
  backgroundColor: '#FFFFFF',
  boxShadow: '0px 1px 3px 2px #00000014',
  borderRadius: '8px',
  position: 'fixed',
  top: 15,
  left: 15
}));

const AppBarStyled = styled(AppBar)(({ theme }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  minHeight: 44,
  width: 140,
  height: 44,
  backgroundColor: '#FFFFFF',
  boxShadow: '0px 1px 3px 2px #00000014',
  borderRadius: '8px',
  marginRight: 0,
  position: 'unset'
}));

const ButtonSignIn = styled(Button)(({ theme }) => ({
  height: 30,
  width: 70,
  marginLeft: 12,
  marginRight: 12,
  whiteSpace: 'nowrap',
  textAlign: 'center',
  '&:hover': {
    backgroundColor: '#0050C3'
  }
}));






const HeaderStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  position: 'fixed',
  top: '15px',
  right: '15px'
}));

const LineDiv = styled('div')(({ theme }) => ({
  borderLeft: '0.5px solid rgba(0, 0, 0, 0.16)',
  height: '24px',
  top: '11px',
  position: 'relative',
  marginLeft: '3px'
}));

export default function Header() {
  //use

  const history = useHistory();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const modeType = useSelector((state: RootState) => state.mode.type);
  //slide dom
  const marginRightHeaderAppBar = useSelector(
    (state: RootState) => state.sideBar.marginRightHeaderAppBar
  );
  const selectTimmer = useSelector((state: RootState) => state.timer.selectTimer);
  //dom
  const [selectMore, setSelectMore] = useState(false);
  let getBoardVisitorTutorial2 = useSelector((state: RootState) => state.board.boardVisitorTutorial2);
  const openTutorial = getBoardVisitorTutorial2 === 'selected' ? true : false;
  const hideHeader = useSelector((state: RootState) => state.board.hideHeader);
  const boardId = useSelector((state: RootState) => state.board.boardId);

  const undoAvailable = useSelector((state: RootState) => !state.board.undoAvailable);
  const redoAvailable = useSelector((state: RootState) => !state.board.redoAvailable);
  const undoBtnDisable = undoAvailable ? true : false;
  const redoBtnDisable = redoAvailable ? true : false;

  const undoColor = undoAvailable ? 'rgba(0,0,0,0.54)' : 'rgba(0,0,0,0.3)';
  const redoColor = redoAvailable ? 'rgba(0,0,0,0.54)' : 'rgba(0,0,0,0.3)';

  const doneTutorial = () => {
    dispatch(handleSetBoardVisitorTutorial2('unselected'));
  };

  const handleGoBack = async (e) => {
    const board = store.getState().board.board;
    document.body.style.overflow = 'visible';
    dispatch(handleOpenChatUI(false));
    store.dispatch(handleAddOnlineUser(false));
    SyncService.getInstance().closeConnection();
    e.preventDefault();
    BoardService.getInstance().captureThumbnail().then(async (thumbnail) => {
      if (thumbnail) {
        await canvas.updateWhiteboardThumbnail();
      }
      localStorage.setItem('is_onboard', 'false');

      store.dispatch(handleSetWidgetMenuList([]));

      // BoardService.getInstance().updateCurrentBoard({
      //   lastUpdateTime: Date.now()
      // });

      if (modeType !== 'default') {
        if (canvas && canvas.freeDrawingBrush) {
          canvas.freeDrawingBrush = null;
        }

        dispatch(changeMode('default'));
      }
      BoardService.getInstance().clearResourceAndEvents();
      BoardService.getInstance().closeBoard();


      let pageFrom = localStorage.getItem('pageFrom');
      if (pageFrom) {
        if (pageFrom === 'recent') {
          localStorage.removeItem('pageFrom');
          history.push('/recent');
          return;
        }
        if (pageFrom === 'teamsetting') {
          localStorage.removeItem('pageFrom');
          history.push('/teamsetting');
          return;
        }
        if (
          pageFrom === 'room' &&
          board &&
          board.roomId &&
          board.roomId !== 'none'
        ) {
          localStorage.removeItem('pageFrom');
          history.push('/room/' + board.roomId);
        } else {
          history.push('/recent');
        }
      } else {
        history.push('/recent');
      }

    })

  };

  const handleUndo = () => {
    canvas.undo();
  };

  const handleRedo = () => {
    canvas.redo();
  };



  const handleGoBackBtnDOM = () => {

    return (
      <Box style={{ marginLeft: 12 }}>
        <Tooltip
          arrow
          placement="bottom"
          title={t('board.header.goBack')}
        >
          <IconButton
            aria-label="open drawer"
            sx={{
              position: 'absolute',
              color: 'rgba(0,0,0,0.54)',
              cursor: 'pointer',
              height: 44,
              '&:hover': {
                borderRadius: 0
              }
            }}
            color="inherit"
            edge="start"
            onClick={handleGoBack}
          >
            <HeaderGoBackIcon />
          </IconButton>
        </Tooltip>
      </Box>
    );
  }



  const onResize = () => {
    let window_width =
      window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth;
    let toolbarBoardWidth = document.getElementById(
      'toolbarBoardTopleft'
    ).clientWidth;
    let headerAppBarWidth =
      document.getElementById('header_appBar').clientWidth;
    if (canvas) {
      canvas.setWidth(window_width);
      canvas.setHeight(window.innerHeight);
    }
    if (window_width < toolbarBoardWidth + headerAppBarWidth + 46) {
      document.getElementById('header_appBar').style.left = `${toolbarBoardWidth + 22
        }px`;
    } else {
      document.getElementById('header_appBar').style.left = 'unset';
    }
  };

  useEffect(() => {
    EventService.getInstance().register(EventNames.WINDOW_RESIZE, onResize);
    return () => {
      EventService.getInstance().unregister(EventNames.WINDOW_RESIZE, onResize);
    }
  }, []);

  // const windowChangeHeaderMenuPosition = () => {
  //   window.onresize = () => onResize();
  // };

  const theme = useTheme();

  return (
    <div>
      <Box style={{ display: hideHeader ? 'none' : 'block' }}>
        <ToolbarStyled
          id="toolbarBoardTopleft"
        >
          <Box sx={{ display: 'flex', flexDirection: 'row' }}>
            {handleGoBackBtnDOM()}
            <HeaderBoardTitle />
            <Box>
              <LineDiv />
            </Box>
            <StyledBox >
              <Tooltip arrow placement="bottom" title={t('board.header.undo')}>
                <IconButton
                sx={{     position: 'relative',
                marginLeft: 0,
                color: 'rgba(0,0,0,0.54)',
                cursor: 'pointer',
                '&:hover': {
                  color: '#f21d6b !important'
                }}}
                  className={
                    (
                      undoBtnDisable ? 'btnDisable' : 'btnEnable')
                  }
                  color="inherit"
                  edge="start"
                  onClick={handleUndo}
                  style={{ color: undoColor, margin: '0 8px 0 0px' }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    strokeWidth="1"
                    className="menuImgSize"
                  >
                    <g transform="matrix(0.8333333333333334,0,0,0.8333333333333334,0,0)">
                      <path
                        d="M0.75 0.748L0.75 8.248 8.25 8.248"
                        fill="none"
                        stroke="#000000"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M12,23.248a11.25,11.25,0,1,0-10.6-15"
                        fill="none"
                        stroke="#000000"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                      />
                    </g>
                  </svg>
                </IconButton>
              </Tooltip>
            </StyledBox>
            <StyledBox >
              <Tooltip arrow placement="bottom" title={t('board.header.redo')}>
                <IconButton
                sx={{    position: 'relative',
                marginLeft: 0,
                color: 'rgba(0,0,0,0.54)',
                cursor: 'pointer',
                '&:hover': {
                  color: '#f21d6b !important'
                }}}
                  className={
                    (
                      redoBtnDisable ? 'btnDisable' : 'btnEnable')
                  }
                  color="inherit"
                  edge="start"
                  onClick={handleRedo}
                  style={{ color: redoColor }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    strokeWidth="1"
                    className="menuImgSize"
                  >
                    <g transform="matrix(0.8333333333333334,0,0,0.8333333333333334,0,0)">
                      <path
                        d="M23.25 0.748L23.25 8.248 15.75 8.248"
                        fill="none"
                        stroke="#000000"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M12,23.248a11.25,11.25,0,1,1,10.6-15"
                        fill="none"
                        stroke="#000000"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                      />
                    </g>
                  </svg>
                </IconButton>
              </Tooltip>
              </StyledBox >
          </Box>
        </ToolbarStyled>
        <HeaderStyle
          id="headerAppBar"
          style={{ right: marginRightHeaderAppBar }}
          sx={{'.sectionDesktop':{  display: 'flex',
          alignItems: 'center',
          padding: 0,
          [theme.breakpoints.up('sm')]: {
            display: 'flex'
          }}, '.sectionShare':{justifyContent: 'space-between',
          alignContent: 'center',
          height: 50,
          padding: '0 8px'}}}
     
        >
          <AppBarStyled
            style={{ width: 'unset', minWidth: '140px', marginRight: 12 }}
            id="appBar"
          
      
          >
            <div className={'sectionDesktop' + ' sectionShare'}>
              {/* <Conference></Conference> */}
              <StyledBox >
                <UserList />
                </StyledBox >

              {(
           <StyledBox >
                  <HeaderShareBoard />
                  </StyledBox >
              )}
            </div>
          </AppBarStyled>

          <AppBarStyled
            id="header_appBar"
            style={{
              width: 195,
              zIndex: '666'
            }}
          >
            <div className={'sectionDesktop'}>
              <FollowMeHeader />

              <StyledBox
                className={
                  selectMore
                    ? ' Mui-selected'
                    : ''
                }
              >
                <BoardTimerIcon />
              </StyledBox>
              {
                <StyledBox>
                  <HeaderSlides />
                </StyledBox>
              }
              {/* <<StyledBox
                className={
                  selectMore
                    ?  ' Mui-selected'
                    : ''
                }
              >
                <MarkdownIcon />
              </StyledBox> */}

              <StyledBox
                className={
                  selectMore
                    ? ' Mui-selected'
                    : ''
                }
              >
                <MoreMenu setSelectMore={setSelectMore} />
              </StyledBox>
            </div>
            {/* <div
                style={{
                  width: 170,
                  height: 'auto',
                  position: 'fixed',
                  right: 15,
                  top: 75,
                  // zIndex: 100000000,
                  zIndex: 1000,
                  // overflow: 'hidden',
                  // overflow: 'scroll',
                  display:
                    conferenceStatus === ConferenceStatus.ONMEETING
                      ? 'block'
                      : 'none'
                }}
                id="meet"
              /> */}
            {/* {handleVisitorTutorial2DOM()} */}
          </AppBarStyled>
        </HeaderStyle>

        {/* {windowChangeHeaderMenuPosition()} */}
      </Box>
    </div>
  );
}
