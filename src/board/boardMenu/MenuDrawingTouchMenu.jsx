import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Popover from '@mui/material/Popover';
import CloseIcon from '@mui/icons-material/Close';
import Paper from '@mui/material/Paper';
import ToggleButton from '@mui/material/ToggleButton';
import StandardColor from '../widgetMenu/Colors/StandardColor';
import { WidgetService, BoardService, EventService } from '../../services';
import EventNames from '../../util/EventNames';
import ArrowIcon from '../../mui/svg/ArrowIcon';
//import redux store
import store, { RootState } from '../../store';
import { useDispatch, useSelector } from 'react-redux';
import {
  handleSetDrawColorPopUp,
  handleSetCursorColorOfPenWidth,
  handleSetDrawingEraseMode
} from '../../store/board';
import { changeMode } from '../../store/mode';
import * as fabric from '@boardxus/x-canvas';

const PREFIX = 'MenuDrawingTouchMenu';

const classes = {
  divider: `${PREFIX}-divider`,
  lineWidthBox: `${PREFIX}-lineWidthBox`,
  drawingbarInner: `${PREFIX}-drawingbarInner`,
  drawingBar: `${PREFIX}-drawingBar`
};

const Root = styled('div ')(({ theme }) => ({
  [`& .${classes.divider}`]: {
    borderLeft: '2px solid rgba(0, 0, 0, 0.16)',
    height: '24px',
    marginLeft: 10,
    padding: 0
  },

  [`& .${classes.lineWidthBox}`]: {
    cursor: 'pointer',
    height: '44px',
    display: 'flex'
  },

  [`& .${classes.drawingbarInner}`]: {
    display: 'flex',
    alignItems: 'center',
    width: '89%',
    // width: 300,
    background: '#fff',
    borderRadius: 7,
    boxShadow: 'rgb(217 161 177 / 54%) 1.11111px 1.11111px 2.44444px 1.22222px'
  },

  [`& .${classes.drawingBar}`]: {
    width: '100%',
    height: 44,
    position: 'fixed',
    background: 'transparent',
    bottom: 44,
    justifyContent: 'center'
  }
}));

function removeObject(e) {
  const obj = e.target;
  if (obj && obj.obj_type === 'WBPath') {
    canvas.removeWidget(obj);
  }
}

function eraseModeMouseUpListener(e) {
  EventService.getInstance().unregister(
    EventNames.CANVAS_MOUSE_MOVE,
    removeObject
  );
  EventService.getInstance().unregister(
    EventNames.CANVAS_MOUSE_UP,
    eraseModeMouseUpListener
  );
}

function eraseModeMouseDownListener() {
  EventService.getInstance().register(
    EventNames.CANVAS_MOUSE_MOVE,
    removeObject
  );
  EventService.getInstance().register(
    EventNames.CANVAS_MOUSE_UP,
    eraseModeMouseUpListener
  );
  canvas.forEachObject(obj => {
    if (obj.obj_type === 'WBPath') {
      obj.perPixelTargetFind = true;
    }
  });
}

