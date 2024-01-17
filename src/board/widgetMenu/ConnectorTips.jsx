import React, { useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ToggleButton from '@mui/material/ToggleButton';
import ArrowTipIcon from '../../mui/icons/ArrowTipIcon';
import ArrowIcon from '../../mui/svg/ArrowIcon';
import store from '../../store';
import {  handleSetTips } from '../../store/widgets';

export default function ConnectorTips({ paddingLeft, paddingRight }) {


  const [anchorEl, setAnchorEl] = React.useState(null);
  const [tips,setTips] = React.useState(null);
  const [] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChange = (e,value) => {
    onClickConnectorTips(e,value);
  };
  
  useEffect(() => {
    if (canvas.getActiveObject() && canvas.getActiveObject().tips) {
      setTips(canvas.getActiveObject().tips);
    }
    if (canvas.getActiveObjects() && canvas.getActiveObjects().length>0) {
      const tips = canvas.getActiveObjects()[0].tips || 'none';
      setTips(tips);
    }
  }, [tips]);

  const onClickConnectorTips = (e, tip) => {
    const curStyle = tip;

    const object = canvas.getActiveObject();

    let group = null;
    if (canvas.getActiveObject().obj_type === 'WBGroup') group = canvas.getActiveObject();

    if (object && !group) {
      object.tips = curStyle;
      object.dirty = true;
      canvas.requestRenderAll();
      if (object.obj_type === 'WBArrow') {
        store.dispatch(handleSetTips(curStyle));
      }
      object.saveData('MODIFIED', ['tips']);

    }

    if (group && group._objects) {
      group._objects.forEach((obj) => {
        obj.tips = curStyle;
        obj.dirty = true;
        canvas.requestRenderAll();
        if (obj.obj_type === 'WBArrow') {
          store.dispatch(handleSetTips(curStyle));
        }
      });
      group.saveData('MODIFIED', ['tips']);
    }
    setTips(curStyle);
    handleClose();
  };

  const handleArrowTipIconDOM = () => {
    if (tips && tips === 'start') {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          strokeWidth="1"
          className="widgetMenuImgSize"
        >
          <g transform="matrix(0.6666666666666666,0,0,0.6666666666666666,0,0)">
            <title>direction-left</title>
            <line className="a" x1="23.125" y1="12" x2="0.875" y2="12" />
            <polyline className="a" points="7.625 18.5 0.875 12 7.625 5.5" />
          </g>
        </svg>
      );
    }

    if (tips && tips === 'end') {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          strokeWidth="1"
          className="widgetMenuImgSize"
        >
          <g transform="matrix(0.6666666666666666,0,0,0.6666666666666666,0,0)">
            <title>direction-right</title>
            <line className="a" x1="0.875" y1="12" x2="23.125" y2="12" />
            <polyline className="a" points="16.375 5.5 23.125 12 16.375 18.5" />
          </g>
        </svg>
      );
    }

    if (tips && tips === 'both') {
      return <ArrowTipIcon />;
    }

    if (!tips || tips === 'none') {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          className="widgetMenuImgSize"
        >
          <rect width="16" height="15.7811" fill="" />
          <path
            d="M0.583252 7.89062H15.4166"
            stroke="black"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    }
  };

  return (
    <div>
      <div
        className={'customClass'}
        style={{ paddingLeft, paddingRight }}
        onClick={handleClick}
      >
        <ToggleButton
          aria-label="bold"
          sx={{borderRightWidth: 1,
            paddingLeft: 0,
            paddingRight: 0,
            height: 44,}}
          selected={false}
          value="connectorTips"
        >
          {handleArrowTipIconDOM()}
          <ArrowIcon />
        </ToggleButton>
      </div>
      <Menu
        anchorEl={anchorEl}
        id="simple-menu"
        keepMounted
        onChange={handleChange}
        onClose={handleClose}
        open={Boolean(anchorEl)}
        className="simple-menu"
      >
        <MenuItem
          onClick={(event) => onClickConnectorTips(event, 'start')}
          className={
            tips && tips === 'start'
              ? 'Mui-selected'
              : ''
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            strokeWidth="1"
            className="widgetMenuImgSize"
          >
            <g transform="matrix(0.6666666666666666,0,0,0.6666666666666666,0,0)">
              <title>direction-left</title>
              <line className="a" x1="23.125" y1="12" x2="0.875" y2="12" />
              <polyline className="a" points="7.625 18.5 0.875 12 7.625 5.5" />
            </g>
          </svg>
        </MenuItem>
        <MenuItem
          onClick={(event) => onClickConnectorTips(event, 'end')}
          className={
            tips && tips === 'end'
              ? 'Mui-selected'
              : ''
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            strokeWidth="1"
            className="widgetMenuImgSize"
          >
            <g transform="matrix(0.6666666666666666,0,0,0.6666666666666666,0,0)">
              <title>direction-right</title>
              <line className="a" x1="0.875" y1="12" x2="23.125" y2="12" />
              <polyline
                className="a"
                points="16.375 5.5 23.125 12 16.375 18.5"
              />
            </g>
          </svg>
        </MenuItem>
        <MenuItem
          onClick={(event) => onClickConnectorTips(event, 'both')}
          className={
            tips && tips === 'both'
              ? 'Mui-selected'
              : ''
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
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
        </MenuItem>
        <MenuItem
          onClick={(event) => onClickConnectorTips(event, 'none')}
          className={
            tips && tips === 'none'
              ? 'Mui-selected'
              : ''
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className="widgetMenuImgSize"
          >
            <rect width="16" height="15.7811" fill="" />
            <path
              d="M0.583252 7.89062H15.4166"
              stroke="black"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </MenuItem>
      </Menu>
    </div>
  );
}
