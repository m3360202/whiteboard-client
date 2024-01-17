import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Tooltip, ToggleButton, MenuItem } from '@mui/material';
import MenuPopover from '../../mui/components/MenuPopover';
import { useDispatch, useSelector } from 'react-redux';
import { changeMode } from '../../store/mode';
import { updateShapeType } from '../../store/widget/shape';
import store, { RootState } from '../../store';
import { updateStickyNoteMenuBarOpenStatus } from '../../store/widget/stickNote';
import { styled } from '@mui/material/styles';
import Popover from '@mui/material/Popover';

import RectangleIcon from '../../mui/icons/RectangleIcon';
import TriangleIcon from '../../mui/icons/TriangleIcon';
import CircleIcon from '../../mui/icons/CircleIcon';
import RdRectangleIcon from '../../mui/icons/RoundedRectangleIcon';
import HexagonIcon from '../../mui/icons/HexagonIcon';
import DiamondIcon from '../../mui/icons/DiamondIcon';
import StarIcon from '../../mui/icons/StarIcon';
import ParallelogramIcon from '../../mui/icons/ParallelogramIcon';
import CrossIcon from '../../mui/icons/CrossIcon';
import LeftsideRightTriIcon from '../../mui/icons/LeftsideRightTriIcon';
import RightsideRightTriIcon from '../../mui/icons/RightsideRightTriIcon';
import TopSemicircleIcon from '../../mui/icons/TopSemicircleIcon';
import TLQuarterCircleIcon from '../../mui/icons/TLQuarterCircleIcon';
import ConstallationRectIcon from '../../mui/icons/ConstallationRectIcon';
import ConstellationRoundIcon from '../../mui/icons/ConstellationRoundIcon';

//import MenuDragWrap from './MenuDragWrap';

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
  const shapeType = useSelector((state: RootState) => state.widget.shape.type);

  const ShapeIcon = useCallback(() => {
    switch (shapeType) {
      case 0:
        return <RectangleIcon className="menuImgSize" />;
      case 1:
        return <DiamondIcon className="menuImgSize" />;
      case 2:
        return <RdRectangleIcon className="menuImgSize" />;
      case 3:
        return <CircleIcon className="menuImgSize" />;
      case 4:
        return <HexagonIcon className="menuImgSize" />;
      case 5:
        return <TriangleIcon className="menuImgSize" />;
      case 6:
        return <ParallelogramIcon className="menuImgSize" />;
      case 7:
        return <StarIcon className="menuImgSize" />;
      case 8:
        return <CrossIcon className="menuImgSize" />;
      case 9:
        return <LeftsideRightTriIcon className="menuImgSize" />;
      case 10:
        return <RightsideRightTriIcon className="menuImgSize" />;
      case 11:
        return <TopSemicircleIcon className="menuImgSize" />;
      case 12:
        return <TLQuarterCircleIcon className="menuImgSize" />;
      case 13:
        return <ConstallationRectIcon className="menuImgSize" />;
      case 14:
        return <ConstellationRoundIcon className="menuImgSize" />;
    }
  }, [shapeType]);

  const handleShapeClick = type => {
    dispatch(changeMode('shapeNote'));
    dispatch(updateStickyNoteMenuBarOpenStatus(false));
  };

  const handleUpdateShapeType = type => {
    dispatch(updateShapeType(type));
    dispatch(changeMode('shapeNote'));
    setOpen(false);
  };

  const handleStickyNoteDragEnd = () => {
    const shapeType = store.getState().widget.shape.type;
    canvas.createWidgetatCurrentLocationByType('WBShapeNotes', {
      iconId: shapeType
    });
  };

  const handle2LevelClick = (e) => {
    e.stopPropagation();
    dispatch(changeMode('default'));
    dispatch(updateStickyNoteMenuBarOpenStatus(false));
    setOpen(!open);
  };

  return (
    <>
      <Tooltip title={t('board.menu.shapes')} placement="top" arrow>
        <ToggleButton
          id="shape"
          sx={{ pr: 0 ,position:'relative'}}
          value="shapeNote"
          selected={modeType === 'shapeNote'}
          onClick={handleShapeClick}
        >
          <div className="mainBtn" style={{marginRight:'5px'}} >
            {/*<MenuDragWrap onDragEnd={handleStickyNoteDragEnd}>*/}
            <ShapeIcon />
            {/*</MenuDragWrap>*/}
          </div>
          <div
            className="optionsBtn"
            style={{ paddingRight: '11px',position:'absolute',right:'0',  top:'0',paddingTop:'11px',height:'58px' }}
            onClick={handle2LevelClick}
          >
            <UpArrow />
          </div>
        </ToggleButton>
      </Tooltip>

      <Popover
        open={open}
        anchorEl={document.getElementById('shape')}
        onClose={() => setOpen(false)}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: 110,
          horizontal: 'center'
        }}
      >
        <GridBox>
          <MenuItem onClick={() => handleUpdateShapeType(0)}>
            <RectangleIcon />
          </MenuItem>
          <MenuItem onClick={() => handleUpdateShapeType(1)}>
            <DiamondIcon />
          </MenuItem>
          <MenuItem onClick={() => handleUpdateShapeType(2)}>
            <RdRectangleIcon />
          </MenuItem>
          <MenuItem onClick={() => handleUpdateShapeType(3)}>
            <CircleIcon />
          </MenuItem>
          <MenuItem onClick={() => handleUpdateShapeType(4)}>
            <HexagonIcon />
          </MenuItem>
          <MenuItem onClick={() => handleUpdateShapeType(5)}>
            <TriangleIcon />
          </MenuItem>
          {/* <MenuItem onClick={() => handleUpdateShapeType(6)}>
            <ParallelogramIcon />
          </MenuItem>
          <MenuItem onClick={() => handleUpdateShapeType(7)}>
            <StarIcon />
          </MenuItem>
          <MenuItem onClick={() => handleUpdateShapeType(8)}>
            <CrossIcon />
          </MenuItem> */}
          {/* <div onClick={() => handleUpdateShapeType(9)}>
            <LeftsideRightTriIcon />
          </div>
          <div onClick={() => handleUpdateShapeType(10)}>
            <RightsideRightTriIcon />
          </div>
          <div onClick={() => handleUpdateShapeType(11)}>
            <TopSemicircleIcon />
          </div>
          <div onClick={() => handleUpdateShapeType(12)}>
            <TLQuarterCircleIcon />
          </div>
          <div onClick={() => handleUpdateShapeType(13)}>
            <ConstallationRectIcon />
          </div>
          <div onClick={() => handleUpdateShapeType(14)}>
            <ConstellationRoundIcon />
          </div> */}
        </GridBox>
      </Popover>
    </>
  );
};

const GridBox = styled('div')`
  height: 70px;
  padding: 10px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  cursor: pointer;
  box-sizing: unset;
`;
