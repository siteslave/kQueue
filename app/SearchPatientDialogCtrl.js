'use strict';

const moment = require('moment');

angular.module('app.controllers.SearchPatientDialog', ['app.services.Search'])
.controller('SearchPatientDialogCtrl', ($scope, $mdDialog, $mdMedia, $mdToast,
                                        SearchService) => {

  $scope.answer = (answer) => {
    $mdDialog.hide(answer);
  };

  $scope.closeDialog = () => {
    $mdDialog.cancel();
  };

  $scope.queryChange = (e) => {
    //event.keyCode
    if (e.keyCode == 13) {
      $scope.doSearch();
    }
  };

  $scope.data = {};
  $scope.data.hn = '';
  $scope.data.vn = '';
  $scope.data.fullname = '';
  $scope.data.an = '';
  $scope.data.date_serv = '';

  $scope.patient = [];

  $scope.setIpd = (_data) => {
    $scope.data.an = _data.an;
    $scope.data.date_serv = _data.date_serv;
    $scope.data.time_serv = _data.regtime;
    $mdDialog.hide($scope.data);
  };

  $scope.setOpd = (_data) => {
    $scope.data.vn = _data.vn;
    $scope.data.date_serv = _data.date_serv;
    $scope.data.time_serv = _data.vsttime;
    $mdDialog.hide($scope.data);
  };

  $scope.doSearch = () => {

    $scope.data = {};
    $scope.data.hn = '';
    $scope.data.vn = '';
    $scope.data.fullname = '';
    $scope.data.an = '';

    $scope.opdVisit = [];
    $scope.ipdVisit = [];

    if ($scope.query) {
      let query = $scope.query.split(' ');
      if (query.length == 2) {
        // filter by first name and last name
        SearchService.searchByFirstLastName(query[0], query[1])
        .then((rows) => {
          $scope.patient = rows;
        }, (err) => {
          $mdToast.show(
            $mdToast.simple()
              .textContent('เกิดข้อผิดพลาด: ' + JSON.stringify(err))
              .position('bottom right')
              .hideDelay(3000)
          );
        })
      } else {
        // filter by first name
        SearchService.searchByFirst(query[0])
          .then((rows) => {
            $scope.patient = rows;
          }, (err) => {
            $mdToast.show(
              $mdToast.simple()
                .textContent('เกิดข้อผิดพลาด: ' + JSON.stringify(err))
                .position('bottom right')
                .hideDelay(3000)
            );
          })
      }
    } else {
      $mdToast.show(
        $mdToast.simple()
          .textContent('กรุณาระบุคำค้นหา')
          .position('bottom right')
          .hideDelay(3000)
      );
    }
   // console.log($scope.query);
  };


  let _getOpd = (_data) => {
    $scope.opdVisit = [];

    SearchService.getOpd(_data.hn)
      .then((rows) => {
        rows.forEach((v) => {
          let obj = {};
          obj.vn = v.vn;
          obj.hn = v.hn;
          obj.vstdate = moment(v.vstdate).format('DD/MM') + '/' + (parseInt(moment(v.vstdate).format('YYYY')) + 543);
          obj.date_serv = moment(v.vstdate).format('YYYY-MM-DD');
          obj.vsttime = moment(v.vsttime, 'HH:mm:ss').format('HH:mm');
          obj.spclty_name = v.spclty_name;

          $scope.opdVisit.push(obj);
        });

      }, (err) => {
        console.log(err);
      })
  };

  let _getIpd = (_data) => {

    $scope.ipdVisit = [];

    SearchService.getIpd(_data.hn)
      .then((rows) => {
        rows.forEach((v) => {
          let obj = {};
          obj.an = v.an;
          obj.hn = v.hn;
          obj.regdate = moment(v.regdate).format('DD/MM') + '/' + (parseInt(moment(v.regdate).format('YYYY')) + 543);
          obj.date_serv = moment(v.regdate).format('YYYY-MM-DD');
          obj.regtime = moment(v.regtime, 'HH:mm:ss').format('HH:mm');
          obj.ward_name = v.ward_name;

          $scope.ipdVisit.push(obj);
        });

      }, (err) => {
        console.log(err);
        alert('เกิดข้อผิดพลาด: ' + JSON.stringify(err))
      });
  };

  $scope.getService = (_data) => {

    $scope.data.fullname = _data.fullname;
    $scope.data.hn = _data.hn;
    $scope.data.vn = null;
    $scope.data.an = null;

    _getOpd(_data);
    _getIpd(_data);
  };

});