import React from 'react';
import { styled } from '@mui/material/styles';
import PublishOutlinedIcon from '@mui/icons-material/PublishOutlined';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import FileUploadIcon from '../svg/fileUpload';
import { FileService } from '../../services';
import $ from 'jquery';


export default function MenuFileTouch({ handleClose, ...props }) {
  const [open, setOpen] = React.useState(false);


  async function addImageConfirmClickListener(e) {
    e.preventDefault();
    handleClose();
    // Disable the current target element
    e.currentTarget.setAttribute('disabled', 'true');

    // Retrieve files from the element with ID 'myfile2'
    const myfile2 = document.getElementById('myfile2');
    const files = myfile2 ? myfile2.files : null;

    // Calculate the center position relative to the 'canvasContainer' element
    const windowEl = window;
    const cvsContainer = document.getElementById('canvasContainer');
    if (cvsContainer) {
      const cvsOffset = cvsContainer.getBoundingClientRect();
      let left = windowEl.innerWidth / 2 - cvsOffset.left;
      let top = windowEl.innerHeight / 2 - cvsOffset.top;
    }


    const position = canvas.getPositionOnCanvas(left, top);

    left = position.left;
    top = position.top;

    const currentWidget = await canvas.uploadFilesToWhiteboard(files, left, top);

    if (currentWidget) {
      FileService.getInstance().readContentFromFileAsync(currentWidget);

    }
    // Clear the value of the element with ID 'myfile2'
    // var myfile2 = document.getElementById('myfile2');
    if (myfile2) {
      myfile2.value = '';
    }

    // Set the inner HTML of the element with ID 'fileContainer'
    var fileContainer = document.getElementById('fileContainer');
    if (fileContainer) {
      fileContainer.innerHTML = `
        <input
            multiple
            style='display: none'
            id="myfile2"
            type="file"
        />`;
    }

    // Re-query the DOM for the new 'myfile2' element and add the 'change' event listener
    var newMyfile2 = document.getElementById('myfile2');
    if (newMyfile2) {
      newMyfile2.addEventListener('change', addImageConfirmClickListener);
    }

    canvas.discardActiveObject();
    canvas.lockObjectsInCanvas();
  }

  const id = open ? 'menufile-popover' : undefined;
  return (
    <div>
      <div id="fileContainer">
        <input
          accept="image/*"
          id="myfile2"
          multiple
          onChange={addImageConfirmClickListener}
          style={{ display: 'none' }}
          type="file"
        />
      </div>
      <label htmlFor="myfile2">
        <SpeedDialAction
          component="span"
          icon={<FileUploadIcon />}
          tooltipTitle="Upload"
          {...props}
        ></SpeedDialAction>
      </label>
    </div>
  );
}
