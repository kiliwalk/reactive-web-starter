
import React from 'react';
import { Link } from 'react-router';
const Helmet = require('react-helmet');

// Since this component is simple and static, there's no parent container for it.
const NotFoundPage = () => {
  return (
    <div className='not-found-container'>
      <Helmet title='404'/>
      <h4 className="message">
        404 Not Found
      </h4>
      <Link to="/" className='link'> Back to Home </Link>
    </div>
  );
};

module.exports = NotFoundPage;
