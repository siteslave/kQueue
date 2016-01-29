((window, angular) => {
  "use strict";

  let open = require('open');

  angular.module('app.controller.Print', [])
    .controller('PrintCtrl', ($scope, $state, $window) => {

      $scope.pdfUrl = './pdf/001.pdf';

      $scope.page2 = () => {
        $scope.pdfUrl = './pdf/002.pdf';
      }

      $scope.print = () => {
        //var wnd = window.open($scope.pdfUrl);
        //wnd.print();
        //open($scope.pdfUrl);
        //ipcRenderer.sendSync('print-file');
        //let filename = './pdf/002.pdf';

        var w = window.open('./pdf/002.pdf');
        w.print();
      }
    });
})(window, window.angular);