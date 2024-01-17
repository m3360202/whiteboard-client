import _ from 'underscore';
import * as fabric  from '@boardxus/x-canvas';
import { WidgetService } from '../../../services/index';

fabric.Canvas.prototype.updateSubObjectsbyPanelObjSave = function (panelObj) {
  const self = this;
  const multiply = fabric.util.multiplyTransformMatrices;
  const subObjIdList = panelObj.subIdList();
  const subObj = self
    .getObjects()
    .filter((o) => _.contains(subObjIdList, o._id));
  const toUpdateArr = [];

  subObj.forEach((o) => {
    if (!o.relationship) {
      return;
    }
    const { relationship } = o;
    const newTransform = multiply(panelObj.calcTransformMatrix(), relationship);
    const toUpdate = {};

    const opt = fabric.util.qrDecompose(newTransform);
    o.set({
      flipX: false,
      flipY: false,
    });
    o.left = opt.translateX;
    o.top = opt.translateY;
    o.setCoords();
    toUpdate._id = o._id;
    toUpdate.left = opt.translateX;
    toUpdate.top = opt.translateY;

    toUpdateArr.push(toUpdate);
    self.onObjectModifiedUpdateArrowsSave(o);
  });
  WidgetService.getInstance().updateWidgetArr(toUpdateArr);
};

fabric.Canvas.prototype.updateSubObjectsbyPanelObj = function (panelObj) {
  const self = this;
  const multiply = fabric.util.multiplyTransformMatrices;
  const groupObjs = [];
  if (panelObj.group) {
    panelObj.group._objects.forEach((obj) => {
      if (!obj._id) return;
      groupObjs.push(obj._id);
    });
  }
  const subObjIdList = panelObj.subIdList();
  const subObj = self
    .getObjects()
    .filter((o) => _.contains(subObjIdList, o._id));
  subObj.forEach((o) => {
    if (!o.relationship) {
      return;
    }
    if (groupObjs.includes(o._id)) return;
    const { relationship } = o;
    const newTransform = multiply(panelObj.calcTransformMatrix(), relationship);

    const opt = fabric.util.qrDecompose(newTransform);
    o.set({
      flipX: false,
      flipY: false,
    });

    o.set({
      left: opt.translateX,
      top: opt.translateY,
    });

    self.syncObjectChangeToRemote(o._id, {
      left: opt.translateX,
      top: opt.translateY,
    });

    o.setCoords();
    if (o.lines && o.lines.length > 0) {
      self.onObjectModifyUpdateArrows(o);
    }
    o.dirty = true;
    self.requestRenderAll();
  });
};
// 重新确定子控件和panel的关系，与矩阵移动对立，下面不动如山

fabric.Canvas.prototype.updateSubObjectsbyPanelObjNotMove = function (
  panelObj,
) {
  const self = this;
  const multiply = fabric.util.multiplyTransformMatrices;
  const invert = fabric.util.invertTransform;
  const bossTransform = panelObj.calcTransformMatrix();
  const invertedBossTransform = invert(bossTransform);
  const subObjIdList = panelObj.subIdList();
  const subObj = self
    .getObjects()
    .filter((o) => _.contains(subObjIdList, o._id));
  subObj.forEach((o) => {
    if (!o.relationship) {
      return;
    }
    const desiredTransform = multiply(
      invertedBossTransform,
      o.calcTransformMatrix(),
    );
    o.relationship = desiredTransform;
  });
};

