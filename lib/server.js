#!/usr/bin/env node
'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var http = require('http');
var socketIO = require('socket.io');
var exec = require('child_process').exec;
var os = require('os');

function run(host, port) {
  var app = express();
  var server = http.Server(app);
  var io = socketIO(server);

  // parse application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({ extended: true }));
  // parse application/json
  app.use(bodyParser.json({ limit: '50mb' }));
  // enable cors
  app.use(cors());

  app.post('/', function (req, res) {
    res.send({ msg: 'ok' });
    io.emit('log', req.body);
  });

  app.get('/', function (req, res) {
    res.send('\n<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.4.5/socket.io.js"></script>\n<script>\n  var socket = io.connect(\'http://' + host + ':' + port + '\');\n  socket.on(\'log\', function (data) {\n    console.log(...data);\n  });\n</script>\n<script>\n  console.log(\'The logs, here you will see\')\n</script>\n<body>\n  <h1 style="font-family: \'sans-serif\'">The Console, Open</h1>\n</body>\n    ');
  });

  server.listen(port, host, function () {
    console.log('listening on ' + host + ':' + port);
    exec('google-chrome http://' + host + ':' + port);
    printIp(port);
  });
}

// something to print ip wherever
function printIp(port) {
  var ifaces = os.networkInterfaces();

  Object.keys(ifaces).forEach(function (ifname) {
    var alias = 0;

    ifaces[ifname].forEach(function (iface) {
      if (iface.family !== 'IPv4' || iface.internal !== false) {
        // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
        return;
      }

      if (alias >= 1) {
        // this single interface has multiple ipv4 addresses
        console.log(ifname + ' : ' + alias, 'chromelog endpoint: http://' + iface.address + ':' + port);
      } else {
        // this interface has only one ipv4 adress
        console.log(ifname, 'chromelog endpoint: http://' + iface.address + ':' + port);
      }
      alias = alias + 1;
    });
  });
}

if (require.main === module) {
  var _require = require('./config');

  var host = _require.host;
  var port = _require.port;

  var args = process.argv.slice(2);

  if (args.length === 0) {
    run(host, port);
  } else if (args.length === 1) {
    run(host, args[0]);
  } else {
    run(args[1], args[0]);
  }
}