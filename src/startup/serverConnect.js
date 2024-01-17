import simpleDDP from 'simpleddp';
import ws from 'isomorphic-ws';
import { handleSetConnectionStatus } from '../store/system';
import { handleSetSocketConnectStatus } from '../store/user'
import { ChatOpenAI } from "langchain/chat_models/openai";
const simpleDDPLogin = require("simpleddp-plugin-login").simpleDDPLogin;
import store from '../store';
import { async } from 'rxjs';

var endpoint = "";
export let CLOUD_FUNCTION_URL;

if (window.location.hostname === "localhost") {
  endpoint = "ws://localhost:8000/websocket";
  CLOUD_FUNCTION_URL = "http://localhost:8787";
  // CLOUD_FUNCTION_URL="https://cloudservice-ai.boardx.us";
}
else if (window.location.hostname === "develop.boardx-client.pages.dev") {
  endpoint = "wss://devserver.boardx.us/websocket";
  CLOUD_FUNCTION_URL = "https://boardxai-dev.boardx.us";
}
else if (window.location.hostname === "app.boardx.us") {
  endpoint = "wss://prdserver.boardx.us/websocket";
  CLOUD_FUNCTION_URL = "https://boardxai.boardx.us";
}

// create connection to server
const opts = {
  //     // endpoint: "wss://devserver.boardx.us/websocket", // online
  // // endpoint: "ws://localhost:8000/websocket", // local 
  // endpoint: "wss://prdserver.boardx.us/websocket", // us production
  endpoint: endpoint,
  SocketConstructor: ws,
  reconnectInterval: 1000,
  autoReconnect: true,
  autoReconnectTimer: 500,
  maintainCollections: true,
  ddpVersion: '1', // ['1', 'pre2', 'pre1'] available
};

const server = new simpleDDP(opts, [simpleDDPLogin]);

window.server = server;

export default server;

server.on('connected', () => {
  // do something
  store.dispatch(handleSetConnectionStatus(true));
});

server.on('disconnected', () => {
  // for example show alert to user
  store.dispatch(handleSetConnectionStatus(false));
});

setInterval(async () => {
  try {
    await testConnectionWithTimeout();
  }catch(e){
    console.log(e)
    store.dispatch(handleSetConnectionStatus(false));
  }
 

},2000);


function timeoutError(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error('Timeout error'));
    }, ms);
  });
}

async function testConnection() {
  try {
    await server.call('testConnection');
    store.dispatch(handleSetConnectionStatus(true));
  } catch (e) {
    store.dispatch(handleSetConnectionStatus(false));
  }
}

async function testConnectionWithTimeout() {
 
    const response = await Promise.race([
      testConnection(),
      timeoutError(3000)
    ]);
    
 
}

server.on('error', (e) => {
  // global errors from server
});

server.on('login', (m) => {
  console.log('User logged in as', m);
});

server.on('logout', () => {
  console.log('User logged out');
});

server.on('loginSessionLost', id => {
  console.log('User  lost connection to server, will auto resume by default with token', id);

});


server.on('loginResumeFailed', (m) => {
  console.log('Failed to resume authorization with token after reconnection ', m);
});