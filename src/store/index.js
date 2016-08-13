
const umc = require('umc');
const debug = require('debug');

const store = umc({});

// const config = require('config/client');
store.use(function(req, resp, next){
  debug('redirect directly to server invoke: '+req.url)
  // return util.json(config.apiServerUrl+req.url, req.body);//return resolve(count)
})

module.exports = store;

