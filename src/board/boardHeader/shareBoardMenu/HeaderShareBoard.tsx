//**Import React */
import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

//** Import Redux kit
import store, { RootState } from '../../../store';
import { useSelector, useDispatch } from 'react-redux';
import { handleSetShare } from '../../../store/permission';
import { handleSetTimerIconColorOn, handleSetShowTimerPopover } from '../../../store/board/timer';
import { useUpdateBoardByIdMutation } from '../../../redux/BoardAPISlice';

//**Import i18n */
import { useTranslation } from 'react-i18next';

import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Popover from '@mui/material/Popover';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Collapse from '@mui/material/Collapse';
import { ColorizeSharp, ConstructionOutlined } from '@mui/icons-material';

//**Import Services */
import { SyncService, BoardService, UserService, ClipboardService } from '../../../services';

//**Import Components */
import __ from 'underscore';
import QRCode from 'qrcode';
import $ from 'jquery';


export default function ShareBoard() {
  //use
  const dispatch = useDispatch();
  const history = useHistory();

  const { id } = useParams<any>();
  const { t } = useTranslation();

  //board
  const boardId = id;
  const board = useSelector((state: RootState) => state.board.board);
  //org
  const orgInfo = useSelector((state: RootState) => state.org.orgInfo);

  //room
  const currentRoomName = useSelector(
    (state: RootState) => state.room.currentRoomName
  );

  //permission
  const disabledShareSelect = useSelector(
    (state: RootState) => state.permission.disabledShareSelect
  );
  const blockRoom = useSelector(
    (state: RootState) => state.permission.blockRoom
  );
  const share = useSelector((state: RootState) => state.permission.share);

  //dom hooks
  const [inviteLink, setInviteLink] = useState('');
  const [showQr, setShowQr] = useState(false);
  const [qrCodeInfo, setQrCodeInfo] = useState(
    t('board.header.shareBoard.showQRCode')
  );
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const oid = open ? 'share-popover' : undefined;

  const [updateBoardById] = useUpdateBoardByIdMutation();

  const handleShowQR = () => {
    if (!showQr) {
      setShowQr(true);
      setQrCodeInfo(t('board.header.shareBoard.hiddenQRCode'));
      return;
    }
    handleHiddenQR();
  };

  const handleHiddenQR = () => {
    setShowQr(false);
    setQrCodeInfo(t('board.header.shareBoard.showQRCode'));
  };

  const handleClick = event => {
    store.dispatch(handleSetShowTimerPopover(false));
    store.dispatch(handleSetTimerIconColorOn(false));
    if (!open) {
      setAnchorEl(event.currentTarget);
      setOpen(true);
      setTimeout(() => {
        initializeQRCode();
      }, 500);

      const whiteboardId =
        store.getState().board.board._id;
      const uno = store.getState().user.userInfo.userNo;
      const re = false;
      const data = [
        {
          t: 6,
          d: {
            uno,
            totalSeconds: 0,
            currentSeconds: 0,
            pause: false,
            re
          }
        }
      ];
      SyncService.getInstance().emitSyncEvent(whiteboardId, data);
      $('#backup-popover').hide();
    } else {
      setAnchorEl(null);
      setOpen(false);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpen(false);
    handleHiddenQR();
  };

  const handleCopy = () => {
    ClipboardService.getInstance().clipboardCopy(inviteLink);
    Boardx.Util.Msg.info(
      t('components.connectionNotification.youHaveCopiedShareLink')
    );
  };

  const initializeQRCode = () => {
    let href = '';
    let viewportTransform = [];

    canvas.viewportTransform.forEach(r => {
      viewportTransform.push(r !== 0 ? r.toFixed(2) : 0);
    });

    href = `http://${location.host}${location.pathname}?vpt=${viewportTransform}`;

    QRCode.toCanvas(document.getElementById('qrCode'), href, error => {
      if (error) {
        console.error(error);
      }
    });

    setInviteLink(href);
    $('#qrCode').css('width', '270').css('height', '270');
  };

  const handlePermission = async (e) => {
    e.preventDefault();
    dispatch(handleSetShare(e.target.value));
    await updateBoardById({
      id: boardId,
      data: {
        permission: e.target.value
      }
    });
  };

  return (
    <Box>
      <Button
        sx={{   height: 30,
          width: 70,
          marginLeft: 2,
          marginRight: 1}}
        color="primary"
        id="btnShareBoard"
        onClick={handleClick}
        variant="contained"
      >
        {t('board.header.shareBoard.shareBoard')}
      </Button>

      <Popover
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        sx={{ paper: {  marginTop: '27px'} }}
        id={oid}
        onClose={handleClose}
        open={open}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
      >
        <Collapse in={showQr} orientation="vertical" collapsedSize="230px">
          <Box
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              padding: '24px',
              width: '484px',
              height: 'auto',
              boxSizing: 'border-box',
              background: '#FFFFFF',
              boxShadow: '0px 1px 3px 2px #00000014',
              borderRadius: '8px'
            }}
            id="shareBoardMenu"
          >
            <Typography
              variant="h2"
              style={{
                position: 'static',
                width: '261px',
                height: '34px',
                left: '16px',
                top: '16px',
                fontFamily: 'Inter',
                fontStyle: 'normal',
                fontWeight: 500,
                fontSize: '28px',
                lineHeight: '34px',
                color: '#232930',
                flex: 'none',
                order: 0,
                flexGrow: 0,
                margin: '0px 0px 22px 0px'
              }}
            >
              {t('board.header.shareBoard.shareBoardTitle')}
            </Typography>
            <Box>
              <Select
                style={{
                  display: 'inline-block',
                  borderWidth: 0,
                  color: '#232930',
                  fontFamily: 'Inter',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  fontSize: '16px'
                }}
                disabled={disabledShareSelect}
                id="permission"
                onChange={handlePermission}
                value={share}
                input={<BootstrapInput />}
                IconComponent={KeyboardArrowDownIcon}
                autoWidth
              >
                <MenuItem value="all">
                  {t('board.header.shareBoard.accessAll')}
                </MenuItem>
                {board && board.orgId && (
                  <MenuItem value="org">
                    {t('board.header.shareBoard.accessMemberOrgFront') +
                      orgInfo.name +
                      t('board.header.shareBoard.accessMemberOrgBack')}
                  </MenuItem>
                )}
                {board && board.roomId && board.roomId !== 'none' && (
                  <MenuItem style={{ display: blockRoom }} value="room">
                    {t('board.header.shareBoard.accessMemberRoomFront') +
                      currentRoomName +
                      t('board.header.shareBoard.accessMemberRoomBack')}
                  </MenuItem>
                )}
              </Select>
            </Box>

            <Box
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
                alignItems: 'center',
                marginTop: '14px'
              }}
            >
              <Typography
                style={{
                  margin: 0,
                  fontSize: '14px',
                  color: 'rgba(35, 41, 48, 0.65)',
                  flex: 1,
                  maxWidth: '310px',
                  maxHeight: '42px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical'
                }}
              >
                {inviteLink.replace(/^https?\:\/\//i, '')}
              </Typography>
              <Button
                style={{
                  fontSize: '16px',
                  height: '32px',
                  padding: '4px 12px'
                }}
                color="primary"
                id="btnCopyShareLink"
                onClick={handleCopy}
                variant="contained"
              >
                {t('board.header.shareBoard.copyLink')}
              </Button>
            </Box>

            <Typography
              style={{
                fontFamily: 'Inter',
                fontStyle: 'normal',
                fontWeight: '400',
                fontSize: '16px',
                lineHeight: '24px',
                color: '#F21D6B',
                cursor: 'pointer',
                marginTop: '30px',
                userSelect: 'none'
              }}
              onClick={handleShowQR}
            >
              {qrCodeInfo}
            </Typography>
            <canvas style={{ width: '90%'}} id="qrCode" />
          </Box>
        </Collapse>
      </Popover>
    </Box>
  );
}

const BootstrapInput = styled(InputBase)(({ theme }) => ({
  '& .MuiInputBase-input': {
    border: 'none',
    padding: 0
  },
  '& .MuiSelect-icon': {
    color: 'rgba(0, 0, 0, 0.54)',
    // marginTop: '2px'
  }
}));
