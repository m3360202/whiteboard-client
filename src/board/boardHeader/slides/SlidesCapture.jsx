//** Import React
import React, { useEffect, useState } from 'react';

import { styled } from '@mui/material/styles';

//** Import i18n
import { useTranslation } from 'react-i18next';
import __ from 'lodash';

//**Import Redux */
import { useDispatch, useSelector } from 'react-redux';
import { changeMode } from '../../../store/mode';

import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import LoadingButton from '@mui/lab/LoadingButton';
import { useUpdateBoardByIdMutation } from '../../../redux/BoardAPISlice';

import store, { RootState } from '../../../store';

//** Import services
import {
  BoardService,
  SlideService,
  EventService,
  UtilityService,
  FileService
} from '../../../services';

//** Import components
import EventNames from '../../../util/EventNames';
import imageCompression from 'browser-image-compression';
import { recoverEventsByInteractionMode } from '../../canvas/initialize/initializeCanvasEvents';
import {
  handleSetIsEnableScreenShot,
  handleSetIsStartScreenShot,
  handleSetCreateSlidesMode,
  handleSetCapturing,
  handleSetSlides,
  handleSetSlidesMode,
  handleSetSlidesMouseLeft,
  handleSetSlidesMouseTop,
  handleSetSlideCaptureType,
  handleSetSlideCaptureIndex
} from '../../../store/slides';
import $ from 'jquery';

const PREFIX = 'SlidesCapture';

const classes = {
  root: `${PREFIX}-root`,
  bullet: `${PREFIX}-bullet`,
  title: `${PREFIX}-title`,
  pos: `${PREFIX}-pos`,
  typography: `${PREFIX}-typography`,
  stopCaptureButton: `${PREFIX}-stopCaptureButton`,
  mouseLabel: `${PREFIX}-mouseLabel`,
  slidesCapturePanel: `${PREFIX}-slidesCapturePanel`,
  createSlideModeBox: `${PREFIX}-createSlideModeBox`,
  screenShotMenu: `${PREFIX}-screenShotMenu`,
  cancelAndSaveButton: `${PREFIX}-cancelAndSaveButton`
};

const Root = styled('div')(({ theme }) => ({
  [`& .${classes.root}`]: {
    minWidth: 275,
    display: 'flex',
    paddingBottom: 5
  },

  [`& .${classes.bullet}`]: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)'
  },

  [`& .${classes.title}`]: {
    fontSize: 14,
    flexGrow: 1
  },

  [`& .${classes.pos}`]: {
    marginBottom: 12
  },

  [`& .${classes.typography}`]: {
    padding: theme.spacing(2)
  },

  [`& .${classes.stopCaptureButton}`]: {
    border: '0px',
    background: '#F21D6B',
    color: '#FFFFFF',
    fontFamily: 'Inter',
    marginLeft: '20px',
    width: 'auto',
    fontStyle: 'normal',
    fontWeight: 700,
    fontSize: '16px',
    lineHeight: '24px',
    cursor: 'pointer',
    // '&:hover': {
    //   background: '#F21D6B',
    //   color: '#FFFFFF',
    // },
    display: 'flex',
    // justifyContent: 'flex-end',
    height: '32px'
  },

  [`& .${classes.mouseLabel}`]: {
    width: '300px',
    background: '#333',
    color: 'white',
    position: 'fixed'
  },

  [`& .${classes.slidesCapturePanel}`]: {
    height: '32px',
    width: '262px',
    background: '#F21D6B',
    boxShadow: '0px 1px 3px 2px #00000014',
    borderRadius: '4px',
    position: 'absolute',
    top: '16px',
    left: '-331%'
  },

  [`&.${classes.createSlideModeBox}`]: {
    fontSize: '16px',
    color: '#FFFFFF',
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '16px',
    lineHeight: '24px'
  },

  [`& .${classes.screenShotMenu}`]: {
    backgroundColor: 'white',
    width: '200px',
    height: '55px',
    boxShadow: '0px 1px 3px 2px #00000014',
    borderRadius: '4px',
    display: 'none',
    position: 'fixed'
  },

  [`& .${classes.cancelAndSaveButton}`]: {
    display: 'inline-block',
    margin: 10
  }
}));

