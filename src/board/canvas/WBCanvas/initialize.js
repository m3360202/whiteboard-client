import * as fabric from '@boardxus/x-canvas';

//Store 
import store from '../../../store';
import { handleWidgetMenuDisplay } from '../../../store/board';

//Services
import { WidgetService, UtilityService } from '../../../services/index';

//functions
import showMenu from '../../widgetMenu/ShowMenu';
import { alignmentGuideLines } from './WBAlignmentGuidelinesc';
import {
  thumb as thumbPic,
  love as lovePic,
  smail as smilePic,
  shock as shockPic,
  question as questionPic
} from '../../svg/emoj';
import $ from 'jquery';

let currentZoom = 1;

// Create a new "state" variable within the fabric.Canvas prototype, using a reactive dictionary for reactive programming
fabric.Canvas.prototype.state = {};

// Indicate that object scaling must be uniform (equal in all dimensions)
fabric.Canvas.prototype.uniformScaling = true;

// Store the previous transform state of the canvas 
fabric.Canvas.prototype.previousViewportTransform = null;

// Indicate if a current selection is fully contained within the canvas 
fabric.Canvas.prototype.selectionFullyContained = false;

// Track an offset for adding photos to the canvas
fabric.Canvas.prototype.addingPhotosOffset = 0;

// Do not render items that are offscreen for performance
fabric.Canvas.prototype.skipOffscreen = true;

// Preserve the order of objects in the canvas
fabric.Canvas.prototype.preserveObjectStacking = true;

// Set tolerance for finding targets (objects) within the canvas
fabric.Canvas.prototype.targetFindTolerance = 8;

// Stop event to animate rectangle in the canvas
fabric.Canvas.prototype.stopAnimateToRect = false;

// Stop event to animate specific object to position in the canvas
fabric.Canvas.prototype.stopAnimateObjectToPosition = false;

// Set the mouse cursor representation while moving an object within the canvas
fabric.Canvas.prototype.moveCursor = 'default';

// Set the color of the selection area within the canvas
fabric.Canvas.prototype.selectionColor = 'rgba(179, 205, 253, 0.5)';

// Set the color of the border of the selected area within the canvas
fabric.Canvas.prototype.selectionBorderColor = '#31A4F5';

// Set the width of the line for the selected area within the canvas
fabric.Canvas.prototype.selectionLineWidth = 1;

// Allow middle click events to be fired within the canvas
fabric.Canvas.prototype.fireMiddleClick = true;

// Show background dots within the canvas
fabric.Canvas.prototype.showBackgroundDots = true;

// Define a method to reset the background image of the canvas
fabric.Canvas.prototype.resetBackgoundImage = function () {

  const self = this;

  // Load an SVG image from the specified URL
  fabric.loadSVGFromURL('https://app.boardx.us/images/backgroundDots.svg', function (objects, options) {

    let canvas = window.canvas;
    // Adjust the zoom of the canvas based on its current zoom level
    let zoom = canvas.getZoom() < 2  ? canvas.getZoom() : 2 ;

    // Generate a new "grouped" object from the loaded SVG
    let obj = fabric.util.groupSVGElements(objects);

    // Enable object caching for performance
    obj.objectCaching = true;

    // Scale the object to match the desired width and height, considering the zoom factor
    obj.scaleToWidth(80 / zoom);
    obj.scaleToHeight(80 / zoom);

    // Set the position of the object within the canvas
    obj.left = 0;
    obj.top = 0;

    // Set the origin point of the object
    obj.originX = 'left';
    obj.originY = 'top';

    // Create a buffer space around the object, to ensure it's slightly oversized
    let buffer = 15;

    // Generate a new static (non-interactive) canvas to hold the object
    let patternSourceCanvas = new fabric.StaticCanvas(null, {
      width: (80 + buffer) / zoom,
      height: (80 + buffer) / zoom,
    });

    // Add the object to the secondary canvas
    patternSourceCanvas.add(obj);

    // Request to render (draw) items to the canvas
    patternSourceCanvas.renderAll();

    // Create a new pattern using the secondary canvas as the source, set to repeat indefinitely
    const backgroundColor = new fabric.Pattern({
      source: patternSourceCanvas.getElement(),
      repeat: 'repeat',
      crossOrigin: 'anonymous'
    });

    // Set the background color of the current canvas to be the generated pattern
    self.set({
      backgroundColor: backgroundColor
    })

});
};


