import * as fabric from '@boardxus/x-canvas';
//** Import Redux kit
import store,{  RootState } from '../../store';
import {handleChangeFontFamily, handleChangeFontSize, handleChangeMenuPosition} from '../../store/widgetMenu';
import {handleSetCurrentLockStatus,handleSetCurrentAlign,handleSetWidgetMenuList, handleWidgetMenuDisplay } from '../../store/board';
import { handleSetMenuWidth, handleSetMultiFontSize,handleSetMultiFontFamily, handleSetOpacityValue,handleSetCurrentHoverObjectId } from '../../store/widgets';
import _ from 'lodash';
import i18n from 'i18next';

const t = i18n.getFixedT(null, null)


const getMenuPositionLeft = (canvas, target, pointx, screenWidth, menuLength) => {
  let left = pointx;
  left = Math.max(left, 72);

  const activeObjects = canvas.getActiveObjects();
  if (activeObjects.length > 1) {
    const groupLockedMark = activeObjects.some((r) => r.locked === true);

    if (groupLockedMark) {
      left = Math.min(left, screenWidth - 50);
    } else {
      left = Math.min(left, screenWidth - 42 * menuLength);
      // not accurate enough, there should be another way to calculate the menu length based on each widget menu width
    }
  } else if (target.getWidgetMenuLength && target.getWidgetMenuLength()) {
    left = Math.min(left, screenWidth - target.getWidgetMenuLength() - 72);
  } else {
    left = Math.min(left, screenWidth - 420 - 72);
  }

  left = Math.max(left, 6);

  return left;
};

const getMenuPositionTop = (canvas, target, pointy, objectHeightonCanvas) => {
  let top = Math.max(pointy, 125);

  const singleObjectFlag = target.obj_type && [
    'WBCircleNotes',
    'WBText',
    'WBRectNotes',
    'WBShapeNotes',
    'WBFile',
    'WBImage',
    'WBUrlImage',
    'WBArrow',
  ].includes(target.obj_type);

  if (singleObjectFlag || canvas.getActiveObjects().length > 1) {
    if (objectHeightonCanvas < canvas.height) {
      if (pointy < 106) {
        if (pointy < canvas.height - 48) {
          top = pointy > canvas.height - 60 ? canvas.height - 48 : pointy + objectHeightonCanvas + 124;
        }
      }
    }
  }

  return top;
};


const getLTPoint = (object, canvas) => {
  const topLeft = object.aCoords.tl;
  const point = fabric.util.transformPoint(
    {
      x: topLeft.x,
      y: topLeft.y - 20 / canvas.getZoom(),
    },
    canvas.viewportTransform
  );

  return point;
};

const getBRPoint = (object, canvas) => {
  const bottomRight = object.aCoords.br;
  const point = fabric.util.transformPoint(
    {
      x: bottomRight.x,
      y: bottomRight.y - 20 / canvas.getZoom(),
    },
    canvas.viewportTransform
  );

  return point;
};
 
const getScreenWidth = () => {
  const slidesMode = store.getState().slides.slidesMode;
  const screenWidth = slidesMode ? canvas.width - 240 : canvas.width;

  return screenWidth;
};


