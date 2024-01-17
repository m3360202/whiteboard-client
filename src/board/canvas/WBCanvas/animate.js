import * as fabric  from '@boardxus/x-canvas';

 //** Import Redux toolkit
import store from '../../../store';
import { handleSetZoomFactor , handleWidgetMenuDisplay} from '../../../store/board';

import showMenu from '../../widgetMenu/ShowMenu';

fabric.Canvas.prototype.animateToRectForSlide = async function (
  width,
  height,
  vpt,
  vpCenter,
) {
  const self = this;

  // Calculate canvas width and height by subtracting the respective computed margins
  const canvasWidth = canvas.width - 270;
  const canvasHeight = canvas.width - 70-30;

  // Adjust zoom based on the ratio between the calculated canvas dimensions and given width, height
  const zoomAdjust = canvasWidth / width < canvasHeight / height  ? canvasWidth / width * 0.85 : (canvasHeight / height) * 0.85;

  // Calculate target zoom and viewport center by applying the zoom adjustment to the given viewport and center
  const targetZoom = vpt[0] * zoomAdjust;
  const targetVpCenter = {x:vpCenter.x+(135/zoomAdjust/vpt[0]),y:vpCenter.y+(15/zoomAdjust/vpt[0])};

  // Fetch the current zoom level and viewport center
  const currentZoom = canvas.getZoom();
  const currentVpCenter = canvas.getVpCenter();

  // Flag to handle animator abort
  canvas.stopAnimateToRect = false;

  await fabric.util.animate({

    startValue: 1,
    byValue: 60,
    endValue: 60,
    duration: 1000,
    // This function is called for every animation frame
    onChange(value) {

      // Calculate new X, Y coordinates and zoom level for each frame
      const newX =
        currentVpCenter.x +
        ((targetVpCenter.x - currentVpCenter.x) * value) / 60;
      const newY =
        currentVpCenter.y +
        ((targetVpCenter.y - currentVpCenter.y) * value) / 60;
      const newZoom = currentZoom + ((targetZoom - currentZoom) * value) / 60;

      // Apply new zoom and center for this frame
      self.zoomToCenterPoint(new fabric.Point(newX, newY), newZoom);

      self.requestRenderAll();
    },
    // Provide a function that checks whether the animation should be aborted
    abort() {
      return canvas.stopAnimateToRect;
    },
    // Easing function to make the animation feel more natural
    easing: fabric.util.ease.easeInSine,
    // Callback to be executed once animation is complete
    async onComplete() {

      // Set object coordinates for the elements that are in the viewport
      self._objects.forEach((o) => {
        if (o.isOnScreen()) {
          o.setCoords();
        }
      });

      // Update viewport after animation
      self.updateViewport();

      // Reset the abort animation flag
      canvas.stopAnimateToRect = false;

      // Dispatch zoom factor to the Redux store
      store.dispatch(handleSetZoomFactor(targetZoom));
    },
  });
};

fabric.Canvas.prototype.animateToRect = async function (
  width,
  height,
  vpt,
  vpCenter,
) {
  
  const self = this;

  const zoomAdjust =
    canvas.width / width < canvas.height / height
      ? canvas.width / width
      : (canvas.height / height) * 0.9;

  const targetZoom = vpt[0] * zoomAdjust;

  const targetVpCenter = vpCenter;

  const currentZoom = canvas.getZoom();

  const currentVpCenter = canvas.getVpCenter();

  canvas.stopAnimateToRect = false;

  await fabric.util.animate({
    startValue: 1,
    byValue: 60,
    endValue: 60,
    duration: 1000,
    onChange(value) {
      const newX =
        currentVpCenter.x +
        ((targetVpCenter.x - currentVpCenter.x) * value) / 60;
      const newY =
        currentVpCenter.y +
        ((targetVpCenter.y - currentVpCenter.y) * value) / 60;
      const newZoom = currentZoom + ((targetZoom - currentZoom) * value) / 60;
      self.zoomToCenterPoint(new fabric.Point(newX, newY), newZoom);
      self.requestRenderAll();
    },
    abort() {
      return canvas.stopAnimateToRect;
    },
    easing: fabric.util.ease.easeInSine,
    async onComplete() {
      self._objects.forEach((o) => {
        if (o.isOnScreen()) {
          o.setCoords();
        }
      });
      self.updateViewport();
      canvas.stopAnimateToRect = false;
      store.dispatch(handleSetZoomFactor(targetZoom));
    },
  });
};

