import React from 'react';
import { styled } from '@mui/material/styles';
import ToggleButton from '@mui/material/ToggleButton';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';

export default function TextBullet({ text }) {

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    const object = canvas.getActiveObject();
    let newText = object.text;
    let isBullet = false;
    if (newText[0] !== '•') isBullet = true;
    if (isBullet) {
      newText = `• ${newText}`;
      newText = Boardx.Util.replaceAll(newText, '\n', '\n• ');
    } else {
      newText = Boardx.Util.replaceAll(newText, '• ', '');
    }
    object.set('text', newText);
    object.saveData('MODIFIED', ['text']);
    canvas.requestRenderAll();
    setAnchorEl(event.currentTarget);
  };

  return (
    <div style={{ width: 40, }}>
      <ToggleButton
        aria-controls="text-bullet"
        aria-haspopup="true"
        sx={{
          borderRightWidth: 0,
          width: 40,
        }}
        data-cy="FontSize"
        onClick={handleClick}
        value="textBullet"
      >
        <FormatListBulletedIcon />
      </ToggleButton>
    </div>
  );
}
