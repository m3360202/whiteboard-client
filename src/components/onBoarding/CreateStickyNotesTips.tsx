//** Import react
import React, { useEffect, useState } from 'react';

import { styled } from '@mui/material/styles';

//** Import i18n
import { useTranslation } from 'react-i18next';

//** Import Redux toolkit
import store, { RootState } from '../../store';
import { useSelector, useDispatch } from 'react-redux';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Popper from '@mui/material/Popper';

//** Import services
import { BoardService } from '../../services';

const PREFIX = 'CreateStickyNotesTips';

const classes = {
  tipsPopper: `${PREFIX}-tipsPopper`
};

const StyledPopper = styled(Popper)((
  { theme }
) => ({
  [`&.${classes.tipsPopper}`]: {
    width: '330px',
    height: '88px',
    boxSizing: 'border-box',
    backgroundColor: '#424242',
    boxShadow: '0px 4px 8px -4px rgba(58, 53, 65, 0.42)',
    borderRadius: '5px',
    color: '#FFFFFF',
    marginBottom: '18px !important',
    marginLeft: '-10px !important',
    zIndex: 99999,
  }
}));

export default function CreateStickyNotesTips() {
  //use

  const { t } = useTranslation();
  const [isOpenNoteTips, setIsOpenNoteTips] = useState(false);
  const openCreateStickyNoteTips = useSelector((state: RootState) => state.board.openCreateStickyNoteTips);
  let openNoteTipsTimer = null;

  useEffect(() => {
    if (openCreateStickyNoteTips) {
      setIsOpenNoteTips(true);
      localStorage.setItem('openCreateStickyNoteTips', 'true');
    }
  }, [openCreateStickyNoteTips]);

  useEffect(() => {
    if (isOpenNoteTips) {
      openNoteTipsTimer = setTimeout(() => {
        handleCloseNoteTips();
      }, 3000);
    }
  }, [isOpenNoteTips]);

  const handleCloseNoteTips = () => {
    setIsOpenNoteTips(false);
    localStorage.setItem('openCreateStickyNoteTips', 'false');
    clearTimeout(openNoteTipsTimer);
  };

  return (
    <StyledPopper
      id="createStickyNotesTips"
      anchorEl={document.getElementById('supportResourcesContainer')}
      open={isOpenNoteTips}
      className={classes.tipsPopper}
    >
      <Box
        sx={{
          display: 'flex',
          height: '100%',
          alignItems: 'center',
          pl: '20px',
          pr: '24px'
        }}
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 28 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10.884 20.6667H17.1147H10.884ZM14 2V3.33333V2ZM22.4853 5.51467L21.5427 6.45733L22.4853 5.51467ZM26 14H24.6667H26ZM3.33333 14H2H3.33333ZM6.45733 6.45733L5.51467 5.51467L6.45733 6.45733ZM9.28533 18.7147C8.35316 17.7822 7.7184 16.5944 7.4613 15.3012C7.20421 14.008 7.33634 12.6677 7.84097 11.4496C8.34561 10.2315 9.20009 9.19046 10.2964 8.45799C11.3927 7.72553 12.6815 7.33458 14 7.33458C15.3185 7.33458 16.6073 7.72553 17.7036 8.45799C18.7999 9.19046 19.6544 10.2315 20.159 11.4496C20.6637 12.6677 20.7958 14.008 20.5387 15.3012C20.2816 16.5944 19.6468 17.7822 18.7147 18.7147L17.984 19.444C17.5663 19.8618 17.2349 20.3578 17.0089 20.9036C16.7829 21.4495 16.6666 22.0345 16.6667 22.6253V23.3333C16.6667 24.0406 16.3857 24.7189 15.8856 25.219C15.3855 25.719 14.7072 26 14 26C13.2928 26 12.6145 25.719 12.1144 25.219C11.6143 24.7189 11.3333 24.0406 11.3333 23.3333V22.6253C11.3333 21.432 10.8587 20.2867 10.016 19.444L9.28533 18.7147Z"
            stroke="white"
            strokeWidth="2.66667"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <Typography
          sx={{ fontSize: '14px', width: '200px', ml: '15px', mr: '35px' }}
        >
          {t(
            'components.boardTutorial.supportResources.createStickyNotesTips'
          )}
          <span style={{ color: '#F21D6B' }}>
            {t('components.boardTutorial.supportResources.seeMoreTips')}
          </span>
        </Typography>
        <svg
          onClick={handleCloseNoteTips}
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ cursor: 'pointer' }}
        >
          <path
            d="M11.8333 1.34163L10.6583 0.166626L5.99996 4.82496L1.34163 0.166626L0.166626 1.34163L4.82496 5.99996L0.166626 10.6583L1.34163 11.8333L5.99996 7.17496L10.6583 11.8333L11.8333 10.6583L7.17496 5.99996L11.8333 1.34163Z"
            fill="white"
          />
        </svg>
      </Box>
    </StyledPopper>
  );
}