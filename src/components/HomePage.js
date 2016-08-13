
import React from 'react';
// import {Link} from 'react-router';
const Helmet = require('react-helmet');

const fetch = require('lib/fetch');

const HomePage = React.createClass({
  contextTypes: {
    appState: React.PropTypes.object,
  },
  getInitialState: function() {
    return {
      userAgent: null
    };
  },
  componentDidMount: function() {
    fetch('http://httpbin.org/user-agent').then(resp=>resp.json()).then(result=>{
      this.setState({userAgent: result["user-agent"]});
    })
  },
  render(){
    const today = new Date().toString();

    return (<div className='home-container'>
      <Helmet title='首页'/>
      <div className='welcome'>
        <h4>欢迎您</h4><br/>
        <div>今天是{today}</div>
        <div>UserAgent: {this.state.userAgent}</div>
      </div>
      <div />
    </div>);
  }
})

module.exports = HomePage;
