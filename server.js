

/*
Hello. Welcome to the D&D chat server. First check to see if the server is already running (server.js 6:12)
To activate the server click the run button to host.
Then click preview running application (under preview) to open the chat and drag it over to the main tabs to enlarge the page.
*/



//
// # SimpleServer
//
// A simple chat server using Socket.IO, Express, and Async.
//
var http = require('http');
var path = require('path');

var async = require('async');
var socketio = require('socket.io');
var express = require('express');

var filter = require('profanity-filter');
filter.seed('profanity');
filter.setReplacementMethod('word');
filter.addWord('redacted', '████████');

var profanity = require('profanity');

var filter2 = require('profanity-filter');
filter2.seed('profanity');
filter2.setReplacementMethod('word');
filter2.addWord('redacted','████████');
filter2.addWord('Choi','His Holiness the Supreme Overlord Choi, Divine Ruler of the Universe until the End of Time')

//
// ## SimpleServer `SimpleServer(obj)`
//
// Creates a new instance of SimpleServer with the following options:
//  * `port` - The HTTP port to listen on. If `process.env.PORT` is set, _it overrides this value_.
//
var router = express();
var server = http.createServer(router);
var io = socketio.listen(server);

router.use(express.static(path.resolve(__dirname, 'client')));
var messages = [];
var sockets = [];
var data;

io.on('connection', function (socket) {
    messages.forEach(function (data) {
      socket.emit('message', data);
    });
    
    socket.on('makeSelfAdmin', function() {
      broadcast('makeSelfAdmin');
    });
    
    socket.on('music', function(datas) {
      broadcast('music',datas);
    });
    
    sockets.push(socket);

    socket.on('disconnect', function () {
      sockets.splice(sockets.indexOf(socket), 1);
      updateRoster();
    });
    
    socket.on('clear', function () {
      messages = [];
      broadcast('clear');
    });
    
    socket.on('egghunt', function(name) {
      var data = {
        name: "Server",
        text: name + " found the easter egg. Good for him/her."
      };
      socket.emit('message',data);
    });

    socket.on('message', function (msg,choid) {
      var text = String(msg || '');

      if (!text)
        return;
      
      var x = new Date;
      
      socket.get('name', function (err, name) {
        var data = {
          name: name + ' (' + x.getHours() + ':' + x.getMinutes() + ':' + x.getSeconds() + ')',
          text: text
        };
      
      if (choid=="false") {
        data.text = filter.clean(text);
      }
      
        broadcast('message', data);
        messages.push(data);
      });
    });
    
    socket.on('profanity',function(text,name) {
      profanity.addProfanity(text);
      socket.emit('profaned',text,name);
    });
    
    socket.on('identify', function (name) {
      socket.set('name', String(name || 'Anonymous'), function (err) {
        updateRoster();
      });
    });
  });

function updateRoster() {
  async.map(
    sockets,
    function (socket, callback) {
      socket.get('name', callback);
    },
    function (err, names) {
      broadcast('roster', names);
    }
  );
}

function broadcast(event, data) {
  sockets.forEach(function (socket) {
    socket.emit(event, data);
  });
}

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Chat server listening at", addr.address + ":" + addr.port);
});
/***************************
  **\\**THE COMMS**//**
  
2018-09-22 "Pre-Alpha Released" (v0.1.0)
  +Add: Chat server
  +Add: Commands
*************************/
/*
Credits

Scripting:
  Henrik Evers

Debugging:
  Henrik Evers

Copy and Pasting:
  Henrik Evers

Playtesting:
  Henrik Evers

Special thanks to the devs of Conversa:
https://ide.c9.io/yatrikpatel/conversa
*/