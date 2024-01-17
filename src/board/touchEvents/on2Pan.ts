import Hammer from 'hammerjs';
import store from '../../store';

export const add2PanEvent = hammer => {
  hammer.add(new Hammer.Pan({ event: 'pan', pointers: 2 }));

  hammer.on('panstart', on2PanStart);
  hammer.on('panmove', on2PanMove);
  hammer.on('panend', on2PanEnd);
};

let movement = {
  x: 0,
  y: 0
};

export const on2PanStart = e => {
  const mode = store.getState().mode.type;
  // console.log('onPanStart');
  if (mode !== 'pan') return;
  canvas.selection = false;
  canvas.discardActiveObject();
  movement = e.center;
};

export const on2PanMove = e => {
  const mode = store.getState().mode.type;

  // console.log('onPanMove', e);
  if (mode !== 'pan') return;

  canvas.relativePan({
    x: e.center.x - movement.x,
    y: e.center.y - movement.y
  });
  canvas.requestRenderAll();
  movement = e.center;
  const users = store.getState().user.onlineUsers;

  if (
    store.getState().board.followMe &&
    users.length - 1 > 0
  ) {
    canvas.updateViewport();
  }
  
};

export const on2PanEnd = e => {
 const mode = store.getState().mode.type;

  if (mode !== 'pan') return;

  movement = e.center;
  canvas.selection = true;
};

export const remove2PanEvent = hammer => {
  hammer.remove('pan');
};
