
//the client entry js file

const store = require('store');

if(process.env.NODE_ENV==='development'){
  window.localStorage.debug = '*';
  window.store = store;
}

const React = require('react');//eslint-disable-line
const ReactDom = require('react-dom');

// Yep, that's right. You can import SASS/CSS files too! Webpack will run the associated loader and plug this into the page.
require('index.styl'); 

const ReactRouter = require('react-router');
const {Router, browserHistory} = ReactRouter;

const routes = require('components/routes');

const Container = store.createContainer();
ReactDom.render(
  <Container><Router history={browserHistory} routes={routes}/></Container>,
  document.getElementById('app'),
  ()=>{
    //executed after the component is rendered or updated.
    //remove the preload state from server(SSR)
    window.__INITIAL_STATE__ = null;
  }
);
