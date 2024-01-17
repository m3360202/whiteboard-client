import Hammer from 'hammerjs';
import store from '../../store';

export const addTapEvent = hammer => {
  hammer.add(new Hammer.Tap({ event: 'tap1', pointers: 1, threshold: 1 }));
  hammer.on('tap1', handleOnTap);
};

export const handleOnTap = e => {
  const target = canvas.findTarget(e.srcEvent);
  const mode = store.getState().mode.type;
  console.log('handleOnTap', e, mode);
  if (!target || mode === 'pan') return;

  canvas.setActiveObject(target);
  canvas.requestRenderAll();
};

export const removeTapEvent = hammer => {
  hammer.remove('tap1');
};