fabric.Canvas.prototype.animateObjectToPosition = async function (
  currentObj, // The object we want to animate
  left, // The desired left-offset for the object after the animation
  top, // The desired top-offset for the object after the animation
) {

  canvas.stopAnimateObjectToPosition = false; // Flag used to potentially stop the animation

  let animating = false; // Initially, there is no animation

  // Using Fabric.js utility function to animate
  await fabric.util.animate({

    startValue: 1, // We start at this value

    byValue: 30, // Each frame, the value changes by this amount

    endValue: 30, // The animation will stop when reaching this value

    duration: 500, // The animation will run for 500ms

    onChange(value) { // This function will be called on every animation frame
      // Calculate new left and top values based on the interpolation between current and target values
      const newLeft = currentObj.left + ((left - currentObj.left) * value) / 30;

      const newTop = currentObj.top + ((top - currentObj.top) * value) / 30;

      currentObj.set({ left: newLeft, top: newTop }); // Update object's position.

      currentObj.dirty = true; // Mark the object as needing to be re-rendered

      // Request a render of the canvas on the next frame
      if (!animating) {

        animating = true;

        requestAnimationFrame(() => {

          canvas.requestRenderAll();

          animating = false;

        });
      }
    },

    // If this function returns true, the animation will abort.
    abort() {
      return canvas.stopAnimateObjectToPosition;
    },

    // A predefined easing function from Fabric.js is used for the animation
    easing: fabric.util.ease.easeInSine, 

    onComplete() { // This will be called when the animation is completed
      canvas.stopAnimateObjectToPosition = false;
      // Ensure the object is in the correct position at the end of the animation
      if (currentObj) currentObj.set({ left, top });
    },
  });
};

fabric.Canvas.prototype.animateToVpt = async function (vpt, vpCenter) {

  const self = this;

  const targetZoom = vpt[0]; // The desired zoom level

  const targetVpCenter = vpCenter; // The desired center of the viewport

  const currentZoom = canvas.getZoom(); // The current zoom level

  const currentVpCenter = canvas.getVpCenter(); // The current center of the viewport

  await fabric.util.animate({

    startValue: 1, // The start value for the animation

    endValue: 100, // The end value for the animation

    duration: 1000, // The duration of the animation in milliseconds

    onChange(value) {
      // Function to call on every animation frame.
      // It calculates the new viewport center and zoom level
      const newX =
        currentVpCenter.x +
        ((targetVpCenter.x - currentVpCenter.x) * value) / 100;

      const newY =
        currentVpCenter.y +
        ((targetVpCenter.y - currentVpCenter.y) * value) / 100;

      const newZoom = currentZoom + ((targetZoom - currentZoom) * value) / 100;

      self.zoomToCenterPoint(new fabric.Point(newX, newY), newZoom); // Sets the new zoom level and viewport center

      self.requestRenderAll(); // Asks for the canvas to be re-rendered
    },

    easing: fabric.util.ease.easeInOutQuad, // The easing function to use for the animation

    async onComplete() {
      // What to do when the animation is complete

      self._objects.forEach((o) => {

        if (o.isOnScreen()) {

          o.setCoords(); // Updates the coordinates of each object on the screen

        }

      });

      store.dispatch(handleSetZoomFactor(targetZoom)); // Send the final zoom factor to the Redux store

    },

  });

};

fabric.Canvas.prototype.zoomToObject = async function (obj) {

  const self = this;

  let object = obj ? obj : canvas.getActiveObject();//sometimes object can't pass to this function

  if(!object) return;

  // Determine the correct zoom adjustment based on object and canvas dimensions
  const zoomAdjust =
    (canvas.width / object.width) * object.scaleX <
      (canvas.height / object.height) * object.scaleY
      ? (canvas.width / object.width) * object.scaleX
      : (canvas.height / object.height) * object.scaleY * 0.8;

  // Calculate the target zoom factor
  const targetZoom = zoomAdjust * 0.5;

  // Get the center point of the object to be zoomed
  let targetVpCenter = object.getCenterPoint();

  // Get current zoom and viewport center
  const currentZoom = canvas.getZoom();

  const currentVpCenter = canvas.getVpCenter();

  
  targetVpCenter = {

    x: targetVpCenter.x,

    y: targetVpCenter.y + window.innerHeight * 0.05,

  };

  // Dispatch action to hide widget menu
  store.dispatch(handleWidgetMenuDisplay(false))

  // Animate the transition from the current viewport center and current zoom to the target center and zoom
  await fabric.util.animate({

    startValue: 1,

    endValue: 20,

    duration: 600,

    onChange(value) {

      // Compute the new viewport center x and y based on progress of the animation
      const newX =
        currentVpCenter.x +
        ((targetVpCenter.x - currentVpCenter.x) * value) / 20;

      const newY =
        currentVpCenter.y +
        ((targetVpCenter.y - currentVpCenter.y) * value) / 20;

      // Compute new zoom based on progress of the animation
      const newZoom = currentZoom + ((targetZoom - currentZoom) * value) / 20;

      // Zoom to the newly computed viewport center and zoom
      self.zoomToCenterPoint(new fabric.Point(newX, newY), newZoom);

      // Request a render of all the objects on the canvas
      self.requestRenderAll();

    },

    // Use quadratic ease-in-out for the animation
    easing: fabric.util.ease.easeInOutQuad,

    async onComplete() {

      // Show the menu once the animation is complete
      showMenu();

      // Dispatch the action to set the zoom factor to target zoom value
      store.dispatch(handleSetZoomFactor(targetZoom));

    },

  });
  
};