/**
 * This function checks if the background of the canvas needs a reset.
 * The canvas background might need a reset if the zoom factor has crossed certain 
 * threshold values. The zoom values are rounded off to the nearest threshold 
 * before making comparisons for reset.
 */

fabric.Canvas.prototype.checkIfResetBackground = function () {

  const self = this;

  // A helper function to get a zoom value rounded nearest to pre-defined zoom stages
  const getRoundZoom = zoom => {
    
    // Convert zoom level to percentage
    let roundZoom = Math.round(zoom * 100);

    // Define and sort the zoom stages in ascending order
    let zoomStages = [5,15,25,50,75,100,150,200,250,300,350,400].sort((a,b) => a-b);
    
    // Find the closest lower zoom stage
    let closestZoomStage = zoomStages.find(stage => roundZoom <= stage);

    //If no zoom stage found, set to the maximum allowed zoom stage
    if(!closestZoomStage){

      closestZoomStage = 200;

    }

    return closestZoomStage;

  };

  // Get the rounded off zoom level of the canvas
  const roundZoom = getRoundZoom(self.getZoom());

  // If the rounded zoom level has been changed, if the zoom level is lower than or equals to 4, and if background dots are shown, then reset the background image
  if (currentZoom != roundZoom && self.getZoom() <= 4 && self.showBackgroundDots) {

    self.resetBackgoundImage();

    currentZoom = roundZoom;

  }

  // If background dots should not show, set the background color of the canvas to null
  if (!self.showBackgroundDots) {

    self.set({
      backgroundColor: null
    })

  }

}

