//**Fabric */
import * as fabric from '@boardxus/x-canvas';

//**Redux Store */
import store from '../../store';
import { handleWidgetMenuDisplay } from '../../store/board';

//**Services */
import { WidgetService } from '../../services';

//**Utils */
import showMenu from '../widgetMenu/ShowMenu';
import { EventName } from '../../definition/eventName';
import { SaveAction } from '../../definition/widget/saveAction';
import { ModifiedField } from '../../definition/widget/modifiedFile';
import { Origin } from '../../definition/widget/origin';
import { TextAlign } from '../../definition/widget/textAlign';
import { WidgetType } from '../../definition/widget/widgetType';

fabric.Textbox.prototype.checkTextboxChange = function () {

  const self = this;
  let canvas = window.canvas;
  const canvasWidth = canvas.findById(self._id).width;

  const canvasHeight = canvas.findById(self._id).height;

  const canvasText = canvas.findById(self._id).text;

  const canvasFill = canvas.findById(self._id).fill;

  const canvasTop = canvas.findById(self._id).top;

  const convasLeft = canvas.findById(self._id).left;

  const currentWidget = canvas.getActiveObject();

  const DBWidth = currentWidget.width;

  const DBHeight = currentWidget.height;

  const DBText = currentWidget.text;

  const DBFill = currentWidget.fill;

  const DBTop = currentWidget.top;

  const DBLeft = currentWidget.left;

  if (canvasWidth !== DBWidth) {
    showMenu();
  }

  if (
    canvasWidth !== DBWidth ||
    canvasHeight !== DBHeight ||
    canvasText !== DBText ||
    canvasFill !== DBFill ||
    canvasTop !== DBTop ||
    convasLeft !== DBLeft
  ) {

    self.set('text', canvasText);

    self.initDimensions();

    self.saveData(SaveAction.MODIFIED, [
      ModifiedField.Width,
      ModifiedField.Height,
      ModifiedField.Left,
      ModifiedField.Top,
      ModifiedField.Fill,
      ModifiedField.Text,
      ModifiedField.ShapeScalex,
      ModifiedField.MaxHeight,
      ModifiedField.FixedScaleChange
    ]);

  }

}

fabric.Textbox.prototype.InitializeEvent = function () {

  const self = this;

  self.on(EventName.EDITINGENTERED, () => {
    // if it is in draw widget mode, then skip update
    if (canvas.drawTempWidget) return;

    self.originX = self.textAlign;

    if (self.textAlign === TextAlign.LEFT) {
      self.left -= (self.width * self.scaleX) / 2;
    }

    if (self.textAlign === TextAlign.RIGHT) {
      self.left += (self.width * self.scaleX) / 2;
    }

    if (self.obj_type === WidgetType.WBText) {

      self.originY = 'top';

      self.top -= (self.height * self.scaleY) / 2;

      self.tempTop = self.top;

      if (self.text === 'Type here...') {

        self.selectAll();

        self.text = '';

        self.hiddenTextarea.value = '';

        self.dirty = true;

        self.fill = 'rgb(0, 0, 0)';
     
        canvas.requestRenderAll()
      }
    }
  });

  self.on(EventName.EDITINGEXITED, () => {

    // if it is in draw widget mode, then skip update
    if (canvas.drawTempWidget) return;

    if (self.text === '' && self.obj_type === WidgetType.WBText) {

      canvas.removeWidget(self);

      return;
    }

    self.originX = Origin.Center;

    self.originY = Origin.Center;

    if (self.textAlign === Origin.Left) {
      self.left += (self.width * self.scaleX) / 2;
    }

    if (self.textAlign === Origin.Right) {
      self.left -= (self.width * self.scaleX) / 2;
    }

    if (self.obj_type === WidgetType.WBText) {
      self.top = self.tempTop + (self.height * self.scaleY) / 2;
      self.tempTop = self.top;
    }
  });

  self.on(EventName.MODIFIED, () => {

    self.checkTextboxChange(self);

    canvas.requestRenderAll();

  });
  self.on(EventName.CHANGED, () => {

    if (self.styles[0]) {

      self.styles = {};

      self.canvas.requestRenderAll();

    }
  });
};

fabric.Textbox.prototype.changeWidth = function (eventData, transform, x, y) {

  store.dispatch(handleWidgetMenuDisplay(false))

  var target = transform.target,
    localPoint = fabric.controlsUtils.getLocalPoint(
      transform,
      transform.originX,
      transform.originY,
      x,
      y
    ),
    strokePadding =
      target.strokeWidth / (target.strokeUniform ? target.scaleX : 1),
    multiplier = isTransformCentered(transform) ? 2 : 1,
    oldWidth = target.width,
    newWidth =
      Math.abs((localPoint.x * multiplier) / target.scaleX) - strokePadding,
    shapeScaleX =
      Math.abs(target.aCoords['tl'].x - target.aCoords['tr'].x) / 138;
  target.set('shapeScaleX', shapeScaleX);
  target.set('width', Math.max(newWidth, 0));

  target.initDimensions();


  target.set('dirty', true);

  if (target.obj_type === 'WBTextbox' || target.obj_type === 'WBText') {

    target.set('fixedScaleChange', false);

  }

  if (target.obj_type !== 'WBText') {

    target.saveData('MODIFIED', ['width']);

  }


  return oldWidth !== newWidth;
}

fabric.Textbox.prototype.resetResizeControls = function () {
  const self = this;
  const textAlign = self.textAlign;

  if (
    self.obj_type === 'WBText' &&
    (textAlign === 'left' || textAlign === 'center')
  ) {
    self.setControlVisible('ml', false);
    self.setControlVisible('mr', true);
  }

  if (self.obj_type === 'WBText' && textAlign === 'right') {
    self.setControlVisible('ml', true);
    self.setControlVisible('mr', false);
  }
  if(self.canvas) self.canvas.requestRenderAll();

}

function isTransformCentered(transform) {

  return transform.originX === 'center' && transform.originY === 'center';

}
