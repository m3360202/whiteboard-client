//**Import React */
import React, { useEffect } from 'react';

//**Import Mui */
import SpeedDialAction from '@mui/material/SpeedDialAction';

//**Import Service */
import { WidgetService, BoardService} from '../../services';

//import redux store 
import store, { RootState } from '../../store';
import { useDispatch,useSelector } from 'react-redux';
import { changeMode } from '../../store/mode';
import DrawingIcon from '../svg/drawing';
import { handleSetCursorColorOfPen,handleSetDrawingEraseMode } from '../../store/board';

import * as fabric from '@boardxus/x-canvas';

store.dispatch(handleSetCursorColorOfPen('rgb(255, 0, 0)'));

export default function MenuDrawingTouch({ handleClose, setHidden, ...props }) {
  const dispatch = useDispatch();
  const modeType = useSelector((state) => state.mode.type);
  const drawingMode = useSelector((state) => state.mode.type) === 'draw'?true:false;
  const eraseMode = useSelector((state) => state.mode.type) === 'eraser'?true:false;
  const [open,setOpen] = React.useState(false);
  useEffect(()=>{
    let brushColor = 'rgb(0, 0, 0)';

    if (!canvas) {
      setOpen(false);
    }
    if (drawingMode) {
      canvas.freeDrawingBrush.color = store.getState().board.cursorColorOfPen;
      // canvas.freeDrawingBrush.decimate = 1;
      canvas.freeDrawingBrush.width = parseInt(
        store.getState().board.cursorColorOfPenWidth,
        10,
      );
      brushColor = store.getState().board.cursorColorOfPen;
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
      canvas.discardActiveObject();
      canvas.lockObjectsInCanvas();
    }
    canvas.requestRenderAll();
  },[eraseMode,drawingMode])


  const setCursorForDrawing = (color) => {
    const cursorPen = `data:image/svg+xml,%3Csvg width='20' height='18' viewBox='0 0 20 18' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M5 13C5.55 13 6 13.45 6 14C6 15.1 5.1 16 4 16C3.83 16 3.67 15.98 3.5 15.95C3.81 15.4 4 14.74 4 14C4 13.45 4.45 13 5 13ZM16.67 0C16.41 0 16.16 0.1 15.96 0.29L7 9.25L9.75 12L18.71 3.04C19.1 2.65 19.1 2.02 18.71 1.63L17.37 0.29C17.17 0.09 16.92 0 16.67 0ZM5 11C3.34 11 2 12.34 2 14C2 15.31 0.84 16 0 16C0.92 17.22 2.49 18 4 18C6.21 18 8 16.21 8 14C8 12.34 6.66 11 5 11Z' fill='${color}' fill-opacity='0.54'/%3E%3C/svg%3E%0A`;
    return `url("${cursorPen}") 0 0, auto`;
  };

  const handleClick = (event) => {
    setHidden(true);
    handleClose();
    
    store.dispatch(handleSetDrawingEraseMode(false));
    
    dispatch(changeMode('draw'));
    let brushColor = store.getState().board.cursorColorOfPen;
    if (brushColor.indexOf('rgb') == -1) {
      brushColor = Boardx.Util.hexToRgbA(brushColor, 1);
    }
    canvas.isDrawingMode = true;
    canvas.freeDrawingCursor = setCursorForDrawing(brushColor);
    canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
    canvas.freeDrawingBrush.color = brushColor;
    canvas.freeDrawingBrush.width = parseInt(
      store.getState().board.cursorColorOfPenWidth,
      10,
    );
    canvas.requestRenderAll();
  };

  return (
    <SpeedDialAction
      component="span"
      icon={<DrawingIcon />}
      onClick={handleClick}
      tooltipTitle="Upload"
      {...props}
    />
  );
}
