#!/usr/bin/env node

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const socketIO = require('socket.io');
const exec = require('child_process').exec;
const os = require('os');

function run(host, port) {
  const app = express();
  const server = http.Server(app);
  const io = socketIO(server);

  // parse application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({extended: true}));
  // parse application/json
  app.use(bodyParser.json({limit: '50mb'}));
  // enable cors
  app.use(cors());

  app.post('/', (req, res) => {
    res.send({msg: 'ok'});
    io.emit('log', req.body);
  });

  app.get('/', (req, res) => {
    res.send(`
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.4.5/socket.io.js"></script>
<script>
  var socket = io.connect('http://${host}:${port}');
  socket.on('log', function (data) {
    console.log(...data);
  });
</script>
<script>
  console.log('The logs, here you will see')
</script>
<body>
  <h1 style="font-family: 'sans-serif'">The Console, Open</h1>
</body>
    `)
  })

  server.listen(port, host, () => {
    console.log(`listening on ${host}:${port}`);
    exec(`google-chrome http://${host}:${port}`);
    printIp(port);
  });
}

// something to print ip wherever
function printIp(port) {
  const ifaces = os.networkInterfaces();

  Object.keys(ifaces).forEach((ifname) => {
    let alias = 0;

    ifaces[ifname].forEach((iface) => {
      if (iface.family !== 'IPv4' || iface.internal !== false) {
        // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
        return;
      }

      if (alias >= 1) {
        // this single interface has multiple ipv4 addresses
        console.log(`${ifname} : ${alias}`, `chromelog endpoint: http://${iface.address}:${port}`);
      } else {
        // this interface has only one ipv4 adress
        console.log(ifname, `chromelog endpoint: http://${iface.address}:${port}`);
      }
      alias = alias+1;
    });
  });
}

if (require.main === module) {
  const {host, port} = require('./config');
  const args = process.argv.slice(2);

  if (args.length === 0) {
    run(host, port);
  } else if (args.length === 1) {
    run(host, args[0]);
  } else {
    run(args[1], args[0]);
  }
}
