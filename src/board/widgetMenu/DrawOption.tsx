import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import { styled } from '@mui/material/styles';
import React from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

const PREFIX = 'DrawOption';

const classes = {
  widget: `${PREFIX}-widget`,
  align: `${PREFIX}-align`,
  createOutButton: `${PREFIX}-createOutButton`
};

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
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

  [`& .${classes.createOutButton}`]: {
    borderRightWidth: 1,
    width: 48,
    pading: 0, //
    paddingLeft: 0,
    paddingRight: 0,
    height: 44,
  }
}));

export default function ({ paddingLeft, paddingRight }) {


  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const handleDrawBrushChange = (event, newMode) => {
    event.preventDefault();

    const target = canvas.getActiveObject();
    localStorage.setItem('drawMode', newMode);
    if (target && target.setBrushByName)
      target.setBrushByName(canvas.notesDrawCanvas, newMode);

    handleClose();
  };

  return (
    <Root>
      <div
        className={'customClass'}
        style={{ paddingLeft, paddingRight }}
        onClick={handleClick}
      >
        <ToggleButton
          aria-label="bold"
          className={classes.createOutButton}
          selected={false}
          value="alignGroup"
        >
          <CreateOutlinedIcon />
        </ToggleButton>
      </div>
      <Menu
        anchorEl={anchorEl}
        id="simple-menu"
        keepMounted
        onClose={handleClose}
        open={Boolean(anchorEl)}
      >
        <MenuItem
          key={100}
          onClick={(event) => handleDrawBrushChange(event, 'Pencil')}
        >
          Pencil
        </MenuItem>
        <MenuItem
          key={1}
          onClick={(event) => handleDrawBrushChange(event, 'Circle')}
        >
          Circle
        </MenuItem>
        <MenuItem
          key={2}
          onClick={(event) => handleDrawBrushChange(event, 'Spray')}
        >
          Spray
        </MenuItem>
      </Menu>
    </Root>
  );
}
