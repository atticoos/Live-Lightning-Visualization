angular.module('lightningApp').factory('LightningSocket', function (WebSocket, $rootScope) {
  var lightningData = [],
      socket = WebSocket();

  socket.send(JSON.stringify({"region":'1',"west":'-130.0',"east":'-60',"north":'62.5',"south":'2.3'}));

  socket.onMessage = function (msg) {
    lightningData.push(msg);
    console.log('msg', msg);
    $rootScope.$apply();
  };


  return {
    data: lightningData
  };
});
