import React, { Component } from 'react';
//** LZUTF8 */
import LZUTF8 from 'lzutf8';

//** Redux Store */
import { api } from '../redux/api';
import store from '../store';
import { handleSetSocketConnectStatus } from '../store/user'
import { handleChangeViewport, handleChangeFollowMe, handleChangeFollowViewportUser } from '../store/board';
import { handleSetConnectionStatus } from '../store/system';
import { handleSetOnlineUsers } from '../store/user';
//** Socket io */
import { io } from "socket.io-client";

//** Fabric */
import * as fabric from '@boardxus/x-canvas';

//** Services */
import {
  WidgetService,
  BoardService,
  UserService
} from './index';

import _ from 'lodash';
import $ from 'jquery';

export default class SyncService {

  public id: any;
  public left: any;
  public top: any;
  public newFileds: any;
  public subId: any;
  public value: any;
  static service = null;
  public realtime;
  private sequence = 0;
  public socket = null;

  public currentWebSocket = null;

  public hostname = null;

  public username = null;;
  public roomname = null;


  static getInstance(): SyncService {

    if (SyncService.service == null) {

      SyncService.service = new SyncService();

      Boardx.Instance.SyncService = SyncService.service;

    }

    return SyncService.service;

  }

  constructor() {
    if (window.location.hostname === "localhost") {
      this.hostname = 'do-dev.boardx.us';
    }
    else if (window.location.hostname === "develop.boardx-client.pages.dev") {
      this.hostname = 'do-dev.boardx.us';
    }
    else if (window.location.hostname === "app.boardx.us") {
      this.hostname = 'do-prd.boardx.us';
    }

  
  }

  processSubscribe = message => {

    const decompressedDataString = LZUTF8.decompress(message, {
      inputEncoding: 'Base64'
    });

    const message2 = JSON.parse(decompressedDataString);

    const { data, userNo, seq, type } = message2;

    const currentUserNo = store.getState().user.userInfo.userNo;

    if (currentUserNo) {

      for (const msg of data) {
        const userNo = msg.d.uno;
        if (currentUserNo === userNo) {
          continue;
        }
        this.streamData.push(msg);
        this.count++;
      }
    }

  };


  initSync() {
    const boardId = store.getState().board.boardId;

    if (!boardId) {
      return;
    }

    const whiteboardId = boardId;

    if (!whiteboardId || whiteboardId === '') {
      if (Boardx.streamHandler) {
        Boardx.streamHandler.stop();
      }

      return;

    }

    let userNo = store.getState().user.userInfo.userNo;
    this.join(userNo, boardId);

  }

  closeConnection(){
    if(this.currentWebSocket){
      this.currentWebSocket.close();
    }
  }



