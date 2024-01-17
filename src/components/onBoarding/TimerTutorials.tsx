//** Import react
import React, { useEffect } from 'react';

import { styled } from '@mui/material/styles';

//** Import i18n
import { useTranslation } from 'react-i18next';

//** Import Redux toolkit
import { RootState } from '../../store';
import { useSelector, useDispatch } from 'react-redux';
import { handleSetOpenTimerTutorials } from '../../store/sideBar';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Popper from '@mui/material/Popper';


export default function TimerTutorials() {
  //use

  const dispatch = useDispatch();
  const { t } = useTranslation();
  //slide dom
  const isOpenTimerTutorials = useSelector(
    (state: RootState) => state.sideBar.openTimerTutorials
  );
  let tutorialsTimer = null;

  useEffect(() => {
    if (isOpenTimerTutorials) {
      tutorialsTimer = setTimeout(() => {
        handleCloseTimerTutorials();
      }, 10000);
    }
  }, [isOpenTimerTutorials]);

  const handleCloseTimerTutorials = () => {
    dispatch(handleSetOpenTimerTutorials(false));
    clearTimeout(tutorialsTimer);
  }

  const handleMouseEnterTimerTutorials = () => {
    clearTimeout(tutorialsTimer);
    tutorialsTimer = null;
    dispatch(handleSetOpenTimerTutorials(true));
  };

  const handleMouseLeaveTimerTutorials = () => {
    tutorialsTimer = setTimeout(() => {
      dispatch(handleSetOpenTimerTutorials(false));
      clearTimeout(tutorialsTimer);
    }, 10000);
  };

  return (
    <Popper
      sx={{ boxSizing: 'border-box',
      width: '330px',
      height: '400px',
      background: '#FFFFFF',
      border: '1px solid #F21D6B',
      boxShadow: '0px 2px 10px rgba(58, 53, 65, 0.1)',
      borderRadius: '6px',
      marginBottom: '22px !important',
      marginLeft: '-14px !important',
      overflow: 'hidden',
      position: 'relative',
      zIndex: 99999}}
      anchorEl={document.getElementById('miniMapContainer')}
      open={isOpenTimerTutorials}
      onMouseEnter={handleMouseEnterTimerTutorials}
      onMouseLeave={handleMouseLeaveTimerTutorials}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <img
          style={{ width: '328px', height: '248px' }}
          src="/gif/Timer.gif"
          alt=""
        />
        <Typography
          sx={{
            mt: '24px',
            ml: '18px',
            mb: '8px',
            color: 'rgba(58, 53, 65, 0.87)'
          }}
          variant="h3"
        >
          {t('board.header.timer.timer')}
        </Typography>
        <Typography
          sx={{
            pl: '18px',
            pr: '25px',
            fontSize: '14px',
            color: 'rgba(58, 53, 65, 0.68)'
          }}
          variant="body1"
        >
          {t('board.header.timer.timerTutorial')}
        </Typography>
      </Box>
      <svg
        width="25"
        height="25"
        viewBox="0 0 25 25"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          position: 'absolute',
          top: '14px',
          right: '14px',
          cursor: 'pointer'
        }}
        onClick={handleCloseTimerTutorials}
      >
        <path
          d="M0 6C0 2.68629 2.68629 0 6 0H18.0732C21.3869 0 24.0732 2.68629 24.0732 6V18.0732C24.0732 21.3869 21.3869 24.0732 18.0732 24.0732H6C2.68629 24.0732 0 21.3869 0 18.0732V6Z"
          fill="#3A3541"
          fillOpacity="0.12"
        />
        <path
          d="M19.0579 6.42954L17.6436 5.01524L12.0366 10.6223L6.42954 5.01524L5.01524 6.42954L10.6223 12.0366L5.01524 17.6436L6.42954 19.0579L12.0366 13.4509L17.6436 19.0579L19.0579 17.6436L13.4509 12.0366L19.0579 6.42954Z"
          fill="#3A3541"
          fillOpacity="0.54"
        />
      </svg>
    </Popper>
  );
}