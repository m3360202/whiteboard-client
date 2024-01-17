//**Fabric */
import * as fabric  from '@boardxus/x-canvas';

//**Redux store */
import store, { RootState } from '../../../store';
import { useDispatch, useSelector } from 'react-redux';
import { changeMode } from '../../../store/mode';
import { handleSetMenuFontWeight } from '../../../store/widgets';

//**Services */
import { WidgetService } from '../../../services';

//**utils */
import {
  calcDimension,
  calcDirection,
  calcDistance,
  createShapeNote
} from '../events';

import useCommonActions from './useCommonActions';

const useShapeActions = () => {

  const { handleCommonBefore, handleCommonAfter } = useCommonActions();

  const shapeType = useSelector((state) => state.widget.shape.type);

  const dispatch = useDispatch();

  let instance = null;

  let startPoint = null;

  const handleShapeBefore = () => {

    if (!canvas) return;

    handleCommonBefore();

    canvas.discardActiveObject();

    canvas.defaultCursor = 'crosshair';

    canvas.hoverCursor = 'crosshair';

    canvas.selection = false;

    canvas.requestRenderAll();

  };

  const handleShapeAfter = () => {

    handleCommonAfter();

  };

  const handleShapeMouseDown = (e) => {

    if (!canvas) return;

    startPoint = e.pointer;

    instance = createShapeNote(startPoint, shapeType);

    instance.fontFamily = 'Inter';

    instance.fontSize = 26;

    instance.fontWeight = 400;

    instance.strokeWidth = 0;

    instance.obj_type = 'WBShapeNotes';

    instance.fill = '#000';

    instance.stroke = '#BDBDBD';

    instance.backgroundColor = '#FFFFFF';

    instance.fixedLineWidth = 2;

    instance.lineWidth = 2;

    instance.strokeWidth = 0.2;

    instance.lockMovementX = false;

    instance.lockMovementY = false;

    instance.selectable = true;

    instance.locked = false;

    instance.lockUniScaling = true;

    instance.isFirst = true;

    instance.selectable = true;

    canvas.requestRenderAll();

  };

  const handleShapeMouseMove = (e) => {

    if (!canvas) return;

    if (instance.isFirst) {

      delete instance.isFirst;

      canvas.add(instance);

      canvas.requestRenderAll();

    }

    const { width, height } = calcDimension(startPoint, e.pointer);

    const { x, y } = calcDirection(startPoint, e.pointer);

    instance.width = Math.abs(width);

    instance.height = Math.abs(height);

    instance.maxHeight = Math.abs(height);

    instance.originX = x;

    instance.originY = y;

    instance.dirty = true;

    canvas.requestRenderAll();

  };

  const handleShapeMouseUp = (e) => {

    if (calcDistance(startPoint, e.pointer) < 5) {

      canvas.remove(instance);

      dispatch(changeMode('default'));

      return;

    }

    instance.left +=
      instance.originX === 'left'
        ? instance.width / 2
        : (-1 * instance.width) / 2;

    instance.top +=
      instance.originY === 'top'
        ? instance.height / 2
        : (-1 * instance.height) / 2;

    instance.originX = 'center';

    instance.originY = 'center';

    instance.dirty = true;

    instance.setCoords();

    store.dispatch(handleSetMenuFontWeight('normal'));

    WidgetService.getInstance().insertWidget(instance.getObject());

    canvas.pushNewState([
      {
        targetId: instance._id,
        activeselection: true,
        newState: instance.getObject(),
        action: 'ADDED'
      }
    ]);

    canvas.setActiveObject(instance);

    canvas.requestRenderAll();

    dispatch(changeMode('default'));
  };

  return {
    handleShapeMouseDown,
    handleShapeMouseMove,
    handleShapeMouseUp,
    handleShapeBefore,
    handleShapeAfter

  };
};

export default useShapeActions;
