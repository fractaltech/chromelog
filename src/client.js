const request = require('superagent');
const {host, port} = require('./config');

function log(...args) {
  if (log.endpoint === null) {
    return Promise.reject('chromelog endpoint not set');
  }

  return new Promise((resolve, reject) => {
    request
      .post(log.endpoint)
      .set({'Content-Type': 'application/json'})
      .send(args)
      .end((err, res) => {
        if (err || !res.ok) {
          reject(res ? (res.body ? res.body : res) : err);
        } else {
          resolve(res.body);
        }
      })
  })
}

log.endpoint = null;

module.exports = log;
