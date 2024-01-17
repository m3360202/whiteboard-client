import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import { Typography } from '@mui/material';
import Button from '@mui/material/Button';

import Popover from '@mui/material/Popover';
import Box from '@mui/material/Box';
import LoadingButton from '@mui/lab/LoadingButton';
import { BoardService, UserService, WidgetService, UtilityService, FileService } from '../../../services';
import MenuItem from '@mui/material/MenuItem';

//** Import Redux toolkit
import store, { RootState } from '../../../store';
import { useSelector } from 'react-redux';

import { useTranslation } from 'react-i18next';
import { handleSetShowMoreMenu } from '../../../store/board';
import { handleSetShowTimerPopover } from '../../../store/board/timer';
import { useInsertBoardBackupMutation, useGetBoardBackupQuery, useRestoreBackupMutation } from '../../../redux/BoardAPISlice'
import $ from 'jquery';

export default function ModalBackup({ setSelectMore }) {

  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [insertBoardBackup] = useInsertBoardBackupMutation();
  const [restoreBackup] = useRestoreBackupMutation();
  const [stateList, setStateList] = React.useState([]);

  const handleInsertBoardBackup = async (data) => {
    await insertBoardBackup(data);
  }
  const boardId = useSelector((state: RootState) => state.board.boardId);

  const { data: backupList = [] } = useGetBoardBackupQuery(boardId);
  const [isEmpty, setIsEmpty] = React.useState(false);
  const [saveButtonLoading, setSaveButtonLoading] = useState(false);

  const handleRestoreBackup = async (backupData) => {
    const whiteboardId = store.getState().board.board._id;
    const data = [
      {
        t: 10,
        d: { uno: store.getState().user.userInfo.userNo },
      },
    ];
    Boardx.Util.Msg.info(t('modalbackup.startrestore'), { timeout: 0 });
    await restoreBackup({ whiteboardId, backupData: backupData });

    BoardService.getInstance().publishWhiteboardActivity(
      whiteboardId,
      data,
      false,
    );


    location.reload();

  }
  const handleRestore = (e) => {
    Boardx.Util.Msg.info(
      "<br /><br /><button type='button' id='confirmationRestoreYes' class='btn btn-outline-secondary' style='cursor: pointer; border-width:0px; background-color: #f21d6b; width: 100px; height: 40px; color: white'>" +
      t('board.header.isBackupRestore') +
      '</button>',
      t('board.header.backupRestoreInfo'),
      {
        closeButton: true,
        allowHtml: true,
        onShown(toast) {
          $('#confirmationRestoreYes').click(() => {

            (backupList as any[]).forEach(r => {
              if (r._id === e.target.dataset.id) {
                handleRestoreBackup(r);
              }
            });
          });
        },
        timeOut: 0,
      },
    );
  }
  const backupBoard = async () => {
    setSaveButtonLoading(true);
    Boardx.Util.Msg.info(t('modalbackup.saveBackup'));
    let board = store.getState().board.board;
    const whiteboardId = board._id;
    let image = await BoardService.getInstance().backupBoard();
    const datetime = Date.now();
    const state = WidgetService.getInstance().getWidgetList();
    try {

      const str = JSON.stringify(state);
      let jsonFile: any = new Blob([str], {
        type: 'text/json',
      });
      jsonFile.name = new Date().getTime() + '.json';
      let r2UploadPath = UtilityService.getInstance().getr2UploadPath(board);
      const keyState = await FileService.getInstance().uploadJsonToR2(
        r2UploadPath,
        jsonFile,
        {
          progress(e) { console.log('uploading proress', e) },
        }
      );

      const stateJsonSrc = `${keyState}`;
      const data = {
        createdBy: store.getState().user.userInfo.userId,
        createdTime: datetime,
        thumbnailSrc: image,
        stateJsonSrc: stateJsonSrc,
        boardId: whiteboardId
      };
      await handleInsertBoardBackup(data);
      Boardx.Util.Msg.success(t('modalbackup.pushedbackup'));
      setSaveButtonLoading(false);
    } catch (e) {
      console.error('update whiteboard thumbnail err', e);
    }
  }
  const handleClick = (event) => {
    store.dispatch(handleSetShowTimerPopover(false));
    store.dispatch(handleSetShowMoreMenu(false));
    if (!open) {
      setAnchorEl(document.getElementById('btnShareBoard'));
      setOpen(true);
    } else {
      setAnchorEl(null);
      setOpen(false);
    }
    setSelectMore(false);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpen(false);
    setSelectMore(false);
  };


  useEffect(() => {
    if (!backupList || backupList.length === 0) return;

    const newBackupList = (backupList as any[])
      .map(({ createdTime, ...rest }) => ({
        ...rest,
        createdTime,
        createdTimeString: new Date(createdTime).toLocaleString()
      }))
      .sort((a, b) => b.createdTime - a.createdTime);

    setStateList(newBackupList);
    setIsEmpty((backupList as any[]).length === 0);
  }, [backupList]);

  const id = open ? 'backup-popover' : undefined;

  const handleIsEmptyDOM = () => {
    if (isEmpty) {
      return <Typography> {t('board.header.backupEmpty')} </Typography>;
    }
    return null;
  };

  const handleBackupListDOM = () =>
    stateList?.map((r) => (
      <div key={Math.random()}>
        <div>
          <div style={{
            fontFamily: 'Inter',
            fontStyle: 'normal',
            fontWeight: '400',
            fontSize: '14px',
            lineHeight: '140.62%',
            display: 'inline',
            alignItems: 'center',
            width: '120px',
          }}>{r.createdTimeString}</div>
          <a
            style={{
              color: '#f21d6b',
              backgroundColor: 'white',
              fontSize: 14,
              position: 'relative',
              display: 'inline',
              textDecoration: 'none',
              marginLeft: 10,
            }}
            data-id={r._id}
            href="#"
            onClick={handleRestore}
          >
            {t('board.header.backupRestore')}
          </a>
        </div>
        <div
          style={{
            backgroundImage: `url(${r.thumbnailSrc})`,
            width: '320px',
            height: '200px',
            marginTop: '8px',
            marginBottom: '16px',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover'
          }}
        />
      </div>
    ));

  return (
    <div>
      <MenuItem sx={{
        gutters: {
          paddingTop: '8px',
          paddingBottom: '8px',
        },
      }} onClick={handleClick}>
        {t('board.header.backup')}
      </MenuItem>
      <Popover
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        id={id}
        onClose={handleClose}
        open={open}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        style={{ top: '15px', marginLeft: '50px' }}
      >
        <div id="backupBoardMenu" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          padding: '24px',
          width: '368px',
          height: '542px',
          background: '#FFFFFF',
          boxShadow: '0px 1px 3px 2px #00000014',
          borderRadius: '8px',
          boxSizing: 'border-box',

        }}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box>
              <Typography
                sx={{
                  fontStyle: 'normal',
                  fontFamily: 'Inter',
                  fontSize: '32px',
                  lineHeight: '36px',
                  fontWeight: 500,
                  float: 'left',
                  letterSpacing: '0em',
                }}
                variant="h3"
              >
                {t('board.header.backupBoardBackup')}
              </Typography>
            </Box>
            <Box sx={{ my: '24px', mx: 0 }}>
              <LoadingButton
                sx={{
                  width: '320px',
                  height: '48px',
                }}
                loading={saveButtonLoading}
                color="primary"
                id="btnBackupBoard"
                onClick={backupBoard}
                size="small"
                variant="contained"
              >
                {t('board.header.backupCurrentState')}
              </LoadingButton>

            </Box>
          </Box>

          <Box sx={{
            width: '320px',
            height: 'auto',
            overflow: 'hidden',
          }}>
            <div style={{
              width: '340px',
              height: '375px',
              backgroundColor: 'white',
              overflowX: 'hidden',
              overflowY: 'auto',
            }} id="historyList">
              {handleIsEmptyDOM()}
              {handleBackupListDOM()}
            </div>
          </Box>
        </div>
      </Popover>
    </div>
  );
}
