/* eslint-disable func-names */
/* eslint-disable max-len */
/* eslint-disable consistent-return */
/* eslint-disable no-undef */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Popover from '@mui/material/Popover';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import LineWeightIcon from '@mui/icons-material/LineWeight';
import ToggleButton from '@mui/material/ToggleButton';
import WidgetService from '../../services/WidgetService';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ArrowIcon from '../../mui/svg/ArrowIcon';
import store from '../../store';
import { handleSetArrowSize } from '../../store/widgets';
import Box from '@mui/material/Box';
import clsx from 'clsx';

const PrettoSlider = Slider;

export default function LineWidth ({ paddingLeft, paddingRight }) {
  //

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [widthValue, setWidthValue] = React.useState(null);

  const activeObject = canvas.getActiveObject();
  if (activeObject && activeObject.obj_type == 'WBShapeNotes') {
    const lineWidth = canvas.getActiveObject().lineWidth;

    useEffect(() => {
      setWidthValue(lineWidth);
    }, [lineWidth]);
  } else {
    const strokeWidth = canvas.getActiveObject()
      ? canvas.getActiveObject().strokeWidth
      : 4;

    useEffect(() => {
      setWidthValue(strokeWidth);
    }, [strokeWidth]);
  }

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const getwidthchanged = e => {
    const object = canvas.getActiveObject();
    let group = null;
    if (canvas.getActiveObjects().length > 1) group = canvas.getActiveObject();

    if (!group) {
      if (object.obj_type === 'WBShapeNotes') {
        object.saveData('MODIFIED', ['fixedLineWidth', 'lineWidth']);
      } else {
        object.saveData('MODIFIED', ['strokeWidth']);
      }
    } else {
      group.saveData('MODIFIED', ['strokeWidth']);
    }
    canvas.requestRenderAll();
  };

  const onChangeLineWidth = (e, value) => {
    setWidthValue(value);

    const object = canvas.getActiveObject();

    let group = null;
    if (canvas.getActiveObjects().length > 1) group = canvas.getActiveObject();

    if (!object) {
      return $('#notesMenu').hide();
    }

    const arrowLineWidth = value;
    localStorage.setItem('arrowLineWidth', arrowLineWidth);

    if (!group) {
      if (
        canvas &&
        canvas.getActiveObject() &&
        canvas.getActiveObject().obj_type === 'WBRectNotes'
      ) {
        if (
          canvas &&
          canvas.notesDrawCanvas &&
          canvas.notesDrawCanvas.freeDrawingBrush
        ) {
          canvas.notesDrawCanvas.freeDrawingBrush.width = arrowLineWidth;
        }
      } else {
        if (object.obj_type === 'WBShapeNotes') {
          object.set('fixedLineWidth', arrowLineWidth);
          object.set('lineWidth', arrowLineWidth / object.scaleX);
          object.set('dirty', true);
        } else if (object.obj_type === 'WBArrow') {
          object.set('strokeWidth', arrowLineWidth);
          store.dispatch(handleSetArrowSize(arrowLineWidth));
        } else object.set('strokeWidth', arrowLineWidth);
      }
    } else {
      group._objects.forEach(obj => {
        const strokeWidth = arrowLineWidth;
        if (obj.obj_type === 'WBShapeNotes') {
          obj.set('fixedLineWidth', arrowLineWidth);
          obj.set('lineWidth', arrowLineWidth / obj.scaleX);
          obj.set('dirty', true);
        } else if (obj.obj_type === 'WBArrow') {
          obj.set('strokeWidth', arrowLineWidth);
          store.dispatch(handleSetArrowSize(arrowLineWidth));
        } else {
          obj.set('strokeWidth', arrowLineWidth);
        }

        if (
          canvas &&
          canvas.getActiveObject() &&
          canvas.getActiveObject().obj_type === 'WBRectNotes'
        ) {
          if (
            canvas &&
            canvas.notesDrawCanvas &&
            canvas.notesDrawCanvas.freeDrawingBrush
          ) {
            canvas.notesDrawCanvas.freeDrawingBrush.width = arrowLineWidth;
          }
        }
      });
    }
    canvas.requestRenderAll();
  };

  return (
    <Box sx={{'.popover':{ '& .MuiPopover-paper': {
      width: '170px',
      height: '75px'}},
      '.selected':{backgroundColor: '#D3F3F3 !important'}
      }}>
      <div
        className={'customClass'}
        style={{ paddingLeft, paddingRight }}
        onClick={handleClick}
      >
        <ToggleButton
          aria-label="bold"
          sx={{   borderRightWidth: 1,
            padding: 0,
            paddingLeft: 0,
            paddingRight: 0,
            height: 44}}
          selected={false}
          value="LineWidth"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_132_390)">
              <path
                d="M0.5 1.99866H15.5"
                stroke="black"
                strokeLinecap="square"
                strokeLinejoin="round"
              />
              <path
                d="M0.5 7.99866H15.5"
                stroke="black"
                strokeWidth="1.5"
                strokeLinecap="square"
                strokeLinejoin="round"
              />
              <path
                d="M0.5 13.9987H15.5"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="square"
                strokeLinejoin="round"
              />
            </g>
            <defs>
              <clipPath id="clip0_132_390">
                <rect width="16" height="16" fill="white" />
              </clipPath>
            </defs>
          </svg>
          <ArrowIcon />
        </ToggleButton>

      </div>
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        className={clsx('popover', 'simple-menu')}
        id={id}
        onClose={handleClose}
        open={open}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
      >
        <MenuItem
          onClick={event => {
            onChangeLineWidth(event, 2);
            getwidthchanged(event);
            handleClose();
          }}
          className={widthValue === 2 ? 'selected' : ''}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className="widgetMenuImgSize"
          >
            <rect y="6" width="16" height="2" fill="#150D33" />
          </svg>
        </MenuItem>
        <MenuItem
          onClick={event => {
            onChangeLineWidth(event, 4);
            getwidthchanged(event);
            handleClose();
          }}
          className={widthValue === 4 ? 'selected' : ''}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className="widgetMenuImgSize"
          >
            <rect y="4" width="16" height="4" fill="#150D33" />
          </svg>
        </MenuItem>
        <MenuItem
          onClick={event => {
            onChangeLineWidth(event, 8);
            getwidthchanged(event);
            handleClose();
          }}
          className={widthValue === 8 ? 'selected' : ''}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className="widgetMenuImgSize"
          >
            <rect y="2" width="16" height="8" fill="#150D33" />
          </svg>
        </MenuItem>
      </Menu>
    </Box>
  );
}