export default function MenuDrawingTouchMenu(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [brushWidth, setBrushWidth] = useState(4);
  const { setHidden } = props;

  const [colorPadOpen, setColorPadOpen] = useState(false);
  const drawingMode =
    useSelector(state => state.mode.type) === 'draw' ? true : false;
  const eraseMode =
    useSelector(state => state.mode.type) === 'eraser' ? true : false;
  const [open, setOpen] = React.useState(false);
  const openPopover = useSelector(state => state.board.drawColorPopUp);
  const colorSync = useSelector(state => state.board.cursorColorOfPen);
  useEffect(() => {
    if (!canvas) {
      return;
    }
    if (drawingMode) {
      canvas.freeDrawingBrush.color = store.getState().board.cursorColorOfPen;
      // canvas.freeDrawingBrush.decimate = 1;
      canvas.freeDrawingBrush.width = parseInt(
        store.getState().board.cursorColorOfPenWidth,
        10
      );
      EventService.getInstance().unregister(
        EventNames.CANVAS_MOUSE_MOVE,
        removeObject
      );
      EventService.getInstance().unregister(
        EventNames.CANVAS_MOUSE_UP,
        eraseModeMouseUpListener
      );
      EventService.getInstance().unregister(
        EventNames.CANVAS_MOUSE_DOWN,
        eraseModeMouseDownListener
      );
      canvas.isDrawingMode = true;
      canvas.isErasingMode = false;
      setOpen(true);
    } else if (eraseMode) {
      canvas.isDrawingMode = false;
      canvas.isErasingMode = true;
      canvas.selection = false;
      setOpen(true);
    } else {
      canvas.isDrawingMode = false;
      canvas.isErasingMode = false;
      canvas.upperCanvasEl.className = '';
      setOpen(false);
    }
    canvas.requestRenderAll();
  }, [drawingMode, eraseMode]);

  const setCursorForDrawing = color => {
    const cursorPen = `data:image/svg+xml,%3Csvg width='20' height='18' viewBox='0 0 20 18' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M5 13C5.55 13 6 13.45 6 14C6 15.1 5.1 16 4 16C3.83 16 3.67 15.98 3.5 15.95C3.81 15.4 4 14.74 4 14C4 13.45 4.45 13 5 13ZM16.67 0C16.41 0 16.16 0.1 15.96 0.29L7 9.25L9.75 12L18.71 3.04C19.1 2.65 19.1 2.02 18.71 1.63L17.37 0.29C17.17 0.09 16.92 0 16.67 0ZM5 11C3.34 11 2 12.34 2 14C2 15.31 0.84 16 0 16C0.92 17.22 2.49 18 4 18C6.21 18 8 16.21 8 14C8 12.34 6.66 11 5 11Z' fill='${color}' fill-opacity='0.54'/%3E%3C/svg%3E%0A`;
    return `url("${cursorPen}") 0 0, auto`;
  };

  const setCursorForEraser = () => {
    const cursorPen =
      "data:image/svg+xml,%3Csvg width='20' height='17' viewBox='0 0 20 17' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M12.9596 14.1754L17.6647 8.94993L15.4332 6.94073L10.6822 12.1248L12.9596 14.1754ZM13.9469 5.60242L11.9887 3.83931C9.52618 1.62201 5.73239 1.82083 3.51509 4.28339L2.82482 5.05001L9.19585 10.7865L13.9469 5.60242ZM11.6214 15.6617C12.4422 16.4008 13.7068 16.3345 14.4459 15.5137L19.151 10.2882C19.8901 9.46734 19.8238 8.20274 19.0029 7.46364L13.327 2.35302C10.0436 -0.603384 4.9852 -0.338289 2.0288 2.94513L1.33853 3.71175C0.59943 4.53261 0.665705 5.7972 1.48656 6.5363L11.6214 15.6617Z' fill='%23232930'/%3E%3C/svg%3E";
    return `url("${cursorPen}") 0 0, auto`;
  };

  const eraseDrawing = e => {
    if (store.getState().board.drawingEraseMode) {
      store.dispatch(handleSetDrawingEraseMode(false));
      store.dispatch(changeMode('draw'));
      let brushColor = store.getState().board.cursorColorOfPen;
      if (brushColor.indexOf('rgb') == -1) {
        brushColor = Boardx.Util.hexToRgbA(brushColor, 1);
      }
      canvas.isDrawingMode = true;
      canvas.freeDrawingCursor = setCursorForDrawing(brushColor);
      canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
      canvas.freeDrawingBrush.color = brushColor;
      // canvas.freeDrawingBrush.decimate = 3;
      canvas.freeDrawingBrush.width = parseInt(
        store.getState().board.cursorColorOfPenWidth,
        10
      );
      EventService.getInstance().unregister(
        EventNames.CANVAS_MOUSE_MOVE,
        removeObject
      );
      EventService.getInstance().unregister(
        EventNames.CANVAS_MOUSE_UP,
        eraseModeMouseUpListener
      );
      EventService.getInstance().unregister(
        EventNames.CANVAS_MOUSE_DOWN,
        eraseModeMouseDownListener
      );

      canvas.requestRenderAll();
    } else {
      store.dispatch(changeMode('eraser'));

      canvas.isDrawingMode = false;
      // e.currentTarget.style.backgroundColor = '#FFFFFF';
      store.dispatch(handleSetDrawingEraseMode(true));

      if (!canvas || !canvas.getObjects()) return;

      canvas.getObjects().forEach(o => {
        if (o.obj_type === 'common') return;
        o.dirty = true;

        o.hoverCursor = setCursorForEraser();
        o.defaultCursor = setCursorForEraser();

        canvas.hoverCursor = setCursorForEraser();
        canvas.defaultCursor = setCursorForEraser();
      });

      canvas.requestRenderAll();
      EventService.getInstance().unregister(
        EventNames.CANVAS_MOUSE_MOVE,
        removeObject
      );
      EventService.getInstance().unregister(
        EventNames.CANVAS_MOUSE_UP,
        eraseModeMouseUpListener
      );
      EventService.getInstance().register(
        EventNames.CANVAS_MOUSE_DOWN,
        eraseModeMouseDownListener
      );
    }
  };

  const handleCloseAll = () => {
    store.dispatch(handleSetDrawingEraseMode(false));
    setOpen(false);
    setHidden(false);
    store.dispatch(changeMode('default'));
    canvas.freeDrawingBrush = null;
  };

  const handleClickColor = event => {
    setAnchorEl(event.currentTarget);
    setColorPadOpen(true);

    if (store.getState().board.drawColorPopUp) {
      store.dispatch(handleSetDrawColorPopUp(false));
    } else {
      store.dispatch(handleSetDrawColorPopUp(true));
    }
  };

  const changeDrawThickness = (e, newValue) => {
    store.dispatch(handleSetDrawingEraseMode(false));
    store.dispatch(changeMode('draw'));
    e.stopPropagation();
    e.preventDefault();

    setBrushWidth(newValue);
    canvas.freeDrawingBrush.width = newValue;
    store.dispatch(handleSetCursorColorOfPenWidth(newValue));
    canvas.requestRenderAll();
  };

  const handleClose = () => {
    setAnchorEl(null);
    setColorPadOpen(false);
    store.dispatch(handleSetDrawingEraseMode(false));
  };

  const id = open ? 'draw-popover' : undefined;

  const drawingColorIcon = (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="widgetMenuImgSize"
      style={{ borderRadius: 10 }}
    >
      <circle cx="8" cy="8" r="8" fill={colorSync} />
      <circle cx="8" cy="8" r="7.5" stroke="black" strokeOpacity="0.16" />
    </svg>
  );

  const eraseIcon = (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="widgetMenuImgSize"
      style={{ padding: '12px 16px 12px 16px' }}
    >
      <path
        d="M1.65997 15.5H15.4933"
        stroke="black"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.16 1.03322L13.6533 4.52655C13.9953 4.87012 14.1873 5.33513 14.1873 5.81988C14.1873 6.30463 13.9953 6.76965 13.6533 7.11322L9.69999 11.0599C9.19163 11.5691 8.58787 11.973 7.92324 12.2486C7.25861 12.5242 6.54617 12.6661 5.82666 12.6661C5.10715 12.6661 4.3947 12.5242 3.73008 12.2486C3.06545 11.973 2.46168 11.5691 1.95332 11.0599L1.03999 10.1532C0.698024 9.80965 0.506042 9.34463 0.506042 8.85988C0.506042 8.37513 0.698024 7.91012 1.03999 7.56655L7.57332 1.03322C7.91689 0.691249 8.38191 0.499268 8.86666 0.499268C9.35141 0.499268 9.81642 0.691249 10.16 1.03322V1.03322Z"
        stroke="black"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.98663 3.61987L11.0666 9.69987"
        stroke="black"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const brushWidthIconThin = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className="widgetMenuImgSize"
      style={{ padding: '12px 16px 12px 16px' }}
    >
      <rect y="6" width="16" height="4" fill="#150D33" />
    </svg>
  );

  const brushWidthIconMid = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className="widgetMenuImgSize"
      style={{ padding: '14px 16px 12px 16px' }}
    >
      <rect y="4" width="16" height="8" fill="#150D33" />
    </svg>
  );

  const brushWidthIconThick = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className="widgetMenuImgSize"
      style={{ padding: '12px 16px 12px 16px' }}
    >
      <rect y="2" width="16" height="12" fill="#150D33" />
    </svg>
  );

  return (
    <div>
      <Paper
        id={id}
        className={classes.drawingBar}
        style={{
          display: open ? 'flex' : 'none',
          width: '100%',
          height: 44,
          position: 'fixed',
          background: 'transparent',
          bottom: 44,
          justifyContent: 'center'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            width: '89%',
            // width: 300,
            background: '#fff',
            borderRadius: 7,
            boxShadow:
              'rgb(217 161 177 / 54%) 1.11111px 1.11111px 2.44444px 1.22222px'
          }}
        >
          <div style={{ width: 29, cursor: 'pointer', padding: 10 }}>
            <ToggleButton
              aria-describedby={id}
              aria-label="bold"
              id="drawColorPopupButton"
              onClick={handleClickColor}
              style={{ padding: 10 }}
              value="backgroundColor"
            >
              {drawingColorIcon}
              <ArrowIcon />
            </ToggleButton>
            <Popover
              PaperProps={{
                style: { width: '192px', height: 'auto', marginTop: -12 }
              }}
              anchorEl={document.getElementById('drawColorPopupButton')}
              // anchorEl={anchorEl}
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
              // open={openPopover}
              open={colorPadOpen}
              transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
              <StandardColor clickMe={handleClose} objectType="drawColor" />
            </Popover>
          </div>

          <div
            style={{
              borderLeft: '2px solid rgba(0, 0, 0, 0.16)',
              height: '24px',
              marginLeft: 10,
              padding: 0
            }}
          />

          <div style={{ cursor: 'pointer', height: '44px', display: 'flex' }}>
            <div
              className={
                brushWidth === 4
                  ? 'MuiMenuItem-root Mui-selected'
                  : 'MuiMenuItem-root'
              }
              onClick={event => changeDrawThickness(event, 4)}
              style={{ margin: 3 }}
            >
              {brushWidthIconThin}
            </div>
            <div
              className={
                brushWidth === 8
                  ? 'MuiMenuItem-root Mui-selected'
                  : 'MuiMenuItem-root'
              }
              onClick={event => changeDrawThickness(event, 8)}
            >
              {brushWidthIconMid}
            </div>
            <div
              className={
                brushWidth === 12
                  ? 'MuiMenuItem-root Mui-selected'
                  : 'MuiMenuItem-root'
              }
              style={{ margin: 3 }}
              onClick={event => changeDrawThickness(event, 12)}
            >
              {brushWidthIconThick}
            </div>
          </div>

          <div
            style={{
              borderLeft: '2px solid rgba(0, 0, 0, 0.16)',
              height: '24px',
              marginLeft: 10,
              padding: 0
            }}
          />

          <div style={{ cursor: 'pointer', height: '44px', display: 'flex' }}>
            <div
              className={
                eraseMode ? 'MuiMenuItem-root Mui-selected' : 'MuiMenuItem-root'
              }
              onClick={eraseDrawing}
            >
              {eraseIcon}
            </div>
          </div>

          <div onClick={handleCloseAll} style={{ padding: 10 }}>
            <CloseIcon />
          </div>
        </div>
      </Paper>
    </div>
  );
}
