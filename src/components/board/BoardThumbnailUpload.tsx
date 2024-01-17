//** Import react
import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';

//** Import i18n
import { useTranslation } from 'react-i18next';

//** Import Redux kit
import { RootState } from '../../store';
import { useSelector, useDispatch } from 'react-redux';
import { handleSetCurrentBoardList, handleSetBoardList } from '../../store/boardList';
import { useUploadThumbnail2toBoardByIdMutation } from '../../redux/RoomAPISlice';

import ListItemText from '@mui/material/ListItemText';
import imageCompression from 'browser-image-compression';
import { UtilityService, FileService } from '../../services';
import { Snackbar } from '@mui/material';

const PREFIX = 'BoardThumbnailUpload';

const classes = {
  myfileInput: `${PREFIX}-myfileInput`
};

const Root = styled('div')((
  {
    theme
  }
) => ({
  [`& .${classes.myfileInput}`]: {
    width: '145px',
    height: '40px',
    position: 'absolute',
    left: '0px',
    top: '0px',
    opacity: 0,
    cursor: 'pointer',
    lineHeight: 7,
    overflow: 'hidden',
  }
}));

export default function BoardThumbnailUpload(props) {
  const { t } = useTranslation();
  const { board, handleClose, getUserIsRevisionBoard } = props;
  //use
  const dispatch = useDispatch();


  const [uploadThumbnail2toBoardById, { isLoading, isError, isSuccess }] =
    useUploadThumbnail2toBoardByIdMutation();

  //boardList
  const boardList = useSelector((state: RootState) => state.boardList.currentBoardList);

  const handleClick = (e) => {
    handleClose();
  };

  const UploadThumbnailToBoard = async function (board, files, useFileName) {
    if (useFileName === undefined) useFileName = false;

     for (let i = 0; i < files.length; i++) {
      let file = files[i];

      const options = {
        maxSizeMB: 20,
        maxWidthOrHeight: 3840,
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

      await Boardx.Util.sleep(200);
      if (/^image*/.test(file.type) && file.type.indexOf('heic') < 0) {
        file = await imageCompression(file, options);
        // const imageFile = await Boardx.Util.loadImageFromFile(file);

        let blob = null;
        blob = file;
        // blob.name = file.name;
        // blob.type = file.type;
        let r2UploadPath =
          UtilityService.getInstance().getr2UploadPath(board);
        const key:any = await FileService.getInstance().uploadFileToR2inBoard(
          r2UploadPath,
          blob,
          {
            progress(e) {
              
            }
          }
        );

        const thumbnail2URL = `${key}`;

        await uploadThumbnail2toBoardById({
          boardId: board._id,
          thumbnail2URL: thumbnail2URL
        });
      }
    }
  };

  const UploadThumbnailConfirmClickListener = async (e) => {
    e.preventDefault();
    handleClose();
    const isRevision = getUserIsRevisionBoard();
    if (isRevision) {
      const { files } = e.target;
      await UploadThumbnailToBoard(board, files, false);
      $('#myfile2').val('');

      $('#fileUpload2').html(` <button style="    width: 285px;
          height: 40px;
          background: #f21d6b;
          border: 0px;
        
          left: 14px;
          border-radius: 10px;
          margin: 6px;
          top: 0px;
          cursor: pointer;
          /* background-color: #f21d6b; */
          color: white;"> 
          upload
        </button>
        <input id="myfile2" name="files" type="file" data-shape="image" class="fileUploader" multiple="" style="width: 285px;height: 45px;position: absolute;left: 14px; top:0px; opacity: 0;cursor: pointer;line-height: 7;overflow: hidden;">`);
      $('.tools-div .icon.active').click();
      return;
    }
    Boardx.Util.Msg.warning(t('pages.listPage.uploadThumbnailFailed'));
  }

  return (
    <Root>
      <Snackbar open={isLoading} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} message={'Uploading...'} />
      <ListItemText
        id="uploadThumbnailMenu"
        onClick={handleClick}
        primary={t('components.board.uploadThumbnail')}
      />

      <input
        data-shape="image"
        id="myfile2"
        multiple
        name="files"
        onChange={UploadThumbnailConfirmClickListener}
        className={classes.myfileInput}
        type="file"
      />
    </Root>
  );
}

BoardThumbnailUpload.propTypes = {
  board: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired,
  getUserIsRevisionBoard: PropTypes.func,
};