import * as fabric from '@boardxus/x-canvas';

//** Import Redux toolkit
import store from '../../../store';
import { handleSetZoomFactor, handleWidgetMenuDisplay, handleSetCropMode } from '../../../store/board';
import { handleSetCustomColorMode } from '../../../store/widgets';

import { WidgetService, SystemService, UtilityService, FileService,EventService } from '../../../services';
import EventNames from '../../../util/EventNames';

import showMenu from '../../widgetMenu/ShowMenu';
import $ from 'jquery';

let endX;
let endY;
let mouseMoveHandler = null;

let timer = null

var scale = 1;
let rotation = 0;
let gestureStartRotation = 0;
let gestureStartScale = 0;
var scale = 1;
let posX = 0;
let posY = 0;
let sX;
let sY;

export function whiteboardMouseMoveListener(event) {
  // Set mouse moved attribute to true on canvas object
  canvas.mouse.moved = true;

  // Return if event exists and event type is 'touchmove'
  if (event && event.e.type === 'touchmove') return;

  // If in modify mode for connectors on the board, change cursor for arrow
  if (store.getState().board.connectorModifyMode) {
    changeCursorForArrow();
  }

  // If there is an active object on the canvas and it is being moved,
  // hide the widget menu
  if (canvas.getActiveObject() && canvas.getActiveObject().isMoving) {
    store.dispatch(handleWidgetMenuDisplay(false))
  }

  // If mouseMoveHandler is not null, clear the interval 
  if (mouseMoveHandler !== null) {
    clearInterval(mouseMoveHandler);
  }

  const { e } = event;

  // Define speed for moving
  const moveSpeeding = 7;

  // Handle moving of active object on the canvas with specified speed
  if (canvas.getActiveObject() && canvas.getActiveObject().isMoving) {
    handleMoving(e, moveSpeeding);
  }
}

function handleMoving(e, moveSpeeding) {
  /*
   * This function handles moving an object on the canvas when the object is near canvas edge.
   * 4 situations are covered:
   * 1. object is near the bottom edge
   * 2. object is near the top edge, due to the top-menu, there is a range of 75px rather than the standard 50px
   * 3. object is near the left edge
   * 4. object is near the right edge
   *
   * The logic uses 4 'if' conditions rather than 'if-elseif' to allow functioning on 4 corners at the same time.
   */

  // Handle when object is near bottom edge
  if (window.innerHeight - e.y < 50) {
    // Move the object down
    canvas.getActiveObject().set('top', canvas.getActiveObject().top + moveSpeeding / canvas.getZoom());
    // Set the object's dirty attribute to true
    canvas.getActiveObject().dirty = true;
    // Pan the canvas upwards
    canvas.relativePan({ x: 0, y: -moveSpeeding });
  }

  // Handle when object is near top edge
  if (e.y <= 75) {
    // Move the object up
    canvas.getActiveObject().set('top', canvas.getActiveObject().top - moveSpeeding / canvas.getZoom());
    // Set the object's dirty attribute to true
    canvas.getActiveObject().dirty = true;
    // Pan the canvas downwards
    canvas.relativePan({ x: 0, y: moveSpeeding });
  }

  // Handle when object is near left edge
  if (e.x <= 50) {
    // Move the object to the left
    canvas.getActiveObject().set('left', canvas.getActiveObject().left - moveSpeeding / canvas.getZoom());
    // Set the object's dirty attribute to true
    canvas.getActiveObject().dirty = true;
    // Pan the canvas to the right
    canvas.relativePan({ x: moveSpeeding, y: 0 });
  }

  // Handle when object is near right edge
  if (window.innerWidth - e.x < 50) {
    // Move the object to the right
    canvas.getActiveObject().set('left', canvas.getActiveObject().left + moveSpeeding / canvas.getZoom());
    // Set the object's dirty attribute to true
    canvas.getActiveObject().dirty = true;
    // Pan the canvas to the left
    canvas.relativePan({ x: -moveSpeeding, y: 0 });
  }
  
  // Redraw all objects on canvas
  canvas.requestRenderAll();
}

