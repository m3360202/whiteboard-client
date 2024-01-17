//** Import react
import React, { useState, useEffect } from 'react';

//** Import i18n
import { useTranslation } from 'react-i18next';
//** Import Redux
import { RootState } from '../../../store';
import { useSelector } from 'react-redux';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import store from '../../../store';
//** Import services
import { BoardService } from '../../../services';

const Root = styled('div')(({ theme }) => ({}));

const BoardNameTextInput = styled('input')(({ theme }) => ({
  position: 'relative',
  margin: '0px 0px 0px 33px',
  minHeight: '23px',
  fontSize: '16px',
  fontFamily: 'Inter',
  fontWeight: 400,
  fontStyle: 'normal',
  color: '#232930',
  border: 'none'
}));

const BoardNameSpan = styled('span')(({ theme }) => ({
  opacity: 0,
  position: 'absolute',
  fontSize: ' 16px',
  right: 0,
  zIndex: -99999
}));

export default function HeaderBoardTitle() {
  //use

  const [boardNameInput, setBoardNameInput] = useState('');
  const [boardNameStored, setBoardNameStored] = useState('');
  const BOARD_INPUT_MAX_LENGTH = 35;
  const board = useSelector((state: RootState) => state.board.board);
  const { t } = useTranslation();

  useEffect(() => {
    const v = document.getElementById('boardNameText') as HTMLInputElement;
    document.title = v.value;
  });

  const updateInputWidth = boardName => {
    if (!boardName) return;
    const container = document.getElementById('boardNameSpan');
    if (!container) {
      return;
    }
    container.innerHTML = boardName;
    const boardNameSpanWidth = container.clientWidth;
    const element = document.getElementById('boardNameText');
    if (!element) return;
    if (boardName === '未命名') {
      element.style.width = `${50}px`;
      return;
    }
    if (boardName === 'Untitled Board') {
      element.style.width = `${112}px`;
      return;
    }

    if (boardName.length > 34) {
      element.style.width = `${boardNameSpanWidth + 43}px`;
      return;
    }

    element.style.width = `${boardNameSpanWidth + 32}px`;
  };

  const formatBoardNameInput = boardName => {
    if (boardName) {
      if (boardName.length >= BOARD_INPUT_MAX_LENGTH) {
        setBoardNameInput(
          `${boardName.substring(0, BOARD_INPUT_MAX_LENGTH)}..`
        );
        updateInputWidth(`${boardName.substring(0, BOARD_INPUT_MAX_LENGTH)}..`);
      } else {
        setBoardNameInput(boardName);
        updateInputWidth(boardName);
      }
    }
  };
  const boardName = useSelector((state: RootState) => state.board.boardName);

  const handleOnNameFocus = () => {
    const boardName = store.getState().board.board.name;
    setBoardNameInput(boardName);
    setBoardNameStored(boardName);
  };

  const handleOnNameInput = e => {
    setBoardNameInput(e.target.value);
    setBoardNameStored(e.target.value);
  };

  const handleOnNameBlur = () => {
    let boardName = boardNameStored.trim();
    if (boardName.length === 0) {
      boardName = t('components.board.defaultBoardName');
    }

    BoardService.getInstance().updateCurrentBoard({ name: boardName });
    document.title = boardName;
    formatBoardNameInput(boardName);

    let toolbarBoardWidth = document.getElementById(
      'toolbarBoardTopleft'
    ).clientWidth;
    let headerAppWidth = document.getElementById('header_appBar').clientWidth;
    if (window.innerWidth > headerAppWidth + toolbarBoardWidth + 22) return;
    document.getElementById('header_appBar').style.left = `${
      toolbarBoardWidth + 22
    }px`;
  };
  useEffect(() => {
    if (board && board.name) {
      setBoardNameInput(board.name);
      formatBoardNameInput(board.name);
    }
  }, [board.name]);
  return (
    <Root id="boardTitle" sx={{ display: 'flex', alignItems: 'center' }}>
      <BoardNameTextInput
        autoComplete="off"
        data-cy="BoardName"
        id="boardNameText"
        onBlur={handleOnNameBlur}
        onFocus={handleOnNameFocus}
        onInput={e => handleOnNameInput(e)}
        onPaste={e => e.stopPropagation()}
        size={30}
        value={boardNameInput}
      />
      <BoardNameSpan id="boardNameSpan">{boardNameInput}</BoardNameSpan>
      <BetaContentTooltip
        title={t('components.board.betaContent')}
        placement="bottom-start"
      >
        <BetaTypography>BETA</BetaTypography>
      </BetaContentTooltip>
    </Root>
  );
}

const BetaContentTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 230,
    width: '230px',
    padding: '10px',
    margin: '8px 0px !important',
    boxSizing: 'border-box',
    fontSize: '0.875rem',
    fontWeight: 400,
    fontStyle: 'normal',
    lineHeight: '20px'
  }
});

const BetaTypography = styled(Typography)({
  margin: '0px 22px 0px 8px',
  fontSize: '0.75rem',
  fontWeight: 700,
  width: '36px',
  height: '15px',
  backgroundColor: '#65E9E9',
  borderRadius: '2px',
  color: '#FFFFFF',
  textAlign: 'center',
  lineHeight: '15px',
  cursor: 'pointer'
});
