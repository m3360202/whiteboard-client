import React, { useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Popover from '@mui/material/Popover';
import ToggleButton from '@mui/material/ToggleButton';
import { WidgetService } from '../../services';
import ArrowIcon from '../../mui/svg/ArrowIcon';
//** Import Redux toolkit
import store, { RootState } from '../../store';
import { handleSetDropdownDisplayed } from '../../store/widgets';
import { useSelector } from 'react-redux';
import { handleSetCurrentAlign } from '../../store/board';
import $ from 'jquery';

export default function FormatAlign ({
  paddingLeft,
  paddingRight,
}) {


  const [anchorEl, setAnchorEl] = React.useState(null);
  const [align, setAlign] = React.useState(null);
  const textAlign = useSelector((state: RootState) => state.board.currentAlign);

  useEffect(() => {
    if (textAlign === 'left') {
      setAlign('left');
    }
    if (textAlign === 'center') {
      setAlign('center');
    }
    if (textAlign === 'right') {
      setAlign('right');
    }
    if(!textAlign) {
      setAlign('center');
    }
    const activeObj = canvas.getActiveObjects();
    //判断activeObj的所有对象的textAlign都是left right 或center
    if (activeObj[0] && activeObj[0].textAlign && activeObj.length > 1) {
      let isSame = true;
      activeObj.forEach(obj => {
        if (obj.textAlign && obj.textAlign !== activeObj[0].textAlign) {
          isSame = false;
        }
      });
      if (isSame) {
        setAlign(activeObj[0].textAlign);
      } 
    }
  }, [textAlign]);
  const fontAlign = align;

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpen(false);
  };

  const handleBlur = e => {
    store.dispatch(handleSetDropdownDisplayed(false));
  };

  const handleFocus = e => {
    store.dispatch(handleSetDropdownDisplayed(true));
  };

  const [open, setOpen] = React.useState(false);
  const id = open ? 'simple-popover' : undefined;

  const changeAlign = e => {
    const textAlign = $(e.currentTarget).attr('data-align');
    const object = canvas.getActiveObject();
    const menu = $('#notesMenu');
    let data = null;
    let group = null;
    if (canvas.getActiveObjects().length > 1) group = canvas.getActiveObject();

    if (object.isEditing) {
      object.exitEditing();
    }

    store.dispatch(handleSetCurrentAlign(textAlign));

    if (!object) {
      return menu.hide();
    }
    if (object) {
      data = WidgetService.getInstance().getWidgetFromWidgetList(
        object._id
      );
       
    
    
      object.set('textAlign', textAlign);
      object.resetResizeControls();
      canvas.requestRenderAll();
      object.saveData('MODIFIED', ['textAlign']);
    }
    canvas.requestRenderAll();
    if (group && group._objects) {
      group._objects.forEach(obj => {
        obj.set('textAlign', textAlign);
      });
      group.saveData('MODIFIED', ['textAlign']);
    }
    setOpen(false);
  };

  return (
    <div>
      <div
        className={'customClass'}
        style={{ paddingLeft, paddingRight }}
        onClick={handleClick}
      >
        <ToggleButton
          aria-label="formatAlignCenter"
          sx={{borderLeftWidth: 0,
    borderRightWidth: 0,
    paddingLeft: 0,
    paddingRight: 0,
    height: 44,}}
          data-cy="formatAlign"
          selected={false}
          value="formatAlignCenter"
        >
          {fontAlign === 'center' ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              strokeWidth="1"
              className="widgetMenuImgSize"
            >
              <g transform="matrix(0.6666666666666666,0,0,0.6666666666666666,0,0)">
                <path
                  d="M2.241 2.998L21.741 2.998"
                  fill="none"
                  stroke="#000000"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                />
                <path
                  d="M5.241 7.498L18.741 7.498"
                  fill="none"
                  stroke="#000000"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                />
                <path
                  d="M0.741 11.998L23.241 11.998"
                  fill="none"
                  stroke="#000000"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                />
                <path
                  d="M5.241 16.498L18.741 16.498"
                  fill="none"
                  stroke="#000000"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                />
                <path
                  d="M2.241 20.998L21.741 20.998"
                  fill="none"
                  stroke="#000000"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                />
              </g>
            </svg>
          ) : null}
          {fontAlign === '' ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              strokeWidth="1"
              className="widgetMenuImgSize"
            >
              <g transform="matrix(0.6666666666666666,0,0,0.6666666666666666,0,0)">
                <path
                  d="M2.241 2.998L21.741 2.998"
                  fill="none"
                  stroke="#000000"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                />
                <path
                  d="M5.241 7.498L18.741 7.498"
                  fill="none"
                  stroke="#000000"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                />
                <path
                  d="M0.741 11.998L23.241 11.998"
                  fill="none"
                  stroke="#000000"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                />
                <path
                  d="M5.241 16.498L18.741 16.498"
                  fill="none"
                  stroke="#000000"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                />
                <path
                  d="M2.241 20.998L21.741 20.998"
                  fill="none"
                  stroke="#000000"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                />
              </g>
            </svg>
          ) : null}
          {fontAlign === 'left' ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              strokeWidth="1"
              className="widgetMenuImgSize"
            >
              <g transform="matrix(0.6666666666666666,0,0,0.6666666666666666,0,0)">
                <path
                  d="M0.75 2.998L21.75 2.998"
                  fill="none"
                  stroke="#000000"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                />
                <path
                  d="M0.75 7.498L18.75 7.498"
                  fill="none"
                  stroke="#000000"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                />
                <path
                  d="M0.75 11.998L23.25 11.998"
                  fill="none"
                  stroke="#000000"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                />
                <path
                  d="M0.75 16.498L18.75 16.498"
                  fill="none"
                  stroke="#000000"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                />
                <path
                  d="M0.75 20.998L21.75 20.998"
                  fill="none"
                  stroke="#000000"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                />
              </g>
            </svg>
          ) : null}
          {fontAlign === 'right' ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              strokeWidth="1"
              className="widgetMenuImgSize"
            >
              <g transform="matrix(0.6666666666666666,0,0,0.6666666666666666,0,0)">
                <path
                  d="M23 2.998L2 2.998"
                  fill="none"
                  stroke="#000000"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                />
                <path
                  d="M23 7.498L5 7.498"
                  fill="none"
                  stroke="#000000"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                />
                <path
                  d="M23 11.998L0.5 11.998"
                  fill="none"
                  stroke="#000000"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                />
                <path
                  d="M23 16.498L5 16.498"
                  fill="none"
                  stroke="#000000"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                />
                <path
                  d="M23 20.998L2 20.998"
                  fill="none"
                  stroke="#000000"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                />
              </g>
            </svg>
          ) : null}
          <ArrowIcon />
        </ToggleButton>
      </div>
      <Popover
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        className=" textAlignPop"
        sx={{
          margin: '2px',
          '& .MuiPopover-paper': {
            width: '96px',
            height: '30px',
            overflow: 'hidden'
         },
          '.align':{    width: '36',
          padding: '8px',
          color: 'rgba(0, 0, 0, 0.54)'},
          '.active': {
            backgroundColor: '#D3F4F4',
            width: '36',
            padding: '8px',
            color: 'rgba(0, 0, 0, 0.54)'
          }
        }}

        id={id}
        onBlur={handleBlur}
        onClose={handleClose}
        onFocus={handleFocus}
        open={open}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          strokeWidth="1"
          data-align="left"
          data-cy="left"
          className={
            align === 'left'
              ? 'widgetMenuImgSize customClass ' + 'active'
              : 'widgetMenuImgSize customClass ' + 'align'
          }
          onClick={changeAlign}
        >
          <g transform="matrix(0.6666666666666666,0,0,0.6666666666666666,0,0)">
            <path
              d="M0.75 2.998L21.75 2.998"
              fill="none"
              stroke="#000000"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
            <path
              d="M0.75 7.498L18.75 7.498"
              fill="none"
              stroke="#000000"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
            <path
              d="M0.75 11.998L23.25 11.998"
              fill="none"
              stroke="#000000"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
            <path
              d="M0.75 16.498L18.75 16.498"
              fill="none"
              stroke="#000000"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
            <path
              d="M0.75 20.998L21.75 20.998"
              fill="none"
              stroke="#000000"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
          </g>
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          strokeWidth="1"
          data-align="center"
          data-cy="center"
          className={
            align === 'center'
              ? 'widgetMenuImgSize customClass ' + 'active'
              : 'widgetMenuImgSize customClass ' + 'align'
          }
          onClick={changeAlign}
        >
          <g transform="matrix(0.6666666666666666,0,0,0.6666666666666666,0,0)">
            <path
              d="M2.241 2.998L21.741 2.998"
              fill="none"
              stroke="#000000"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
            <path
              d="M5.241 7.498L18.741 7.498"
              fill="none"
              stroke="#000000"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
            <path
              d="M0.741 11.998L23.241 11.998"
              fill="none"
              stroke="#000000"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
            <path
              d="M5.241 16.498L18.741 16.498"
              fill="none"
              stroke="#000000"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
            <path
              d="M2.241 20.998L21.741 20.998"
              fill="none"
              stroke="#000000"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
          </g>
        </svg>
        {/* <FormatAlignRightIcon
          className={align === 'right' ? 'active' : 'align'}
          data-align="right"
          data-cy="right"
        /> */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          strokeWidth="1"
          data-align="right"
          data-cy="right"
          className={
            align === 'right'
              ? 'widgetMenuImgSize customClass ' + 'active'
              : 'widgetMenuImgSize customClass ' + 'align'
          }
          onClick={changeAlign}
        >
          <g transform="matrix(0.6666666666666666,0,0,0.6666666666666666,0,0)">
            <path
              d="M23 2.998L2 2.998"
              fill="none"
              stroke="#000000"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
            <path
              d="M23 7.498L5 7.498"
              fill="none"
              stroke="#000000"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
            <path
              d="M23 11.998L0.5 11.998"
              fill="none"
              stroke="#000000"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
            <path
              d="M23 16.498L5 16.498"
              fill="none"
              stroke="#000000"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
            <path
              d="M23 20.998L2 20.998"
              fill="none"
              stroke="#000000"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
          </g>
        </svg>
      </Popover>
    </div>
  );
}
