/* eslint-disable no-restricted-syntax */
//**Fabric */
import * as fabric from '@boardxus/x-canvas';

//**Services */
import { WidgetService } from '../../services';

//**Redux Store */
import store from '../../store';

//**Utils */
import _ from 'lodash';
import __ from 'underscore';

fabric.Object.prototype.originX = 'center';
fabric.Object.prototype.originY = 'center';
fabric.Object.prototype.statefullCache = false;
fabric.Object.prototype.noScaleCache = true;
fabric.Object.prototype.borderScaleFactor = 2;
fabric.Object.prototype.padding = 0;
fabric.Object.prototype.selectable = true;
fabric.Object.prototype.isRemoteEditing = false;
fabric.Object.prototype.RemoteUserWhoEditing = '';
fabric.Object.prototype.NUM_FRACTION_DIGITS = 2;
fabric.Object.prototype.activeOn = 'down';
fabric.Object.prototype.borderColor = '#31a4f5';
fabric.Object.prototype.cornerSize = 12;
fabric.Object.prototype.hasRotatingPoint = false;
fabric.Object.prototype.minScaleLimit = 0.01;
fabric.Object.prototype.locked = false;
fabric.Object.prototype.isLoading = false;


fabric.Object.prototype.getText = function () {
  return this.text?this.text:'';
}

fabric.Object.prototype.containsPointNew = function (point, ismouseup, isFrom) {

  const self = this;

  let objContains = false;

  if (!self || self === undefined) return objContains;

  if (ismouseup) {

    const insideObj = this.extContainsPoint(point);

    if (insideObj) {

      objContains = true;

    } else {

      const Apoint = self.convertACoordToRCoord(point.x, point.y);

      const currZoom = canvas.getZoom();

      const edgeoff = 0.25;

      const condition1 =
        Math.abs(Apoint.x) > 0.5 &&
        Math.abs(Apoint.x) < 0.5 + edgeoff &&
        Math.abs(Apoint.y) <= 0.5;

      const condition2 =
        Math.abs(Apoint.y) > 0.5 &&
        Math.abs(Apoint.y) < 0.5 + edgeoff &&
        Math.abs(Apoint.x) <= 0.5;

      if (condition1) {

        objContains = true;

      } else if (condition2) {

        objContains = true;

      }

      // if consider the four middle controls, we can add conditions here
      // using the following values: self.cornerSize, self.controls.xxx.offsetX/offsetY,
      const corSize = self.cornerSize + 10;

      let offX;

      let offY;

      const Lpoint = self.convertRCoordToACoord(-0.6, 0.0);

      const Rpoint = self.convertRCoordToACoord(0.6, 0.0);

      const Tpoint = self.convertRCoordToACoord(0.0, -0.6);

      const Bpoint = self.convertRCoordToACoord(0.0, 0.6);

      offX = self.controls.mla.offsetX;

      const mlxmin = Lpoint.x + (offX - 0.5 * corSize) / currZoom;

      const mlxmax = Lpoint.x + (offX + 0.5 * corSize) / currZoom;

      const mlrymin = Lpoint.y + (-0.5 * corSize) / currZoom;

      const mlrymax = Lpoint.y + (0.5 * corSize) / currZoom;

      if (
        point.x > mlxmin &&
        point.x < mlxmax &&
        point.y > mlrymin &&
        point.y < mlrymax
      ) {
        // the mouse up at mla
        if (isFrom) {

          canvas.arrowStartObject = self;

          canvas.arrowStartRx = -0.5;

          canvas.arrowStartRy = 0.0;

        } else {

          canvas.arrowEndObject = self;

          canvas.arrowEndRx = -100;

          canvas.arrowEndRy = 100;

        }

        objContains = true;

      }

      // mra
      offX = self.controls.mra.offsetX;

      const mrxmin = Rpoint.x + (offX - 0.5 * corSize) / currZoom;

      const mrxmax = Rpoint.x + (offX + 0.5 * corSize) / currZoom;

      if (
        point.x > mrxmin &&
        point.x < mrxmax &&
        point.y > mlrymin &&
        point.y < mlrymax
      ) {
        // the mouse up at mra
        if (isFrom) {

          canvas.arrowStartObject = self;

          canvas.arrowStartRx = 0.5;

          canvas.arrowStartRy = 0.0;

        } else {

          canvas.arrowEndObject = self;

          canvas.arrowEndRx = 0.5;

          canvas.arrowEndRy = 0.0;

        }

        objContains = true;

      }

      // mta
      offY = self.controls.mta.offsetY;

      const mtbxmin = Tpoint.x + (-0.5 * corSize) / currZoom;

      const mtbxmax = Tpoint.x + (+0.5 * corSize) / currZoom;

      const mtymin = Tpoint.y + (offY - 0.5 * corSize) / currZoom;

      const mtymax = Tpoint.y + (offY + 0.5 * corSize) / currZoom;

      if (
        point.x > mtbxmin &&
        point.x < mtbxmax &&
        point.y > mtymin &&
        point.y < mtymax
      ) {
        // the mouse up at mta
        if (isFrom) {
          canvas.arrowStartObject = self;
          canvas.arrowStartRx = 0.0;
          canvas.arrowStartRy = -0.5;
        } else {
          canvas.arrowEndObject = self;
          canvas.arrowEndRx = 0.0;
          canvas.arrowEndRy = -0.5;
        }

        objContains = true;
      }

      // mba
      offY = self.controls.mba.offsetY;
      const mbymin = Bpoint.y + (offY - 0.5 * corSize) / currZoom;
      const mbymax = Bpoint.y + (offY + 0.5 * corSize) / currZoom;

      if (
        point.x > mtbxmin &&
        point.x < mtbxmax &&
        point.y > mbymin &&
        point.y < mbymax
      ) {
        // the mouse up at mba
        if (isFrom) {
          canvas.arrowStartObject = self;
          canvas.arrowStartRx = 0.0;
          canvas.arrowStartRy = 0.5;
        } else {
          canvas.arrowEndObject = self;
          canvas.arrowEndRx = 0.0;
          canvas.arrowEndRy = 0.5;
        }

        objContains = true;
      }
    }
  } else {
 
    objContains = this.extContainsPoint(point);
  }

  return objContains;
};

fabric.Object.prototype.frameExtentContainsPoint = function (point) {

  const self = this;

  let minx;

  let maxx;

  let miny;

  let maxy;

  if (self.group) {
    const point1 = Boardx.Util.getOnePointOnCanvasInGroupFrame(self, {
      x: self.aCoords.tl.x,
      y: self.aCoords.tl.y
    });
    const point2 = Boardx.Util.getOnePointOnCanvasInGroupFrame(self, {
      x: self.aCoords.br.x,
      y: self.aCoords.br.y
    });
    minx = point1.x;
    maxx = point2.x;
    miny = point1.y;
    maxy = point2.y;
  } else {
    minx = self.aCoords.tl.x;
    maxx = self.aCoords.br.x;
    miny = self.aCoords.tl.y;
    maxy = self.aCoords.br.y;
  }
  if (
    point.x >= minx &&
    point.x <= maxx &&
    point.y >= miny &&
    point.y <= maxy
  ) {
    return true;
  }

  return false;
};


fabric.Object.prototype.convertACoordToRCoord = function (ax, ay) {

  const target = this;

  const obj = canvas.findById(target._id);

  if (!obj) return null;

  const { left, top, width, height, scaleX, scaleY, angle } = obj;

  // be sure, the origin is at center
  const angleT = (angle * Math.PI) / 180;

  const deltaX = ax - left;

  const deltaY = ay - top;

  const rx = (deltaX * Math.cos(angleT) + deltaY * Math.sin(angleT)) / (width * scaleX);

  const ry = (-deltaX * Math.sin(angleT) + deltaY * Math.cos(angleT)) /  (height * scaleY);

  return {
    x: parseFloat(rx.toFixed(3)),
    y: parseFloat(ry.toFixed(3))
  };

};

