//**Redux store */
import { RootState } from '../../../store';
import { useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateAbsolutePoint } from '../../../store/mode';
import {
  setCurrentContextMenu,
  updateContextMenuPosition,
  updateContextMenuStatus
} from '../../../store/contextMenu';

//**utils */
import { fromEvent, switchMap, takeUntil, tap } from 'rxjs';
import useEraserActions from './useEraserActions';
import usePanActions from './usePanActions';
import useLineActions from './useLineActions';
import useTextActions from './useTextActions';
import useShapeActions from './useShapeActions';
import useCommonActions from './useCommonActions';
import useStickNoteActions from './useStickNoteActions';
import showMenu from '../../../board/widgetMenu/ShowMenu';
import { getEraserCursor, inActiveSelection } from './utils';
import * as fabric from '@boardxus/x-canvas';

const useMouseActions = () => {

  const mouseMove: any = useRef(null);
  const mouseDown: any = useRef(null);
  const mouseUp: any = useRef(null);
  const mouseLeave: any = useRef(null);
  const mouseDownBefore: any = useRef(null);

  const beforePan: any = useRef(null);
  const afterPan: any = useRef(null);
  const leavePan: any = useRef(null);

  const isMoved: any = useRef(false);

  let mousePosition = null;

  let mouseCurrentCursor = 'default';

  let startPointer = null;

  const modeType = useSelector((state: RootState) => state.mode.type);

  const { handlePaning, handlePanMouseDown, handlePanMouseUp } = usePanActions();

  const { handleClearPath } = useEraserActions();

  const { handleLineMouseDown, handleLineMouseMove, handleLineMouseUp } = useLineActions();

  const { handleTextMouseUp } = useTextActions();

  const { handleShapeMouseDown, handleShapeMouseMove, handleShapeMouseUp } = useShapeActions();

  const { handleCommonAfter } = useCommonActions();

  const { handleStickNoteMouseUp } = useStickNoteActions();

  const dispatch = useDispatch();

  const startMouseListener = useCallback(() => {

    if (!canvas) return;

    mouseMove.current = fromEvent(canvas, 'mouse:move');

    mouseDown.current = fromEvent(canvas, 'mouse:down');

    mouseUp.current = fromEvent(canvas, 'mouse:up');

    mouseLeave.current = fromEvent(canvas, 'mouse:leave');

    mouseDownBefore.current = fromEvent(canvas, 'mouse:down:before');

    mousePosition = mouseMove.current.subscribe((e: any) => {

      canvas.mouse.e = e;

      canvas.mouse.mouseMoveUpdate = true;

    });

    beforePan.current = mouseDownBefore.current.pipe(
        tap((e: any) => {

          mouseCurrentCursor = canvas.hoverCursor;

          const mouseEvent = e.e as MouseEvent;

          startPointer = e.pointer;

          if (mouseEvent.which === 2 || mouseEvent.which === 3) {

            handlePanMouseDown(false);

          } else if (modeType === 'pan') {

            handlePanMouseDown();

          } else if (modeType === 'line') {

            handleLineMouseDown(e);

          } else if (modeType === 'shapeNote') {

            handleShapeMouseDown(e);

          }
          if (modeType === 'eraser') {

            canvas.hoverCursor = getEraserCursor();

            canvas.defaultCursor = getEraserCursor();

            canvas.requestRenderAll();

          }
          const objs = canvas.getObjects();
          if (objs && objs.length > 0) {
            objs.forEach((item) => {
              if(item.borderColor === 'rgba(179, 205, 253, 0.8)')
              item.set({ borderColor:'#31A4F5' });
            });
          }
        }),
        switchMap(_ =>
          mouseMove.current.pipe(
            takeUntil(mouseUp.current),
            takeUntil(mouseLeave.current)
          )
        )
      )
      .subscribe((e: any) => {

        const mouseEvent = e.e as MouseEvent;

        if (
          mouseEvent.buttons === 2 ||
          mouseEvent.buttons === 3 ||
          mouseEvent.which === 2 ||
          mouseEvent.which === 3 ||
          modeType === 'pan'
        ) {

          handlePaning(mouseEvent);

        } else if (modeType === 'eraser') {

          handleClearPath(e);

        } else if (modeType === 'line') {

          handleLineMouseMove(e);

        } else if (modeType === 'shapeNote' || (canvas.getActiveObject() && canvas.getActiveObject().obj_type === 'WBShapeNote')) {

          handleShapeMouseMove(e);

        }

        if (e.target && e.target.name && e.target.name.indexOf('.pdf') > -1) {

          if (e.target.width > 500) {

            e.target.set({ width: 320, height: 453, dirty: true });

            canvas.requestRenderAll();

          }

        }
        isMoved.current = true;
        
        //判断objects是否在activeselection中
        const selection = { x1: startPointer.x, y1: startPointer.y, x2: e.pointer.x, y2: e.pointer.y };

        const objects = canvas.getObjects();

        if (canvas.isActiveSelectionAction && !canvas.isDrawingMode && store.getState().mode.type !== 'eraser' && !store.getState().slides.isStartScreenShot) {
      
          objects.forEach((item) => {

            if (inActiveSelection(selection, item)) {

              if (item.aCoords && item.obj_type !=='WBArrow' && item.obj_type !=='WBShapeNotes') {

                item.set({ hasControls: false,borderColor:'rgba(179, 205, 253, 0.8)' });

                item._renderControls(canvas.contextTop);

              }

            }
            else {

              item.set({ hasControls: true });

            }

          })
        }
      });

    afterPan.current = mouseUp.current.subscribe((e: any) => {

      console.log('mouse up', e, e.target, modeType);

      const mouseEvent = e.e as MouseEvent;

      const objs = canvas.getActiveObject();

      if(objs && objs.isEditing){
        if(objs.isTpClick){          
              setTimeout(() => {
            objs.set({ isTpClick: false,
              selectionStart: 0,
              selectionEnd: objs.text.length}
            );
            objs.selectAllText();
          }
          , 100);
        }

      }

      if(objs && objs.obj_type !== 'WBGroup' && objs.obj_type !== 'WBArrow'){
        if(!canvas.getActiveObject().hasBorders){
          canvas.getActiveObject().set({ hasBorders:true });
        }
      }
      //If after activeSelection update statue
      if (objs && objs._objects && objs._objects.length > 0) {

        objs._objects.forEach((item) => {

          item.set({ hasControls: true,borderColor:'rgba(179, 205, 253, 0.8)' })

        })

      }
      
      if(objs && objs.obj_type !== 'WBGroup'){

        objs.set({ borderColor:'#31A4F5' });

      }
      
      if(objs && objs.obj_type === 'WBGroup'){
        let hasLockedObject = false;
        objs._objects.forEach((item) => {
          if(item.locked){
            hasLockedObject = true;
          }
        });
        if(hasLockedObject){
          canvas.lockObject(objs);
        }
      }
      if (mouseEvent.which === 2 || mouseEvent.which === 3) {

        canvas.hoverCursor = mouseCurrentCursor;

        canvas.defaultCursor = mouseCurrentCursor;

        canvas.setCursor(mouseCurrentCursor);

        handlePanMouseUp(false);

      }

      if (modeType === 'pan' && isMoved.current) {

        handlePanMouseUp(true);

      }

      if (
        (mouseEvent.which === 2 || mouseEvent.which === 3) &&
        !isMoved.current
      ) {

        dispatch(setCurrentContextMenu(e.target));

        dispatch(updateAbsolutePoint(e.absolutePointer));

        dispatch(updateContextMenuPosition(e.pointer));

        dispatch(updateContextMenuStatus(true));

      }

      if (modeType === 'line') {

        handleLineMouseUp(e);

      }

      if (modeType === 'eraser') {
        const target:any = e.target;
        if(target && target.obj_type !== 'WBPath'){
          setTimeout(() => {
            canvas.discardActiveObject();
            canvas.requestRenderAll();
          },10);
        }
        handleClearPath(e);

      }

      if (
        e.target &&
        !e.target.selectable &&
        !isMoved.current &&
        modeType !== 'eraser'
      ) {

        canvas.setActiveObject(e.target);

        showMenu();

      }

      if (modeType === 'text') {

        handleTextMouseUp(e);

      }

      if (modeType === 'shapeNote') {

        handleShapeMouseUp(e);

      }

      if (modeType === 'stickNote') {

        handleStickNoteMouseUp(e);

      }
      if (modeType === 'eraser') {

        canvas.hoverCursor = getEraserCursor();

        canvas.defaultCursor = getEraserCursor();

        canvas.requestRenderAll();

      }

      isMoved.current = false;

    });

    leavePan.current = mouseLeave.current.subscribe((e: any) => {

      const mouseEvent = e.e as MouseEvent;

      if (mouseEvent.buttons === 0) return;

      handleCommonAfter();

    });

  }, [canvas, modeType]);

  const endMouseListener = useCallback(() => {

    if (!canvas) return;

    beforePan.current && beforePan.current.unsubscribe();

    afterPan.current && afterPan.current.unsubscribe();

    leavePan.current && leavePan.current.unsubscribe();

    mousePosition && mousePosition.unsubscribe();
    
  }, [canvas, modeType]);

  return {
    startMouseListener,
    endMouseListener
  };
};

export default useMouseActions;
