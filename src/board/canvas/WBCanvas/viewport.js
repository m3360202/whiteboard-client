import * as fabric from '@boardxus/x-canvas';

//** Import Redux toolkit
import store from '../../../store';
import { handleSetZoomFactor } from '../../../store/board';

fabric.Canvas.prototype.updateViewport = function () {

  // Save the context of this to the variable self
  const self = this;

  // Get the current zoom level of the canvas
  const currentZoom = self.getZoom();

  // Get the current user
  const currentUser = store.getState().user.userInfo;

  // If there is no current user, stop the function
  if (!currentUser) return;

  // Get the top-left position of the canvas
  const point = self.getPositionOnCanvas(0, 0);

  // Calculate the left and top positions based on the whiteboard's width and height
  const left = (point.left / self.whiteboardWidth) * 192;
  const top = (point.top / self.whiteboardHeight) * 130;

  // Parse canvas width and height into integers
  const width2 = parseInt(canvas.width, 10);
  const height2 = parseInt(canvas.height, 10);

  // Compute the width and height based on the whiteboard dimensions and current zoom
  const width = (self.width / self.whiteboardWidth / currentZoom) * 192;
  const height = (self.height / self.whiteboardHeight / currentZoom) * 130;

  // Get the board's follow state
  const followMe = store.getState().board.followMe;

  // Update viewport remotely only if follow-me is enabled
  if (followMe) {

    self.toUpdateViewportRemote = {
      t: 4,
      d: {
        uno: store.getState().user.userInfo.userNo,
        v: self.viewportTransform,
        f: followMe ? 1 : 0,
        vx: left,
        vy: top,
        vw: width,
        vh: height,
        vw2: width2,
        vh2: height2,
        vpc: canvas.getVpCenter() // Getting the viewport center on the canvas
      }
    };
  }

  // Update viewport in local storage based on viewport transform
  this.updateViewportToLocalStorage(self.viewportTransform);
};


// Function to update local storage key 'viewportTransformation' with the current viewportTransform values
fabric.Canvas.prototype.updateViewportToLocalStorage = function (vpt) {

  const self = this;

  if (!self) return;

  let currentValue = {};

  // If there is an existing value for 'viewportTransformation' in local storage, assign it to currentValue
  if (
    localStorage.getItem('viewportTransformation') &&
    localStorage.getItem('viewportTransformation') !== ''
  ) {

    currentValue = JSON.parse(localStorage.getItem('viewportTransformation'));

  }

  // Adds/Updates the current viewportTransform value for the current board Id in the currentValue object
  currentValue[store.getState().board.board._id] = vpt;

  // Update 'viewportTransformation' in local storage with the updated currentValue object
  localStorage.setItem('viewportTransformation', JSON.stringify(currentValue));

};

fabric.Canvas.prototype.gobackToPreviousViewport = function () {

  // Assigning the current context to variable self
  const self = this;

  // If a previous viewport transformation was stored the current viewport should be:
  if (self.previousViewportTransform) {

    // Set to match the previous viewport transform
    self.viewportTransform = self.previousViewportTransform;

    // Update the zoom level to reflect the one stored in the previous viewport transform
    store.dispatch(handleSetZoomFactor(self.previousViewportTransform[0]));

    // Initialize the previous viewport transform
    self.previousViewportTransform = null;

    // Loop through all objects and update its coordinates if it's visible on screen
    self._objects.forEach(o => {

      if (o.isOnScreen()) {

        o.setCoords();

      }

    });

    // Render the entire canvas one more time
    self.requestRenderAll();

  }
};

// Function to recover the previously saved viewport's transformation
fabric.Canvas.prototype.recoverViewportTransformation = function (baordId) {

  let vp;

  // Assigning the current context to variable self
  const self = this;

  // Determine if the board is a new one based on the local storage
  const isNewBoard = localStorage.getItem('isNewBoard') ? localStorage.getItem('isNewBoard') : false;

  // If this is a new board
  if (isNewBoard) {

    // Remove the 'isNewBoard' item from local storage
    localStorage.removeItem('isNewBoard');

    // Set preViewport to its default value
    const preViewport = [1, 0, 0, 1, 0, 0];

    if (preViewport) {

      // Set preZoom equal to the first value in the preViewport array
      const preZoom = preViewport[0];

      // Dispatch an action to update the zoom level in the store
      store.dispatch(handleSetZoomFactor(preZoom));

      // Apply the preViewport transformation to the current viewport
      self.viewportTransform = preViewport;

    }

  }
  else {

    // Retrieve 'viewportTransformation' from local storage
    vp = localStorage.getItem('viewportTransformation');

    if (vp) {

      // Parse the viewport information retrieved from local storage
      const currentValue = JSON.parse(vp);

      // Extract the previously stored viewport transformation for the current board
      const preViewport = currentValue[baordId];

      if (preViewport) {

        // Set preZoom equal to the first value in the preViewport array
        const preZoom = preViewport[0];

        // Dispatch an action to update the zoom level in the store
        store.dispatch(handleSetZoomFactor(preZoom));

        // Apply the preViewport transformation to the current viewport
        self.viewportTransform = preViewport;

      }
    }
  }
};
