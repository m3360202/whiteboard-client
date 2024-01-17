
//* DB DATA  */
import server from '../startup/serverConnect';

//* Store  */
import { api } from '../redux/api';
import { BoardApi } from '../redux/BoardAPISlice';
import { handleSetSlides } from '../store/slides';
import { handleSetTimer } from '../store/board/timer';
import store from '../store';
import {
  handleChangeFollowMe,
  handleChangeFollowViewportUser,
  handleSetBoard,
  handleSetConnectorMode,
  handleSetConnectorModifyMode,
  handleSetArrowMode,
  handleSetDrawingEraseMode,
  handleSetBoardMenuEvents,
  handleSetFollowMode,
  handleSetBoardId,
  handleSetCaptureThumbnail,

} from '../store/board';

import {handleSetAIChatRows} from '../store/AIAssist';

import {   handleSetOnlineUsers } from '../store/user'

//* Services  */
import {
  EventService,
  WidgetService,
  SyncService,
  FileService,
  UtilityService
} from '.';

//* Utils  */
import update from '../board/render';
import { async } from 'rxjs';

export default class BoardService {

  public subBoardHandler;

  public subOnlineUsersHandler;

  public _board: any;

  static service = null;

  public boardId = null;

  public chatSessionId = null;

  public chatLimit = 25;

  public timerSubscription = null;

  public chatSubscription = null;

  public onlineUsersSubscription = null;

  public whiteBoardSubscription = null;

  static getInstance(): BoardService {

    if (BoardService.service == null) {

      BoardService.service = new BoardService();

      Boardx.Instance.BoardService = BoardService.service;

      window.requestAnimationFrame(update);

    }

    return BoardService.service;

  }

  getChatLimt() {
    return this.chatLimit;
  }

  setChatLimt(limit) {
    this.chatLimit = limit;
  }

  async subscribeAndUpdate(boardId) {
    this.boardId = boardId;

    if (boardId) {
      // Unsubscribe from previous subscriptions if they exist
      console.log('onlineuser', this.onlineUsersSubscription)
      // subscription onlineUsers
      // this.onlineUsersSubscription = await server.subscribe('onlineUsers', boardId);
      // this.onlineUsersSubscription.ready().then(async () => {

      //   // 初始化onlineuser

      //   // let onlineUsersCollection = server.collection('onlineUserData');

      //   // 处理collection数据变动
      //   // onlineUsersCollection.onChange(async (data) => {
      //   //   await this.initOnlineUserInBoard();
      //   // })
      //   // setTimeout(async () => {
      //   //   await this.initOnlineUserInBoard();
      //   // }, 200);

      // });

      // subscription timer
      this.timerSubscription = await server.subscribe('timer', boardId);
      this.timerSubscription.ready().then(async () => {

        // 初始化onlineuser

        let timerCollection = server.collection('boardTimer');

        // 处理collection数据变动
        timerCollection.onChange(async () => {
          this.saveStoreOfTimer(boardId);
        })
        setTimeout(async () => {
          this.saveStoreOfTimer(boardId);
        }, 200);

      });

      // subscription whiteboard
      const userId = store.getState().user.userInfo.userId;
      const userNo = store.getState().user.userInfo.userNo;
      this.whiteBoardSubscription = await server.subscribe('whiteboard', boardId, userNo);
      this.whiteBoardSubscription.ready().then(async () => {

        let boardCollection = server.collection('board');

        // 处理collection数据变动
        boardCollection.onChange(async (data) => {
          this.saveStoreOfBoard();
        })
        setTimeout(async () => {
          await this.saveStoreOfBoard();
        }, 200);

      });

    }
  }

  //删除订阅
  async removeSub() {

    if (server.collections.board && this.whiteBoardSubscription) {
      await this.whiteBoardSubscription.stop();
      this.whiteBoardSubscription = null;
    }
    if (server.collections.onlineUserData && this.onlineUsersSubscription) {
      await this.onlineUsersSubscription.stop();
      this.onlineUsersSubscription = null;
    }
    if (this.timerSubscription) {
      await this.timerSubscription.stop();
      this.timerSubscription = null;
    }
    if (server.subs.length > 0) {
      server.subs = server.subs.filter(sub => sub.pubname === 'user');
    }
  }