  async join(username, roomname) {

    console.log('###join', username, roomname)
    this.username = username;
    this.roomname = roomname;
    if (this.currentWebSocket) {
      this.currentWebSocket.close();
    }
    // If we are running via wrangler dev, use ws:
    const wss = document.location.protocol === "http:" ? "ws://" : "wss://";
    let ws = new WebSocket(wss + this.hostname + "/api/room/" + this.roomname + "/websocket");
    let rejoined = false;
    let startTime = Date.now();

    let rejoin = async () => {
      if (!rejoined) {
        rejoined = true;
        this.currentWebSocket = null;

        // Clear the roster.
        //   while (roster.firstChild) {
        //     roster.removeChild(roster.firstChild);
        //   }

        // Don't try to reconnect too rapidly.
        let timeSinceLastJoin = Date.now() - startTime;
        if (timeSinceLastJoin < 10000) {
          // Less than 10 seconds elapsed since last join. Pause a bit.
          await new Promise(resolve => setTimeout(resolve, 10000 - timeSinceLastJoin));
        }

        // OK, reconnect now!
        this.join(this.username, this.roomname);
      }
    }
    ws.addEventListener("error", event => {
      console.log("WebSocket error, reconnecting:", event);
      rejoin();
    });

    ws.addEventListener("close", message => {
      console.log('socket disconnect', message);
      store.dispatch(handleSetSocketConnectStatus(false));
    });
    
    ws.addEventListener("open", event => {
      this.currentWebSocket = ws;

      const user = store.getState().user.userInfo;
   
      const userData = {
        userId: user.userId,
        username: user.userName, 
        avatar: user.avatar, 
        name:user.name,
        t: Date.now(),
        userNo:user.userNo,
        createdAt: new Date(),
        color:"",
        display:"none",
      }
  
  
      // Send user info message.
      ws.send(JSON.stringify({ name: JSON.stringify(userData) }));
      store.dispatch(handleSetSocketConnectStatus(true));
      ws.addEventListener("message", event => {
        let data = JSON.parse(event.data);
        if (data.message) {
          this.processSubscribe(data.message);
        }
        if(data.joined){
          console.log('###joined', data);
          const newUser = JSON.parse(data.joined);
          UserService.getInstance().addOnlineUserToLocal(newUser);
        }
        if(data.quit){
          console.log('###quit', data);
          const toRemoveUser = JSON.parse(data.quit);
          UserService.getInstance().removeOnlineUserFromLocal(toRemoveUser);
        }
      });
    });


    ws.addEventListener("close", event => {
      console.log("WebSocket closed, reconnecting:", event.code, event.reason);
      rejoin();
    });
    ws.addEventListener("error", event => {
      console.log("WebSocket error, reconnecting:", event);
      rejoin();
    });
  }



  followTimeoutHandler = null;

  count = 0;

  oldCount = 0;

  streamData = [];

  emitSyncEvent(id, data) {
    if (!store.getState().user.onlineUsers) return;
    if (!this.currentWebSocket) return;
    const onlineUsersCount = store.getState().user.onlineUsers.length;
    if (onlineUsersCount < 2) return;

    let messasge = null;

    const currentUserNo = store.getState().user.userInfo.userNo;

    let isChangeMade = false;

    for (let i = 0; i < data.length; i++) {

      isChangeMade = this.checkifChangeMadeToBoard(data[i]);

      if (isChangeMade) {

        break;
      }
    }

    //type 1 is for sync widget change, type 0 means no widget change
    if (isChangeMade) {

      this.sequence++;

      messasge = { data, userNo: currentUserNo, seq: this.sequence, type: 1 };

    } else {
      messasge = { data, userNo: currentUserNo, seq: null, type: 0 };
    }

    let compressedData = LZUTF8.compress(JSON.stringify(messasge), {
      outputEncoding: 'Base64'
    });

    const whiteboardId = store.getState().board.board._id;

    console.log('compressedData', compressedData)
    // this.socket.emit('boardMessage', { room: whiteboardId, msg: compressedData });
    this.currentWebSocket.send(JSON.stringify({ message: compressedData }));

  }

  async handleSyncQueue() {

    const boardId = store.getState().board.board._id;

    if (this.streamData.length > 2000 && boardId) {
      // @ts-ignore
      api.util.invalidateTags([{ type: 'widgets', whiteboardId: boardId }]);
    }

    const length = this.streamData.length < 100 ? this.streamData.length : 100;

    for (let i = 0; i < length; i++) {

      const data = this.streamData.shift();

      this.checkifChangeMadeToBoard(data);

      await this.processMessage(data, canvas);

    }
  }

  checkifChangeMadeToBoard(data) {

    if (data.t === 5 || data.t === 8 || data.t === 9) {
      return true;
    }

    return false;

  }

  getStreamData() {
    return this.streamData;
  }

