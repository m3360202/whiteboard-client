import * as fabric from '@boardxus/x-canvas';

//Services
import { WidgetService } from '../../../services/index';
import { cursorLock } from '../../svg/cursorLock';

fabric.Canvas.prototype.lockObject = function (o) {

  // If there is an object AND this object has WBRectPanelId property, then just return.
  // The function lockObject will run no further.
  if (o && o.WBRectPanelId) return;

  // Start locking the object by calling many set methods on it.
  // Set isEditing property false which prevent object to be edited
  // Set other lock properties true to lock the object movement, scaling, skewing and rotation.
  // Set editable property false to protect the object from any edits
  o.set('isEditing', false)
    .set('lockMovementX', true)
    .set('lockMovementY', true)
    .set('locked', true)
    .set('lockScalingX', true)
    .set('lockScalingY', true)
    .set('lockSkewingX', true)
    .set('lockSkewingY', true)
    .set('lockRotation', true)
    .set('editable', false);
},

  // Add a method for fabric.Canvas to unlock an object
  fabric.Canvas.prototype.unLockObject = function (o) {

    // Start unlocking the object by calling many set methods on it.
    // Set lock properties false to allow object movement, scaling, skewing and rotation.
    // Set selectable property true to allow object to be selected.
    // Set editable property true to make the object editable.
    o.set('lockMovementX', false)
      .set('lockMovementY', false)
      .set('locked', false)
      .set('lockScalingX', false)
      .set('lockScalingY', false)
      .set('lockSkewingX', false)
      .set('lockSkewingY', false)
      .set('lockRotation', false)
      .set('selectable', true)
      .set('editable', true);
  },

  fabric.Canvas.prototype.lockObjectsInCanvas = function () {

    // If the canvas or its objects are undefined or null, just return
    if (!this || !this.getObjects()) return;

    // Otherwise, for each object in the canvas...
    this.getObjects().forEach(o => {

      // If the object is of type 'common', or a temporary widget, or an arrow connector, skip it
      if (
        o.obj_type === 'common' ||
        o === canvas.drawTempWidget ||
        o === canvas.connectorArrow
      ) {
        return;
      }

      // If the object has a WBRectPanelId property, skip it
      else if (o && o.WBRectPanelId) {
        return;
      }

      // Lock all other objects
      else {
        o.set({

          lockMovementX: true,

          lockMovementY: true,

          lockRotation: true,

          lockScalingX: true,

          lockScalingY: true,

          locked: true,

          editable: false,

          selectable: false

        })

      }

    });

  },

// Adding a function to fabric.Canvas to unlock all objects in the canvas 
fabric.Canvas.prototype.unlockObjectsInCanvas = function () {

    const self = this;

    // If the canvas or its objects are undefined or null, just return
    if (!self || !self.getObjects()) return;

    // Otherwise, for each object in the canvas...
    self.getObjects().forEach(o => {

      // If the object is of type 'common', skip it
      if (o.obj_type === 'common') return;

      // Unlock the object, restoring its status from the Collection
      self.recoverLockStatusFromCollection(o);

      // Mark the object as dirty (requiring a re-render)
      o.dirty = true;

      // Change the cursor to the default style`
      self.hoverCursor = 'default';

    });

  }

  fabric.Canvas.prototype.recoverLockStatusFromCollection = function (o) {

    // Get the instance of the widget using it's id from the widget service
    const widget = WidgetService.getInstance().getWidgetFromWidgetList(o._id);

    // If widget is not found return
    if (!widget) return;

    // Set the properties of the object o with the respective properties of the found widget
    o.lockMovementX = widget.lockMovementX;

    o.lockMovementY = widget.lockMovementY;

    o.lockRotation = widget.lockRotation;

    o.lockScalingX = widget.lockScalingX;

    o.lockScalingY = widget.lockScalingY;
    
    // Set the locked status. If not available in widget set it as false
    o.locked = widget.locked ? widget.locked : false;

    // Set the editable status. If not available in widget set it as false
    o.editable = widget.editable ? widget.editable : false;
    o.selectable = widget.selectable ? widget.selectable : false;
    // Set the dirty status as true to indicate that the object has been modified
    o.dirty = true;

    // If object is locked, set the cursor icon as lock else set it to default
    if (o.locked === true) {

      o.hoverCursor = `url("${cursorLock}") 0 0, auto`;

    } else {

      o.hoverCursor = 'default';

    }

  },
  
  fabric.Canvas.prototype.lockAllOperatorOnObjectsInCanvas = function() {

   /* Fetch all the objects from canvas and apply a function on each of them
   *  If the object type is common or if the object is a temporary widget or connector widget, return
   *  Else, set all the movement, rotation and scaling operations to true and enabled status to false
   *  Save the initial status of the object in beforeStatus variable
  */
  
    this.getObjects().forEach(o => {

      if (
        o.obj_type === 'common' ||
        o === canvas.drawTempWidget ||
        o === canvas.connectorArrow
      ) {

        return;

      }

      const tempStatus = {

        lockMovementX: o.lockMovementX,
        lockMovementY: o.lockMovementY,
        lockRotation: o.lockRotation,
        lockScalingX: o.lockScalingX,
        lockScalingY: o.lockScalingY,
        locked: o.locked || false,
        editable: o.editable || false,

      };

      o.set({

        lockMovementX: true,

        lockMovementY: true,

        lockRotation: true,

        lockScalingX: true,

        lockScalingY: true,

        locked: true,

        editable: false,

        beforeStatus: tempStatus

      })

    });
  },
  
  fabric.Canvas.prototype.unlockAllOperatorOnObjectsInCanvas = function () {
  
   /* Fetch all the objects from the canvas and apply a function on each of them
   *  If the object type is common or if the object is a temporary widget or connector widget, return
   *  If the initial status was saved, set the object back to initial status
   *  Else, set all the movement, rotation and scaling operations to false and enabled status to true
   *  Mark the object as modified by setting the dirty status to true
  */

    this.getObjects().forEach(o => {

      if (
        o.obj_type === 'common' ||
        o === canvas.drawTempWidget ||
        o === canvas.connectorArrow
      ) {
        return;
      }

      if (o.beforeStatus) {

        o.lockMovementX = o.beforeStatus.lockMovementX;
        o.lockMovementY = o.beforeStatus.lockMovementY;
        o.lockRotation = o.beforeStatus.lockRotation;
        o.lockScalingX = o.beforeStatus.lockScalingX;
        o.lockScalingY = o.beforeStatus.lockScalingY;
        o.locked = o.beforeStatus.locked;
        o.editable = o.beforeStatus.editable;


      } else {

        o.lockMovementX = false;
        o.lockMovementY = false;
        o.lockRotation = false;
        o.lockScalingX = false;
        o.lockScalingY = false;
        o.locked = false;
        o.editable = true;
        o.selectable = true;

      }

      o.dirty = true;

    });
  }

