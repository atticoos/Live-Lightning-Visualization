// data source: http://www.blitzortung.org/Webpages
angular.module('lightningApp').factory('WebSocket', function () {
  function MySocket(websocket) {
    this.messages = [];
    this.outbox = [];
    this.connected = false;
    this.websocket = websocket;
    this.websocket.onmessage = this._onMessage.bind(this);
    this.websocket.onopen = this._onConnected.bind(this);
    this.onMessage = angular.noop;
  }

  MySocket.prototype.send = function (message) {
    if (!this.connected) {
      this.outbox.push(message);
    } else {
      this.websocket.send(message);
    }
  };

  MySocket.prototype._onMessage = function (message) {
    var data = JSON.parse(message.data);
    this.onMessage(data);
  }

  MySocket.prototype._onConnected = function () {
    this.connected = true;
    for (var i = 0; i < this.outbox.length; i++) {
      this.send(this.outbox[i]);
    }
  };

  return function (endpoint) {
    var websocket;
    if (!endpoint) {
      endpoint = 'ws://websocketserver.blitzortung.org:8019/';
    }
    websocket = new WebSocket(endpoint);


    return new MySocket(websocket);
  };
});
