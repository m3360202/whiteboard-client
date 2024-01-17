import _ from 'lodash';
import * as fabric  from '@boardxus/x-canvas';

fabric.Canvas.prototype.getTopObjectByPointer = function (
  point,
  ismouseup,
  isFrom,
) {

  // Initialize all objects present on the canvas
  const objects = this.getObjects();

  // Array to store relevant objects
  const objArray = [];

  // Traversing each object to check if the point is within its bounds
  objects.forEach((obj) => {
    if (
      obj &&
      // Checking if the point is within the object
      obj.containsPointNew(point, ismouseup, isFrom) &&
      // Checking to ensure that the object is not of type "common" or "WBArrow"
      obj.obj_type !== 'common' &&
      obj.obj_type !== 'WBArrow'
    ) {
      // If all conditions met, object is pushed to the array
      objArray.push(obj);
    }
  });

  // Sorting the objects in the array based on their z-index
  objArray.sort((a, b) => b.zIndex - a.zIndex);

  // If array contains objects, return the top-most object (relative to the z-index)
  if (objArray.length > 0) {
    return objArray[0];
  }

  // Return null if no relevant objects found
  return null;

};

fabric.Canvas.prototype._getIntersectedObjects = function (object) {
  
  const self = this;

  // Initialize all objects present on the canvas, excluding objects of "common" type
  const objects = self._objects.filter((o) => o.obj_type !== 'common');

  // Array to store intersected objects
  const newArray = [];

  // Traversing each object to check if it intersects with the input object
  objects.forEach((obj) => {

    // Checking if the objects intersect
    const isIntersecting =
      object.intersectsWithObject(obj) ||
      object.isContainedWithinObject(obj) ||
      obj.isContainedWithinObject(object);

    // If the objects intersect and the object on the canvas is visible, it is added to the array
    if (isIntersecting && obj.visible) {
      newArray.push(obj);
    }
  });

  // Returns the array of intersected objects
  return newArray;
};

fabric.Canvas.prototype.sortByZIndex = function () {

  const self = this;

  // Sorting all objects on the canvas based on their z-index
  self._objects.sort((a, b) => a.zIndex - b.zIndex);

  // Rendering all changes
  self.requestRenderAll();

};

fabric.Canvas.prototype.createTopZIndex = function () {

  const self = this;

  let topZindex = Date.now() * 100;

  if (self._objects.length > 0) {

    self._objects.sort((a, b) => b.zIndex - a.zIndex);

    if (topZindex < self._objects[0].zIndex)

      topZindex = self._objects[0].zIndex + 1;

  }

  return topZindex;

};

/* to do: maybe improve this function to better handler the zindex change */
fabric.Canvas.prototype.createUniqueZIndex = function (inputZindex, tohigher) {

  // Define the scope as the canvas
  const self = this;

  // Initialise the way to create a unique zIndex 
  let uniqueZIndex;

  // Create a filtered array containing objects that have both an ID and a zIndex
  const objsWithId = self._objects.filter((o) => o._id && o.zIndex);

  // Find the index of the object that has the provided zIndex
  const inputIndx = objsWithId.findIndex((obj) => obj.zIndex === inputZindex);

  // Check if the z-index needs to be increased
  if (tohigher) {
    // go to higher ZIndex
    // If the object exists that has the index greater than the provided index
    if (objsWithId[inputIndx + 1]) {
      // set the new zIndex as the average between the original element z-index and the next one
      uniqueZIndex = 0.5 * (inputZindex + objsWithId[inputIndx + 1].zIndex);
    } else {
      // If there isn't a next object, increase the zIndex by 100
      uniqueZIndex = inputZindex + 100;
    }
  }

  // Check if the z-index needs to be decreased
  if (!tohigher) {
    // go to lower ZIndex
    // If there is a previous object 
    if (inputIndx > 0) {
      // set the new zIndex as the average between the original element z-index and the previous one
      uniqueZIndex = 0.5 * (inputZindex + objsWithId[inputIndx - 1].zIndex);
    } else {
      // If there isn't a previous object, decrease the zIndex by 100
      uniqueZIndex = inputZindex - 100;
    }
  }

  // Return the unique zIndex
  return uniqueZIndex;

};

fabric.Canvas.prototype.zindexArrBetween = function (lowz, highz, size) {

  // Calculate the interval between two indexes based on the number of elements between them
  const zInterval = size > 0 ? (highz - lowz) / (size + 1) : null;

  // If there is an interval
  if (zInterval) {
    // Increase the lower limit by the interval
    const newlowZ = lowz + zInterval;
    // Create an array that includes all the zIndex between lowz and highz
    const zindexArrB = _.range(newlowZ, highz, zInterval);

    // Return the array of z-indicies
    return zindexArrB;
  }
};

fabric.Canvas.prototype.updateFrameSubsZindex = function (
  frameObj,
  diferentZIndex,
) {
  // Define the scope as the canvas
  const self = this;

  // Get all sub objects from the frame object
  const frameSub = frameObj.subIdList();

  // If there are sub objects
  if (frameSub) {
    // Sort all sub objects from the frame object
    const subObjs = self.sortFrameSubs(frameSub);

    // Loop through each sub object
    for (let i = 0; i < subObjs.length; i++) {
      // Define the sub object at the current index
      const subObj = subObjs[i];
      // Update the z-index of the sub object based on the zIndex of the frame and the difference in zIndex
      subObj.zIndex = frameObj.zIndex + diferentZIndex + 0.05 * (i + 1);
      // Mark the object as "dirty", which means it needs rerendering
      subObj.dirty = true;
    }
  }
};

