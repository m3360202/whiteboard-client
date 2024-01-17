import { createSlice } from '@reduxjs/toolkit';
import * as fabric  from '@boardxus/x-canvas';

interface IContextMenuState {
  open: boolean;
  menuList: string[];
  position: fabric.Point;
  currentObject?: any;
}

const initialState: IContextMenuState = {
  menuList: [],
  position: new fabric.Point(-999, -999),
  open: false,
}

const contextMenuSlice = createSlice({
  name: 'mode',
  initialState,
  reducers: {
    // 更新菜单坐标
    updateContextMenuPosition(state, { payload }) {
      state.position = payload;
    },
    // 更新菜单位置
    updateContextMenuStatus(state, { payload }) {
      state.open = payload;
    },
    setCurrentContextMenu(state, { payload }) {
      if (payload) {
        state.currentObject = payload;
        canvas.setActiveObject(payload);
      }
      let menuListOfObject = [];
      if (payload && payload.getContextMenuList) {
        menuListOfObject = payload.getContextMenuList();
      }

      if (payload) {
        menuListOfObject.push('Copy as image');
        menuListOfObject.push('Copy As Text');
        menuListOfObject.push('Save as template');
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

export default contextMenuSlice;
export const {
  updateContextMenuPosition,
  updateContextMenuStatus,
  setCurrentContextMenu,
} = contextMenuSlice.actions;