fabric.Object.prototype.convertRCoordToACoord1 = function (rx, ry) {

  const target = this;

  const obj = canvas.findById(target._id);

  if (!obj) return null;

  const { left, top, width, height, scaleX, scaleY, angle } = obj;

  const angle1 = (angle * Math.PI) / 180;

  let offsetX = 0;

  let offsetY = 0;

  if (rx <= 0 && ry <= 0) {
    if (rx < ry) {
      rx = -0.5;
      ry = 0;
      offsetX = 0;
    } else {
      rx = 0;
      ry = -0.5;
      offsetY = 0;
    }
  }

  if (rx <= 0 && ry >= 0) {
    if (Math.abs(rx) > ry) {
      rx = -0.5;
      ry = 0;
      offsetX = 0;
    } else {
      rx = 0;
      ry = 0.5;
      offsetY = 0;
    }
  }

  if (rx >= 0 && ry >= 0) {
    if (rx > ry) {
      rx = 0.5;
      ry = 0;
      offsetX = 0;
    } else {
      rx = 0;
      ry = 0.5;
      offsetY = 0;
    }
  }

  if (rx >= 0 && ry <= 0) {
    if (rx > Math.abs(ry)) {
      rx = 0.5;
      ry = 0;
      offsetX = 0;
    } else {
      rx = 0;
      ry = -0.5;
      offsetY = 0;
    }
  }

  const ax =
    (rx * Math.cos(angle1) + ry * Math.sin(angle1)) * (width * scaleX) +
    left +
    offsetX;

  const ay =
    (-rx * Math.sin(angle1) + ry * Math.cos(angle1)) * (height * scaleY) +
    top +
    offsetY;

  return {
    x: parseFloat(ax.toFixed(3)),
    y: parseFloat(ay.toFixed(3))
  };
};

fabric.Object.prototype.convertRCoordToACoord = function (rx, ry) {

  const target = this;

  const obj = canvas.findById(target._id);

  if (!obj) return null;

  const { left, top, width, height, scaleX, scaleY, angle } = obj;

  const angle1 = (angle * Math.PI) / 180;

  const ax = (rx * Math.cos(angle1) + ry * Math.sin(angle1)) * (width * scaleX) + left;

  const ay = (-rx * Math.sin(angle1) + ry * Math.cos(angle1)) * (height * scaleY) + top;

  return {
    x: parseFloat(ax.toFixed(3)),
    y: parseFloat(ay.toFixed(3))
  };

};

fabric.Object.prototype.convertRCoordToACoordPartialAS = function (rx, ry) {

  const target = this;

  const obj = canvas.findById(target._id);

  if (obj && obj.group) {

    const point0 = Boardx.Util.getPointOnCanvasInGroup(target);
    
    const left = point0.x;

    const top = point0.y;

    // be sure, the origin is at center
    const angle = (canvas.findById(target._id).angle * Math.PI) / 180;

    const { width } = canvas.findById(target._id);

    const { height } = canvas.findById(target._id);

    const scaleX = canvas.findById(target._id).scaleX * obj.group.scaleX;

    const scaleY = canvas.findById(target._id).scaleY * obj.group.scaleY;

    if (rx < -0.5) rx = -0.5;

    if (ry < -0.5) ry = -0.5;

    if (rx > 0.5) rx = 0.5;

    if (ry > 0.5) ry = 0.5;

    const ax = (rx * Math.cos(angle) + ry * Math.sin(angle)) * (width * scaleX) + left;

    const ay = (-rx * Math.sin(angle) + ry * Math.cos(angle)) * (height * scaleY) + top;

    const aax = parseFloat(ax.toFixed(3)); // this reduces digits after decimal not working

    const aay = parseFloat(ay.toFixed(3));

    const point = {
      x: aax,
      y: aay
    };

    return point;
  }
};

let idsingroup;

let ASnoarrow;

let ASarrow;

fabric.Object.prototype.saveData = async function (action, fields) {

  const target = this;

  const context = {};

  context.fields = fields;

  idsingroup = [];

  ASnoarrow = [];

  ASarrow = [];

  if (
    target.obj_type === 'WBRectNotes' ||
    target.obj_type === 'WBCircleNotes'
  ) {
    target.lastEditedBy = store.getState().user.userInfo.userId;
  }

  canvas.requestRenderAll();

  // update group
  if (target.isActiveSelection()) {

    let newState = [];

    for (const obj of target.getObjects()) {

      if (obj._id) {

        idsingroup.push(obj._id);

        if (obj.obj_type === 'WBArrow') {
          ASarrow.push(obj._id);
        }

        if (obj.obj_type !== 'WBArrow') {
          ASnoarrow.push(obj._id);
        }

        if (
          obj.obj_type === 'WBRectNotes' ||
          obj.obj_type === 'WBCircleNotes'
        ) {
          obj.lastEditedBy = store.getState().user.userInfo.userId;
        }
      }
    }
    if (action === 'SCALED') {

      for (let i = 0; i < ASnoarrow.length; i++) {

        const obj = canvas.findById(ASnoarrow[i]);

        if (obj.obj_type === 'WBShapeNotes') {
          const state = obj.getModifiedObject([
            'width',
            'height',
            'left',
            'top',
            'shapeScaleX',
            'scaleX',
            'scaleY',
            'flipX',
            'flipY',
            'maxHeight',
            'fixedScaleChange'
          ]);

          newState = newState.concat(state);

        } else {

          const state = obj.getUndoRedoState(action, context);

          newState = newState.concat(state);

        }
      }
      // update arrow
      for (let i = 0; i < ASarrow.length; i++) {

        const obj = canvas.findById(ASarrow[i]);

        const state = obj.getUndoRedoState(action, context);

        newState = newState.concat(state);
      }

      canvas.pushNewState(newState);

      const objArras = [];

      let obj = null;

      for (let i = 0; i < ASarrow.length; i++) {

        obj = canvas.findById(ASarrow[i]);

        obj.resetStrokeAfterScaling();

        objArras.push(obj);
      }
      for (let i = 0; i < ASnoarrow.length; i++) {
        obj = canvas.findById(ASnoarrow[i]);
        objArras.push(obj);
      }

    } 
    else if (action === 'MOVED') {

      for (let i = 0; i < ASnoarrow.length; i++) {
        const obj = canvas.findById(ASnoarrow[i]);
        const state = obj.getUndoRedoState(action, context);
        newState = newState.concat(state);
      }

      for (let i = 0; i < ASarrow.length; i++) {
        const obj = canvas.findById(ASarrow[i]);
        const state = obj.getUndoRedoState(action, context);
        newState = newState.concat(state);
      }

      canvas.pushNewState(newState);

    } else {

      for (let i = 0; i < idsingroup.length; i++) {
        const obj = canvas.findById(idsingroup[i]);
        const state = obj.getUndoRedoState(action, context);
        newState = newState.concat(state);
      }

      canvas.pushNewState(newState);
    }
  } else if (
    target.obj_type &&
    target.obj_type !== 'common' &&
    !target.isPanelTitle
  ) {

    if (
      target.obj_type === 'WBRectPanel' &&
      fields &&
      fields.length === 1 &&
      fields[0] === 'zIndex'
    ) {
      const frameSubs = target.subIdList();
      if (frameSubs < 1) {
        const newState = target.getUndoRedoState(action, context);
        canvas.pushNewState(newState);
      } else {
        let newState = [];
        const fmState = target.getUndoRedoState(action, context);
        newState = newState.concat(fmState);
        for (let i = 0; i < frameSubs.length; i++) {
          const obj = canvas.findById(frameSubs[i]);
          const state = obj.getUndoRedoState(action, context);
          newState = newState.concat(state);
        }
        canvas.pushNewState(newState);
      }
      // } else if (action === 'SCALED' && target.obj_type === 'WBShapeNotes') {
      //   // skip, already handled in other place
    } else {
      const newState = target.getUndoRedoState(action, context);
      canvas.pushNewState(newState);
    }

    if (
      target.obj_type === 'WBRectNotes' ||
      target.obj_type === 'WBCircleNotes'
    ) {
      canvas.changeDefaulNote(target);
      target.styles = {};
    }
  }
};

