
import * as fabric  from '@boardxus/x-canvas';

import _ from 'lodash';
import $ from 'jquery';
//Redux Store
import store from '../../../store';
import { handleSetCaptureThumbnail, handleSetCaptureThumbnailBoardName } from '../../../store/board';

import i18n from 'i18next';
let t = i18n.getFixedT(null, null)

fabric.Canvas.prototype.removeById = function (id) {

  // Save a reference to the current fabric.Canvas instance
  const self = this;

  // Loop through each object on the canvas
  self.getObjects().forEach((obj) => {

    // If the object's id (_id) matches the target id
    if (obj._id === id) {

      // Remove that object from the canvas
      self.remove(obj);

    }

  });

};

fabric.Canvas.prototype.selectAllWidgets = function () {

  const objects = this.getObjects(); //get all objects on calvas

  objects.filter( obj => obj._id !== undefined && !obj.locked && obj.obj_type !== 'common' );

  if (objects && objects.length > 0) {

    const sel = canvas.getActiveSelection();

    sel.add(...objects);//add into activeSelection

    canvas.setActiveObject(sel);

    canvas.requestRenderAll();

  }

}

fabric.Canvas.prototype.resetCoordsOnScreen = function () {

  // Get all objects on the canvas
  const objs = this.getObjects();

  // Check if there are any objects on the canvas
  if (objs && objs.length > 0) {

    // For each object on the canvas
    this.getObjects().forEach((obj) => {

      // If the object is on the screen
      if (obj.isOnScreen()) {

        // Reset its coordinates
        obj.setCoords();
      }

    });
  }
};

fabric.Canvas.prototype.getCenterPointOfScreen = () => {
  const cvsOffset = $('#canvasContainer').offset(); // Get the offset of the canvas container

  // Calculate the coordinates of the center point
  const left = window.innerWidth / 2 - cvsOffset.left;
  const top = window.innerHeight / 2 - cvsOffset.top;

  // Store and return the coordinates in a position object
  const position = { x: left, y: top };
  return position;
};

// Adding a new method 'getAbsoluteCoords' to the fabric.Canvas object
// This method calculates the absolute coordinates of the given object based on the offset value of the canvas
fabric.Canvas.prototype.getAbsoluteCoords = function (object) {
  return {
    left: object.left + this._offset.left,
    top: object.top + this._offset.top,
  };
};

// Adding a new method 'getCurCanvasSize' to the fabric.Canvas object
// This method returns the current viewport transformation, effectively representing the current size of the canvas
fabric.Canvas.prototype.getCurCanvasSize = function () {
  const size = canvas.viewportTransform;
  return size;
};

// Adding a new method 'getContentArea' to the fabric.Canvas object
// This method gets the coordinates area of all non-common objects on the canvas
fabric.Canvas.prototype.getContentArea = function () {
  let aCoords = {};

  const self = this;

  // Discard the currently active object on the canvas
  self.discardActiveObject();

  // Get all the objects on the canvas that are not of type 'common' or 'WBFile'
  const activeSelection = self.getObjects().filter((o) => o.obj_type !== 'common' && o.obj_type !== 'WBFile');

  // Active Selection
  const sel = canvas.getActiveSelection();
  
  // Add the selected objects into the active selection
  sel.add(...activeSelection);

  // Set the combined object as the currently active selection in the canvas
  self.setActiveObject(sel);

  // Get the absolute coordinates of the boundaries of the active selection
  aCoords = self.getActiveObject().aCoords;

  // Discard the currently active selection
  self.discardActiveObject();

  // Return the coordinates
  return aCoords;
};

fabric.Canvas.prototype.toDataURLContent = function (multiplier) {

  const self = this;

  const originalTransform = self.viewportTransform;

  self.viewportTransform = [0.05, 0, 0, 0.05, 0, 0];

  const aCoordsOfContent = self.getContentArea();

  self.showBackgroundDots = false;

  self.backgroundColor = "#fff";

  const { tl } = aCoordsOfContent;

  const { br } = aCoordsOfContent;

  const width = (br.x - tl.x) * 0.05;

  const height = (br.y - tl.y) * 0.05;

  const dataUrl = self.toDataURL({
    format: 'png',
    multiplier,
    left: tl.x * 0.05,
    top: tl.y * 0.05,
    width: width,
    height: height,
  });

  self.viewportTransform = originalTransform;

  return dataUrl;

};

fabric.Canvas.prototype.captureThumbnail = function () {

  const self = this;

  const originalTransform = self.viewportTransform;

  self.zoomToViewAllObjects();

  self.showBackgroundDots = false;

  self.backgroundColor = "#fff";

  const dataUrl = self.toDataURL({
    format: 'png',
    multiplier: 5,
    left: 0,
    top: 0,
    width: window.innerWidth,
    height: window.innerHeight,
  });

  self.viewportTransform = originalTransform;

  store.dispatch(handleSetCaptureThumbnail(dataUrl));

  let name = store.getState().board.board.name;

  store.dispatch(handleSetCaptureThumbnailBoardName(name));

  return dataUrl;

};

fabric.Canvas.prototype.getObjectByID = function (id) {

  const self = this;

  const objs = self.getObjects().filter((obj) => obj._id === id);

  if (objs.length > 0) return objs[0];

  return null;

};


fabric.Canvas.prototype.getMyLastAddedObject = function (objType) {

  const self = this;

  const myObjects = self.getObjects().filter((obj) => {

    const isMyLastAddedObject =  obj.userId === store.getState().user.userInfo.userId && obj.obj_type === objType;

    return isMyLastAddedObject;

  });

  const myLastObject = myObjects[myObjects.length - 1];

  return myLastObject;

};

