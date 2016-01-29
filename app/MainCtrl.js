"use strict";

angular.module('app.controller.Main', [])
  .controller('MainCtrl', ($scope, $state, $window, $mdSidenav) => {

    let logged = $window.sessionStorage.getItem('logged');

    if (!logged) {
      $state.go('login');
    }

  });