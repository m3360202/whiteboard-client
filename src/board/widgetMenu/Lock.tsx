import React from 'react';
import { styled } from '@mui/material/styles';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
//import { Lock } from '@mui/icons-material';
import ToggleButton from '@mui/material/ToggleButton';

export default function Lock () {


  const onClickApplyFormat = (e) => {
    e.preventDefault();
    const object = canvas.getActiveObject();

    const { scaleX, scaleY, backgroundColor, fill, fontFamily, fontSize } =
      canvas.defaultNote;

    let group = null;
    if (canvas.getActiveObjects().length > 1) group = canvas.getActiveObject();

    if (!object) {
      return $('#notesMenu').hide();
    }

    if (!group) {
      object.set({
        scaleX,
        scaleY,
        backgroundColor,
        fill,
        fontFamily,
        fontSize,
      });
      object.saveData('MODIFIED', [
        'scaleX',
        'scaleY',
        'backgroundColor',
        'fill',
        'fontFamily',
        'fontSize',
      ]);
    } else {
      group._objects.forEach((obj) => {
        obj.set({
          scaleX,
          scaleY,
          backgroundColor,
          fill,
          fontFamily,
          fontSize,
        });
      });
      group.saveData('MODIFIED', [
        'scaleX',
        'scaleY',
        'backgroundColor',
        'fill',
        'fontFamily',
        'fontSize',
      ]);
    }
    canvas.requestRenderAll();

    if (canvas.getActiveObject().hiddenTextarea)
      canvas.getActiveObject().hiddenTextarea.focus();
  };

  return (
    <div>
      <ToggleButton
        aria-label="bold"
        sx={{    borderRightWidth: 1,
          width: 40,}}
        onClick={onClickApplyFormat}
        selected={false}
        value="backgroundColor"
      >
        <LockOpenOutlinedIcon />
      </ToggleButton>
    </div>
  );
}
