
const path = require('path');
const fs = require('fs');
const React = require('react');
const {renderToString} = require('react-dom/server');

const ReactRouter = require('react-router');
const {match, RouterContext} = ReactRouter;

const store = require('store');
const Container = store.createContainer();

const routes = require('components/routes');

const distRootPath = path.resolve(__dirname, '../../dist');
const staticRootPath = path.join(distRootPath, 'client/static');

module.exports = function(params={}){
  const {url, next, resp} = params;

  // Note that req.url here should be the full URL path from
  // the original request, including the query string.
  return new Promise((resolve, reject)=>{
    match({ routes, location: url }, (error, redirectLocation, renderProps) => {
      if (error) {
        error.statusCode = 500;
        return reject(error);
      } else if (redirectLocation) {
        resp.redirect(redirectLocation.pathname + redirectLocation.search)
        return resolve();
      } else if (renderProps) {
        // You can also check renderProps.components or renderProps.routes for
        // your "not found" component or route respectively, and send a 404 as
        // below, if you're using a catch-all route.
        return resolve(renderProps);
      } else {
        let err = new Error('Not Found');
        err.statusCode = 404;
        return reject(err);
      }
    })
  }).then((renderProps)=>{
    if(!renderProps) return;

    const {components} = renderProps;
    return Promise.all(components.map(component=>{//load server data to store first
      if(component.serverLoad) return component.serverLoad();
    })).then(()=>{
      // console.log('initialState', store.state);

      const appHtml = renderToString(<Container><RouterContext {...renderProps} /></Container>)
    
      return new Promise((resolve, reject)=>{
        fs.readFile(path.join(staticRootPath, 'index.html'), {encoding: 'utf8'}, (err, html)=>{
          if(err) return reject(err);
          else return resolve(html);
        })
      }).then(html=>{
        const open = '<div id="app">', close = '</div>';
        let index = html.indexOf(open + close);
        if(index<0) return next();
        const endIndex = index + open.length + close.length;

        const initStateHtml = `<script>
          window.__INITIAL_STATE__ = ${JSON.stringify(store.state)};
        </script>`;

        html = [html.slice(0, index), initStateHtml, open, appHtml, close, html.slice(endIndex)].join('')

        resp.send(html);
        return;
      })
    })
  })
}

