import React from 'react';
import { styled } from '@mui/material/styles';
import TextFieldsOutlinedIcon from '@mui/icons-material/TextFieldsOutlined';
import ToggleButton from '@mui/material/ToggleButton';
import showMenu from './ShowMenu';

const PREFIX = 'TextNote';

const classes = {
  widget: `${PREFIX}-widget`,
  align: `${PREFIX}-align`,
  textFieldButton: `${PREFIX}-textFieldButton`
};

const Root = styled('div')((
  {
    theme
  }
) => ({
  [`& .${classes.widget}`]: {
    display: 'block',
    position: 'absolute',
    top: '60px',
    left: '50%',
    margin: '0 0 0 -64px',
    padding: '5px 0',
    background: '#FFFFFF',
    boxShadow: '0px 1px 3px 2px #00000014',
    borderRadius: '4px',
    width: '128px',
    height: '48px',
  },

  [`& .${classes.align}`]: {
    width: '36',
    margin: '8px',
  },

  [`& .${classes.textFieldButton}`]: {
    borderRightWidth: 1,
    width: 40,
  }
}));

export default function TextNote () {


  const onClickTextNote = (e) => {
    e.preventDefault();
    const el = $(e.currentTarget);
    const menu = $('#notesMenu');
    const widget = canvas.getActiveObject();

    if (
      widget.obj_type !== 'WBRectNotes' &&
      widget.obj_type !== 'WBCircleNotes'
    ) {
      menu.hide();
      return;
    }

    const { defaultNote } = canvas;
    defaultNote.isDraw = false;
    canvas.changeDefaulNote(defaultNote);

    el.parent().hide();

    widget.set('isDraw', false);
    widget.dirty = true;

    widget.saveData('MODIFIED', ['isDraw']);
    canvas.unlockObjectsInCanvas();
    $('#notesDrawCanvas').hide();
    $('#notesDrawCanvas').next().hide();
    canvas.requestRenderAll();
    showMenu();
  };

  return (
    <Root>
      <ToggleButton
        aria-label="bold"
        className={classes.textFieldButton}
        onClick={onClickTextNote}
        selected={false}
        value="textNote"
      >
        <TextFieldsOutlinedIcon />
      </ToggleButton>
    </Root>
  );
}