fabric.Canvas.prototype.updateSubObjectsbyPanelObjNotMoveSave = function (
  panelObj,
) {
  const self = this;
  const multiply = fabric.util.multiplyTransformMatrices;
  const invert = fabric.util.invertTransform;
  const bossTransform = panelObj.calcTransformMatrix();
  const invertedBossTransform = invert(bossTransform);
  const toUpdateArr = [];
  const subObjIdList = panelObj.subIdList();
  const subObj = self
    .getObjects()
    .filter((o) => _.contains(subObjIdList, o._id));
  subObj.forEach((o) => {
    if (!o.relationship) {
      return;
    }
    const desiredTransform = multiply(
      invertedBossTransform,
      o.calcTransformMatrix(),
    );
    o.relationship = desiredTransform;
    const toUpdate = {};
    toUpdate._id = o._id;
    toUpdate.left = o.left;
    toUpdate.top = o.top;
    toUpdateArr.push(toUpdate);
  });
  WidgetService.getInstance().updateWidgetArr(toUpdateArr);
};
// get overlapped panel for object if exists

fabric.Canvas.prototype.getPanelIfExists = function (subObj) {
  const panels = [];
  const self = this;
  const point0 = subObj.getCenterPoint();
  let point = null;
  let objinPan = false;
  if (subObj.group) {
    point = Boardx.Util.getOnePointOnCanvasInGroupFrame(subObj, point0);
  } else {
    point = point0;
  }
  self.getObjects().forEach((obj) => {
    objinPan = false;
    if (!obj.isPanelTitle) {
      if (obj.isPanel || obj.obj_type === 'WBRectPanel') {
        const minx = obj.aCoords.tl.x;
        const miny = obj.aCoords.tl.y;
        const maxx = obj.aCoords.br.x;
        const maxy = obj.aCoords.br.y;
        if (
          point.x < maxx &&
          point.x > minx &&
          point.y < maxy &&
          point.y > miny
        )
          objinPan = true;
        if (obj.frameExtentContainsPoint(point) || objinPan) {
          panels.push(obj);
        }
      }
    }
  });

  if (panels.length > 0) {
    panels.sort((a, b) => b.zIndex - a.zIndex);
    return panels[0];
  }
  return null;
};

