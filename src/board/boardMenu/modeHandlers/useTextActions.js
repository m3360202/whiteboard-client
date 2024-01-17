//**Fabric */
import * as fabric  from '@boardxus/x-canvas';

//**Redux store */
import store from '../../../store';
import { changeMode } from '../../../store/mode';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { handleSetMenuFontWeight } from '../../../store/widgets';

//**Services */
import { UtilityService, WidgetService } from '../../../services';

const createTextFunc = (position) => {

  const options = {
    angle: 0,
    width: 250,
    height: 138,
    scaleX: 1,
    scaleY: 1,
    left: position.x + 125,
    top: position.y,
    selectable: true,
    fill: '#000',
    stroke: '#BDBDBD',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    strokeWidth: 0,
    obj_type: 'WBText',
    user_id: store.getState().user.userInfo.userId,
    whiteboardId: store.getState().board.board._id,
    timestamp: Date.now(),
    zIndex: Date.now() * 100,
    isPanel: false,
    lockMovementX: false,
    lockMovementY: false,
    fontFamily: 'Inter',
    originX: 'center',
    originY: 'center',
    fontSize: 20,
    fontWeight: 400,
    _id: UtilityService.getInstance().generateWidgetID(),
    verticalAlign: 'top',
    oneLine: true,
  };
  
  return new fabric.Textbox('', options);

};

const useTextActions = () => {

  const dispatch = useDispatch();

   // This function changes the canvas cursor to 'text' (from 'default') when the pointer using 'hover' action is performed before creating the Text.
  const handleTextBefore = useCallback(() => {

    //set the default cursor to 'text'
    canvas.defaultCursor = 'text';

    //set the hover cursor to 'text' 
    canvas.hoverCursor = 'text';

    // It forces a re-render of canvas to apply the new cursor changes.
    canvas.requestRenderAll();

  }, [canvas]);

  // This function is used to handle the event when user releases the mouse button after dragging to create the Text on the canvas.
  const handleTextMouseUp = useCallback((e) => {

      // it creates a new text object at the coordinates specified by the pointer
      const instance = createTextFunc(e.pointer);

      // it adds the created text object to the canvas.
      canvas.add(instance);

      // it sets the created text object as the active object on the canvas.
      canvas.setActiveObject(instance);

      // it opens the text object for editing.
      instance.enterEditing();

      // it gets the fabric object from the created text object
      const objs = instance.getObject();

      // unlock the movement of the text object along x and y directions.
      objs.lockMovementX = false;
      objs.lockMovementY = false;

      // allow the text object to be selected.
      objs.selectable = true;

      // dispatchs the redux action to set the font weight of the menu to that of the created text object.
      store.dispatch(handleSetMenuFontWeight(objs.fontWeight));

      // calls the insertWidget method of WidgetService to insert a new widget.
      WidgetService.getInstance().insertWidget(objs);

      // push a new state entry to the history stack of canvas for allowing undo/redo functionality.
      canvas.pushNewState([
        {
          targetId: instance._id,
          activeselection: true,
          newState: objs,
          action: 'ADDED',
        },
      ]);

      // dispatches the redux action to change the mode to 'default' from 'text'.
      dispatch(changeMode('default'));

      // re-render the canvas to reflect the changes made on the canvas.
      canvas.requestRenderAll();

    },[canvas]);

  // This function changes the canvas cursor back to 'default' (from 'text') when the pointer action is performed after creating the Text.
  const handleTextAfter = useCallback(() => {
        
      //set the default cursor to 'default'
      canvas.defaultCursor = 'default';
  
      //set the hover cursor to 'default' 
      canvas.hoverCursor = 'default';
  
      // re-render the canvas to reflect the changes made on the canvas.
      canvas.requestRenderAll();
      
  }, []);

  return {
    handleTextMouseUp,
    handleTextBefore,
    handleTextAfter,
  };
};

export default useTextActions;