/**
 * return all the relevant objects' state as an array, it is for single widget,
 * but it will compile the relevant widget state around this widget
 * @param {String} action
 * @param {*} context
 * @returns array
 */
fabric.Object.prototype.getUndoRedoState = function (action, context) {

  let stateList = [];

  const target = this;

  const fields = context && context.fields ? context.fields : [];

  if (target.obj_type === 'common') return [];

  if (action === 'ADDED') {

    const state = {};
    const newState = target.getObject();
    state.targetId = target._id;
    state.activeselection = true;
    state.newState = newState;
    state.action = 'ADDED';
    stateList.push(state);

  }

  if (action === 'PASTE') {

    const state = {};
    state.activeselection = true;
    if (target.obj_type === 'WBArrow') {
      target.getresetArrowaftermoving();
    }
    state.newState = target.getObject();
    state.targetId = target._id;
    state.action = 'PASTE';
    stateList.push(state);

  }

  if (action === 'REMOVED') {
    const state = {
      activeselection: true,
      originalState: {},
      targetId: target._id,
      action: 'REMOVED'
    };
    if (target.isActiveSelection()) {
      const point = Boardx.Util.getPointOnCanvasInGroup(target);
      state.originalState = canvas.getActiveObject();
      state.originalState.left = point.x;
      state.originalState.top = point.y;
    }
    stateList.push(state);

    if (target.panelObj) {
      const panel = canvas.findById(target.panelObj);
      if (panel) {
        const state2 = panel.getModifiedObject(['subObjs']);
        stateList.push(state2);
      }
    }

    if (target.obj_type === 'WBArrow') {

      const lineWidget = target;

      if (lineWidget) {

        canvas.updateConnectorsRemovedWidget(target);

        if (target.connectorStart) {

          const connectorStartId = target.connectorStart._id;

          const objStart =  WidgetService.getInstance().getWidgetFromWidgetList(connectorStartId) || {}; // from DB
        
          const canvasObjStart = canvas.findById(connectorStartId); // from canvas

          if (objStart && objStart.lines && canvasObjStart) {

            const stateConnectorStart = canvasObjStart.getModifiedObject([
              'lines'
            ]);

            stateList.push(stateConnectorStart);
        
          }
        }

        if (target.connectorEnd) {

          const connectorEndId = target.connectorEnd._id;

          const objEnd =  WidgetService.getInstance().getWidgetFromWidgetList(connectorEndId) || {};

          const canvasObjEnd = canvas.findById(connectorEndId); // from canvas

          if (objEnd && objEnd.lines && canvasObjEnd) {

            const stateConnectorEnd = canvasObjEnd.getModifiedObject(['lines']);

            stateList.push(stateConnectorEnd);

          }
        }

        state.originalState = target;
      }
    }
    if(target.obj_type &&  target.obj_type!=='WBArrow'){

      state.originalState = canvas.findById(target._id);

    }
  }

  if (action === 'MOVED') {

    // if the binding panel is changed
    let boolObjWithArrow = true;

    const bindIndicator = -1;

    if (bindIndicator >= 0) {

      boolObjWithArrow = false;

      let bindState = {};

      switch (bindIndicator) {
        case 0:
          bindState = target.getFrameBind('UNBIND', [
            'left',
            'top',
            'panelObj',
            'relationship',
            'zIndex'
          ]);
          stateList.push(bindState);
          break;
        case 1:
        case 2:
          bindState = target.getFrameBind('BIND', [
            'left',
            'top',
            'panelObj',
            'relationship',
            'zIndex'
          ]);
          stateList.push(bindState);
          break;
        case 3:
          bindState = target.getModifiedObject(['left', 'top', 'relationship']);
          stateList.push(bindState);
          break;
        default:
          break;
      }
    }
    // if it is connected with arrows
    if (target.lines && target.lines.length > 0) {

      for (let i = 0; i < target.lines.length; i++) {

        const line = target.lines[i];

        const lineWidget = canvas.findById(line._id);

        if (!lineWidget) break;

        if (ASarrow && ASarrow.includes(line._id) && ASnoarrow.includes(target._id)) {

          // both objs in AS
          if (!lineWidget.connectorStart || !lineWidget.connectorEnd) {
            // one end is empty
            const point0 = Boardx.Util.getPointOnCanvasInGroup(lineWidget);
            const point1 = Boardx.Util.getOnePointOnCanvasInGroup(lineWidget, {
              x: lineWidget.x1,
              y: lineWidget.y1
            });
            const point2 = Boardx.Util.getOnePointOnCanvasInGroup(lineWidget, {
              x: lineWidget.x2,
              y: lineWidget.y2
            });
            const point3 = Boardx.Util.getOnePointOnCanvasInGroup(lineWidget, {
              x: lineWidget.left,
              y: lineWidget.top
            });
            lineWidget.set({
              x1: point1.x + point0.x - point3.x,
              y1: point1.y + point0.y - point3.y,
              x2: point2.x + point0.x - point3.x,
              y2: point2.y + point0.y - point3.y,
              left: -point0.x + point3.x,
              top: -point0.y + point3.y
            });
            lineWidget.setCoords();
            lineWidget.set('zIndex', Date.now() * 100);
            canvas.anyChange = true;
            const lineState = canvas
              .findById(line._id)
              .getModifiedObject([
                'left',
                'top',
                'x1',
                'y1',
                'x2',
                'y2',
                'zIndex'
              ]);
            stateList.push(lineState);
          }
          // do nothing, it will handle the arrow and onj separately
        } else if (ASnoarrow && ASnoarrow.includes(target._id)) {
          // obj in AS but its lines not in AS
          canvas.onObjectModifiedUpdateArrowsSave(target);

          lineWidget.set('zIndex', Date.now() * 100);
          canvas.sortByZIndex();
          const lineState = canvas
            .findById(line._id)
            .getModifiedObject([
              'left',
              'top',
              'x1',
              'y1',
              'x2',
              'y2',
              'scaleX',
              'scaleY',
              'zIndex'
            ]);
          stateList.push(lineState);
        } else {
          // none in AS
          canvas.onObjectModifiedUpdateArrowsSave(target);

          lineWidget.set('zIndex', Date.now() * 100);
          canvas.sortByZIndex();
          const lineState = canvas
            .findById(line._id)
            .getModifiedObject([
              'left',
              'top',
              'x1',
              'y1',
              'x2',
              'y2',
              'scaleX',
              'scaleY',
              'zIndex'
            ]);
          stateList.push(lineState);
        }
      }
      if (boolObjWithArrow) {
        const state = target.getMovedObject();
        stateList.push(state);
        boolObjWithArrow = false;
      }
    } 
    else if (target.obj_type === 'WBArrow') {
      if (ASarrow && ASarrow.includes(target._id)) {
        if (target.connectorStart || target.connectorEnd) {
          let csid;
          let ceid;
          if (target.connectorStart) csid = target.connectorStart._id;
          if (target.connectorEnd) ceid = target.connectorEnd._id;
          if (csid) {
            const csObj = canvas.findById(csid);
            if (ASnoarrow.includes(csid)) {
              if (ceid) {
                if (ASnoarrow.includes(ceid)) {
                  const stateArrow = target.getMovedObject();
                  stateList.push(stateArrow);
                } else {
                  // connectorEnd not in AS

                  canvas.onObjectModifiedUpdateArrowsSave(csObj);

                  target.set('zIndex', Date.now() * 100);
                  canvas.sortByZIndex();
                  const lineState = canvas
                    .findById(target._id)
                    .getModifiedObject([
                      'left',
                      'top',
                      'x1',
                      'y1',
                      'x2',
                      'y2',
                      'scaleX',
                      'scaleY',
                      'zIndex'
                    ]);
                  stateList.push(lineState);
                }
              }
            } else if (ceid && ASnoarrow.includes(ceid)) {
              const ceObj = canvas.findById(ceid);
              canvas.onObjectModifiedUpdateArrowsSave(ceObj);

              target.set('zIndex', Date.now() * 100);
              canvas.sortByZIndex();
              const properties = [
                'left',
                'top',
                'x1',
                'y1',
                'x2',
                'y2',
                'scaleX',
                'scaleY',
                'zIndex'
              ];
              const lineState = canvas
                .findById(target._id)
                .getModifiedObject(properties);
              stateList.push(lineState);
            }
          }

          if (
            csid &&
            ASnoarrow.includes(csid) &&
            ceid &&
            ASnoarrow.includes(ceid)
          ) {
            // all in AS: arrow and its both ends
            const stateArrow = target.getMovedObject();
            stateList.push(stateArrow);
          }
          boolObjWithArrow = false;
        } else {
          const stateArrow = target.getMovedObject();
          stateList.push(stateArrow);
          boolObjWithArrow = false;
        }
      } else if (!target.connectorStart && !target.connectorEnd) {
        const stateArrow = target.getMovedObject();
        stateList.push(stateArrow);
        boolObjWithArrow = false;
      } else if (
        target.connectorStart &&
        target.connectorEnd &&
        target.connectorStart._id === target.connectorEnd._id
      ) {
        const otherObj = canvas.findById(target.connectorStart._id);
        if (target.isContainedWithinObject(otherObj)) {
          target.setCoords();
          const currentWIdget = WidgetService.getInstance()
            .getWidgetFromWidgetList(target._id);
          const lleft = currentWIdget.left;
          const ltop = currentWIdget.top;
          const lx1 = currentWIdget.x1;
          const ly1 = currentWIdget.y1;
          const lx2 = currentWIdget.x2;
          const ly2 = currentWIdget.y2;
          target.set({
            x1: lx1 + target.left - lleft,
            y1: ly1 + target.top - ltop,
            x2: lx2 + target.left - lleft,
            y2: ly2 + target.top - ltop
          });
          const rStart = otherObj.convertACoordToRCoord(target.x1, target.y1);
          const rEnd = otherObj.convertACoordToRCoord(target.x2, target.y2);
          target.set({
            connectorStart: {
              _id: target.connectorStart._id,
              rx: rStart.x,
              ry: rStart.y
            },
            connectorEnd: {
              _id: target.connectorEnd._id,
              rx: rEnd.x,
              ry: rEnd.y
            }
            // zIndex: Date.now() * 100
          });

          const state3 = canvas
            .findById(target._id)
            .getModifiedObject([
              'left',
              'top',
              'x1',
              'y1',
              'x2',
              'y2',
              'connectorStart',
              'connectorEnd',
              'zIndex'
            ]);
          stateList.push(state3);
        } else {
          target.set({
            connectorStart: null,
            connectorEnd: null,
            zIndex: Date.now() * 100
          });

          const state3 = canvas
            .findById(target._id)
            .getModifiedObject([
              'left',
              'top',
              'connectorStart',
              'connectorEnd',
              'zIndex'
            ]);
          stateList.push(state3);
        }
        boolObjWithArrow = false;
      }
    }
    // if it is panel and has sub widget
    if (target.isPanel || target.obj_type === 'WBRectPanel') {
      if (target.subIdList() && target.subIdList().length > 0) {
        boolObjWithArrow = false;
        const state = target.getMovedObject();
        stateList.push(state);
        for (const subObjId of target.subIdList()) {
          const subObj = canvas.findById(subObjId);
          if (subObj && subObj.obj_type !== 'common') {
            const state2 = subObj.getMovedObject();

            stateList.push(state2);
          }

          if (subObj && subObj.lines && subObj.lines.length > 0) {
            for (let i = 0; i < subObj.lines.length; i++) {
              const line = subObj.lines[i];
              const lineWidget = canvas.findById(line._id);
              if (!lineWidget) break;
              canvas.onObjectModifiedUpdateArrowsSave(subObj);

              canvas.anyChange = true;
              const lineState = canvas
                .findById(line._id)
                .getModifiedObject(['left', 'top', 'x1', 'y1', 'x2', 'y2']);
              stateList.push(lineState);
            }
          }
        }
      }
    }

    if (boolObjWithArrow) {
      const state = target.getMovedObject();
      stateList.push(state);
    }
  }

  if (action === 'SCALED') {
    let boolObjWithArrow = true;
    // const bindIndicator = canvas.checkIfPanelBindingStatusChange(target);
    // if (bindIndicator >= 0) {
    //   boolObjWithArrow = false;
    //   let bindState = {};
    //   bindState.targetId = target._id;
    //   switch (bindIndicator) {
    //     case 0:
    //       bindState = target.getFrameBind('UNBIND', [
    //         'scaleX',
    //         'scaleY',
    //         'flipX',
    //         'flipY',
    //         'left',
    //         'top',
    //         'panelObj',
    //         'relationship',
    //         'zIndex'
    //       ]);
    //       stateList.push(bindState);
    //       break;
    //     case 1:
    //     case 2:
    //       // console.log('trigger height')
    //       // bindState = target.getFrameBind('BIND', [
    //       //   'scaleX',
    //       //   'scaleY',
    //       //   'flipX',
    //       //   'flipY',
    //       //   'left',
    //       //   'top',
    //       //   'panelObj',
    //       //   'relationship',
    //       //   'zIndex'
    //       // ]);
    //       // stateList.push(bindState);
    //       // break;
    //     case 3:
    //       console.log('this')
    //       bindState = target.getModifiedObject([
    //         'scaleX',
    //         'scaleY',
    //         'flipX',
    //         'flipY',
    //         'left',
    //         'top',
    //         'relationship'
    //       ]);
    //       stateList.push(bindState);
    //       break;
    //     default:
    //       break;
    //   }
    // }
    if (target.group) {
      if (target.lines && target.lines.length > 0) {
        for (let i = 0; i < target.lines.length; i++) {
          const line = target.lines[i];
          const lineWidget = canvas.findById(line._id);
          if (!lineWidget) break;
          if (!lineWidget.group) {
            if (
              lineWidget.connectorStart &&
              lineWidget?.connectorStart?._id === target._id
            ) {
              const startObj = canvas.findById(lineWidget?.connectorStart?._id);
              if (!startObj) return;
              const sPoint = startObj.convertRCoordToACoordPartialAS(
                lineWidget.connectorStart.rx,
                lineWidget.connectorStart.ry
              );
              lineWidget.set({
                x1: sPoint.x,
                y1: sPoint.y
              });
              if (lineWidget.connectorEnd) {
                const endObj = canvas.findById(lineWidget?.connectorEnd?._id);
                if (!endObj) return;
                if (endObj.group) {
                  const ePoint = endObj.convertRCoordToACoordPartialAS(
                    lineWidget.connectorEnd.rx,
                    lineWidget.connectorEnd.ry
                  );
                  lineWidget.set({
                    x2: ePoint.x,
                    y2: ePoint.y
                  });
                } else {
                  const ePoint = endObj.convertRCoordToACoord(
                    lineWidget.connectorEnd.rx,
                    lineWidget.connectorEnd.ry
                  );
                  lineWidget.set({
                    x2: ePoint.x,
                    y2: ePoint.y
                  });
                }
              }
            } else {
              const endObj = canvas.findById(lineWidget?.connectorEnd?._id);
              if (!endObj) return;
              const ePoint = endObj.convertRCoordToACoordPartialAS(
                lineWidget.connectorEnd.rx,
                lineWidget.connectorEnd.ry
              );
              lineWidget.set({
                x2: ePoint.x,
                y2: ePoint.y
              });

              if (lineWidget.connectorStart) {
                const startObj = canvas.findById(lineWidget?.connectorStart?._id);
                if (!startObj) return;
                if (startObj.group) {
                  const sPoint = startObj.convertRCoordToACoordPartialAS(
                    lineWidget.connectorStart.rx,
                    lineWidget.connectorStart.ry
                  );
                  lineWidget.set({
                    x1: sPoint.x,
                    y1: sPoint.y
                  });
                } else {
                  const sPoint = startObj.convertRCoordToACoord(
                    lineWidget.connectorStart.rx,
                    lineWidget.connectorStart.ry
                  );
                  lineWidget.set({
                    x1: sPoint.x,
                    y1: sPoint.y
                  });
                }
              }
            }
            lineWidget.set('zIndex', Date.now() * 100);
            canvas.sortByZIndex();
            const state3 = canvas
              .findById(line._id)
              .getModifiedObject([
                'left',
                'top',
                'x1',
                'y1',
                'x2',
                'y2',
                'zIndex'
              ]);
            stateList.push(state3);
          }
        }
      }
      // if (target.obj_type !== 'WBShapeNotes') boolObjWithArrow = false;
      if (boolObjWithArrow) {
        const state = target.getScaledObject();
        stateList.push(state);
      }
    } else {
      // if it is connected with arrows
      if (target.lines && target.lines.length > 0) {
        for (let i = 0; i < target.lines.length; i++) {
          const line = target.lines[i];
          const lineWidget = canvas.findById(line._id);
          if (!lineWidget) break;
          canvas.onObjectModifiedUpdateArrowsSave(target);

          lineWidget.set('zIndex', Date.now() * 100);
          canvas.anyChange = true;
          const lineState = canvas
            .findById(line._id)
            .getModifiedObject([
              'left',
              'top',
              'x1',
              'y1',
              'x2',
              'y2',
              'zIndex'
            ]);
          stateList.push(lineState);
        }
        if (boolObjWithArrow) {
          const state = target.getModifiedObject([
            'left',
            'top',
            'scaleX',
            'scaleY',
            'zIndex',
            'lines'
          ]);
          stateList.push(state);
          boolObjWithArrow = false;
        }
      }

      // if it is panel and has sub widget
      if (target.isPanel || target.obj_type === 'WBRectPanel') {
        const state = target.getScaledObject();
        stateList.push(state);
        const intersectingObjects = canvas
          ._getIntersectedObjects(target)
          .filter(i => i !== target);
        intersectingObjects.forEach(Obj => {
          // canvas.checkIfBindtoPanel(Obj); // add bind to panel after scaled contain new obj
          const pointCenter = { x: Obj.left, y: Obj.top };
          const subInFrame = target.frameExtentContainsPoint(pointCenter);

          if (
            (target.subIdList() && !target.subIdList().includes(Obj._id)) ||
            !target.subIdList()
          ) {
            if (subInFrame && Obj.panelObj !== target._id) {
              const state2 = Obj.getFrameBind('BIND', [
                'left',
                'top',
                'panelObj',
                'relationship',
                'zIndex'
              ]);
              stateList.push(state2);
            }
          }
        });
        if (target.subIdList() && target.subIdList().length > 0) {
          boolObjWithArrow = false;
          let zint = 1;

          for (const subObjId of target.subIdList()) {
            const subObj = canvas.findById(subObjId);
            if (subObj) {
              // canvas.checkIfBindtoPanel(subObj);
              // const state2 = subObj.getMovedObject();
              const pointCenter = { x: subObj.left, y: subObj.top };
              const subInFrame = target.frameExtentContainsPoint(pointCenter);
              if (subInFrame) {
                const state2 = subObj.getModifiedObject([
                  'left',
                  'top',
                  'relationship'
                ]);
                stateList.push(state2);
              } else {
                subObj.panelObj = null;
                subObj.relationship = null;
                const state2 = subObj.getFrameBind('UNBIND', [
                  'left',
                  'top',
                  'panelObj',
                  'relationship',
                  'zIndex'
                ]);
                stateList.push(state2);
              }
            }
            if (subObj && subObj.lines && subObj.lines.length > 0) {
              for (let i = 0; i < subObj.lines.length; i++) {
                const line = subObj.lines[i];
                const lineWidget = canvas.findById(line._id);
                if (!lineWidget) break;
                canvas.onObjectModifiedUpdateArrowsSave(subObj);
                lineWidget.set(
                  'zIndex',
                  Date.now() * 100 + (zint + i + 1) * 50
                );
                canvas.sortByZIndex();
                const lineState = canvas
                  .findById(line._id)
                  .getModifiedObject([
                    'left',
                    'top',
                    'x1',
                    'y1',
                    'x2',
                    'y2',
                    'zIndex'
                  ]);
                stateList.push(lineState);
              }
            }
            zint += 1;
          }
          canvas.updateSubObjectsbyPanelObjNotMoveSave(target);
        }
      }
      if (boolObjWithArrow) {
        const state = target.getScaledObject();
        stateList.push(state);
      }
    }
  }

  if (action === 'ROTATED') {
    const state = {};
    state.targetId = target._id;
    state.activeselection = true;
    const { angle } = target;
    state.newState = { angle };
    state.originalState = _.pick(
      WidgetService.getInstance().getWidgetFromWidgetList(target._id),
      ['angle']
    );
    state.action = 'ROTATED';

    stateList.push(state);
  }

  if (action === 'MODIFIED') {
    if (
      target.obj_type === 'WBArrow' &&
      (fields.includes('connectorStart') || fields.includes('connectorEnd'))
    ) {
      // desined for change connector

      const state = target.getModifiedObject(fields);
      stateList.push(state);

      const linewidget = canvas.findById(target._id);
      const currCSobj = linewidget.connectorStart;
      const currCEobj = linewidget.connectorEnd;

      const locallinewidget = WidgetService.getInstance().getWidgetFromWidgetList(target._id);
      if(!locallinewidget) return;
      const oldCSobj = locallinewidget.connectorStart;
      const oldCEobj = locallinewidget.connectorEnd;

      if (fields.includes('connectorStart')) {
        if (currCSobj && oldCSobj && currCSobj._id !== oldCSobj._id) {
          // old obj remove lines
          const localoCSobj = WidgetService.getInstance()
            .getWidgetFromWidgetList(oldCSobj._id);
          if (localoCSobj && localoCSobj.lines.length === 1) {
            localoCSobj.lines = null;
          } else {
            if(localoCSobj){
              for (let i = 0; i < localoCSobj.lines.length; i++) {
                if (target._id === localoCSobj.lines[i]._id) {
                  localoCSobj.lines.splice(i, 1);
                }
              }
            }
            
          }

          const oCSstate = canvas.findById(oldCSobj._id);
          if(oCSstate){
            const oCSstateObj = oCSstate.getModifiedObject(['lines']);
            stateList.push(oCSstateObj);
          }
          // current obj add lines,
          const localcCSobj = WidgetService.getInstance()
            .getWidgetFromWidgetList(currCSobj._id);
          localcCSobj.lines = localcCSobj.lines || [];

          localcCSobj.lines.push({
            _id: target._id
          });

          const cCSstate = canvas
            .findById(currCSobj._id)
            .getModifiedObject(['lines']);
          stateList.push(cCSstate);
        } else if (currCSobj && !oldCSobj) {
          // current obj add lines,
          const localcCSobj = WidgetService.getInstance()
            .getWidgetFromWidgetList(currCSobj._id);
          localcCSobj.lines = localcCSobj.lines || [];

          localcCSobj.lines.push({
            _id: target._id
          });

          const cCSstate = canvas
            .findById(currCSobj._id)
            .getModifiedObject(['lines']);
          stateList.push(cCSstate);
        } else if (!currCSobj && oldCSobj) {
          const localoCSobj = WidgetService.getInstance()
            .getWidgetFromWidgetList(oldCSobj._id);
          if (localoCSobj && localoCSobj.lines.length === 1) {
            localoCSobj.lines = null;
          } else {
            if(localoCSobj){
              for (let i = 0; i < localoCSobj.lines.length; i++) {
                if (target._id === localoCSobj.lines[i]._id) {
                  localoCSobj.lines.splice(i, 1);
                }
              }
            }
            
          }
       
          const oCSstate = canvas.findById(oldCSobj._id);
          if(oCSstate){
            const oCSstateObj = oCSstate.getModifiedObject(['lines']);
            stateList.push(oCSstateObj);
          }
          
        }
      }
      if (fields.includes('connectorEnd')) {
        if (currCEobj && oldCEobj && currCEobj._id !== oldCEobj._id) {
          // old obj remove lines
          const localoCEobj = WidgetService.getInstance().getWidgetFromWidgetList(oldCEobj._id);
            if(localoCEobj && localoCEobj.lines){
              if (localoCEobj.lines.length === 1) {
                localoCEobj.lines = null;
              } else {
                for (let i = 0; i < localoCEobj.lines.length; i++) {
                  if (target._id === localoCEobj.lines[i]._id) {
                    localoCEobj.lines.splice(i, 1);
                  }
                }
              }
            }

          const oCEstate = canvas
            .findById(oldCEobj._id)
            .getModifiedObject(['lines']);
          stateList.push(oCEstate);

          // current obj add lines,
          const localcCEobj = WidgetService.getInstance()
            .getWidgetFromWidgetList(currCEobj._id);
          localcCEobj.lines = localcCEobj.lines || [];

          localcCEobj.lines.push({
            _id: target._id
          });

          const cCEstate = canvas
            .findById(currCEobj._id)
            .getModifiedObject(['lines']);
          stateList.push(cCEstate);
        } else if (currCEobj && !oldCEobj) {
          const localcCEobj = WidgetService.getInstance()
            .getWidgetFromWidgetList(currCEobj._id);
          localcCEobj.lines = localcCEobj.lines || [];

          localcCEobj.lines.push({
            _id: target._id
          });

          const cCEstate = canvas.findById(currCEobj._id)
          if(cCEstate){
            const cCEstateObj = cCEstate.getModifiedObject(['lines']);
            stateList.push(cCEstateObj);
          }
          
        } else if (!currCEobj && oldCEobj) {
          const localoCEobj = WidgetService.getInstance().getWidgetFromWidgetList(oldCEobj._id);
          if (localoCEobj && localoCEobj.lines.length === 1) {
            localoCEobj.lines = null;
          } else {
            if(localoCEobj){
              for (let i = 0; i < localoCEobj.lines.length; i++) {
                if (target._id === localoCEobj.lines[i]._id) {
                  localoCEobj.lines.splice(i, 1);
                }
              }
            }
          }

          const oCEstate = canvas.findById(oldCEobj._id);
          if(oCEstate){
            const oCEstateObj = oCEstate.getModifiedObject(['lines']);
            stateList.push(oCEstateObj);
          }
          
        }
      }
      return stateList;
    }

    const state = target.getModifiedObject(fields);
    stateList.push(state);
  }
  return stateList;
};

