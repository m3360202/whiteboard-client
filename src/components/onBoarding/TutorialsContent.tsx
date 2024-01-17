//** Import react
import React from 'react';

//** Import Mui
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import Button from '@mui/lab/LoadingButton';

//** Import i18n
import i18n from 'i18next';

const style = {
  imagesBoxStyle: {
    position: 'relative',
    p: 0,
    width: '100%',
    height: '265px',
    borderRadius: '6px 6px 0px 0px',
    overflow: 'hidden'
  },
};
const t = i18n.getFixedT(null, null)

export const boardSteps = [
  {
    selector: '[data-tut="reactour__miniMap"]',
    content: ({ goTo, close }) => (
      <div>
        <Box sx={{ ...style.imagesBoxStyle }}>
          <img
            src="/images/tutorial/reactour_miniMap.gif"
            style={{
              width: '370px',
              height: '248px',
              position: 'absolute',
              left: '-20px'
            }}
            alt=""
          />
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
            onClick={() => {
              close();
            }}
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
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            rowGap: 2,
            padding: '0 20px'
          }}
        >
          <Box sx={{ mt: '10px' }}>
            <Typography
              style={{
                fontSize: '20px',
                fontWeight: 500,
                color: 'rgba(58, 53, 65, 0.87)'
              }}
            >
              {t('components.boardTutorial.tutorial.oneTitle')}
            </Typography>
          </Box>
          <Box sx={{ mt: '-16px' }}>
            <Typography
              style={{
                fontWeight: 400,
                fontSize: '14px',
                color: 'rgba(58, 53, 65, 0.68)',
                marginTop:'14px'
              }}
            >
              {t('components.boardTutorial.tutorial.oneContent')}
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              columnGap: 4
            }}
          >
            <img
              style={{ width: '52px', height: '52px' }}
              src="/images/tutorial/tutorial_pinch.png"
              alt=""
            />
            {t('components.boardTutorial.tutorial.or')}
            <img
              style={{ width: '52px', height: '52px' }}
              src="/images/tutorial/tutorial_mouse.png"
              alt=""
            />
          </Box>
        </Box>
        <Button
          color="primary"
          fullWidth
          onClick={() => goTo(1)}
          style={{
            height: 'unset',
            padding: '4px 13px',
            backgroundColor: '#F21D6B',
            boxShadow: '0px 4px 8px -4px rgba(58, 53, 65, 0.42)',
            borderRadius: '5px',
            color: '#FFFFFF',
            position: 'absolute',
            right: '16px',
            bottom: '16px',
            fontSize: '13px'
          }}
        >
          {t('components.boardTutorial.tutorial.next')}
        </Button>
        <svg
          width="12"
          height="30"
          viewBox="0 0 12 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ position: 'absolute', left: '65%', bottom: '-30px' }}
        >
          <path
            d="M6 29.3333C8.94552 29.3333 11.3333 26.9455 11.3333 24C11.3333 21.0545 8.94552 18.6667 6 18.6667C3.05448 18.6667 0.666667 21.0545 0.666667 24C0.666667 26.9455 3.05448 29.3333 6 29.3333ZM7 24L7 -1.02917e-06L5 -1.1166e-06L5 24L7 24Z"
            fill="#F21D6B"
          />
        </svg>
      </div>
    ),
    position: 'top'
  },
  {
    selector: '[data-tut="reactour__pan"]',
    content: ({ goTo, close }) => (
      <div>
        <Box sx={{ ...style.imagesBoxStyle }}>
          <img
            src="/images/tutorial/reactour_pan.gif"
            style={{
              width: '384px',
              height: '248px',
              position: 'absolute',
              left: '-27px'
            }}
            alt=""
          />
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
            onClick={() => {
              close();
            }}
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
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            rowGap: 2,
            padding: '0 20px'
          }}
        >
          <Box sx={{ mt: '10px' }}>
            <Typography
              style={{
                fontSize: '20px',
                fontWeight: 500,
                color: 'rgba(58, 53, 65, 0.87)'
              }}
            >
              {t('components.boardTutorial.tutorial.twoTitle')}
            </Typography>
          </Box>
          <Box sx={{ mt: '-16px' }}>
            <Typography
              style={{
                fontWeight: 400,
                fontSize: '14px',
                color: 'rgba(58, 53, 65, 0.68)'
              }}
            >
              {t('components.boardTutorial.tutorial.twoContent')}
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              columnGap: 4,
              alignItems: 'center',
              justifyContent: 'flex-start'
            }}
          >
            <img
              style={{ width: '52px', height: '52px' }}
              src="/images/tutorial/tutorial_swipe.png"
              alt=""
            />
            {t('components.boardTutorial.tutorial.or')}
            <img
              style={{ height: '52px' }}
              src="/images/tutorial/tutorial_frame.png"
              alt=""
            />
          </Box>
        </Box>
        <Button
          color="primary"
          fullWidth
          onClick={() => goTo(2)}
          style={{
            height: 'unset',
            padding: '4px 13px',
            backgroundColor: '#F21D6B',
            boxShadow: '0px 4px 8px -4px rgba(58, 53, 65, 0.42)',
            borderRadius: '5px',
            color: '#FFFFFF',
            position: 'absolute',
            right: '16px',
            bottom: '16px',
            fontSize: '13px'
          }}
        >
          {t('components.boardTutorial.tutorial.next')}
        </Button>
        <svg
          width="12"
          height="30"
          viewBox="0 0 12 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ position: 'absolute', left: '12%', bottom: '-30px' }}
        >
          <path
            d="M6 29.3333C8.94552 29.3333 11.3333 26.9455 11.3333 24C11.3333 21.0545 8.94552 18.6667 6 18.6667C3.05448 18.6667 0.666667 21.0545 0.666667 24C0.666667 26.9455 3.05448 29.3333 6 29.3333ZM7 24L7 -1.02917e-06L5 -1.1166e-06L5 24L7 24Z"
            fill="#F21D6B"
          />
        </svg>
      </div>
    ),
    position: 'top'
  },
  {
    selector: '[data-tut="reactour__note"]',
    content: ({ close }) => (
      <div>
        <Box sx={{ ...style.imagesBoxStyle }}>
          <img
            src="/images/tutorial/reactour_note.gif"
            style={{
              width: '428px',
              height: '248px',
              position: 'absolute',
              left: '-49px'
            }}
            alt=""
          />
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
            onClick={() => {
              close();
            }}
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
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            rowGap: 2,
            padding: '0 20px'
          }}
        >
          <Box sx={{ mt: '10px' }}>
            <Typography
              style={{
                fontSize: '20px',
                fontWeight: 500,
                color: 'rgba(58, 53, 65, 0.87)'
              }}
            >
              {t('components.boardTutorial.tutorial.threeTitle')}
            </Typography>
          </Box>
          <Box sx={{ mt: '-16px' }}>
            <Typography
              style={{
                fontWeight: 400,
                fontSize: '14px',
                color: 'rgba(58, 53, 65, 0.68)'
              }}
            >
              {t('components.boardTutorial.tutorial.threeContent')}
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              columnGap: 4,
              alignItems: 'center'
            }}
          >
            <img
              style={{ width: '52px', height: '52px' }}
              src="/images/tutorial/tutorial_note.png"
              alt=""
            />
            {t('components.boardTutorial.tutorial.or')}
            <img
              style={{ width: '52px', height: '52px' }}
              src="/images/tutorial/tutorial_S_Key.png"
              alt=""
            />
          </Box>
        </Box>
        <Button
          color="primary"
          fullWidth
          onClick={() => {
            close();
          }}
          style={{
            height: 'unset',
            padding: '4px 13px',
            backgroundColor: '#F21D6B',
            boxShadow: '0px 4px 8px -4px rgba(58, 53, 65, 0.42)',
            borderRadius: '5px',
            color: '#FFFFFF',
            position: 'absolute',
            right: '16px',
            bottom: '16px',
            fontSize: '13px'
          }}
        >
          {t('components.boardTutorial.tutorial.gotIt')}
        </Button>
        <svg
          width="12"
          height="30"
          viewBox="0 0 12 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ position: 'absolute', left: '12%', bottom: '-30px' }}
        >
          <path
            d="M6 29.3333C8.94552 29.3333 11.3333 26.9455 11.3333 24C11.3333 21.0545 8.94552 18.6667 6 18.6667C3.05448 18.6667 0.666667 21.0545 0.666667 24C0.666667 26.9455 3.05448 29.3333 6 29.3333ZM7 24L7 -1.02917e-06L5 -1.1166e-06L5 24L7 24Z"
            fill="#F21D6B"
          />
        </svg>
      </div>
    ),
    position: 'top'
  }
];
