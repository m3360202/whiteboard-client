//**Redux Store */
import store from '../store';
import { handleSetLexicalSelection } from '../store/domArea';
import { userApi } from '../redux/UserAPISlice';
import { handleSetLastSessionId } from '../store/user';
import { handleAddOnlineUser } from '../store/system';

//**Services */
import { ClipboardService, WidgetService } from '../services';
import EventNames from '../util/EventNames';
import { bindEvents } from '../board/canvas/initialize/initializeShortcut';
import filedropUploadCallback from '../board/components/filedropUploadCallback';
import { switchInteractionMode } from '../board/canvas/initialize/initializeCanvasEvents';

//**Hammerjs */
import Hammer from 'hammerjs';

//**rxjs */
import { fromEvent, switchMap, takeUntil, tap } from 'rxjs';
import $ from 'jquery';
import server from '../startup/serverConnect';
import i18n from 'i18next';

export default class EventService {

  public _eventHandlers: any;

  public _listenTriggerEventsHandlers: any;

  public handleCanvasCutBound: (e: Event) => void;

  public handleCanvasCopyBound: (e: Event) => void;

  static service = null;

  static getInstance(): EventService {

    if (EventService.service == null) {

      EventService.service = new EventService();

      Boardx.Instance.EventService = EventService.service;

    }

    return EventService.service;
  }

  constructor() {

    this._eventHandlers = new Map();

    this._listenTriggerEventsHandlers = false;

    this.listenWindowEvents();

    this.handleCanvasCutBound = (e) => this.handleCanvasCut(e);

    this.handleCanvasCopyBound = (e) => this.handleCanvasCopy(e);

  }

  getEventHandlers() {
    return this._eventHandlers;
  }

  listenWindowEvents() {
    window.addEventListener('resize', (e) => this.trigger(EventNames.WINDOW_RESIZE, e));
    window.addEventListener('gesturestart', (e) => this.trigger(EventNames.WINDOW_GESTURE_START, e));
    window.addEventListener('gesturechange', (e) => this.trigger(EventNames.WINDOW_GESTURE_CHANGE, e));
    window.addEventListener('contextmenu', this.handleContextmenu, true);
  }

  listenCanvasDomEvents() {

    const canvasEl = $('#icanvas');
    let canvas = (window as any).canvas;
    switchInteractionMode(canvas.interactionMode);

    //bing shortcut key events 
    bindEvents();
    //listen dragover event on canvas
    document.addEventListener('dragover', this.onCanvasDragOver, true);
    //listen paste event on canvas 
    document.addEventListener('paste', this.handleCanvasPaste, true);
    //listen cut event on canvas 
    document.addEventListener('cut', this.handleCanvasCutBound, true);
    //listen copy event on canvas 
    document.addEventListener('copy', this.handleCanvasCopyBound, true);

    const uperCanvas: any = canvasEl.next();

    uperCanvas.filedrop({
      upload: filedropUploadCallback,
      error(error) {
        console.error(error);
      }
    });
  };

  unMountCanvasDomEvents() {
    window.removeEventListener('contextmenu', this.handleContextmenu, true);
    document.removeEventListener('dragover', this.onCanvasDragOver, true);
    document.removeEventListener('paste', this.handleCanvasPaste, true);
    document.removeEventListener('cut', this.handleCanvasCutBound, true);
    document.removeEventListener('copy', this.handleCanvasCopyBound, true);
  };

