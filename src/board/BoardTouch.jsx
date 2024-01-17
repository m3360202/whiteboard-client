//**Import React */
import React, { useEffect, useState, useCallback } from 'react';

import { styled } from '@mui/material/styles';

//**Import i18n */
import { useTranslation } from 'react-i18next';

import { StyledEngineProvider } from '@mui/material/styles';
import { Button, Tooltip, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import UndoOutlinedTouchIcon from '../mui/icons/UndoOutlinedTouchIcon';
import RedoOutlinedTouchIcon from '../mui/icons/RedoOutlinedTouchIcon';

//** Import store */
import store, { RootState } from '../store';
import { useSelector } from 'react-redux';
import {
  handleSetClassForCursor,
  handleChangeViewport,
  handleSetZoomFactor,
  handleWidgetMenuDisplay,
  handleSetCursorColorOfPen,
  handleSetCursorColorOfPenWidth,
  handleSetInitCanvas
} from '../store/board';
import { handleSetBoardId } from '../store/board';
import { WidgetAPI } from '../redux/WidgetAPISlice';
//**Import Service */
import {
  BoardService,
  UserService,
  EventService,
  SysService,
  SyncService
} from '../services';
import { api } from '../redux/api';

//** canvas & fabricjs
import * as fabric  from '@boardxus/x-canvas';
import { initializeFonts } from './canvas/initialize/initializeFonts';
import { doubleClickToCreateStickyNote } from './canvas/initialize/initializeCanvasEvents';
import './canvas/initialize/initializeShortcut';
import './canvas/index';

//**Import Components */
import Cursor from '../mui/icons/Cursor';
// import PresentationControlBar from './boardHeader/slides/PresentationControlBar';
import ConfirmationDeletePanel from '../components/ConfirmDeleteBindingDialog';
import HeaderTouch from './boardHeader/HeaderTouch';
import WidgetMenu from './widgetMenu/WidgetMenu';
import UserList from './userList/UseList';
import showMenuTouch from './widgetMenu/ShowMenu';
import EventNames from '../util/EventNames';
import MenuBarTouch from './boardMenu/MenuBarTouch';
import { useHistory } from 'react-router-dom';

//canvas = null;
var stopMomentumPan = false;
let penMode = false;
store.dispatch(handleChangeViewport(null));
store.dispatch(handleSetCursorColorOfPen('rgb(0, 0, 0)'));
store.dispatch(handleSetCursorColorOfPenWidth(2));

// window.requestAnimationFrame(update);

function hypotenuse(long, angle) {
  const radian = ((2 * Math.PI) / 360) * angle;
  return {
    ty: Math.sin(radian) * long,
    tx: Math.cos(radian) * long
  };
}

function onTap1(e) {
  const target = canvas.findTarget(e.srcEvent);
  if (target && target.obj_type === 'WBRectNotes') {
    store.dispatch(handleWidgetMenuDisplay(false))
    setTimeout(() => {
      showMenuTouch();
    }, 30);
  } else {
    store.dispatch(handleWidgetMenuDisplay(false))
    showMenuTouch();
  }
}

function onDoubleTap(e) {
  console.log('onDoubleTap');
  const target = canvas.findTarget(e.srcEvent);
  if (
    target &&
    (target.obj_type === 'WBRectNotes' ||
      target.obj_type === 'WBCircleNotes' ||
      target.obj_type === 'WBUrlImage' ||
      target.obj_type === 'WBTextbox' ||
      target.obj_type === 'WBText' ||
      target.obj_type === 'WBShapeNotes') &&
    target.editable
  ) {
    return;
  }
  if (target && target.obj_type === 'WBUrlImage') {
    window.open(target.url, '_blank').focus();
    return;
  }
  doubleClickToCreateStickyNote(e);
  setTimeout(() => {
    canvas.zoomToObject(canvas.getActiveObject());
    setTimeout(() => {
      showMenuTouch();
    }, 1000);
  }, 300);
}

function onPinchStart(e) {
  canvas.pinchStartZoom = canvas.getZoom();
}

function onPinchMove(e) {
  let delta = canvas.pinchStartZoom * e.scale;
  const point = e.center;
  console.log('onPinchMove', delta, point, e.scale, canvas.getZoom())
  if (delta < 0.12 && e.scale < 1) { 
    delta = 0.12
  }
  if (delta > 3 && e.scale > 1) {
    delta = 3
  }
  canvas.zoomToPoint(point, delta);
  canvas.renderAll();
  canvas.updateViewport();
  store.dispatch(handleSetZoomFactor(delta));
}
function onPan1Start(e) {
  stopMomentumPan = true;
  canvas.selection = false;

  if (Boardx.Instance.board.isErasingMode) {
    canvas.skipTargetFind = false;
  }
  store.dispatch(handleWidgetMenuDisplay(false))
  if (e.pointerType === 'pen') penMode = true; //to identify if it is an i-touch pen or a finger
  if (e.maxPointers > 1) {
    return;
  }
  if (
    Boardx.Instance.board.isDrawingMode &&
    (!penMode || (penMode && e.pointerType === 'pen'))
  ) {
    Boardx.Instance.board._onMouseDownInDrawingMode(e);
  }
}

function onPan1Move(e) {

  stopMomentumPan = false;
  // if (canvas.selection) return;
  if (e.pointerType === 'pen') penMode = true;
  if (e.maxPointers > 1) {
    return;
  }
  if (
    Boardx.Instance.board.isDrawingMode &&
    (!penMode || (penMode && e.pointerType === 'pen'))
  ) {
    Boardx.Instance.board._onMouseMoveInDrawingMode(e);
    return;
  }
  if (Boardx.Instance.board.isErasingMode) {
    console.log('eraser mode', e.srcEvent, canvas.findTarget(e.srcEvent))
    if (canvas.findTarget(e.srcEvent)) {
      canvas.removeWidget(canvas.findTarget(e.srcEvent));
      canvas.requestRenderAll();
    }
    return;
  }
  if (canvas.getActiveObject() && canvas.getActiveObject().isMoving) {
    store.dispatch(handleWidgetMenuDisplay(false))

    return;
  }
  if (Math.abs(e.deltaX - canvas.lastPanDeltaX) > 500) {
    return;
  }
  const vpt = Boardx.Instance.board.viewportTransform;

  if (Math.abs(vpt[4] / vpt[0]) > 40000) {
    if (vpt[4] > 0) {
      vpt[4] = 10000 * vpt[0];
    } else {
      vpt[4] = -10000 * vpt[0];
    }
    canvas.viewportTransform = vpt;
  }

  if (Math.abs(vpt[5] / vpt[0]) > 40000) {
    if (vpt[5] > 0) {
      vpt[5] = 10000 * vpt[0];
    } else {
      vpt[5] = -10000 * vpt[0];
    }
    canvas.viewportTransform = vpt;
  }

  canvas.relativePan({
    x: e.deltaX - canvas.lastPanDeltaX,
    y: e.deltaY - canvas.lastPanDeltaY
  });
  canvas.lastPanDeltaX = e.deltaX;
  canvas.lastPanDeltaY = e.deltaY;
  canvas.updateViewport();
  canvas.requestRenderAll();
}

function onPan1End(e) {
  if (
    Boardx.Instance.board.isDrawingMode &&
    (!penMode || (penMode && e.pointerType === 'pen')) &&
    Boardx.Instance.board._isCurrentlyDrawing
  ) {
    Boardx.Instance.board._onMouseUpInDrawingMode(e);
    return;
  }
  if (Boardx.Instance.board.isErasingMode) {
    return;
  }
  if (canvas.getActiveObject()) {
    showMenuTouch();
    return;
  }
  if (Boardx.Instance.board.isErasingMode) {
    canvas.skipTargetFind = true;
  }
  stopMomentumPan = false;
  canvas.lastPanDeltaX = 0;
  canvas.lastPanDeltaY = 0;
  let { angle } = e;
  if (angle < 0) {
    angle = -angle;
  } else {
    angle = 360 - angle;
  }

  if (e.mode === 'press') {
    console.log('listen about press')
    canvas.updateViewport();
    stopMomentumPan = false;
  } else {
    fabric.util.animate({
      startValue: 10,
      endValue: 1,
      duration: 500,
      abort() {
        return stopMomentumPan;
      },
      onChange(value) {
        const long = ((e.distance / e.deltaTime) * 10 * value) / 10;
        const { tx, ty } = hypotenuse(long, angle);
        canvas.relativePan({ x: tx, y: -ty });
        canvas.renderAll();
      },
      async onComplete() {
        canvas.updateViewport();
        stopMomentumPan = false;
      }
    });
  }
}

function BoardTouch() {
  let canvas = window.canvas;
  const history = useHistory();
  const { t } = useTranslation();
  let intervalHandler = null;
  //store
  const boardId = useSelector((state) => state.board.boardId);
  const cursorColorOfPen = useSelector((state) => state.board.cursorColorOfPen);
  const drawingMode = useSelector((state) => state.mode.type) === 'draw' ? true : false;
  const eraseMode = useSelector((state) => state.mode.type) === 'eraser' ? true : false;
  const followViewport = useSelector((state) => state.board.followViewport);
  const redoAvailable = useSelector((state) => state.board.redoAvailable);
  const undoAvailable = useSelector((state) => state.board.undoAvailable);

  //hooks
  const [avatarListHidden, setaAvatarListHidden] = useState(false);
  const [isShowingStartUpHint, setIsShowingStartUpHint] = useState(true);
  const [loading, setLoading] = useState(true);

  const signin = () => {
    UserService.getInstance().logout();
    window.location.href = '/signin?callback=' + location.pathname.slice(1);
  };
  
  const handleUndo = () => {
    canvas.undo();
  };
  const handleRedo = () => {
    canvas.redo();
  };

  const initializeCanvas = useCallback(async () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    document.getElementById('canvasContainer').innerHTML = ` <canvas
    height= ${height}
    id="icanvas"
    width= ${width}
                  id='icanvas'
                  
                />`;
    if (canvas) {
      canvas.dispose();
      canvas = null;
      window.canvas = null;
    }

    canvas = new fabric.Canvas('icanvas', {
      defaultCursor: 'default',
      renderOnAddRemove: false,
      imageSmoothingEnabled: false,
      backgroundColor: '#F8F8F8',
      skipOffscreen: true,
      preserveObjectStacking: true,
      selection: false,
      fireRightClick: true
    });

    Boardx.Instance.board = canvas;
    window.canvas = canvas;
    canvas._initStatic();
    store.dispatch(handleSetInitCanvas(true));
    return canvas;
  }, [boardId]);

  // init touchEvents
  const initializeTouchEvents = useCallback(() => {

    canvas.lastPanDeltaX = 0;
    canvas.lastPanDeltaY = 0;

    EventService.getInstance().listenCanvasActionEvents();
    EventService.getInstance().listenHammerEvents();
    EventService.getInstance().register(EventNames.HAMMER_TAP1, onTap1);
    EventService.getInstance().register(
      EventNames.HAMMER_DOUBLE_TAP,
      onDoubleTap
    );
    EventService.getInstance().register(
      EventNames.HAMMER_PAN1_START,
      onPan1Start
    );
    EventService.getInstance().register(
      EventNames.HAMMER_PAN1_MOVE,
      onPan1Move
    );
    EventService.getInstance().register(
      EventNames.HAMMER_PAN1_END,
      onPan1End
    );
    EventService.getInstance().register(
      EventNames.HAMMER_PINCH_START,
      onPinchStart
    );
    EventService.getInstance().register(
      EventNames.HAMMER_PINCH_MOVE,
      onPinchMove
    );

  }, [])

  //init board, include all above events
  const initializeBoard = useCallback(async (boardId) => {
    UserService.getInstance();//这是干什么用的

    canvas = await initializeCanvas();
    if (canvas) {
      canvas.selection = false;
      canvas.isEnablePanMoving = true;
    }
    await initializeTouchEvents();
    await SyncService.getInstance().initSync();
    await initializeFonts();
    intervalHandler = setInterval(() => {
      if (canvas && canvas.anyChanges && store.getState().user.userInfo.userId) {
        canvas.sortByZIndex();
        canvas.anyChanges = false;
        canvas.resetCoordsOnScreen();
        canvas.requestRenderAll();
      }
    }, 300);
    setLoading(false);
  }, [])

  useEffect(() => {
    BoardService.getInstance().changeBoard(boardId, () => {
      initializeBoard(boardId);
    });
    setTimeout(() => {
      setIsShowingStartUpHint(false);
    }, 2000);

    return () => {
       BoardService.getInstance().clearResourceAndEvents();
       if (intervalHandler){
        clearInterval(intervalHandler);
       } 
    };

  }, []);

  useEffect(() => {
    let classForCursorInner;
    if (cursorColorOfPen !== '') {
      classForCursorInner = {
        cursor: `url(\"data:image/svg+xml,%0A%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25ZM5.92 19H5V18.08L14.06 9.02L14.98 9.94L5.92 19ZM20.71 5.63L18.37 3.29C18.17 3.09 17.92 3 17.66 3C17.4 3 17.15 3.1 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63Z' fill='${cursorColorOfPen}' fill-opacity='0.54'/%3E%3C/svg%3E%0A\") -27 27, auto !important`
      };
    }
    store.dispatch(handleSetClassForCursor(classForCursorInner));
  }, [cursorColorOfPen])

  useEffect(() => {
    if (drawingMode || eraseMode) {
      setaAvatarListHidden(true);
    }
  }, [drawingMode, eraseMode])


  useEffect(() => {
    if (!boardId) return;
    store.dispatch(handleSetBoardId(boardId));
    store.dispatch(api.util.invalidateTags([{ type: 'widgets', whiteboardId: boardId }]))
    store.dispatch(WidgetAPI.endpoints.getWidgetsByBoardId.initiate(boardId));
    setTimeout(() => {
      canvas.lockObjectsInCanvas();
    }, 1000);
  }, [boardId]);

  useEffect(() => {
    if (followViewport) {
      const vp = followViewport;
      canvas.animateToRect(vp.vw2, vp.vh2, vp.v, vp.vpc);
      canvas.requestRenderAll();
    }
  }, [followViewport]);

  return (
    <StyledEngineProvider injectFirst>
      <Root>
        <div
          style={{
            width: 120,
            height: 'auto',
            position: 'absolute',
            right: 20,
            top: 75,
            zIndex: 100000000,
            display: 'none'
            // display: status === ConferenceStatus.READY ? 'none' : 'block',
          }}
          id="meet"
        />
        <div id="canvasContainer">
          {/* <canvas
            height="1080"
            id="icanvas"
            style={classForCursor}
            width="100%"
          /> */}
        </div>
        <RenderOnlineUsers />
        {!loading && (
          <div>
            <WidgetMenu />
            <div
              
              style={{ display: avatarListHidden ? 'none' : 'flex',   width: 'unset',
              height: 36,
              backgroundColor: '#FAFAFA',
              boxShadow: '0px 1px 3px 2px #00000014',
              borderRadius: '100px',
              position: 'fixed',
              bottom: '34px',
              left: '16px',
              display: 'flex',
              alignItems: 'center',
              padding: 0 }}
            >
              <UserList />
            </div>
            <HeaderTouch moveDown={false} />
            <div style={{ top: 118,  height: 72,
    width: 40,
    backgroundColor: '#FAFAFA',
    boxShadow: '0px 1px 3px 2px #00000014',
    borderRadius: '100px',
    position: 'fixed',
    right: '16px',
    align: 'vertical',
    padding: 0 }}>
              <Tooltip arrow placement="bottom" title="undo">
                <IconButton
                  aria-label="open drawer"
                  sx={{    color: 'rgba(0,0,0,0.54)',
                  // padding: 10,
                  boxSizing: 'border-box'}}
                  color="inherit"
                  edge="start"
                  onClick={handleUndo}
                  size="large"
                  style={{
                    marginLeft: 4,
                    paddingLeft: 0,
                    color: undoAvailable
                      ? 'rgba(0,0,0,0.3)'
                      : 'rgba(0,0,0,0.54)'
                  }}
                >
                  {/* <UndoOutlinedIcon /> */}
                  <UndoOutlinedTouchIcon undoAvailable={undoAvailable} />
                </IconButton>
              </Tooltip>
              <Tooltip arrow placement="bottom" title="redo">
                <IconButton
                  aria-label="open drawer"
                  sx={{    color: 'rgba(0,0,0,0.54)',
                  // padding: 10,
                  boxSizing: 'border-box'}}
                  color="inherit"
                  edge="start"
                  onClick={handleRedo}
                  size="large"
                  style={{
                    color: redoAvailable
                      ? 'rgba(0, 0, 0, 0.3)'
                      : 'rgba(0,0,0,0.54)',
                    marginLeft: 4,
                    paddingLeft: 0,
                    marginTop: -12
                  }}
                >
                  {/* <RedoOutlinedIcon /> */}
                  <RedoOutlinedTouchIcon redoAvailable={redoAvailable} />
                </IconButton>
              </Tooltip>
            </div>
            <MenuBarTouch />
            <ConfirmationDeletePanel />
          </div>
        )}

        <div id="main">
          <canvas
            id="notesDrawCanvas"
            style={{ display: 'none', position: 'fixed' }}
          />
          <div id="notesDrawContainer" style={{ position: 'fixed' }} />
        </div>
      </Root>

  
      {isShowingStartUpHint ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            padding: '12px 20px',
            position: 'absolute',
            left: 35,
            bottom: 34,
            right: 20,
            background: '#FFFFFF',
            boxShadow: '0px 4px 8px -4px rgba(58, 53, 65, 0.42)',
            borderRadius: '5px'
          }}
        >
          <a
            style={{
              position: 'static',
              left: 'calc(50% - 263px/2 - 1px)',
              top: '0%',
              bottom: '0%',
              fontFamily: "'Inter'",
              fontStyle: 'normal',
              fontWeight: 400,
              fontSize: '16px',
              lineHeight: '21px',
              letterSpacing: '0.14px',
              color: 'rgba(58, 53, 65, 0.87)',
              flex: 'none',
              order: 0,
              flexGrow: 0,
              margin: '0px 0px'
            }}
          >
            Click unlock icon to edit the board
          </a>
        </div>
      ) : null}
    </StyledEngineProvider>
  );
}


function RenderOnlineUsers() {
  const onlineUsers = useSelector((state) => state.user.onlineUsers);


  return (
    <div
      id="onlineUsers"
      style={{
        overflow: 'visible',
        position: 'absolute',
        left: -1000,
        top: -1000
      }}
    >
      {onlineUsers?.filter(
        obj =>
          obj.userNo !==
          store.getState().user.userInfo.userNo
      )
        .map(r => (
          <div key={r.userNo}>
            <div
              style={{ margin: 0}}
              id={r.userNo}
              style={{
                position: 'absolute',
                left: r.domMouseLeft,
                top: r.domMouseTop,
                display: r.display
              }}
            >
              <Cursor htmlColor={r.color} />
              <div
                style={{ position: 'absolute',
                top: '0px',
                fontSize: '14px',
                fontWeight: 600,
                padding: 3,
                color: '#FFF',
                width: 'auto',
                display: 'inline-block',
                whiteSpace: 'nowrap',
                borderRadius: '5px'}}
                style={{ backgroundColor: r.color }}
              >
                <Typography>{r.name}</Typography>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}

const BoardTouchMemo = React.memo(BoardTouch);
export default BoardTouchMemo;