  async processMessage(message, canvas) {

    const event = message;

    const userNo = event.d.uno;

    const whiteboardId = store.getState().board.board._id;

    if (store.getState().user.userInfo.userNo === userNo) {
      //local envets not need to process
      return;
    }

    // adding new user
    if (event.t === 2) {
    }
    // update mouse location
    if (event.t === 1) {
      await this.processRemoteMouseEvent(userNo, canvas, event);
    }
    // update viewport
    if (event.t === 4) {
      await this.processRemoteViewportChange(event, canvas);
    }
    // update object array
    if (event.t === 5) {
      this.processRemoteWidgetUpdate(event, canvas);
    }

    if (event.t === 8) {
      this.processInsertWidget(event, canvas);
    }

    if (event.t === 9) {
      this.processRemoteWidgetRemove(event, canvas);
    }

    if (event.t === 10) {
      this.processRestoreBackup();
    }

    if (event.t === 11) {
      this.processFrameBindingChange(event, canvas);
    }

    // self.close = () => {
    //   UserStream.removeAllListeners(`${whiteboardId}:add`);
    //   UserStream.removeAllListeners(`${whiteboardId}:update`);
    //   UserStream.removeAllListeners(`${whiteboardId}:remove`);
    // };
  }

  private processFrameBindingChange(event: any, canvas: any) {

    const updateObjects = event.d.o;

    updateObjects.forEach(async obj => {

      const { id, subId, value } = obj;

      const toUpdate = canvas.findById(id);

      if (!toUpdate) return;

      toUpdate.subObjs[subId] = value;

    });

    return canvas;

  }

  private processRestoreBackup() {

    Boardx.Util.Msg.info('board.service.restored');

    setTimeout(() => {

      window.location.reload();

    }, 3000);

  }

  private processRemoteWidgetRemove(event: any, canvas: any) {

    const updateObjects = event.d.o;

    updateObjects.forEach(widget => {

      const id = widget._id;

      const toDelete = _.find(canvas._objects, { _id: id });

      WidgetService.getInstance().removeWidgetFromLocalWidget(id);

      if (toDelete) {

        canvas.remove(toDelete);

        canvas.requestRenderAll();
      }

      setTimeout(() => {

        canvas.anyChanges = true;

      }, 500);

    });

    return canvas;

  }

  private processInsertWidget(event: any, canvas: any) {

    const updateObjects = event.d.o;

    updateObjects.forEach(async widget => {

      const id = widget._id;

      if (canvas.findById(id)) return;

      await canvas.renderWidgetAsync(widget);

      if (!WidgetService.getInstance().getWidgetFromWidgetList(id)) {

        WidgetService.getInstance().insertWidgetToLocalWidget(widget);

      }

      setTimeout(() => {

        canvas.anyChanges = true;

      }, 500);

    });

    return canvas;

  }