  listenCanvasActionEvents() {
    let canvas = (window as any).canvas;
    //mouse on canvas action events
    canvas.on('mouse:up', (e) => this.trigger(EventNames.CANVAS_MOUSE_UP, e));
    canvas.on('mouse:down', (e) => this.trigger(EventNames.CANVAS_MOUSE_DOWN, e));
    canvas.on('mouse:move', (e) => this.trigger(EventNames.CANVAS_MOUSE_MOVE, e));
    canvas.on('mouse:out', (e) => this.trigger(EventNames.CANVAS_MOUSE_OUT, e));
    canvas.on('mouse:down:before', (e) => this.trigger(EventNames.CANVAS_MOUSE_DOWN_BEFORE, e));
    canvas.on('mouse:dblclick', (e) => this.trigger(EventNames.MOUSE_DBCLICK, e));

    //canvas selection events
    canvas.on('before:selection:cleared', (e) => this.trigger(EventNames.CANVAS_BEFORE_SELECTION_CLEARED, e));
    canvas.on('selection:updated', (e) => this.trigger(EventNames.CANVAS_SELECTION_UPDATED, e));
    canvas.on('selection:created', (e) => this.trigger(EventNames.CANVAS_SELECTION_CREATED, e));
    canvas.on('selection:cleared', (e) => this.trigger(EventNames.SELECTION_CLEARED, e));

    //canvas object action events
    canvas.on('object:moving', (e) => this.trigger(EventNames.OBJECT_MOVING, e));
    canvas.on('object:scaling', (e) => this.trigger(EventNames.OBJECT_SCALING, e));

    //canvas text events
    canvas.on('text:changed', (e) => this.trigger(EventNames.TEXT_CHANGED, e));
    canvas.on('text:editing:exited', (e) => this.trigger(EventNames.TEXT_EDITING_EXISTED, e));

    //render text events
    canvas.on('before:render', (e) => this.trigger(EventNames.BEFORE_RENDER, e));
    canvas.on('after:render', (e) => this.trigger(EventNames.AFTER_RENDER, e));

  }
  listenTriggerEvents() {

    if (!this._listenTriggerEventsHandlers) {
      let listenDom = document.getElementById('boardEntity');

      //document event in board
      document.addEventListener('keydown', (e) =>
        this.trigger(EventNames.DOCUMENT_KEY_DOWN, e),
      );
      document.addEventListener('keyup', (e) =>
        this.trigger(EventNames.DOCUMENT_KEY_UP, e),
      );
      document.addEventListener('resume', (e) =>
        this.trigger(EventNames.DOCUMENT_RESUME, e),
      );
      document.addEventListener('visibilitychange', (e) =>
        this.trigger(EventNames.DOCUMENT_VISIBILITY_CHANGE, e),
      );

      listenDom.addEventListener(
        'mousewheel',
        (e) => {
          this.blockZoomOnBrowser(e);
        },
        {
          passive: false,
        },
      );
      this._listenTriggerEventsHandlers = true;
    }

  }
  listenHammerEvents() {

    const hammer = new Hammer.Manager(canvas.upperCanvasEl, {});
    const pan1 = new Hammer.Pan({ event: 'pan1', pointers: 1, threshold: 1 }); // One finger move/drag
    const pinch = new Hammer.Pinch({
      event: 'pinch',
      pointers: 2,
      threshold: 0,
    }); // two finger zoom

    const tap1 = new Hammer.Tap({ event: 'tap1', pointers: 1, threshold: 1 }); // one finger tap/click

    pan1.dropRecognizeWith(pinch);
    pan1.requireFailure(pinch);
    const doubletap = new Hammer.Tap({
      pointers: 1,
      threshold: 2,
      posThreshold: 20,
      event: 'doubletap',
      taps: 2,
    }); // One finger double tap/ click
    pan1.dropRecognizeWith(doubletap);
    pan1.requireFailure(doubletap);
    pinch.dropRecognizeWith(doubletap);
    pinch.requireFailure(doubletap);
    // Tap recognizer with minimal 2 taps

    const press = new Hammer.Press({
      event: 'press',
      pointers: 1,
      threshold: 9,
      time: 300,
    });

    hammer.add(press);
    hammer.add(pan1);
    hammer.add(pinch);
    hammer.add(doubletap);
    hammer.add(tap1);
    hammer.get('pan1').set({ enable: true });
    hammer.on('tap1', (e) => this.trigger(EventNames.HAMMER_TAP1, e));
    hammer.on('doubletap', (e) => this.trigger(EventNames.HAMMER_DOUBLE_TAP, e));
    const press$ = fromEvent(hammer, 'press')
    const panStart$ = fromEvent(hammer, 'pan1start')
    const mousemove$ = fromEvent(hammer, 'pan1move')
    const mouseup$ = fromEvent(hammer, 'pan1end')

    let mode = 'static'

    panStart$.pipe(
      tap((e: any) => {
        if (!e.srcEvent.path || e.srcEvent.path.length == 0) {
          let target = e.target;
          e.srcEvent.path = [];
          while (target.parentNode !== null) {
            e.srcEvent.path.push(target);
            target = target.parentNode;
          }
          e.srcEvent.path.push(document, window);
        }
        this.trigger(EventNames.HAMMER_PAN1_START, e);
      }),
      switchMap(_ =>
        mousemove$.pipe(
          tap((e: any) => {
            if (!e.srcEvent.path || e.srcEvent.path.length == 0) {
              let target = e.target;
              e.srcEvent.path = [];
              while (target.parentNode !== null) {
                e.srcEvent.path.push(target);
                target = target.parentNode;
              }
              e.srcEvent.path.push(document, window);
            }
            if (mode === 'press') {
              return;
            }
            if (canvas.getActiveObject()) return;
            mode = 'pan'
            canvas.selection = false;
            canvas.isEnablePanMoving = true;
            this.trigger(EventNames.HAMMER_PAN1_MOVE, e);
          }),
          takeUntil(mouseup$)
        )
      )
    ).subscribe()

    press$.pipe(
      tap(e => {
        mode = 'press'
        canvas.selection = true;
        canvas.isEnablePanMoving = false;
        this.trigger(EventNames.HAMMER_PAN1_START, e);
      }),
      switchMap(_ =>
        mousemove$.pipe(
          tap(e => {
            this.trigger(EventNames.HAMMER_PAN1_MOVE, e);
          }),
          takeUntil(mouseup$)
        )
      )
    ).subscribe()

    mouseup$.subscribe((e: any) => {
      this.trigger(EventNames.HAMMER_PAN1_END, { ...e, mode }); // Hammer automatically created this event based on 'pan1'
      mode = 'static'
      canvas.selection = true;
      canvas.isEnablePanMoving = false;
    })
    hammer.on('pinchstart', (e) => {
      canvas.selection = false
      this.trigger(EventNames.HAMMER_PINCH_START, e)
    }); // Hammer defined : start of two finger zoom

    hammer.on('pinchmove', (e) =>
      this.trigger(EventNames.HAMMER_PINCH_MOVE, e),
    ); // Hammer defined : move/process of two finger zoom

    hammer.on('pinchend', () => {
      canvas.selection = true
    })
  }

