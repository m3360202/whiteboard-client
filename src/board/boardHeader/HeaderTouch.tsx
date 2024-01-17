import * as React from 'react';
import { styled } from '@mui/material/styles';
import { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';
import { alpha, StyledEngineProvider } from '@mui/material/styles';
import { Tooltip } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import {
  BoardService,
  SysService
} from '../../services';

//** Import Redux toolkit
import store, { RootState } from '../../store';
import { useSelector, useDispatch } from 'react-redux';
import { handleSetHideHeader, handleSetBoardName, handleSetWidgetMenuList } from '../../store/board';
const PREFIX = 'HeaderTouch';

const classes = {
  grow: `${PREFIX}-grow`,
  menuButton: `${PREFIX}-menuButton`,
  title: `${PREFIX}-title`,
  search: `${PREFIX}-search`,
  searchIcon: `${PREFIX}-searchIcon`,
  inputRoot: `${PREFIX}-inputRoot`,
  inputInput: `${PREFIX}-inputInput`,
  sectionDesktop: `${PREFIX}-sectionDesktop`,
  sectionMobile: `${PREFIX}-sectionMobile`,
  appBar: `${PREFIX}-appBar`,
  appBarShift: `${PREFIX}-appBarShift`,
  backBar: `${PREFIX}-backBar`,
  lockBar: `${PREFIX}-lockBar`
};

const Root = styled('div')(({ theme }) => ({
  flexGrow: 1,

  [`& .${classes.menuButton}`]: {
    color: 'rgba(0,0,0,0.54)'
  },

  [`& .${classes.title}`]: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block'
    }
  },

  [`& .${classes.search}`]: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25)
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto'
    }
  },

  [`& .${classes.searchIcon}`]: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },

  [`& .${classes.inputRoot}`]: {
    color: 'inherit'
  },

  [`& .${classes.inputInput}`]: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch'
    }
  },

  [`& .${classes.sectionDesktop}`]: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'flex'
    }
  },

  [`& .${classes.sectionMobile}`]: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none'
    }
  },

  [`& .${classes.appBar}`]: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    minHeight: 50
  },

  [`& .${classes.appBarShift}`]: {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginRight: drawerWidth
  },

  [`& .${classes.backBar}`]: {
    height: 40,
    width: 40,
    backgroundColor: '#FAFAFA',
    boxShadow: '0px 1px 3px 2px #00000014',
    borderRadius: '100px',
    position: 'fixed',
    display: 'flex',
    alignItems: 'center',
    padding: 0,
    left: 16
    // top: 54,
  },

  [`& .${classes.lockBar}`]: {
    height: 40,
    width: 40,
    backgroundColor: '#FAFAFA',
    boxShadow: '0px 1px 3px 2px #00000014',
    borderRadius: '100px',
    position: 'fixed',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    padding: 0,
    right: 16
    // top: 54,
  }
}));

// import ConferenceTouch from '../../.Jitsi/components/conference/ConferenceTouch';

const drawerWidth = 240;