export function changeCursorForArrow() {
  // Change the cursor on the canvas to a crosshair
  canvas.setCursor('crosshair');
  
  // If the active object is of type 'WBRectPanel', hide the widget menu
  if (canvas.getActiveObject() && canvas.getActiveObject().obj_type === 'WBRectPanel') {
    store.dispatch(handleWidgetMenuDisplay(false))
  }
}

/**
 * canvas mouseup event listener
 */
export function whiteboardMouseUpListener(event) {
  // 使用事件服务反注册函`changeCursor`的`CANVAS_MOUSE_MOVE`事件
  EventService.getInstance().unregister(
    EventNames.CANVAS_MOUSE_MOVE,
    changeCursor,
  );
  // 如果事件类型是'touchend'，则直接返回
  if (event && event.e.type === 'touchend') {
    return;
  }
  // 如果没有这个鼠标抬起事件，设置鼠标按下状态为假
  canvas.mouse.down = false;
  // 为`panMode`赋值`.board.isPanMode` 或者 null
  const panMode = store.getState().board.isPanMode || null;
  // 如果处于平移模式，鼠标样式设置为'grabbing'
  if (panMode) {
    canvas.setCursor('grabbing');
  } else {
    // 否则鼠标样式设置为'default'
    canvas.setCursor('default');
  }
  // 如果mouseMoveHandler不为null，清除鼠标移动事件的定时器
  if (mouseMoveHandler !== null) {
    clearInterval(mouseMoveHandler);
  }

  // 如果没有提供画布就直接返回
  if (!canvas) {
    return;
  }
  
  // 使用事件服务取消注册白板的鼠标抬起事件监听器
  EventService.getInstance().unregister(
    EventNames.CANVAS_MOUSE_UP,
    whiteboardMouseUpListener,
  );

  // 如果处于箭头模式，保存箭头
  if (store.getState().board.arrowMode) {
    saveArrow();
  }
}

function saveArrow() {
  // 如果箭头的起始点X坐标非空
  if (canvas.arrowStartX) {
    // 调用画布上的drawArrowSave方法保存箭头图形，参数包括箭头的起始点和终止点
    canvas.drawArrowSave(canvas.arrowStartX, canvas.arrowStartY, endX, endY);
    // 保存后将箭头的起始点重置为null
    canvas.arrowStartX = null;
    canvas.arrowStartY = null;
  }
}

function changeCursor() {
  // 如果当前活动的物体存在并且被锁定
  if (canvas.getActiveObject() && canvas.getActiveObject().locked) {
    // 设置鼠标光标样式为'grabbing'，表示在移动可拖动的物体
    canvas.setCursor('grabbing');
  }
}
/**
 * canvas mouseout event listener
 * @param {*} event
 */
export function whiteboardMouseOutListener(event) {
  canvas.mouse.down = false;
}

export function whiteboardMouseDownListener(event) {
  // If there is an active object on the canvas,
  // we register an event handler for mouse-move events that changes the cursor.
  if (canvas.getActiveObject()) {
    EventService.getInstance().register(
      EventNames.CANVAS_MOUSE_MOVE,
      changeCursor,
    );
  }
  
  // If the target of the event is null or undefined, we discard the active object,
  // set the cursor to the default type, and call the function to show the menu.
  if (event.target == null || event.target === undefined) {
    canvas.discardActiveObject();
    canvas.setCursor('default');
    canvas.defaultCursor = 'default';
    canvas.hoverCursor = 'move';
    canvas.requestRenderAll();
    showMenu();
  }
  
  // We flag that the mouse has not moved yet
  canvas.mouse.moved = false;

  // If the active object is in edit mode, we return and do nothing.
  if (canvas.getActiveObject() && canvas.getActiveObject().isEditing) return;

  //If the shift key was pressed during the event, we add the target to the active selection.
  if (canvas.getActiveObject() && event.target && event.e.shiftKey) {
    const objects = canvas.getActiveObjects();
    const sel = canvas.getActiveSelection();
    sel.add(...objects,event.target);
    canvas.setActiveObject(sel);
    canvas.requestRenderAll();
    return;
  }

  // If the target of the event is in edit mode, we return true.
  if (event.target && event.target.isEditing) return true;
  
  // We check if the whiteboard is in pan mode.
  const panMode = store.getState().board.isPanMode || null;
  // We flag that the mouse is down.
  canvas.mouse.down = true;
  
  // We register the mouse-up event listener.
  EventService.getInstance().register(
    EventNames.CANVAS_MOUSE_UP,
    whiteboardMouseUpListener,
  );

  // We store the current mouse positions (X and Y coordinates).
  canvas.lastPosX = event.e.offsetX;
  canvas.lastPosY = event.e.offsetY;
  
  // We initialize the mouse delta values.
  canvas.mouseDeltaX = 0;
  canvas.mouseDeltaY = 0;
}

