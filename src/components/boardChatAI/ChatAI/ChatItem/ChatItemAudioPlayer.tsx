//** Import react
import React, { useState, useRef } from 'react';

import { styled } from '@mui/material/styles';

//** Import i18n
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';

const PREFIX = 'AudioPlayer';

const classes = {
  audioBtn: `${PREFIX}-audioBtn`,
  audioBtn2: `${PREFIX}-audioBtn2`
};

const StyledBox = styled(Box)({
  [`& .${classes.audioBtn}`]: {
    padding: '0 10px',
    background: '#D3F4F4 !important',
    boxShadow: '0px 1px 3px rgba(58, 53, 65, 0.12)',
    borderRadius: '0px 4px 4px 4px',
    minWidth: '130px',
    height: '38px',
    display: 'flex',
    justifyContent: 'space-between',
    boxSizing: 'border-box',
    color: '#232930 !important'
  },
  [`& .${classes.audioBtn2}`]: {
    padding: '0 10px',
    background: '#D3F4F4 !important',
    boxShadow:
      '0px 2px 1px -1px rgba(58, 53, 65, 0.2), 0px 1px 1px rgba(58, 53, 65, 0.14), 0px 1px 3px rgba(58, 53, 65, 0.12)',
    borderRadius: '0px 8px 8px 8px',
    minWidth: '130px',
    height: '38px',
    display: 'flex',
    justifyContent: 'space-between',
    boxSizing: 'border-box',
    color: '#232930 !important'
  }
});

const ChatItemAudioPlayer = props => {
  const { audioSrc, ChatAIVersions } = props;

  const audioRef: any = useRef(null);
  const { t } = useTranslation();
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState(false);

  const handleLoadedMetadata = () => {
    const { duration } = audioRef.current;
    setDuration(duration);
  };

  //   播放语音
  const handlePlay = () => {
    if (error) {
      Boardx.Util.Msg.warning(t('chatAi.voiceFileIsCorrupted'));
      return;
    }
    audioRef.current.play();
    setIsPlaying(true);
  };

  //   暂停语音
  const handlePause = () => {
    audioRef.current.pause();
    setIsPlaying(false);
  };

  //   继续播放语音
  const handleResume = () => {
    audioRef.current.play();
    setIsPlaying(true);
  };

  //   监测语音播放是否出错
  const handleAudioError = () => {
    setError(true);
  };

  //  监测语音播放是否结束
  const handleEnded = () => {
    setIsPlaying(false);
  };

  return (
    <StyledBox>
      <audio
        ref={audioRef}
        src={audioSrc}
        onLoadedMetadata={handleLoadedMetadata}
        onError={handleAudioError}
        onEnded={handleEnded}
      />
      <Button
        startIcon={!isPlaying ? <PlayArrowIcon /> : <PauseIcon />}
        className={ChatAIVersions === 'desktopChatAI' ? classes.audioBtn : classes.audioBtn2}
        onClick={!isPlaying ? handlePlay : handlePause}
      >
        {Math.round(duration)}“
      </Button>
    </StyledBox>
  );
};

export default ChatItemAudioPlayer;
