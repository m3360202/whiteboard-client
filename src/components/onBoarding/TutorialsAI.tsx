import React, { useEffect, useState } from 'react';

import { styled } from '@mui/material/styles';

//** Import i18n
import { useTranslation } from 'react-i18next';

//** Import Redux toolkit
import { RootState } from '../../store';
import { useSelector, useDispatch } from 'react-redux';
import {
  handleSetOpenAiTutorials,
  handleOpenTutorialSideBar
} from '../../store/sideBar';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Popper from '@mui/material/Popper';
import Button from '@mui/material/Button';

const PREFIX = 'TutorialsAI';

const classes = {
  AiTutorialsPopper: `${PREFIX}-AiTutorialsPopper`,
  gotItButton: `${PREFIX}-gotItButton`
};

const StyledPopper = styled(Popper)((
  { theme }
) => ({
  [`&.${classes.AiTutorialsPopper}`]: {
    boxSizing: 'border-box',
    width: '330px',
    height: '460px',
    background: '#FFFFFF',
    border: '1px solid #F21D6B',
    boxShadow: '0px 2px 10px rgba(58, 53, 65, 0.1)',
    borderRadius: '6px',
    marginBottom: '22px !important',
    marginLeft: '-14px !important',
    overflow: 'hidden',
    position: 'relative',
    zIndex: 99999
  },

  [`& .${classes.gotItButton}`]: {
    height: 'unset',
    padding: '4px 13px',
    backgroundColor: '#F21D6B',
    boxShadow: '0px 4px 8px -4px rgba(58, 53, 65, 0.42)',
    borderRadius: '5px',
    color: '#FFFFFF',
    position: 'absolute',
    left: '16px',
    bottom: '16px'
  }
}));

export default function TutorialsAI() {
  //use

  const dispatch = useDispatch();
  const { t } = useTranslation();
  //slide dom
  const isOpenAiTutorials = useSelector(
    (state: RootState) => state.sideBar.openAiTutorials
  );

  const handleCloseAiTutorials = () => {
    dispatch(handleSetOpenAiTutorials(false));
    if (
      localStorage.getItem('is_onboard') === 'true' &&
      !localStorage.getItem('openLearningCenter')
    ) {
      localStorage.setItem('openLearningCenter', 'true');
      // dispatch(handleOpenTutorialSideBar(true));
    }
  };

  return (
    <StyledPopper
      className={classes.AiTutorialsPopper}
      anchorEl={document.getElementById('miniMapContainer')}
      open={isOpenAiTutorials}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <img
          style={{ width: '328px', height: '248px' }}
          src="/gif/BoardXAI.gif"
          alt=""
        />
        <Typography
          sx={{
            display: 'flex',
            alignItems: 'center',
            mt: '24px',
            ml: '18px',
            mb: '8px',
            color: 'rgba(58, 53, 65, 0.87)'
          }}
          variant="h3"
        >
          {t('components.boardTutorial.tutorial.BoardXAi')}
          <img
            style={{ marginLeft: '8px', width: '31px', height: '31px' }}
            src="/images/tutorial/BoardXAIStar.png"
            alt=""
          />
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
          {t('components.boardTutorial.tutorial.BoardXAiContentOne')}
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
          {t('components.boardTutorial.tutorial.BoardXAiContentTwo')}
        </Typography>
        <Button
          color="primary"
          fullWidth
          style={{
            height: 'unset',
            padding: '4px 13px',
            backgroundColor: '#F21D6B',
            boxShadow: '0px 4px 8px -4px rgba(58, 53, 65, 0.42)',
            borderRadius: '5px',
            color: '#FFFFFF',
            position: 'absolute',
            left: '16px',
            bottom: '16px',
            fontSize: '13px'
          }}
          onClick={handleCloseAiTutorials}
        >
          {t('components.boardTutorial.tutorial.gotIt')}
        </Button>
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
        onClick={handleCloseAiTutorials}
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
    </StyledPopper>
  );
}
