import _ from 'lodash';

//**Import Fabric */
import * as fabric  from '@boardxus/x-canvas';

//**Import Services */
import { WidgetService, BoardService } from '../../../services';

//**Import Redux Store */
import store from '../../../store';

fabric.Canvas.prototype.syncObjectChangeToRemote = function (id, data) {

  const self = this;

  // if 'toUpdateObjectRemote' does not exist on 'this', assign it an empty array
  if (!self.toUpdateObjectRemote){
    self.toUpdateObjectRemote = [];
  } 

  // check if there is existing item in 'toUpdateObjectRemote' that matches the provided 'id'
  const existsItem = self.toUpdateObjectRemote.filter((r) => r.id === id);

  // cleans the 'data' by removing 'userNo' property
  delete data.userNo;

  // if the item does not exist, push the item to 'toUpdateObjectRemote'
  // if the item exists, update the item with the new data
  if (existsItem.length === 0) {
    self.toUpdateObjectRemote.push({ id, d: data });
  } else {
    _.keys(data).forEach((key) => {
      // skip the 'userNo' field
      if (key === 'userNo') return;

      // for all other keys, update the existing item's value with the new value
      existsItem[0].d[key] = data[key];
    });
  }
};

fabric.Canvas.prototype.syncNewObjectToRemote = function (data) {

  const self = this;

  // if 'toUpdateNewObjectRemote' does not exist on 'this', assign it an empty array
  if (!self.toUpdateNewObjectRemote) self.toUpdateNewObjectRemote = [];

  // push the new data to 'toUpdateNewObjectRemote'
  self.toUpdateNewObjectRemote.push(data);

};

fabric.Canvas.prototype.syncRemovedObjectToRemote = function (widgetId) {

  const self = this;

  // if 'toUpdateRemovedObjectRemote' does not exist on 'this', assign it an empty array
  if (!self.toUpdateRemovedObjectRemote){
    self.toUpdateRemovedObjectRemote = [];
  } 

  // check if there is an existing item in 'toUpdateRemovedObjectRemote' that matches the provided 'widgetId'
  const existsItem = self.toUpdateRemovedObjectRemote.filter( (r) => r.id === widgetId );

  // if the item does not exist, push the item to 'toUpdateRemovedObjectRemote'
  // if the item exists, update the item with the new data
  if (existsItem.length === 0) {
    self.toUpdateRemovedObjectRemote.push({ _id: widgetId });
  } else {
    _.keys(data).forEach((key) => {
      // update the existing item's value with the new value
      existsItem[0].d[key] = data[key];
    });
  }

};

/**
 * //update panel subObjs
 * @param {string} panId
 * @param {object} subobj
 * @param {bool} boolInPan
 */
fabric.Canvas.prototype.syncPanelSubobjstoDBnRemoteUndoRedo = function (
  panId, // The id of the panel to be synced
  subobj, // Subobject to be synced
  boolInPan, // Boolean to verify if the subobject is inside the panel
) {

  // Check if the subobject to be synced is currently being modified
  if (subobj.isActiveSelection()) {

    // Create an object to store the subobject data
    const subObjData2 = {};

    // Get the subobject id and its corresponding value in the panel
    const subobjId = `subObjs.${subobj._id}`;

    subObjData2[subobjId] = boolInPan;

    // Update the widget with the new subobject data
    WidgetService.getInstance().updateWidget(panId, subObjData2);

    // Create an object to store the updated subobject data
    const data = {};

    const toupdate = [];

    data.t = 11;

    data.d = {
      uno: store.getState().user.userInfo.userNo, // Session ID
      o: [{ id: panId, subId: subobj._id, value: boolInPan }], // New updates
    };

    // Push the updates to the update array
    toupdate.push(data);

    // Get the currentBoardId from the store state
    const currentBoardId = store.getState().board.board._id;

    // Publish the updates to the whiteboard
    BoardService.getInstance().publishWhiteboardActivity(
      currentBoardId,
      toupdate,
      false,
    );

  } else {
    // If the subobject is not being actively modified, it is an AS
    const subObjData2 = {};

    const toupdate = [];

    // Iterate through the subobjects
    subobj._objects.forEach((obj) => {

      // Skip if it is a panel
      if (obj.isPanel) return;

      // Skip if the object is a panel object and if the subobject already exists in the panel
      if (obj.panelObj && subobj._objects.filter((o) => obj.panelObj === o._id) > 0 ) return;

      // Get the subobject id and its corresponding value in the panel
      const subobjId = `subObjs.${obj._id}`;

      subObjData2[subobjId] = boolInPan;

      const data = {};

      data.t = 11;
      
      data.d = {
        uno: store.getState().user.userInfo.userNo, // Session ID
        o: [{ id: panId, subId: obj._id, value: boolInPan }], // New updates
      };

      // Push the updates to the update array
      toupdate.push(data);

    });

    // Update the widget with the new subobject data
    WidgetService.getInstance().updateWidget(panId, subObjData2);

    // Get the currentBoardId from the store state
    const currentBoardId = store.getState().board.board._id;

    // Publish the updates to the whiteboard
    BoardService.getInstance().publishWhiteboardActivity(
      currentBoardId,
      toupdate,
      false,
    );
  }
};
