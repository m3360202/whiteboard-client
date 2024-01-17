import React, { useEffect, useState } from 'react';

import { styled } from '@mui/material/styles';

//** Import i18n
import { useTranslation } from 'react-i18next';

import ToggleButton from '@mui/material/ToggleButton';
import SpeakerNotesIcon from '../../mui/icons/SpeakerNotesIcon';
import RotateRightIcon from '@mui/icons-material/RotateRight';
import server from '../../startup/serverConnect';
import store from '../../store';


export default function AudioToTextAI(props: any) {

  const { t } = useTranslation();
  const [isShowLoadingIcon, setIsShowLoadingIcon] = useState(false);

  useEffect(() => {
    const object = canvas.getActiveObject();
    if (!object.status || object.status === 'succeeded') {
      setIsShowLoadingIcon(false);
      return;
    }
    setIsShowLoadingIcon(true);
  }, [canvas.getActiveObject()]);

  useEffect(() => {
    if (!isShowLoadingIcon) return;
    let timer = setInterval(() => {
      server.call('ai.getAudioToTextStatus').then(res => {
        if (res === null) {
          clearInterval(timer);
          return;
        }

        res.forEach(item => {
          canvas.updateAudioWidgetStatusAndAddTextWidget(
            item.audioWidget,
            item.textWidget
          );
        });
      }).catch(err => {
        clearInterval(timer);
        setIsShowLoadingIcon(false);
        console.log('getAudioToTextStatus: err', err);
        return;
      });
    }, 10000);
  }, [isShowLoadingIcon]);

  const handleClick = async e => {
    e.preventDefault();
    if (isShowLoadingIcon) {
      Boardx.Util.Msg.info('s' + t('board.menu.audioToTextAi.workTips'));
      return;
    }
    const object = canvas.getActiveObject();

    if (object.src === '') {
      Boardx.Util.Msg.info(
        t('board.menu.audioToTextAi.fileCorruptionTips')
      );
      return;
    }

    const { scaleX, scaleY, backgroundColor, fill, fontFamily, fontSize } =
      canvas.defaultNote;

    let group = null;
    if (canvas.getActiveObjects().length > 1) {
      Boardx.Util.Msg.info(
        t('board.menu.audioToTextAi.selectOneFileForTranscribe')
      );
      return;
    }

    if (!object) {
      return $('#notesMenu').hide();
    }
    setIsShowLoadingIcon(true);

    const currentFile = canvas.getActiveObject();
    let textWidget = {
      type: 'transcription',
      audioUrl: currentFile.fileSrc,
      audioWidgetId: currentFile._id,
      status: '',
      left: currentFile.left + currentFile.width + 210,
      top: currentFile.top,
      userId: store.getState().user.userInfo.userId,
      boardId: currentFile.whiteboardId,
      timestamp: Date.now(),
      text: ''
    };
    server.call('ai.audioToText',
      currentFile.src,
      textWidget).then(res => {
        Boardx.Util.Msg.info(t('widgetAi.pleaseCheckTheResultsLater'));
        currentFile.set('status', 'transcribing');
        currentFile.saveData('MODIFIED', ['status']);
      }).catch(err => {
        Boardx.Util.Msg.warning(err);
        setIsShowLoadingIcon(false);
        return;
      });

  };

  return (
    <div>
      <ToggleButton
        aria-label="bold"
        sx={{
          borderRightWidth: 1,
          width: 40
        }}
        onClick={handleClick}
        selected={false}
        value="transcription"
      >
        {isShowLoadingIcon ? (
          <RotateRightIcon
            className="audioToText-loading-icon"
            style={{ color: '#150D33' }}
          />
        ) : (
          <SpeakerNotesIcon style={{ color: '#150D33' }} />
        )}
      </ToggleButton>
    </div>
  );
}
