import { MenuItem, Popover } from '@mui/material';
import { CirclePicker, ColorResult } from 'react-color';
import {
  SmallNoteSvg,
  LagerNoteSvg,
  CircleNoteSvg,
} from '../../svg/widgetToolBarMenuSvg';
import { NoteType, WidgetType } from '../../../definition/widget/widgetType';
import { updateStickNoteInfo } from '../../../store/widget/stickNote'; //there has an error
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import React from 'react';
import { stickyNoteColorSeriesOne } from '../../../util/stickynoteColor';

const StickyNotes = (props) => {
  const noteColors = [
    '#FCEC8A',
    ...stickyNoteColorSeriesOne.slice(0, 7)
  ];

  const { anchorEl, setAnchorEl } = props;
  const backgroundColor = useSelector(
    (state) => state.widget.stickNote.backgroundColor,
  );
  const noteType = useSelector(
    (state) => state.widget.stickNote.noteType,
  );

  const [defaultColor, selectedColor] = ['#B8B8B8', '#354858'];
  const dispatch = useDispatch();

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleColorChange = (color) => {
    dispatch(
      updateStickNoteInfo([
        {
          key: 'backgroundColor',
          value: color.hex,
        },
      ]),
    );

    handleClose();
  };

  const handleNoteTypeChange = (type) => {
    dispatch(
      updateStickNoteInfo([
        {
          key: 'obj_type',
          value:
            type === NoteType.CIRCLE
              ? WidgetType.WBCircleNotes
              : WidgetType.WBRectNotes,
        },
        {
          key: 'noteType',
          value: type,
        },
      ]),
    );

    handleClose();
  };

  return (
    <Popover
      id="sticky-notes-popover"
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      transformOrigin={{ vertical: 70, horizontal: 180 }}
      sx={{ ml: 2, zIndex: 0 }}
    >
      <div style={{ display: 'flex', overflow: 'hidden' }}>
        <MenuItem
          style={{ paddingLeft: 8, paddingRight: 8 }}
          onClick={() => {
            handleNoteTypeChange(NoteType.RECT);
          }}
        >
          <LagerNoteSvg
            color={noteType === NoteType.RECT ? selectedColor : defaultColor}
          />
        </MenuItem>
        <MenuItem
          style={{ paddingRight: 8 }}
          onClick={() => {
            handleNoteTypeChange(NoteType.SQUARE);
          }}
        >
          <SmallNoteSvg
            color={noteType === NoteType.SQUARE ? selectedColor : defaultColor}
          />
        </MenuItem>

        <MenuItem
          style={{ paddingLeft: 8 }}
          onClick={() => {
            handleNoteTypeChange(NoteType.CIRCLE);
          }}
        >
          <CircleNoteSvg
            color={noteType === NoteType.CIRCLE ? selectedColor : defaultColor}
          />
        </MenuItem>
        <MenuItem style={{ paddingLeft: 0, paddingRight: 0 }}>
          <img
            src="/images/board/line.png"
            alt=""
            style={{ width: '0.5px', height: '1.5rem' }}
          />
        </MenuItem>
        <MenuItem
          style={{ paddingLeft: 16, paddingRight: 0 }}
          sx={{
            '&:hover': { backgroundColor: 'transparent' },
          }}
        >
          <CirclePicker
            circleSize={25}
            color={backgroundColor}
            colors={noteColors}
            width={'330px'}
            onChange={(color) => handleColorChange(color)}
          ></CirclePicker>
        </MenuItem>
      </div>
    </Popover>
  );
};

export default StickyNotes;
