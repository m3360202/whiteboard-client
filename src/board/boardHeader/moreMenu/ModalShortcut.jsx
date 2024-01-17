import * as React from 'react';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import { useTranslation } from 'react-i18next';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import PropTypes from 'prop-types';
import { BoardService, SystemService, EventService } from '../../../services';
import EventNames from '../../../util/EventNames';

//** Import Redux toolkit
import store, { RootState } from '../../../store';
import { useSelector, useDispatch } from 'react-redux';
import { handleSetOpenShortcut } from '../../../store/sideBar';
import { handleSetShowMoreMenu } from '../../../store/board';


const KeyDiv = styled(Box)(({ theme }) => ({
  border: '2px solid #000000',
  boxSizing: 'border-box',
  borderRadius: '6px',
  width: '36px',
  height: '36px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '16px',
  fontFamily: 'Inter',
  '&:not(:last-child)': {
    marginRight: '10px'
  }
}));

const isMac = SystemService.getInstance().getIsMac();

export default function Shortcut({ setSelectMore }) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const openShortcut = useSelector(
    (state) => state.sideBar.openShortcut
  );
  const openRef = React.useRef(openShortcut);

  const setOpen = data => {
    openRef.current = data;
    // _setOpen(data);
    dispatch(handleSetOpenShortcut(data));
  };

  const handleClickOpen = () => {
    setOpen(true);
    setSelectMore(false);
    store.dispatch(handleSetShowMoreMenu(false));
  };

  React.useEffect(() => {
    function toggleDialog() {
      setOpen(!openRef.current);
    }
    EventService.getInstance().register(
      EventNames.SLASH_SHIFT_KEY_DOWN,
      toggleDialog
    );
    return () => {
      EventService.getInstance().unregister(
        EventNames.CANVAS_MOUSE_UP,
        toggleDialog
      );
    };
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  const shortCutDictionarySet = {
    Tools: t('board.header.moreShortcutTools'),
    Edit: t('board.header.moreShortcutEdit'),
    View: t('board.header.moreShortcutView'),
    moreShortcutStickyNote: t('board.header.moreShortcutStickyNote'),
    moreShortcutText: t('board.header.moreShortcutText'),
    moreShortcutLine: t('board.header.moreShortcutLine'),
    moreShortcutDraw: t('board.header.moreShortcutDraw'),
    moreShortcutRectangle: t('board.header.moreShortcutRectangle'),
    moreShortcutOval: t('board.header.moreShortcutOval'),
    moreShortcutFrame: t('board.header.moreShortcutFrame'),
    moreShortcutUndo: t('board.header.moreShortcutUndo'),
    moreShortcutRedo: t('board.header.moreShortcutRedo'),
    moreShortcutSelectAll: t('board.header.moreShortcutSelectAll'),
    moreShortcutMultiSelection: t('board.header.moreShortcutMultiSelection'),
    moreShortcutGroup: t('board.header.moreShortcutGroup'),
    moreShortcutZoomIn: t('board.header.moreShortcutZoomIn'),
    moreShortcutZoomOut: t('board.header.moreShortcutZoomOut'),
    moreShortcutZoomDefault: t('board.header.moreShortcutZoomDefault'),
    moreShortcutPan: t('board.header.moreShortcutPan'),
    moreShortcutPanText: t('board.header.moreShortcutPanText'),
    moreShortcutLock: t('board.header.moreShortcutLock'),
    moreShortcutUnlock: t('board.header.moreShortcutUnlock')
  };

  return (
    <div>
      <MenuItem
        sx={{
          '& .MuiMenuItem-gutters': {
            paddingTop: '8px',
            paddingBottom: '8px'
          }
        }}
        onClick={handleClickOpen}
      >
        {t('board.header.moreShortcut')}
      </MenuItem>

      <Dialog
        aria-describedby="alert-dialog-description"
        aria-labelledby="alert-dialog-title"
        fullWidth
        onClose={handleClose}
        open={openShortcut}
        sx={{ paperFullWidth: {    maxWidth: '1000px'} }}
      >
        <DialogTitle id="alert-dialog-title" style={{ fontSize: '24px'}}>
          {t('board.header.moreShortcut')}
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              fontSize: '24px',
              color: theme => theme.palette.grey[500]
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <div style={{    display: 'flex',
    justifyContent: 'space-between',
    fontFamily: 'Inter'}}>
            <ColShortcut title={shortCutDictionarySet.Tools}>
              <ShortCut title={shortCutDictionarySet.moreShortcutStickyNote}>
                <KeyChar>S</KeyChar>
              </ShortCut>
              <ShortCut title={shortCutDictionarySet.moreShortcutText}>
                <KeyChar>T</KeyChar>
              </ShortCut>
              <ShortCut title={shortCutDictionarySet.moreShortcutLine}>
                <KeyChar>L</KeyChar>
              </ShortCut>
              <ShortCut title={shortCutDictionarySet.moreShortcutDraw}>
                <KeyChar>P</KeyChar>
              </ShortCut>
              {/* <ShortCut title={shortCutDictionarySet.moreShortcutFrame}>
                <KeyChar>F</KeyChar>
              </ShortCut> */}
              <ShortCut title={shortCutDictionarySet.moreShortcutRectangle}>
                <KeyChar>R</KeyChar>
              </ShortCut>
              <ShortCut title={shortCutDictionarySet.moreShortcutOval}>
                <KeyChar>O</KeyChar>
              </ShortCut>
            </ColShortcut>
            <ColShortcut title={shortCutDictionarySet.Edit}>
              <ShortCut title={shortCutDictionarySet.moreShortcutUndo}>
                <KeyCtrl />
                <KeyChar>Z</KeyChar>
              </ShortCut>
              <ShortCut title={shortCutDictionarySet.moreShortcutRedo}>
                <KeyShift />
                <KeyCtrl />
                <KeyChar>Z</KeyChar>
              </ShortCut>
              <ShortCut title={shortCutDictionarySet.moreShortcutSelectAll}>
                <KeyCtrl />
                <KeyChar>A</KeyChar>
              </ShortCut>
              <ShortCut
                title={shortCutDictionarySet.moreShortcutMultiSelection}
              >
                <KeyShift />
                <div style={{ width: '36px'}}>
                  {shortCutDictionarySet.moreShortcutPanText}
                </div>
              </ShortCut>
              <ShortCut title={shortCutDictionarySet.moreShortcutGroup}>
                <KeyCtrl />
                <KeyChar>G</KeyChar>
              </ShortCut>
              <ShortCut title={shortCutDictionarySet.moreShortcutLock}>
                <KeyCtrl />
                <KeyChar>L</KeyChar>
              </ShortCut>

              <ShortCut title={shortCutDictionarySet.moreShortcutUnlock}>
                <KeyShift />
                <KeyCtrl />
                <KeyChar>L</KeyChar>
              </ShortCut>
            </ColShortcut>
            <ColShortcut title={shortCutDictionarySet.View}>
              {/* <ShortCut title={shortCutDictionarySet.moreShortcutPan}>
                <KeyChar wider>Space</KeyChar>
                <div style={{ width: '36px'}}>
                  {shortCutDictionarySet.moreShortcutPanText}
                </div>
              </ShortCut> */}

              <ShortCut title={shortCutDictionarySet.moreShortcutZoomIn}>
                <KeyCtrl />
                <KeyChar>+</KeyChar>
              </ShortCut>
              <ShortCut title={shortCutDictionarySet.moreShortcutZoomOut}>
                <KeyCtrl />
                <KeyChar>-</KeyChar>
              </ShortCut>
              <ShortCut title={shortCutDictionarySet.moreShortcutZoomDefault}>
                <KeyCtrl />
                <KeyChar>
                  <span style={{ fontFamily: 'IBM Plex Mono' }}>0</span>
                </KeyChar>
              </ShortCut>
            </ColShortcut>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ColShortcut({ title, children }) {
  return (
    <div style={{  width: '30%',
    '& > h3': {
      color: '#232930',
      fontWeight: 500,
      fontSize: '20px',
      marginBottom: '14px',
      lineHeight: '24px'
    }}}>
      <h3>{title}</h3>
      {children}
    </div>
  );
}

ColShortcut.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired
};

function ShortCut({ children, title }) {
  return (
    <div style={{    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px'}}>
      <div style={{   color: '#232930',
    fontSize: '16px',
    fontWeight: 400,
    lineHeight: '24px'}}>{title}</div>
      <div style={{    display: 'flex',
    alignItems: 'center'}}>{children}</div>
    </div>
  );
}

ShortCut.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired
};

function KeyChar({ children, wider = false }) {
  return (
    <KeyDiv className={`${wider ? { width: 'unset',
    minWidth: '36px',
    paddingLeft: '8px',
    paddingRight: '8px'} : ''} `}>
      {children}
    </KeyDiv>
  );
}

KeyChar.propTypes = {
  children: PropTypes.node.isRequired,
  wider: PropTypes.bool
};

KeyChar.defaultProps = {
  wider: false
};

function KeyShift() {
  return isMac ? (
    <KeyDiv >⇧</KeyDiv>
  ) : (
    <KeyDiv style={{ fontSize: '12px'}}>Shift</KeyDiv>
  );
}

function KeyCtrl() {
  return isMac ? (
    <KeyDiv>⌘</KeyDiv>
  ) : (
    <KeyDiv style={{ fontSize: '12px'}}>Ctrl</KeyDiv>
  );
}