fabric.Canvas.prototype.checkIfBindtoPanelNoSaveData = async function (subObj) {
  const self = this;

  // skip the check process if it is certain widget type
  if (
    !subObj ||
    subObj.isPanel ||
    (subObj.obj_type === 'WBArrow' &&
      (subObj.connectorEnd || subObj.connectorStart)) ||
    subObj === 'common'
  ) {
    return;
  }

  /**
   * 1. single widget
   *    - on panel（source on panel or not）
   *    - not on panel（source on panel or not）
   * 2. multiple widgets(with panel, not with panel)
   *    - on panel
   *    - not on panel
   */

  // the current binded panel object to the selected widgets
  let panelObj;
  // panel is the current contained panel, null meaning it is not on any panel
  const newPanel = await self.getPanelIfExists(subObj);

  // single object
  if (!subObj._objects && subObj.panelObj) {
    [panelObj] = self.getObjects().filter((o) => o._id === subObj.panelObj);
  }

  // single widget, on a new panel
  if (subObj.isActiveSelection() && newPanel) {
    // move widget from one panel to another panel
    if (panelObj && panelObj._id && newPanel._id !== panelObj._id) {
      await self.unbindObjectNoSaveData(subObj, panelObj);
      self.syncPanelSubobjstoDBnRemoteUndoRedo(panelObj._id, subObj, false);
      await self.bindObjectNoSaveData(subObj, newPanel);
      self.syncPanelSubobjstoDBnRemoteUndoRedo(newPanel._id, subObj, true);
    } else {
      await self.bindObjectNoSaveData(subObj, newPanel);
      self.syncPanelSubobjstoDBnRemoteUndoRedo(newPanel._id, subObj, true);
    }
  }

  // single widget, not on panel
  if (subObj.isActiveSelection() && !newPanel) {
    if (!subObj.panelObj) return;
    await self.unbindObjectNoSaveData(subObj, panelObj);
    self.syncPanelSubobjstoDBnRemoteUndoRedo(panelObj._id, subObj, false);
  }

  // note: what happen for AS partial to new panel and partial to no panel
  // group of widgets through active selection, and has new panel
  let oldPanId = null;
  if (
    subObj.isActiveSelection() &&
    canvas.getActiveObject()._objects.length > 0 &&
    newPanel
  ) {
    // panelList is for batch update
    const panelList = [];
    panelList.push(newPanel);

    for (const obj of subObj._objects) {
      // if the object is panel continue
      if (obj.isPanel) continue;

      // if the selected widget has a panel and the panel is also in the selection
      if (
        obj.panelObj &&
        subObj._objects.filter((o) => obj.panelObj === o._id) > 0
      )
        continue;

      if (!panelList.includes(panelObj)) panelList.push(panelObj);
      // switch panel object
      if (panelObj && panelObj._id && newPanel._id !== panelObj._id) {
        oldPanId = panelObj._id;
        await self.unbindObjectNoSaveData(obj, panelObj);
        await self.bindObjectNoSaveData(obj, newPanel);
      } else {
        oldPanId = newPanel._id;
        await self.bindObjectNoSaveData(obj, newPanel);
      }
    }
  }

  // group of widgets through active selection, and no new panel
  if (
    subObj.isActiveSelection() &&
    canvas.getActiveObject()._objects.length > 0 &&
    !newPanel
  ) {
    // panelList is for batch update
    const panelList = [];
    for (const obj of subObj._objects) {
      // if the object is panel continue
      if (obj.isPanel) continue;

      // if the selected widget has a panel and the panel is also in the selection
      if (
        obj.panelObj &&
        subObj._objects.filter((o) => obj.panelObj === o._id) > 0
      )
        continue;

      if (!obj.panelObj) continue;

      panelObj = self.findById(obj.panelObj);

      if (!panelList.includes(panelObj)) panelList.push(panelObj);

      if (panelObj) {
        oldPanId = panelObj._id;
        await self.unbindObjectNoSaveData(obj, panelObj);
      }
    }

    if (!panelList || !panelList[0]) return;
  }
  if (oldPanId) {
    if (newPanel) {
      if (oldPanId !== newPanel._id) {
        self.syncPanelSubobjstoDBnRemoteUndoRedo(oldPanId, subObj, false);
        self.syncPanelSubobjstoDBnRemoteUndoRedo(newPanel._id, subObj, true);
      } else {
        self.syncPanelSubobjstoDBnRemoteUndoRedo(newPanel._id, subObj, true);
      }
    } else {
      self.syncPanelSubobjstoDBnRemoteUndoRedo(oldPanId, subObj, false);
    }
  }
};

/**
 * bind or unbind widget to panel according to the position
 * @param {object} subObj
 * @returns
 */
