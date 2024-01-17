import { MenuItem, ToggleButton, Tooltip } from '@mui/material';
import { CirclePicker, ColorResult } from 'react-color';
import {
  updateStickNoteType,
  updateStickNoteBackgroundColor,
  updateStickyNoteMenuBarOpenStatus
} from '../../store/widget/stickNote';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { RootState } from '../../store';
import React, { useState } from 'react';
import { changeMode } from '../../store/mode';
import store from '../../store';
import { getStickNoteOptions } from '../../store/widget/stickNote';
import {  WidgetService } from '../../services';
import * as fabric  from '@boardxus/x-canvas';
//import MenuDragWrap from './MenuDragWrap';
import { stickyNoteColorSeriesOne } from '../../util/stickynoteColor';
import { styled } from '@mui/material/styles';
import { handleSetMenuFontWeight } from '../../store/widgets';

export const UpArrow = () => (
  <svg
    width="8"
    height="5"
    viewBox="0 0 8 5"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0.25 4.72966L3.82333 1.15666C3.84652 1.13343 3.87406 1.11501 3.90437 1.10244C3.93469 1.08987 3.96718 1.0834 4 1.0834C4.03282 1.0834 4.06531 1.08987 4.09563 1.10244C4.12594 1.11501 4.15348 1.13343 4.17667 1.15666L7.75 4.72966"
      stroke="#150D33"
      strokeWidth="0.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const Square = props => {
  const { color } = props;
  return (
    <svg
      width="42"
      height="42"
      viewBox="0 0 42 42"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M42 0H0V37L5 42H42V0Z" fill={color} />
      <path d="M0 37H5V42L0 37Z" fill={color} />
      <path d="M0 37H5V42L0 37Z" fill="black" fillOpacity="0.2" />
    </svg>
  );
};

export const Rectangle = props => {
  const { color } = props;
  return (
    <svg
      width="42"
      height="30"
      viewBox="0 0 42 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M42 0H0V25L5 30H42V0Z" fill={color} />
      <path d="M0 25H5V30L0 25Z" fill={color} />
      <path d="M0 25H5V30L0 25Z" fill="black" fillOpacity="0.2" />
    </svg>
  );
};

export const Circle = props => {
  const { color } = props;
  return (
    <svg
      width="42"
      height="42"
      viewBox="0 0 42 42"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M42 21C42 32.598 32.598 42 21 42L0 21C0 9.40202 9.40202 0 21 0C32.598 0 42 9.40202 42 21Z"
        fill={color}
      />
      <path
        d="M21 42C21 30.402 11.2239 21 0 21L21 42Z"
        fill="black"
        fillOpacity="0.15"
      />
    </svg>
  );
};

export const handleStickyNoteDragEnd = () => {
  const stickNoteInfo = store.getState().widget.stickNote;
  const position = canvas.getPointer(canvas.dragOverEvent);
  const options = getStickNoteOptions(
    stickNoteInfo.noteType,
    stickNoteInfo.backgroundColor,
    position
  );
  const widget =
    options.noteType === 'circle'
      ? new fabric.CircleNotes('', options)
      : new fabric.RectNotes('', options);
  canvas.add(widget);
  canvas.setActiveObject(widget);
  canvas.requestRenderAll();

  if (widget.lastEditedBy === 'AI') {
    widget.author = 'AI';
  }

  store.dispatch(handleSetMenuFontWeight(400));
  WidgetService.getInstance().insertWidget(widget.getObject());

  canvas.pushNewState([
    {
      targetId: widget._id,
      activeselection: true,
      newState: widget.getObject(),
      action: 'ADDED'
    }
  ]);
};

