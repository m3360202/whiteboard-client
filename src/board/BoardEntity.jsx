//** Import react
import React, { useEffect, useState, useCallback } from 'react';

import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
//** Import i18n

import { useTranslation } from 'react-i18next';

//** Import Redux toolkit
import store, { RootState } from '../store';
import { useSelector } from 'react-redux';
import { handleSetZoomFactor, handleSetShowTutorial, handleSetInitCanvas } from '../store/board';

import { AiAssistApi, useGetAiAllCustomStyleCommandQuery, useGetAllAiCommandQuery, useGetAllTeamsAiCommandQuery } from '../redux/AiAssistApiSlice';
import { WidgetAPI } from '../redux/WidgetAPISlice';
//** canvas & fabricjs
import * as fabric from '@boardxus/x-canvas';
import './canvas/index';

import { StyledEngineProvider } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import LoadingIcon from '../mui/icons/LoadingIcon';

//** Import services
import { api } from '../redux/api';
import { BoardService, EventService, SyncService } from '../services';

//** events
import { initializeCanvasEvents } from './canvas/initialize/initializeCanvasEvents';

import useTouchEvents from './touchEvents';
//** Import components

import DesktopChatAI from '../components/boardChatAI/ChatAI/DesktopChatAI';
// import CommentRender from '../components/comment/CommentRender';
import ContextMenu from './contextMenu';
import ConfirmationDeletePanel from '../components/ConfirmDeleteBindingDialog';
import Feedback from '../pages/feedback';
import FollowMeControl from './boardHeader/followMe/FollowMeControl';
import Header from './boardHeader/Header';
import MenuBar from './boardMenu/MenuBar';
import MiniCanvas from './miniCanvas/MiniCanvas';
import OnlineUsersClass from './userList/OnlineUsersClass';
import PresentationControlBar from './boardHeader/slides/PresentationControlBar';
import SupportResources from '../components/onBoarding/SupportResources';
import UserRoleInterestSelections from '../components/onBoarding/UserRoleInterestSelections';
import WidgetMenu from './widgetMenu/WidgetMenu';
import BoardTimer from './boardHeader/timer/BoardTimer';
import $ from 'jquery';

const StyledStyledEngineProvider = styled('div')(({ theme }) => ({}));

const CanvasContainerBox = styled('div')(({ theme }) => ({
  overflow: 'hidden',
  position: 'relative'
}));

const CanvasContainer = styled('div')(({ theme }) => ({
  width: 'auto',
  height: '100%',
  overflow: 'hidden',
  borderWidth: '3px'
}));

