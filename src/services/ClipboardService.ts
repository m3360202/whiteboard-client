import { UtilityService, WidgetService } from '.';

import store from '../store';
import _ from 'lodash';

export default class ClipboardService {

  public _objects: any;

  static service = null;

  static getInstance(): ClipboardService {
    if (ClipboardService.service == null) {
      ClipboardService.service = new ClipboardService();
      Boardx.Instance.ClipboardService = ClipboardService.service;
    }
    return ClipboardService.service;
  }

  makeError() {
    return new DOMException('The request is not allowed', 'NotAllowedError');
  }

  async clipboardCopy(text) {
    try {
      if (!navigator.clipboard) {
        throw this.makeError();
      }
      navigator.clipboard.writeText(text);
    } catch (err) {
      // ...Otherwise, use document.execCommand() fallback
      try {
        // Put the text to copy into a <span>
        const span = document.createElement('span');

        span.textContent = text;

        // Preserve consecutive spaces and newlines
        span.style.whiteSpace = 'pre';

        span.style.webkitUserSelect = 'auto';

        span.style.userSelect = 'all';

        // Add the <span> to the page
        document.body.appendChild(span);

        // Make a selection object representing the range of text selected by the user
        const selection = window.getSelection();

        const range = window.document.createRange();

        selection.removeAllRanges();

        range.selectNode(span);

        selection.addRange(range);

        // Copy text to the clipboard
        let success = false;
        try {
          success = window.document.execCommand('copy');
        } finally {

          // Cleanup
          selection.removeAllRanges();

          window.document.body.removeChild(span);
        }

        if (!success) throw this.makeError();

      } catch (err2) {
        throw err2 || err || this.makeError();
      }
    }
  }

  async pasteFiles(blobs, left, top) {
    const prefix = 'board.filedrop.startuploadfile';
    const suffix =
      blobs.length == 1
        ? 'board.filedrop.file'
        : 'board.filedrop.files';

    Boardx.Util.Msg.info(`${prefix} ${blobs.length} ${suffix}`);



    canvas.uploadFilesToWhiteboard(
      blobs,
      left,
      top
    );
  }

  async pasteWidget() {

  }

  async pasteWebsite() {

  }

