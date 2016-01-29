"use strict";

((window, angular) => {

  let fse = require('fs-extra');
  let ipcRenderer = require('electron').ipcRenderer;

  angular.module('app.tools.Config', [])
  .factory('Config', (Encrypt) => {

    let configFile = ipcRenderer.sendSync('get-config-file');

    return {
      getConfigFile() {
        return configFile
      },
      getConfig() {
        return fse.readJsonSync(configFile)
      },
      getMySQLConnection() {
        let strConnection = fse.readJsonSync(configFile).hosxp;
        strConnection.password = Encrypt.decrypt(strConnection.password);
        console.log(strConnection);

        return require('knex')({
          client: 'mysql',
          connection: strConnection
        });
      }
    }
  })
})(window, window.angular);