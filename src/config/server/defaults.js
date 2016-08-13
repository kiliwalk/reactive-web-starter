//config for the server, DON'T require in client js

module.exports = {
  host: 'localhost',//server listen host, only used in development
  port: 8083,//server listen port
  proxy: 'http://example.com',//the api target, will append /api
}