fabric.Object.prototype.getRemovedArrow = function (arrow) {
  const stateList = [];
  const state = {};
  const target = this;
  state.activeselection = true;
  state.originalState = _.pick(arrow, arrow.keys);
  if (arrow.group) {
    const point = Boardx.Util.getPointOnCanvasInGroup(arrow);
    state.originalState.left = point.x;
    state.originalState.top = point.y;
  }
  state.targetId = arrow._id;
  state.action = 'REMOVED';
  stateList.push(state);

  canvas.updateConnectorsRemovedWidget(arrow);
  if (
    arrow.connectorEnd &&
    arrow.connectorEnd._id &&
    arrow.connectorEnd._id !== target._id
  ) {
    const widget = canvas.findById(arrow.connectorEnd._id);
    if (widget) {
      const state2 = widget.getModifiedObject(['lines']);
      stateList.push(state2);
    }
  }

  if (
    arrow.connectorStart &&
    arrow.connectorStart._id &&
    arrow.connectorStart._id !== target._id
  ) {
    const widget = canvas.findById(arrow.connectorStart._id);
    if (widget) {
      const state3 = widget.getModifiedObject(['lines']);
      stateList.push(state3);
    }
  }

  return stateList;
};

fabric.Object.prototype.getMovedObject = function () {
  const target = this;
  const state = {};
  state.activeselection = true;
  state.targetId = target._id;
  let { left, top } = target;
  const { zIndex } = target;
  if (target.group) {
    const point = Boardx.Util.getPointOnCanvasInGroup(target);
    left = point.x;
    top = point.y;
  }
  state.newState = { left, top, zIndex };
  state.originalState = _.pick(
    WidgetService.getInstance().getWidgetFromWidgetList(target._id),
    ['left', 'top', 'zIndex']
  );
  state.action = 'MOVED';
  return state;
};

