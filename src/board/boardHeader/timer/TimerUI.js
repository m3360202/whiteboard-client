//Import react
import React from 'react';

import { styled } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import StopIcon from '../../../mui/icons/StopIcon';
import PlusOne from '../../../mui/icons/PlusOne';
import PauseIcon from '../../../mui/icons/PauseIcon';
import PlayIcon from '../../../mui/icons/PlayIcon';

function CircularProgressWithLabel({ value, progressLabel }) {
  return (
    <Box display="inline-flex" position="relative" style={{}}>
      <CircularProgress
        className="timmerBorder"
        bottom={0}
        left={0}
        right={0}
        size={100}
        style={{ position: 'absolute', color: '#F7F6F3' }}
        thickness={4}
        top={0}
        value={100}
        variant="determinate"
      />
      <CircularProgress
        className="timmer"
        bottom={0}
        left={0}
        right={0}
        size={100}
        style={{ color: '#F21D6B' }}
        top={0}
        value={value}
        variant="determinate"
      />
      <Box
        alignItems="center"
        bottom={0}
        display="flex"
        justifyContent="center"
        left={0}
        position="absolute"
        right={0}
        top={0}
      >
        <Typography
          color="textSecondary"
          component="div"
          style={{ fontSize: 20 }}
          variant="caption"
        >
          {progressLabel}
        </Typography>
      </Box>
    </Box>
  );
}

export default function TimerUI({
  progress,
  progressLabel,
  handleClose,
  showCancel,
  handlePlus,
  isPause,
  handlePause,
  handleResume,
}) {


  return (
    <Box sx={{ padding: 2.5}}>
      <CircularProgressWithLabel
        progressLabel={progressLabel}
        value={progress}
      />
      <br />
      <Box
      sx={{ textAlign: 'center',
      paddingTop: 3,}}
        style={{ display: showCancel ? 'block' : 'none' ,  }}
      >
        <div style={{    display: 'flex',
    paddingTop: 10,
    justifyContent: 'space-around'}}>
          <StopIcon
            onClick={handleClose}
            style={{ display: showCancel ? 'block' : 'none', cursor: 'pointer',
            color: '#757575',
            borderRadius: '50%',
            background: '#F7F6F3',
            width: 20,
            height: 20 }}
          />
          <PlayIcon
            onClick={handleResume}
            style={{
              display: showCancel ? (isPause ? 'block' : 'none') : 'none',
              cursor: 'pointer',
            borderRadius: '50%',
            color: '#757575',
            background: '#F7F6F3',
            width: 20,
            height: 20
              
            }}
          />
          <PauseIcon
            onClick={handlePause}
            style={{
              display: showCancel ? (isPause ? 'none' : 'block') : 'none', cursor: 'pointer',
              borderRadius: '50%',
              color: '#757575',
              background: '#F7F6F3',
              width: 20,
              height: 20
            }}
          />
          <PlusOne
            onClick={handlePlus}
            style={{ display: showCancel ? 'block' : 'none', 
            cursor: 'pointer',
            borderRadius: '50%',
            color: '#757575',
            background: '#F7F6F3',
            width: 20,
            height: 20 }}
          />
        </div>
      </Box>
    </Box>
  );
}