/**
 * switch the interaction mode, mouse or trackpad
 * @param {string} interactionMode
 */
export function switchInteractionMode(interactionMode) {
  // Checking if canvas is not available, or the current UI is mobile. If either is true, exit the function.
  if (!canvas || store.getState().system.currentUIType === 'mobile') 
    return;

  // Removing event handlers for touch:drag and touchend events on the canvas container.
  $('#canvasContainer').off('touch:drag');
  $('#canvasContainer').off('touchend');

  // Registering a whiteboardMouseOutListener to handle a canvas mouse out event using the EventService register method.
  EventService.getInstance().register(
    EventNames.CANVAS_MOUSE_OUT,
    whiteboardMouseOutListener,
  );

  // Registering a whiteboardMouseDownListener to handle a canvas mouse down event.
  EventService.getInstance().register(
    EventNames.CANVAS_MOUSE_DOWN,
    whiteboardMouseDownListener,
  );

  // Registering a whiteboardMouseDownListener to handle a canvas mouse down event before the original event.
  EventService.getInstance().register(
    EventNames.CANVAS_MOUSE_DOWN_BEFORE,
    whiteboardMouseDownListener,
  );

  // Registering a whiteboardMouseMoveListener to handle a canvas mouse move event.
  EventService.getInstance().register(
    EventNames.CANVAS_MOUSE_MOVE,
    whiteboardMouseMoveListener,
  );

  // Registering a windowGestureStarthandler to handle a window gesture start event.
  EventService.getInstance().register(
    EventNames.WINDOW_GESTURE_START,
    windowGestureStarthandler,
  );

  // Registering a windowGestureChangeHandler to handle a window gesture change event.
  EventService.getInstance().register(
    EventNames.WINDOW_GESTURE_CHANGE,
    windowGestureChangeHandler,
  );
}



const windowGestureStarthandler = (e) => {
  // Initialize the touch position, rotation and scale at the start of a gesture
  sX = e.pageX - posX;
  sY = e.pageY - posY;
  gestureStartRotation = rotation;
  gestureStartScale = scale;

  // Prevent the default action and stop the propagation of the event to the parent elements
  e.preventDefault();
  e.stopPropagation();
};

const windowGestureChangeHandler = (e) => {
  // Update the rotation and scale upon gesture's change
  rotation = gestureStartRotation + e.rotation;
  scale = gestureStartScale * e.scale;
  // Update the mouse position information to the canvas
  canvas.mouse.x = e.clientX;
  canvas.mouse.y = e.clientY;
  // Update the mouse wheeling information and the event itself
  canvas.mouse.w = scale; 
  canvas.mouse.e = e;
  canvas.mouse.zoomUpdate = true; 

  // Restrict the scale (zoom level) to a certain range
  if (scale > 4 && !store.getState().slides.slidesMode) scale = 4;
  if (scale < 0.05) scale = 0.05;
  // Dispatch an action to update the zoom factor in the store
  store.dispatch(handleSetZoomFactor(scale));

  // Store the viewport transformation in local storage
  canvas.updateViewportToLocalStorage(canvas.viewportTransform);
  // Update the position and zoom level of the canvas view
  canvas.zoomToPoint({ x: e.clientX, y: e.clientY }, scale);
  // Request a rerender for the canvas
  canvas.requestRenderAll();

 // Prevent the default action and stop the propagation of the event to the parent elements
  e.preventDefault();
  e.stopPropagation();
};