  resizeCanvasAccordingtoWindowSize() {

    const windowEl = $(window);

    const winWidth = windowEl.width();

    const winHeight = windowEl.height();

    if (canvas) {
      canvas.setWidth(winWidth);
      canvas.setHeight(winHeight);
    }

    $('.canvas-container').css('width', winWidth);

    $('.canvas-container').css('height', winHeight);

    $('.canvas-top-info').css('width', winWidth);

    $('.remote-viewport').height($(window).height());

    $('.remote-viewport').width($(window).width());

  }

  register(eventName, handlerFunction) {
    if (!this._eventHandlers.has(eventName)) {
      this._eventHandlers.set(eventName, [handlerFunction]);  // 直接在创建新数组时添加当前处理函数
    } else {
      const index = this._eventHandlers.get(eventName).indexOf(handlerFunction);
      if (index < 0) {  // 如果之前没有添加过当前处理函数，才将其添加
        this._eventHandlers.get(eventName).push(handlerFunction);
      }
    }
  }

  unregister(eventName, handlerFunction) {

    if (!this._eventHandlers.has(eventName)) {
      this._eventHandlers.set(eventName, []);
    }

    const index = this._eventHandlers.get(eventName).indexOf(handlerFunction);

    if (index > -1) {
      this._eventHandlers.get(eventName).splice(index, 1);
    }

  }

