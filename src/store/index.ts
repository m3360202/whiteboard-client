//** Import Redux kits
import {
  configureStore,
  Action,
  ThunkAction,
  getDefaultMiddleware
} from '@reduxjs/toolkit';
import { api } from '../redux/api';

//** Import Slices
import AIAssistSlice from './AIAssist'
import boardSlice from './board';
import boardListSlice from './boardList';
import domAreaSlice from './domArea';
import modeSlice from './mode';
import modalSlice from './modal';
import orgSlice from './org';
import permissionSlice from './permission';
import roomSlice from './room';
import sideBarSlice from './sideBar';
import timerSlice from './board/timer';
import userSlice from './user';
import resourceSlice from './resource';
import slideSlice from './slides';
import widget from './widget';
import widgets from './widgets';
import systemSlice from './system';
import settingsSlice from './system';
// import { conferenceSlice } from '../.Jitsi/store/conferenceSlice';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import contextMenuSlice from './contextMenu';
import widgetMenuSlice from './widgetMenu';

// import {orgApi} from '../redux/OrgAPISlice';

const store = configureStore({
  reducer: {

    [api.reducerPath]: api.reducer,
    AIAssist: AIAssistSlice.reducer,
    board: boardSlice.reducer,
    boardList: boardListSlice.reducer,
    domArea: domAreaSlice.reducer,
    mode: modeSlice,
    modal: modalSlice.reducer,
    org: orgSlice.reducer,
    permission: permissionSlice.reducer,
    room: roomSlice.reducer,
    sideBar: sideBarSlice.reducer,
    timer: timerSlice.reducer,
    resource: resourceSlice.reducer,
    slides: slideSlice.reducer,
    user: userSlice.reducer,
    widget: widget,
    widgets: widgets.reducer,
    system: systemSlice.reducer,
    contextMenu: contextMenuSlice.reducer,
    widgetMenu: widgetMenuSlice.reducer,
    settings:settingsSlice.reducer
    // conference: conferenceSlice.reducer
  },
  middleware: getDefaultMiddleware({
    serializableCheck: false
  }).concat(api.middleware),
});
(window as any).store = store;
// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
export default store;