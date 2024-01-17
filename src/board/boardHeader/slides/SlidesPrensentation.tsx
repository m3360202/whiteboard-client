//** Import react
import React, { useEffect } from 'react';

//**Import Redux */
import { useDispatch, useSelector } from 'react-redux';
import { changeMode } from '../../../store/mode';
//** Import Mui
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { useTranslation } from 'react-i18next';
import store, { RootState } from '../../../store';
import {  handleSetHideBoardUserList, handleSetHideHeader, handleSetHideBoardMenu, handleSetHideRightSideBar } from '../../../store/board';
import { handleSetCurrentSlideIndex, handleSetPresentationMode, handleSetSlidesMode, handleSetSlidesPlay, handleGoToPreviousSlide, handleGoToNextSlide } from '../../../store/slides';
import $ from 'jquery';

let canvas = Boardx.Instance.board;

export default function SlidesPresentation() {
  const dispatch = useDispatch();
  const presentationMode = useSelector((state: RootState) => state.slides.presentationMode);
  const slidesReadonly = useSelector((state: RootState) => state.slides.slides);
  const currentSlideIndex = useSelector((state: RootState) => state.slides.currentSlideIndex);
  const { t } = useTranslation();
  
  //copyslidesreadonly to emutable slides
  let [slides,setSlides] = React.useState([]);

  useEffect(() => {
    let slides=slidesReadonly.map((slide) => {
      return { ...slide };
    });
    setSlides(slides);
  }, [slidesReadonly]);



const gotoPreviousSlide = function () {
  store.dispatch(handleGoToPreviousSlide());
};

const gotoNextSlide = function () {
  store.dispatch(handleGoToNextSlide());
};


  // data source from Store  to React
  const enterPresentation = () => {
  let canvas = (window as any).canvas;
  if(slides.length < 1) {
    Boardx.Util.Msg.info(t('board.header.slides.noSlides'));
    return;
  }
    const currentIndex = store.getState().slides.currentSlideIndex;
    store.dispatch(handleSetPresentationMode(true));
    store.dispatch(handleSetSlidesPlay(slides));
    store.dispatch(handleSetHideHeader(true));
    store.dispatch(handleSetHideBoardUserList(true));
    store.dispatch(handleSetHideBoardMenu(true));
    store.dispatch(handleSetHideRightSideBar(true));
    $('#feedbackButton').css('display','none');
    $('#menus').css('display','none');
    if (!currentIndex || currentIndex < 1) {
      store.dispatch(handleSetCurrentSlideIndex(1));
    }

    canvas.discardActiveObject();
    canvas.requestRenderAll();
    if (!canvas) return;
    dispatch(handleSetSlidesMode(false));
  
    dispatch(changeMode('pan'));
    // UserService.getInstance().setShowUserList(false);
    gotoCurrentSlide();
  };

  useEffect(() => {
    if(!slides) return;
    store.dispatch(handleSetSlidesPlay(slides));

    if (slides && slides.length > 0 && presentationMode) {

      gotoCurrentSlide();
    }

  }, [currentSlideIndex, presentationMode]);

  function gotoCurrentSlide(){
    let canvas = (window as any).canvas;
    const currentIndex = store.getState().slides.currentSlideIndex;
    const slide = slides[currentIndex - 1];
    const widthSlide = slide.width;
    canvas.animateToRect(widthSlide, slide.height, slide.vpt, slide.vpCenter);
  }



  return (
    <div>
      <Tooltip
        arrow
        placement="bottom"
        title={t('board.header.slides.slidesPresent')}
      >
        <IconButton onClick={enterPresentation} size="large">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            id="Layer_1"
            x="0px"
            y="0px"
            viewBox="0 0 32 32"
            enableBackground="new 0 0 32 32"
            className="menuImgSize"
          >
            {' '}
            <image
              id="image0"
              x="0"
              y="0"
              href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAQAAADZc7J/AAAABGdBTUEAALGPC/xhBQAAACBjSFJN AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAJcEhZ cwAACxMAAAsTAQCanBgAAAAHdElNRQfmBBUHHSxWdUUoAAABE0lEQVRIx73VLUsDUBTG8d8UhqAg mDQoMpBhETFZBIPVuKBRYU1sLvgF9g1kXYTtCwgOxCRGi3HCkgqCIqIw3I7BYd+94lPOTf/DPS/P IVPjw1h2YFvBfRpmzYsQwo3NFEBTOHPkQQjnVkcFdIQSJh17FfpOlUYBdIWF4XtG3afQ0zCbAoB5 DV/Cu7rpFAAsaxkIz2omUgCw7koIXdXfho8EgC23QrhTSQMwpqIjhGsbKQAoqnoUQttKCgCm1LwJ fS2LKQCYc6InfDhMA8CSpoGwnwqAXeHyp8J/orQv7P17EbPaWFT1lDpImaOctUxZ67ysJVINJcvS kkw129Z/Dkst/bBknLbCMJbtmNJ2IUbNnqlvue2muGTFLhgAAAAldEVYdGRhdGU6Y3JlYXRlADIw MjItMDQtMjFUMDc6Mjk6NDQrMDA6MDAY/x18AAAAJXRFWHRkYXRlOm1vZGlmeQAyMDIyLTA0LTIx VDA3OjI5OjQ0KzAwOjAwaaKlwAAAAABJRU5ErkJggg=="
            />
          </svg>
        </IconButton>
      </Tooltip>
    </div>
  );
};

 