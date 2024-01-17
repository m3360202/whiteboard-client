import React, { useEffect, useRef, useState } from 'react';
import { styled } from '@mui/material/styles';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MenuPopover from '../../mui/components/MenuPopover';
import Popover from '@mui/material/Popover';

import MenuLink from './MenuLink';
import MenuFile from './MenuFile';

import MenuFileIcon from '../../mui/icons/MenuFileIcon';
import MenuLinkIcon from '../../mui/icons/MenuLinkIcon';

import { useTranslation } from 'react-i18next';
import { changeMode } from '../../store/mode';
import { useDispatch } from 'react-redux';
import store from '../../store';
import { handleSetIsPanMode, handleSetBoardPanelClicked, handleSetDrawingEraseMode } from '../../store/board';

export default function MenuMore() {

  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [show, setShow] = useState(false);
  const [moreY, setMoreY] = useState(0);
  const [moreX, setMoreX] = useState(0);
  const [menuPopoverID, setMenuPopoverID] = useState(null);
  // const { mode, changeMode } = useContext(MenuContext);
  const moreButton: any = useRef(null);

  useEffect(() => {
    setMoreY(moreButton.current.getBoundingClientRect().top);
    setMoreX(moreButton.current.getBoundingClientRect().right);
  }, [show]);

  const handleShowClick = (name) => {
    store.dispatch(handleSetIsPanMode(false));
    setMenuPopoverID(name);
    if (!show) {
      setShow(true);
      // changeMode('file');
      dispatch(changeMode('file'));

      store.dispatch(handleSetDrawingEraseMode(false));
      store.dispatch(handleSetBoardPanelClicked(false));
    } else {
      setShow(false);
      // changeMode('default');
      dispatch(changeMode('default'));
    }
  };

  const handleShowClose = () => {
    // changeMode('default');
    dispatch(changeMode('default'));
    setShow(false);
  };

  return (
    <Box ref={moreButton}>
      <Box sx={{ pl: '16px', pr: '16px', '.menuBoxStyle': {  width: '100%',
    border: '1px solid #ccc',
    height: '50px',
    display: 'flex',
    alignItems: 'center',
    borderRadius: '8px',
    marginBottom: '15px',
    cursor: 'pointer',
    paddingLeft: '12px',
    boxSizing: 'border-box',} }}>
        <Box
          id="linkMenu"
          onClick={() => {
            handleShowClick('linkMenu');
          }}
          className={'menuBoxStyle'}
        >
          <MenuLinkIcon />
          <Typography variant="body1" sx={{ ml: '15px' }}>
            {t('board.menu.link')}
          </Typography>
        </Box>

        <Box
          id="fileMenu"
          className={'menuBoxStyle'}
          onClick={() => {
            handleShowClick('fileMenu');
          }}
        >
          <MenuFileIcon />
          <Typography sx={{ ml: '15px' }} variant="body1">
            {t('board.menu.fileUpload1')}
          </Typography>
        </Box>
      </Box>



      <Popover
        open={show}
        onClose={handleShowClose}
        anchorReference="anchorPosition"
        anchorPosition={{ top: moreY, left: moreX }}
        anchorOrigin={{ vertical: 'center', horizontal: 'left' }}
        transformOrigin={{ vertical: 'center', horizontal: 'left' }}
      >
        {menuPopoverID === 'fileMenu' ? (
          <MenuFile handleShowClose={handleShowClose} />
        ) : null}
        {menuPopoverID === 'linkMenu' ? (
          <MenuLink handleShowClose={handleShowClose} />
        ) : null}
      </Popover>
    </Box>
  );
}
