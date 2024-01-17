import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';

/* eslint-disable no-undef */
import Util from './util/utility';
import Settings from './startup/variableSettings'; 

//** Import Services
import {
  SysService,
} from './services/index';

//** Import others
import App from './layouts/App';
import { initializeFonts } from './board/canvas/initialize/initializeFonts';

window.Boardx = window.Boardx || {};
Boardx.UI = {};
Boardx.Util = {};
Boardx.Setting = {};
Boardx.Streamer = {};
Boardx.state = {};
Boardx.Instance = {};

Boardx.Settings = Settings;
Boardx.Util = Util;

SysService.init();
if(window.location.host.indexOf('app.boardx.us') > -1){
  console.log = function(){}
}
const root = ReactDOM.createRoot(document.getElementById('root'));
await initializeFonts();

root.render(

    <App />

);

reportWebVitals();
