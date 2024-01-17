/* eslint-disable no-param-reassign */
/* eslint-disable no-undef */
/* eslint-disable no-await-in-loop */

import * as fabric  from '@boardxus/x-canvas';

import i18n from 'i18next';

//redus store
import store from '../../../store';

//services
import { WidgetService, BoardService, FileService, UtilityService } from '../../../services/index';

//functions
import imageCompression from 'browser-image-compression';

const t = i18n.getFixedT(null, null)

fabric.Canvas.prototype.updateWhiteboardThumbnail = async function () {

  const self = this;

  try {

    // Check if thumbnail exists and user is logged in
    if (!self.thumbnail || !store.getState().user.userInfo.userId) return;

    // The data URL of the thumbnail
    const dataUrl = self.thumbnail;

    // Convert data URL to Blob
    const originalFile = await Boardx.Util.dataURIToBlob(dataUrl);

    // Compression options for the image
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 400,
      useWebWorker: true,
    };

    // Filename of the thumbnail will be the id of the board
    const fileName = store.getState().board.board._id;

    // Compress the image
    const file = await Boardx.Util.compressImage(originalFile, options);
    
    // If no filename, set it to be the id of the board
    if(!file.name) file.name = fileName+'.png';

    
    // Define the path to upload the thumbnail
    const r2UploadPath = UtilityService.getInstance().getr2UploadPath(store.getState().board.board);

    // Upload the thumbnail
    const key = await FileService.getInstance().uploadThumbnailToR2Async(
      r2UploadPath,
      file,
      {
        // progress callback function for upload progress, does nothing for now
        progress() {},
      }
    );

    // The src of the thumbnail will be the key (url) returned from uploadThumbnailToR2Async
    const src = key;

    // Update the current board with the new thumbnail and other related info
    BoardService.getInstance().updateCurrentBoard({
      thumbnail: src,
      lastUpdateTime: Date.now(),
      lastUpdateBy: store.getState().user.userInfo.userId,
      lastUpdateThum: Date.now(),
      lastUpdateByName: store.getState().user.userInfo.userName,
      favorite: false,
    });

  } catch (e) {

    // Log any error that occurs during the update process
    console.error('update whiteboard thumbnail err', e);

  }
  
};