fabric.Object.prototype.getModifiedObject = function (fields) {
  const target = this;
  const state = {};
  state.activeselection = true;
  const newState = _.pick(target, fields);
  if (target.obj_type === 'WBShapeNotes' && target.group) {
    const { left, top, width, height, maxHeight, scaleX, scaleY, shapeScaleX } =
      newState;
    const point = Boardx.Util.getPointOnCanvasInGroup(target);
    if (left) newState.left = point.x;
    if (top) newState.top = point.y;
    if (width)
      newState.width = target.width * target.scaleX * target.group.scaleX;
    if (height)
      newState.height = target.height * target.scaleX * target.group.scaleX;
    if (maxHeight)
      newState.maxHeight = target.height * target.scaleY * target.group.scaleY;
    if (scaleX) newState.scaleX = 1;
    if (scaleY) newState.scaleY = 1;
    if (shapeScaleX) newState.shapeScaleX = 1;
  } else {
    const { left, top } = newState;
    if (target.group) {
      const point = Boardx.Util.getPointOnCanvasInGroup(target);
      if (left) newState.left = point.x;
      if (top) newState.top = point.y;
    }
  }

  state.targetId = target._id;
  state.newState = newState; // the latest state, update in UI not DB
  if (fields[0] === 'subObjs') {
    const oldTarget = WidgetService.getInstance()
      .getWidgetFromWidgetList(target._id);
    if (oldTarget === undefined || !oldTarget.subObjs)
      state.originalState = null;
  } else {
    state.originalState = _.pick(
      WidgetService.getInstance().getWidgetFromWidgetList(target._id),
      fields
    ); // WidgetService.getInstance().getWidgetFromWidgetList from DB
    if (fields[0] === 'lines' && !state.originalState.lines)
      state.originalState = { lines: null };
  }

  state.action = 'MODIFIED';
  return state;
};