export function recoverEventsByInteractionMode() {
  // Fetch the interaction mode that is currently stored in the canvas state
  const interactionMode = canvas.interactionMode;
  // Call the function to switch interaction mode with the current interaction mode as the argument
  // SwitchInteractionMode function will register events based on interaction mode 
  switchInteractionMode(interactionMode);
}

export async function doubleClickToCreateStickyNote(e) {
  // Exit the function if an inappropriate mode is selected or a file is being dragged or a click is being processed
  if (store.getState().mode.type === 'draw' || store.getState().mode.type === 'line' ||
    canvas.isDrawingMode ||
    (canvas.getActiveObject() && canvas.getActiveObject().obj_type === 'WBFile') ||
    canvas.mouse.moved
  ) {
    return;
  }
  // Find the currently focused object
  const target = canvas.findTarget(e);

  // If the target is of a note type and is editable, enter edit mode
  if (
    target &&
    (target.obj_type === 'WBRectNotes' ||
      target.obj_type === 'WBCircleNotes' ||
      target.obj_type === 'WBTextbox' ||
      target.obj_type === 'WBText' ||
      target.obj_type === 'WBShapeNotes' ||
      target.type === 'textbox') &&
    target.editable &&
    !target.isPanel
  ) {
    target.enterEditing();
    return;
  }

  // If the target is of a note or image type and is editable, exit the function
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

  // Define user's default note configuration
  const { defaultNote } = canvas;

  // Get the position of the click event
  const positionOfClick = e.pointerType ? e.srcEvent : e.e;

  // Calculate the position of the next object on the canvas
  const nextObject = await canvas.getNextObjectByPoint(
    { x: positionOfClick.offsetX, y: positionOfClick.offsetY },
    defaultNote.width * defaultNote.scaleX,
    defaultNote.height * defaultNote.scaleY,
  );
  
  let position = {};
  if (!nextObject) {
    // If there is no next object, get the position on canvas where click event occurred
    position = canvas.getPositionOnCanvas(
      positionOfClick.offsetX,
      positionOfClick.offsetY,
    );
  } else {
    // If there is a next object, set the position and properties of the note to be created similar to the next object
    position.left = nextObject.left;
    position.top = nextObject.top;
    defaultNote.width = nextObject.width;
    defaultNote.height = nextObject.height;
    defaultNote.scaleX = nextObject.scaleX;
    defaultNote.scaleY = nextObject.scaleY;
    defaultNote.fontSize = nextObject.fontSize;
    defaultNote.fontWeight = nextObject.fontWeight;
    defaultNote.fontFamily = nextObject.fontFamily;
    defaultNote.textAlign = nextObject.textAlign;
    defaultNote.backgroundColor = nextObject.backgroundColor;
    defaultNote.fill = nextObject.fill;
    defaultNote.obj_type = nextObject.obj_type;
    canvas.changeDefaulNote(defaultNote);
  }

  // Set other properties of the note
  const note = {
    // Initialized note properties
  }
 
  note._id = UtilityService.getInstance().generateWidgetID();
  // Create and add widget from note properties
  // Rest of the function
}

