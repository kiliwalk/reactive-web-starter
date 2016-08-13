
import React from 'react';
import {Link} from 'react-router';
const Helmet = require('react-helmet');

const AboutPage = React.createClass({
  render(){
    return (<div className='about-container'>
      <Helmet title='About'/>
      <Link to="/" className='link'>Back to Home</Link>
    </div>);
  }
})

module.exports = AboutPage;
