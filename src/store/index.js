
const umc = require('umc');
// const debug = require('debug');

let initialState = {};

//get server preload state(the state from SSR)
if(typeof window !== 'undefined' && window && window.__INITIAL_STATE__){
  initialState = window.__INITIAL_STATE__;
}

//custom initial state set
//initialState = {...initialState, some: xxxx}

const store = umc(initialState);

store.use(require('./routers'));

store.use(function(req, resp, next){
  console.warn('unhandled store request: '+req.url);
})

module.exports = store;