fabric.Canvas.prototype.loadData = function (widgets) {

  const self = this;

  const promise = new Promise((resolve) => {

    widgets.forEach((widget) => {

      self.renderWidget(widget);

    });

    resolve(true);

  });

  return promise;

};

fabric.Canvas.prototype.planNewLayout = function (objects, numOfColumns) {

  const self = this;

  let _objects = objects;

  let _numOfColumns = numOfColumns;

  _numOfColumns = parseInt(numOfColumns, 10);

  self.discardActiveObject();

  let leftOffset = 0;

  let topOffset = 0;

  const leftObject = Boardx.Util.getLeftObject(objects);

  const topObject = Boardx.Util.getTopObject(objects);

  const { left } = leftObject;

  let { top } = topObject;

  _objects = objects.sort((a, b) => a.zIndex - b.zIndex);

  _objects = objects.sort((a, b) => a.backgroundColor.localeCompare(b.backgroundColor));

  _objects = objects.sort((a, b) => a.obj_type.localeCompare(b.obj_type));

  objects.forEach((_obj,index) => {

    const index1 = index + 1;

    if (index1 % _numOfColumns === 1 || _numOfColumns === 1) {

      _obj.left = left;

      _obj.top = top;

      _obj.setCoords();

      _obj.saveData('MOVED',[_obj.left, _obj.top]);

      topOffset = _obj.height * _obj.scaleY;

      leftOffset = leftOffset + (_obj.width / 2) * _obj.scaleX;

      if (_numOfColumns === 1) {
        top = top + topOffset + 10;
        topOffset = 0;
        leftOffset = 0;
      }
    } else {

      _obj.left = left + leftOffset + (_obj.width / 2) * _obj.scaleX + 10;

      _obj.top = top;

      _obj.setCoords();

      _obj.saveData('MOVED',[_obj.left, _obj.top]);

      if (_obj.height * _obj.scaleY > topOffset) {
        topOffset = _obj.height * _obj.scaleY;
      }

      if (index1 % _numOfColumns === _numOfColumns) {
        leftOffset = 0;
      } else {
        leftOffset = leftOffset + _obj.width * _obj.scaleX + 10;
      }

      if (index1 % _numOfColumns === 0) {

        top = top + topOffset + 10;

        topOffset = 0;

        leftOffset = 0;

      }
    }
  });

  const activeSelection = _objects;

  const sel = canvas.getActiveSelection();

  sel.add(...activeSelection);

  self.setActiveObject(sel);
  
};

fabric.Canvas.prototype.clearData = function () {

  const self = this;

  if (self._objects) {

    for (let i = self._objects.length - 1; i >= 0; i--) {

      self.remove(self._objects[i]);

    }

  }

};

fabric.Canvas.prototype.getNewPositionNextToActiveObject = function (direction){
  let position = { x: 0, y: 0 };
  const activeObject = canvas.getActiveObject();
  if (!activeObject) return position;

  if (direction === 'right') {
    position = {
      x: activeObject.aCoords.tr.x + 10 + (activeObject.aCoords.tr.x - activeObject.aCoords.tl.x) / 2,
      y: activeObject.aCoords.tr.y + (activeObject.aCoords.br.y - activeObject.aCoords.tr.y) / 2
    };
  } else if (direction === 'bottom') {
    position = {
      x: activeObject.aCoords.bl.x + (activeObject.aCoords.br.x - activeObject.aCoords.bl.x) / 2,
      y: activeObject.aCoords.bl.y + 10 + (activeObject.aCoords.bl.y - activeObject.aCoords.tl.y) / 2
    };
  }
  return position;

}


fabric.Canvas.prototype.translateWidget =async function(language) {
  try {
    let newPosition = this.getNewPositionNextToActiveObject('right');
  

    if(this.getActiveObjects().length === 0) return;
   
      const currentSelectedWidgets = canvas.getActiveObjects().map(r=>r.toObject());
      const currentSelectedWidgetsWithIndex = currentSelectedWidgets.map((r) => r.text?r.text:'');
      // const tempCollectionWidgetWithIndex = tempCollectionWidgetsWithID.map((r, index) => ({ ...r, index }));


      const toTranslateWidgetString = JSON.stringify(currentSelectedWidgetsWithIndex);

      const translatePrompt = 
      `Translate this array of phrases into ${language}. Maintain the 
      original array format and include empty elements. The output should be in 
      a simple array format, like this(do not include the original array): [translatedPhrase1, translatedPhrase2, ...]. Here's the array to translate:
      ${toTranslateWidgetString}, result:
      ` 
      const translatedData = await Boardx.Instance.AIService.requestGPT3Process(translatePrompt, 0.2);

      if (!translatedData) throw new Error("No data received from translation service");

      const translatedDdataJson = JSON.parse(translatedData);
      const translatedWidgets = currentSelectedWidgets.map((row, index) => {
          const translatedText = translatedDdataJson[index]; //JSON.parse(translatedData).find(r => r.index === index)?.text || row.text;
          return { ...row, text: translatedText };
      });

      const boardId = store.getState().board.board._id;
      const userId = store.getState().user.userInfo.userId;
     
      canvas.discardActiveObject();
      canvas.requestRenderAll();
      await Boardx.Instance.ClipboardService.pasteCallback([], JSON.stringify({ data: translatedWidgets, type: 'whiteboard' }), newPosition, boardId, userId);
      // Boardx.Util.Msg.clear();
 
  } catch (error) {
      console.error("Error in translateWidget:", error);
      // Boardx.Util.Msg.clear();
      // Boardx.Util.Msg.warning(error);
      // Handle the error appropriately
  }
}
