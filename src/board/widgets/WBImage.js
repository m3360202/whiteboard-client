//**Fabric */
import * as fabric from '@boardxus/x-canvas';

//**Redux Store */
import store from '../../store';
import { handleSetCropMode } from '../../store/board';

//**Services */
import {
  EventService,
  FileService,
  UtilityService,
  WidgetService
} from '../../services';
import EventNames from '../../util/EventNames';

//**Utils */
import imageCompression from 'browser-image-compression';

fabric.Image.prototype.addSelectionRect = async function () {

  let activeObject = canvas.getActiveObject();

  let self = this;

  self.state = {
    isClipping: true,
    clipLeft: 0,
    clipTop: 0,
    clipBox: null,
    clipActiveObj: null
  };

  if (activeObject.obj_type === 'WBImage') {

    let clipBox = new fabric.Rect({
      opacity: 1,
      left: activeObject.left,
      top: activeObject.top,
      width: activeObject.width,
      height: activeObject.height,
      scaleX: activeObject.scaleX,
      scaleY: activeObject.scaleY,
      objectCaching: false,
      hasRotatingPoint: false,
      transparentCorners: false,
      borderColor: '#19DBDB',
      cornerColor: '#B2DBDB',
      cornerSize: 13,
      padding: 0,
      //@ts-ignore
      obj_type: 'common',
      cornerStyle: 'circle',
      actionType: 'cropSelectionFrame',
      parentImage: self,
      angle: 0,
      lockScalingFlip: true
    });

    canvas.uniformScaling = false;

    self.cropSelectionRect = clipBox;

    self.cropSelectionRect.setControlVisible('mtr', true);

    self.cropSelectionRect.setControlVisible('tl', true);

    self.cropSelectionRect.setControlVisible('tr', true);

    self.cropSelectionRect.setControlVisible('br', true);

    self.cropSelectionRect.setControlVisible('bl', true);

    self.cropSelectionRect.setControlVisible('ml', false);

    self.cropSelectionRect.setControlVisible('mr', false);

    self.cropSelectionRect.setControlVisible('mt', false);

    self.cropSelectionRect.setControlVisible('mb', false);

    self.cropSelectionRect.setControlVisible('mla', false);

    self.cropSelectionRect.setControlVisible('mra', false);

    self.cropSelectionRect.setControlVisible('mta', false);

    self.cropSelectionRect.setControlVisible('mba', false);

    self.cropSelectionRect.setControlVisible('mtr', false);

    self.state.clipBox = clipBox;

    self.state.clipActiveObj = activeObject;

    let obj = await activeObject.clone();

    obj.objectCaching = false;

    let url = obj.src;

    if (url && url.indexOf('http') !== -1 && url.indexOf('?') !== -1) {

      url = url.substring(0, url.indexOf('?') + 1);

    }

    let img = await fabric.util.loadImage(url, { crossOrigin: 'anonymous' });

    clipBox.fill = new fabric.Pattern({
      source: img,
      repeat: 'no-repeat'
    });

    canvas.add(clipBox);

    activeObject.set({
      selectable: false,
      hoverCursor: 'default',
      evented: false,
      hasControls: false,
      perPixelTargetFind: false,
      opacity: 0.2
    });

    activeObject.visible = true;

    canvas.requestRenderAll();

    self.state.clipBox.on({
      moving: () => {

        if (!self.state.clipActiveObj) return;

        let canMove = true;

        let clipBoxHalfWidth = clipBox.getScaledWidth() / 2;

        let clipBoxHalfHeight = clipBox.getScaledHeight() / 2;

        let selfHalfWidth = self.state.clipActiveObj.getScaledWidth() / 2;

        let selfHalfHeight = self.state.clipActiveObj.getScaledHeight() / 2;

        if (
          clipBox.left - clipBoxHalfWidth <
          self.state.clipActiveObj.left - selfHalfWidth
        ) {

          clipBox.left =
            self.state.clipActiveObj.left -
            selfHalfWidth +
            clipBoxHalfWidth;

          canMove = false;

        } else if (
          clipBox.left + clipBoxHalfWidth >
          self.state.clipActiveObj.left + selfHalfWidth
        ) {

          clipBox.left =
            self.state.clipActiveObj.left +
            selfHalfWidth -
            clipBoxHalfWidth;

          canMove = false;

        }
        if (
          clipBox.top - clipBoxHalfHeight <
          self.state.clipActiveObj.top - selfHalfHeight
        ) {

          clipBox.top =
            self.state.clipActiveObj.top -
            selfHalfHeight +
            clipBoxHalfHeight;

          canMove = false;

        } else if (
          clipBox.top + clipBoxHalfHeight >
          self.state.clipActiveObj.top + selfHalfHeight
        ) {

          clipBox.top =
            self.state.clipActiveObj.top +
            selfHalfHeight -
            clipBoxHalfHeight;

          canMove = false;

        }
        if (!self.state.isClipping) {
          self.state.clipActiveObj.left =
            clipBox.left - self.state.clipLeft;
          self.state.clipActiveObj.top = clipBox.top - self.state.clipTop;
        }
        if (!self.state.isClipping) {
          self.state.clipActiveObj.left =
            clipBox.left - self.state.clipLeft;
          self.state.clipActiveObj.top = clipBox.top - self.state.clipTop;

          canMove = false;

        }
        let left =
          clipBox.left -
          clipBox.getScaledWidth() / 2 -
          (self.state.clipActiveObj.left -
            self.state.clipActiveObj.getScaledWidth() / 2);

        let top =
          clipBox.top -
          clipBox.getScaledHeight() / 2 -
          (self.state.clipActiveObj.top -
            self.state.clipActiveObj.getScaledHeight() / 2);

        self.state.clipLeft = left;

        self.state.clipTop = top;

        clipBox.fill.offsetX = -left / self.state.clipActiveObj.scaleX;

        clipBox.fill.offsetY = -top / self.state.clipActiveObj.scaleY;

        if (canMove) canvas.requestRenderAll();

      },
      scaling: () => {

        let clipBoxHalfWidth = clipBox.getScaledWidth() / 2;

        let clipBoxHalfHeight = clipBox.getScaledHeight() / 2;

        let selfHalfWidth = self.state.clipActiveObj.getScaledWidth() / 2;

        let selfHalfHeight =
          self.state.clipActiveObj.getScaledHeight() / 2;
        if (
          clipBox.getScaledWidth() >
          self.state.clipActiveObj.getScaledWidth()
        ) {
          clipBox.left = self.state.clipActiveObj.left;

          clipBox.width = self.state.clipActiveObj.width;

          clipBox.scaleX = self.state.clipActiveObj.scaleX;

        } else if (
          clipBox.getScaledWidth() <
          self.state.clipActiveObj.getScaledWidth()
        ) {
          if (
            clipBox.left - clipBoxHalfWidth <
            self.state.clipActiveObj.left - selfHalfWidth
          ) {
            clipBox.left =
              self.state.clipActiveObj.left -
              selfHalfWidth +
              clipBoxHalfWidth;
          } else if (
            clipBox.left + clipBoxHalfWidth >
            self.state.clipActiveObj.left + selfHalfWidth
          ) {
            clipBox.left =
              self.state.clipActiveObj.left +
              selfHalfWidth -
              clipBoxHalfWidth;
          }
        }

        if (
          clipBox.getScaledHeight() >
          self.state.clipActiveObj.getScaledHeight()
        ) {
          clipBox.top = self.state.clipActiveObj.top;
          clipBox.height = self.state.clipActiveObj.height;
          clipBox.scaleY = self.state.clipActiveObj.scaleY;
        } else if (
          clipBox.getScaledHeight() <
          self.state.clipActiveObj.getScaledHeight()
        ) {
          if (
            clipBox.top - clipBoxHalfHeight <
            self.state.clipActiveObj.top - selfHalfHeight
          ) {
            clipBox.top =
              self.state.clipActiveObj.top -
              selfHalfHeight +
              clipBoxHalfHeight;
          } else if (
            clipBox.top + clipBoxHalfHeight >
            self.state.clipActiveObj.top + selfHalfHeight
          ) {
            clipBox.top =
              self.state.clipActiveObj.top +
              selfHalfHeight -
              clipBoxHalfHeight;
          }
        }

        if (!self.state.isClipping) {
          self.state.clipActiveObj.left =
            clipBox.left - self.state.clipLeft;
          self.state.clipActiveObj.top = clipBox.top - self.state.clipTop;
          self.state.clipActiveObj.scaleX = clipBox.scaleX;
          self.state.clipActiveObj.scaleY = clipBox.scaleY;
          canvas.requestRenderAll();
          return;
        }
        let _width =
          clipBox.getScaledWidth() / self.state.clipActiveObj.scaleX;
        let _height =
          clipBox.getScaledHeight() / self.state.clipActiveObj.scaleY;

        let left =
          clipBox.left -
          clipBox.getScaledWidth() / 2 -
          (self.state.clipActiveObj.left -
            self.state.clipActiveObj.getScaledWidth() / 2);
        let top =
          clipBox.top -
          clipBox.getScaledHeight() / 2 -
          (self.state.clipActiveObj.top -
            self.state.clipActiveObj.getScaledHeight() / 2);
        if (left <= 0 || top <= 0) self.state.isRender = true;
        self.state.clipLeft = clipBox.left;
        self.state.clipTop = clipBox.top;
        clipBox.fill.offsetX = -left / self.state.clipActiveObj.scaleX;
        clipBox.fill.offsetY = -top / self.state.clipActiveObj.scaleY;
        clipBox.scaleX = self.state.clipActiveObj.scaleX;
        clipBox.scaleY = self.state.clipActiveObj.scaleY;
        clipBox.width = _width;
        clipBox.height = _height;
        canvas.requestRenderAll();
      }
    });

    store.dispatch(handleSetCropMode(true));

    canvas.setActiveObject(self.state.clipBox);

    canvas.requestRenderAll();

  } else {

    activeObject.clipClone.visible = true;

    canvas.requestRenderAll();

  }
}
fabric.Image.prototype.crop = async (obj) => {

  const self = obj;

  canvas.uniformScaling = true;

  let activeObject = canvas.getActiveObject();

  self.state.isClipping = false;

  self.state.clipActiveObj.set('opacity', 1);

  canvas.remove(self.state.clipActiveObj);

  canvas.requestRenderAll();

  const cropped = {};

  cropped.src = self.toDataURL({
    left:
      activeObject.left -
      activeObject.getScaledWidth() / 2 -
      (self.left - self.getScaledWidth() / 2),
    top:
      activeObject.top -
      activeObject.getScaledHeight() / 2 -
      (self.top - self.getScaledHeight() / 2),
    width: activeObject.width * activeObject.scaleX,
    height: activeObject.height * activeObject.scaleY
  });

  self.state.clipActiveObj = null;

  //@ts-ignore
  const blob = await imageCompression.getFilefromDataUrl(cropped.src);

  blob.name = self.name ? self.name : Date.now() + '.png';

  //@ts-ignore
  const imageFile = await Boardx.Util.loadImageFromFile(blob);

  const { width } = imageFile;

  const { height } = imageFile;

  cropped.width = width;

  cropped.height = height;

  cropped.obj_type = 'WBImage';

  cropped.whiteboardId = store.getState().board.board._id;

  cropped.left = activeObject.left;

  cropped.top = activeObject.top;

  cropped._id = UtilityService.getInstance().generateWidgetID();

  cropped.zIndex = Date.now() * 100;

  const widget = await canvas.renderWidgetAsync(cropped);

  self.visible = false;

  canvas.requestRenderAll();

  widget.opacity = 1;

  //@ts-ignore 
  const r2UploadPath = UtilityService.getInstance().getr2UploadPath(store.getState().board.board);

  const key = await FileService.getInstance().uploadFileToR2Async(
    r2UploadPath,
    blob,
    {
      progress(e) {

      }
    },
  );

  widget.dirty = true;

  widget.src = key;

  cropped.src = key;

  canvas.remove(self.cropSelectionRect);

  self.cropSelectionRect = null;

  await WidgetService.getInstance().insertWidget(cropped);

  self.visible = false;

  let stateList = [];

  const newState = {};

  newState.newState = widget.getObject();

  newState.targetId = widget._id;

  newState.action = 'ADDED';

  stateList.push(newState);

  const state2 = self.getUndoRedoState('REMOVED');

  stateList = stateList.concat(state2);

  canvas.pushNewState(stateList);

  WidgetService.getInstance().removeWidget(self._id);

  canvas.remove(self);

  self.cancelCrop();

}

