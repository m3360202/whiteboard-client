import Hammer from 'hammerjs';
import store from '../../store';

export const addPanEvent = hammer => {
  hammer.add(new Hammer.Pan({ event: 'pan', pointers: 1 }));

  hammer.on('panstart', onPanStart);
  hammer.on('panmove', onPanMove);
  hammer.on('panend', onPanEnd);
};

let movement = {
  x: 0,
  y: 0
};

export const onPanStart = e => {
  const mode = store.getState().mode.type;
  // console.log('onPanStart');
  if (mode !== 'pan') return;
  canvas.selection = false;
  canvas.discardActiveObject();

  movement = e.center;
};

export const onPanMove = e => {
  const mode = store.getState().mode.type;

  // console.log('onPanMove', e);
  if (mode !== 'pan') return;

  canvas.relativePan({
    x: e.center.x - movement.x,
    y: e.center.y - movement.y
  });
  const users = store.getState().user.onlineUsers;

  if (
    store.getState().board.followMe &&
    users.length - 1 > 0
  ) {
    canvas.updateViewport();
  }
  canvas.requestRenderAll();
  movement = e.center;
};

export const onPanEnd = e => {
  const mode = store.getState().mode.type;

  // console.log('onPanEnd');
  if (mode !== 'pan') return;

  movement = e.center;
  canvas.selection = true;
};

export const removePanEvent = hammer => {
  hammer.remove('pan');
};