fabric.Canvas.prototype.checkIfBindtoPanel = async function (subObj) {
  /**
   * 1. single widget
   *    - on panel（source on panel or not）
   *    - not on panel（source on panel or not）
   * 2. multiple widgets(with panel, not with panel)
   *    - on panel
   *    - not on panel
   */
  const self = this;
  let panelObj = null;
  let oldPanId = null;
  let newPanel = null;
  let dbPanObj = null;
  if (subObj.isActiveSelection()) {
    if (subObj.isPanel || subObj.obj_type === 'WBRectPanel') return;

    // skip the check process if it is certain widget type
    if (
      !subObj ||
      subObj.isPanel ||
      (subObj.obj_type === 'WBArrow' &&
        (subObj.connectorEnd || subObj.connectorStart)) ||
      subObj === 'common'
    ) {
      return;
    }

    // the current binded panel object to the selected widgets
    // panel is the current contained panel, null meaning it is not on any panel
    newPanel = await self.getPanelIfExists(subObj);

    if (subObj.panelObj) {
      [panelObj] = self
        .getObjects()
        .filter((o) => o._id && o._id === subObj.panelObj);
    }
    // single widget, on a new panel
    if (newPanel) {
      // move widget from one panel to another panel
      if (panelObj && panelObj._id && newPanel._id !== panelObj._id) {
        await self.unbindObject(subObj, panelObj);
        self.syncPanelSubobjstoDBnRemoteUndoRedo(panelObj._id, subObj, false);
        await self.bindObject(subObj, newPanel);
        self.syncPanelSubobjstoDBnRemoteUndoRedo(newPanel._id, subObj, true);
      } else if (!panelObj) {
        await self.bindObject(subObj, newPanel);
        self.syncPanelSubobjstoDBnRemoteUndoRedo(newPanel._id, subObj, true);
      } else {
        await self.bindObject(subObj, newPanel, true);
      }
    } else {
      if (!subObj.panelObj) return;
      if (!panelObj) {
        subObj.panelObj = null;
        subObj.relationship = null;
      } else {
        await self.unbindObject(subObj, panelObj);
        self.syncPanelSubobjstoDBnRemoteUndoRedo(panelObj._id, subObj, false);
      }
    }
  } else {
    const panelList = [];
    if (canvas.getActiveObject()._objects.length > 1) {
      for (const obj of subObj._objects) {
        panelObj = null;
        oldPanId = null;
        newPanel = null;
        dbPanObj = null;

        if (obj.isPanel || obj.obj_type === 'WBRectPanel' || obj.isPanelTitle)
          continue;
        // skip the check process if it is certain widget type
        if (
          !obj ||
          obj.isPanel ||
          (obj.obj_type === 'WBArrow' &&
            (obj.connectorEnd || obj.connectorStart)) ||
          obj === 'common'
        ) {
          continue;
        }
        newPanel = await self.getPanelIfExists(obj);
        dbPanObj = WidgetService.getInstance()
          .getWidgetFromWidgetList(obj._id);
        // if the selected widget has a panel and the panel is also in the selection
        if (
          obj.panelObj &&
          subObj._objects.filter((o) => obj.panelObj === o._id) > 0
        )
          continue;

        if (
          !obj.panelObj ||
          obj.panelObj === undefined ||
          !dbPanObj.panelObj ||
          dbPanObj.panelObj === undefined
        ) {
          if (newPanel) {
            await self.bindObject(obj, newPanel);
            self.syncPanelSubobjstoDBnRemoteUndoRedo(newPanel._id, obj, true);
          }
        } else {
          panelObj = self.findById(dbPanObj.panelObj);

          if (!panelList.includes(panelObj)) panelList.push(panelObj);

          if (panelObj) {
            oldPanId = panelObj._id;
          }
          if (oldPanId) {
            if (newPanel) {
              if (oldPanId !== newPanel._id) {
                await self.unbindObject(obj, panelObj);
                self.syncPanelSubobjstoDBnRemoteUndoRedo(oldPanId, obj, false);
                await self.bindObject(obj, newPanel);
                self.syncPanelSubobjstoDBnRemoteUndoRedo(
                  newPanel._id,
                  obj,
                  true,
                );
              } else {
                await self.bindObject(obj, newPanel, true);
              }
            } else {
              await self.unbindObject(obj, panelObj);
              self.syncPanelSubobjstoDBnRemoteUndoRedo(oldPanId, obj, false);
            }
          } else if (newPanel) {
            await self.bindObject(obj, newPanel);
            self.syncPanelSubobjstoDBnRemoteUndoRedo(newPanel._id, obj, true);
          }
        }
      }
      if (!panelList || !panelList[0]) return false;
    }
  }
};

