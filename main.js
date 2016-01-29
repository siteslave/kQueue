'use strict';

const electron = require('electron');
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;
// ipc module
const ipcMain = electron.ipcMain;
// dialog
const dialog = electron.dialog;

const _crypto = require('crypto');
const algorithm = 'aes-256-ctr';
const salt = 'mANiNThEdARk';

let mainWindow;
let fse = require('fs-extra');
let path = require('path');
let fs = require('fs');

function createWindow () {

  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600});

  // and load the index.html of the app.
  mainWindow.loadURL('file://' + __dirname + '/index.html');

  let dataPath = app.getPath('appData');
  let appPath = path.join(dataPath, 'kdoc');
  let configFile = path.join(appPath, 'config.json');

  let cipher = _crypto.createCipher(algorithm, salt);
  let _crypted = cipher.update('123456', 'utf8', 'hex');
  _crypted += cipher.final('hex');

  fse.ensureDirSync(appPath);
  fs.access(configFile, fs.W_OK && fs.R_OK, (err) => {
    if (err) {
      let defaultConfig = {
        hosxp: {
          host: '127.0.0.1',
          database: 'hos',
          port: 3306,
          user: 'sa',
          password: _crypted
        },

        url: 'http://localhost:3000',
        key: 'aaf891ddefffa0914b4d17e701cf5bd493ec2504'
      };

      fse.writeJsonSync(configFile, defaultConfig);

    }
  });

  ipcMain.on('open-file', function(event) {
    let file = dialog.showOpenDialog({
      properties: [ 'openFile', 'multiSelections' ],
      filters: [
        { name: 'PDF', extensions: ['pdf'] },
        //{ name: 'PNG Image', extensions: ['png'] }
      ]
    });
    if (file) event.returnValue = file;
    else event.returnValue = null;
  });

  ipcMain.on('get-config-file', function(event, arg) {
    event.returnValue = configFile;
  });

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    mainWindow = null;
  });



}

app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});
