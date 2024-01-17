import React, { useState } from 'react';

import { styled } from '@mui/material/styles';

//** Import i18n
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Popper from '@mui/material/Popper';
import Button from '@mui/material/Button';

const PREFIX = 'DashBoardRoomTutorials';

const classes = {
  tutorialsCardPopperOne: `${PREFIX}-tutorialsCardPopperOne`,
  tutorialsCardPopperTwo: `${PREFIX}-tutorialsCardPopperTwo`,
  tutorialsTitle: `${PREFIX}-tutorialsTitle`,
  tutorialsContent: `${PREFIX}-tutorialsContent`,
  nextStepsButtonBox: `${PREFIX}-nextStepsButtonBox`,
  nextStepsButton: `${PREFIX}-nextStepsButton`
};

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const StyledPopperOne = styled(Popper)(({ theme }) => ({
  boxSizing: 'border-box',
  width: '330px',
  marginTop: '16px !important',
  marginLeft: '-28px !important',
  padding: '13px 16px',
  backgroundColor: '#FFFFFF',
  border: '1px solid rgba(145, 85, 253, 0.5)',
  boxShadow: '0px 2px 10px rgba(58, 53, 65, 0.1)',
  borderRadius: '6px',
  position: 'relative',
  zIndex: 99999,

  [`& .${classes.tutorialsTitle}`]: {
    fontWeight: '500',
    fontSize: '20px',
    lineHeight: '32px',
    color: 'rgba(58, 53, 65, 0.87)'
  },

  [`& .${classes.tutorialsContent}`]: {
    marginTop: '2px',
    fontWeight: 400,
    fontSize: '14px',
    lineHeight: '20px',
    color: 'rgba(58, 53, 65, 0.68)'
  },

  [`& .${classes.nextStepsButtonBox}`]: {
    marginTop: '36px',
    display: 'flex',
    justifyContent: 'flex-end'
  },

  [`& .${classes.nextStepsButton}`]: {
    minWidth: 'unset',
    height: '30px',
    fontSize: '13px',
    padding: '0 13px'
  }
}));

const StyledPopperTwo = styled(Popper)(({ theme }) => ({
  boxSizing: 'border-box',
  width: '330px',
  marginTop: '28px !important',
  marginLeft: '-6px !important',
  padding: '13px 16px',
  backgroundColor: '#FFFFFF',
  border: '1px solid rgba(145, 85, 253, 0.5)',
  boxShadow: '0px 2px 10px rgba(58, 53, 65, 0.1)',
  borderRadius: '6px',
  position: 'relative',
  zIndex: 99999,

  [`& .${classes.tutorialsTitle}`]: {
    fontWeight: '500',
    fontSize: '20px',
    lineHeight: '32px',
    color: 'rgba(58, 53, 65, 0.87)'
  },

  [`& .${classes.tutorialsContent}`]: {
    marginTop: '2px',
    fontWeight: 400,
    fontSize: '14px',
    lineHeight: '20px',
    color: 'rgba(58, 53, 65, 0.68)'
  },

  [`& .${classes.nextStepsButtonBox}`]: {
    marginTop: '36px',
    display: 'flex',
    justifyContent: 'flex-end'
  },

  [`& .${classes.nextStepsButton}`]: {
    minWidth: 'unset',
    height: '30px',
    fontSize: '13px',
    padding: '0 13px'
  }
}));

export default function DashBoardRoomTutorials() {
  //use

  const { t } = useTranslation();
  const [tutorialSteps, setTutorialSteps] = useState(0);
  const tutorialStepsOne =
    localStorage.getItem('dashBoardRoomTutorials') &&
    localStorage.getItem('dashBoardRoomTutorials') === 'true' &&
    tutorialSteps === 0;

  const handleCloseTutorialSteps = () => {
    setTutorialSteps(2);
    localStorage.setItem('dashBoardRoomTutorials', 'false');
  };

  return (
    <>
      <StyledPopperOne
        open={Boolean(tutorialStepsOne)}
        className={classes.tutorialsCardPopperOne}
        anchorEl={document.getElementById('id_roomSetting')}
      >
        <svg
          width="11"
          height="34"
          viewBox="0 0 11 34"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ position: 'absolute', left: '93%', top: '-30px' }}
        >
          <path
            d="M5.5 33.3333C8.44552 33.3333 10.8333 30.9455 10.8333 28C10.8333 25.0545 8.44552 22.6667 5.5 22.6667C2.55448 22.6667 0.166667 25.0545 0.166667 28C0.166667 30.9455 2.55448 33.3333 5.5 33.3333ZM6.5 28L6.5 -7.90754e-07L4.5 -8.78176e-07L4.5 28L6.5 28Z"
            fill="#F21D6B"
          />
        </svg>

        <Box>
          <Typography className={classes.tutorialsTitle} variant="h5">
            {t('components.roomTutorial.firstTutorialsTitle')}
          </Typography>
          <Typography className={classes.tutorialsContent}>
            {t('components.roomTutorial.firstTutorialsContent')}
          </Typography>
        </Box>

        <Box className={classes.nextStepsButtonBox}>
          <Button
            variant="contained"
            className={classes.nextStepsButton}
            onClick={() => setTutorialSteps(1)}
          >
            {t('components.roomTutorial.nextSteps')}
          </Button>
        </Box>
      </StyledPopperOne>

      <StyledPopperTwo
        open={tutorialSteps === 1}
        className={classes.tutorialsCardPopperTwo}
        anchorEl={document.getElementById('roomInviteMembersModal')}
      >
        <svg
          width="11"
          height="34"
          viewBox="0 0 11 34"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ position: 'absolute', left: '50%', top: '-30px' }}
        >
          <path
            d="M5.5 33.3333C8.44552 33.3333 10.8333 30.9455 10.8333 28C10.8333 25.0545 8.44552 22.6667 5.5 22.6667C2.55448 22.6667 0.166667 25.0545 0.166667 28C0.166667 30.9455 2.55448 33.3333 5.5 33.3333ZM6.5 28L6.5 -7.90754e-07L4.5 -8.78176e-07L4.5 28L6.5 28Z"
            fill="#F21D6B"
          />
        </svg>

        <Box>
          <Typography className={classes.tutorialsTitle} variant="h5">
            {t('components.roomTutorial.secondTutorialsTitle')}
          </Typography>
          <Typography className={classes.tutorialsContent}>
            {t('components.roomTutorial.secondTutorialsContent')}
          </Typography>
        </Box>
        <Box className={classes.nextStepsButtonBox}>
          <Button
            variant="contained"
            className={classes.nextStepsButton}
            onClick={handleCloseTutorialSteps}
          >
            {t('components.roomTutorial.nextSteps')}
          </Button>
        </Box>
      </StyledPopperTwo>
    </>
  );
}
