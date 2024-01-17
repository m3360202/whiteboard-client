import React from 'react';
import { styled } from '@mui/material/styles';
import SideMenuMoreIcon from '../../../mui/icons/SideMenuMoreIcon';
import { Tooltip } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useTranslation } from 'react-i18next';
import ModalBackup from './ModalBackup';
import ModalShortcut from './ModalShortcut';
import ModalContext from './ModalContext';
import LanguageSwitch from '../../../components/language/LanguageSwitch';
import { UserService, SysService } from '../../../services';

//** Import Redux toolkit
import store, { RootState } from '../../../store';
import { useSelector } from 'react-redux';
import { handleSetShowMoreMenu } from '../../../store/board';
import { handleSetShowTimerPopover, handleSetTimerIconColorOn } from '../../../store/board/timer';
import { useHistory } from 'react-router-dom';


const ModalSettings = React.lazy(() => import('./ModalSettings'));

export default function MoreMenu({ setSelectMore }) {

  const history = useHistory();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { t } = useTranslation();
  const [moreMenuIconColor, setMoreMenuIconColor] =
    React.useState('rgba(0,0,0,0.54)');
  const moreMenuOpen = useSelector((state: RootState) => state.board.showMoreMenu);

  const handleClick = (event) => {
    store.dispatch(handleSetShowTimerPopover(false));
    store.dispatch(handleSetTimerIconColorOn(false));
    if (!moreMenuOpen) {
      setAnchorEl(document.getElementById('moreMenuHeader'));
      store.dispatch(handleSetShowMoreMenu(true));
      setMoreMenuIconColor('#F21d6B');
    } else {
      setAnchorEl(null);
      store.dispatch(handleSetShowMoreMenu(false));
      setMoreMenuIconColor('rgba(0,0,0,0.54)');
    }
    setSelectMore(true);
  };

  const handleClose = () => {
    setAnchorEl(null);
    store.dispatch(handleSetShowMoreMenu(false));
    setMoreMenuIconColor('rgba(0,0,0,0.54)');
    setSelectMore(false);
  };

  const handleFeedbackClick = (e) => {
    setSelectMore(false);
    window.open('https://forms.gle/ge5xtNGUGZcsZe2Y6', 'feedback');
    handleClose();
  };

  const handleLogoutClick = (e) => {
    setSelectMore(false);
    UserService.getInstance().logout();
    // history.push( '/signin');
    window.location.href = '/signin';
  };

  const id = moreMenuOpen ? 'moremenu-popover' : undefined;

  return (
    <div>
      <Tooltip arrow placement="bottom" title={t('board.header.more')}>
        <IconButton
          aria-describedby={id}
          aria-label="show 17 new notifications"
          color="inherit"
          id="moreMenuHeader"
          onClick={handleClick}
          style={{
            paddingLeft: 12,
            paddingRight: 16,
            width: 50
          }}
        >
          <SideMenuMoreIcon sx={{ width: '20px', height: '20px' }} />
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        // classes={{ paper: classes.paper }}
        sx={{
          '& .MuiMenu-paper': {
            width: '200px',
            marginTop: '12px'
          }
        }}
        id="simple-menuMoreMenu"
        keepMounted
        onClose={handleClose}
        open={moreMenuOpen}
      >
        {/* <ModalSettings setSelectMore={setSelectMore} /> */}
        {(
          <ModalBackup setSelectMore={setSelectMore} />
        )}
        {/* <ModalTutorial setSelectMore={setSelectMore} /> */}
        <ModalShortcut setSelectMore={setSelectMore} />

        <ModalContext />
        {/* <MenuItem
          classes={{ gutters: classes.gutters }}
          onClick={handleFeedbackClick}
        >
          {t('board.header.moreFeedback')}
        </MenuItem> */}
        <LanguageSwitch setSelectMore={setSelectMore} />
        {(
          <MenuItem
            sx={{
              root: {
                height: '40px',
                borderTop: '1px solid #e0e0e0',
                boxSizing: 'border-box'
              }, gutters: {
                paddingTop: '8px',
                paddingBottom: '8px'
              }
            }}
            onClick={handleLogoutClick}
          >
            {t('board.header.moreLogout')}
          </MenuItem>
        )}
      </Menu>
    </div>
  );
}
