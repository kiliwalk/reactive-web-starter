'use strict';

const env = process.env.NODE_ENV!=='production'?'development':'production';
const path = require('path');
const serverConfig = require('../config/server');

const ums = require('ums');
const expressPromisify = require('express-middleware-promisify');
const router = require('use-router')();
const useStatic = require('use-static');
const useSend = require('use-send');
const useCache = require('use-cache');
const app = ums();
app.use(useSend());
app.use(useCache());

// const express = require('express');
// const router = express.Router();
// const useStatic = express.static;
// const app = express();

if(env==='development'){
  router.use((req, resp, next)=>{
    console.log(req.method, req.url);
    return next();
  })
}

// router.use('/public', express.static('public'));

if(serverConfig.proxy){
  const httpProxy = require('http-proxy');
  const proxy = httpProxy.createProxyServer({target: serverConfig.proxy});

  // /api/a=>/api/a
  router.use('/api', function(req, resp, next){
    return new Promise((resolve, reject)=>{
      proxy.web(req, resp, (e)=>{
        if(e) return reject(e);
        else return resolve();
      })
    })
  })
}

router.use(expressPromisify(require('connect-history-api-fallback')({verbose: false})))

if(env==='development'){
  const webpack = require('webpack');
  const webpackConfig = require('../config/webpack');
  const compiler = webpack(webpackConfig);

  router.use(expressPromisify(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    // lazy: false,
    publicPath: webpackConfig.output.publicPath,
    stats: {colors: true}
  })))
  router.use(expressPromisify(require('webpack-hot-middleware')(compiler)))
}else{//production
  // const staticMw = express.static(path.resolve(__dirname, '../dist/static'), {maxAge: '1year'});
  const staticMw = useStatic(path.resolve(__dirname, '../client/static'), {maxAge: '1year'});
  router.get('/', staticMw)
  router.get('/index.html', staticMw)
  router.use('/static', staticMw);
}

app.use(router);

app.listen(serverConfig.port, function(err) {
  if (err) {
    console.error(err);
  } else {
    console.info(`==> 🚧  The ${env} server listening on port ${serverConfig.port}`);
  }
});