  private processRemoteWidgetUpdate(event: any, canvas: any) {

    const updateObjects = event.d.o;

    let updatedZIndex = false;

    // if the update object is selected, then cancel the selection first
    updateObjects.forEach(async obj => {

      const { id } = obj;

      const toUpdate = canvas.findById(id);

      if (!toUpdate) return;

      if (obj.d.selectable !== undefined) {
        toUpdate.tempSelectable = obj.d.selectable;
      }

      if (obj.d.zIndex !== undefined) {
        updatedZIndex = true;
      }

      const currerntActiveObject = canvas.getActiveObject();

      if (
        currerntActiveObject &&
        currerntActiveObject.length === 1 &&
        currerntActiveObject[0]._id === id
      ) {
        canvas.discardActiveObject();
      }

      if (currerntActiveObject && currerntActiveObject.length > 1) {
        currerntActiveObject.removeWithUpdate(toUpdate);
      }

      // if note draw change, refresh the image
      if (obj.d.imageSrc) {
        toUpdate.imageElement = null;
      }

      if (toUpdate.lockTimeOutHandler) {
        clearTimeout(toUpdate.lockTimeOutHandler);
      }

      // if the note type is changed.
      if (obj.d.obj_type) {
        let type = '';
        if (obj.d.obj_type === 'WBCircleNotes') {
          type = 'circle';
        }
        if (obj.d.obj_type === 'WBRectNotes' && obj.d.width === 230) {
          type = '53';
        }

        if (obj.d.obj_type === 'WBRectNotes' && obj.d.width === 138) {
          type = '33';
        }
        if (obj.d.obj_type === 'WBTextbox') type = 'textbox';
        if (obj.d.obj_type === 'WBText') type = 'text';

        // switch note and skip saving data
        canvas.switchNoteType([toUpdate], type, true);

        return;
      }
      if (toUpdate.objectCaching) toUpdate.objectCaching = false;

      if (toUpdate.obj_type !== 'WBRectPanel') toUpdate.opacity = 0.6;

      toUpdate.selectable = false;

      toUpdate.editable = false;

      if (obj.d.left || obj.d.top) {

        if (toUpdate.group) {
          canvas.discardActiveObject();
        }

        canvas.stopAnimateObjectToPosition = true;

        const { left, top, ...newFileds } = obj.d;

        toUpdate.set(newFileds);

        await canvas.animateObjectToPosition(toUpdate, obj.d.left, obj.d.top);

      } else {
        toUpdate.set(obj.d);
      }

      if (toUpdate.objectCaching) {

        toUpdate.objectCaching = false;

      }

      /*
      this part is for remote sync frame title
      */
      if (toUpdate.obj_type === 'WBRectPanel') {
        toUpdate.titlebox.text = toUpdate.text;
        toUpdate.titlebox.dirty = true;
        canvas.requestRenderAll();
      }

      if (toUpdate.obj_type === 'WBRectNotes') {
        if (toUpdate.lastEditedBy === 'AI') {
          toUpdate.author = 'AI';
        }

      }

      toUpdate._forceClearCache = true;

      WidgetService.getInstance().updateWidgetFromLocalWidget(obj.id, obj.d);

      toUpdate.lockTimeOutHandler = setTimeout(() => {

        toUpdate.opacity = 1;

        toUpdate.editable = true;

        toUpdate.selectable = toUpdate.tempSelectable !== undefined ? toUpdate.tempSelectable : true;

        toUpdate.setCoords();

        toUpdate.dirty = true;

        canvas.requestRenderAll();

        toUpdate.lockTimeOutHandler = null;

        delete toUpdate.tempSelectable;

      }, 1 * 1000);

      toUpdate.setCoords();

      toUpdate.dirty = true;

      canvas.requestRenderAll();

    });

    if (updatedZIndex) {
      canvas.sortByZIndex();
    }

    return canvas;

  }

  private processRemoteViewportChange(event: any, canvas: any) {
    if (event.d.f) {

      if (this.followTimeoutHandler) {
        clearTimeout(this.followTimeoutHandler);
      }

      canvas.stopAnimateToRect = true;

      store.dispatch(handleChangeViewport(event.d));

      store.dispatch(handleChangeFollowViewportUser(event.d.uno));

      if (store.getState().board.followMe)
        store.dispatch(handleChangeFollowMe(true));
    }

  }


  userIcons = {};

  startPoint = {};

  moveTimer = null;

  animateMove(prop, start, end, userId) {
    fabric.util.animate({
      startValue: start,
      endValue: end,
      duration: 300,
      onChange: value => {
        this.userIcons[userId][prop] = value;
        canvas.requestRenderAll();
      },
      easing: fabric.util.ease.easeInOutSine
    });

  }

  private async processRemoteMouseEvent(userNo: any, canvas: any, event: any) {

    const onlineUsers = store.getState().user.onlineUsers;

    const user = onlineUsers.find((u) => u.userNo === userNo);//线上onlineuser未及时清除时，多个onlineuser会导致这里不对

    if (!user) return;

    if (!canvas.state.userMouseHandler) canvas.state.userMouseHandler = {};

    if (canvas.state.userMouseHandler[user.userId]) {

      clearTimeout(canvas.state.userMouseHandler[user.userId]);

    }

    let domMouseLeft;

    let domMouseTop;

    if (canvas) {

      const newPoint = fabric.util.transformPoint(
        { x: event.d.x, y: event.d.y },
        canvas.viewportTransform
      );

      domMouseLeft = newPoint.x;

      domMouseTop = newPoint.y;

      $(`#${user.userNo}`).show();

      await Boardx.Util.animateMouseToPosition(
        user.userNo,
        domMouseLeft,
        domMouseTop
      );

      canvas.state.userMouseHandler[user.userId] = setTimeout(() => {
        $(`#${user.userNo}`).hide();
      }, 2 * 1000);

    }
  }
}