const StickyNoteMenu = () => {
  const [defaultColor, selectedColor] = ['#B8B8B8', '#354858'];
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const backgroundColor = useSelector(
    (state) => state.widget.stickNote.backgroundColor
  );
  const noteType = useSelector(
    (state) => state.widget.stickNote.noteType
  );
  const modeType = useSelector((state) => state.mode.type);
  const menuBarOpen = useSelector(
    (state) => state.widget.stickNote.menuBarOpen
  );

  const handleColorChange = (color) => {
    dispatch(updateStickNoteBackgroundColor(color.hex));
    dispatch(changeMode('stickNote'));
  };

  const handleNoteTypeChange = type => {
    dispatch(updateStickNoteType(type));
    dispatch(changeMode('stickNote'));
  };

  const handleOpenStickNoteToolBar = (e) => {
    e.stopPropagation();
    canvas.discardActiveObject();
    dispatch(changeMode('default'));
    dispatch(updateStickyNoteMenuBarOpenStatus(!menuBarOpen));
  };

  const handleCloseStickNoteToolBar = (e) => {
    e.stopPropagation();
    dispatch(updateStickyNoteMenuBarOpenStatus(!menuBarOpen));
  }

  const noteColors = stickyNoteColorSeriesOne.slice(0, 7);

  const handleIconClick = () => {
    dispatch(changeMode('stickNote'));
  };

  const StickNoteIcon = () => {
    switch (noteType) {
      case 'rect':
        return <Rectangle className="menuImgSize" color={backgroundColor} />;
      case 'circle':
        return <Circle className="menuImgSize" color={backgroundColor} />;
      case 'square':
        return <Square className="menuImgSize" color={backgroundColor} />;
    }
  };

  return (
    <>
      <Tooltip title={t('board.menu.stickyNotes')} placement="top" arrow>
        <ToggleButton
          id="stickNoteBtn"
          value="stickynote"
          data-tut="reactour__note"
          selected={modeType === 'stickNote'}
          onClick={handleIconClick}
          sx={{ pr: 0, position: 'relative' }}
        >
          <>
            <div
              className="mainBtn"
              style={{ marginRight: '5px', justifyContent: 'flex-start' }}
            >
              {/*<MenuDragWrap onDragEnd={handleStickyNoteDragEnd}>*/}
              <StickNoteIcon />
              {/*</MenuDragWrap>*/}
            </div>
            <div
              className="optionsBtn"
              style={{
                position: 'absolute',
                right: '0',
                top: '0',
                paddingTop: '11px',
                height: '58px',
                paddingRight: '11px'
              }}
              onClick={handleOpenStickNoteToolBar}
            >
              <UpArrow />
            </div>
          </>
        </ToggleButton>
      </Tooltip>

      <StickyNoteMenuWrap style={{ display: menuBarOpen ? 'flex' : 'none' }}>
        <MenuItem
          onClick={() => {
            handleNoteTypeChange('rect');
          }}
        >
          <Rectangle
            color={noteType === 'rect' ? selectedColor : defaultColor}
          />
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleNoteTypeChange('square');
          }}
        >
          <Square
            color={noteType === 'square' ? selectedColor : defaultColor}
          />
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleNoteTypeChange('circle');
          }}
        >
          <Circle
            color={noteType === 'circle' ? selectedColor : defaultColor}
          />
        </MenuItem>
        <MenuItem
          style={{ paddingLeft: 16, paddingRight: 0 }}
          sx={{ '&:hover': { backgroundColor: 'transparent' } }}
        >
          <CirclePicker
            circleSize={25}
            color={backgroundColor}
            colors={noteColors}
            width={'285px'}
            onChange={(color) => handleColorChange(color)}
          />
        </MenuItem>
        <MenuItem sx={{ p: 0 }} onClick={handleCloseStickNoteToolBar}>
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
        </MenuItem>
      </StickyNoteMenuWrap>
    </>
  );
};

const StickyNoteMenuWrap = styled('div')`
  position: fixed;
  bottom: 74px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  overflow: hidden;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 0 5px #ddd;
`;

export default StickyNoteMenu;
