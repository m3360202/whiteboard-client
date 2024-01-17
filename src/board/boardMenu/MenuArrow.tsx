import React from 'react';
import { MenuItem, Popover, ToggleButton, Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { LineType, updateLineType } from '../../store/widget/line';
import { changeMode } from '../../store/mode';
import { RootState } from '../../store';
import { handleSetTips } from '../../store/widgets';
import { updateStickyNoteMenuBarOpenStatus } from '../../store/widget/stickNote';
import { styled } from '@mui/material/styles';

const LineArrow = () => {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_2802_3983)">
        <path d="M19 1L1 19" stroke="#150D33" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M19 5V1H15" stroke="#150D33" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M1 15V19H5" stroke="#150D33" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <defs>
        <clipPath id="clip0_2802_3983">
          <rect width="20" height="20" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

const Line = () => {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_2802_3993)">
        <path d="M3.125 19.375C4.50571 19.375 5.625 18.2557 5.625 16.875C5.625 15.4943 4.50571 14.375 3.125 14.375C1.74429 14.375 0.625 15.4943 0.625 16.875C0.625 18.2557 1.74429 19.375 3.125 19.375Z" stroke="#150D33" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16.875 5.625C18.2557 5.625 19.375 4.50571 19.375 3.125C19.375 1.74429 18.2557 0.625 16.875 0.625C15.4943 0.625 14.375 1.74429 14.375 3.125C14.375 4.50571 15.4943 5.625 16.875 5.625Z" stroke="#150D33" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4.93332 15.1492L15.11 4.89587" stroke="#150D33" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <defs>
        <clipPath id="clip0_2802_3993">
          <rect width="20" height="20" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

const UpArrow = () => (
  <svg
    width="8"
    height="5"
    viewBox="0 0 8 5"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0.25 4.72966L3.82333 1.15666C3.84652 1.13343 3.87406 1.11501 3.90437 1.10244C3.93469 1.08987 3.96718 1.0834 4 1.0834C4.03282 1.0834 4.06531 1.08987 4.09563 1.10244C4.12594 1.11501 4.15348 1.13343 4.17667 1.15666L7.75 4.72966"
      stroke="#150D33"
      strokeWidth="0.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default () => {
  const [open, setOpen] = React.useState(false);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const modeType = useSelector((state: RootState) => state.mode.type);
  const lineType = useSelector(
    (state: RootState) => state.widget.line.lineType
  );

  const handleLineSelected = (type: LineType) => {
    dispatch(handleSetTips(type === 'line' ? 'none' : 'end'));
    dispatch(updateLineType(type));
    dispatch(changeMode('line'));
    setOpen(false);
  };

  const handleCreateLineWhenClick = () => {
    dispatch(changeMode('line'));
    canvas.discardActiveObject();
    dispatch(updateStickyNoteMenuBarOpenStatus(false));
    setOpen(false);
  };

  const handleLineClick = (e) => {
    e.stopPropagation();
    dispatch(changeMode('default'));
    dispatch(updateStickyNoteMenuBarOpenStatus(false));
    canvas.discardActiveObject();
    setOpen(!open);
  };

  const handlePopoverClose = () => {
    setOpen(false);
  };

  const ArrowIcon = () => {
    switch (lineType) {
      case 'line':
        return <Line />;
      case 'lineArrow':
        return <LineArrow />;
    }
  };

  return (
    <>
      <Tooltip
        title={t('board.menu.arrowConnectorsLines')}
        placement="top"
        arrow
      >
        <ToggleButton id="lineBtn" sx={{pr: 0,position:'relative'}} selected={modeType === 'line'} value="line" onClick={handleCreateLineWhenClick}>
          <div className="mainBtn" style={{marginRight:'15px'}} >
            <ArrowIcon />
          </div>
          <div className="optionsBtn" style={{paddingRight: '11px',position:'absolute',right:'0',  top:'0',paddingTop:'11px',height:'58px'}} onClick={handleLineClick}>
            <UpArrow />
          </div>
        </ToggleButton>
      </Tooltip>

      <Popover
        open={open}
        onClose={handlePopoverClose}
        anchorEl={document.getElementById('lineBtn')}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        transformOrigin={{ vertical: 71, horizontal: 'center' }}
      >
        <GridBox>
          <MenuItem onClick={() => handleLineSelected('lineArrow')}>
            <LineArrow />
          </MenuItem>
          <MenuItem onClick={() => handleLineSelected('line')}>
            <Line />
          </MenuItem>
        </GridBox>
      </Popover>
    </>
  );
};

const GridBox = styled('div')`
  height: 54px;
  /* padding: 10px; */
  display: grid;
  cursor: pointer;
  box-sizing: border-box;
  grid-template-columns: 1fr 1fr;

  & > div {
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      background-color: #f2f2f3;
    }
  }
`;