async function uploadTheNotesDraw(target) {
  // 若目标不存在则直接返回
  if (target === undefined) return;

  // 若当前状态为正在绘图，则上传图片
  if (target.isDrawing === true && target.isDraw == true) {
    target.isDrawing = false;

    // 获取画布图像的数据URL
    const imageElement = await canvas.notesDrawCanvas.lowerCanvasEl.toDataURL();
    target.opacity = 0.2;
    target.dirty = true;
    target.imageSrc = imageElement;

    // 隐藏笔记菜单，移除选中样式
    $('#notesMenu').hide();
    $('#shadowMenu').removeClass('selected');
    $('#drawColor').removeClass('selected');
    $('#LineWidth').removeClass('selected');
    $('.color-squares').removeClass('selected');
    $('#drawOptions').removeClass('selected');
    $('.palette').removeClass('selected');
    $('.dropdown').removeClass('selected');

    // 将DataURL转化为Blob对象
    const file = Boardx.Util.dataURIToBlob(imageElement);
    
    // 获取ftp服务器的存储路径
    let r2UploadPath = UtilityService.getInstance().getr2UploadPath(store.getState().board.board);
    
    // 上传文件至ftp服务器并获取服务器上文件的路径
    const key = await FileService.getInstance().uploadFileToR2inBoard(
      r2UploadPath,
      file,
      {
        progress(e) { },
      }
    );

    const src = key;
    const data = {
      isDraw: true,
      isDrawing: false,
      imageSrc: src,
    };

    target.opacity = 1;
    target.set(data);
    // 将对象数据保存并通知服务器，参数为"MODIFIED"(被修改)，以及被修改的属性名数组
    target.saveData('MODIFIED', ['isDraw', 'isDrawing', 'imageSrc']);

    // 返回上一视口
    canvas.gobackToPreviousViewport();
    // 解锁画布上的所有对象
    canvas.unlockObjectsInCanvas();

    // 隐藏需要隐藏的DOM元素
    $('#notesDrawCanvas').parent().hide();
    $('#notesDrawCanvas').hide();
    $('#notesDrawCanvas').next().hide();
    // 设定时间后再返回上一视口，避免视口变化过突兀
    setTimeout(() => {
      canvas.gobackToPreviousViewport();
    }, 200);
  }
}

function onTextChanged(e) {
  e.target.changed = true;
  //syncObjectChangeToRemote
  canvas.syncObjectChangeToRemote(e.target._id, { text: e.target.text });
}

export function onTextEditingExited(event) {
  let canvas = window.canvas;
  // Extract target from the event object
  const { target } = event;

  // Get the widget with the corresponding id from the widget list
  const widget = canvas.findById(target._id);
  
  // If the event target hasn't changed, return immediately
  if (!event.target.changed) return;

  // If the related widget does not exist, return immediately
  if (!widget) return;

    // Inform the server that the text property of the target has been modified
    target.saveData('MODIFIED', ['text']);
    // Reset the 'changed' status of the event target
    event.target.changed = false;

  // Return to the previous viewpoint in the canvas
  canvas.gobackToPreviousViewport();
  
  // Remove the currently active object from the canvas
  canvas.discardActiveObject();

  // Request the canvas to re-render all of its objects
  canvas.requestRenderAll();
}

export async function onObjectSelectionCleared() {
  // 获取当前在画布上活动的对象
  const target = canvas.getActiveObject();

  // 上传被绘制的笔记
  uploadTheNotesDraw(target);

  // 显示菜单，该行代码已被注释，如果需要就取消注释
  // showMenu();

  // 如果当前处于自定义颜色模式,则关闭自定义颜色模式
  if (store.getState().widgets.customColorMode) {
    store.dispatch(handleSetCustomColorMode(false));
  }

  // // 如果当前处于自定义颜色边框模式,则关闭自定义颜色边框模式
  // if (Session.get('customColorBorderMode')) {
  //   Session.set('customColorBorderMode', false);
  // }
}