function setFontforMultiObject(menus, target) {
  let fontFlag = 0;
  let font;
  let fontNext;

  let fontSizeFlag = 0;
  let fontSize;
  let fontSizeNext;

  let isStickyNotes = false;
  let isTextBox = false;
  let isFile = false;
  let imagesNum = 0;
  let stickyNotesNum = 0;
  let circleNotesNum = 0;
  let textBoxNum = 0;

  if (canvas.getActiveObjects().length > 1) {
    let groupLockedMark = false;
    canvas.getActiveObjects().forEach(r => {
      if (r.locked === true) groupLockedMark = true;
      if (r.obj_type === 'WBFile') {
        isFile = true;
      }
      if (r.obj_type === 'WBImage') {
        imagesNum = imagesNum + 1;
      }
      if (r.obj_type === 'WBRectNotes') {
        stickyNotesNum = stickyNotesNum + 1;
      }
      if (r.obj_type === 'WBCircleNotes') {
        circleNotesNum = circleNotesNum + 1;
      }
      if (r.obj_type === 'WBText') {
        textBoxNum = textBoxNum + 1;
        isTextBox = true;
      }
      if (
        r.obj_type === 'WBCircleNotes' ||
        r.obj_type === 'WBRectNotes' ||
        r.obj_type === 'WBShapeNotes'
      ) {
        isStickyNotes = true;
      }
      if (r.getWidgetMenuList) {
        menus = _.intersection(menus, r.getWidgetMenuList());
      }
      
      if (fontFlag === 0) {
        font = r.fontFamily || ' ';
        fontNext = font;
        fontFlag = 1;
      } else if (fontFlag === 1) {
        fontNext = r.fontFamily || ' ';
        if (font !== fontNext) {
          fontFlag = 2;
        }
      }
      if (fontSizeFlag === 0) {
        fontSize = r.fontSize || ' ';
        fontSizeNext = fontSize;
        fontSizeFlag = 1;
      } else if (fontSizeFlag === 1) {
        fontSizeNext = r.fontSize || ' ';
        if (fontSize !== fontSizeNext) {
          fontSizeFlag = 2;
        }
      }
    });
    
    if (fontFlag !== 2 && !groupLockedMark) {
      store.dispatch(handleSetMultiFontFamily(font));
      menus.push('fontSize');
    } else {
      store.dispatch(handleSetMultiFontFamily(t('board.contextMenu.mixed')));
      menus = menus.filter(e => e !== 'fontSize');
    }

    if (isFile) {
      menus = menus.filter(e => e === 'fileName' && e === 'fileDownload');
      menus.push('objectLock')
    }

    // if (imagesNum > 1) {
    //   menus = menus.filter(e => e !== 'aiassist');
    // }

    // if (stickyNotesNum > 1 && imagesNum >= 1) {
    //   menus = menus.filter(e => e !== 'aiassist');
    // }

    if (textBoxNum > 1) {
      menus = menus.filter(e => e !== 'textToMultipleStickyNotes');
    }
    
    // if (isTextBox && imagesNum > 0) {
    //   menus = menus.filter(e => e !== 'aiassist');
    // }

    if (isStickyNotes !== isTextBox && !groupLockedMark) {
      if (fontSizeFlag !== 2) {
        store.dispatch(handleSetMultiFontSize(fontSize));
        menus.push('fontSize');
      } else {
        store.dispatch(
          handleSetMultiFontSize(t('board.contextMenu.mixed'))
        );
        menus = menus.filter(e => e !== 'fontSize');
      }
    } else {
      // menus.push('fontSize');
      menus = menus.filter(e => e !== 'fontSize');
    }
    
    store.dispatch(handleChangeFontSize( store.getState().widgets.multiFontSize));  

    if (!groupLockedMark) {
      let obj = canvas.getActiveObject();
      if(obj.obj_type === 'WBGroup')
      {
        let group = [];
        obj._objects.forEach(r => {
          if(r.obj_type !== 'WBArrow'){
            group.push(r);
          }
        });
        if(group.length > 1){
          menus.push('alignGroup');
          menus.push('newLayout');
        }
      }
      else{
        menus.push('alignGroup');
        menus.push('newLayout');
      }
      
    

    if (stickyNotesNum > 1 && !groupLockedMark) {
      menus.push('changeFont');
      menus.push('fontSize');
      menus = menus.filter(e => e !== 'emojiMenu');
    }

    if (circleNotesNum > 0  && !groupLockedMark ) {
      menus.push('fontSize');
      menus = menus.filter(e => e !== 'emojiMenu');
    }
  }
  } else if (target.getWidgetMenuList) {
    menus = _.intersection(menus, target.getWidgetMenuList());
    store.dispatch(handleChangeFontSize(  canvas.getActiveObject().fontSize));  

  } else {
    menus = [];
  }
  return menus;
}

(window as any).showMenu=showMenu

