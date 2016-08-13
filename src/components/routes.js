
const React = require('react');
const ReactRouter = require('react-router');
const {Route, IndexRoute} = ReactRouter;

const App = require('./App')
const HomePage = require('./HomePage')
const AboutPage = require('./AboutPage')
const NotFoundPage = require('./NotFoundPage')

module.exports = (
  <Route path="/" component={App}>
    <IndexRoute component={HomePage}/>
    <Route path="about" component={AboutPage}/>
    <Route path="*" component={NotFoundPage}/>
  </Route>
);
