import React from 'react';
import { styled } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import clsx from 'clsx';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import { useTranslation } from 'react-i18next';
import ArrowUpIcon from '../../mui/svg/ArrowUpIcon';
import ArrowDownIcon from '../../mui/svg/ArrowDownIcon';
import store, { RootState } from '../../store';
import { handleSetDropdownDisplayed } from '../../store/widgets';
import { handleChangeFontSize } from '../../store/widgetMenu';



const Root = styled('div')(({ theme }) => ({
  [`& .${classes.widget}`]: {},
  [`& .${classes.align}`]: {},

  [`& .${classes.main}`]: {
    display: 'flex',
    height: 44
  },

  [`& .${classes.fontBtnGroup}`]: {
    width: '16px',
    marginTop: 4
  },

  [`& .${classes.button}`]: {
    borderColor: 'gainsboro',
    textAlign: 'right',
    color: '#150D33',
    borderRightWidth: 0,
    fontSize: 16,
    fontWeight: 400,
    height: 44,
    textTransform: 'none',
    minWidth: 25,
    padding: 0,
    paddingLeft: 0,
    //
    '&:hover': {
      color: '#f21d6b'
    }
  },

  [`& .${classes.box}`]: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '8px 0px',
    height: '44px',
    width: '20px',
    boxSizing: 'border-box'
  },

  [`& .${classes.iconStyle}`]: {
    flex: '1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },

  [`& .${classes.arrUpBtn}`]: {
    minWidth: '20px',
    color: '#757575',
    textAlign: 'center'
  },

  [`& .${classes.arrDownBtn}`]: {
    minWidth: '20px',
    color: '#757575',
    textAlign: 'center'
  },

  [`& .${classes.btnIcon}`]: {
    width: 16,
    height: 16
  }
}));

