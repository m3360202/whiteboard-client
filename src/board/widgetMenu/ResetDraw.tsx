import React from 'react';
import { styled } from '@mui/material/styles';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import ToggleButton from '@mui/material/ToggleButton';

import Box from '@mui/material/Box';

export default function ResetDraw (props) {


  const handleResetDraw = (e) => {
    e.preventDefault();
    const object = canvas.getActiveObject();
    if (object && object.obj_type === 'WBRectNotes' && object.isDraw === true) {
    }
  };

  return (
    <Box className={'customClass'} {...props}>
      <ToggleButton
        aria-label="bold"
       sx={{borderRightWidth: 1,
        paddingLeft: 0,
        paddingRight: 0,
        height: 44,}}
        onClick={handleResetDraw}
        selected={false}
        value="backgroundColor"
      >
        <RefreshOutlinedIcon />
      </ToggleButton>
    </Box>
  );
}