export default function SlidesCapture({
  type,
  handleClose,
  index,
  openSlides
}) {
  //use

  const [saveSlideButtonLoading, setSaveSlideButtonLoading] = useState(false);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  let board = store.getState().board.board;
  let r2UploadPath = UtilityService.getInstance().getr2UploadPath(board);

  const [updateBoardById] = useUpdateBoardByIdMutation();
  const slidesMode = useSelector(state => state.slides.slidesMode);

  const isStartScreenShot = useSelector(
    state => state.slides.isStartScreenShot
  );
  const isEnableScreenShot = useSelector(
    state => state.slides.isEnableScreenShot
  );

  const [isAddingPage, setIsAddingPage] = useState(false);

  useEffect(() => {
    const screenshotRect =
      SlideService.getInstance().getScreenShotRect();
    dispatch(handleSetSlidesMode(false));
    if (!slidesMode && screenshotRect) {
      handleCancelSave();
    }
    return () => {};
  }, []);

  useEffect(() => {
    if (openSlides === 2) {
      handleCancelSave();
    }
  }, [openSlides]);

  const handleCancelSave = () => {
    store.dispatch(handleSetCreateSlidesMode(false));
    store.dispatch(handleSetCapturing(false));
    canvas.skipTargetFind = false;
    $('#screenShotMenu').hide();
    if (SlideService.getInstance().getScreenShotRect()) {
      canvas.requestRenderAll();
      SlideService.getInstance().setScreenShotRect(null);
    }
    canvas?.unlockObjectsInCanvas();
    recoverEventsByInteractionMode();
    dispatch(handleSetIsEnableScreenShot(false));
    setIsAddingPage(false);
    dispatch(handleSetIsStartScreenShot(false));
    $('#screenShotPosition').show();
    canvas.setCursor('default');
  };

  const handleCancelSelect = e => {
    const screenshotRect =
      SlideService.getInstance().getScreenShotRect();
    store.dispatch(handleSetCreateSlidesMode(false));
    store.dispatch(handleSetCapturing(false));
    //原代码;
    $('#screenShotMenu').hide();
    if (screenshotRect) {
      canvas.remove(screenshotRect);
      canvas.requestRenderAll();
      SlideService.getInstance().setScreenShotRect(null);
    }
    canvas.unlockObjectsInCanvas();
    recoverEventsByInteractionMode();
    dispatch(handleSetIsEnableScreenShot(false));

    setIsAddingPage(false);
    dispatch(handleSetIsStartScreenShot(false));
    $('#screenShotPosition').show();
    canvas.setCursor('default');
    handleAddSlide(e);
  };
  const showMouseLabel = memo => {
    $('#mouseLabel').show();
    store.dispatch(handleSetSlidesMouseLeft(memo.e.clientX));
    store.dispatch(handleSetSlidesMouseTop(memo.e.clientY));
  };

  const handleSaveSlide = async e => {
    store.dispatch(handleSetCapturing(false));
    const canvas = window.canvas;
    canvas.skipTargetFind = false;
    const screenshotRect =
      SlideService.getInstance().getScreenShotRect();
    setSaveSlideButtonLoading(true);
    store.dispatch(handleSetCreateSlidesMode(false));
    //set screenshoptrect transparent, including stroke and fill
    screenshotRect.set({ fill: 'rgba(0,0,0,0)' });
    screenshotRect.set({ stroke: 'rgba(0,0,0,0)' });

    canvas.requestRenderAll();

    const index = store.getState().slides.slideCaptureIndex;

    dispatch(handleSetIsEnableScreenShot(false));
    dispatch(handleSetIsStartScreenShot(false));
    setIsAddingPage(false);

    const el = $(e.currentTarget);

    const prect = screenshotRect;
    if (!prect) {
      return;
    }
    if (prect.width === undefined || prect.width < 10) {
      stopCaptureSlides(e);
      Boardx.Util.Msg.info(t('board.header.slides.toosmall'));
      return;
    }
    if (prect.height === undefined || prect.height < 10) {
      stopCaptureSlides(e);
      Boardx.Util.Msg.info(t('board.header.slides.toosmall'));
      return;
    }

    canvas.unlockObjectsInCanvas();
    recoverEventsByInteractionMode();
    $('#screenShotPosition').hide();
    canvas.setCursor('pointer');

    canvas.requestRenderAll();

    const zoom = canvas.getZoom();
    const shotLeft = screenshotRect.left;
    const shotTop = screenshotRect.top;
    const imgStr = canvas.toDataURL({
      left: shotLeft * zoom - canvas.getPositionOnCanvas(0, 0).left * zoom,
      top: shotTop * zoom - canvas.getPositionOnCanvas(0, 0).top * zoom,
      width: screenshotRect.width * zoom,
      height: screenshotRect.height * zoom
    });

    var file = await imageCompression.getFilefromDataUrl(imgStr);
    file.name = new Date().getTime() + '.png';
    const board = store.getState().board.board;
    const slides = [];
    board.slides?.forEach(slide => {
      slides.push({ ...slide });
    });

    const newIndex = index > -1 ? index : slides.length + 1;
    const slide = {
      index: newIndex,
      src: '',
      vpt: canvas.viewportTransform,
      key: '',
      vpCenter: screenshotRect.getCenterPoint(),
      width: screenshotRect.width * zoom,
      height: screenshotRect.height * zoom
    };

    const key = await FileService.getInstance().uploadFileToR2inBoard(
      r2UploadPath,
      file,
      {}
    );

    slide.src = `${key}`;
    slide.key = key;

    if (index > -1) {
      slides.splice(index, 0, slide);
    } else {
      slides.push(slide);
    }

    updateBoardById({ id: board._id, data: { slides: slides } });
    store.dispatch(handleSetSlides(slides));

    setTimeout(() => {
      // SlideService.getInstance().setSlides(slides);
      const element = document.getElementById('slidesContainer');
      if (element) element.scrollTop = element.scrollHeight;
    }, 500);

    canvas.remove(screenshotRect);
    canvas.requestRenderAll();
    SlideService.getInstance().setScreenShotRect(null);
    $('#screenShotMenu').hide();
    setSaveSlideButtonLoading(false);
    canvas.setCursor('default');
  };

  const slidesMouseDownListener = memo => {
    let isEnableScreenShot = store.getState().slides.isEnableScreenShot;

    const { e } = memo;
    const canvas = window.canvas;

    if (isEnableScreenShot && e.which === 1) {
      dispatch(handleSetIsStartScreenShot(true));
      EventService.getInstance().register(
        EventNames.CANVAS_MOUSE_MOVE,
        slidesMouseMoveListener
      );
      EventService.getInstance().register(
        EventNames.CANVAS_MOUSE_UP,
        slidesMouseUpListener
      );
      canvas.lastPosX = memo.e.offsetX;
      canvas.lastPosY = memo.e.offsetY;
      const len = 0;
      const x = canvas.getPositionOnCanvas(e.offsetX, e.offsetY).left;
      const y = canvas.getPositionOnCanvas(e.offsetX, e.offsetY).top;

      canvas.lockObjectsInCanvas();
     
      if (!isAddingPage) {
        canvas.isEnablePanMoving = true;
        canvas.discardActiveObject();
        let prevPosition = {
          left: e.offsetX,
          top: e.offsetY
        };
      } else {
        canvas.isEnablePanMoving = false;
      }

      if (isEnableScreenShot) {
        SlideService.getInstance().slidesMouseDownEnableScreenShot(
          x,
          y,
          canvas
        );
        canvas.isEnableMoving = false;
      }
      if (e.which === 1) {
        canvas.isEnableMoving = true;
        let prevPosition = {
          left: x,
          top: y
        };
      }
    } else {
      canvas.unlockObjectsInCanvas();
    }
  };

  const slidesMouseMoveListener = memo => {
    // const canvas = BoardService.getInstance().getBoardCanvas();
    const canvas = window.canvas;
    canvas.__newMoveTime = +new Date();
    canvas.__lastMoveTime = canvas.__lastMoveTime || 0;
    if (canvas.__newMoveTime - canvas.__lastMoveTime < 20) return;
    canvas.__lastMoveTime = canvas.__newMoveTime;

    const { e } = memo;

    if (canvas.isDrawingMode) return;
    store.dispatch(handleSetCapturing(true));
  };

  // canvas mouseup event listener
  const slidesMouseUpListener = memo => {
    const screenshotRect = SlideService.getInstance().getScreenShotRect();
    let isStartScreenShot = store.getState().slides.isStartScreenShot;
    let isEnableScreenShot = store.getState().slides.isEnableScreenShot;
    // const canvas = BoardService.getInstance().getBoardCanvas();
    const { e } = memo;
    if (!canvas) {
      return;
    }

    if (isStartScreenShot) {
      const x = canvas.getPositionOnCanvas(e.offsetX, e.offsetY).left;
      const y = canvas.getPositionOnCanvas(e.offsetX, e.offsetY).top;
      SlideService.getInstance().slidesMouseUpEnableScreenShot(x, y);
      canvas.requestRenderAll();
    }

    EventService.getInstance().unregister(
      EventNames.CANVAS_MOUSE_DOWN,
      slidesMouseDownListener
    );
    EventService.getInstance().unregister(
      EventNames.CANVAS_MOUSE_MOVE,
      showMouseLabel
    );
    EventService.getInstance().unregister(
      EventNames.CANVAS_MOUSE_MOVE,
      slidesMouseMoveListener
    );
    EventService.getInstance().unregister(
      EventNames.CANVAS_MOUSE_UP,
      slidesMouseUpListener
    );

    store.dispatch(handleSetSlidesMouseLeft(-1));
    if (isEnableScreenShot) {
      dispatch(handleSetIsEnableScreenShot(false));
      $('#screenShotPosition').hide();
      canvas.setCursor('pointer');

      if (screenshotRect && screenshotRect.width && screenshotRect.width < 0) {
        dispatch(handleSetIsStartScreenShot(false));
        canvas.isEnableMoving = false;
        canvas.remove(screenshotRect);
        return;
      }

      $('#screenShotMenu')
        .show()
        .css({
          left: e.offsetX - 100,
          top: e.offsetY + 10
        });
    }

    $('#slideCapture').hide();
    $('#mouseLabel').hide();
    if (isStartScreenShot) {
      dispatch(handleSetIsStartScreenShot(false));
      SlideService.getInstance().setScreenShotRectCoords();
      canvas.discardActiveObject();
    }

    canvas.isEnableMoving = false;
  };

  const stopCaptureSlides = e => {
    const screenshotRect =
      SlideService.getInstance().getScreenShotRect();
    e.preventDefault();
    e.stopPropagation();
    // const canvas = BoardService.getInstance().getBoardCanvas();
    EventService.getInstance().unregister(
      EventNames.CANVAS_MOUSE_DOWN,
      slidesMouseDownListener
    );
    EventService.getInstance().unregister(
      EventNames.CANVAS_MOUSE_MOVE,
      showMouseLabel
    );
    EventService.getInstance().unregister(
      EventNames.CANVAS_MOUSE_MOVE,
      slidesMouseMoveListener
    );
    EventService.getInstance().unregister(
      EventNames.CANVAS_MOUSE_UP,
      slidesMouseUpListener
    );

    recoverEventsByInteractionMode();
    store.dispatch(handleSetSlidesMouseLeft(-1));
    setIsAddingPage(false);
    dispatch(handleSetIsStartScreenShot(false));
    // setIsStartScreenShot(false);
    canvas.isEnableMoving = false;
    canvas.remove(screenshotRect);
    $('#slideCapture').hide();
    $('#mouseLabel').hide();
    handleCancelSave();
  };
  const closeSlides = () => {
    // const canvas = BoardService.getInstance().getBoardCanvas();
    EventService.getInstance().unregister(
      EventNames.CANVAS_MOUSE_DOWN,
      slidesMouseDownListener
    );
    EventService.getInstance().unregister(
      EventNames.CANVAS_MOUSE_MOVE,
      showMouseLabel
    );
    EventService.getInstance().unregister(
      EventNames.CANVAS_MOUSE_MOVE,
      slidesMouseMoveListener
    );
    EventService.getInstance().unregister(
      EventNames.CANVAS_MOUSE_UP,
      slidesMouseUpListener
    );

    recoverEventsByInteractionMode();
    store.dispatch(handleSetSlidesMouseLeft(-1));
    setIsAddingPage(false);
    setIsStartScreenShot(false);
    canvas.isEnableMoving = false;
    canvas.remove(screenshotRect);
    $('#slideCapture').hide();
    $('#mouseLabel').hide();
    handleCancelSave();
  };
  const that = this;

  const handleAddSlide = e => {
    const screenshotRect =
      SlideService.getInstance().getScreenShotRect();
    e.stopPropagation();
    if (type == 'insertBefore' || type == 'insertAfter') {
      handleClose();
    }
    dispatch(changeMode('default'));
    store.dispatch(handleSetCreateSlidesMode(true));

    store.dispatch(handleSetSlideCaptureIndex(index));
    store.dispatch(handleSetSlideCaptureType(type));
    //  SlideService.getInstance().setSlideCaptureIndex(index);
    // SlideService.getInstance().setSlideCaptureType(type);

    // const canvas = BoardService.getInstance().getBoardCanvas();
    canvas.discardActiveObject();
    canvas.lockObjectsInCanvas();
    canvas.skipTargetFind = true;
    canvas.requestRenderAll();
    if (screenshotRect) {
      canvas.remove(screenshotRect);
      SlideService.getInstance().setScreenShotRect(null);
    }

    $('#screenShotPosition').show();
    canvas.defaultCursor = 'default';
    canvas.selection = true;
    canvas.isEnablePanMoving = false;
    canvas.mouse.mouseMoveUpdate = false;
    $('#slideCapture').show();
    $('#mouseLabel').show();

    EventService.getInstance().register(
      EventNames.CANVAS_MOUSE_DOWN,
      slidesMouseDownListener
    );

    EventService.getInstance().register(
      EventNames.CANVAS_MOUSE_MOVE,
      showMouseLabel
    );
    store.dispatch(handleSetSlidesMouseLeft(-1));
    dispatch(handleSetIsEnableScreenShot(true));
    setIsAddingPage(true);
  };

  const handleDefaultDOM = () => {
    if (type === 'default') {
      return (
        <Tooltip
          arrow
          placement="bottom"
          title={t('board.header.slides.addSlide')}
        >
          <IconButton onClick={handleAddSlide} size="large">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              strokeWidth="1"
              className="menuImgSize"
            >
              <g transform="matrix(0.8333333333333334,0,0,0.8333333333333334,0,0)">
                <path
                  d="M0.75 12L23.25 12"
                  fill="none"
                  stroke="#000000"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                />
                <path
                  d="M12 0.75L12 23.25"
                  fill="none"
                  stroke="#000000"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                />
              </g>
            </svg>
          </IconButton>
        </Tooltip>
      );
    }
    return null;
  };

  const handleInsertBeforeDOM = () => {
    if (type === 'insertBefore') {
      return (
        <MenuItem index={index} onClick={handleAddSlide} type={type}>
          <ListItemText primary={t('board.contextMenu.addSlideBefore')} />
        </MenuItem>
      );
    }
    return null;
  };

  const handleInsertAfterDOM = () => {
    if (type === 'insertAfter') {
      return (
        <MenuItem index={index} onClick={handleAddSlide} type={type}>
          <ListItemText primary={t('board.contextMenu.addSlideAfter')} />
        </MenuItem>
      );
    }
    return null;
  };

  const handleIsEnableScreenShotDOM = () => {
    if (isEnableScreenShot) {
      return (
        <Box
          className={classes.slidesCapturePanel}
          id="slideCapture"
          sx={{ display: 'flex', flexDirection: 'row', m: 1 }}
        >
          <Box sx={{ pt: 0.5, pl: 2 }}>
            <div
              style={{
                fontSize: '16px',
                color: '#FFFFFF',
                fontFamily: 'Inter',
                fontStyle: 'normal',
                fontWeight: 500,
                fontSize: '16px',
                lineHeight: '24px'
              }}
            >
              {t('board.header.slides.createSlideMode')}
            </div>
          </Box>
          <Box>
            <Button
              className={classes.stopCaptureButton}
              id="stopCaptureSlide"
              onClick={stopCaptureSlides}
              size="small"
              variant="text"
            >
              {t('board.header.slides.stop')}
            </Button>
          </Box>
        </Box>
      );
    }
    return null;
  };

  return (
    <Root>
      {handleDefaultDOM()}
      {handleInsertBeforeDOM()}
      {handleInsertAfterDOM()}
      {handleIsEnableScreenShotDOM()}

      <div id="screenShot" />
      <div className={classes.screenShotMenu} id="screenShotMenu">
        <Button
          className={classes.cancelAndSaveButton}
          color="primary"
          // index={index}
          onClick={handleCancelSelect}
          size="small"
          type={type}
          variant="text"
        >
          {t('board.cancel')}
        </Button>
        <LoadingButton
          loading={saveSlideButtonLoading}
          className={classes.cancelAndSaveButton}
          color="primary"
          // index={index}
          onClick={e => handleSaveSlide(e)}
          size="small"
          type={type}
          variant="contained"
        >
          {t('board.save')}
        </LoadingButton>
      </div>
    </Root>
  );
}

// export default React.memo(SlidesCapture);
