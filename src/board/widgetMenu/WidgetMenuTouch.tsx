 import React, { useEffect } from 'react';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { ToggleButton } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Box from '@mui/material/Box';
import ColorWidget from './Colors/ColorWidget';
import EmojiMenu from './EmojiMenu';
import ObjectLock from './ObjectLock';
import showMenuTouch from './ShowMenuTouch';
import { WidgetService } from '../../services';
//** Import Redux toolkit
import store, { RootState } from '../../store';
import { useSelector } from 'react-redux';
import { handleSetMoreMenuTouchOpen} from '../../store/board';

export default function () {
  const [formats, setFormats] = React.useState(() => ['bold', 'italic']);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const moreMenuTouchOpen =useSelector((state: RootState) => state.board.moreMenuTouchOpen);
  useEffect(()=>{
    store.dispatch(handleSetMoreMenuTouchOpen(false));
  },[])
  const widgetMenuList = useSelector((state: RootState) => state.board.widgetMenuTouchList);
 
  const handleFormat = (event, newFormats) => {
    setFormats(newFormats);
  };

  const handleClickTouchMore = e => {
    if (!moreMenuTouchOpen) {
      setAnchorEl(e.currentTarget);
      store.dispatch(handleSetMoreMenuTouchOpen(true));
    } else {
      setAnchorEl(null);
      store.dispatch(handleSetMoreMenuTouchOpen(false));
    }
  };

  const handleBringToFront = () => {
    const currentObject = canvas.getActiveObject() || canvas.findTarget();
    if (currentObject) {
      currentObject.bringObjToFront();
    }
    handleMoreTouchClose();
  };

  const handleSendToBack = () => {
    const currentObject = canvas.getActiveObject() || canvas.findTarget();
    if (currentObject) {
      currentObject.sendObjToBack();
    }
    handleMoreTouchClose();
  };

  const handleMoreTouchClose = () => {
    store.dispatch(handleSetMoreMenuTouchOpen(false));
  };

  const onClickDeleteStickyNote = e => {
    const obj = canvas.getActiveObject();
    canvas.removeWidget(obj);
    showMenuTouch(e);
  };

  React.useEffect(() => {
    document
      .getElementById('widgetMenuTouchList')
      .addEventListener('wheel', event => {
        event.preventDefault();
        showMenuTouch();
      });
  }, []);

  return (
    <div id="widgetMenuTouchList" style={{ display: 'none' }}>
 
    </div>
  );
};