export default function HeaderTouch({ moveDown }) {

  const dispatch = useDispatch();
  const [locked, setLocked] = React.useState(true);
  const modeType = useSelector((state: RootState) => state.mode.type);
  const history = useHistory();
  const { t } = useTranslation();

  const boardId = useSelector((state: RootState) => state.board.boardId);

  const handleLockBoard = () => {
    if (locked) {
      canvas.unlockObjectsInCanvas();
      canvas.skipTargetFind = false;
    } else {
      canvas.lockObjectsInCanvas();
      canvas.skipTargetFind = true;
    }

    setLocked(!locked);
  };
  useEffect(() => {
    dispatch(handleSetHideHeader(false));
    if (!canvas) return;
    initLock();
  }, [canvas]);
  const board = useSelector((state: RootState) => state.board.board)

  useEffect(() => {
    dispatch(handleSetBoardName(board.name));
  }, [board.name]);

  const initLock = async () => {
    canvas.lockObjectsInCanvas();
    canvas.requestRenderAll();
    canvas.skipTargetFind = true;
    setLocked(true);
  };


   const handleGoBack = e => {
    e.preventDefault();
    if(canvas){
      BoardService.getInstance().clearResourceAndEvents();
    }
  

    localStorage.setItem('is_onboard', 'false');
    //JitsiMeetingService.getInstance().dispose();
    store.dispatch(handleSetWidgetMenuList([]));
    BoardService.getInstance().updateCurrentBoard({
      lastUpdateTime: Date.now()
    });
    const board = store.getState().board.board;
    BoardService.getInstance().closeBoard();
    document.body.style.overflow = 'visible';
    //SyncService.getInstance().stopSyncListener();
    if (modeType !== 'default') {
      if(canvas && canvas.freeDrawingBrush ){
        canvas.freeDrawingBrush = null;
      }
      // dispatch(changeMode('default'));
    }
 
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
 
  };

  const lockIcon = (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.5 6.5H3.5C2.94771 6.5 2.5 6.94773 2.5 7.5V14.5C2.5 15.0523 2.94771 15.5 3.5 15.5H12.5C13.0523 15.5 13.5 15.0523 13.5 14.5V7.5C13.5 6.94773 13.0523 6.5 12.5 6.5Z"
        stroke={'#150D33'}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.5 6.5V4C4.5 3.07174 4.86875 2.18151 5.52513 1.52513C6.18151 0.868747 7.07173 0.5 8 0.5C8.92827 0.5 9.81847 0.868747 10.4749 1.52513C11.1313 2.18151 11.5 3.07174 11.5 4V6.5"
        stroke={'#150D33'}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 11C7.86193 11 7.75 10.8881 7.75 10.75C7.75 10.6119 7.86193 10.5 8 10.5"
        stroke={'#150D33'}
      />
      <path
        d="M8 11C8.13807 11 8.25 10.8881 8.25 10.75C8.25 10.6119 8.13807 10.5 8 10.5"
        stroke={'#150D33'}
      />
    </svg>
  );

  const unlockIcon = (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0.5 5.62V3.48667C0.5 2.69455 0.814664 1.93489 1.37477 1.37477C1.93489 0.814664 2.69455 0.5 3.48667 0.5C4.27878 0.5 5.03845 0.814664 5.59856 1.37477C6.15868 1.93489 6.47333 2.69455 6.47333 3.48667V5.62"
        stroke="black"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.4467 5.62H4.76666C4.29538 5.62 3.91333 6.00206 3.91333 6.47333V12.4467C3.91333 12.9179 4.29538 13.3 4.76666 13.3H12.4467C12.9179 13.3 13.3 12.9179 13.3 12.4467V6.47333C13.3 6.00206 12.9179 5.62 12.4467 5.62Z"
        stroke="black"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.60664 9.45999C8.48883 9.45999 8.39331 9.36448 8.39331 9.24666C8.39331 9.12884 8.48883 9.03333 8.60664 9.03333"
        stroke="black"
      />
      <path
        d="M8.60669 9.45999C8.72451 9.45999 8.82002 9.36448 8.82002 9.24666C8.82002 9.12884 8.72451 9.03333 8.60669 9.03333"
        stroke="black"
      />
    </svg>
  );

  return (
    <StyledEngineProvider injectFirst>
      <Root>
        {(
          <div className={classes.backBar} style={{ top: moveDown ? 66 : 20 }}>
            <Tooltip
              arrow
              placement="bottom"
              title={t('board.header.goBack')}
            >
              <IconButton
                aria-label="open drawer"
                // className={classes.menuButton}
                style={{ color: 'rgba(0,0,0,0.54)', marginLeft: -2 }}
                color="inherit"
                edge="start"
                onClick={handleGoBack}
                size="large"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  strokeWidth="1"
                  style={{ width: 15, height: 15 }}
                >
                  <g transform="matrix(0.8333333333333334,0,0,0.8333333333333334,0,0)">
                    <path
                      d="M16.25,23.25,5.53,12.53a.749.749,0,0,1,0-1.06L16.25.75"
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
          </div>
        )  }
        <div className={classes.lockBar} style={{ top: moveDown ? 66 : 20 }}>
          <Tooltip
            arrow
            placement="bottom"
            title={t('board.header.screenShare')}
          >
            <IconButton
              aria-label="show 17 new notifications"
              className={classes.menuButton}
              style={{
                marginTop: -3,
                marginLeft: 1,
                color: 'rgba(0,0,0,0.54)'
              }}
              color="inherit"
              onClick={handleLockBoard}
              size="large"
            >
              {/* <LockOutlinedIcon
                style={{ color: locked ? '#F21d6B' : '#150D33' }}
              /> */}
              {locked ? lockIcon : unlockIcon}
            </IconButton>
          </Tooltip>
        </div>
      </Root>
    </StyledEngineProvider>
  );
}
