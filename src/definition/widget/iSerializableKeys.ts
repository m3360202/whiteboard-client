import { WidgetType } from './widgetType';

export interface ISerializableKeys {
  _id: string;
  angle: number; //  integer, angle for recording rotating
  backgroundColor: string; // string,  background color, works when the image is transparent
  fill: string; // the font color
  width: number; // integer, width of the object
  height: number; // integer, height of the object
  left: number; // integer left for position
  locked: boolean; // boolean, lock status for the widget， this is connected to lock
  lockMovementX: boolean; // boolean, lock the verticle movement
  lockMovementY: boolean; // boolean, lock the horizontal movement
  lockScalingFlip: boolean; // boolean,  make it can not be inverted by pulling the width to the negative side
  obj_type: string; // string type
  originX: string; // string, Horizontal origin of transformation of an object (one of "left", "right", "center") See http://jsfiddle.net/1ow02gea/244/ on how originX/originY affect objects in groups
  originY: string; // string, Vertical origin of transformation of an object (one of "top", "bottom", "center") See http://jsfiddle.net/1ow02gea/244/ on how originX/originY affect objects in groups
  scaleX: number; // nunber, Object scale factor (horizontal)
  scaleY: number; // number, Object scale factor (vertical)
  selectable: boolean; // boolean, When set to `false`, an object can not be selected for modification (using either point-click-based or group-based selection). But events still fire on it.
  top: number; // integer, Top position of an object. Note that by default it's relative to object top. You can change this by setting originY={top/center/bottom}
  userNo: string; // string, the unique id for the user, one user id could open mutiple browser, each browser has unique user no
  userId: string; // string, user identity
  whiteboardId: string; // whiteboard id, string
  zIndex: number; // the index for the object on whiteboard, integer
  version: string; // version of the app, string
  type: string; // widget type, string
  isPanel: boolean; // is this a panel, boolean
  panelObj: boolean; // if this is a panel, the id of the panel, string
  relationship: object[]; // array, viewporttransform
  subObjList: string; // ["5H9qYfNGt4vizhcuS"] array list _id for sub objects
  getSerializableKeys(): any;
  getDeserializeKeys(): any;
  getParentSelfKeys(): any;
  getKeys(): any;
}