fabric.Object.prototype.getFrameBind = function (action, fields) {
  const target = this;
  const state = {};
  if (target.obj_type === 'WBGroup'){
    state.activeselection = true;
  } 
  const oldState = _.pick(target, fields);
  state.targetId = target._id;
  const isScale = fields.includes('scaleX');
  const newState = {};
  const localWidget = WidgetService.getInstance().getWidgetFromWidgetList(target._id);
  if(!localWidget) return;
  if (target.obj_type === 'WBGroup') {
    state.activeselection = true;
    const point = Boardx.Util.getPointOnCanvasInGroup(target);
    newState.left = point.x;
    newState.top = point.y;
    if (isScale) {
      newState.scaleX = target.scaleX * target.group.scaleX;
      newState.scaleY = target.scaleY * target.group.scaleY;
    }
  } else {
    newState.left = target.left;
    newState.top = target.top;
    if (isScale) {
      newState.scaleX = target.scaleX;
      newState.scaleY = target.scaleY;
    }
  }
  oldState.left = localWidget.left;
  oldState.top = localWidget.top;
  if (isScale) {
    oldState.scaleX = localWidget.scaleX;
    oldState.scaleY = localWidget.scaleY;
  }
  oldState.zIndex = localWidget.zIndex;
  newState.zIndex = target.zIndex;
  if (localWidget.panelObj) {
    oldState.panelObj = localWidget.panelObj;
    oldState.relationship = localWidget.relationship;
  } else {
    oldState.panelObj = null;
    oldState.relationship = null;
  }
  if (target.panelObj) {
    newState.panelObj = target.panelObj;
    newState.relationship = target.relationship;
  } else {
    newState.panelObj = null;
    newState.relationship = null;
  }
  state.originalState = oldState;
  state.newState = newState;
  state.action = action;
  return state;
};