export default function BoardEntity() {
  console.log('BoardEntity');
  let canvas = window.canvas;

  const { hammer, addTouchEvents, removeTouchEvents } = useTouchEvents();
  const { t } = useTranslation();

  const socketConnection = useSelector((state) => state.user.socketConnectStatus);
  const connectionStatus = useSelector((state) => state.system.connectionStatus); 
  //hooks 
  const [loading, setLoading] = useState(true);
 
  const orgInfo = useSelector((state) => state.org.orgInfo);

  useGetAllAiCommandQuery({});
  useGetAiAllCustomStyleCommandQuery({});

  useGetAllTeamsAiCommandQuery({ orgId: orgInfo.orgId });



  //store
  const boardId = useSelector((state) => state.board.boardId);
  const board = useSelector((state) => state.board.board);
  const marginRightBottomAppBar = useSelector(
    (state) => state.sideBar.marginRightBottomAppBar
  );
  const presentationMode = useSelector((state) => state.slides.presentationMode);
  const showRightBottom = useSelector((state) => state.board.showRightBottomIcon);
  const sideBar = useSelector((state) => state.sideBar.sideBar);

  //canvas and event handlers
  let intervalHandler = null;
  let timeoutHandler = null;
  let listenNetConnect = null;

  const initializeCanvas = useCallback(async () => {
    if (!document.getElementById('canvasContainer') || store.getState().board.initCanvas) return;
    document.getElementById('canvasContainer').innerHTML =
      ` <canvas
                  style={{
                    width: '100%',
                    height: '100%'
                  }}
                  id='icanvas'
                  
                />`;
    if (canvas) {
      canvas.dispose();
      canvas = null;
      window.canvas = null;
    }

    canvas = await new fabric.Canvas('icanvas', {
      defaultCursor: 'default',
      renderOnAddRemove: false,
      imageSmoothingEnabled: false,
      skipOffscreen: true,
      preserveObjectStacking: true,
      selection: true,
      fireRightClick: true,
      backgroundColor: '#fff',
    });

    Boardx.Instance.board = canvas;
    window.canvas = canvas;
    canvas._initStatic();
    store.dispatch(handleSetInitCanvas(true));
    return canvas;
  }, [boardId]);

  const initializeBoard = useCallback(async () => {

    canvas = await initializeCanvas();

    if (canvas) {
      canvas.mouse.mouseMoveUpdate = false;
      canvas.isEnablePanMoving = false;
    }

    EventService.getInstance().listenCanvasDomEvents();
    EventService.getInstance().listenWindowEvents();
    EventService.getInstance().listenTriggerEvents();
    EventService.getInstance().listenCanvasActionEvents();
    EventService.getInstance().resizeCanvasAccordingtoWindowSize();
    SyncService.getInstance().initSync();
    await initializeCanvasEvents();

 
    //判断是否地址有vpt这个参数
    const searchParams = new URLSearchParams(window.location.search);
    const vptParam = searchParams.get('vpt');
    if (vptParam) {
      canvas.viewportTransform = vptParam.split(",").map(Number);
      canvas.renderAll();
    }

    intervalHandler = setInterval(() => {
      if (canvas && canvas.anyChanges && store.getState().user.userInfo.userId) {
        canvas.sortByZIndex();
        canvas.anyChanges = false;
        canvas.resetCoordsOnScreen();
        canvas.requestRenderAll();
      }
    }, 500);

    setLoading(false);
  }, [])

  

  useEffect(() => {
    (async () => {
      if (!boardId || boardId === "") return;
      //初始化board & 退出清除canvas内容 &销毁canvas实例
      let firstUsedUser = localStorage.getItem('firstUsedUser');
      let count = 1;
      await initializeBoard();

      store.dispatch(api.util.invalidateTags([{ type: 'widgets', whiteboardId: boardId }]))
      store.dispatch(WidgetAPI.endpoints.getWidgetsByBoardId.initiate(boardId));

      if (firstUsedUser) {
        firstUsedUser = JSON.parse(firstUsedUser);
        firstUsedUser.count++;
        count = firstUsedUser.count;
        localStorage.setItem('firstUsedUser', JSON.stringify(firstUsedUser));
      } else {
        localStorage.setItem(
          'firstUsedUser',
          JSON.stringify({ userId: store.getState().user.userInfo.userId, count: 1 })
        );
      }
      if (count === 1) {
        store.dispatch(handleSetShowTutorial(true));
      }
    })();
  }, [boardId]);

  useEffect(() => {
    if (!hammer) return;

    addTouchEvents();

    return () => {
      removeTouchEvents();
      if (listenNetConnect) {
        clearInterval(listenNetConnect);
      }
    };
  }, [hammer]);

  useEffect(() => {
    if (store.getState().board.board._id && canvas && canvas.getZoom()) {
      store.dispatch(handleSetZoomFactor(canvas.getZoom()));
    }
  }, [canvas]);

  useEffect(() => {
    document.body.style.overflow = 'hidden'

    return () => {
      store.dispatch(handleSetInitCanvas(false));
      BoardService.getInstance().clearResourceAndEvents();
      if (timeoutHandler) clearTimeout(timeoutHandler);
      if (intervalHandler) clearInterval(intervalHandler);
      if (listenNetConnect) clearInterval(listenNetConnect);
    };
  }, []);



  useEffect(() => {
    if (!showRightBottom) {
      $('#canvasContainer').css('pointerEvents', 'none');
    } else {
      $('#canvasContainer').css('pointerEvents', 'all');
    }
  }, [showRightBottom]);
  const createMetaTag = (property, content) => {
    return `<meta property="${property}" content="${content}">`;
  }

  // sideBar open & close
  useEffect(() => {
    $('#bottomAppBar').css('right', marginRightBottomAppBar);
  }, [sideBar]);

  return (
    <StyledStyledEngineProvider injectFirst>
      {/* <MetaTags>
            <title>{board.name}</title>
            <meta name="description" content="A digital board that empowers us to co-create'." />
            <meta name="image" content={board.thumbnail}/>
            <meta name="site_name" content='BoardX'/>
            <meta name="title" content={board.name}/>
            <meta name="url" content={window.location.href}/>
            </MetaTags> */}
      <CanvasContainerBox id="boardEntity" >
        <CanvasContainer id="canvasContainer">
          <canvas
            style={{
              width: '100%',
              height: '100%'
            }}
            id="icanvas"
          />
        </CanvasContainer>
        <OnlineUsersClass />
        {!loading && (
          <div>
            <Header />
            <WidgetMenu />
            <ContextMenu />

            {showRightBottom && (
              <div id="menus">
                <MiniCanvas />
                <SupportResources />
                <DesktopChatAI chatType="boardChat" />
                <UserRoleInterestSelections />
                <MenuBar />
                <Feedback />
              </div>
            )}
            <BoardTimer />
            <ConfirmationDeletePanel />
          </div>
        )}
        <Dialog open={ !socketConnection || !connectionStatus}>
          <Box
            sx={{
              display:  'flex' ,
              flexDirection: 'column',
              padding: '25px'
            }}
          >
            <Box sx={{display:"flex", flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
            
                <Typography variant="h3">
                  {t('components.connection.reconnecting')}
                </Typography>
                <Button variant="text" color="primary" onClick={() => window.location.reload()}>
                  Reload Now
                  </Button>
            
            </Box>
            {/* <Box sx={{ m: '0 auto', my: '24px' }}>
              
                <LoadingIcon className="BoardEntity-loading-icon" />
           
            </Box> */}
          </Box>
        </Dialog>
        <FollowMeControl></FollowMeControl>
        {presentationMode ? <PresentationControlBar /> : null}
      </CanvasContainerBox>
      {/* <Snackbar open={isFetching} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }} message={'Loading Data...'} /> */}

      {/* <VideoDialog /> */}
    </StyledStyledEngineProvider>
  );
}