  saveStoreOfBoard() {

    const boardData = server.collection('board').fetch();
    if (boardData.length == 0) {
      return;
    }
    let board = boardData.length > 1 ? boardData[boardData.length - 1] : boardData[0];

    board._id = board.id;

    // 处理collection数据变动
    this._board = board;
    // Dispatch actions to update board-related state in the store.
    store.dispatch(handleSetBoard(board));

    store.dispatch(handleSetBoardId(board?._id));

    store.dispatch(handleSetSlides(board?.slides || []));

    if (!board.follow) return;

    // Dispatch actions to update follow-related state in the store.
    store.dispatch(

      handleChangeFollowViewportUser(board.follow.followUserNo)

    );

    store.dispatch(handleSetFollowMode(board.follow.followMode));

    // Determine and dispatch action for "Follow Me" mode.
    if (board.follow.followUserNo === store.getState().user.userInfo.userNo) {
      store.dispatch(handleChangeFollowMe(true));
    } else {
      store.dispatch(handleChangeFollowMe(false));
    }
  }

  saveStoreOfTimer(boardId) {
    const timers = server.collection('boardTimer').fetch();
    const timer = timers.find(t => t.boardId === boardId);

    if (timer) {
      // Assuming you have configured store to be accessible
      store.dispatch(handleSetTimer(timer));
    }
  }

  getBoard() {
    return this._board;
  }

  /**
   * Asynchronously captures a thumbnail image of the canvas.
   * @returns {Promise<null|string>} A Promise that resolves with the captured thumbnail image data (base64 string) or null if the canvas is empty or unavailable.
   */
  async captureThumbnail() {
    return new Promise(async (resolve, reject) => {

      // Check if a canvas element is available.
      if (canvas) {
        // Get a list of objects on the canvas.
        let objs = canvas.getObjects();

        // If there are no objects on the canvas, resolve with null.
        if (!objs || objs.length === 0) {
          resolve(null);
        } else {
          // Mark all objects as not dirty to ensure thumbnail consistency.
          objs.forEach(obj => {
            obj.dirty = false;
          });

          // Capture the thumbnail image data.
          const imageData = canvas.captureThumbnail();

          // Resolve with the captured image data.
          resolve(imageData);
        }
      } else {
        // Resolve with null if the canvas is unavailable.
        resolve(null);
      }
    });
  }

  /**
   * Asynchronously backs up the content of a canvas, including capturing a thumbnail image and compressing it.
   * @returns {Promise<null|string>} A Promise that resolves with the compressed backup data (base64 string) or null if the canvas is empty or unavailable.
   */
  async backupBoard() {
    return new Promise(async (resolve, reject) => {
      // Check if a canvas element is available.
      if (canvas) {
        // Get a list of objects on the canvas.
        let objs = canvas.getObjects();

        // If there are no objects on the canvas, resolve with null.
        if (!objs || objs.length === 0) {
          resolve(null);
        } else {
          // Capture a thumbnail image of the canvas.
          let imageData = await canvas.toDataURLContent(6);

          // Dispatch an action to store the captured thumbnail image.
          store.dispatch(handleSetCaptureThumbnail(imageData));

          // Compress the captured image data.
          let result: any = await this.compressImage(imageData);

          // Resolve with the compressed backup data.
          resolve(result);
        }
      } else {
        // Resolve with null if the canvas is unavailable.
        resolve(null);
      }
    });
  }

  /**
   * Retrieves an array of text from widgets currently within the viewport of the canvas.
   * @returns {string[]} An array containing the text from widgets within the viewport.
   */
  getCurrentViewportTextArr() {
    let viewportWidgets = [];

    // Retrieve all objects on the canvas.
    const objects = canvas.getObjects();

    // Iterate through each object on the canvas.
    objects.forEach(obj => {
      // Check if the object is currently within the viewport.
      if (obj.isOnScreen()) {
        // Check if the object contains text and the text is not empty.
        if (obj.text && obj.text.length > 0) {
          // Add the text of the object to the array with a prefix.
          viewportWidgets.push(' - ' + obj.text);
        }
      }
    });

    // Return an array of text from widgets within the viewport.
    return viewportWidgets;
  }

