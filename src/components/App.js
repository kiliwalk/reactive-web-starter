
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
        <IndexLink to="/" activeClassName='active'>首页</IndexLink>
        <Link to="/about" activeClassName='active'>关于</Link>
        <span className='empty'/>
      </div>
      <div className='page-container'>
        {this.props.children}
      </div>
    </div>);
  }
})

module.exports = App;
