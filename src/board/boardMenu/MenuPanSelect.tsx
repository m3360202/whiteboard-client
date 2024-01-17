import React from 'react';
import { ToggleButton, Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { changeMode } from '../../store/mode';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';

const HandIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      strokeWidth="1"
      className="menuImgSize svg"
    >
      <g transform="matrix(1,0,0,1,0,0)">
        <path
          d="M1.816,2.8l8.428,19.072a.75.75,0,0,0,1.411-.112l1.884-7.158a1.5,1.5,0,0,1,1.068-1.069l7.158-1.884a.75.75,0,0,0,.113-1.411L2.806,1.814A.75.75,0,0,0,1.816,2.8Z"
          fill="none"
          stroke="#000000"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
      </g>
    </svg>
  );
};

const GeoIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="none"
      className="menuImgSize svg"
    >
      <path
        d="M15.816 4.64167C15.8263 4.29164 15.9991 3.95889 16.2975 3.71444C16.5959 3.46999 16.9962 3.33323 17.4129 3.33333C17.6222 3.33333 17.8294 3.36809 18.0226 3.43562C18.2158 3.50315 18.3912 3.6021 18.5387 3.7268C18.6862 3.85149 18.8029 3.99947 18.882 4.1622C18.9612 4.32493 19.0013 4.4992 19 4.675V14.8C19.0018 15.4002 18.8626 15.9948 18.5902 16.5496C18.3179 17.1045 17.9178 17.6087 17.4129 18.0333C16.3919 18.8907 15.008 19.3732 13.5644 19.375H10.4597C9.40987 19.376 8.37601 19.159 7.45016 18.7431C6.52431 18.3273 5.73519 17.7257 5.15304 16.9917L1.2747 12.1C1.09558 11.8742 1 11.6089 1 11.3375C1 11.0661 1.09558 10.8008 1.2747 10.575V10.575C1.40082 10.4171 1.56456 10.2828 1.75558 10.1808C1.9466 10.0787 2.16074 10.011 2.38447 9.98207C2.6082 9.95309 2.83666 9.96342 3.05539 10.0124C3.27413 10.0614 3.47839 10.148 3.65527 10.2667L6.25405 12.0083V3.33333C6.25405 2.97971 6.42125 2.64057 6.71888 2.39052C7.01651 2.14048 7.42018 2 7.84109 2V2C8.26291 1.99999 8.66761 2.1402 8.96682 2.39001C9.26602 2.63983 9.43543 2.97895 9.43805 3.33333V1.96667C9.43792 1.61654 9.60071 1.28023 9.89167 1.02956C10.1826 0.778884 10.5787 0.633699 10.9953 0.625V0.625C11.4189 0.625 11.8251 0.766354 12.1246 1.01797C12.424 1.26958 12.5923 1.61083 12.5923 1.96667V3.33333C12.5923 2.97971 12.7595 2.64057 13.0571 2.39052C13.3548 2.14048 13.7584 2 14.1793 2V2C14.3915 1.99557 14.6027 2.02672 14.8004 2.09163C14.9981 2.15655 15.1784 2.25392 15.3308 2.37807C15.4831 2.50221 15.6045 2.65063 15.6878 2.81466C15.7712 2.97868 15.8147 3.15501 15.816 3.33333V4.64167Z"
        stroke="black"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.43805 3.3V8.65834"
        stroke="black"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.632 3.3V8.65834"
        stroke="black"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.816 8.65833V4.64166"
        stroke="black"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default function MenuPanSelect() {
  const modeType = useSelector((state: RootState) => state.mode.type);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const handleButtonClick = event => {
    event.preventDefault();
    event.stopPropagation();

    if (modeType === 'pan') {
      dispatch(changeMode('default'));
      canvas.skipTargetFind = false;
        canvas.forEachObject((obj) => {
          obj.selectable = true;
          if(obj.editable === false){
            obj.editable = true;
          } 
        });
      canvas.requestRenderAll();
    } else {
      dispatch(changeMode('pan'));
    }
  };

  return (
    <>
      {modeType === 'pan' ? (
        <Tooltip title={t('board.menu.pan')} placement="top" arrow>
          <ToggleButton
            data-tut="reactour__pan"
            value="default"
            selected={modeType === 'pan'}
            onClick={handleButtonClick}
            style={{ borderRadius: '8px 0 0 0' }}
          >
            <GeoIcon />
          </ToggleButton>
        </Tooltip>
      ) : (
        <Tooltip title={t('board.menu.navigate')} placement="top" arrow>
          <ToggleButton
            data-tut="reactour__pan"
            selected={modeType === 'default'}
            value="pan"
            onClick={handleButtonClick}
            style={{ borderRadius: '8px 0 0 0' }}
          >
            <HandIcon />
          </ToggleButton>
        </Tooltip>
      )}
    </>
  );
}
