import Hammer from 'hammerjs';
import {
  setCurrentContextMenu,
  updateContextMenuPosition,
  updateContextMenuStatus
} from '../../store/contextMenu';
// import { updateAbsolutePoint } from '../../store/mode';
import store from '../../store';

export const add2TapEvent = hammer => {
  hammer.add(new Hammer.Tap({ event: 'tap2', pointers: 2, threshold: 2 }));
  hammer.on('tap2', handleOn2Tap);
};

export const handleOn2Tap = e => {
  const target = canvas.findTarget(e.srcEvent);

  console.log('handleOn2Tap', e);
  store.dispatch(setCurrentContextMenu(target));
  store.dispatch(updateContextMenuPosition(e.center));
  store.dispatch(updateContextMenuStatus(true));
};

export const remove2TapEvent = hammer => {
  hammer.remove('tap2');
};