fabric.Image.prototype.cancelCrop = function () {

  const self = this;

  canvas.uniformScaling = true;

  store.dispatch(handleSetCropMode(false));

  EventService.getInstance().unregister(
    EventNames.OBJECT_MOVING,
    this.cropObjectMovingHandler
  );
  EventService.getInstance().unregister(
    EventNames.OBJECT_SCALING,
    this.cropObjectScalingHandler
  );

  canvas.remove(self.cropSelectionRect);

  self.cropSelectionRect = null;

  canvas.requestRenderAll();

}

fabric.Image.prototype.cropObjectMovingHandler = function (e) {

  const object = e.target;

  const self = object.parentImage;

  const crop = self.cropSelectionRect;

  const selfWidth = self.width * self.scaleX;

  const seltHeight = self.height * self.scaleY;

  const cropWidth = crop.width * crop.scaleX;

  const cropHeight = crop.height * crop.scaleY;

  if (
    store.getState().board.cropMode &&
    object.type === 'cropSelectionFrame'
  ) {
    if (crop.left - self.left > (selfWidth - cropWidth) / 2) {
      crop.left = self.left + (selfWidth - cropWidth) / 2;

    } else if (self.left - crop.left > (selfWidth - cropWidth) / 2) {

      crop.left = self.left - (selfWidth - cropWidth) / 2;

    }
    if (self.top - crop.top > (seltHeight - cropHeight) / 2) {

      crop.top = self.top - (seltHeight - cropHeight) / 2;

    } else if (crop.top - self.top > (seltHeight - cropHeight) / 2) {
      
      crop.top = self.top + (seltHeight - cropHeight) / 2;

    }
  }
}
fabric.Image.prototype.cropObjectScalingHandler = function (e) {
  const object = e.target;
  const self = object.parentImage;
  const crop = self.cropSelectionRect;
  const selfWidth = self.width * self.scaleX;
  const seltHeight = self.height * self.scaleY;
  const cropWidth = crop.width * crop.scaleX;
  const cropHeight = crop.height * crop.scaleY;
  const isUndefine = !self || !crop;
  const isNAN = crop.scaleX.isNaN || crop.left.isNaN;
  if (isUndefine || isNAN) return;
  if (
    store.getState().board.cropMode &&
    object.type === 'cropSelectionFrame'
  ) {
    if (crop.width * crop.scaleX >= self.width * self.scaleX) {
      if (crop.left - self.left > (selfWidth - cropWidth) / 2) {
        const left = crop.leftWidth
          ? crop.leftWidth
          : self.left + (selfWidth - cropWidth) / 2;
        const scaleX = crop.preScaleX ? crop.preScaleX : crop.scaleX;
        crop.left = left;
        crop.scaleX = scaleX;
        if (!crop.leftWidth) crop.leftWidth = crop.left;
        if (!crop.preScaleX) crop.preScaleX = crop.scaleX;
      } else if (self.left - crop.left > (selfWidth - cropWidth) / 2) {
        const left = crop.rightWidth
          ? crop.rightWidth
          : self.left - (selfWidth - cropWidth) / 2;
        const scaleX = crop.preScaleX ? crop.preScaleX : crop.scaleX;
        crop.left = left;
        crop.scaleX = scaleX;
        if (!crop.rightWidth) crop.rightWidth = crop.left;
        if (!crop.preScaleX) crop.preScaleX = crop.scaleX;
      } else {
        crop.leftWidth = 0;
        crop.rightWidth = 0;
        crop.preScaleX = 0;
      }
    }
    if (crop.height * crop.scaleY >= self.height * self.scaleY) {
      if (self.top - crop.top > (seltHeight - cropHeight) / 2) {
        const top = crop.topHeight
          ? crop.topHeight
          : self.top - (seltHeight - cropHeight) / 2;
        const scaleY = crop.PreScaleY ? crop.PreScaleY : crop.scaleY;
        crop.top = top;
        crop.scaleY = scaleY;
        if (!crop.topHeight) crop.topHeight = crop.top;
        if (!crop.PreScaleY) crop.PreScaleY = crop.scaleY;
      } else if (crop.top - self.top > (seltHeight - cropHeight) / 2) {
        const top = crop.bottomHeight
          ? crop.bottomHeight
          : self.top + (seltHeight - cropHeight) / 2;
        const scaleY = crop.PreScaleY ? crop.PreScaleY : crop.scaleY;
        crop.top = top;
        crop.scaleY = scaleY;
        if (!crop.bottomHeight) crop.bottomHeight = crop.top;
        if (!crop.PreScaleY) crop.PreScaleY = crop.scaleY;
      } else {
        crop.bottomHeight = 0;
        crop.topHeight = 0;
        crop.PreScaleY = 0;
      }
    }
  }
}