export function onSelectionUpdated(e) {

  // Check if the deselected object has a property of 'isDrawing' equal to true.
  // If true, retrieve the deselected object and upload the notes drawn on it. 
  if (e.deselected && e.deselected[0] && e.deselected[0].isDrawing === true) {
    const target = e.deselected[0];
    uploadTheNotesDraw(target);
  }

  // If in 'cropMode' and there is a deselected object, retrieve the deselected object.
  // If the type of the object is 'cropSelectionFrame', set the 'cropMode' to false and then apply the 'crop' function on the parent image of the deselected object.
  if (
    store.getState().board.cropMode &&
    e.deselected &&
    e.deselected[0]
  ) {
    const target = e.deselected[0];
    if (target.type === 'cropSelectionFrame') {
      store.dispatch(handleSetCropMode(false));
      target.parentImage.crop();
    }
  }

  // If the number of active objects on the canvas are more than one, 
  // then lock the scaling option that keeps the object's aspect ratio fixed.
  if (canvas.getActiveObjects().length > 1) {
    canvas.getActiveObject().lockUniScaling = true;
  }

  // Display the context menu, this line of code is commented. If required, you can remove the comment.
  // showMenu(e);
}

export function initializeCanvasEvents() {
  // For all future instances of fabric.Object, transparent corners are disabled
  fabric.Object.prototype.transparentCorners = false;

  // Set the cursor style for rotating objects in the canvas to 'alias'
  canvas.rotationCursor = 'alias';

  // Register event listener for 'TEXT_EDITING_EXISTED' event, to call the function 'onTextEditingExited'
  EventService.getInstance().register(
    EventNames.TEXT_EDITING_EXISTED,
    onTextEditingExited,
  );

  // Register event listener for 'TEXT_CHANGED' event, to call the function 'onTextChanged'
  EventService.getInstance().register(
    EventNames.TEXT_CHANGED,
    onTextChanged,
  );

  // Register event listener for 'CANVAS_BEFORE_SELECTION_CLEARED' event, to call the function 'onObjectSelectionCleared'
  EventService.getInstance().register(
    EventNames.CANVAS_BEFORE_SELECTION_CLEARED,
    onObjectSelectionCleared,
  );

  // Register event listener for 'CANVAS_SELECTION_UPDATED' event, to call the function 'onSelectionUpdated'
  EventService.getInstance().register(
    EventNames.CANVAS_SELECTION_UPDATED,
    onSelectionUpdated,
  );

  // Register event listener for 'CANVAS_BEFORE_SELECTION_CLEARED' event, to call the function 'onBeforeSelectionCleared'
  EventService.getInstance().register(
    EventNames.CANVAS_BEFORE_SELECTION_CLEARED,
    onBeforeSelectionCleared,
  );
  
  // Define function 'onBeforeSelectionCleared' to crop the selected image when selection is about to be cleared
  function onBeforeSelectionCleared(e) {
    // Get the currently active object on the canvas
    const target  = canvas.getActiveObject();
    // If the application is in crop mode
    if (store.getState().board.cropMode) {
      // Dispatch an action to set crop mode to false
      store.dispatch(handleSetCropMode(false));
      // Crop the parent image of the object
      target.parentImage.crop(target.parentImage);
    }
  }

  // Register event listener for 'SELECTION_CLEARED' event, to call the function 'showMenu'
  EventService.getInstance().register(
    EventNames.SELECTION_CLEARED,
    showMenu,
  );
}

/**
 * handle the trackpad events
 * @param {*} e
 */

export function onTrackpadTouch(e) {
  // Update the mouse event object information on the canvas
  canvas.mouse.e = e;
  // Check if the control key was pressed during the event
  if (e.ctrlKey) {
    // Update the mouse x and y coordinates on the canvas to match the event offsets
    canvas.mouse.x = e.offsetX;
    canvas.mouse.y = e.offsetY;
    // Adjust the zoom level on the canvas based on the scroll direction
    canvas.mouse.w = canvas.getZoom() - e.deltaY * 0.007; 
    // Flag to update the zoom level
    canvas.mouse.zoomUpdate = true;
  } else {
    // If control key was not pressed, change panMovingType to 'trackpad'
    canvas.panMovingType = 'trackpad';
    // Update the delta x and y coordinates of the mouse on the canvas
    canvas.mouse.delta.x -= e.deltaX;
    canvas.mouse.delta.y -= e.deltaY;
    // Flag to update the mouse movement
    canvas.mouse.mouseMoveUpdate = true;
    // Enable pan moving on the canvas 
    // canvas.isEnablePanMoving = true;
  }
}

