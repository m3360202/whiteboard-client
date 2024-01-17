import React from 'react';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';;
import { Tooltip } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { BoardService, UserService, SysService } from '../../../services';
import { useTranslation } from 'react-i18next';
//** Import Redux toolkit
import store, { RootState } from '../../../store';
import { useSelector, useDispatch } from 'react-redux';
import {handleSetShowMoreMenu} from '../../../store/board'
import { useHistory } from 'react-router-dom';

export default function MoreMenuTouch() {
  const [moreMenuIconColor, setMoreMenuIconColor] =
    React.useState('rgba(0,0,0,0.54)');
  const moreMenuOpen = useSelector((state: RootState) => state.board.showMoreMenu);
  const userInfo = useSelector((state: RootState) => state.user.userInfo); 
  const history = useHistory();
  const { t } = useTranslation();
  
  const handleClick = (event) => {
    if (!moreMenuOpen) {
      store.dispatch(handleSetShowMoreMenu(true));
      setMoreMenuIconColor('#F21d6B');
    } else {
      store.dispatch(handleSetShowMoreMenu(false));
      setMoreMenuIconColor('rgba(0,0,0,0.54)');
    }
  };

  const handleClose = () => {
    store.dispatch(handleSetShowMoreMenu(false));
    setMoreMenuIconColor('rgba(0,0,0,0.54)');
  };

  const handleFeedbackClick = (e) => {
    window.open('https://forms.gle/ge5xtNGUGZcsZe2Y6', 'feedback');
    handleClose();
  };

  const handleSwitchVersionClick = (e) => {
    /// keep
    if (localStorage.getItem('currentUIType') === 'mobile') {
      localStorage.setItem('currentUIType', 'laptop');
      Boardx.Util.Msg.info(t('board.menu.switchtoLaptop'));
    } else {
      localStorage.setItem('currentUIType', 'mobile');
      Boardx.Util.Msg.info(t('board.menu.switchtoDesktop'));
    }
    handleClose();
  };

  const handleLogoutClick = (e) => {
    UserService.getInstance().logout();
    // history.push( '/signin');
    window.location.href = '/signin';
  };

  const id = moreMenuOpen ? 'moremenu-popover' : undefined;
  return (
    <div>
      <Tooltip arrow placement="bottom" title="More">
        <IconButton
          aria-describedby={id}
          aria-label="show 17 new notifications"
          color="inherit"
          id="moreMenuHeader"
          onClick={handleClick}
          size="large"
        >
          <MoreVertOutlinedIcon style={{ color: moreMenuIconColor }} />
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={document.getElementById('moreMenuHeader')}
        id="simple-menuMoreMenu"
        keepMounted
        onClose={handleClose}
        open={moreMenuOpen}
      >
        <MenuItem onClick={handleFeedbackClick}>Feedback</MenuItem>
        {(
          <MenuItem onClick={handleLogoutClick}>Logout</MenuItem>
        )}
      </Menu>
    </div>
  );
}
