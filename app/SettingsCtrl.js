"use strict";

angular.module('app.controller.Settings', [])
  .controller('SettingsCtrl', ($scope, Config, Encrypt) => {

    let fse = require('fs-extra');

    $scope.config = Config.getConfig();
    $scope.config.hosxp.password = Encrypt.decrypt($scope.config.hosxp.password);
    //console.log($scope.config.hosxp.password)

    //console.log($scope.config);

    $scope.save = () => {
      let configFile = Config.getConfigFile();
      $scope.config.hosxp.password = Encrypt.encrypt($scope.config.hosxp.password);
      fse.writeJson(configFile, $scope.config, (err) => {
        if (err) {
          console.log(err);
          alert('ไม่สามารถบันทึกข้อมุลได้')
        } else {
          alert('บันทึกข้อมูลเสร็จเรียบร้อยแล้ว')
        }
      });
    }
  });