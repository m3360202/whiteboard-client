import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { useTranslation } from 'react-i18next';
//** Import Redux kit
import store,{  RootState } from '../store';
import { handleSetVideoUrl } from '../store/resource';
import { useSelector, useDispatch } from 'react-redux';

import ClipboardService from '../services/ClipboardService';

export default function VideoDialog() {
  const videoUrl = useSelector((state: RootState) => state.resource.videoUrl);
  const videoOpened = videoUrl?true:false;
  const { t } = useTranslation();
  const handleClose = () => {
    store.dispatch(handleSetVideoUrl(null));
  };
  const handleClick = () => {
    let videoContent = videoUrl; //.replace('boardx.oss-accelerate.aliyuncs.com', 'file.boardx.us');
    ClipboardService.getInstance().clipboardCopy(videoContent);
    Boardx.Util.Msg.info(
      t('components.connectionNotification.youHaveCopiedShareLink'),
    );
  };

  return (
    <div style={{ maxWidth: '800px' }}>
      <Dialog
        aria-labelledby="simple-dialog-title"
        maxWidth="md"
        onClose={handleClose}
        open={videoOpened}
      >
        <video autoPlay controls loop playsInline width="800">
          <source src={videoUrl} type="video/mp4" />
          Sorry, your browser doesn't support embedded videos.
        </video>
        <div
          style={{
            display: 'flex',
            padding: '10px',
            justifyContent: 'flex-end',
          }}
        >
          <Button
            color="primary"
            onClick={handleClick}
            size="small"
            style={{ margin: '5px' }}
            variant="contained"
          >
            {t('pages.authPageJoin.copyShareLink')}
          </Button>
          <Button
            href={videoUrl}
            size="small"
            style={{ margin: '5px' }}
            variant="contained"
          >
            {t('pages.authPageJoin.downloadVideo')}
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
