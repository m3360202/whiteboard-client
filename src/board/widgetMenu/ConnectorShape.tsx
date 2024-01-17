import React from 'react';
import { styled } from '@mui/material/styles';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ToggleButton from '@mui/material/ToggleButton';
import ArrowShapeIcon from '../../mui/icons/ArrowShapeIcon';
import { WidgetService } from '../../services';
import ArrowIcon from '../../mui/svg/ArrowIcon';
import store from '../../store';
import { handleSetArrowSize, handleSetArrowStroke, handleSetConnectorShape, handleSetTips } from '../../store/widgets';

export default function ConnectorStyle({ paddingLeft, paddingRight }) {

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onClickConnectorShape = (e, value) => {
    const curShape = value;
    let object;

    if (canvas) {
      object = canvas.getActiveObject();

      let group = null;
      if (canvas.getActiveObjects().length > 1)
        group = canvas.getActiveObject();

      if (!object) {
        return $('#notesMenu').hide();
      }
      if (object) {
        object.connectorShape = curShape;
        object.dirty = true;
        store.dispatch(handleSetConnectorShape(curShape));

        object.saveData('MODIFIED', ['connectorShape']);
      }
      canvas.requestRenderAll();

      if (group && group._objects) {
        group._objects.forEach((obj) => {
          if (obj.obj_type === 'WBArrow') {
            obj.connectorShape = curShape;
            obj.dirty = true;
            canvas.requestRenderAll();
            store.dispatch(handleSetConnectorShape(curShape));
          }
        });
        group.saveData('MODIFIED', ['connectorShape']);
      }
    }
    setAnchorEl(null);
  };

  const handleArrowShapeIconDOM = () => {
    if (
      canvas.getActiveObject() &&
      canvas.getActiveObject().connectorShape === 'straight'
    ) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          strokeWidth="1"
          className="widgetMenuImgSize"
        >
          <g transform="matrix(0.6666666666666666,0,0,0.6666666666666666,0,0)">
            <title>line-1</title>
            <circle className="a" cx="3.75" cy="20.25" r="3" />
            <circle className="a" cx="20.25" cy="3.75" r="3" />
            <line className="a" x1="5.92" y1="18.179" x2="18.132" y2="5.875" />
          </g>
        </svg>
      );
    }else  if (
      canvas.getActiveObject() &&
      canvas.getActiveObject().connectorShape === 'angled'
    ) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        strokeWidth="1"
        className="widgetMenuImgSize"
      >
        <g transform="matrix(0.6666666666666666,0,0,0.6666666666666666,0,0)">
          <title>dynamic-1</title>
          <circle className="a" cx="3.818" cy="20.182" r="3.068" />
          <circle className="a" cx="20.182" cy="3.818" r="3.068" />
          <path
            className="a"
            d="M3.818,17.114v-4.6a1.023,1.023,0,0,1,1.023-1.022H19.159a1.023,1.023,0,0,0,1.023-1.023V6.886"
          />
        </g>
      </svg>
    );
    } else 
    return (
      <svg 
      viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"
      className="widgetMenuImgSize">
         <g transform="matrix(0.6666666666666666,0,0,0.6666666666666666,0,0)">
                   <title>dynamic-1</title>
                   <circle className="a" cx="3.06649" cy="20.182" r="3.068" />
                   <circle className="a" cx="20.182" cy="3.818" r="3.068" />
                   <path
                     className="a" d="M3.06649 16.6715L6.79333 16.6715C9.57576 16.6715 11.8314 14.4159 11.8314 11.6335V11.6335C11.8315 8.85104 14.0871 6.59545 16.8695 6.59545L19.8314 6.59544" stroke="#232930"/>
               </g>
               </svg>
    );

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
          value="connectorShape"
        >
          {handleArrowShapeIconDOM()}
          <ArrowIcon />
        </ToggleButton>
      </div>
      <Menu
        anchorEl={anchorEl}
        id="simple-menu"
        keepMounted
        onClose={handleClose}
        open={Boolean(anchorEl)}
        className="simple-menu"
      >
        <MenuItem
          onClick={(event) => onClickConnectorShape(event, 'straight')}
          className={
            canvas.getActiveObject() &&
            canvas.getActiveObject().connectorShape === 'straight'
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
              <title>line-1</title>
              <circle className="a" cx="3.75" cy="20.25" r="3" />
              <circle className="a" cx="20.25" cy="3.75" r="3" />
              <line
                className="a"
                x1="5.92"
                y1="18.179"
                x2="18.132"
                y2="5.875"
              />
            </g>
          </svg>
        </MenuItem>
        <MenuItem
          onClick={(event) => onClickConnectorShape(event, 'angled')}
          className={
            canvas.getActiveObject() &&
            canvas.getActiveObject().connectorShape === 'angled'
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
              <title>dynamic-1</title>
              <circle className="a" cx="3.818" cy="20.182" r="3.068" />
              <circle className="a" cx="20.182" cy="3.818" r="3.068" />
              <path
                className="a"
                d="M3.818,17.114v-4.6a1.023,1.023,0,0,1,1.023-1.022H19.159a1.023,1.023,0,0,0,1.023-1.023V6.886"
              />
            </g>
          </svg>
        </MenuItem>
        <MenuItem
          onClick={(event) => onClickConnectorShape(event, 'curved')}
          className={
            canvas.getActiveObject() &&
            canvas.getActiveObject().connectorShape === 'curved'
              ? 'Mui-selected'
              : ''
          }
        >
          <svg 
 viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"
 className="widgetMenuImgSize">
    <g transform="matrix(0.6666666666666666,0,0,0.6666666666666666,0,0)">
              <title>dynamic-1</title>
              <circle className="a" cx="3.06649" cy="20.182" r="3.068" />
              <circle className="a" cx="20.182" cy="3.818" r="3.068" />
              <path
                className="a" d="M3.06649 16.6715L6.79333 16.6715C9.57576 16.6715 11.8314 14.4159 11.8314 11.6335V11.6335C11.8315 8.85104 14.0871 6.59545 16.8695 6.59545L19.8314 6.59544" stroke="#232930"/>
          </g>
          </svg>
        </MenuItem>
      </Menu>
    </div>
  );
}
