"use strict";

angular.module('app', [
    'ngMaterial', 'ui.router', 'md.data.table',
    'app.tools.Config', 'app.tools.Encrypt', 'app.controller.Main', 'app.controller.Settings',
    'app.controller.Upload', 'app.controllers.SearchPatientDialog',
    'app.controllers.Login'
  ])
  .config(($stateProvider, $urlRouterProvider) => {
    $urlRouterProvider.otherwise("/");

    $stateProvider
      .state('main', {
        url: "/",
        templateUrl: "partials/main.html",
        controller: 'MainCtrl'
      })
      .state('settings', {
        url: "/settings",
        templateUrl: "partials/settings.html",
        controller: 'SettingsCtrl'
      })
      .state('upload', {
        url: "/upload",
        templateUrl: "partials/upload.html",
        controller: 'UploadCtrl'
      })
      .state('login', {
        url: "/login",
        templateUrl: "partials/login.html",
        controller: 'LoginCtrl'
      });
  })
.controller('AppCtrl', ($scope, $mdMedia, $rootScope, $state, $window, $timeout, $mdSidenav, Config) => {

  $scope.go = (state) => {
    $state.go(state)
  };

  $scope.logout = () => {
    $window.sessionStorage.removeItem('logged');
    $state.go('login')
  };

  //console.log(Config.getConfigFile());

  $scope.toggleLeft = buildDelayedToggler('left');
  $scope.toggleRight = buildToggler('right');
  $scope.isOpenRight = function(){
    return $mdSidenav('right').isOpen();
  };
  /**
   * Supplies a function that will continue to operate until the
   * time is up.
   */
  function debounce(func, wait, context) {
    var timer;
    return function debounced() {
      var context = $scope,
        args = Array.prototype.slice.call(arguments);
      $timeout.cancel(timer);
      timer = $timeout(function() {
        timer = undefined;
        func.apply(context, args);
      }, wait || 10);
    };
  }
  /**
   * Build handler to open/close a SideNav; when animation finishes
   * report completion in console
   */
  function buildDelayedToggler(navID) {
    return debounce(function() {
      $mdSidenav(navID)
        .toggle()
        .then(function () {
          //$log.debug("toggle " + navID + " is done");
        });
    }, 200);
  }
  function buildToggler(navID) {
    return function() {
      $mdSidenav(navID)
        .toggle()
        .then(function () {
          //$log.debug("toggle " + navID + " is done");
        });
    }
  }
});
