import { WidgetService } from '../../services';
//** Import Redux kit
import store,{  RootState } from '../../store';
import {handleSetCurrentLockStatus,handleSetCurrentAlign,handleSetWidgetMenuTouchList } from '../../store/board';
import { useSelector, useDispatch } from 'react-redux';
import {handleChangeFontSize, handleChangeFontFamily, handleChangeMenuPosition} from '../../store/widgetMenu';
import { handleSetMenuTouchDisplay, handleSetMenuTouchPosition,handleSetOpacityValue,handleSetCurrentHoverObjectId } from '../../store/widgets';
import * as fabric from '@boardxus/x-canvas';
import _ from 'lodash';

export default function showMenuTouch(e) {
  if (!canvas || !canvas.getActiveObject) {
    store.dispatch(handleSetMenuTouchDisplay('none'));
    return;
  }

  const target = canvas.getActiveObject();

  console.log('target: ', target);

  if (!target) {
    store.dispatch(handleSetWidgetMenuTouchList([]));
    store.dispatch(handleSetMenuTouchDisplay('none'));
    return;
  }

  let menus = [
    'emojiMenu',
    'drawNote',
    'textNote',
    'fontSize',
    'changeFont',
    'textAlign',
    'resetDraw',
    'newLayout',
    'alignGroup',
    'backgroundColor',
    'fillColor',
    'strokeColor',
    'fontColor',
    'shapeBorderColor',
    'shapeBackgroundColor',
    'oldShapeBackgroundColor',
    'polylineArrowColor',
    'noteDrawColor',
    'drawOption',
    'lineWidth',
    'shadowMenu',
    'resetDraw',
    'applyFormat',
    'switchNoteType',
    'arrowLineWidth',
    'connectorShape',
    'connectorStyle',
    'connectorTip',
    'borderLineIcon',
    'fontWeight',
    'textBullet',
    'objectLock',
    'objectDelete',
    'moreMenuStickyNote',
  ];

  if (
    !target ||
    (target && target.obj_type === 'common') ||
    (!target && !canvas.isDrawingMode)
  ) {
    store.dispatch(handleSetWidgetMenuTouchList([]));
    return;
  }
  store.dispatch(handleSetCurrentHoverObjectId(target._id))

  const activeSelection = canvas.getActiveObject();
  if (!activeSelection) {
    store.dispatch(handleSetMenuTouchDisplay('none'));
    return;
  }

  if (target.length > 1) {
    let groupLockedMark = false;
    target.forEach((r) => {
      menus = _.intersection(menus, r.getWidgetMenuTouchList());
      if (r.locked === true) groupLockedMark = true;
    });
    if (!groupLockedMark) {
      menus.push('alignGroup');
      menus.push('newLayout');
    }
  } else if (target.getWidgetMenuTouchList) {
    menus = _.intersection(menus, target.getWidgetMenuTouchList());
  } else {
    menus = [];
  }

  let pointer = {};
  pointer = canvas.getActiveObject().aCoords.tl;
  const point = fabric.util.transformPoint(
    {
      x: pointer.x,
      y: pointer.y - 20 / canvas.getZoom(),
    },
    canvas.viewportTransform,
  );

  let pointer2 = {};
  pointer2 = canvas.getActiveObject().aCoords.br;
  const point2 = fabric.util.transformPoint(
    {
      x: pointer2.x,
      y: pointer2.y - 20 / canvas.getZoom(),
    },
    canvas.viewportTransform,
  );

  const objectHeightonCanvas = point2.y - point.y;
  let left = point.x;
  let top = point.y;

  // if (left > canvas.width - target.getWidgetMenuLength()) {
  //   left = canvas.width - target.getWidgetMenuLength();
  // }

  if (left > canvas.width) {
    left = canvas.width;
  }

  if (top < 112) top = 112;
  if (
    target.obj_type &&
    (target.obj_type === 'WBCircleNotes' || target.obj_type === 'WBRectNotes')
  ) {
    if (objectHeightonCanvas < canvas.height) {
      if (point.y < 88) {
        //
        if (point2.y < canvas.height - 48) {
          if (point2.y > canvas.height - 60) {
            top = canvas.height - 48;
          } else {
            top = point2.y + 84;
          }
        }
      }
    }
  }

  if (left < 72) left = 72;
  if (menus.length > 0) {
    store.dispatch(handleSetMenuTouchDisplay('block'));
  } else {
    store.dispatch(handleSetMenuTouchDisplay('none'));
  }
  store.dispatch(handleSetMenuTouchPosition({
    left,
    top: top - 50,
  }));
  store.dispatch(handleChangeFontSize(target.fontSize));  

  store.dispatch(handleChangeFontFamily(   target.fontFamily  ));

 
  store.dispatch(handleSetWidgetMenuTouchList(menus));
  store.dispatch(handleSetCurrentAlign(target.textAlign));

  if (target.length > 1) {
    let groupLockedStatus = false;
    target.forEach((r) => {
      if (r.locked === true) groupLockedStatus = true;
    });
    store.dispatch(handleSetCurrentLockStatus(groupLockedStatus));
  } else {
    store.dispatch(handleSetCurrentLockStatus(target.locked));
  }

  /**
   * @author Gengda
   * @date: 04/07/2021
   * @description: Calculate the color's alpha value.
   * rgba(xxx,xxx,xxx,xxx)
   * Use the ' str.lastIndexOf(',') + 1 ' find the begin position;
   * Use the ' str.length - 1 ' find the last position
   */

  const objectColor = target.fill;
  let opacityValue = 0;
  if (objectColor != null)
    opacityValue = parseInt(
      objectColor.substring(
        objectColor.lastIndexOf(',') + 1,
        objectColor.length - 1,
      ) * 100,
    );
  else 
  store.dispatch(handleSetOpacityValue(opacityValue));
}