fabric.Object.prototype.getScaledObject = function () {
  const target = this;
  const state = {};
  state.targetId = target._id;
  state.activeselection = true;
  if (target.obj_type !== 'WBArrow') {
    let { scaleX, scaleY, left, top, flipX, flipY } = target;

    if (target.group) {
      const point = Boardx.Util.getPointOnCanvasInGroup(target);
      left = point.x;
      top = point.y;
      scaleX = target.scaleX * target.group.scaleX;
      scaleY = target.scaleY * target.group.scaleY;
      flipX = target.flipX;
      flipY = target.flipY;
    }

    state.newState = {
      scaleX,
      scaleY,
      left,
      top,
      flipX,
      flipY
    };

    state.originalState = _.pick(
      WidgetService.getInstance().getWidgetFromWidgetList(target._id),
      ['scaleX', 'scaleY', 'flipX', 'flipY', 'left', 'top']
    );
    state.action = 'SCALED';
    return state;
  }

  let { scaleX, scaleY, flipX, flipY, left, top, x1, y1, x2, y2 } = target;

  if (target.group) {
    target.getresetArrowaftermoving();

    const point0 = Boardx.Util.getPointOnCanvasInGroup(target);
    const point1 = Boardx.Util.getOnePointOnCanvasInGroup(target, {
      x: target.x1,
      y: target.y1
    });
    const point2 = Boardx.Util.getOnePointOnCanvasInGroup(target, {
      x: target.x2,
      y: target.y2
    });
    const point3 = Boardx.Util.getOnePointOnCanvasInGroup(target, {
      x: target.left,
      y: target.top
    });

    scaleX = 1;
    scaleY = 1;
    x1 = point1.x + point0.x - point3.x;
    y1 = point1.y + point0.y - point3.y;
    x2 = point2.x + point0.x - point3.x;
    y2 = point2.y + point0.y - point3.y;
    left = point0.x;
    top = point0.y;
  }

  state.newState = {
    scaleX,
    scaleY,
    flipX,
    flipY,
    left,
    top,
    x1,
    y1,
    x2,
    y2
  };

  state.originalState = _.pick(
    WidgetService.getInstance().getWidgetFromWidgetList(target._id),
    [
      'scaleX',
      'scaleY',
      'flipX',
      'flipY',
      'left',
      'top',
      'x1',
      'y1',
      'x2',
      'y2'
    ]
  );

  state.action = 'MODIFIED';
  return state;
};

fabric.Object.prototype.initialize = function (options) {
  const self = this;
  this.guides = {};
  if (options) {
    this.setOptions(options);
  }
  self.on('mouseover', e => {
    if (store.getState().board.drawingEraseMode) {
      return;
    }
    if (
      store.getState().board.isPanMode ||
      e.e.which === 2 ||
      e.e.which === 3
    ) {
      self.hoverCursor = 'grab';
      self.dirty = true;
      canvas.requestRenderAll();
      return;
    }

    if (self.selectable === false) {
      if (store.getState().modal.interactionMode === 'mouse') {
        // if switch between mouse & trackpad mode,
        // user may need to refresh the page to have it functioning correctly
        if (store.getState().board.drawingEraseMode) {
          self.hoverCursor =
            "url(\"data:image/svg+xml,%3Csvg width='20' height='17' viewBox='0 0 20 17' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M12.9596 14.1754L17.6647 8.94993L15.4332 6.94073L10.6822 12.1248L12.9596 14.1754ZM13.9469 5.60242L11.9887 3.83931C9.52618 1.62201 5.73239 1.82083 3.51509 4.28339L2.82482 5.05001L9.19585 10.7865L13.9469 5.60242ZM11.6214 15.6617C12.4422 16.4008 13.7068 16.3345 14.4459 15.5137L19.151 10.2882C19.8901 9.46734 19.8238 8.20274 19.0029 7.46364L13.327 2.35302C10.0436 -0.603384 4.9852 -0.338289 2.0288 2.94513L1.33853 3.71175C0.59943 4.53261 0.665705 5.7972 1.48656 6.5363L11.6214 15.6617Z' fill='%23232930'/%3E%3C/svg%3E\") 0 0, auto";
        } else if (self.locked === true) {
          const isPan = store.getState().board.isPanMode;
          if (isPan) {
            self.hoverCursor = 'grab';
          } else {
            const cursorLock =
              "data:image/svg+xml,%3Csvg width='10' height='13' viewBox='0 0 10 13' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M4.832 0.755L5 0.75C5.70029 0.749965 6.37421 1.01709 6.8843 1.49689C7.39439 1.97669 7.70222 2.63302 7.745 3.332L7.75 3.5V4H8.5C8.89782 4 9.27936 4.15804 9.56066 4.43934C9.84196 4.72064 10 5.10218 10 5.5V11.5C10 11.8978 9.84196 12.2794 9.56066 12.5607C9.27936 12.842 8.89782 13 8.5 13H1.5C1.10218 13 0.720644 12.842 0.43934 12.5607C0.158035 12.2794 0 11.8978 0 11.5V5.5C0 5.10218 0.158035 4.72064 0.43934 4.43934C0.720644 4.15804 1.10218 4 1.5 4H2.25V3.5C2.24997 2.79971 2.51709 2.12579 2.99689 1.6157C3.47669 1.10561 4.13302 0.797781 4.832 0.755L5 0.75L4.832 0.755ZM5 7.5C4.73478 7.5 4.48043 7.60536 4.29289 7.79289C4.10536 7.98043 4 8.23478 4 8.5C4 8.76522 4.10536 9.01957 4.29289 9.20711C4.48043 9.39464 4.73478 9.5 5 9.5C5.26522 9.5 5.51957 9.39464 5.70711 9.20711C5.89464 9.01957 6 8.76522 6 8.5C6 8.23478 5.89464 7.98043 5.70711 7.79289C5.51957 7.60536 5.26522 7.5 5 7.5ZM5.128 2.256L5 2.25C4.69054 2.24986 4.39203 2.36451 4.16223 2.57177C3.93244 2.77903 3.78769 3.06417 3.756 3.372L3.75 3.5V4H6.25V3.5C6.25014 3.19054 6.13549 2.89203 5.92823 2.66223C5.72097 2.43244 5.43583 2.28769 5.128 2.256L5 2.25L5.128 2.256Z' fill='%23232930'/%3E%3C/svg%3E";
            self.hoverCursor = `url("${cursorLock}") 0 0, auto`;
          }
        } else {
          self.hoverCursor = 'default';
        }
      } else {
        self.hoverCursor = 'default';
      }
    } else if (self.obj_type === 'WBUrlImage') {
      self.hoverCursor = 'pointer';
    } else {
      self.hoverCursor = 'default';
    }
  });
};

fabric.Object.prototype.getCloneWidget = function () {
  const widget = _.clone(this.getObject());
  if (widget.connectorStart)
    widget.connectorStart = { _id: this.connectorStart._id };
  if (widget.connectorEnd) widget.connectorEnd = { _id: this.connectorEnd._id };
  delete widget._id;
  delete widget.emoji;
  widget.isPanel = null;
  if (this.getObject().lines) {
    widget.lines = this.getObject().lines;
  } else {
    widget.lines = null;
  }
  widget.panelObj = null;
  widget.relationship = null;
  widget.selectable = true;
  widget.userEmoji = null;
  widget.zIndex = Date.now() * 100;
  return widget;
};

