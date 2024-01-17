//** Import react
import React, { useState } from 'react';

import { styled } from '@mui/material/styles';

//** Import Redux kit
import store from '../../store';
import { handleSetOpenResources } from '../../store/sideBar';
import { useDispatch } from 'react-redux';

import { useTranslation } from 'react-i18next';
import { TextField, Tooltip } from '@mui/material';
import Button from '@mui/material/Button';

//**Import Services
import UtilityService from '../../services/UtilityService';
import $ from 'jquery';

function addURLConfirmClickListener(e) {
  e.preventDefault();

  let url = $('#URLfile').val();
  const reg =
    /^((http|https|ftp):\/\/)?(\w(\:\w)?@)?([0-9a-z_-]+\.)*?([a-z0-9-]+\.[a-z]{2,6}(\.[a-z]{2})?(\:[0-9]{2,6})?)((\/[^?#<>\/\\*":]*)+(\?[^#]*)?(#.*)?)?$/i;
  const flag = reg.test(url);
  const RegUrl = new RegExp();
  RegUrl.compile('^[A-Za-z]+://[A-Za-z0-9-_]+\\.[A-Za-z0-9-_%&?/.=]+$');
  const flag1 = RegUrl.test(url);
  if (!url) {
    return;
  }
  if (!flag) {
    return $('#URLfile').attr('placeholder', '请输入正确的网址。');
  }
  if (!flag1) {
    url = `http://${url}`;
  }

  const windowEl = $(window);
  const cvsOffset = $('#canvasContainer').offset();
  let left = windowEl.width() / 2 - cvsOffset.left;
  let top = windowEl.height() / 2 - cvsOffset.top;
  if (left < 0) {
    left = 0;
  }
  if (top < 0) {
    top = 0;
  }
  if (left > canvas.width) {
    left = canvas.width;
  }
  if (top > canvas.height) {
    top = canvas.height;
  }
  const position = canvas.getPositionOnCanvas(left, top);
  left = position.left;
  top = position.top;

  UtilityService.getInstance().uploadWebsite(
    store.getState().board.board._id,
    url,
    left,
    top,
  );
  $('#URLfile').val('');
  $('.tools-div .icon.active').click();
}

export default function MenuLink({ handleShowClose }) {
  //use
  const dispatch = useDispatch();

  const { t } = useTranslation();
  
  const onClickSubmit = (e) => {
    addURLConfirmClickListener(e);
    Boardx.Util.Msg.info(t('board.menu.uploadingitem'));
    handleShowClose();
    dispatch(handleSetOpenResources(false));
  };
  return (
    <div>

        <TextField
          id="URLfile"
          type="text"
          onContextMenu={(e) => {
            e.stopPropagation();
          }}
          onPaste={(e) => {
            e.stopPropagation();
          }}
          placeholder={t('board.menu.linkPlaceHolder')}
          sx={{  width: '85%',
          margin: 4,}}
          variant="standard"
        />
        <Button
          variant="contained"
          onClick={onClickSubmit}
          sx={{ color: 'white',
          margin:1,
          border: 0,
          height: 32,
          borderRadius: 1,
          width: 100,
          float: 'right',}}
        >
          {t('board.submit')}
        </Button>
    </div>
  );
}