  getCurrentOptionTextArr() {
    let optionWidgets = [];

    // Retrieve all objects on the canvas.
    const objects = canvas.getActiveObjects();

    // Iterate through each object on the canvas.
    objects.forEach(obj => {
      // Check if the object is currently within the viewport.
      if (obj.isOnScreen()) {
        // Check if the object contains text and the text is not empty.
        if (obj.text && obj.text.length > 0) {
          // Add the text of the object to the array with a prefix.
          optionWidgets.push(' - ' + obj.text);
        }
      }
    });

    // Return an array of text from widgets within the viewport.
    return optionWidgets;
  }

  /**
   * Retrieves the concatenated text content of widgets currently within the viewport of the canvas.
   * @returns {string} The concatenated text content of widgets within the viewport.
   */
  getCurrentViewportTextContent() {
    let viewportWidgets = [];

    // Retrieve all objects on the canvas.
    const objects = canvas.getObjects();

    // Iterate through each object on the canvas.
    objects.forEach(obj => {
      // Check if the object is currently within the viewport.
      if (obj.isOnScreen()) {
        // Check if the object contains text and the text is not empty.
        if (obj.text && obj.text.length > 0) {
          // Add the text of the object to the array.
          viewportWidgets.push(obj.text);
        }
      }
    });

    // Concatenate the text content of widgets within the viewport.
    let viewportTextContent = viewportWidgets.join(' ');

    // Remove trailing whitespace from the concatenated text content.
    viewportTextContent = viewportTextContent.replace(/(\s*$)/g, '');

    // Return the concatenated text content.
    return viewportTextContent;
  }

  /**
   * Calculate the bounding rectangle that encloses a set of objects on the canvas and returns its properties.
   * @param {fabric.Object[]} objs - An array of fabric.js objects for which to calculate the bounding rectangle.
   * @returns {object} An object containing the properties of the bounding rectangle, including its position, dimensions, and viewport transform.
   */
  getRect(objs) {
    // Create a copy of the input objects array.
    let objects = objs;

    // Initialize variables to store minimum and maximum coordinates.
    let minX = Number.MAX_VALUE;
    let minY = Number.MAX_VALUE;
    let maxX = Number.MIN_VALUE;
    let maxY = Number.MIN_VALUE;

    // Iterate through the objects to calculate the bounding rectangle.
    for (let i = 0; i < objects.length; i++) {
      let obj = objects[i];
      let objX = obj.left * canvas.getZoom() + canvas.viewportTransform[4];
      let objY = obj.top * canvas.getZoom() + canvas.viewportTransform[5];
      let objWidth = obj.width * canvas.getZoom();
      let objHeight = obj.height * canvas.getZoom();
      let objMinX = objX - objWidth / 2;
      let objMinY = objY - objHeight / 2;
      let objMaxX = objX + objWidth / 2;
      let objMaxY = objY + objHeight / 2;

      // Update the minimum and maximum coordinates as needed.
      if (objMinX < minX) {
        minX = objMinX;
      }
      if (objMinY < minY) {
        minY = objMinY;
      }
      if (objMaxX > maxX) {
        maxX = objMaxX;
      }
      if (objMaxY > maxY) {
        maxY = objMaxY;
      }
    }

    // Calculate padding size.
    var padding = 10;
    minX -= padding;
    minY -= padding;
    maxX += padding;
    maxY += padding;

    // Calculate the width and height of the bounding rectangle.
    var width = maxX - minX;
    var height = maxY - minY;

    // Apply the coordinates of the minimal bounding rectangle to the offset to get the position relative to the window.
    var windowX = minX;
    var windowY = minY;
    var windowWidth = width;
    var windowHeight = height;

    // Return the properties of the bounding rectangle.
    return {
      windowX,
      windowY,
      windowWidth,
      windowHeight,
      vpt: canvas.viewportTransform
    };
  }