fabric.Canvas.prototype.uploadFilesToWhiteboard = async function (
  files,
  left,
  top,
  useFileName,
) {

  const self = this;

  const userId = store.getState().user.userInfo.userId;



  const whiteboardId = store.getState().board.board._id;

  if (!userId || !whiteboardId) return false;

  if (useFileName === undefined) useFileName = false;

  for (let i = 0; i < files.length; i++) {

    let file = files[i];

    const options = {

      maxSizeMB: 100,
      maxWidthOrHeight: 10240,
      useWebWorker: false,

    };

    if (file.size > options.maxSizeMB * 1024 * 1024) {

      Boardx.Util.Msg.info(t('pages.autoPageUpdateInfo.fileSizeTooBig'));

      break;

    }

    // if the file without file type, then skip uplading this file
    if (file.name.indexOf('.') === -1) {

      break;

    }

    const position = {};

    if (i === 0) {

      position.left = left;

      position.top = top;

      self.addingPhotosleftOffset = 0;

    } else {

      position.left = left + self.addingPhotosleftOffset;

      position.top = top;

    }

    await Boardx.Util.sleep(200);

    // test if the file Image
    if (/^image*/.test(file.type) && file.type.indexOf('heic') < 0) {

      file = await imageCompression(file, options);

      const imageFile = await Boardx.Util.loadImageFromFile(file);

      const { width } = imageFile;

      const { height } = imageFile;

      let board = store.getState().board.board;

      let r2UploadPath = UtilityService.getInstance().getr2UploadPath(board);

      const data = {

        angle: 0,

        scaleX: 1, // 230/width

        scaleY: 1, // 230/width

        userId: userId,

        user_id: Date.now(),

        whiteboardId: whiteboardId,

        timestamp: Date.now(),

        obj_type: 'WBImage',

        left: position.left,

        top: position.top,

        width: imageFile.width,

        height: imageFile.height,

        subObjs: {},

        src: '',

        zIndex: Date.now() * 100,

        _id: UtilityService.getInstance().generateWidgetID()

      };

      let blob = null;

      if (i === 0) {

        self.addingPhotosHeightOffset = 0;

      } else if ((230 / width) * height > self.addingPhotosHeightOffset) {

        self.addingPhotosHeightOffset = (230 / width) * height;

      }

      if (i !== 0 && (i + 1) % 3 === 0) {

        top = top + self.addingPhotosHeightOffset + 10;

        self.addingPhotosHeightOffset = 0;

      }

      if (i % 3 === 2) {

        self.addingPhotosleftOffset = 0;

      } else {

        self.addingPhotosleftOffset = self.addingPhotosleftOffset + 230 + 10;

      }

      data.width = imageFile.width;

      data.height = imageFile.height;

      data.selectable = true;

      data.isUploading = false;

      data.cantRemove = true;

      data.user_id = store.getState().user.userInfo.userId;

      data.src = await imageCompression.getDataUrlFromFile(file);

      const widget = await self.renderImageAsync(data);

      blob = file;

      blob.name = `${file.name}`;

      widget.opacity = 0.2;
      
      const key = await FileService.getInstance().uploadFileToR2inBoard (
        r2UploadPath,
        blob,
        {},
      );

      widget.opacity = 1;

      widget.dirty = true;

      data.src = `${key}`;

      data.cantRemove = false;

      data.isUploading = false;

      data.left = widget.left;

      data.top = widget.top;

      WidgetService.getInstance().insertWidget(data);

      widget.set({
        _id: data._id,
        user_id: data.user_id,
        isUploading: data.isUploading,
        src: data.src
      });

      widget.dirty = true;

      const newState = canvas.findById(widget._id).getUndoRedoState('ADDED');

      newState.targetId = widget._id;

      canvas.pushNewState(newState);

      self.requestRenderAll();

    } else {

      const data = {
        angle: 0,
        scaleX: 1,
        scaleY: 1,
        name: file.name,
        userId: store.getState().user.userInfo.userId,
        user_id: Date.now(),
        whiteboardId: store.getState().board.board._id,
        timestamp: Date.now(),
        obj_type: 'WBFile',
        left: position.left,
        selectable: true,
        top: position.top,
        width: 200,
        height: 230,
        src: '',
        zIndex: Date.now() * 100,
        _id: UtilityService.getInstance().generateWidgetID(),
        previewImage: undefined
      };
      
      if (i === 0) {

        self.addingPhotosHeightOffset = 0;

      } else if (self.addingPhotosHeightOffset < 230) {

        self.addingPhotosHeightOffset = 230;

      }

      if (i !== 0 && (i + 1) % 3 === 0) {

        top = top + self.addingPhotosHeightOffset + 10;

        self.addingPhotosHeightOffset = 0;

      }

      if (i % 3 === 2) {

        self.addingPhotosleftOffset = 0;

      } else {

        self.addingPhotosleftOffset = self.addingPhotosleftOffset + 400 + 10;

      }

      data.cantRemove = false;

      data.isUploading = false;

      delete data.initLeft;

      delete data.initTop;

      data.user_id = store.getState().user.userInfo.userId;


      WidgetService.getInstance().insertWidget(data);

      const widget = await self.renderWidgetAsync(data);

      widget.opacity = 0.2;

      if (file.name.substring(file.name.lastIndexOf('.') + 1) !== 'pdf') {

        widget.name = `Uploading[${file.name}]`;

      }

      let timer = setInterval(() => {

        widget.opacity = 0.1 + widget.opacity;

        if(widget.opacity > 0.9) {

          widget.opacity = 0.2;

        }

        widget.dirty = true;

        canvas.requestRenderAll();

      }, 300)

      const messageTips = Boardx.Util.Msg.info(
        t(
          'pages.autoPageUpdateInfo.pleaseKeepTheWindowOpenToAvoidLosingTheFile'
        ),
        `${t('pages.autoPageUpdateInfo.uploading')} [${file.name}]`,
        {
          timeOut: 0,
          extendedTimeOut: 0
        }
      );

      const r2UploadPath = UtilityService.getInstance().getr2UploadPath(store.getState().board.board);

      const key = await FileService.getInstance().uploadFileToR2Async(
        r2UploadPath,
        file,
        {
          progress() {},
        }
      );

      messageTips.remove();

      Boardx.Util.Msg.success(
        t('pages.autoPageUpdateInfo.uploadSuccess')
      );

      clearInterval(timer);

      widget.opacity = 1;

      if (file.name.substring(file.name.lastIndexOf('.') + 1) !== 'pdf') {

        widget.name = file.name;

      }

      data.src = key;

      data.left = widget.left;

      data.top = widget.top;

      // 将PDF文件首页转换为图片
      if (file.name.substring(file.name.lastIndexOf('.') + 1) === 'pdf') {

        return new Promise(async (resolve, reject) => {

        let newfile = new File(files, file.name);

        let reader = new FileReader();

        reader.readAsDataURL(newfile);

        reader.onload = function () {
        
          let pdfjsLib = window['pdfjs-dist/build/pdf'];

          // base64格式PDF
          var base64Str = reader.result.substring(37);

          var pdfData = atob(base64Str);

          // pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.2.2/pdf.worker.min.js';
          const loadingTask = pdfjsLib.getDocument({ data: pdfData });

          loadingTask.promise.then(function (pdf) {
            var pageNumber = 1;
            pdf.getPage(pageNumber).then(function (page) {
              var viewport = page.getViewport({ scale: 1 });

              const newCanvas = document.createElement('canvas');

              const context = newCanvas.getContext('2d');

              newCanvas.height = viewport.height;

              newCanvas.width = viewport.width;

              const renderContext = {
                canvasContext: context,
                viewport: viewport
              };

              let renderTask = page.render(renderContext);

              renderTask.then(async function () {
                let imgBase64 = newCanvas.toDataURL('image/png');

                let bytes = null;
                newCanvas.height = 453;
                newCanvas.width = 320;
                if (imgBase64.split(',').length > 1) {
                  bytes = window.atob(imgBase64.split(',')[1]);
                } else {
                  bytes = window.atob(imgBase64);
                }

                let ab = new ArrayBuffer(bytes.length);

                let ia = new Uint8Array(ab);

                for (let i = 0; i < bytes.length; i++) {
                  ia[i] = bytes.charCodeAt(i);
                }

                const imgBlob = new Blob([ab], { type: 'image/png' });

                const previewImageFile = new File(
                  [imgBlob],
                  'previewImage.png',
                  {
                    type: 'image/png',
                    lastModified: Date.now()
                  }
                );

                const r2UploadPath =
                  UtilityService.getInstance().getr2UploadPath(
                    store.getState().board.board
                  );

                const src =
                  await FileService.getInstance().uploadFileToR2Async(
                    r2UploadPath,
                    previewImageFile,
                    {
                      progress() {}
                    }
                  );

                data.previewImage = src;
                widget.changeFileImgUrl(src);
                console.log('widget', widget)
                
              }).then(() => {
                widget.set({
                  _id: data._id,
                  user_id: data.user_id,
                  isUploading: false,
                  src: data.src,
                  fileSrc: data.src,
                  previewImage: data.previewImage,
                  width: 320,
                  height: 453
                });
        
                widget.dirty = true;
        
                canvas.requestRenderAll();
        
                const newState = canvas
                  .findById(widget._id)
                  .getUndoRedoState('ADDED');
        
                canvas.pushNewState(newState);
        
                widget.saveData('MODIFIED', [
                  '_id',
                  'user_id',
                  'isUploading',
                  'src',
                  'fileSrc',
                  'previewImage',
                  'width',
                  'height'
                ]);
                   resolve(widget);
              });
            });
          });
        };
      

      

     
        reader.onerror = function (error) {

          console.log('Error: ', error);

        };

        })

      }

      else{

          widget.set({
            _id: data._id,
            user_id: data.user_id,
            isUploading: false,
            src: data.src,
            fileSrc: data.src,
            previewImage: data.previewImage
          });
  
          const newState = canvas.findById(widget._id).getUndoRedoState('ADDED');

          canvas.pushNewState(newState);

          widget.saveData('MODIFIED', [
            '_id',
            'user_id',
            'isUploading',
            'src',
            'fileSrc',
            'previewImage'
          ]);
          self.requestRenderAll();
        
        return widget;
      }
      
    }
  }
};
