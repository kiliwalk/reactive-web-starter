
const path = require('path');
const distRootPath = path.resolve(__dirname, '../../dist');
const staticRootPath = path.join(distRootPath, 'client/static');

////with this we can use require('lib') directly 
process.env.NODE_PATH = distRootPath
require('module').Module._initPaths();

process.on('unhandledRejection', (err, p) => {
  console.warn("Unhandled Rejection at: Promise ", p, ", error: ", err.stack || err.toString());
});

const env = process.env.NODE_ENV!=='production'?'development':'production';
const isDev = env==='development';

const enableSSR = process.env.ENABLE_SSR === 'true';

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

if(isDev){
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

//rewrite all react-router route urls to /index.html, like /about
if(!isDev && enableSSR){
  router.use((req, resp, next)=>{
    let originUrl = req.url;
    return (expressPromisify(require('connect-history-api-fallback')({verbose: false})))(req, resp)
    .then(()=>{
      if(!isDev && req.url!==originUrl){//rewrite url
        return require('./server-render')({url: originUrl, next, resp})
      }
      return next();
    })
  })
}else{
  router.use(expressPromisify(require('connect-history-api-fallback')({verbose: false})));
}

if(isDev){
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
  const staticMw = useStatic(staticRootPath, {maxAge: '1year'});
  router.get('/', staticMw)
  router.get('/index.html', staticMw)
  router.use('/static', staticMw);
}

app.use(router);

app.listen(serverConfig.port, function(err) {
  if (err) {
    console.error(err);
  } else {
    console.info(`The ${env} server listening on port ${serverConfig.port}`);
  }
});