  /**
   * Asynchronously compresses a base64 image and returns the compressed image as a base64 string.
   * @param {string} base64Image - The base64 image data to be compressed.
   * @returns {Promise<string>} A Promise that resolves with the compressed image as a base64 string.
   */
  async compressImage(base64Image) {
    const img = new Image();

    img.src = base64Image;

    // Wait for the image to finish loading.
    await new Promise<void>(resolve => {
      img.onload = () => {
        resolve();
      };
    });

    // Create a new canvas element.
    const canvas = document.createElement('canvas');

    const ctx = canvas.getContext('2d');

    // Determine the new width for the compressed image (maximum width of 860 pixels).
    let newWidth = img.width;

    if (newWidth > 860) {
      newWidth = 860;
    }

    // Calculate the new height while maintaining the image's aspect ratio.
    const newHeight = img.height * (newWidth / img.width);

    // Set the canvas dimensions to match the new width and height.
    canvas.width = newWidth;

    canvas.height = newHeight;

    // Compress the image by drawing it onto the canvas.
    ctx.drawImage(img, 0, 0, newWidth, newHeight);

    // Return the compressed image as a new base64 string with JPEG format and quality level 3.
    return canvas.toDataURL('image/jpeg', 3);
  }

  /**
   * Asynchronously updates the whiteboard's thumbnail image from captured data.
   */
  async updateWhiteboardThumbnailOutSide() {
    try {
      // Get the captured data URL from the store.
      const dataUrl = store.getState().board.captureThumbnail;

      // Convert the data URL to a Blob object.
      const originalFile = await Boardx.Util.dataURIToBlob(dataUrl);

      // Define compression options for the image.
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 400,
        useWebWorker: true
      };

      // Compress the image.
      const file = await Boardx.Util.compressImage(originalFile, options);

      // Set the name of the compressed file.
      file.name = store.getState().board.captureThumbnailBoardName + '.png';

      // Get the upload path for R2.
      const r2UploadPath = UtilityService.getInstance().getr2UploadPath(
        store.getState().board.board
      );

      // Upload the compressed thumbnail image to R2.
      const key: any = await FileService.getInstance().uploadThumbnailToR2Async(
        r2UploadPath,
        file,
        {
          // Progress callback (can be implemented if needed).
          progress() { }
        }
      );

      // Set the thumbnail source (URL) to the uploaded key.
      const src = key;

      // Update the current board with the new thumbnail information.
      BoardService.getInstance().updateCurrentBoard({
        thumbnail: src,
        lastUpdateTime: Date.now(),
        lastUpdateBy: store.getState().user.userInfo.userId,
        lastUpdateThum: Date.now(),
        lastUpdateByName: store.getState().user.userInfo.userName
      });

    } catch (e) {
      // Handle and log any errors that occur during the update process.
      console.error('update whiteboard thumbnail err', e);
    }
  }

  /**
   * Clears resources and events associated with the canvas and resets the canvas instance.
   */
  clearResourceAndEvents() {
    let canvas = (window as any).canvas;
    // Check if the canvas exists; if not, return early.
    if (!canvas) return;

    // Reset board menu events using BoardService.
    BoardService.getInstance().resetBoardMenuEvents();

    // Unmount canvas DOM events using EventService.
    EventService.getInstance().unMountCanvasDomEvents();

    // Unregister all canvas events using EventService.
    EventService.getInstance().unregisterAllEvents();

    // Clear any backgroundDotVisualizeInterval if it exists.
    if (canvas.backgroundDotVisualizeInterval) {
      clearInterval(canvas.backgroundDotVisualizeInterval);
    }

    // Clear the alignment guideline.
    canvas.alignmentGuideline = null;

    // Clear and dispose of the canvas instance to release memory.
    //canvas.clear(); // Clear the canvas elements.
    canvas.off();
    canvas.dispose(); // Dispose of the canvas instance.

    // Dispatch an action to reset the board ID in the store.
    store.dispatch(handleSetBoardId(''));

    // Clear the boardId property in BoardService.
    BoardService.getInstance().boardId = '';

    // Set the canvas variable to null and clear the board instance.
    canvas = null;

    Boardx.Instance.board = null;

  }

  /**
   * Exits the "Follow Me" mode for a given board if the conditions are met.
   * @param {object} board - The board object to check for "Follow Me" conditions.
   */
  exitFollowMe(board) {
    // Check if the board exists and if it is in "Follow Me" mode.
    if (
      board &&
      board.follow &&
      board.follow.followMode &&
      board.follow.followUserId &&
      board.follow.followUserId === store.getState().user.userInfo.userId
    ) {
      // Dispatch an action to update the board's follow settings, disabling "Follow Me" mode.
      store.dispatch(
        BoardApi.endpoints.updateBoardById.initiate({
          id: store.getState().board.board._id,
          data: {
            follow: {
              followMode: false,
              followUserName: null,
              followUserId: null
            }
          }
        })
      );
    }
  }

  /**
   * Exits the "Follow" mode for a given board if the conditions are met.
   * @param {object} board - The board object to check for "Follow" conditions.
   */
  exitFollow(board) {
    // Check if the board exists, is in "Follow" mode, and has a follow user ID.
    if (
      board &&
      board.follow &&
      board.follow.followMode &&
      board.follow.followUserId
    ) {
      // Dispatch an action to update the board's follow settings, disabling "Follow" mode.
      store.dispatch(
        BoardApi.endpoints.updateBoardById.initiate({
          id: store.getState().board.board._id,
          data: {
            follow: {
              followMode: false,
              followUserName: null,
              followUserId: null
            }
          }
        })
      );
    }
  }

  /**
   * Resets board menu events and related states.
   */
  resetBoardMenuEvents() {
    // Iterate through each board menu event object.
    store.getState().board.boardMenuEvents.forEach(obj => {
      // Unregister the event using EventService.
      EventService.getInstance().unregister(
        obj.eventName,
        obj.eventHandler
      );
    });

    // Dispatch an action to clear the board menu events.
    store.dispatch(handleSetBoardMenuEvents([]));

    // Reset various drawing and connector modes.
    store.dispatch(handleSetDrawingEraseMode(false));

    store.dispatch(handleSetConnectorMode(false));

    store.dispatch(handleSetConnectorModifyMode(false));

    store.dispatch(handleSetArrowMode(false));
  }

  /**
   * Asynchronously uploads an image by URL and adds it to the canvas as a widget.
   * @param {object} options - Object containing parameters for the image upload and widget creation.
   * @param {number} options.left - The left position of the widget on the canvas.
   * @param {number} options.top - The top position of the widget on the canvas.
   * @param {string} options.url - The URL of the image to be uploaded.
   * @param {string} options.userId - The user ID associated with the image upload.
   * @param {string} options.userNo - The user number associated with the image upload.
   * @param {string} options.whiteboardId - The ID of the whiteboard where the image will be added.
   * @param {string} options.obj_type - The type of object (widget) being added.
   * @param {string} options.authorization - Authorization information for the image upload.
   */
  async uploadImageByUrl({
    left,
    top,
    url,
    userId,
    userNo,
    whiteboardId,
    obj_type,
    authorization
  }) {
    // Create an object containing the upload data.
    const data = {
      left,
      top,
      url,
      userId,
      userNo,
      whiteboardId,
      obj_type,
      authorization
    };

    // Initiate the image upload using BoardApi.
    const uploadImageByUrlResponse: any = await store.dispatch(
      BoardApi.endpoints.uploadImageByUrl.initiate({ options: data })
    );

    // Create a widget object based on the upload response data.
    let widget = { ...uploadImageByUrlResponse.data, _id: '' };

    widget._id = UtilityService.getInstance().generateWidgetID();

    // Insert the widget using WidgetService.
    WidgetService.getInstance().insertWidget(widget);

    // Define a new state for the canvas to reflect the added widget.
    const newState = {
      newState: widget,
      targetId: widget._id,
      action: 'ADDED'
    };

    // Push the new state to the canvas and render the widget asynchronously.
    canvas.pushNewState([newState]);

    canvas.renderWidgetAsync(widget);

  }

  /**
   * Publishes whiteboard activity to synchronize data with other users.
   * @param {string} whiteboardId - The ID of the whiteboard.
   * @param {object} data - The data representing the activity to be published.
   * @param {boolean} bool - A boolean value indicating whether the activity should be published.
   */
  publishWhiteboardActivity(whiteboardId, data, bool) {
    // Emit a synchronization event using SyncService to share data with other users.
    SyncService.getInstance().emitSyncEvent(whiteboardId, data);
  }

  /**
   * Updates the current board with the provided data.
   * @param {object} data - The data to update the current board with.
   */
  updateCurrentBoard(data) {
    // Check if the data is empty or undefined.
    if (JSON.stringify(data) === '{}' || !data) {
      return;
    }

    // Dispatch an action to initiate an update to the current board using the API.
    store.dispatch(
      // @ts-ignore
      api.endpoints.updateBoardById.initiate({
        id: store.getState().board.board._id,
        data
      })
    );
  }

  /**
   * Updates the current board's timer with the provided data.
   * @param {object} data - The data to update the current board's timer with.
   */
  updateCurrentBoardTimer(data) {
    // Check if the data is empty or undefined.
    if (JSON.stringify(data) === '{}' || !data) {
      return;
    }

    // Dispatch an action to initiate an update to the current board's timer using the API.
    // @ts-ignore
    store.dispatch(api.endpoints.updateBoardTimer.initiate(data));
  }

  /**
   * Asynchronously changes the active board and executes a callback upon success.
   * @param {string} boardId - The ID of the new board to activate.
   * @param {function} cbSuccess - A callback function to execute upon successful board change.
   */
  async changeBoard(boardId, cbSuccess) {
    // Check if the new board ID is different from the current board ID.
    if (boardId !== this.boardId) {
      // Set the new board ID.
      this.boardId = boardId;
    }

    // Execute the success callback.
    cbSuccess();
  }

  /**
   * Asynchronously closes the current board and resets the board ID.
   */
  async closeBoard() {
    // Get the ID of the current board from the store.
    const currBoardId = store.getState().board.boardId;

    // Check if a current board ID exists.
    if (currBoardId) {
      // Dispatch an action to reset the board ID in the store.
      store.dispatch(handleSetBoardId(''));
    }
  }

  /**
   * Asynchronously loads widgets onto the canvas based on widget data for a specific board.
   * @param {object[]} widgetData - An array of widget data to load onto the canvas.
   */
  async loadWidgetByBoardId(widgetData) {
    // const localWidgetObjList = canvas.getObjects() || [];
    // Clear the canvas

    // Clear the canvas to prepare for loading new widgets.
    canvas.clear();

    // Reset the stream data.
    Boardx.Instance.streamData = [];

    // Iterate through the widgets and render them on the canvas.
    const widgets = widgetData;

    widgets.sort((a, b) => a.zIndex > b.zIndex);

    // Iterate through the widgets and render them on the canvas.
    for (const widget of widgets) {
      canvas.renderWidgetAsync({ ...widget });
    }

    // Iterate through the canvas objects for additional adjustments.
    canvas.getObjects().forEach(obj => {

      // Correct arrow coordinates if applicable.
      if (obj.lines && obj.lines.length > 0) {
        canvas.onObjectModifyUpdateArrows(obj);
      }

      // Set mobile-specific rendering properties for certain object types.
      if (
        store.getState().system.currentUIType === 'mobile' &&
        (obj.obj_type !== 'WBFile' || obj.obj_type !== 'WBImage')
      ) {
        obj.selectable = false;
        obj.lockUniScaling = true;
        obj.locked = true;
      }
    });

    // Set a timeout to indicate that there have been changes to the canvas.
    setTimeout(() => {
      canvas.anyChanges = true;
    }, 1000);
  }
}