// define the state of the whiteboard as reactive dict
fabric.Canvas.prototype._initStatic = function () {

  const self = this;

  const {state} = self;

  let modifyType = '';

  self.set('isEnablePanMoving', false);

  self.set('isReady', false);

  self.resetBackgoundImage();

  self.resetUndoRedoStatus();

  this.recoverViewportTransformation(store.getState().board.boardId);

  self.on('object:scaling', (event) => {
    
    const canvas = window.canvas;
    const self = this;

    const { target } = event;

    if (target.obj_type === 'WBRectNotes' || target.obj_type === 'WBCircleNotes' || target.obj_type === 'WBShapeNotes') {
      store.dispatch(handleWidgetMenuDisplay(false))
    }

    if (target.obj_type === 'WBTextbox' || target.obj_type === 'WBText') {

      const obj = target;

      const w = obj.width * obj.scaleX;

      const h = obj.height * obj.scaleY;

      obj.set({
        height: h,
        width: w,
        scaleX: 1,
        scaleY: 1
      });

      obj.initDimensions();

      obj.dirty = true;

      canvas.requestRenderAll();

    }
    
    if (
      target.isActiveSelection()
    ) {

      target._objects.forEach((obj) => {
        obj.set({hasBorders:false})
        if (
          obj._id &&
          obj.obj_type !== 'WBShapeNotes'
        ) {
          const objwidget = canvas.findById(obj._id);

          objwidget.setCoords();

          objwidget.set({
            scaleX:objwidget.scaleX,
            scaleY:objwidget.scaleY,
            left:objwidget.left,
            top:objwidget.top,
          })

        } 
      
        else {
          
          const objwidget = canvas.findById(obj._id);

          if (!objwidget) return;

          objwidget.setCoords();

          canvas.requestRenderAll();

        }

      });

    } 
    else if (target.obj_type !== 'WBArrow' && target.obj_type !== 'WBGroup') {
      // get left and top before scaling
      const objwidget = WidgetService.getInstance().getWidgetFromWidgetList(target._id);

      if (!objwidget) return;

      self.syncObjectChangeToRemote(target._id, {
        left: target.left,
        top: target.top,
        scaleX: target.scaleX,
        scaleY: target.scaleY,
      });

      if (target.lines && target.lines.length > 0)

        self.onObjectModifyUpdateArrows(target);

      if (
        target.obj_type === 'WBRectPanel' &&
        target.subIdList() &&
        target.subIdList().length > 0
      ) {
        
        self.updateSubObjectsbyPanelObjNotMove(target);

      }
    }
  
    modifyType = 'SCALED';
  
  });

  self.on('object:moving', (event) => {
    console.log('object:moving')

    const { target } = event;

    const self = this;

    if (
      self.mouse.down &&
      !self.isEnablePanMoving &&
      self.getActiveObject() &&
      self.getActiveObject().obj_type
    ) {

      const target = self.getActiveObject();

      target.setCoords();

    }
    // 如果移动的是组合，就不需要管Panel的情况
    if (target.isActiveSelection()) {
      
      for (const obj of target._objects) {

        const newPoint = Boardx.Util.getPointOnCanvasInGroup(obj);

        if (obj.lines && obj.lines.length > 0) {

          self.onObjectModifyUpdateArrows(obj);

        }

        self.syncObjectChangeToRemote(obj._id, {
          left: newPoint.x,
          top: newPoint.y,
        });

      }

    } else {

      if (target.obj_type === 'WBArrow') {

        if (!target.connectorStart && !target.connectorEnd) {

          self.syncObjectChangeToRemote(target._id, {
            left: target.left,
            top: target.top,
          });

        } else if (
          target.connectorStart &&
          target.connectorEnd &&
          target.connectorStart._id === target.connectorEnd._id
        ) {

          self.syncObjectChangeToRemote(target._id, {
            left: target.left,
            top: target.top,
          });

        }

      } else {

        self.syncObjectChangeToRemote(target._id, {
          left: target.left,
          top: target.top,
        });
        
      }

      if (target.lines && target.lines.length > 0) {
        self.onObjectModifyUpdateArrows(target);
      }

      if (
        target.obj_type === 'WBRectPanel' &&
        target.subIdList() &&
        target.subIdList().length > 0
      ) {
        self.updateSubObjectsbyPanelObj(target);
      }
    }

    self.requestRenderAll();

    modifyType = 'MOVED';

  });

  self.on('object:rotating', () => {

    modifyType = 'ROTATED';

  });

  self.on('object:resizing', (event) => {
    const obj = canvas.getActiveObject();
    obj.saveData('MODIFIED', ['width','height','left','top','scaleX','scaleY']);
  });

  self.on('object:modified', event => {

    const { target } = event;

    if (target) showMenu();
  console.log('object:modified',target)
    //**capture the moved event */
    if (modifyType === 'MOVED') {

      return target.saveData('MOVED');

    }

    //**capture the scaled event */
    else if (modifyType === 'SCALED') {

      if (target.obj_type === 'WBArrow') return;

      if (target.obj_type === 'WBTextbox') return;

      if (target.obj_type === 'WBText') return;
      
      return target.saveData('SCALED');

    }

    //**capture the rotated event */
    else if (modifyType === 'ROTATED') {

      return target.saveData('ROTATED');

    }

    else {

      target.saveData('MOVED');

    }

  });

  self.on('dragenter', () => {

    $('#canvasContainer').css('opacity', 0.7);

  });

  self.on('dragleave', () => {

    $('#canvasContainer').css('opacity', 1);

  });

  self.on('path:created', addDraw);

  self.mouse = {
    x: 0,
    y: 0,
    down: false,
    w: 0,
    delta: new fabric.Point(0, 0),
    e: null,
    zoomUpdate: false,
    mouseMoveUpdate: false
  };

  self.whiteboardWidth = 1920 * 5;

  self.whiteboardHeight = 1080 * 6;

  self.isEnableTouchMoving = false;

  self.conextMenuObject = {};

  self.notesDrawCanvas = null;

  self.widgetPadding = 5;

  self.connectorStart = null;

  self.connectorArrow = null;

  self.vAlignLineTimer = null;

  self.hAlignLineTimer = null;

  self.isDrawingMode = false; // is the canvas in drawing mode

  self.isErasingMode = false; // is the canvas in drawing mode

  self.defaultNote = {}; // default sticky note

  //const curCanvasSize = self.getCurCanvasSize();

  self.changeDefaulNote({
    width: 230,
    height: 138,
    fontSize: 26,
    fontFamily: 'Inter',
    fontWeight: 400,
    textAlign: 'center',
    fill: '#000',
    backgroundColor: '#FCEC8A',
    scaleX: 1,
    scaleY: 1,
    obj_type: 'WBRectNotes'
  });

  const thumb = new Image();

  thumb.src = thumbPic;

  thumb.onload = function () {
    self.emoji_thumb = thumb;
  };

  const love = new Image();

  love.src = lovePic;

  love.onload = function () {
    self.emoji_love = love;
  };

  const smile = new Image();

  smile.src = smilePic;

  smile.onload = function () {
    self.emoji_smile = smile;
  };

  const shock = new Image();

  shock.src = shockPic;

  shock.onload = function () {
    self.emoji_shock = shock;
  };

  const question = new Image();

  question.src = questionPic;

  question.onload = function () {
    self.emoji_question = question;
  };

  self.alignmentGuideline = new alignmentGuideLines(self);
};

