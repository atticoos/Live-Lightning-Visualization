'use strict';

angular.module('lightningApp')
  .controller('MainCtrl', function ($scope, $rootScope, $window, LightningSocket) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    $scope.lightningData = LightningSocket.data;

    $scope.hasWebSocket = angular.isFunction($window.WebSocket);

  });