fabric.Canvas.prototype.toFrameTop = function (frameObj, subObj) {

  const self = this;

  // Get all sub object ids from the frame object
  const frameSub = frameObj.subIdList();

  // If there are more than 1 sub objects
  if (frameSub.length > 1) {

    // Sort all sub objects from the frame object
    const subObjs = self.sortFrameSubs(frameSub);

    // Get the highest z-index from the last object 
    const highZindex = subObjs[frameSub.length - 1].zIndex;

    // Update the z-index of the sub object to be more than the highest z-index
    subObj.zIndex = highZindex + 0.05;

    // Mark the object as "dirty", which means it needs rerendering
    subObj.dirty = true;

    // Sort all objects on the canvas by z-index
    self.sortByZIndex();
  }
};

fabric.Canvas.prototype.toFrameBottom = function (frameObj, subObj) {

  const self = this;

  // Get all sub object ids from the frame object
  const frameSub = frameObj.subIdList();

  // If there are more than 1 sub objects
  if (frameSub.length > 1) {

    // Sort all sub objects from the frame object
    const subObjs = self.sortFrameSubs(frameSub);

    // Get the lowest z-index from the first object
    const lowZindex = subObjs[0].zIndex;

    // Update the z-index of the sub object to be between the lowest z-index and the z-index of the frame object
    subObj.zIndex = 0.5 * (lowZindex + frameObj.zIndex);

    // Mark the object as "dirty", which means it needs rerendering
    subObj.dirty = true;

    // Sort all objects on the canvas by z-index
    self.sortByZIndex();
  }
};

fabric.Canvas.prototype.frameBackNForth = function (frameObj, isbackward) {

  const self = this;

  // Sort the intersecting objects of the frame
  const intersectingObjects = self.sortframeIntersects(frameObj);

  // Get the index of the frame object in the intersecting objects array
  const index = intersectingObjects.indexOf(frameObj);

  let newIndex;

  if (isbackward) {

    // If frame isn't the first object in intersecting objects array
    if (index > 0) {

      // Get new z-index less than the previous object's z-index
      newIndex = self.createUniqueZIndex(
        intersectingObjects[index - 1].zIndex,
        false,
      );

      // Save the new z-index to the frame object
      frameObj.frameSavezIndex(newIndex);
    }

  } else {

    let highZIndex;
    const nextObj = intersectingObjects[index + 1];

    if (nextObj) {

      // Check if next object is a WBRectPanel
      if (nextObj.obj_type === 'WBRectPanel') {

        // Get the highest z-index on the frame
        highZIndex = nextObj.getTopZindexonFrame();

      } else {

        // Or, just get the z-index of the next object
        highZIndex = nextObj.zIndex;
      }

      // Create new unique z-index greater than the next object's z-index
      newIndex = self.createUniqueZIndex(highZIndex, true);

      // And save it to the frame object
      frameObj.frameSavezIndex(newIndex);
    }
  }
};

fabric.Canvas.prototype.sortframeIntersects = function (frameObj) {

  const self = this;

  let intersectingObjects;

  const frameSub = frameObj.subIdList();

  const tempintersectingObjects = self._getIntersectedObjects(frameObj);

  if (frameSub) {

    /* exclude the subs from tempintersectingObjects */
    intersectingObjects = tempintersectingObjects.filter( (o) => o._id && !o.panelObj );

  } else {

    intersectingObjects = tempintersectingObjects;

  }

  intersectingObjects.sort((a, b) => a.zIndex - b.zIndex);

  return intersectingObjects;

};

fabric.Canvas.prototype.sortSubIntersects = function (frameObj, subObj) {

  const self = this;

  let intersectingObjects;

  const frameSub = frameObj.subIdList();

  const tempintersectingObjects = self._getIntersectedObjects(subObj);

  if (frameSub) {

    intersectingObjects = tempintersectingObjects.filter(
      (o) => o._id && frameSub.includes(o._id),
    );

  } else {

    intersectingObjects = tempintersectingObjects;

  }

  intersectingObjects.sort((a, b) => a.zIndex - b.zIndex);

  return intersectingObjects;

};

fabric.Canvas.prototype.sortFrameSubs = function (frameSub) {

  const self = this;

  const subObjs = self.getObjects().filter((o) => o._id && frameSub.includes(o._id));

  subObjs.sort((a, b) => a.zIndex - b.zIndex);

  return subObjs;

};

fabric.Canvas.prototype.onFrameBackward = function (frameObj, subObj) {

  const self = this;

  const intersectingObjects = self.sortSubIntersects(frameObj, subObj);

  const index = intersectingObjects.indexOf(subObj);

  if (index > 0) {

    const inputZ = intersectingObjects[index - 1].zIndex;

    frameObj.createUniqueZIndexonFrame(inputZ, subObj, false);

  }

};

fabric.Canvas.prototype.onFrameForward = function (frameObj, subObj) {

  const self = this;

  const intersectingObjects = self.sortSubIntersects(frameObj, subObj);

  const index = intersectingObjects.indexOf(subObj);

  if (intersectingObjects[index + 1].zIndex) {

    const inputZ = intersectingObjects[index + 1].zIndex;

    frameObj.createUniqueZIndexonFrame(inputZ, subObj, true);

  }

};
