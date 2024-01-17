//
import { JSType } from '../../definition/jsType';
import { ControlPosition } from '../../definition/widget/controlPosition';
import 'reflect-metadata';

export class Util {

  static checkEmpty(...args) {

    if (args === null || args.length === 0) return true;

    for (let i = 0; i < args.length; i++) {
      let obj = args[i];
      if (typeof obj !== JSType.OBJECT || obj == null) return true;
      if (Array.isArray(obj) && obj.length === 0) return true;
      else if (Object.keys(obj).length === 0) return true;
    }

    return false;

  }

  static getObject(obj: any): any {

    const object = {};

    const hasValueKeys = obj.getKeys().filter((r) => obj[r] !== undefined);

    hasValueKeys.forEach((key: string) => {
      object[key] = obj[key];
    });

    return object;

  }

  static convertEnumKeyToValue(obj: Object): Array<string> {

    if (Util.checkEmpty(obj)) return null;

    const keys = Object.keys(obj);

    const values = [];

    keys.forEach((key) => {
      values.push(obj[key]);
    });

    return values;

  }
  
  static spliceData(
    data: Array<Object>,
    startIndex?: number,
    endIndex?: number,
  ): Array<Object> {
    if (Util.checkEmpty(data)) return null;
    if (startIndex !== undefined && startIndex !== null)
      data = data.slice(startIndex, data.length);
    if (endIndex !== undefined && endIndex !== null) {
      if (startIndex === undefined || startIndex === null) startIndex = 0;
      data = data.slice(startIndex, endIndex + 1);
    }
    return data;
  }
  static setControlVisible(obj: any, postions: any, value: boolean) {
    if (Util.checkEmpty(obj)) return null;
    postions.forEach((postion: string) => {
      obj.setControlVisible(postion, value);
    });
  }
  static getDecoratorsMetadata(
    obj: any,
    metadataKey: string,
    isTrue: boolean = false,
    isKey: boolean = true,
  ): string[] {
    const seariableKeys: string[] = [];
    Object.keys(obj).forEach((key: string) => {
      const metaValue = Reflect.getMetadata(metadataKey, obj, key);
      const value = isKey ? key : obj[key];
      if (isTrue && metaValue) {
        seariableKeys.push(value);
      } else if (!isTrue && !metaValue) {
        seariableKeys.push(value);
      }
    });
    return seariableKeys;
  }

  static uniq(array: string[]): string[] {
    return Array.from(new Set(array));
  }

  static deleteArrayData(array: string[], deleteData: string[]): string[] {
    const setData = new Set(array);
    const data = [];
    deleteData.forEach((value: string) => {
      setData.delete(value);
    });
    for (let [key, value] of setData.entries()) data.push(key);
    return data;
  }

  static addSuperClass(className: any, fabricObject: Object) {
    className.prototype.constructor.superclass = fabricObject;
  }

  static drawCtl(
    obj: any,
    drawPositions: Array<ControlPosition>,
    ctx: any,
    isFill: boolean,
    left: number,
    top: number,
    width: number,
    height: number,
    fillStyle1: string,
    strokeStyle1: string,
    fillStyle2: string,
    strokeStyle2: string,
  ) {
    drawPositions.forEach((p: ControlPosition) => {
      let [offsetX, offsetY] = [0, 0];
      let [fillStyle, strokeStyle] = [fillStyle2, strokeStyle2];
      let [newLeft, newTop] = [left, top];
      switch (p) {
        case ControlPosition.MTA:
          newLeft = left + width / 2;
          offsetY = -10;
          break;
        case ControlPosition.MBA:
          newLeft = left + width / 2;
          newTop = top + height;
          offsetY = 10;
          break;
        case ControlPosition.MRA:
          newLeft = left + width;
          newTop = top + height / 2;
          offsetX = 10;
          break;
        case ControlPosition.MLA:
          newTop = top + height / 2;
          offsetX = -10;
          break;
        case ControlPosition.TL:
          fillStyle = fillStyle1;
          strokeStyle = strokeStyle1;
          break;
        case ControlPosition.BR:
          newLeft = left + width;
          newTop = top + height;
          fillStyle = fillStyle1;
          strokeStyle = strokeStyle1;
          break;
        case ControlPosition.TR:
          newLeft = left + width;
          fillStyle = fillStyle1;
          strokeStyle = strokeStyle1;
          break;
        case ControlPosition.BL:
          newTop = top + height;
          fillStyle = fillStyle1;
          strokeStyle = strokeStyle1;
          break;
        case ControlPosition.MTR2:
          newLeft = left + width / 2;
          newTop = top + height;
          fillStyle = fillStyle1;
          strokeStyle = strokeStyle1;
          offsetY = 40;
          break;
        case ControlPosition.MT:
          newLeft = left + width / 2;
          fillStyle = fillStyle1;
          strokeStyle = strokeStyle1;
          break;
        case ControlPosition.MB:
          newLeft = left + width / 2;
          newTop = top + height;
          fillStyle = fillStyle1;
          strokeStyle = strokeStyle1;
          break;
        case ControlPosition.MR:
          newLeft = left + width;
          newTop = top + height / 2;
          fillStyle = fillStyle1;
          strokeStyle = strokeStyle1;
          break;
        case ControlPosition.ML:
          newTop = top + height / 2;
          fillStyle = fillStyle1;
          strokeStyle = strokeStyle1;
          break;
      }
      obj._drawControl(
        p,
        ctx,
        isFill,
        newLeft,
        newTop,
        fillStyle,
        strokeStyle,
        offsetX,
        offsetY,
      );
    });
  }


  static getInstanceMethodNames(obj) {
    const proto = Object.getPrototypeOf(obj);
    const names = Object.getOwnPropertyNames(proto);
    return names.filter(
      (name) => typeof obj[name] === 'function' && name != 'constructor',
    );
  }

  static getFileType(name = '') {
    let fileType = '';
    switch (name.substring(name.lastIndexOf('.') + 1)) {
      case 'doc':
      case 'docx':
        fileType = 'Word Document';
        break;
      case 'xls':
      case 'xlsx':
        fileType = 'Excel Document';
        break;
      case 'ppt':
      case 'pptx':
        fileType = 'PPT Document';
        break;
      case 'pdf':
        fileType = 'PDF Document';
        break;
      case 'zip':
        fileType = 'ZIP File';
        break;
      case 'mp4':
        fileType = 'Video Document';
        break;
      case 'webm':
        fileType = 'Video Document';
        break;
      default:
        fileType = 'Other Document';
        break;
    }
    return fileType;
  }
}
