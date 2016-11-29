import React from "react";
import { IndexLink, Link } from "react-router";

import getsubDomain from '../actions/subDomainAction';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

class SubNav extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      collapsed: true,
    };
  }

  toggleCollapse() {
    const collapsed = !this.state.collapsed;
    this.setState({collapsed});
  }

  render() {
    const { location } = this.props;
    const { collapsed } = this.state;
    const navClass = collapsed ? "collapse" : "";

    const domName = this.props.subdomain.map((dom)=>{
      const toStr = '/NYU/' + dom.name;
      return <li key={dom.id}><Link to={toStr} onClick={this.toggleCollapse.bind(this)} activeClassName="active" >{dom.name}</Link> </li>
    });

	console.log(domName);

    return (
      <nav class="navbar navbar-inverse" role="navigation">
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
          </div>
        </div>
      </nav>
    );
  }
}

function mapStateToProps(state){
  return{
    user: state.user.user,
    subdomain: state.subdomain.subdomain
  }
}

function matchDispatchToProps(dispatch){
  return bindActionCreators({getsubDomain}, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(SubNav);