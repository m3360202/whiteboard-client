//**Fabric */
import * as fabric  from '@boardxus/x-canvas';

//**Redux Store */
import store from '../../store';
import { handleWidgetMenuDisplay, handleSetConnectorMode, handleSetConnectorModifyMode } from '../../store/board';

//**Services */
import { WidgetService } from '../../services';

//**Utils */
import _ from 'lodash';
import showMenu from '../../board/widgetMenu/ShowMenu';
import { createLineFunc2 } from '../../board/boardMenu/events';

fabric.Arrow.prototype.initEvents = function(options) {

  const self: any = this;

  self.on('moving', e => {

    if (self.locked) return;

    if (
      (!self.connectorStart && !self.connectorEnd) ||
      (self.connectorStart &&
        self.connectorEnd &&
        self.connectorStart._id === self.connectorEnd._id)
    ) {
      self.recalcLinePoints(self);

      self.setCoords();
    }

    canvas.requestRenderAll();

  });
  
  self.on('mouseup', e => {

    showMenu();

    store.dispatch(handleSetConnectorModifyMode(false));

    store.dispatch(handleSetConnectorMode(false));

    self.zIndex = Date.now() * 100;

    self.saveData('MODIFIED', [
      'left',
      'top',
      'x1',
      'y1',
      'x2',
      'y2',
      'connectorStart',
      'connectorEnd',
      'scaleX',
      'scaleY',
      'zIndex'
    ]);

    this.canvas.setActiveObject(self);

  });

  self.on('selected', e => {
    const arrowObj = canvas.findById(self._id);
    if (
      arrowObj &&
      !arrowObj.connectorStart &&
      !arrowObj.connectorEnd &&
      !arrowObj.locked
    ) {
      this.lockMovementX = false;
      this.lockMovementY = false;
    } else {
      this.lockMovementX = true;
      this.lockMovementY = true;
    }

    canvas.requestRenderAll();
  });

  self.on('deselected', e => {

    const { deselected } = options;

    if (_.includes(deselected, self)) {

      self.recalcLinePoints(self);

      fabric.util.resetObjectTransform(self);

    }

  });

}

fabric.Arrow.prototype.mousedownProcess = function(transformData) {

  const { target} = transformData;

  if (target.locked) return;

  store.dispatch(handleWidgetMenuDisplay(false));

  store.dispatch(handleSetConnectorModifyMode(true));
}

fabric.Textbox.prototype.controlMousedownProcess = function(transformData) {

  const { target, ex, ey } = transformData;

  if (!target) return;

  target.isEditing= false;

  if (store.getState().board.connectorMode){
    return;
  }

  createLineFunc2({ x: ex, y: ey }, target);

}
fabric.Arrow.prototype.setConnectorObj = function(targetObject, pointer, isInOneObj, isStart) {

  let oldConnObj;

  const rPoint = targetObject.convertACoordToRCoord(pointer.x, pointer.y);

  const aPoint = pointer;

  if (isStart) {
    oldConnObj =
      //@ts-ignore
      this.connectorStart && this.connectorStart._id
        ? //@ts-ignore
        canvas.findById(this.connectorStart._id)
        : null;

    this.connectorStart = {
      _id: targetObject._id,
      rx: rPoint.x,
      ry: rPoint.y
    };

    //@ts-ignore
    this.set({
      x1: pointer.x,
      y1: pointer.y
    });

  } else {
    oldConnObj =
      //@ts-ignore
      this.connectorEnd && this.connectorEnd._id
        ? //@ts-ignore
        canvas.findById(this.connectorEnd._id)
        : null;
    this.connectorEnd = { _id: targetObject._id, rx: rPoint.x, ry: rPoint.y };

    this.set({
      x2: aPoint.x,
      y2: aPoint.y
    });

  }

  if (oldConnObj && oldConnObj._id && oldConnObj.lines) {
    this.removeArrowfromConnectObj(oldConnObj);
  }

  if (!targetObject.lines || targetObject.lines.length === 0) {

    targetObject.lines = [{ _id: this._id }];

  } else {

    const lines = [...targetObject.lines, { _id: this._id }];

    targetObject.lines = lines;

  }

  const updateData = [{_id: targetObject._id, lines: targetObject.lines}];

  WidgetService.getInstance().updateWidgetArr(updateData);

}