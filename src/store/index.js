
const umc = require('umc');
// const debug = require('debug');

let initialState = {};

//custom initial state set
//initialState = {...initialState, some: xxxx}

const store = umc(initialState);

store.use(require('./routers'));

store.use(function(req, resp, next){
  console.warn('unhandled store request: '+req.url);
})

module.exports = store;

