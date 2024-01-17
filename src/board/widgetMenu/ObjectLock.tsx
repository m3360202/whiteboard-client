import React from 'react';
import { styled } from '@mui/material/styles';
import { ToggleButton } from '@mui/material';
import { WidgetService } from '../../services';
import showMenu from './ShowMenu';
//** Import Redux kit
import store,{  RootState } from '../../store';
import { useSelector, useDispatch } from 'react-redux';
import { handleSetMenuTouchDisplay } from '../../store/widgets';

export default function ObjectLock({ paddingLeft, paddingRight }) {

  const [anchorEl, setAnchorEl] = React.useState(null);

  const currentLockStatus = useSelector((state: RootState) => state.board.currentLockStatus);


  const handleClick = (event) => {
    event.preventDefault();
    const object = canvas.getActiveObject() || canvas.findTarget(event);
    canvas.defaultCursor = 'default';
    let lockStatus = false;
    let group = null;
    if (canvas.getActiveObjects().length > 1) group = canvas.getActiveObject();

    if (!group) lockStatus = object.locked;
    else lockStatus = canvas.getActiveObject()._objects[1].locked;

    handleLock(object, group, !lockStatus);
    showMenu();
    // canvas.discardActiveObject();
    canvas.requestRenderAll();
    setAnchorEl(event.currentTarget);
    store.dispatch(handleSetMenuTouchDisplay('none'));
  };

  const helperLock = (object, isLocked) => {
    console.log('helperLock', object, isLocked)
    if (object.isActiveSelection()) {
      lockObject(object, isLocked);
      return ;
    }
    if (object) {
      if(!isLocked) {
        canvas.unLockObject(object);
      } else {
        canvas.lockObject(object);
      }
      object.saveData('MODIFIED', [
      'locked',
      'lockMovementX',
      'lockMovementY',
      'selectable',
      'activeSelection',
      'editable',
      'lockScalingX',
      'lockScalingY',
      'lockSkewingX',
      'lockSkewingY',
      'lockRotation',
      'isEditing',
      'shadow',
    ]);
      // lockObject(object, isLocked);
      return;
    }
   
  };

  const handleLock = (object, group, isLocked) => {
    if (!group) {
      helperLock(object, isLocked);
    } else {
      helperLock(group, isLocked);
      group._objects.forEach((obj) => {
        helperLock(obj, isLocked);
      });
    }
  };

  const lockObject = (obj, locked) => {
    // const cursorLock = "data:image/svg+xml,%3Csvg width='10' height='13' viewBox='0 0 10 13' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M4.832 0.755L5 0.75C5.70029 0.749965 6.37421 1.01709 6.8843 1.49689C7.39439 1.97669 7.70222 2.63302 7.745 3.332L7.75 3.5V4H8.5C8.89782 4 9.27936 4.15804 9.56066 4.43934C9.84196 4.72064 10 5.10218 10 5.5V11.5C10 11.8978 9.84196 12.2794 9.56066 12.5607C9.27936 12.842 8.89782 13 8.5 13H1.5C1.10218 13 0.720644 12.842 0.43934 12.5607C0.158035 12.2794 0 11.8978 0 11.5V5.5C0 5.10218 0.158035 4.72064 0.43934 4.43934C0.720644 4.15804 1.10218 4 1.5 4H2.25V3.5C2.24997 2.79971 2.51709 2.12579 2.99689 1.6157C3.47669 1.10561 4.13302 0.797781 4.832 0.755L5 0.75L4.832 0.755ZM5 7.5C4.73478 7.5 4.48043 7.60536 4.29289 7.79289C4.10536 7.98043 4 8.23478 4 8.5C4 8.76522 4.10536 9.01957 4.29289 9.20711C4.48043 9.39464 4.73478 9.5 5 9.5C5.26522 9.5 5.51957 9.39464 5.70711 9.20711C5.89464 9.01957 6 8.76522 6 8.5C6 8.23478 5.89464 7.98043 5.70711 7.79289C5.51957 7.60536 5.26522 7.5 5 7.5ZM5.128 2.256L5 2.25C4.69054 2.24986 4.39203 2.36451 4.16223 2.57177C3.93244 2.77903 3.78769 3.06417 3.756 3.372L3.75 3.5V4H6.25V3.5C6.25014 3.19054 6.13549 2.89203 5.92823 2.66223C5.72097 2.43244 5.43583 2.28769 5.128 2.256L5 2.25L5.128 2.256Z' fill='%23232930'/%3E%3C/svg%3E";
    if (!obj || !canvas) return;

    if (locked) {
      if (obj.isActiveSelection()) {
        for (let objas of obj._objects) {
          canvas.lockObject(objas);
          if (objas.isPanel || objas.obj_type === 'WBRectPanel') {
            objas.setLockedShadow(true);
          }
        }
      }
      canvas.lockObject(obj);
    } else {
      if (obj.isActiveSelection()) {
        for (let objas of obj._objects) {
          canvas.unLockObject(objas);
          if (objas.isPanel || objas.obj_type === 'WBRectPanel') {
            objas.setLockedShadow(false);
          }
        }
      }
      canvas.unLockObject(obj);
    }

    obj.saveData('MODIFIED', [
      'locked',
      'lockMovementX',
      'lockMovementY',
      'selectable',
      'activeSelection',
      'editable',
      'lockScalingX',
      'lockScalingY',
      'lockSkewingX',
      'lockSkewingY',
      'lockRotation',
      'isEditing',
      'shadow',
    ]);

    canvas.requestRenderAll();
  };

  const handleCurrentLockStatusDOM = () =>
    currentLockStatus ? (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 16 16"
        strokeWidth="1"
        className="widgetMenuImgSize"
      >
        <g transform="matrix(0.6666666666666666,0,0,0.6666666666666666,0,0)">
          <path
            stroke="#000000"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M18.75 9.75H5.25C4.42157 9.75 3.75 10.4216 3.75 11.25V21.75C3.75 22.5784 4.42157 23.25 5.25 23.25H18.75C19.5784 23.25 20.25 22.5784 20.25 21.75V11.25C20.25 10.4216 19.5784 9.75 18.75 9.75Z"
          />
          <path
            stroke="#000000"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M6.75 9.75V6C6.75 4.60761 7.30312 3.27226 8.28769 2.28769C9.27226 1.30312 10.6076 0.75 12 0.75C13.3924 0.75 14.7277 1.30312 15.7123 2.28769C16.6969 3.27226 17.25 4.60761 17.25 6V9.75"
          />
          <path
            stroke="#000000"
            strokeWidth="1.5"
            d="M12 16.5C11.7929 16.5 11.625 16.3321 11.625 16.125C11.625 15.9179 11.7929 15.75 12 15.75"
          />
          <path
            stroke="#000000"
            strokeWidth="1.5"
            d="M12 16.5C12.2071 16.5 12.375 16.3321 12.375 16.125C12.375 15.9179 12.2071 15.75 12 15.75"
          />
        </g>
      </svg>
    ) : (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 16 16"
        strokeWidth="1"
        className="widgetMenuImgSize"
      >
        <g transform="matrix(0.6666666666666666,0,0,0.6666666666666666,0,0)">
          <path
            stroke="#000000"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M0.75 9.75V6C0.75 4.60761 1.30312 3.27226 2.28769 2.28769C3.27226 1.30312 4.60761 0.75 6 0.75C7.39239 0.75 8.72774 1.30312 9.71231 2.28769C10.6969 3.27226 11.25 4.60761 11.25 6V9.75"
          />
          <path
            stroke="#000000"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M21.75 9.75H8.25C7.42157 9.75 6.75 10.4216 6.75 11.25V21.75C6.75 22.5784 7.42157 23.25 8.25 23.25H21.75C22.5784 23.25 23.25 22.5784 23.25 21.75V11.25C23.25 10.4216 22.5784 9.75 21.75 9.75Z"
          />
          <path
            stroke="#000000"
            strokeWidth="1.5"
            d="M15 16.5C14.7929 16.5 14.625 16.3321 14.625 16.125C14.625 15.9179 14.7929 15.75 15 15.75"
          />
          <path
            stroke="#000000"
            strokeWidth="1.5"
            d="M15 16.5C15.2071 16.5 15.375 16.3321 15.375 16.125C15.375 15.9179 15.2071 15.75 15 15.75"
          />
        </g>
      </svg>
    );

  return (
    <div
      className={'customClass'}
      style={{ paddingLeft, paddingRight }}
      onClick={handleClick}
    >
      <ToggleButton
        aria-controls="object-lock"
        aria-haspopup="true"
        sx={{border: 'white',
        paddingLeft: 0,
        paddingRight: 0,
        height: 44,}}
        data-cy="lock"
        value="objectLock"
      >
        {handleCurrentLockStatusDOM()}
      </ToggleButton>
    </div>
  );
}
