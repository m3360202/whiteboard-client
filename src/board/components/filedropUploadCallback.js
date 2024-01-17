import { BoardService, FileService } from '../../services';
import { useTranslation } from 'react-i18next';
import $ from 'jquery';
import i18n from 'i18next';

const t = i18n.getFixedT(null, null);

// main function, it is asynchronous because it may have to wait for files to be read/processed
export default async function filedropUploadCallback(
  files,     // array of files to be uploaded
  webItems, // optional array of HTML objects to be processed
  url,      // optional URL parameter
  position, // optional position parameter (coordinates where to place uploaded items on the canvas)
) {
  
  
  // Set canvas opacity to 1 (fully opaque, ie. visible)
  $('#canvasContainer').css('opacity', 1);
  
  // If user is drawing, abort function.
  if (canvas.isDrawingMode) {
    return;
  }
  
  // Processing files
  if (files.length > 0) {
    // Obtain and print message about the number of files to be uploaded.
    const prefix = t('board.filedrop.startuploadfile');
    const suffix =
      files.length == 1
        ? t('board.filedrop.file')
        : t('board.filedrop.files');
    Boardx.Util.Msg.info(`${prefix} ${files.length} ${suffix}`);
    
    // Calculate position on the canvas to place the uploaded files
    const positionOnCanvas = canvas.getPositionOnCanvas(
      position.left,
      position.top,
    );

    // Upload files to the whiteboard at specified position
    const currentWidget = await canvas.uploadFilesToWhiteboard(
      files,
      positionOnCanvas.left,
      positionOnCanvas.top,
    );

    setTimeout(() => {
      if(currentWidget && currentWidget.obj_type === 'WBFile' && currentWidget.name.indexOf('.pdf')>-1){

        currentWidget.set({width:320,height:453,previewImage:currentWidget.previewImage});
        canvas.renderAll();

    }
    }, 2000);
    
    // If file content is readable, read it asynchronously
    if (currentWidget) {
      FileService.getInstance().readContentFromFileAsync(currentWidget);
    }
    return;
  }

  // Processing HTML items dragged and dropped from the web
  if (webItems.length > 0) {
    // Calculate position on the canvas to place the dropped items
    position = canvas.getPositionOnCanvas(position.left, position.top);
    
    // Loop through all dropped items
    for (let i = 0; i < webItems.length; i++) {
      // If the item is an image, upload it to the whiteboard
      if (webItems[i].tagName === 'IMG') {
        BoardService.getInstance().uploadImageByUrl({
          left: position.left,
          top: position.top,
          url: webItems[i].dataset.src,
          userId: store.getState().user.userInfo.userId,
          userNo: store.getState().user.userInfo.userNo,
          whiteboardId: store.getState().board.board._id,
          obj_type: 'WBImage',
        });
      }
    }
  }
}