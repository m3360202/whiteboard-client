import React, { useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { useSelector } from 'react-redux';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { styled } from '@mui/material/styles';
import { ThemeProvider } from '@mui/material';
import lightTheme from '../../mui/theme/lightTheme';
import Box from '@mui/material/Box';

import MenuPanSelect from './MenuPanSelect';
import MenuText from './MenuText';
import MenuDrawing from './MenuDrawing';
import MenuArrow from './MenuArrow';
import MenuShape from './MenuShapes';
import MenuResources from './MenuResources';
import MenuTemplate from './MenuTemplate';
import StickyNoteMenu from './StickNoteMenu';

import usePanActions from './modeHandlers/usePanActions';
import useDrawActions from './modeHandlers/useDrawActions';
import useDefaultEventActions from './modeHandlers/useDefaultEventActions';
import useEraserActions from './modeHandlers/useEraserActions';
import useMouseActions from './modeHandlers/useMouseActions';
import useArrowActions from './modeHandlers/useLineActions';
import useTextActions from './modeHandlers/useTextActions';
import useShapeActions from './modeHandlers/useShapeActions';
import useStickNoteActions from './modeHandlers/useStickNoteActions';
import { handlePreventDefaultEvent } from './events';
import MenuAIAssist from './MenuAIAssist';

export function MenuBar() {
  const modeType = useSelector((state) => state.mode.type);
  const { startMouseListener, endMouseListener } = useMouseActions();
  const { startDefaultListener, endDefaultListener } = useDefaultEventActions();
  const { handlePanBefore, handlePanAfter } = usePanActions();
  const { handleDrawBefore, handleDrawAfter } = useDrawActions();
  const { handleEraseBefore, handleEraseAfter } = useEraserActions();
  const { handleLineBefore, handleLineAfter } = useArrowActions();
  const { handleTextBefore, handleTextAfter } = useTextActions();
  const { handleShapeBefore, handleShapeAfter } = useShapeActions();
  const { handleStickNoteBefore, handleStickNoteAfter } = useStickNoteActions();
  const hideBoardMenu = useSelector((state) => state.board.hideBoardMenu);

  useEffect(() => {
    startMouseListener();
    startDefaultListener();

    const ele = document.getElementById('menuBar');
    ele && ele.addEventListener('wheel', handlePreventDefaultEvent);

    switch (modeType) {
      case 'pan':
        handlePanBefore();
        break;
      case 'draw':
        handleDrawBefore();
        break;
      case 'eraser':
        handleEraseBefore();
        break;
      case 'line':
        handleLineBefore();
        break;
      case 'text':
        handleTextBefore();
        break;
      case 'shapeNote':
        handleShapeBefore();
        break;
      case 'stickNote':
        handleStickNoteBefore();
        break;
    }

    return () => {
      switch (modeType) {
        case 'pan':
          handlePanAfter();
          break;
        case 'draw':
          handleDrawAfter();
          break;
        case 'eraser':
          handleEraseAfter();
          break;
        case 'line':
          handleLineAfter();
          break;
        case 'text':
          handleTextAfter();
          break;
        case 'shapeNote':
          handleShapeAfter();
          break;
        case 'stickNote':
          handleStickNoteAfter();
          break;
        case 'default':
          endDefaultListener();
          break;
      }

      ele && ele.removeEventListener('wheel', handlePreventDefaultEvent);

      endMouseListener();
      endDefaultListener();
    };
  }, [canvas, modeType]);

  return (
    <ThemeProvider theme={lightTheme}>
      <DndProvider backend={HTML5Backend}>
        {!hideBoardMenu ? (
          <MenuBarWrap id="menuBar">
            <MenuPanSelect />
            <StickyNoteMenu />
            {/* <MenuPanel /> */}
            <MenuDrawing />
            <MenuText />
            <MenuArrow />
            <MenuShape />
            {<MenuResources />}
            <MenuTemplate />
            <MenuAIAssist />
          </MenuBarWrap>
        ) : null}
      </DndProvider>
    </ThemeProvider>
  );
}

const MenuBarWrap = styled('div')`
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: 0;
  height: 58px;
  box-shadow: 0 1px 3px 2px #00000014;
  display: flex;
  align-items: stretch;
  justify-content: center;
  border-radius: 8px 8px 0 0;
  background: #fff;
  box-sizing: border-box;

  .menuImgSize {
    width: 24px;
    height: 24px;
  }

  .MuiButtonBase-root:hover {
    background-color: #f2f2f3;
  }

  .Mui-selected {
    background-color: #f1f7fe;
  }
  & > button {
    height: auto;
    width: 80px;

    &:not(#stickNoteBtn):hover .mainBtn svg {
      transform: scale(1.1);
    }

    &#stickNoteBtn:hover .mainBtn svg {
      transform: rotate(-4deg);
    }
  }

  .mainBtn {
    width: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .optionsBtn {
    border: 0;
    outline: none;
    cursor: pointer;
    text-align: center;
    box-sizing: border-box;
    background-color: transparent;

    &:hover svg {
      transform: translateY(-6px);
    }
  }
`;


const MenuBarMemo = React.memo(MenuBar);

export default MenuBarMemo;