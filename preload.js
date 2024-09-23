// preload.js
const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  // 在这里暴露您需要的 API
});