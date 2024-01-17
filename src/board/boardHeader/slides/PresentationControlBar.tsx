/* eslint-disable react/button-has-type */
import React, { useEffect } from 'react';
import { styled } from '@mui/material/styles';
//**Import Redux */
import store, { RootState } from '../../../store';
import { useDispatch, useSelector } from 'react-redux';
import { changeMode } from '../../../store/mode';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import $ from 'jquery';
import { handleSetHideBoardUserList, handleSetHideHeader } from '../../../store/board';
import { handleGoToNextSlide, handleGoToPreviousSlide, handleSetPresentationMode, handleSetSlidesMode } from '../../../store/slides';
import { handleSetHideRightSideBar, handleSetHideBoardMenu } from '../../../store/board';
import { useTranslation } from 'react-i18next';


function PresentationControlBar() {

  let dispatch = useDispatch();
  const slides = useSelector((state: RootState) => state.slides.slides);
  const totalSlides = slides.length;
  const currentIndex = useSelector((state: RootState) => state.slides.currentSlideIndex);
  const presentationMode = useSelector((state: RootState) => state.slides.presentationMode);
  const { t } = useTranslation();

  function gotoPreviousSlide() {
    store.dispatch(handleGoToPreviousSlide());
  }

  function gotoNextSlide() {
    store.dispatch(handleGoToNextSlide());
  }
  useEffect(() => {
    if (!slides) return;

    if (slides && slides.length > 0 && presentationMode) {
      gotoCurrentSlide();
    }

  }, [currentIndex, presentationMode]);

  useEffect(() => {
    $(document).on('keydown', slidesKeydownListener);

    return () => {
      $(document).off('keydown', slidesKeydownListener);
    };
  }, []);

  function slidesKeydownListener(e) {
    const presentationMode = store.getState().slides.presentationMode;
    if (e.keyCode > 36 && e.keyCode < 41) {
      if (presentationMode) {
        switch (e.keyCode) {
          case 37:
            gotoPreviousSlide();
            break;
          case 38:
            gotoPreviousSlide();
            break;
          case 39:
            gotoNextSlide();
            break;
          case 40:
            gotoNextSlide();
            break;
          default:
            break;
        }
      }
    }
  }

  function gotoCurrentSlide() {
    let canvas = (window as any).canvas;
    const currentIndex = store.getState().slides.currentSlideIndex;
    const slide = slides[currentIndex - 1];
    const widthSlide = slide.width;
    canvas.animateToRect(widthSlide, slide.height, slide.vpt, slide.vpCenter);
  }



  const stopPresentation = () => {

    store.dispatch(handleSetPresentationMode(false));
    canvas.unlockObjectsInCanvas();
    store.dispatch(handleSetSlidesMode(true));
    store.dispatch(handleSetHideHeader(false));
    store.dispatch(handleSetHideBoardUserList(false));
    store.dispatch(handleSetHideBoardMenu(false));
    store.dispatch(handleSetHideRightSideBar(false));
    $('#feedbackButton').css('display', 'block');
    $('#menus').css('display', 'block');
  };


  return (
    <Box sx={{ display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    position: 'fixed',
    top: '10px',
    left: '48%',
    height: '32px',
    padding: '5px',
    width: '280px',
    background: '#FFFFFF',
    boxShadow: '0px 1px 3px 2px #00000014',
    borderRadius: '4px',}} id="presentBar">
      <Box sx={{ p: 0.5 }}>
        <button
          style={{border: 0,
            background: 'transparent',
            cursor: 'pointer',
            color: '#999',}}
          id="preSlideButton"
          onClick={gotoPreviousSlide}
        >
          &lt;
        </button>
      </Box>
      <Box sx={{ p: 0.5 }}>
        <span>
          {' '}
          {currentIndex}/{totalSlides}
        </span>
      </Box>
      <Box sx={{ p: 0.5 }}>
        <button
          style={{border: 0,
            background: 'transparent',
            cursor: 'pointer',
            color: '#999',}}
          id="nextSlideButton"
          onClick={gotoNextSlide}
        >
          &gt;
        </button>
      </Box>
      <Box sx={{ p: 0.5 }}>
        <Button
          sx={{ width: 'auto',
    height: 30,
    border: 0,
    fontSize: 13,
    marginLeft: 5,
    padding: 0,}}
          color="primary"
          id="stopPresenting"
          onClick={() => {
            dispatch(changeMode('default'));
            stopPresentation()
          }}
          size="small"
          variant="text"
        >
          {t('board.header.slides.stopPresenting')}
        </Button>
      </Box>
    </Box>
  );
}

export default React.memo(PresentationControlBar);