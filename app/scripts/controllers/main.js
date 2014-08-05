'use strict';

angular.module('lightningApp')
  .controller('MainCtrl', function ($scope, WebSocket) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    var socket = WebSocket();
    socket.send(JSON.stringify({"region":'1',"west":'-130.0',"east":'-60',"north":'62.5',"south":'2.3'}));

    socket.onMessage = function (msg) {
      console.log("MESSAGE", msg);
    }

  });
