
import React from 'react';
import { Link, IndexLink } from 'react-router';

const App = React.createClass({
  contextTypes: {
    router: React.PropTypes.object,
    appState: React.PropTypes.object,
  },
  render(){
    return (<div style={{flex: 1}}>
      <div className='nav'>
        <IndexLink to="/" activeClassName='active'>Home</IndexLink>
        <Link to="/about" activeClassName='active'>About</Link>
        <span className='empty'/>
      </div>
      <div className='page-container'>
        {this.props.children}
      </div>
    </div>);
  }
})

module.exports = App;
