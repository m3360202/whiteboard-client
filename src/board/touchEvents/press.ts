import Hammer from 'hammerjs';
import store from '../../store';
import {
  setCurrentContextMenu,
  updateContextMenuPosition,
  updateContextMenuStatus
} from '../../store/contextMenu';

export const addPressEvent = hammer => {
  hammer.add(new Hammer.Press({ event: 'press', pointers: 1 }));
  hammer.on('press', handleOnPress);
};

export const handleOnPress = e => {
  const target = canvas.findTarget(e.srcEvent);
  if (!target) return;

  store.dispatch(setCurrentContextMenu(target));
  store.dispatch(updateContextMenuPosition(e.center));
  store.dispatch(updateContextMenuStatus(true));
};

export const removePressEvent = hammer => {
  hammer.remove('press');
};