fabric.Object.prototype.bringObjToFront = function () {
  const obj = this;
  const intersectingObjects = canvas._getIntersectedObjects(obj);
  if (obj.panelObj) {
    /* overlap with frame */
    const parentPanel = intersectingObjects.filter(
      o => o._id === obj.panelObj
    )[0];
    if (parentPanel) {
      /* bring front on a frame is to the top on the frame */
      canvas.toFrameTop(parentPanel, obj);
    } else {
      const newIndex = canvas.createTopZIndex();
      obj.zIndex = newIndex;
      canvas.sortByZIndex();
      obj.saveData('MODIFIED', ['zIndex']);
      /* question: how about stick note with arrow,
      what happens when bring front the note: shall also update arrow zindex */
    }
  } else {
    const newIndex = canvas.createTopZIndex();
    obj.zIndex = newIndex;
    obj.dirty = true;
    canvas.sortByZIndex();
    obj.saveData('MODIFIED', ['zIndex']);
  }
};

fabric.Object.prototype.sendObjToBack = function () {
  const obj = this;
  let newIndex;
  const intersectingObjects = canvas._getIntersectedObjects(obj);
  if (intersectingObjects.length === 1) {
    /* no overlap */
    const nexZIndex = canvas._objects[0].zIndex;
    newIndex = nexZIndex - 100;
    obj.zIndex = newIndex;
    canvas.sortByZIndex();
    obj.saveData('MODIFIED', ['zIndex']);
  } else if (obj.panelObj) {
    /* overlap with frame */
    const parentPanel = intersectingObjects.filter(
      o => o._id === obj.panelObj
    )[0];
    if (parentPanel) {
      /* send back on a frame is to the bottom on the frame */
      canvas.toFrameBottom(parentPanel, obj);
    }
  } else {
    /* with overlap, but not on a frame */
    const nexZIndex = canvas._objects[0].zIndex;
    newIndex = nexZIndex - 100;
    obj.zIndex = newIndex;
    obj.dirty = true;
    canvas.sortByZIndex();
    obj.saveData('MODIFIED', ['zIndex']);
  }
};

fabric.Object.prototype.bringObjForward = function () {
  const obj = this;
  const intersectingObjects = canvas._getIntersectedObjects(obj);
  if (intersectingObjects.length > 1) {
    intersectingObjects.sort((a, b) => a.zIndex - b.zIndex);
    const index = intersectingObjects.indexOf(obj);
    if (index < intersectingObjects.length - 1) {
      if (obj.panelObj) {
        const parentPanel = intersectingObjects.filter(
          o => o._id === obj.panelObj
        )[0];
        if (parentPanel) {
          /* bring forward on a frame is to the bottom on the frame */
          canvas.onFrameForward(parentPanel, obj);
          /* question: onFrameForward only handling the frame's subOBj, what happens
            if need bring over an object not in the frame */
        }
      } else {
        const newIndex = canvas.createUniqueZIndex(
          intersectingObjects[index + 1].zIndex,
          true
        );
        obj.zIndex = newIndex;
        canvas.sortByZIndex();
        obj.dirty = true;
        obj.saveData('MODIFIED', ['zIndex']);
      }
    }
  }
};

fabric.Object.prototype.sendObjBackwards = function () {
  const obj = this;
  const intersectingObjects = canvas._getIntersectedObjects(obj);
  intersectingObjects.sort((a, b) => a.zIndex - b.zIndex);
  const index = intersectingObjects.indexOf(obj);
  if (intersectingObjects.length > 1) {
    if (index > 0) {
      if (obj.panelObj) {
        const parentPanel = intersectingObjects.filter(
          o => o._id === obj.panelObj
        )[0];
        if (parentPanel) {
          /* send back on a frame is to the bottom on the frame */
          canvas.onFrameBackward(parentPanel, obj);
        }
      } else {
        const newIndex = canvas.createUniqueZIndex(
          intersectingObjects[index - 1].zIndex,
          false
        );
        obj.zIndex = newIndex;
        obj.dirty = true;
        canvas.sortByZIndex();
        obj.saveData('MODIFIED', ['zIndex']);
      }
    }
  }
};

fabric.Object.prototype.reSetControl = function () {
  const obj = this;
  if (obj && obj.controls && obj.obj_type !== 'WBArrow') {
    if( obj.controls.mlaStart){
      obj.controls.mlaStart.offsetX = -20 * canvas.getZoom() * obj.scaleX;
      obj.controls.mraStart.offsetX = 20 * canvas.getZoom() * obj.scaleX;
      obj.controls.mtaStart.offsetY = -20 * canvas.getZoom() * obj.scaleY;
      obj.controls.mbaStart.offsetY = 20 * canvas.getZoom() * obj.scaleY;
    }
  }
}

fabric.Object.prototype.drawBordersInGroup = function (
  ctx,
  options,
  styleOverride
) {
  styleOverride = styleOverride || {};

  var bbox = fabric.util.sizeAfterTransform(this.width, this.height, options),
    strokeWidth = this.strokeWidth,
    strokeUniform = this.strokeUniform,
    borderScaleFactor = this.borderScaleFactor,
    width =
      bbox.x +
      strokeWidth * (strokeUniform ? this.canvas.getZoom() : options.scaleX) +
      borderScaleFactor,
    height =
      bbox.y +
      strokeWidth * (strokeUniform ? this.canvas.getZoom() : options.scaleY) +
      borderScaleFactor;
  ctx.save();
  this._setLineDash(ctx, styleOverride.borderDashArray || this.borderDashArray);
  let color = '#B3CDFD80';
  ctx.strokeStyle = color;
  ctx.strokeRect(-width / 2, -height / 2, width, height);
  ctx.restore();
  return this;
};

/**
 * Draws borders of an object's bounding box.
 * Requires public properties: width, height
 * Requires public options: padding, borderColor
 * @param {CanvasRenderingContext2D} ctx Context to draw on
 * @param {Object} styleOverride object to override the object style
 * @return {fabric.Object} thisArg
 * @chainable
 */
fabric.Object.prototype.drawBorders = function (ctx, styleOverride) {
  styleOverride = styleOverride || {};
  var wh = this._calculateCurrentDimensions(),
    strokeWidth = this.borderScaleFactor,
    width = wh.x + strokeWidth,
    height = wh.y + strokeWidth,
    hasControls =
      typeof styleOverride.hasControls !== 'undefined'
        ? styleOverride.hasControls
        : this.hasControls,
    shouldStroke = false;
  ctx.save();
  ctx.strokeStyle = styleOverride.borderColor || this.borderColor;
  this._setLineDash(ctx, styleOverride.borderDashArray || this.borderDashArray);
  ctx.strokeRect(-width / 2, -height / 2, width, height);
  if (hasControls) {
    ctx.beginPath();
    this.forEachControl(function (control, key, fabricObject) {
      if (control.actionName === 'rotate') return;
      // in this moment, the ctx is centered on the object.
      // width and height of the above function are the size of the bbox.
      if (control.withConnection && control.getVisibility(fabricObject, key)) {
        // reset movement for each control
        shouldStroke = true;
        ctx.moveTo(control.x * width, control.y * height);
        ctx.lineTo(
          control.x * width + control.offsetX,
          control.y * height + control.offsetY
        );
      }
    });
    if (shouldStroke) {
      ctx.stroke();
    }
  }
  ctx.restore();
  return this;
};
fabric.Object.prototype.isActiveSelection = function () {

  const obj = this;

  if( obj.obj_type==='WBGroup' && obj._objects && obj._objects.length > 0 && !obj._id ){
    return true
  }

  else{
    return false;
  }

}
fabric.Object.prototype.isGroup = function () {

  const obj = this;
  
  if( obj.obj_type==='WBGroup' && obj._objects && obj._objects.length > 0 && obj._id ){
    return true
  }
  else{
    return false;
  }
}