fabric.Canvas.prototype.deleteBindingPanel = function (objPanel) {
  const objList = [];

  const subObjList = objPanel.subIdList() || [];
  let stateList = [];
  canvas
    .getObjects()
    .filter((o) => _.contains(subObjList, o._id))
    .forEach((obj) => {
      obj.relationship = null;
      obj.panelObj = null;
      objList.push(obj);

      const stateObj = obj.getUndoRedoState('MODIFIED', {
        fields: ['panelObj', 'relationship'],
      });
      stateList = stateList.concat(stateObj);
    });
  const statePanel = objPanel.getUndoRedoState('REMOVED');
  stateList = stateList.concat(statePanel);

  setTimeout(() => {
    WidgetService.getInstance().removeWidget(objPanel._id);

    canvas.updateConnectorsRemovedWidget(objPanel);
    canvas.remove(objPanel).requestRenderAll();
    canvas.pushNewState(stateList);
  }, 200);

  const sel = canvas.getActiveSelection();
    sel.add(...objList);
  canvas.setActiveObject(sel);
};

fabric.Canvas.prototype.unbindObject = function (subObj, panelObj) {
  subObj.set('relationship', null);
  if (!panelObj) return;
  if (!panelObj.subObjs) {
    // from the legacy data structure, only have subObjList
    panelObj.subObjs = {};
    if (panelObj.subObjList && panelObj.subObjList.length > 0) {
      for (let i = 0; i < panelObj.subObjList.length; i++) {
        if (panelObj.subObjList[i] !== subObj._id) {
          panelObj.subObjs[panelObj.subObjList[i]] = true;
        } else {
          panelObj.subObjs[panelObj.subObjList[i]] = false;
        }
      }
    } else {
      // panel along, no objs attached

      panelObj.subObjs[subObj._id] = false;
    }
  } else {
    const { subObjs } = panelObj;

    subObjs[subObj._id] = false;
  }

  subObj.set('panelObj', null);
  canvas.sortByZIndex();
  // need consider undo/redo, currently it is not working
};

fabric.Canvas.prototype.unbindObjectNoSaveData = function (subObj, panelObj) {
  subObj.set('relationship', null);
  if (!panelObj) return;
  if (!panelObj.subObjs) {
    // from the legacy data structure, only have subObjList
    panelObj.subObjs = {};
    if (panelObj.subObjList && panelObj.subObjList.length > 0) {
      for (let i = 0; i < panelObj.subObjList.length; i++) {
        if (panelObj.subObjList[i] !== subObj._id) {
          panelObj.subObjs[panelObj.subObjList[i]] = true;
        } else {
          panelObj.subObjs[panelObj.subObjList[i]] = false;
        }
      }
    } else {
      // panel along, no objs attached
      panelObj.subObjs[subObj._id] = false;
    }
  } else {
    const { subObjs } = panelObj;
    subObjs[subObj._id] = false;
  }

  subObj.set('panelObj', null);
  // need consider undo/redo, currently it is not working
};

fabric.Canvas.prototype.deleteBindingToPanel = function (obj) {
  const self = this;

  const panelObj = self
    .getObjects()
    .filter((o) => !o.isPanelTitle || (o._id && o._id === obj.panelObj))[0];
  if (!panelObj) return;

  if (!panelObj.subObjs) {
    // from the legacy data structure, only have subObjList
    panelObj.subObjs = {};
    if (panelObj.subObjList && panelObj.subObjList.length > 0) {
      for (let i = 0; i < panelObj.subObjList.length; i++) {
        panelObj.subObjs[panelObj.subObjList[i]] = true;
      }
    }
    delete panelObj.subObjs[obj._id];
  } else {
    const { subObjs } = panelObj;
    delete subObjs[obj._id];
  }
};