export default function showMenu() {
  if (
    !canvas ||
    !canvas.getActiveObject ||
    store.getState().board.connectorMode ||
    store.getState().slides.capturing
    || store.getState().mode.type === 'eraser'
  ){
    store.dispatch(handleSetWidgetMenuList([]));
    return;

  }
  

  let menus = [
    'emojiMenu',
    'drawNote',
    'textNote',
    'fontSize',
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
    'arrowLineWidth',
    'connectorShape',
    'connectorStyle',
    'connectorTip',
    'borderLineIcon',
    'fontWeight',
    'textBullet',
    'crop',
    'objectLock',
    'aiassist',
    'fileName',
    'fileDownload',
    'audioToText',
    'textToMultipleStickyNotes'
  ];
  if (localStorage.getItem('currentUIType') === 'laptop') {
    menus.push('switchNoteType');
    menus.push('applyFormat');
    // menus.push('objectLock');
    menus.push('changeFont');
  } else {
    menus.push('delete');
  }
  const target = canvas.getActiveObject();

  if (
    !target ||
    (target && target.obj_type === 'common') ||
    (!target && !canvas.isDrawingMode)
  ) {
    Boardx.Util.changeMenuBarSelected();
    store.dispatch(handleSetWidgetMenuList([]));
    return;
  }

  if (target && target._objects && target._objects.length > 0) {
    const shapeAndRect = target._objects.filter(
      c => c.obj_type === 'WBShapeNotes' || c.obj_type === 'WBRectNotes'
    );
    if (shapeAndRect && shapeAndRect.length > 1) {
      menus.splice(3, 1);
    }
  }
  if (target.obj_type) {
    switch (target.obj_type) {
      case 'WBRectNotes':
      case 'WBText':
      case 'WBPath':
      case 'WBArrow':
      case 'WBShapeNotes':
      case 'WBImage':
        Boardx.Util.changeMenuBarSelected(target.obj_type);
        break;
      default:
        Boardx.Util.changeMenuBarSelected();
        break;
    }
  }
  store.dispatch(handleSetCurrentHoverObjectId(target._id))
  // Get Current Font Properties
  menus = setFontforMultiObject(menus, target); // Font for multiple objects


  store.dispatch(handleChangeFontFamily(    canvas.getActiveObject().fontFamily  ));
  // Get Current Align
  store.dispatch(handleSetCurrentAlign(canvas.getActiveObject().textAlign));

  // Get Lock status
  if (canvas.getActiveObjects().length > 1) {
    let groupLockedStatus = false;
    canvas.getActiveObjects().forEach(r => {
      if (r.locked === true) groupLockedStatus = true;
    });
    store.dispatch(handleSetCurrentLockStatus(groupLockedStatus));
  } else {
    store.dispatch(handleSetCurrentLockStatus(canvas.getActiveObject().locked));
  }

  // Get Opacity Value
  const objectColor = canvas.getActiveObject().fill;
  store.dispatch(handleSetOpacityValue(objectColor != null
    ? parseInt(
        String(
          objectColor.substring(
            objectColor.lastIndexOf(',') + 1,
            objectColor.length - 1
          ) * 100
        )
      )
    : 0));

  // Get Current Menu Position
  const ltPoint = getLTPoint(canvas.getActiveObject(), canvas);
  const brPoint = getBRPoint(canvas.getActiveObject(), canvas);
  const screenWidth = getScreenWidth();
  const objectHeightonCanvas = brPoint.y - ltPoint.y;
  const left = getMenuPositionLeft(canvas, 
    target,
    ltPoint.x,
    screenWidth,
    menus.length
  );
  const top = getMenuPositionTop(canvas, target, ltPoint.y, objectHeightonCanvas);

  // Get Current Menu Status
  if (target.obj_type === 'WBRectPanel') {
    store.dispatch(handleChangeMenuPosition({
      left,
      top: top - 70 - 20 * canvas.getZoom()
    }));
   } else {
     store.dispatch(handleChangeMenuPosition({ left, top: top - 70 }));
  }

  setTimeout(() => {
    store.dispatch(handleWidgetMenuDisplay(true))
    store.dispatch(handleSetWidgetMenuList(menus));
  }, 10);

  // if (target.type && target.type !== 'activeSelection') {
  //   console.log('target.getWidgetMenuLength() of target', target);
  //   console.log('target.getWidgetMenuLength()', target.getWidgetMenuLength());
  //   store.dispatch(handleSetMenuWidth(target.getWidgetMenuLength()));
  // } //custom function

}
