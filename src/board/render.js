//** Redux Store */
import store from '../store';

//** Services */
import { SyncService } from '../services';

//** Utils*/
import Stats from 'stats.js';
import _ from 'underscore';

const stats = new Stats();

stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom

stats.dom.style.left = '-500px';

stats.dom.style.position = 'absolute';

window.stats = stats;

document.body.appendChild(stats.dom);

let runOrNot3 = 0;

function updateRemote(canvas, event, mouseUpdate, type) {

  if(!canvas || !store.getState().user.userInfo.userNo) return;

  const whiteboardId = store.getState().board.board._id;

  const updateData = [];

  const toUpdateMouse = mouseUpdate && event.e && event.e.target && type.includes('mouse');

  if (toUpdateMouse) {

    const mousePoint = canvas.getPointer(event.e);

    const mouseData = {
      t: 1,
      d: {
        uno: store.getState().user.userInfo.userNo,
        x: parseInt(mousePoint.x, 10),
        y: parseInt(mousePoint.y, 10),
      },
    };

    canvas.lastMouseData = mouseData;

    updateData.push(mouseData);

  }

  const toUpdateObjects = canvas.toUpdateObjectRemote && canvas.toUpdateObjectRemote.length > 0 && type.includes('object');

  if (toUpdateObjects) {

    const modifiedObjects = {
      t: 5,
      d: {
        uno: store.getState().user.userInfo.userNo,
        o: canvas.toUpdateObjectRemote,
      },
    };

    canvas.lastMidifiedObject = modifiedObjects;

    updateData.push(modifiedObjects);

    canvas.toUpdateObjectRemote = [];

  }

  const toUpdateRemovedObjects = canvas.toUpdateRemovedObjectRemote && canvas.toUpdateRemovedObjectRemote.length > 0 &&  type.includes('object');

  if (toUpdateRemovedObjects) {

    const modifiedObjects = {
      t: 9,
      d: {
        uno: store.getState().user.userInfo.userNo,
        o: canvas.toUpdateRemovedObjectRemote,
      },
    };

    updateData.push(modifiedObjects);

    canvas.toUpdateRemovedObjectRemote = [];

  }

  const toUpdateNewObjects =  canvas.toUpdateNewObjectRemote && canvas.toUpdateNewObjectRemote.length > 0 && type.includes('object');

  if (toUpdateNewObjects) {

    const modifiedObjects = {
      t: 8,
      d: {
        uno: store.getState().user.userInfo.userNo,
        o: canvas.toUpdateNewObjectRemote,
      },
    };

    updateData.push(modifiedObjects);

    canvas.toUpdateNewObjectRemote = [];

  }

  // update view
  if (canvas.toUpdateViewportRemote && type.includes('viewport')) {

    updateData.push(_.clone(canvas.toUpdateViewportRemote));

    canvas.lastRemoteUpdateViewport = canvas.toUpdateViewportRemote;

    canvas.toUpdateViewportRemote = null;

  }

  // update slides
  if (canvas.toUpdateSlidesRemote && type.includes('slides')) {

    updateData.push(canvas.toUpdateSlidesRemote);

    canvas.toUpdateSlidesRemote = null;

  }
  if (updateData.length > 0) {
    SyncService.getInstance().emitSyncEvent(whiteboardId, updateData);
  }

}

function resetMouseStatus() {
  const canvas = window.canvas;
  if(!canvas) return;

  canvas.mouse.delta.x = 0;

  canvas.mouse.delta.y = 0;

  canvas.mouse.mouseMoveUpdate = false;

  canvas.mouse.zoomUpdate = false;

  canvas.isEnablePanMoving = false;

}

export default async function update() {
  const canvas = window.canvas;
  stats.begin();

  if (typeof(canvas)===undefined || !canvas) {

    window.requestAnimationFrame(update);
    return;
  }

  await SyncService.getInstance().handleSyncQueue();

  canvas.checkIfResetBackground();

  const event = canvas.mouse.e;

  runOrNot3++;

  if (runOrNot3 % 6 === 0 && store.getState().board.board && canvas) {

    runOrNot3 = 0;

    updateRemote(canvas, event, canvas.mouse.mouseMoveUpdate, [
      'mouse',
      'object',
      'slides',
      'viewport',
    ]);

  }

  resetMouseStatus();

  stats.end();

  window.requestAnimationFrame(update);
  
}
