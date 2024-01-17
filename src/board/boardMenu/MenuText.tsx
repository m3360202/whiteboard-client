import React from 'react';
import { useTranslation } from 'react-i18next';
import { ToggleButton, Tooltip } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { changeMode } from '../../store/mode';
import store, { RootState } from '../../store';

const TextIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_2802_3987)">
      <path d="M1.25 3.12329V2.49996C1.24978 2.25359 1.29812 2.00959 1.39225 1.78191C1.48638 1.55424 1.62445 1.34734 1.79859 1.17305C1.97272 0.998769 2.17949 0.860508 2.40708 0.766176C2.63468 0.671844 2.87863 0.623291 3.125 0.623291H16.875C17.1214 0.623291 17.3653 0.671844 17.5929 0.766176C17.8205 0.860508 18.0273 0.998769 18.2014 1.17305C18.3755 1.34734 18.5136 1.55424 18.6078 1.78191C18.7019 2.00959 18.7502 2.25359 18.75 2.49996V3.12496" stroke="#150D33" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 0.623291V19.3733" stroke="#150D33" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.25 19.3733H13.75" stroke="#150D33" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </g>
    <defs>
      <clipPath id="clip0_2802_3987">
        <rect width="20" height="20" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default function MenuText() {
  const dispatch = useDispatch();
  const modeType = useSelector((state: RootState) => state.mode.type);
  const { t } = useTranslation();
  const handleClick = () => {
    dispatch(changeMode('text'));
  };

  return (
    <Tooltip arrow placement="top" title={t('board.menu.menuTitleText')}>
      <ToggleButton
        id="textBtn"
        selected={modeType === 'text'}
        value="text"
        onClick={handleClick}
      >
        <div className="mainBtn">
          <TextIcon />
        </div>
      </ToggleButton>
    </Tooltip>
  );
}
