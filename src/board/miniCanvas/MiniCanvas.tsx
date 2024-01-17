//** Import react
import React, { useEffect } from 'react';

import { styled } from '@mui/material/styles';

//** Import Redux toolkit
import store, { RootState } from '../../store';
import { useSelector } from 'react-redux';
import { handleSetZoomFactor, handleWidgetMenuDisplay } from '../../store/board';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import FitScreenOutlinedIcon from '../../mui/icons/FitScreenOutlinedIcon';

//** Import services
import {
  EventService,
} from '../../services';

//** Import components
import showMenu from '../widgetMenu/ShowMenu';
import EventNames from '../../util/EventNames';
import $ from 'jquery';

export default function MiniCanvas() {

  //slide dom
  const sideBarMode = useSelector((state: RootState) => state.sideBar.sideBarMode);
  const marginRightMiniMapContainer = useSelector((state: RootState) => state.sideBar.marginRightMiniMapContainer);
  //dom
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [isSlidemode, setIsSlidemode] = React.useState(false);
  const [isPresentationMode, setIsPresentationMode] = React.useState(false);
  const miniMapElement: any = React.useRef();
  const zoomFactor = useSelector((state: RootState) => state.board.zoomFactor);
  const [miniMapSize, setMiniMapSize] = React.useState(zoomFactor);
  const [timers, setTimers] = React.useState([]);
  const zoomCallBack: any = React.useRef();

  // sideBar open & close
  useEffect(() => {
    $('#miniMapContainer').css('right', marginRightMiniMapContainer);
  }, [sideBarMode]);

  useEffect(() => {
    let valueSlider = 0;
    valueSlider = parseInt((zoomFactor * 100).toString() || '10', 10);
    setMiniMapSize(valueSlider);
  }, [zoomFactor]);

  useEffect(() => {
    EventService.getInstance().register(
      EventNames.RETURN_DEFAULT_ZOOMM,
      returnDefaultZoom,
    );
  }, []);

  let isLarger = false;
  const handleZoom = () => {
    let zoom = getZoomSize();
    if (!isLarger) {
      zoom += random(20, 10);
      if (zoom > 100) zoom = 100;
    } else {
      zoom -= random(20, 10);
      if (zoom < 100) zoom = 100;
    }
    handleChange(zoom);
    setMiniMapSize(zoom);
    if (zoom === 100) {
      timers.forEach((timer) => {
        clearInterval(timer);
      });
    }
  };
  const random = (max, min) => {
    return Math.floor(Math.random() * (max - min)) + min;
  };
  const getZoomSize = () => {
    return parseInt((zoomFactor * 100).toString() || '10', 10);
  };

  const handleFitToScreen = async () => {
    const zoom = await canvas.zoomToViewAllObjects();
    handleChange(zoom);
    setMiniMapSize(zoom);
  }

  const returnDefaultZoom = () => {
    if (getZoomSize() === 100) {
      return;
    }
    if (getZoomSize() > 100) {
      isLarger = true;
    } else {
      isLarger = false;
    }
    handleZoom();
    const timer = setInterval(tick, 100);
    timers.push(timer);
    setTimers(timers);
  };
  const tick = () => {
    zoomCallBack.current();
  };
  useEffect(() => {
    zoomCallBack.current = handleZoom;
    return () => { };
  });


  const handleChange = (newValue) => {
    let canvas = (window as any).canvas;
    store.dispatch(handleWidgetMenuDisplay(false))
    if (typeof newValue === 'number') {
      canvas.setZoom(newValue / 100);
      store.dispatch(handleSetZoomFactor(newValue / 100));
      canvas.zoomToCenterPoint(canvas.getVpCenter(), newValue / 100);
      canvas.updateViewport();
      canvas.requestRenderAll();
    }
  };

  const handleClickZoominOut = (change) => {

    // Determine the new zoom level, ensuring it doesn't go below 0.05
    const newZoom = Math.max(canvas.getZoom() + change, 0.05);

    // Zoom to the center point of the canvas with the new zoom level
    canvas.zoomToCenterPoint(canvas.getVpCenter(), newZoom);

    // Re-render the canvas to apply the zoom change
    canvas.renderAll();

    // Adjust the miniMapSize and handle the change
    const newMiniMapSize = newZoom*100;
    handleChange(newMiniMapSize);

  };

  const getZoomchanged = (event, newValue) => {
    if (canvas.getActiveObject()) showMenu();
    canvas.requestRenderAll();
  };

  const EffectInfo = () => {
    document
      .getElementById('miniMapContainer')
      .addEventListener('wheel', (event) => {
        event.preventDefault();
      });
  };

  React.useEffect(EffectInfo, []);

  if (
    store.getState().slides.createSlidesMode == true &&
    anchorEl
  ) {
    setIsSlidemode(true);
    setAnchorEl(null);
  }

  if (
    store.getState().slides.presentationMode == true &&
    anchorEl
  ) {
    setIsPresentationMode(true);
    setAnchorEl(null);
  }

  React.useEffect(() => {
    if (
      isSlidemode &&
      store.getState().slides.createSlidesMode == false
    ) {
      if (miniMapElement.current) {
        setAnchorEl(miniMapElement.current);
        setIsSlidemode(false);
      }
    }

    if (
      isPresentationMode &&
      store.getState().slides.presentationMode == false
    ) {
      if (miniMapElement.current) {
        setAnchorEl(miniMapElement.current);
        setIsPresentationMode(false);
      }
    }
  }, [miniMapElement.current]);
  return (
    <Box
      sx={{position: 'fixed',
      bottom: '15px',
      right: '92px',
      height: '44px',
      padding: '12px 0',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
      boxShadow: '0px 1px 3px 2px #00000014',
      borderRadius: '8px',
      boxSizing: 'border-box',}}
      id="miniMapContainer"
      data-tut="reactour__miniMap"
      ref={miniMapElement}
    >
      <IconButton onClick={handleFitToScreen}>
        <FitScreenOutlinedIcon style={{ width: '20px', height: '20px' }} />
      </IconButton>
      <IconButton onClick={()=>handleClickZoominOut(-0.1)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          strokeWidth="1"
          className="menuImgSize"
        >
          <g transform="matrix(1,0,0,1,0,0)">
            <path
              d="M0.75 12.038L23.25 12.038"
              fill="none"
              stroke="#000000"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
          </g>
        </svg>
      </IconButton>
      <p>{miniMapSize}%</p>
      <IconButton onClick={()=>handleClickZoominOut(0.1)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          strokeWidth="1"
          className="menuImgSize"
        >
          <g transform="matrix(1,0,0,1,0,0)">
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
    </Box>
  );
}
