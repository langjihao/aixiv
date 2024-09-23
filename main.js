// main.js
const { app, BrowserWindow, globalShortcut,Menu } = require('electron');
const path = require('path');
require('electron-reload')(path.join(__dirname), {
  electron: path.join(__dirname, 'node_modules', '.bin', 'electron'), // 指定 Electron 的路径
});
let mainWindow; // 主窗口
let tabWindows = []; // 存储标签页窗口

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // 可选，使用预加载脚本
      allowRunningInsecureContent: true, // 允许不安全的内容
      contextIsolation: true,
      enableRemoteModule: false,
    },
    frame:true,
    titleBarStyle: 'hiddenInset',
    autoHideMenuBar: true
    
  });

  mainWindow.loadURL('http://localhost:3000'); // 加载 Next.js 应用
   // 注册全局快捷键
  const ret = globalShortcut.register('CommandOrControl+J', () => {
    console.log('CommandOrControl+J is pressed');
    // 在这里添加您希望执行的操作
  });

  if (!ret) {
    console.log('Registration failed');
  }
  // 创建菜单
  // const menu = Menu.buildFromTemplate([
  //   {
  //     label: 'File',
  //     submenu: [
  //       {
  //         label: 'New Tab',
  //         click: () => {
  //           createTab(); // 创建新标签页
  //         },
  //       },
  //       { role: 'quit' },
  //     ],
  //   },
  // ]);
  // Menu.setApplicationMenu(menu);
}
function createTab() {
  const tabWindow = new BrowserWindow({
    width: 800,
    height: 600,
    parent: mainWindow, // 设置父窗口
    webPreferences: {
      contextIsolation: true,
      enableRemoteModule: false,
    },
  });

  tabWindow.loadURL('http://localhost:3000/pdfviewer/pdf'); // 加载新标签页内容
  tabWindows.push(tabWindow); // 存储标签页窗口

  // 监听标签页关闭事件
  tabWindow.on('closed', () => {
    tabWindows = tabWindows.filter(win => win !== tabWindow); // 从数组中移除关闭的标签页
  });
}
app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
app.on('ready', () => {
  app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
    event.preventDefault(); // 忽略证书错误
    callback(true); // 允许连接
  });

  createWindow();
});
app.on('will-quit', () => {
  // 注销所有快捷键
  globalShortcut.unregisterAll();
});

// main.js 多标签页布局，暂时用不到
// const { app, BrowserWindow } = require('electron');
// const path = require('path');

// function createWindow() {
//   const win = new BrowserWindow({
//     width: 800,
//     height: 600,
//     webPreferences: {
//       contextIsolation: true,
//       preload: path.join(__dirname, 'preload.js'), // 预加载脚本
//     },
//   });

//   win.loadFile('index.html'); // 加载 HTML 文件
// }

// app.whenReady().then(createWindow);

// app.on('window-all-closed', () => {
//   if (process.platform !== 'darwin') {
//     app.quit(); // 关闭所有窗口时退出应用
//   }
// });

// app.on('activate', () => {
//   if (BrowserWindow.getAllWindows().length === 0) {
//     createWindow(); // 在 macOS 上重新创建窗口
//   }
// });