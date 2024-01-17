//** Import react
import React, { useState } from 'react';

import { styled } from '@mui/material/styles';

//** Import Redux kit
import { handleSetOpenResources } from '../../store/sideBar';
import { useDispatch } from 'react-redux';

import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';

//**Import Services
import { BoardService,FileService } from '../../services';
import $ from 'jquery';

export default function SimpleCard({ handleShowClose }) {
  //use
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);


  const handleClose = () => {
    setOpen(false);
  };
  async function addImageConfirmClickListener(e) {
    e.preventDefault();
    handleClose();
    $(e.currentTarget).attr('disabled', 'true');

    const  files  = document.getElementById('myfile2').files;
    const windowEl = window;
    const cvs = document.getElementById('canvasContainer');
    let left = windowEl.innerWidth() / 2 - cvs.offsetLeft;
    let top = windowEl.innerHeight() / 2 - cvs.offsetTop;

    const position = canvas.getPositionOnCanvas(left, top);

    left = position.left;
    top = position.top;

    Boardx.Util.Msg.info(t('board.menu.uploadingitem'));
    handleShowClose();
    dispatch(handleSetOpenResources(false));
   const currentWidget = await canvas.uploadFilesToWhiteboard(files, left, top);
    if (currentWidget) {
      FileService.getInstance().readContentFromFileAsync(currentWidget);

   }
  }

  return (
    <div style={{   width: '208px',
    height: '190px',
    borderRadius: '8px',
    border: '1px solid rgba(0,0,0,.15)',
    padding: '6px',}} id="fileUpload2">
      <div style={{ width: '65px',
    height: '67px',
    marginTop: '12px',
    marginLeft: '70px',
    backgroundImage:
      "url(\"data:image/svg+xml,%3Csvg width='65' height='67' viewBox='0 0 65 67' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='25.5' y='0.5' width='39' height='39' rx='9.5' fill='white' stroke='%23908EA5' stroke-dasharray='4 4'/%3E%3Crect x='0.5' y='20.5' width='39' height='39' rx='9.5' fill='white' stroke='%23908EA5'/%3E%3Cpath d='M28.5531 64.3351L28.5605 49.1385L39.7468 59.4247L35.5145 59.6937L34.8012 59.739L35.0883 60.3935L37.1841 65.1711L34.5166 66.3413L32.4208 61.5637L32.1336 60.9091L31.6172 61.4033L28.5531 64.3351Z' fill='black' stroke='white'/%3E%3Cpath d='M44.6464 25.3536C44.8417 25.5488 45.1583 25.5488 45.3536 25.3536L48.5355 22.1716C48.7308 21.9763 48.7308 21.6597 48.5355 21.4645C48.3403 21.2692 48.0237 21.2692 47.8284 21.4645L45 24.2929L42.1716 21.4645C41.9763 21.2692 41.6597 21.2692 41.4645 21.4645C41.2692 21.6597 41.2692 21.9763 41.4645 22.1716L44.6464 25.3536ZM44.5 15L44.5 25L45.5 25L45.5 15L44.5 15Z' fill='black'/%3E%3C/svg%3E\")",
  }}></div>
      <Typography sx={{  fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: '12px',
    lineHeight: '16px',
    marginLeft: '10px',
    color: 'rgba(35, 41, 48, 0.65)',}} gutterBottom>
        {t('board.menu.tipsDragDropFile')}
      </Typography>
      <button style={{ width: '192px',
    height: '40px',
    background: '#f21d6b',
    border: '0px',
    left: '14px',
    borderRadius: '10px',
    margin: '6px',
    top: '0px',
    cursor: 'pointer',
    color: 'white',}}>
        {t('board.menu.fileUpload1')}
      </button>
      <Typography sx={{  fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: '12px',
    lineHeight: '16px',
    marginLeft: '10px',
    color: 'rgba(35, 41, 48, 0.65)',}} gutterBottom>
        {t('board.menu.maxFileSize')}20Mb
      </Typography>
      <input
        style={{ width: '190px',
        height: '40px',
        position: 'absolute',
        left: '14px',
        top: '123px',
        opacity: 0,
        cursor: 'pointer',
        lineHeight: 7,
        overflow: 'hidden',}}
        data-shape="image"
        id="myfile2"
        multiple
        name="files"
        onChange={addImageConfirmClickListener}
        type="file"
      />
    </div>
  );
}
