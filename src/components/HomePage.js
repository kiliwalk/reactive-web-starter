
import React from 'react';
// import {Link} from 'react-router';
const Helmet = require('react-helmet');

const store = require('store');

const HomePage = React.createClass({
  contextTypes: {
    appState: React.PropTypes.object,
  },
  statics: {
    serverLoad(){//to support SSR
      return store.dispatch('/user-agent');
    }
  },
  componentDidMount: function() {
    store.dispatch('/user-agent');
  },
  render(){
    const today = new Date().toString();

    return (<div className='home-container'>
      <Helmet title='首页'/>
      <div className='welcome'>
        <h4>欢迎您</h4><br/>
        <div>今天是{today}</div>
        <div>UserAgent: {store.state.userAgent}</div>
      </div>
      <div />
    </div>);
  }
})

module.exports = HomePage;