export default function FontSize({ fontSize, paddingLeft, paddingRight }) {
  const { t } = useTranslation();
  const displayFontSize = fontSize || 16;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedIndex, setSelectedIndex] = React.useState(1);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const options = [
    8,
    10,
    12,
    14,
    16,
    18,
    20,
    22,
    24,
    26,
    28,
    36,
    48,
    56,
    72,
    122,
    144,
    288,
    ' '
  ];

  const handleChange = () => {};

  const handleBlur = e => {
    store.dispatch(handleSetDropdownDisplayed(false));
  };

  const handleFocus = e => {
    store.dispatch(handleSetDropdownDisplayed(true));
  };

  const changeFontSize = (e, index, value) => {
    store.dispatch(handleChangeFontSize(value));
    setSelectedIndex(index);
    e.preventDefault();
    const object = canvas.getActiveObject();
if (object.obj_type === 'WBText' && !object.isEditing) {
      //计算originx y 从center变到left和top后，object的left和top的新值
      const left = object.left - (object.width * object.scaleX) / 2;
      const top = object.top - (object.height * object.scaleY) / 2;
      object.set({ originX: 'left', originY: 'top', left, top });
      object.saveData('MODIFIED', ['originX', 'left', 'top', 'originY']);
    }
    let group = null;
    if (canvas.getActiveObjects().length > 1) group = canvas.getActiveObject();
    if (!object) {
      return $('#notesMenu').hide();
    }

    if (!group) {
      const fontSize = value;
      if (object.obj_type === 'WBText' && object.isEditing) {
        const width = (object.width * fontSize) / object.fontSize;
        let { left } = object;
        if (object.originX === 'center') {
          left += ((width - object.width) * object.scaleX) / 2;
        }
        const height = (object.height * fontSize) / object.fontSize;
        let { top } = object;
        if (object.originY === 'center') {
          top += ((height - object.height) * object.scaleY) / 2;
        }
        object.set('width', width);
        object.set('left', left);
        object.set('top', top);
      }
      object.set('fontSize', fontSize);
      object.saveData('MODIFIED', ['fontSize']);
    } else {
      group._objects.forEach(obj => {
        const fontSize = value;
        obj.set('fontSize', fontSize);
      });
      group.saveData('MODIFIED', ['fontSize']);
    }

    // canvas.requestRenderAll();
    if (canvas.getActiveObject().hiddenTextarea)
      canvas.getActiveObject().hiddenTextarea.focus();
      if (object.obj_type === 'WBText' && !object.isEditing) {
        //计算originx y 从left和top变到center后，object的left和top的新值
        const originLeft = object.left + (object.width * object.scaleX) / 2;
        const originTop = object.top + (object.height * object.scaleY) / 2;
        object.set({
          originX: 'center',
          originY: 'center',
          left: originLeft,
          top: originTop
        });
        object.saveData('MODIFIED', ['originX', 'left', 'top', 'originY']);
      }
      
    handleClose();
  };

  const decreaseFontSize = e => {
    const curSize = store.getState().widgetMenu.menuFontSize;

    let index;
    if (curSize !== t('board.contextMenu.mixed')) {
      index = options.indexOf(curSize);
      if (index === -1 && curSize > 7) {
        store.dispatch(handleChangeFontSize(curSize - 1));
      } else {
        if (index === 0) index = 1;
        store.dispatch(handleChangeFontSize(options[index - 1]));
        setSelectedIndex(options[index - 1]);
      }
    }

    e.preventDefault();

    const object = canvas.getActiveObject();
    if (object.obj_type === 'WBText' && !object.isEditing) {
      //计算originx y 从center变到left和top后，object的left和top的新值
      const left = object.left - (object.width * object.scaleX) / 2;
      const top = object.top - (object.height * object.scaleY) / 2;
      object.set({ originX: 'left', originY: 'top', left, top });
      object.saveData('MODIFIED', ['originX', 'left', 'top', 'originY']);
    }
    let group = null;
    if (canvas.getActiveObjects().length > 1) group = canvas.getActiveObject();
    if (!object) {
      return $('#notesMenu').hide();
    }

    if (!group) {
      index = options.indexOf(curSize);
      if (index === 0) index = 1;
      let fontSize = options[index - 1];
      if (index === -1 && curSize > 7) {
        fontSize = curSize - 1;
      }
      if (object.type === 'WBText') {
        const width = (object.width * fontSize) / object.fontSize;
        let { left } = object;
        if (object.originX === 'center') {
          left += ((width - object.width) * object.scaleX) / 2;
        }
        const height = (object.height * fontSize) / object.fontSize;
        let { top } = object;
        if (object.originY === 'center') {
          top += ((height - object.height) * object.scaleY) / 2;
        }
        object.set('width', width);
        object.set('left', left);
        object.set('top', top);
      }
      object.set('fontSize', fontSize);
      object.saveData('MODIFIED', ['width', 'left', 'top', 'fontSize','originX','originY']);
    } else {
      let gIndex;
      group._objects.forEach(obj => {
        gIndex = options.indexOf(obj.fontSize) - 1;
        if (gIndex == -1) gIndex = 0;
        obj.set('fontSize', options[gIndex]);
      });
      group.saveData('MODIFIED', ['fontSize']);
      if (displayFontSize === t('board.contextMenu.mixed')) {
        store.dispatch(handleChangeFontSize(t('board.contextMenu.mixed')));
      } else {
        store.dispatch(handleChangeFontSize(options[gIndex]));
      }
    }
    canvas.requestRenderAll();
    if (canvas.getActiveObject().hiddenTextarea)
      canvas.getActiveObject().hiddenTextarea.focus();
    if (object.obj_type === 'WBText' && !object.isEditing) {
      //计算originx y 从left和top变到center后，object的left和top的新值
      const originLeft = object.left + (object.width * object.scaleX) / 2;
      const originTop = object.top + (object.height * object.scaleY) / 2;
      object.set({
        originX: 'center',
        originY: 'center',
        left: originLeft,
        top: originTop
      });
      object.saveData('MODIFIED', ['originX', 'left', 'top', 'originY']);
    }
   
  };

  const increaseFontSize = e => {
    const object = canvas.getActiveObject();
    const curSize = store.getState().widgetMenu.menuFontSize;
    if (object.obj_type === 'WBShapeNotes') {
      if (curSize === 122) {
        return;
      }
    }

    let index;
    if (curSize !== t('board.contextMenu.mixed')) {
      index = options.indexOf(curSize);
      if (index === -1 && curSize > 7) {
        store.dispatch(handleChangeFontSize(curSize + 1));
      } else {
        //if (curSize === 288) index = options.indexOf(288) - 1;
        if (curSize === 144) index = options.indexOf(144) - 1;
        store.dispatch(handleChangeFontSize(options[index + 1]));

        setSelectedIndex(options[index + 1]);
      }
    }

    e.preventDefault();

    if (object.obj_type === 'WBText' && !object.isEditing) {
      //计算originx y 从center变到left和top后，object的left和top的新值
      const left = object.left - (object.width * object.scaleX) / 2;
      const top = object.top - (object.height * object.scaleY) / 2;
      object.set({ originX: 'left', originY: 'top', left, top });
      object.saveData('MODIFIED', ['originX', 'left', 'top', 'originY']);
    }
    let group = null;
    if (canvas.getActiveObjects().length > 1) group = canvas.getActiveObject();
    if (!object) {
      return $('#notesMenu').hide();
    }

    if (!group) {
      index = options.indexOf(curSize);
      //if (curSize === 288) index = options.indexOf(288) - 1;
      if (curSize === 144) index = options.indexOf(144) - 1;
      let fontSize = options[index + 1];
      if (index === -1 && curSize > 7) {
        fontSize = curSize + 1;
      }
      if (object.type === 'WBText') {
        const width = (object.width * fontSize) / object.fontSize;
        let { left } = object;
        if (object.originX === 'center') {
          left += ((width - object.width) * object.scaleX) / 2;
        }
        const height = (object.height * fontSize) / object.fontSize;
        let { top } = object;
        if (object.originY === 'center') {
          top += ((height - object.height) * object.scaleY) / 2;
        }
        object.set('width', width);
        object.set('left', left);
        object.set('top', top);
      }
      object.set('fontSize', fontSize);
      object.saveData('MODIFIED', ['width', 'left', 'top', 'fontSize','originX','originY']);
    } else {
      let gIndex;
      group._objects.forEach(obj => {
        gIndex = options.indexOf(obj.fontSize) + 1;
        // if (gIndex > options.indexOf(288) - 1)
        //   gIndex = options.indexOf(288) - 1;
        if (gIndex > options.indexOf(144) - 1)
          gIndex = options.indexOf(144) - 1;
        obj.set('fontSize', options[gIndex]);
      });
      group.saveData('MODIFIED', ['fontSize']);
      if (displayFontSize === t('board.contextMenu.mixed')) {
        store.dispatch(handleChangeFontSize(t('board.contextMenu.mixed')));
      } else {
        store.dispatch(handleChangeFontSize(options[gIndex]));
      }
    }
    canvas.requestRenderAll();
    if (canvas.getActiveObject().hiddenTextarea)
      canvas.getActiveObject().hiddenTextarea.focus();
    if (object.obj_type === 'WBText' && !object.isEditing) {
      //计算originx y 从left和top变到center后，object的left和top的新值
      const originLeft = object.left + (object.width * object.scaleX) / 2;
      const originTop = object.top + (object.height * object.scaleY) / 2;
      object.set({
        originX: 'center',
        originY: 'center',
        left: originLeft,
        top: originTop
      });
      object.saveData('MODIFIED', ['originX', 'left', 'top', 'originY']);
    }
   
  };

  const open = Boolean(anchorEl);

  const handleMenuItemDOM = () =>
    options.map((option, index) => (
      <MenuItem
        data-cy={option}
        key={option}
        onClick={event => changeFontSize(event, index, option)}
        selected={index === selectedIndex}
        value={option}
      >
        {option}
      </MenuItem>
    ));

  return (
    <div
      
      style={{
        paddingLeft,
        paddingRight,
        display: 'flex',
        alignItems: 'center',
        display: 'flex',
        height: 44
      }}
    >
      <Button
        aria-controls="fontsize-menu"
        aria-haspopup="true"
        sx={{ borderColor: 'gainsboro',
        textAlign: 'right',
        color: '#150D33',
        borderRightWidth: 0,
        fontSize: 16,
        fontWeight: 400,
        height: 44,
        textTransform: 'none',
        minWidth: 25,
        padding: 0,
        paddingLeft: 0,
        '&:hover': {
          color: '#f21d6b'
        }}}
        onClick={handleClick}
      >
        {displayFontSize}
      </Button>
      <Menu
        anchorEl={anchorEl}
        autoFocus
        data-cy="FontSize"
        id="fontsize-menu"
        keepMounted
        onBlur={handleBlur}
        onChange={handleChange}
        onClose={handleClose}
        onFocus={handleFocus}
        open={open}
        value={displayFontSize}
      >
        {handleMenuItemDOM()}
      </Menu>

      <Box id="fontSizeBox" sx={{ display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '8px 0px',
    height: '44px',
    width: '20px',
    boxSizing: 'border-box',
    '.iconStyle':{ display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '8px 0px',
    height: '44px',
    width: '20px',
    boxSizing: 'border-box'}}}>
        <div
          className={'iconStyle'}
          onClick={event => increaseFontSize(event)}
        >
          <ArrowUpIcon size={6} />
        </div>
        <div
          className={'iconStyle'}
          onClick={event => decreaseFontSize(event)}
        >
          <ArrowDownIcon size={6} />
        </div>
      </Box>
    </div>
  );
}
