import Hammer from 'hammerjs';
import { BoardService } from '../../services';
//** Import Redux toolkit
import store, { useAppSelector, RootState } from '../../store';
import { handleSetZoomFactor } from '../../store/board';
export const addPinchEvent = hammer => {
  hammer.add(
    new Hammer.Pinch({
      event: 'pinch',
      pointers: 2,
      threshold: 0
    })
  );

  hammer.on('pinchstart', onPinchStart);
  hammer.on('pinchmove', onPinchMove);
  hammer.on('pinchend', onPinchEnd);
};

const onPinchStart = _ => {
  // console.log('pinchstart');
  canvas.selection = false;
  canvas.pinchStartZoom = canvas.getZoom();
  canvas.requestRenderAll();
};

const onPinchMove = e => {
  // console.log('pinchmove');
  const delta = canvas.pinchStartZoom * e.scale;
  const point = e.center;
  if (canvas.getZoom() < 0.05 && e.scale < 1) {
    return;
  }
  if (canvas.getZoom() > 3 && e.scale > 1) {
    return;
  }
  canvas.zoomToPoint(point, delta);
  canvas.requestRenderAll();
  canvas.updateViewport();
  store.dispatch(handleSetZoomFactor(delta));
};

const onPinchEnd = _ => {
  // console.log('pinchend');
  canvas.selection = true;
  canvas.requestRenderAll();
};

export const removePinchEvent = hammer => {
  hammer.remove('pinch');
};
