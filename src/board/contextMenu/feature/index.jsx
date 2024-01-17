import { Divider, Menu, MenuItem } from '@mui/material'
import { RootState } from '../../../store';
import { updateContextMenuStatus } from '../../../store/contextMenu';
import React from 'react'
import ReactDOM from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';

const ContextMenu = () => {
  const dispatch = useDispatch();
  const {menuList, position, open} = useSelector((state) => state.contextMenu);
  const doc = document.body;

  return ReactDOM.createPortal(
    <Menu 
      anchorPosition={{top: position.y, left: position.x }}
      anchorReference="anchorPosition"
      id="contextMenu"
      keepMounted
      // onBlur={handleBlur}
      onClose={() => dispatch(updateContextMenuStatus(false))}
      // onFocus={handleFocus}
      open={open}>
      <div>
        { 
          menuList.menu1.length > 0 ?
          <>
            {menuList.menu1.map(item => <MenuItem key={item.title}>{item.title}</MenuItem>)}
            { menuList.menu2.length > 0 ? <Divider light />: null }
          </> : null
        } {
          menuList.menu2.length > 0 ?
          <>
            {menuList.menu2.map(item => <MenuItem key={item.title}>{item.title}</MenuItem>)}
            { menuList.menu3.length > 0 ? <Divider light />: null }
          </> : null
        } {
          menuList.menu3.length > 0 ?
          <>
            {menuList.menu3.map(item => <MenuItem key={item.title}>{item.title}</MenuItem>)}
            { menuList.menu4.length > 0 ? <Divider light />: null }
          </> : null
        } {
          menuList.menu4.length > 0 ?
          <>
            {menuList.menu4.map(item => <MenuItem key={item.title}>{item.title}</MenuItem>)}
          </> : null
        }
      </div>
    </Menu>
    ,
    doc
  );
};

export default ContextMenu;