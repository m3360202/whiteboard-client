//** Import react
import React from 'react';

//** Import Redux kit
import { RootState } from '../../store';
import { handleSetOpenResources } from '../../store/sideBar';
import { useSelector, useDispatch } from 'react-redux';
import {  handleSetOpenTemplate } from '../../store/resource';
//** Import Mui
import { Popover, Tooltip, ToggleButton } from '@mui/material';
import MenuResourcesPage from './MenuResourcesPage';

import { useTranslation } from 'react-i18next';

//**Import Services
import { WidgetService, BoardService } from '../../services';
import { changeMode } from '../../store/mode';
import store from '../../store';
import { handleSetIsPanMode,handleSetBoardPanelClicked,handleSetDrawingEraseMode } from '../../store/board';
const ResourceIcon = props => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_2802_3997)">
      <path
        d="M7.97084 11.1958H1.66668C1.20644 11.1958 0.833344 11.5689 0.833344 12.0291V18.3333C0.833344 18.7935 1.20644 19.1666 1.66668 19.1666H7.97084C8.43108 19.1666 8.80418 18.7935 8.80418 18.3333V12.0291C8.80418 11.5689 8.43108 11.1958 7.97084 11.1958Z"
        stroke="#150D33"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.3692 9.20254H11.1958C11.0617 9.20578 10.929 9.17412 10.8108 9.11068C10.6925 9.04723 10.5928 8.95417 10.5213 8.84061C10.4498 8.72705 10.409 8.59687 10.403 8.46282C10.3969 8.32877 10.4257 8.19544 10.4867 8.07588L14.0742 1.25504C14.1435 1.12774 14.2459 1.02148 14.3706 0.947453C14.4952 0.873421 14.6375 0.834351 14.7825 0.834351C14.9275 0.834351 15.0698 0.873421 15.1944 0.947453C15.3191 1.02148 15.4215 1.12774 15.4908 1.25504L19.0742 8.07588C19.1349 8.19512 19.1638 8.32806 19.1579 8.46175C19.152 8.59544 19.1116 8.72533 19.0406 8.83878C18.9696 8.95222 18.8705 9.04535 18.7528 9.1091C18.6351 9.17285 18.503 9.20504 18.3692 9.20254V9.20254Z"
        stroke="#150D33"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19.1667 15.1812C19.1667 12.9801 17.3823 11.1958 15.1812 11.1958C12.9802 11.1958 11.1958 12.9801 11.1958 15.1812C11.1958 17.3823 12.9802 19.1666 15.1812 19.1666C17.3823 19.1666 19.1667 17.3823 19.1667 15.1812Z"
        stroke="#150D33"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.81585 8.52331C5.74108 8.60836 5.64904 8.67649 5.54587 8.72316C5.44269 8.76984 5.33075 8.79398 5.21751 8.79398C5.10427 8.79398 4.99233 8.76984 4.88916 8.72316C4.78599 8.67649 4.69395 8.60836 4.61918 8.52331L1.38668 4.85664C0.998529 4.36273 0.803049 3.74461 0.836621 3.11732C0.870193 2.49003 1.13053 1.89631 1.56918 1.44664C1.7757 1.23688 2.02491 1.07397 2.2999 0.968967C2.5749 0.86396 2.86926 0.819309 3.16303 0.83804C3.4568 0.856771 3.74311 0.938446 4.00254 1.07753C4.26198 1.21661 4.48847 1.40985 4.66668 1.64414L5.22001 2.33081L5.77335 1.64414C5.95139 1.41015 6.1776 1.21711 6.43667 1.07806C6.69575 0.93902 6.98165 0.857213 7.27506 0.838174C7.56848 0.819134 7.86255 0.863306 8.13743 0.967703C8.4123 1.0721 8.66155 1.23429 8.86835 1.44331C9.30704 1.89299 9.56733 2.4868 9.60075 3.11413C9.63417 3.74146 9.43844 4.35956 9.05001 4.85331L5.81585 8.52331Z"
        stroke="#150D33"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <clipPath id="clip0_2802_3997">
        <rect width="20" height="20" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default function MenuResources() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const modeType = useSelector((state: RootState) => state.mode.type);

  const isOpenResources = useSelector(
    (state: RootState) => state.sideBar.openResources
  );

  const handleClose = () => {
    dispatch(changeMode('default'));
    dispatch(handleSetOpenResources(false));
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    store.dispatch(handleSetIsPanMode(false));
    dispatch(handleSetOpenTemplate(false));
    BoardService.getInstance().resetBoardMenuEvents();
    setTimeout(() => window.dispatchEvent(new CustomEvent('resize')), 0);
    if (!isOpenResources) {
      dispatch(handleSetOpenResources(true));
      
      store.dispatch(handleSetDrawingEraseMode(false));
      store.dispatch(handleSetBoardPanelClicked(false));
    } else {
      dispatch(handleSetOpenResources(false));
    }

    dispatch(changeMode('resource'));
  };

  return (
    <>
      <Tooltip
        title={t('board.contextMenu.resources')}
        placement="top"
        arrow
      >
        <ToggleButton
          id="MenuTemplateNewPage"
          selected={modeType === 'resource'}
          value="resource"
          onClick={handleClick}
          style={{ borderRadius: '0 0 0 0' }}
        >
          <ResourceIcon />
        </ToggleButton>
      </Tooltip>

      <Popover
        anchorEl={document.getElementById('MenuTemplateNewPage')}
        open={isOpenResources}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: 620,
          horizontal: 'center'
        }}
      >
        <MenuResourcesPage handleShowClose={handleClose} />
      </Popover>
    </>
  );
}
