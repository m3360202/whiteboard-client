import React from 'react';
import { styled } from '@mui/material/styles';
import LineStyleOutlinedIcon from '@mui/icons-material/LineStyleOutlined';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ToggleButton from '@mui/material/ToggleButton';
import ArrowIcon from '../../mui/svg/ArrowIcon';

const PREFIX = 'ConnectorStyle';

const classes = {
  widget: `${PREFIX}-widget`,
  align: `${PREFIX}-align`,
  lineStyleButton: `${PREFIX}-lineStyleButton`
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

  [`& .${classes.lineStyleButton}`]: {
    borderRightWidth: 1,
    width: 40,
    paddingLeft: 0,
    paddingRight: 0,
    height: 44,
  }
}));

export default function ConnectorStyle({ paddingLeft, paddingRight }) {


  const [anchorEl, setAnchorEl] = React.useState(null);

  const [] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpen(false);
  };

  const onClickConnectorStyle = (e, value) => {
    const curStyle = value;
    let object;

    if (canvas) {
      object = canvas.getActiveObject();
      let group = null;
      if (canvas.getActiveObjects().length > 1)
        group = canvas.getActiveObject();
      menu = $('#notesMenu');

      if (!object) {
        return menu.hide();
      }
      if (object) {
        object.set('connectorStyle', curStyle);
        object.saveData('MODIFIED', ['connectorStyle']);
      }
      canvas.requestRenderAll();

      if (group && group._objects) {
        group._objects.forEach((obj) => {
          object.set('connectorStyle', curStyle);
        });
        group.saveData('MODIFIED', ['connectorStyle']);
      }
    }

    setAnchorEl(null);
  };

  const handleChange = (e) => {
    onClickConnectorStyle(e);
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
          className={classes.lineStyleButton}
          id="conStyle"
          selected={false}
          value="connectorStyle"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="none"
            className="widgetMenuImgSize"
          >
            <path
              d="M0.583252 8H15.4166"
              stroke="black"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10.9165 3.66675L15.4165 8.00008L10.9165 12.3334"
              stroke="black"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M15.4166 8H0.583252"
              stroke="black"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M5.08325 12.3334L0.583252 8.00008L5.08325 3.66675"
              stroke="black"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </ToggleButton>
      </div>
      <Menu
        anchorEl={anchorEl}
        id="simple-menu"
        className="simple-menu"
        keepMounted
        onChange={handleChange}
        onClose={handleClose}
        open={Boolean(anchorEl)}
      >
        <MenuItem onClick={(event) => onClickConnectorStyle(event, 'solid')}>
          Solid
        </MenuItem>
        <MenuItem onClick={(event) => onClickConnectorStyle(event, 'dashed')}>
          Dashed
        </MenuItem>
        <MenuItem onClick={(event) => onClickConnectorStyle(event, 'dotted')}>
          Dotted
        </MenuItem>
      </Menu>
    </Root>
  );
}
