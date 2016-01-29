"use strict";

angular.module('app.controllers.Login', ['app.services.Login'])
  .controller('LoginCtrl', function ($scope, $state, $window, $mdToast, LoginService) {

    $scope.login = function () {
      if (!$scope.username || !$scope.password) {
        $mdToast.show(
          $mdToast.simple()
            .textContent('กรุณาระบุชื่อผู้ใช้งาน และ รหัสผ่าน')
            .position('right bottom')
            .hideDelay(3000)
        );
      } else {
        LoginService.doLogin($scope.username, $scope.password)
          .then(() => {
            $window.sessionStorage.setItem('logged', true);
            $state.go('main');
          }, (err) => {
            $mdToast.show(
              $mdToast.simple()
                .textContent('ไม่สามารถเข้าสู่ระบบได้ : ' + JSON.stringify(err))
                .position('right bottom')
                .hideDelay(3000)
            );
          })
      }
    }

  });