async function addDraw(e) {
  let canvas = window.canvas;
  // Get the path from the draw event
  const obj = e.path;

  // If the path is not defined, return nothing
  if (obj.path === undefined) {
    return;
  }

  // Convert the object to JSON format
  const data = obj.toJSON(); 

  // Set the left and top coordinates of the object
  data.left = obj.pathOffset.x;
  data.top = obj.pathOffset.y;

  // Set the object type
  data.obj_type = 'WBPath';

  // Get the user's id
  data.userId = store.getState().user.userInfo.userId;

  // Get the id of the current whiteboard
  data.whiteboardId = store.getState().board.board._id;

  // Set the timestamp to the current time
  data.timestamp = Date.now();

  // Make the object selectable
  data.selectable = true;

  // Set the zIndex to the current time, multiplied by 100
  data.zIndex = Date.now() * 100;

  // Set the origin points to the center
  data.originX = 'center';

  data.originY = 'center';

  // Generate a unique id for the widget
  data._id = UtilityService.getInstance().generateWidgetID();

  // Insert the widget into the service
  await WidgetService.getInstance().insertWidget(data);

  // Render the widget on the canvas
  const newPath = await canvas.renderWidgetAsync(data);

  // Remove the original object from the canvas
  canvas.remove(obj);

  // Unlock all of the objects in the canvas
  canvas.unlockObjectsInCanvas();

  // Get the new state of the canvas after the object has been added
  const newState = newPath.getUndoRedoState('ADDED');

  // Push the new state to the canvas
  canvas.pushNewState(newState);
  
}

// it will fire when object modified
fabric.Canvas.prototype.onObjectModified = async function () {
  const self = this;
  self.anyChanges = true;
};



fabric.Canvas.prototype.relativePan = function (point) {

  setObjectCaching(this);

  return this.absolutePan(
    new fabric.Point(
      -point.x - this.viewportTransform[4],
      -point.y - this.viewportTransform[5]
    )
  );
}


let transformPoint = fabric.util.transformPoint,
  invertTransform = fabric.util.invertTransform;
/**
 * Sets zoom level of this canvas instance, the zoom centered around point
 * meaning that following zoom to point with the same point will have the visual
 * effect of the zoom originating from that point. The point won't move.
 * It has nothing to do with canvas center or visual center of the viewport.
 * @param {Point} point to zoom with respect to
 * @param {Number} value to set zoom to, less than 1 zooms out
 */
fabric.Canvas.prototype.zoomToPoint = function (point, value) {
  // TODO: just change the scale, preserve other transformations
  const before = point,
    vpt = [...this.viewportTransform];
  const newPoint = transformPoint(point, invertTransform(vpt));
  vpt[0] = value;
  vpt[3] = value;
  const after = transformPoint(newPoint, vpt);
  vpt[4] += before.x - after.x;
  vpt[5] += before.y - after.y;
  this.setViewportTransform(vpt);

  setObjectCaching(this);
}

let timeoutHandler = null;

function setObjectCaching(canvas) {
  //set all visible objects in canvas to caching true, and set a timerout, after 1 second, set all objects to caching false
  //this will make the canvas render faster
  //this is a hack, because the canvas is not rendering fast enough

  if (!timeoutHandler) {
    canvas.forEachObject(function (obj) {
      obj.set({
        dirty: true,
        objectCaching: true,
      });
    });
    canvas.renderAll();
  } else {
    clearTimeout(timeoutHandler);
  }

  timeoutHandler = setTimeout(() => {
    canvas.forEachObject(function (obj) {
      obj.set({
        dirty: true,
        objectCaching: false,
      });
    });
    canvas.renderAll();
    clearTimeout(timeoutHandler);
    timeoutHandler = null;
  }, 500);


}
