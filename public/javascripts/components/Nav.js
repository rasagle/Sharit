import React from "react";
import { IndexLink, Link } from "react-router";

import {getDomain} from '../actions/domainAction';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

class Nav extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      collapsed: true,
    };
    //this.props.domain(this.props.user);
  }

  componentDidUpdate(){
    console.log(this.props.domain);
  }

  toggleCollapse() {
    const collapsed = !this.state.collapsed;
    this.setState({collapsed});
  }

  getNavLinks(){
    
    return domName;
  }

  render() {
    const { location } = this.props;
    const { collapsed } = this.state;
    const navClass = collapsed ? "collapse" : "";

    const domName = this.props.domain.map((dom)=>{
      return <li key={dom.name}><Link to="/" onClick={this.toggleCollapse.bind(this)} activeClassName="active" >{dom.name}</Link> </li>
    });

    return (
      <nav class="navbar navbar-inverse navbar-fixed-top" role="navigation">
        <div class="container">
          <div class="navbar-header">
            <button type="button" class="navbar-toggle" onClick={this.toggleCollapse.bind(this)} >
              <span class="sr-only">Toggle navigation</span>
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
            </button>
          </div>
          <div class={"navbar-collapse " + navClass} id="bs-example-navbar-collapse-1">
            <ul class="nav navbar-nav">
              {domName}
              
            </ul>
              }
          </div>
        </div>
      </nav>
    );
  }
}

function mapStateToProps(state){
  return{
    user: state.user.username,
    domain : state.domain.domain,
  }
}

function matchDispatchToProps(dispatch){
  return bindActionCreators({getDomain}, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(Nav);