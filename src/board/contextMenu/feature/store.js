import * as fabric  from '@boardxus/x-canvas';
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  menuList: [],
  menuList1: {
    menu1: [],
    menu2: [],
    menu3: [],
    menu4: [],
  },
  position: new fabric.Point(-999, -999),
  open: false,
}

const contextMenuSlice = createSlice({
  name: 'mode',
  initialState,
  reducers: {
    // 更新菜单内容
    updateContextMenuList(state, {payload}) {
      let menuList = [];
      if (payload && payload.getContextMenuList) {
        menuList = payload.getContextMenuList();
      }
      
      if (payload) {
        menuList.push('Copy as image');
        menuList.push('Copy As Text');
        menuList.push('Exporting Selected Area');
      }

      if (payload && payload.obj_type === 'WBGroup') {
        menuList.push('Ungroup');
      }

      menuList.push('Export Board');
      menuList.push('Create Share Back');
      menuList.push('Unlock All');
      menuList.push('Select All');

      if (payload && !payload.locked) {
        menuList.push('Paste');
      }

      menuList = menuList.map(item => item.toUpperCase());

      const obj = {
        menu1: [],
        menu2: [],
        menu3: [],
        menu4: [],
      }

      const tempOrderMenu = JSON.parse(JSON.stringify(OrderMenu));

      for(let i=0; i<menuList.length; i++ ) {
        const item = menuList[i];
        const key = item.toUpperCase();
        tempOrderMenu[key] = MenuOperators[key]; 
      }

      for(let key in tempOrderMenu) {
        if(!tempOrderMenu[key]) continue;

        if(menu1.includes(key)) {
          obj.menu1.push(tempOrderMenu[key])
        }
        if(menu2.includes(key)) {
          obj.menu2.push(tempOrderMenu[key])
        }
        if(menu3.includes(key)) {
          obj.menu3.push(tempOrderMenu[key])
        }
        if(menu4.includes(key)) {
          obj.menu4.push(tempOrderMenu[key])
        }
      }

      console.log(obj);
      state.menuList = obj;
    },
    // 更新菜单坐标
    updateContextMenuPosition(state, {payload}) {
      state.position = payload;
    },
    // 更新菜单位置
    updateContextMenuStatus(state, {payload}) {
      state.open = payload;
    },

    setCurrentContextMenu(state, {payload}) {
      state.currentObject = payload;
      let menuListOfObject = [];
      if (payload && payload.getContextMenuList) {
        menuListOfObject = payload.getContextMenuList();
      }

      if (payload) {
        menuListOfObject.push('Copy as image');
        menuListOfObject.push('Copy As Text');
        menuListOfObject.push('Exporting selected area');
      }
      if (payload && payload.obj_type === 'WBGroup') {
        menuListOfObject.push('Ungroup');
      }

      menuListOfObject.push('Export board');
      menuListOfObject.push('Create share back');
      menuListOfObject.push('Unlock All');
      menuListOfObject.push('Select All');

      if (payload && !payload.locked) {
        menuListOfObject.push('Paste');
      }

      state.menuList = menuListOfObject;
    }
  }
});

export default contextMenuSlice.reducer;
export const {
  updateContextMenuList,
  updateContextMenuPosition,
  updateContextMenuStatus,
  setCurrentContextMenu,
} = contextMenuSlice.actions;

