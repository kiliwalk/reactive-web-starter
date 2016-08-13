
const env = process.env.NODE_ENV!=='production'?'development':'production';
const isDev = env==='development';

const webpack = require('webpack')
const path = require('path')
const serverConfig = require('./server');

const projectRootPath = path.resolve(__dirname, '../..');
const srcRootPath = path.resolve(projectRootPath, 'src');
const clientDistRootPath = path.resolve(projectRootPath, 'dist/client');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const WebpackMd5Hash = require('webpack-md5-hash');

const GLOBALS = {
  'process.env.NODE_ENV': JSON.stringify(env),
  __DEV__: isDev
};

let appEntry;
if(isDev) appEntry = ['webpack-hot-middleware/client?reload=true', './src/index'];
else appEntry = ['./src/index'];

let output;
if(isDev){
  output = {
    path: clientDistRootPath,
    // Use absolute paths to avoid the way that URLs are resolved by Chrome when they're parsed from a dynamically loaded CSS blob. Note: Only necessary in Dev.
    publicPath: `http://${serverConfig.host}:${serverConfig.port}/`, 
    filename: 'app.js'
  }
}else{
  output = {
    path: path.resolve(clientDistRootPath, 'static'),
    publicPath: '/static/', 
    filename: 'app-[chunkhash:8].js'
  }
}

let plugins;
if(isDev){
  plugins = [
    new webpack.DefinePlugin(GLOBALS), 
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'vendor.js'
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(srcRootPath, 'index.html'),
      favicon: path.resolve(srcRootPath, 'favicon.ico'),
    }),
    new webpack.NoErrorsPlugin(),
  ]
}else{
  plugins = [
    new WebpackMd5Hash(),
    new webpack.DefinePlugin(GLOBALS), 
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'vendor-[chunkhash:8].js',
      // minChunks: module => /node_modules/.test(module.resource), //所有node_modules下的js/css都提取出来
    }),
    new ExtractTextPlugin('[name]-[contenthash:8].css', {
      allChunks: true
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(srcRootPath, 'index.html'),
      favicon: path.resolve(srcRootPath, 'favicon.ico'),
    }),
  ]
}

module.exports = {
  debug: true,
  bail: true,//!isDev,//report error
  stats: {
    children: isDev 
  },
  devtool: isDev?'cheap-module-eval-source-map':'source-map',
  context: projectRootPath,
  entry: {
    app: appEntry,
    vendor: [
      'react', 'react-dom', 'react-router', //react basic
      'es6-promise', 'isomorphic-fetch', //fetch
      'umc', //store
      'debug', //other package
      'react-helmet', //other react component
    ],
  },
  target: 'web', // necessary per https://webpack.github.io/docs/testing.html#compile-and-test
  output,
  resolve: {
    modulesDirectories: [
      'src',//with this we can use require('lib') directly
      'node_modules'
    ],
    extensions: ['', '.json', '.js', '.jsx'],
  },
  plugins,
  module: {
    loaders: [
      {test: /\.jsx?$/, include: srcRootPath, loaders: ['babel']},
      {test: /\.json$/, loader: 'json' },
      {test: /\.woff2?(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/font-woff" },
      {test: /\.ttf(\?v=\d+.\d+.\d+)?$/, loader: 'url?limit=10000&mimetype=application/octet-stream'},
      {test: /\.svg(\?v=\d+.\d+.\d+)?$/, loader: 'url?limit=10000&mimetype=image/svg+xml'},
      {test: /\.eot(\?v=\d+.\d+.\d+)?$/, loader: 'file'},
      {test: /\.(jpe?g|png|gif)$/i, loaders: ['file']},
      {test: /\.ico$/, loader: 'file?name=[name].[ext]'},
      // {test: /\.html$/, loader: 'file?name=[name].[ext]'},
      {test: /(\.css|\.styl)$/, 
        loader: isDev
          ? 'style!css?sourceMap!stylus?sourceMap'
          : ExtractTextPlugin.extract('style', 'css?sourceMap!stylus?sourceMap')},
    ]
  }
};
