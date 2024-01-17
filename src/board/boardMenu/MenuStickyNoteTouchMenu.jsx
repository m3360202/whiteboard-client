import React, { useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Popover from '@mui/material/Popover';
import AdjustIcon from '@mui/icons-material/Adjust';
import Slider from '@mui/material/Slider';
import CloseIcon from '@mui/icons-material/Close';
import Paper from '@mui/material/Paper';
import ToggleButton from '@mui/material/ToggleButton';
import StandardColor from '../widgetMenu/Colors/StandardColor';
import { WidgetService, BoardService, EventService } from '../../services';
import EventNames from '../../util/EventNames';
//** Import Redux toolkit
import store, { RootState } from '../../store';
import { useSelector } from 'react-redux';
import { handleSetDrawColorPopUp,handleSetCursorColorOfPenWidth,handleSetDrawingEraseMode } from '../../store/board';

import * as fabric from '@boardxus/x-canvas';
const PREFIX = 'MenuStickyNoteTouchMenu';

const classes = {
  root: `${PREFIX}-root`,
  thumb: `${PREFIX}-thumb`,
  active: `${PREFIX}-active`,
  valueLabel: `${PREFIX}-valueLabel`,
  track: `${PREFIX}-track`,
  rail: `${PREFIX}-rail`
};

const Root = styled('div')({
  [`& .${classes.root}`]: {
    color: '#62666A',
    height: 4,
  },
  [`& .${classes.thumb}`]: {
    height: 12,
    width: 12,
    backgroundColor: '#fff',
    border: '2px solid currentColor',
    '&:focus, &:hover, &$active': {
      boxShadow: 'inherit',
    },
  },
  [`& .${classes.active}`]: {},
  [`& .${classes.valueLabel}`]: {
    left: 'calc(-50% + 4px)',
  },
  [`& .${classes.track}`]: {
    borderRadius: 2,
  },
  [`& .${classes.rail}`]: {
    height: 4,
    borderRadius: 2,
  },
});

const PrettoSlider = Slider;

function removeObject(e) {
  const obj = e.target;
  if (obj && obj.obj_type === 'WBPath') {
    canvas.removeWidget(obj);
  }
}

function eraseModeMouseUpListener(e) {
  EventService.getInstance().unregister(
    EventNames.CANVAS_MOUSE_MOVE,
    removeObject,
  );
  EventService.getInstance().unregister(
    EventNames.CANVAS_MOUSE_UP,
    eraseModeMouseUpListener,
  );
}

function eraseModeMouseDownListener() {
  EventService.getInstance().register(
    EventNames.CANVAS_MOUSE_MOVE,
    removeObject,
  );
  EventService.getInstance().register(
    EventNames.CANVAS_MOUSE_UP,
    eraseModeMouseUpListener,
  );

  canvas.forEachObject((obj) => {
    if (obj.obj_type === 'WBPath') {
      obj.perPixelTargetFind = true;
    }
  });
}

export default function MenuStikyNoteTouchMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [widthValue, setWidthValue] = React.useState(25);
  const drawingMode = useSelector((state) => state.mode.type) === 'draw'?true:false;
  const eraseMode = useSelector((state) => state.mode.type) === 'eraser'?true:false;
  const [open, setOpen] = React.useState(false);
  const openPopover = useSelector((state) => state.board.drawColorPopUp);
  const colorSync = useSelector((state) => state.board.cursorColorOfPen);
  useEffect(()=>{
    if (!canvas) {
      return ;
    }
    if (drawingMode) {
      canvas.freeDrawingBrush.color = store.getState().board.cursorColorOfPen;
      // canvas.freeDrawingBrush.decimate = 1;
      canvas.freeDrawingBrush.width = parseInt(
        store.getState().board.cursorColorOfPenWidth,
        10,
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
  },[drawingMode,eraseMode])

  const setCursorForDrawing = (color) => {
    const cursorPen = `data:image/svg+xml,%3Csvg width='20' height='18' viewBox='0 0 20 18' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M5 13C5.55 13 6 13.45 6 14C6 15.1 5.1 16 4 16C3.83 16 3.67 15.98 3.5 15.95C3.81 15.4 4 14.74 4 14C4 13.45 4.45 13 5 13ZM16.67 0C16.41 0 16.16 0.1 15.96 0.29L7 9.25L9.75 12L18.71 3.04C19.1 2.65 19.1 2.02 18.71 1.63L17.37 0.29C17.17 0.09 16.92 0 16.67 0ZM5 11C3.34 11 2 12.34 2 14C2 15.31 0.84 16 0 16C0.92 17.22 2.49 18 4 18C6.21 18 8 16.21 8 14C8 12.34 6.66 11 5 11Z' fill='${color}' fill-opacity='0.54'/%3E%3C/svg%3E%0A`;

    return `url("${cursorPen}") 0 0, auto`;
  };

  const setCursorForEraser = () => {
    const cursorPen =
      "data:image/svg+xml,%3Csvg width='20' height='17' viewBox='0 0 20 17' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M12.9596 14.1754L17.6647 8.94993L15.4332 6.94073L10.6822 12.1248L12.9596 14.1754ZM13.9469 5.60242L11.9887 3.83931C9.52618 1.62201 5.73239 1.82083 3.51509 4.28339L2.82482 5.05001L9.19585 10.7865L13.9469 5.60242ZM11.6214 15.6617C12.4422 16.4008 13.7068 16.3345 14.4459 15.5137L19.151 10.2882C19.8901 9.46734 19.8238 8.20274 19.0029 7.46364L13.327 2.35302C10.0436 -0.603384 4.9852 -0.338289 2.0288 2.94513L1.33853 3.71175C0.59943 4.53261 0.665705 5.7972 1.48656 6.5363L11.6214 15.6617Z' fill='%23232930'/%3E%3C/svg%3E";

    return `url("${cursorPen}") 0 0, auto`;
  };

  const eRaseDrawing = (e) => {
    if (store.getState().board.drawingEraseMode) {
      e.currentTarget.style.backgroundColor = null;

      store.dispatch(handleSetDrawingEraseMode(false));
      

    let brushColor = store.getState().board.cursorColorOfPen
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
        10,
      );
      canvas.requestRenderAll();
    } else {
      canvas.isDrawingMode = false;

      e.currentTarget.style.backgroundColor = '#A3A4A4';
      store.dispatch(handleSetDrawingEraseMode(false));
      

      if (!canvas || !canvas.getObjects()) return;

      canvas.getObjects().forEach((o) => {
        if (o.obj_type === 'common') return;

        // o.selectable = false;
        o.dirty = true;

        o.hoverCursor = setCursorForEraser();
        o.defaultCursor = setCursorForEraser();

      });
      canvas.hoverCursor = setCursorForEraser();
      canvas.defaultCursor = setCursorForEraser();

      canvas.requestRenderAll();
      EventService.getInstance().unregister(
        EventNames.CANVAS_MOUSE_MOVE,
        removeObject,
      );
      EventService.getInstance().unregister(
        EventNames.CANVAS_MOUSE_UP,
        eraseModeMouseUpListener,
      );
      EventService.getInstance().register(
        EventNames.CANVAS_MOUSE_DOWN,
        eraseModeMouseDownListener,
      );
    }
  };

  const handleCloseAll = () => {
    
  };

  const handleClickColor = (event) => {
    setAnchorEl(event.currentTarget);

    if (store.getState().board.drawColorPopUp) {
      store.dispatch(handleSetDrawColorPopUp(false));
    } else {
      store.dispatch(handleSetDrawColorPopUp(true));
    }
  };

  const changeDrawThickness = (e, newValue) => {
    setWidthValue(newValue);
    canvas.freeDrawingBrush.width = newValue;
    store.dispatch(handleSetCursorColorOfPenWidth(newValue));
    canvas.requestRenderAll();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const id = open ? 'draw-popover' : undefined;

  return (
    <Root>
      <Paper
        id={id}
        style={{
          width: 320,
          height: 33,
          position: 'fixed',
          left: (window.innerWidth - 320) / 2,
          bottom: 10,
          display: open ? 'block' : 'none',
        }}
      >
        <div>
          <div
            onClick={eRaseDrawing}
            style={{
              marginLeft: 8,
              marginTop: 3,
              marginBottom: 3,
              float: 'left',
            }}
          >
            <img alt="eraser" src="/boardfiles/eraser.svg" />
          </div>

          <div
            style={{
              width: 55,
              height: 16,
              cursor: 'pointer',
              float: 'left',
              marginLeft: 12,
              marginTop: 8.5,
              fontSize: 12,
              color: 'rgba(35, 41, 48, 0.65)',
            }}
          >
            Thickness:
          </div>

          <div
            style={{
              width: 80,
              height: 30,
              float: 'left',
              marginLeft: 16,
              marginTop: -3,
            }}
          >
            <PrettoSlider
              aria-label="pretto slider"
              defaultValue={2}
              max={20}
              onChange={changeDrawThickness}
              value={widthValue}
              valueLabelDisplay="auto"
              classes={{
                root: classes.root,
                thumb: classes.thumb,
                active: classes.active,
                valueLabel: classes.valueLabel,
                track: classes.track,
                rail: classes.rail
              }} />
          </div>
          <div
            style={{
              width: 29,
              height: 16,
              cursor: 'pointer',
              float: 'left',
              marginLeft: 12,
              marginTop: 8.5,
              fontSize: 12,
              color: 'rgba(35, 41, 48, 0.65)',
            }}
          >
            Color:
          </div>
          <div
            style={{
              width: 29,
              height: 29,
              cursor: 'pointer',
              float: 'left',
              marginLeft: 8,
              marginTop: 3,
            }}
          >
            <ToggleButton
              aria-describedby={id}
              aria-label="bold"
              id="drawColorPopupButton"
              onClick={handleClickColor}
              style={{
                padding: 0,
                margin: 0,
              }}
              value="backgroundColor"
            >
              <AdjustIcon style={{ color: colorSync }} />
              <Popover
                PaperProps={{
                  style: { width: '192px', height: 'auto' },
                }}
                anchorEl={document.getElementById('drawColorPopupButton')}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
                id={id}
                open={openPopover}
                transformOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
              >
                <StandardColor clickMe={handleClose} objectType="drawColor" />
              </Popover>
            </ToggleButton>
          </div>
          <div
            style={{
              float: 'left',
              borderLeft: '2px solid rgba(0, 0, 0, 0.16)',
              height: '20px',
              marginLeft: 8,
              marginTop: 6,
            }}
          />
          <div
            onClick={handleCloseAll}
            style={{ marginLeft: 8, marginTop: 3, float: 'left' }}
          >
            <CloseIcon />
          </div>
        </div>
      </Paper>
    </Root>
  );
}
