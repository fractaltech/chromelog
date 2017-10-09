'use strict';

var request = require('superagent');

var _require = require('./config');

var host = _require.host;
var port = _require.port;


function log() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  if (log.endpoint === null) {
    return Promise.reject('chromelog endpoint not set');
  }

  return new Promise(function (resolve, reject) {
    request.post(log.endpoint).set({ 'Content-Type': 'application/json' }).send(args).end(function (err, res) {
      if (err || !res.ok) {
        reject(res ? res.body ? res.body : res : err);
      } else {
        resolve(res.body);
      }
    });
  });
}

log.endpoint = null;

module.exports = log;