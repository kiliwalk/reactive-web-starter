
import React from 'react';
import {Link} from 'react-router';
const Helmet = require('react-helmet');

const AboutPage = React.createClass({
  render(){
    return (<div className='about-container'>
      <Helmet title='关于'/>
      <Link to="/" className='link'>返回首页</Link>
    </div>);
  }
})

module.exports = AboutPage;
