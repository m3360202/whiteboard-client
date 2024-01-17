//** Import react
import React, { useState } from 'react';
import { styled } from '@mui/material/styles';

//** Import i18n
import { useTranslation } from 'react-i18next';

//** Import Redux kit
import store, { RootState } from '../../../store';

import { useSelector, useDispatch } from 'react-redux';
import { changeMode } from '../../../store/mode';
import { handleSetAiToolBar } from '../../../store/domArea';
import { handleSetShowChatAiMaskingLayer } from '../../../store/AIAssist';

//** Import Material UI
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import RotateRightIcon from '@mui/icons-material/RotateRight';
import Popover from '@mui/material/Popover';

//** Import MUI Icons
import ChatAIUploadFileIcon from '../../../mui/icons/ChatAIUploadFileIcon';

//**Import Services
import { BoardService, UtilityService, FileService } from '../../../services';
import server from '../../../startup/serverConnect';



function ChatUploadFile(props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [openUploadFilePopover, setOpenUploadFilePopover] = useState(false);
  const [isShowuploadFileLoading, setIsShowuploadFileLoading] = useState(false);

  const board = useSelector((state: RootState) => state.board.board);
  const roomInfo = useSelector((state: RootState) => state.room.roomInfo);
  const orgInfo = useSelector((state: RootState) => state.org.orgInfo);
  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  const chatSessionList = useSelector(
    (state: RootState) => state.AIAssist.chatSessionList
  );

  const currentChatSession: any = useSelector(
    (state: RootState) => state.AIAssist.currentChatSession
  );

  const handleClickOpenPopover = () => {
    setOpenUploadFilePopover(true);
    dispatch(handleSetShowChatAiMaskingLayer(true));
  };

  const handleClosePopover = () => {
    setOpenUploadFilePopover(false);
    dispatch(changeMode('default'));
    dispatch(handleSetAiToolBar(false));
    dispatch(handleSetShowChatAiMaskingLayer(false));
  };

  const handleClickUploadFile = async event => {
    event.preventDefault();
    const files = event.target.files;

    if (files.length > 1) {
      (document as any).getElementById('chaiAIUploadFile').value = '';
      alert('Please select a single file to upload!');
      return;
    }

    setIsShowuploadFileLoading(true);

    const r2UploadPath = UtilityService.getInstance().getr2UploadPath(
      store.getState().board.board
    );

    const key = await FileService.getInstance().uploadFileToR2Async(
      r2UploadPath,
      files[0],
      {
        progress(ee) { }
      }
    );

    const uploadFileData = {
      fileName: files[0].name,
      fileSize: files[0].size,
      fileType: files[0].type,
      fileUrl: key
    };

    const msgType = 'file';

    server
      .call(
        'ai.SendUserChat',
        'record',
        currentChatSession,
        msgType,
        uploadFileData
      )
      .then(result => {
        console.warn('result', result);
      })
      .catch(err => {
        console.log(err);
        setIsShowuploadFileLoading(false);
        handleClosePopover();
      });
  };

  return (
    <Box>
      <IconButton
        id="ChatAIUploadFileBtn"
        sx={{
          width: '32px',
          height: '32px',
          cursor: 'pointer',
          padding: 0,
          marginLeft: '4px'
        }}
        onClick={handleClickOpenPopover}
      >
        <ChatAIUploadFileIcon />
      </IconButton>

      <Popover
        open={openUploadFilePopover}
        onClose={handleClosePopover}
        anchorEl={document.getElementById('ChatAIUploadFileBtn')}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        sx={{

        }}
      >
        <Box
          sx={{
            width: '215px',
            maxHeight: '124px',
            padding: '8px 0'
          }}
        >
          <MenuItem sx={{
            padding: '6px 18px',
            overflow: 'hidden'
          }}>
            {isShowuploadFileLoading ? (
              <IconButton sx={{ width: '100%', height: '100%', p: 0 }}>
                <RotateRightIcon className="chatAiUploadFile-loading-icon" />
              </IconButton>
            ) : (
              <Typography sx={{
                fontSize: '16px',
                fontWeight: 400,
                lineHeight: '24px',
                textAlign: 'left',
                color: 'rgba(58, 53, 65, 0.87)'
              }}>
                Upload File
              </Typography>
            )}

            <input
              style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                opacity: 0,
                cursor: 'pointer',
                left: '0px',
                lineHeight: 7
              }}
              id="chaiAIUploadFile"
              multiple
              name="chaiAIUploadFile"
              onChange={handleClickUploadFile}
              type="file"
              accept=".pdf,.PDF,.docx,.DOCX"
            />
          </MenuItem>
        </Box>
      </Popover>
    </Box>
  );
}

export default ChatUploadFile;
