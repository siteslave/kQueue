"use strict";

const ipcRenderer = require('electron').ipcRenderer;
const fs = require('fs');
const path = require('path');
const open = require('open');
const request = require('request');

const filesize = require('filesize');

angular.module('app.controller.Upload', ['app.services.Upload'])
  .controller('UploadCtrl', ($scope, $mdMedia, $window, $mdDialog, $state, $mdToast, UploadService) => {

    let logged = $window.sessionStorage.getItem('logged');

    if (!logged) {
      $state.go('login');
    }

    $scope.fileType = null;

    $scope.files = [];
    $scope.patient = {};

    $scope.doUpload = () => {

      let _files = [];

      if ($scope.files.length) {

        let _detail = [];
        $scope.files.forEach((v) => {
          let _fs = fs.createReadStream(v.path);
          _files.push(_fs);
          _detail.push({type: v.type_code, fileName: v.fileName});
        });

        var data = {
          files: _files,
          patient: JSON.stringify($scope.patient),
          file_detail: JSON.stringify(_detail)
        };

        UploadService.upload(data)
        .then(() => {
          $mdToast.show(
            $mdToast.simple()
              .textContent('อัปโหลดเสร็จเรียบร้อยแล้ว')
              .position('right bottom')
              .hideDelay(3000)
          );

          $scope.files = [];
          $scope.patient.hn = null;
          $scope.patient.vn = null;
          $scope.patient.fullname = null;
          $scope.patient.an = null;
          $scope.patient.date_serv = null;

        }, (err) => {
          $mdToast.show(
            $mdToast.simple()
              .textContent('ไม่สามารถอัปโหลดได้ ' + JSON.stringify(err))
              .position('right bottom')
              .hideDelay(3000)
          );
        });

      } else {
        $mdToast.show(
          $mdToast.simple()
            .textContent('กรุณาเลือกไฟล์ที่ต้องการอัปโหลด')
            .position('right bottom')
            .hideDelay(3000)
        );
      }
    };
    /*
    type 1: chart, 2: x-ray, 3: ekg, 4: lab, 5: other
     */
    $scope.openFile = (type) => {

      let files = ipcRenderer.sendSync('open-file');
      if (files.length) {
        files.forEach((v) => {
          let stat = fs.statSync(v);
          let obj = {};
          obj.fileName = path.basename(v);
          obj.size = filesize(stat.size);
          obj.path = v;
          obj.type_code = type;
          obj.type_name = type == '1' ? 'CHART' : type == '2' ? 'X-RAY' : type == '3' ? 'EKG' : type == '4' ? 'LAB' :  type == '5' ? 'OTHER' : 'ไม่ทราบ';
          $scope.files.push(obj);
        });

        //console.log($scope.files);

      } else {
        // No file selected
        $mdToast.show(
          $mdToast.simple()
            .textContent('กรุณาเลือกไฟล์ที่ต้องการอัปโหลด')
            .position('right bottom')
            .hideDelay(3000)
        );
      }
    };

    $scope.removeDocument = (idx) => {
      if (idx >= 0) {
        if (confirm('คุณต้องการยกเลิกไฟล์นี้ ใข่หรือไม่?')) {
          $scope.files.splice(idx, 1);
        }
      }
    };

    $scope.showSearchPatient = function(ev) {
      //var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && false;

      $scope.patient.hn = null;
      $scope.patient.vn = null;
      $scope.patient.fullname = null;
      $scope.patient.an = null;
      $scope.patient.date_serv = null;

      $mdDialog.show({
          controller: 'SearchPatientDialogCtrl',
          templateUrl: './partials/search_patient_dialog.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true,
          fullscreen: true
        })
        // Returned data
        .then(function(data) {
          if (data) {

            console.log(data);

            if (data.vn) {
              // opd
              $scope.patient.hn = data.hn;
              $scope.patient.vn = data.vn;
              $scope.patient.fullname = data.fullname;
              $scope.patient.date_serv = data.date_serv;
              $scope.patient.time_serv = data.time_serv;
            } else {
              // ipd
              $scope.patient.hn = data.hn;
              $scope.patient.an = data.an;
              $scope.patient.fullname = data.fullname;
              $scope.patient.date_serv = data.date_serv;
              $scope.patient.time_serv = data.time_serv;
            }
          }
        }, function() {
          console.log('Cancel dialog')
        });

    };

    $scope.openPdf = (pdf) => {

      fs.access(pdf, fs.F_OK, (err) => {
        if (err) {
          $mdToast.show(
            $mdToast.simple()
              .textContent('ไม่สามารถเปิดไฟล์นี้ได้')
              .position('right bottom')
              .hideDelay(3000)
          );
        } else {
          open(pdf);
        }
      })

    }

  });