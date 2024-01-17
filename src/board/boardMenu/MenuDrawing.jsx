import React, { FC, useMemo, useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { Tooltip } from '@mui/material';
import Popover from '@mui/material/Popover';
import Slider from '@mui/material/Slider';
import { useTranslation } from 'react-i18next';
import Paper from '@mui/material/Paper';
import ToggleButton from '@mui/material/ToggleButton';
import StandardColor from '../widgetMenu/Colors/StandardColor';
import CustomColor from '../widgetMenu/Colors/CustomColor';
import ArrowIcon from '../../mui/svg/ArrowIcon';
import { DrawSvg } from '../svg/widgetToolBarMenuSvg';
import { useSelector } from 'react-redux';
import store,{ RootState } from '../../store';
import { updateDrawColor, updateDrawWidth } from '../../store/widget/draw';
import { useDispatch } from 'react-redux';
import { changeMode } from '../../store/mode';
import {handleSetDrawColorPopUp} from '../../store/board';
import { handleSetCustomColors} from '../../store/widgets';
import { updateStickyNoteMenuBarOpenStatus } from '../../store/widget/stickNote';

const MenuDrawing = () => {

  const dispatch = useDispatch();
  const { t } = useTranslation();
  const brushWidth = useSelector(
    (state) => state.widget.draw.brushWidth
  );
  const brushColor = useSelector(
    (state) => state.widget.draw.brushColor
  );
  const modeType = useSelector((state) => state.mode.type);

  const [colorPadOpen, setColorPadOpen] = useState(false);

  const toolBarShow = useMemo(
    () => modeType === 'draw' || modeType === 'eraser',
    [modeType]
  );

  function handleCloseDrawMode() {
    dispatch(changeMode('default'));
  }

  function toggleColorPad() {
    setColorPadOpen(!colorPadOpen);
  }

  function addCustomColor() {
    if (store.getState().widgets.currentCustomColor) {
      const currentColor = store.getState().widgets.currentCustomColor;
      let colorArray = [];
      let array = [];
      const arraySize = 11;
      let isColorExist = false;

      // console.log('current color: ', currentColor)

      if (localStorage.getItem('customColors')) {
        array = JSON.parse(localStorage.getItem('customColors'));
        colorArray = array.slice(0, arraySize);
      }

      colorArray.forEach(pColor => {
        if (pColor.color === currentColor) {
          isColorExist = true;
        }
      });

      if (!isColorExist) {
        colorArray.unshift({ color: currentColor });
      }

      localStorage.setItem('customColors', JSON.stringify(colorArray));
      store.dispatch(handleSetCustomColors(colorArray));
    }
  }

  function handleCloseColorPad() {
    setColorPadOpen(false);
    store.dispatch(handleSetDrawColorPopUp(false));
    addCustomColor();
  }

  function handleChangeEraserMode() {
    dispatch(changeMode('eraser'));
  }

 function handleOpenDrawMode() {
    dispatch(changeMode('draw'));
    dispatch(updateStickyNoteMenuBarOpenStatus(false));
  }

  function changeDrawThickness(value) {
    if (canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.width = value;
    }

    canvas.requestRenderAll();
    dispatch(updateDrawWidth(value));
    dispatch(changeMode('draw'));
  }

  function handleColorSelected(color) {
    if (canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.color = color;
    }

    canvas.requestRenderAll();
    if(color){
      dispatch(updateDrawColor(color));
    }
  
    setColorPadOpen(false);
  }

  const id = toolBarShow ? 'draw-popover' : undefined;
  useEffect(() => {
    if (canvas && canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush = null;
    }
    dispatch(updateDrawColor('rgba(0,0,0, 1)'));
    
    dispatch(updateDrawWidth(4));
    return () => {
      setColorPadOpen(false);
      dispatch(updateDrawColor(null));
      dispatch(updateDrawWidth(null));
      dispatch(changeMode('default'));
    }
  }, [])
  return (
    <div>
      <Tooltip arrow placement="top" title={t('board.menu.draw')}>
        <ToggleButton
          selected={modeType === 'draw'}
          value="draw"
          onClick={handleOpenDrawMode}
        >
          <DrawSvg />
        </ToggleButton>
      </Tooltip>
      <Paper
        sx={{  width: 325,
          height: 33,
          position: 'fixed',
          left: '50%',
          bottom: 90,
          transform: 'translate(-50%, 30%)'}}
        id={id}
        style={{
          display: toolBarShow ? 'flex' : 'none',
          alignItems: 'center',
          height: 54,
          boxShadow: '0px 1px 3px 2px #00000014',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ width: 29,
    height: 29,
    cursor: 'pointer',
    float: 'left',
    marginLeft: 8,
    marginTop: 3}}>
          <ToggleButton
            aria-describedby={id}
            aria-label="bold"
            sx={{    padding: 0,
              margin: 0}}
            id="drawColorPopupButton"
            value="backgroundColor"
            onClick={toggleColorPad}
          >

            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="widgetMenuImgSize"
              style={{ borderRadius: 10 }}
            >
              <circle cx="8" cy="8" r="8" fill={brushColor} />
              <circle
                cx="8"
                cy="8"
                r="7.5"
                stroke="black"
                strokeOpacity="0.16"
              />
            </svg>
            <ArrowIcon />
          </ToggleButton>
          <Popover
            anchorEl={document.getElementById('drawColorPopupButton')}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            sx={{ paper: { width: 192,
              height: 'auto'} }}
            id={id}
            onClose={handleCloseColorPad}
            open={colorPadOpen}
            transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <StandardColor
              clickMe={handleColorSelected}
              objectType="drawColor"
            />
            <CustomColor
              objectType="drawColor"
              setpCustomColor="#fff"
              clickMe={handleColorSelected}
            />
          </Popover>
        </div>

        <div style={{float: 'left',
    borderLeft: '1px solid rgba(0, 0, 0, 0.16)',
    height: '20px',
    marginLeft: 8,
    marginTop: 6}}/>

        <div style={{ cursor: 'pointer',
    height: '44px',
    display: 'flex',
    alignItems: 'center'}} className={' simple-menu'}>
          <div
            className={
              brushWidth === 4 && modeType === 'draw'
                ? 'MuiMenuItem-root Mui-selected'
                : 'MuiMenuItem-root'
            }
            onClick={() => changeDrawThickness(4)}
            style={{ margin: 3 }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="widgetMenuImgSize"
              style={{ padding: '12px 16px 12px 16px' }}
            >
              <rect y="6" width="16" height="4" fill="#150D33" />
            </svg>
          </div>
          <div
            className={
              brushWidth === 8 && modeType === 'draw'
                ? 'MuiMenuItem-root Mui-selected'
                : 'MuiMenuItem-root'
            }
            onClick={() => changeDrawThickness(8)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="widgetMenuImgSize"
              style={{ padding: '12px 16px 12px 16px' }}
            >
              <rect y="4" width="16" height="8" fill="#150D33" />
            </svg>
          </div>
          <div
            className={
              brushWidth === 12 && modeType === 'draw'
                ? 'MuiMenuItem-root Mui-selected'
                : 'MuiMenuItem-root'
            }
            style={{ margin: 3 }}
            onClick={() => changeDrawThickness(12)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="widgetMenuImgSize"
              style={{ padding: '12px 16px 12px 16px' }}
            >
              <rect y="2" width="16" height="12" fill="#150D33" />
            </svg>
          </div>
        </div>

        <div style={{float: 'left',
    borderLeft: '1px solid rgba(0, 0, 0, 0.16)',
    height: '20px',
    marginLeft: 8,
    marginTop: 6}} />

        <div style={{ cursor: 'pointer',
    height: '44px',
    display: 'flex',
    alignItems: 'center'}} className={ ' simple-menu'}>
          <div
            className={
              modeType === 'eraser'
                ? 'MuiMenuItem-root Mui-selected'
                : 'MuiMenuItem-root'
            }
            onClick={handleChangeEraserMode}
          >
            <svg
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="widgetMenuImgSize"
              style={{ padding: '12px 16px 12px 16px' }}
            >
              <path
                d="M1.65997 15.5H15.4933"
                stroke="black"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10.16 1.03322L13.6533 4.52655C13.9953 4.87012 14.1873 5.33513 14.1873 5.81988C14.1873 6.30463 13.9953 6.76965 13.6533 7.11322L9.69999 11.0599C9.19163 11.5691 8.58787 11.973 7.92324 12.2486C7.25861 12.5242 6.54617 12.6661 5.82666 12.6661C5.10715 12.6661 4.3947 12.5242 3.73008 12.2486C3.06545 11.973 2.46168 11.5691 1.95332 11.0599L1.03999 10.1532C0.698024 9.80965 0.506042 9.34463 0.506042 8.85988C0.506042 8.37513 0.698024 7.91012 1.03999 7.56655L7.57332 1.03322C7.91689 0.691249 8.38191 0.499268 8.86666 0.499268C9.35141 0.499268 9.81642 0.691249 10.16 1.03322V1.03322Z"
                stroke="black"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M4.98663 3.61987L11.0666 9.69987"
                stroke="black"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div className="MuiMenuItem-root" onClick={handleCloseDrawMode}>
            <svg
              className="widgetMenuImgSize"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ padding: '12px 16px 12px 16px' }}
            >
              <path
                d="M0.5 15.4993L15.5 0.499268"
                stroke="black"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M15.5 15.4993L0.5 0.499268"
                stroke="black"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </Paper>
    </div>
  );
};

const PrettoSlider = Slider;

export default MenuDrawing;