// bind object to panel
fabric.Canvas.prototype.bindObject = function (
  subObj,
  panelObj,
  relationshipOnly,
) {
  const multiply = fabric.util.multiplyTransformMatrices;
  const invert = fabric.util.invertTransform;
  const bossTransform = panelObj.calcTransformMatrix();
  const invertedBossTransform = invert(bossTransform);
  if (!panelObj) return;
  if (!relationshipOnly) {
    if (!panelObj.subObjs) {
      // from the legacy data structure, only have subObjList
      panelObj.subObjs = {};
      if (panelObj.subObjList && panelObj.subObjList.length > 0) {
        for (let i = 0; i < panelObj.subObjList.length; i++) {
          panelObj.subObjs[panelObj.subObjList[i]] = true;
        }
        panelObj.subObjs[subObj._id] = true;
      } else {
        // panel along, no objs attached
        panelObj.subObjs[subObj._id] = true;
      }
    } else {
      const { subObjs } = panelObj;
      subObjs[subObj._id] = true;
    }
  }
  const desiredTransform = multiply(
    invertedBossTransform,
    subObj.calcTransformMatrix(),
  );
  // save the desired relation here.
  subObj.relationship = desiredTransform;
  if (!relationshipOnly) {
    subObj.set('panelObj', panelObj._id);
    const topFrameSubZIndex = panelObj.getTopZindexonFrame(subObj._id);
    subObj.set('zIndex', topFrameSubZIndex + 0.05);
  }
  subObj.dirty = true;
  canvas.anyChanges = true;
  canvas.sortByZIndex();
};

// bind object to panel
fabric.Canvas.prototype.bindObjectNoSaveData = function (subObj, panelObj) {
  const multiply = fabric.util.multiplyTransformMatrices;
  const invert = fabric.util.invertTransform;
  const bossTransform = panelObj.calcTransformMatrix();
  const invertedBossTransform = invert(bossTransform);
  if (!panelObj.subObjs) {
    // from the legacy data structure, only have subObjList
    panelObj.subObjs = {};
    if (panelObj.subObjList && panelObj.subObjList.length > 0) {
      for (let i = 0; i < panelObj.subObjList.length; i++) {
        panelObj.subObjs[panelObj.subObjList[i]] = true;
      }
      panelObj.subObjs[subObj._id] = true;
    } else {
      // panel along, no objs attached
      panelObj.subObjs[subObj._id] = true;
    }
  } else {
    const { subObjs } = panelObj;
    subObjs[subObj._id] = true;
  }

  const desiredTransform = multiply(
    invertedBossTransform,
    subObj.calcTransformMatrix(),
  );
  // save the desired relation here.
  subObj.relationship = desiredTransform;
  subObj.set('panelObj', panelObj._id);
  if (subObj.zIndex < panelObj.zIndex) {
    subObj.set('zIndex', Date.now() * 100);
    canvas.anyChanges = true;
  }
};

/* change this function from return true or false to return indicator
 -1, not dealing with frame;
 0, move/scale out from a frame to blank area;
 1, move/scale out from a frame to another frame;
 2, move/scale in from a blank area to a frame;
  3, move/scale within a frame;
 */
fabric.Canvas.prototype.checkIfPanelBindingStatusChange = function (object) {
  const currentPanel = object.panelObj;
  const localWidget = WidgetService.getInstance().getLocalWidget();
  const originalPanel =
    localWidget.findOne(object._id) && localWidget.findOne(object._id).panelObj;

  if (currentPanel === null || currentPanel === undefined) {
    if (originalPanel === undefined || originalPanel === null) {
      /* not deal with any frame */
      return -1;
    }
    return 0;
  }
  if (originalPanel === undefined || originalPanel === null) {
    if (currentPanel) return 2;
  }
  if (currentPanel === originalPanel) {
    return 3;
  }
  if (currentPanel !== originalPanel) {
    return 1;
  }
};

fabric.Canvas.prototype.getPreviousPanelIfBindingStatusChange = function (
  object,
) {
  const currentPanel = object.panelObj;
  let originalPanel;
  const localWidget = WidgetService.getInstance().getLocalWidget();
  if (localWidget.findOne(object._id)) {
    originalPanel = localWidget.findOne(object._id).panelObj;
  } else {
    originalPanel = null;
  }

  if (
    currentPanel !== originalPanel &&
    originalPanel &&
    localWidget.findOne(originalPanel)
  ) {
    return originalPanel;
  }
  return null;
};