  trigger(eventName, e) {

    if (!this._eventHandlers.has(eventName)) {
      return;
    }

    /* prevent handler be unreigstered at other places */
    const handlers = [...this._eventHandlers.get(eventName)];

    handlers.forEach((handlerMethod) => {
      handlerMethod(e);
    });

  }

  unregisterAllEvents() {
    let canvas = (window as any).canvas;
    if (canvas) {

      canvas.off();

    } // remove all event listeners from the canvas element

    this._eventHandlers.clear(); // clear the _eventHandlers map

  }

  blockZoomOnBrowser(e) {

    if (e.ctrlKey) {

      e.preventDefault();

      this.trigger(EventNames.DOCUMENT_MOUSE_WHEEL, e);
    }

  }

  //dragover function
  onCanvasDragOver(e) {
    const dragX = e.pageX;
    const dragY = e.pageY;
    canvas.lastMousePosition = { x: dragX, y: dragY };
    canvas.dragOverEvent = e;
  }
  //paste function
  async handleCanvasPaste(e) {
    if (document.activeElement.id) {
      return; // just in case the illegal paste hasn't been stopped.

    }

    // let showLexicalEditor = store.getState().domArea.lexical;
    // if (showLexicalEditor) {
    //   return;
    // }
    if (store.getState().board.noteMode) {
      return;
    }
    $('#canvasContainer').css('opacity', 1);

    if (canvas.isDrawingMode) {
      return;
    }



    const currentObj = canvas.getActiveObject();
    if (currentObj && (currentObj.obj_type === 'WBText' || currentObj.obj_type === 'WBTextbox')) {
      currentObj.set({ fromCopy: true });
    }
    if (currentObj && currentObj.isEditing) {
      canvas.getActiveObject().initDimensions();
      currentObj.dirty = true;
      canvas.requestRenderAll();
    }

    let blobs = [];
    const { items } = e.clipboardData;

    if (items) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          blobs.push(items[i].getAsFile());
        }
      }
    }

    const url = e.clipboardData.getData('text/plain');

    if (e.target.localName === 'textarea') {

      //如果是光标指定位置
      const start = e.target.selectionStart;

      const end = e.target.selectionEnd;

      const value = e.target.value;

      let text = '';

      if (start !== end) {
        text = value.substring(0, start) + e.clipboardData.getData('text/plain') + value.substring(end);
      }

      else {
        text = value.substring(0, start) + e.clipboardData.getData('text/plain') + value.substring(start);
      }

      currentObj.set({ text });

      currentObj.initDimensions();

      currentObj.dirty = true;

      canvas.requestRenderAll();

      return;

    }
    const boardId = store.getState().board.board._id;
    const userId = store.getState().user.userInfo.userId;
    const newPosition =   canvas.getVpCenter();
    canvas.discardActiveObject();
    canvas.requestRenderAll();
    await ClipboardService.getInstance().pasteCallback(blobs, url,newPosition, boardId, userId);



  }

  handleCanvasCut(e) {
    if (store.getState().domArea.isDomArea) return;
    const lexicalDomIn = store.getState().domArea.lexical;

    const aiToolBar = store.getState().domArea.aiToolBar;

    const lexicalSelection = store.getState().domArea.lexicalSelection;

    const d = e.srcElement || e.target;

    const cloneData = [];

    const activeObj = canvas.getActiveObject();

    let data = null;

    let group;

    let stateList = [];

    if (lexicalDomIn || aiToolBar) {
      return;
    }

    if (lexicalSelection) {
      store.dispatch(handleSetLexicalSelection(false));
      return;
    }

    if (activeObj && activeObj.isEditing) {
      return;
    }

    if (
      d.isEditing ||
      d.tagName.toUpperCase() === 'INPUT' ||
      d.tagName.toUpperCase() === 'TEXTAREA'
    ) {
      return;
    }

    if (canvas.getActiveObject()
      && canvas.getActiveObject().obj_type === 'WBGroup'
      && canvas.getActiveObject()._objects
      && canvas.getActiveObject()._objects.length > 0
      && !activeObj._id) {
      group = canvas.getActiveObject()._objects;
    }

    if (group) {
      group.forEach(obj => {

        if (!obj._id) {
          return;
        }

        const objcanvas = canvas.findById(obj._id);

        if (objcanvas) {

          const state2 = objcanvas.getUndoRedoState('REMOVED');

          stateList = stateList.concat(state2);

        }

        data = canvas.findById(obj._id).getObject();

        data.left += 10;

        data.top += 10;

        cloneData.push(data);

        canvas.pushNewState(stateList);

        WidgetService.getInstance().removeWidget(obj._id);

        canvas.remove(obj);

      });

      canvas.discardActiveObject();

    } else {

      const object = canvas.getActiveObject();

      data = object;

      const subIdinPanel = [];

      data.left += 10;

      data.top += 10;

      cloneData.push(data);

      const state2 = canvas.findById(object._id).getUndoRedoState('REMOVED');

      stateList = stateList.concat(state2);

      if (subIdinPanel.length > 0) {
        for (let i = 0; i < subIdinPanel.length; i++) {
          const stateSub = canvas.findById(subIdinPanel[i]).getUndoRedoState('REMOVED');

          stateList = stateList.concat(stateSub);

          WidgetService.getInstance().removeWidget(subIdinPanel[i]);

          canvas.remove(canvas.findById(subIdinPanel[i]));
        }
      }

      canvas.pushNewState(stateList);

      WidgetService.getInstance().removeWidget(object._id);

      canvas.remove(object);
    }
    if (cloneData.length === 0) {

      return;
    }

    const copyText = JSON.stringify({
      data: cloneData,
      type: 'whiteboard'
    });

    ClipboardService.getInstance().clipboardCopy(copyText);

    canvas.requestRenderAll();

  }

  handleCanvasCopy(e) {
    if (store.getState().domArea.isDomArea) return;
    const activeObj = canvas.getActiveObject();

    const d = e.srcElement || e.target;

    const cloneData = [];

    let data = null;

    let group;

    if (store.getState().board.noteMode) {
      return;
    }

    if (activeObj
      && activeObj.obj_type === 'WBGroup'
      && activeObj._objects
      && activeObj._objects.length > 0
      && !activeObj._id) {
      group = canvas.getActiveObject()._objects;
    }

    if (e) {

      if (d.tagName) {
        if (
          d.isEditing ||
          d.tagName.toUpperCase() === 'INPUT' ||
          d.tagName.toUpperCase() === 'TEXTAREA'
        ) {
          return;
        }

      }
    }

    if (group) {
      for (let i = 0; i < group.length; i++) {

        const obj = group[i];

        if (!obj._id) {
          return;
        }

        data = canvas.findById(obj._id).getObject();

        data.left += 10;

        data.top += 10;

        cloneData.push(data);

      }

    } else {

      const lexicalDomIn = store.getState().domArea.lexical;

      const aiToolBar = store.getState().domArea.aiToolBar;

      if (lexicalDomIn || aiToolBar) {
        return;
      }

      if (!lexicalDomIn && !aiToolBar) {
        data = canvas.getActiveObject();
        cloneData.push(data);
      }

    }

    if (cloneData.length === 0) return;

    const copyText = JSON.stringify({
      data: cloneData,
      type: 'whiteboard'
    });

    ClipboardService.getInstance().clipboardCopy(copyText);

  }

  handleContextmenu(e) {

    let domArea = false;

    let lexicalArea = store.getState().domArea.lexical;

    // let showLexical = store.getState().board.showLexical;

    let aiToolBarArea = store.getState().domArea.aiToolBar;

    // if ((showLexical && lexicalArea) || aiToolBarArea) {
    //   domArea = true;
    // }

    if (!domArea) {
      e.preventDefault();
    }

  }

  // Check share event
  async checkUserHasPermissionVisitBoard(board) {
    const t = i18n.getFixedT(null, null)
    return new Promise(async (resolve, reject) => {

      if (board && (!board.permission || board.permission === 'all')) {
        resolve({ state: true, msg: '' });
        return;
      }

      if (store.getState().user.userInfo.userId === board.createdBy) {
        resolve({ state: true, msg: '' });
        return;
      }

      if (board.permission && (board.permission == 'room' || board.permission == 'org') && store.getState().user.userInfo.userName.indexOf('vistor_') > -1) {
        resolve({ state: false, action: 1, msg: Boardx.Util.Msg.warning(t('state.vistorHasNoPermission')) });
        return;
      }

      if (board.permission == 'org') {

        if (board.orgId && store.getState().user.userInfo.userId) {

          let result: any = await store.dispatch(userApi.endpoints.checkIfUserInOrg.initiate({ orgId: board.orgId, userId: store.getState().user.userInfo.userId }));

          if (!result.data) {

            resolve({ state: false, msg: t('state.HasNoPermissionForOrg') });
            return;

          }

          else {
            resolve({ state: true, msg: '' });
            return;
          }

        }

        else {
          resolve({ state: true, msg: '' });
          return;
        }
      }

      if (board.permission == 'room') {

        if (board.roomId && store.getState().user.userInfo.userId) {

          let result: any = await store.dispatch(userApi.endpoints.checkIfUserInRoom.initiate({ roomId: board.roomId, userId: store.getState().user.userInfo.userId }));

          if (!result.data) {
            resolve({ state: false, msg: t('state.HasNoPermissionForOrg') });
            return;
          }

          else {
            resolve({ state: true, msg: '' });
            return;
          }

        }

        else {
          resolve({ state: true, msg: '' });
          return;
        }

      }
    })
  }


  checkNetConnection() {

    const mySocketConnectStatus = store.getState().user.socketConnectStatus;

    // if (store.getState().system.localConnection === 'connected' && mySocketConnectStatus) {
    //   return { state: 1, msg: 'connected' };
    // }
    if (mySocketConnectStatus) {
      return { state: 1, msg: 'connected' };
    }
    if (store.getState().system.localConnection === 'connecting' || store.getState().system.localConnection === 'reconnecting' || store.getState().system.localConnection === 'waiting') {
      return { state: 2, msg: 'connecting' };
    }

    if (store.getState().system.localConnection === 'offline' || store.getState().system.localConnection === 'failed' || !mySocketConnectStatus) {

      if (store.getState().system.localConnection === 'offline' && mySocketConnectStatus) {
        return { state: 0, msg: 'offline', type: 1 };
      }

      if (store.getState().system.localConnection !== 'offline' && !mySocketConnectStatus) {
        return { state: 0, msg: 'offline', type: 2 };
      }

      else {
        return { state: 0, msg: 'offline', type: 3 };
      }

    }

  }

  addOnlineUserToBoard(boardId) {

    const user = store.getState().user.userInfo;
    const token = localStorage.getItem('token') ? localStorage.getItem('token') : 'vistorToken';
    console.log('addOnlineUserToBoard', user, boardId, token)

    const userNo = Boardx.Util.getId()
    const addData = {
      userId: user.userId,
      username: user.userName, 
      avatar: user.avatar, 
      name:user.name,
      t: Date.now(),
      userNo:userNo,
      createdAt: new Date()
    }

    // if (boardId && user && token) {
    //   server.call('addOnlineUser', user, boardId, token).then((res) => {

    //     store.dispatch(handleSetLastSessionId(res));

    //   });
    // }
  }

  exitOnlineUsers(userId, boardId, token) {
    if (boardId && userId && token) {
      server.call('exitOnlineUser', userId, boardId, token).then((res) => {
        let userNo = store.getState().user.userInfo.userNo;

        store.dispatch(userApi.endpoints.exitOnlineUserByBoardId.initiate({ userId, userNo, boardId }));
      }
      );
    }

  }

  exitRecentOnlineUsers(userId, boardId, userNo) {
    if (boardId && userId && userNo) {
      server.call('exitRecentOnlineUser', userId, boardId, userNo).then((res) => {
        let userNo = store.getState().user.userInfo.userNo;

        store.dispatch(userApi.endpoints.exitOnlineUserByBoardId.initiate({ userId, userNo, boardId }));
      }
      );
    }

  }
}