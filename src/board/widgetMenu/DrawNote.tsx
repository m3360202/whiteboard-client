import React from 'react';
import { styled } from '@mui/material/styles';
import BrushOutlinedIcon from '@mui/icons-material/BrushOutlined';
import ToggleButton from '@mui/material/ToggleButton';
import showMenu from './ShowMenu';

const PREFIX = 'DrawNote';

const classes = {
  widget: `${PREFIX}-widget`,
  align: `${PREFIX}-align`,
  btushOutButton: `${PREFIX}-btushOutButton`
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

  [`& .${classes.btushOutButton}`]: {
    borderRightWidth: 1,
    width: 40,
  }
}));

export default function DrawNote() {

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [] = React.useState(null);

  const open = Boolean(anchorEl);

  const onClickSwitchToDrawMode = (e) => {
    e.preventDefault();
    const widget = canvas.getActiveObject();

    widget.initializeDrawOnStickyNote();
    showMenu();
  };

  return (
    <Root>
      <ToggleButton
        aria-label="bold"
        className={classes.btushOutButton}
        data-cy="DrawMode"
        onClick={onClickSwitchToDrawMode}
        selected={false}
        value="backgroundColor"
      >
        <BrushOutlinedIcon />
      </ToggleButton>
    </Root>
  );
}