  //paste event handler
  async pasteCallback(blobs, clipboardContent, newPosition = null, boardId, userId) {

    const position = newPosition;
    const object = canvas.getActiveObject();
    if (object && object.isEditing) {
      return;
    }

    if (blobs.length > 0) {
      await this.pasteFiles(
        blobs,
        position.x,
        position.y
      );

    } else if (clipboardContent) {

      if (clipboardContent.indexOf('"obj_type":') !== -1) {

        const objs = JSON.parse(clipboardContent).data.map(o => {
          if (o) return o;
        });

        let data = null;
        let whiteBoardId = boardId;
        let minX = Number.MAX_VALUE;
        let maxX = - 1000000;
        let minY = Number.MAX_VALUE;
        let maxY = -1000000;

        objs.forEach(o => {

          const xValues = o.left !== undefined ? [o.left-o.width/2, o.left+o.width/2, ] : [o.x1, o.x2];
          const yValues = o.top !== undefined ? [o.top - o.height/2, o.top + o.height/2] : [o.y1, o.y2];

          minX = Math.min(minX, ...xValues);
          maxX = Math.max(maxX, ...xValues);
          minY = Math.min(minY, ...yValues);
          maxY = Math.max(maxY, ...yValues);
        });


        let preLeft = 0;
        let preTop = 0;

        preLeft += position.x - (minX + maxX) / 2;
        preTop += position.y - (minY + maxY) / 2;

        for (let i = 0; i < objs.length; i++) {
          data = objs[i];
          if (data.left!== undefined) data.left += preLeft;
          else {
            data.x1 += preLeft;
            data.x2 += preLeft;
          }
          if (data.top !== undefined) data.top += preTop;
          else {
            data.y1 += preTop;
            data.y2 += preTop;
          }
        }
        preLeft = 0;
        preTop = 0;

        const dnow = Date.now() * 100;
        const idList = [];
        objs.forEach(obj => {
          idList.push(obj._id);
        });

        const oldIdObjs = {};
        const newIdObjs = {};

        // old and new ID objects
        for (let i = 0; i < idList.length; i++) {
          const oldId = idList[i];
          const newId = UtilityService.getInstance().generateWidgetID();
          oldIdObjs[oldId] = i;
          newIdObjs[i] = newId;
        }

        const dataArr = [];
        let newState = [];

        objs.sort((a, b) => a.zIndex - b.zIndex);

        const newZindexArr = canvas.zindexArrBetween(
          dnow,
          dnow + 99,
          objs.length
        );
        for (let i = 0; i < objs.length; i++) {
          data = objs[i];
          if (data.left) data.left += preLeft;
          else {
            data.x1 += preLeft;
            data.x2 += preLeft;
          }
          if (data.top) data.top += preTop;
          else {
            data.y1 += preTop;
            data.y2 += preTop;
          }
          data.userId = userId;
          data.lastEditedBy = userId;
          data.whiteboardId = whiteBoardId;
          data.timestamp = newZindexArr[i];
          data.zIndex = newZindexArr[i];
          data.status = '';
          delete data.isDouble;

          // if it has lines conncted.
          if (data.lines && data.lines.length) {
            for (let m = 0; m < data.lines.length; m++) {
              if (idList.includes(data.lines[m]._id)) {
                data.lines[m]._id = newIdObjs[oldIdObjs[data.lines[m]._id]];
              } else {
                delete data.lines[m];
              }
            }
            data.lines = _.without(data.lines, null);
            if (data.lines.length < 1) data.lines = null;
          }

          if (data.connectorEnd) {
            if (idList.includes(data.connectorEnd._id)) {
              data.connectorEnd._id =
                newIdObjs[oldIdObjs[data.connectorEnd._id]];
            } else {
              data.connectorEnd = null;
            }
          }

          if (data.connectorStart) {
            if (idList.includes(data.connectorStart._id)) {
              data.connectorStart._id =
                newIdObjs[oldIdObjs[data.connectorStart._id]];
            } else {
              data.connectorStart = null;
            }
          }

          if (data.obj_type === 'WBGroup') {
            const _oldIdObjs = {};
            const _newIdObjs = {};
            let g2Str = JSON.stringify(data);
            const strArr = g2Str.match(/\"_id":"+[A-Za-z0-9]{17}/g);
            for (let i = 1; i < strArr.length; i++) {
              strArr[i] = strArr[i].replace('"_id":"', '');
              const gpoldId = strArr[i];
              const gpnewId = UtilityService.getInstance().generateWidgetID();
              _oldIdObjs[gpoldId] = i;
              _newIdObjs[i] = gpnewId;
            }
            //_newIdObjs[0] = newIdObjs[oldIdObjs[strArr[0]]];
            for (let i = 1; i < strArr.length; i++) {
              g2Str = g2Str.replace(strArr[i], _newIdObjs[i]);
            }

            data = JSON.parse(g2Str);
          }

          const oritinalId = data._id;
          data._id = newIdObjs[oldIdObjs[oritinalId]];
          const widgetObj = await canvas.renderWidgetAsync(data);
          const state = widgetObj.getUndoRedoState('PASTE');
          newState = newState.concat(state);
          dataArr.push(data);
          if (!canvas.getActiveObject()) {
            const sel = canvas.getActiveSelection();
            sel.add(...[widgetObj]);
            canvas.setActiveObject(sel);
          } else {
            canvas.getActiveObject().add(widgetObj);
            canvas.requestRenderAll();
          }
        }

        if (dataArr.length === 1 && dataArr[0].obj_type === 'WBArrow') {
          canvas.discardActiveObject();
        }
        await WidgetService.getInstance().insertWidgetArr(dataArr);

        canvas.pushNewState(newState);
      } else if (Boardx.Util.isURL(clipboardContent)) {
        Boardx.Util.Msg.info('Uploading one website...');
          UtilityService.getInstance().uploadWebsite(
            boardId,
            clipboardContent,
            position.x,
            position.y
          );
      }
      else {
        await canvas.createWidgetatCurrentLocationByType('WBText', {
          useCenterOfScreen: true,
          clipboardContent
        });
        // canvas.getActiveObject().set('fixedScaleChange', true);
        canvas.getActiveObject().exitEditing();
      }
    }
  }

  // //cmd + D to duplicate
  // async duplicate(duplicateObject, direction) {
  //   const self = duplicateObject;


  //   const objectArrExcludeGroup = [];
  //   const objIDArrExcludeGroup = [];
  //   const dpObjArr = [];
  //   const toUpdate = [];
  //   const dnow = Date.now() * 100;
  //   let stateList = [];
  //   const oldIdObjs = {};
  //   const newIdObjs = {};

  //   if (self.isActiveSelection()) {
  //     const { _objects } = self;

  //     self._objects.sort((a, b) => a.zIndex - b.zIndex);
  //     const newZindexArr = canvas.zindexArrBetween(
  //       dnow,
  //       dnow + 99,
  //       self._objects.length
  //     );

  //     for (const obj of self._objects) {
  //       if (!obj.isPanelTitle) {
  //         if (!obj._id) return;
  //         objectArrExcludeGroup.push(obj.getObject());
  //         objIDArrExcludeGroup.push(obj._id);
  //       }
  //     }
  //     //const zindexAddition = dnow - self._objects[0].zIndex;
  //     // old and new ID objects
  //     for (let i = 0; i < objIDArrExcludeGroup.length; i++) {
  //       const oldId = objIDArrExcludeGroup[i];
  //       const newId = UtilityService.getInstance().generateWidgetID();
  //       oldIdObjs[oldId] = i;
  //       newIdObjs[i] = newId;
  //     }
  //     // 所有WBGroup对象

  //     for (let i = 0; i < _objects.length; i++) {
  //       const obj = _objects[i];
  //       if (
  //         (obj.obj_type === 'WBGroup' && !obj.panelObj) ||
  //         (obj.obj_type === 'WBGroup' &&
  //           obj.panelObj &&
  //           !objIDArrExcludeGroup.includes(obj.panelObj))
  //       ) {
  //         const _oldIdObjs = {};
  //         const _newIdObjs = {};
  //         let data = obj.getCloneWidget();
  //         let g2Str = JSON.stringify(obj.getObject());
  //         const strArr = g2Str.match(/\"_id":"+[A-Za-z0-9]{17}/g);
  //         for (let i = 0; i < strArr.length; i++) {
  //           strArr[i] = strArr[i].replace('"_id":"', '');
  //           const gpoldId = strArr[i];
  //           const gpnewId = UtilityService.getInstance().generateWidgetID();
  //           _oldIdObjs[gpoldId] = i;
  //           _newIdObjs[i] = gpnewId;
  //         }
  //         for (let i = 0; i < strArr.length; i++) {
  //           g2Str = g2Str.replace(strArr[i], _newIdObjs[i]);
  //         }

  //         data = JSON.parse(g2Str);
  //         data.left = obj.left * obj.group.scaleX + position.x;
  //         data.top = obj.top * obj.group.scaleY + position.y;
  //         data.height = obj.height;
  //         data.width = obj.width;
  //         data.scaleX = obj.scaleX * obj.group.scaleX;
  //         data.scaleY = obj.scaleY * obj.group.scaleY;
  //         data.userId = store.getState().user.userInfo.userId;
  //         data.lastEditedBy = store.getState().user.userInfo.userId;
  //         data.whiteboardId =
  //           store.getState().board.board._id;

  //         data.timestamp = obj.timestamp;
  //         data.zIndex = newZindexArr[i];

  //         const newWidget = await canvas.renderWidgetAsync(data);
  //         toUpdate.push(data);
  //         dpObjArr.push(newWidget);
  //         const newState = newWidget.getUndoRedoState('PASTE');
  //         stateList = stateList.concat(newState);
  //       }
  //     }

  //     for (let i = 0; i < objectArrExcludeGroup.length; i++) {
  //       const objbeforeDup = canvas.findById(objectArrExcludeGroup[i]._id);
  //       if (
  //         (objbeforeDup.obj_type !== 'WBGroup' && !objbeforeDup.panelObj) ||
  //         (objbeforeDup.panelObj &&
  //           !objIDArrExcludeGroup.includes(objbeforeDup.panelObj))
  //       ) {
  //         const objeg = objbeforeDup.getCloneWidget();
  //         if (objeg.obj_type === 'WBArrow') {
  //           objeg.left += position.x;
  //           objeg.top += position.y;
  //           objeg.x1 += position.x;
  //           objeg.y1 += position.y;
  //           objeg.x2 += position.x;
  //           objeg.y2 += position.y;

  //           if (
  //             objbeforeDup.connectorStart &&
  //             objIDArrExcludeGroup.includes(objbeforeDup.connectorStart._id)
  //           ) {
  //             const newSId =
  //               newIdObjs[oldIdObjs[objbeforeDup.connectorStart._id]];
  //             objeg.connectorStart = {
  //               _id: newSId,
  //               rx: objbeforeDup.connectorStart.rx,
  //               ry: objbeforeDup.connectorStart.ry
  //             };
  //           }

  //           if (
  //             objbeforeDup.connectorEnd &&
  //             objIDArrExcludeGroup.includes(objbeforeDup.connectorEnd._id)
  //           ) {
  //             const newEId =
  //               newIdObjs[oldIdObjs[objbeforeDup.connectorEnd._id]];
  //             objeg.connectorEnd = {
  //               _id: newEId,
  //               rx: objbeforeDup.connectorEnd.rx,
  //               ry: objbeforeDup.connectorEnd.ry
  //             };
  //           }
  //           objeg._id = newIdObjs[oldIdObjs[objbeforeDup._id]];
  //           objeg.timestamp = objbeforeDup.timestamp;
  //           objeg.zIndex = newZindexArr[i];
  //           const newWidget = await canvas.renderWidgetAsync(objeg);
  //           toUpdate.push(objeg);
  //           dpObjArr.push(newWidget);
  //           const newState = newWidget.getUndoRedoState('PASTE');
  //           stateList = stateList.concat(newState);
  //         } else if (objeg.obj_type === 'WBImage') {
  //           if (objeg.src.indexOf('?') > -1)
  //             objeg.src = objeg.src.split('?')[0];
  //           objeg.left =
  //             objbeforeDup.left * objbeforeDup.group.scaleX + position.x;
  //           objeg.top =
  //             objbeforeDup.top * objbeforeDup.group.scaleY + position.y;
  //           objeg.height = objbeforeDup.height;
  //           objeg.width = objbeforeDup.width;
  //           objeg.scaleX = objbeforeDup.scaleX * objbeforeDup.group.scaleX;
  //           objeg.scaleY = objbeforeDup.scaleY * objbeforeDup.group.scaleY;
  //           objeg._id = newIdObjs[oldIdObjs[objbeforeDup._id]];
  //           objeg.timestamp = objbeforeDup.timestamp;
  //           objeg.zIndex = newZindexArr[i];
  //           const newWidget = await canvas.renderWidgetAsync(objeg);
  //           toUpdate.push(objeg);
  //           dpObjArr.push(newWidget);
  //           const newState = newWidget.getUndoRedoState('PASTE');
  //           stateList = stateList.concat(newState);
  //         } else {
  //           if (objbeforeDup.lines && objbeforeDup.lines.length > 0) {
  //             objeg.lines = [];
  //             for (let j = 0; j < objbeforeDup.lines.length; j++) {
  //               const lineid = objbeforeDup.lines[j]._id;
  //               if (objIDArrExcludeGroup.includes(lineid)) {
  //                 // push in the lines arrow
  //                 const newlineId = newIdObjs[oldIdObjs[lineid]];
  //                 objeg.lines.push({ _id: newlineId });
  //               }
  //             }
  //           }
  //           objeg.left =
  //             objbeforeDup.left * objbeforeDup.group.scaleX + position.x;
  //           objeg.top =
  //             objbeforeDup.top * objbeforeDup.group.scaleY + position.y;
  //           objeg.height = objbeforeDup.height;
  //           objeg.width = objbeforeDup.width;
  //           objeg.scaleX = objbeforeDup.scaleX * objbeforeDup.group.scaleX;
  //           objeg.scaleY = objbeforeDup.scaleY * objbeforeDup.group.scaleY;
  //           objeg._id = newIdObjs[oldIdObjs[objbeforeDup._id]];
  //           objeg.lastEditedBy = store.getState().user.userInfo.userId;
  //           objeg.timestamp = objbeforeDup.timestamp;
  //           objeg.zIndex = newZindexArr[i];
  //           const newWidget = await canvas.renderWidgetAsync(objeg);
  //           toUpdate.push(objeg);
  //           dpObjArr.push(newWidget);
  //           const newState = newWidget.getUndoRedoState('PASTE');
  //           stateList = stateList.concat(newState);
  //         }
  //       }
  //     }
  //     self.canvas.discardActiveObject();
  //     // 设置活动对象
  //     const activeSelection = dpObjArr;
  //     const sel = canvas.getActiveSelection();
  //     sel.add(...activeSelection);
  //     canvas.setActiveObject(sel);
  //     await WidgetService.getInstance().insertWidgetArr(toUpdate);

  //     canvas.pushNewState(stateList);
  //   } else {
  //     if (
  //       (!self.getCloneWidget || !self.getCloneWidget()) &&
  //       self.type !== 'WBGroup'
  //     )
  //       return;
  //     const _oldIdObjs = {};
  //     const _newIdObjs = {};
  //     const zindexAddition = dnow - self.zIndex;
  //     if (self.obj_type === 'WBGroup') {
  //       let data = self.getCloneWidget();
  //       let g2Str = JSON.stringify(self.getObject());
  //       const strArr = g2Str.match(/\"_id":"+[A-Za-z0-9]{17}/g);
  //       for (let i = 0; i < strArr.length; i++) {
  //         strArr[i] = strArr[i].replace('"_id":"', '');
  //         const gpoldId = strArr[i];
  //         const gpnewId = UtilityService.getInstance().generateWidgetID();
  //         _oldIdObjs[gpoldId] = i;
  //         _newIdObjs[i] = gpnewId;
  //       }
  //       for (let i = 0; i < strArr.length; i++) {
  //         g2Str = g2Str.replace(strArr[i], _newIdObjs[i]);
  //       }

  //       data = JSON.parse(g2Str);
  //       data.lines = null;
  //       data.left = position.x;
  //       data.top = position.y;
  //       data.userId = store.getState().user.userInfo.userId;
  //       data.lastEditedBy = store.getState().user.userInfo.userId;
  //       data.whiteboardId =
  //         store.getState().board.board._id;
  //       data.timestamp = self.timestamp + zindexAddition;
  //       data.zIndex = self.zIndex + zindexAddition;

  //       await WidgetService.getInstance().insertWidget(data);
  //       const newWidget = await canvas.renderWidgetAsync(data);
  //       self.canvas.setActiveObject(newWidget);
  //       self.canvas.requestRenderAll();
  //       const newState = canvas
  //         .findById(newWidget._id)
  //         .getUndoRedoState('PASTE');
  //       canvas.pushNewState(newState);
  //     } else {
  //       const widget = self.getCloneWidget();

  //       widget.left = position.x;
  //       widget.top = position.y;
  //       widget.height = self.height;
  //       widget.width = self.width;
  //       widget.fromCopy = true;
  //       widget.timestamp = self.timestamp + zindexAddition;
  //       widget.zIndex = self.zIndex + zindexAddition;
  //       widget.lastEditedBy = store.getState().user.userInfo.userId;
  //       widget.lines = [];
  //       widget._id = UtilityService.getInstance().generateWidgetID();
  //       await WidgetService.getInstance().insertWidget(widget);
  //       const newWidget = await canvas.renderWidgetAsync(widget);
  //       self.canvas.setActiveObject(newWidget);
  //       self.canvas.requestRenderAll();
  //       const newState = canvas
  //         .findById(newWidget._id)
  //         .getUndoRedoState('PASTE');
  //       canvas.pushNewState(newState);
  //     }
  //   }
  // }


}