/**
 * handle the mouse wheel event
 */
function isTrackpadOrMouse(e) {
  // Check if the current device is a Mac
  const isMac = /macintosh|mac os x/i.test(navigator.userAgent);
  // Initialize a default value for the isTrackpad variable
  let isTrackpad = false;

  if (isMac) { 
    //On a Mac device
    if (e.wheelDeltaY) {
      // if the scrolling is in the Y direction
      // check for equality between wheelDeltaY and deltaY times -3
      // if they're equal, the input device is a trackpad
      if (e.wheelDeltaY === e.deltaY * -3) { 
        isTrackpad = true; 
      } 
    } else if (e.deltaMode === 0) { 
      //deltaMode of 0 indicates that the unit of the delta values is in pixels
      // which means the input device is a trackpad
      isTrackpad = true; 
    }
  } else { 
    //On a Non-Mac device
    if (SystemService.getInstance().getIsFirefox()) {
      // check the deltaY and deltaX values for a Firefox browser
      isTrackpad =
        e.deltaY !== 0
          ? e.wheelDeltaY !== e.deltaY * -3
          : e.deltaX !== 0
            ? e.wheelDeltaX !== e.deltaX * -3
            : false;
    // If deltaY is equal to wheelDeltaY times -1, it's a trackpad
    } else if (e.deltaY === e.wheelDeltaY * -1) {
      isTrackpad = true;
    }
  }

  // Return if the input device is a trackpad
  return isTrackpad;
}


export function mouseWheelListener(e) {

  // Clears any previously set timeout, if there's any.
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }

  // Sets a delay to show the menu after 200ms. 
  timer = setTimeout(() => {
    showMenu();
  }, 200)

  // Checks if the system is MacOS.
  const isMac = /macintosh|mac os x/i.test(navigator.userAgent);

  // Dispatches an action to hide the widget menu.
  store.dispatch(handleWidgetMenuDisplay(false))


  // Checks if an event is available, prevents the default behaviour and propagation if true.
  if (e != null) {
    e.preventDefault();
    e.stopPropagation();
  }

  // Measures the vertical scrolling amount.
  const deltaY = Math.abs(e.deltaY);

  // Checks if the event was triggered from a trackpad or mouse, and handles it if true.
  if (isTrackpadOrMouse(e)) {
    onTrackpadTouch(e);
    return false;
  }

  // If the system is MacOS, and the event contains horizontal scrolling or the deltaY is a whole number, then the function exits.
  if (
    isMac &&
    (Math.abs(e.deltaX) !== 0 || parseInt(deltaY.toString()) === deltaY)
  ) return false;

  // Adjusts the zoom factor based on vertical scroll amount.
  let zoom = canvas.getZoom() * 0.999 ** (e.deltaY * 10)

  // Sets maximum and minimum zoom limits. 
  if (zoom > 4 && !store.getState().slides.slidesMode) zoom = 4;
  if (zoom < 0.05) zoom = 0.05;

  // Dispatches an action to update the zoom factor in store state.
  store.dispatch(handleSetZoomFactor(zoom));

  // Zooms the canvas to the point where the event triggered and updates the viewport.
  canvas.zoomToPoint({ x: e.layerX, y: e.layerY }, zoom);
  canvas.updateViewportToLocalStorage(canvas.viewportTransform);

  // Requests a rerender of the canvas.
  canvas.requestRenderAll()
}

export function clearCanvasEvent() {
  // Checks if a mouseMoveHandler exists 
  if (mouseMoveHandler !== null) {
    // If it exists, clear the timer associated with the mouseMoveHandler
    // This effectively ends tracking of mouse movement over the canvas
    clearInterval(mouseMoveHandler);
  }
}