import React from 'react';
import Initial from './InitialPage';
import {connect} from 'react-redux';
import {Link} from "react-router";
import {bindActionCreators} from 'redux';

import {login, register} from '../actions/userLoginRegAction';
import getDomain from '../actions/domainAction';
import Login from './Login';
import Register from './Register';
import Nav from './Nav';
import SubNav from './SubdomainDefault';

class Layout extends React.Component{
	constructor(props){
		super(props);
		
	}

	render(){

		if(this.props.logged){
			
			return(
				<div>
					<div class="container"> 
						<div class="row">
							<div class="col-lg-12">
								<Nav user={this.props.user} domain={this.props.domain}/><br></br><br></br>
								<h1>Welcome to Sharit, {this.props.user} </h1>
								<SubNav/>
							</div>
						</div>
					</div>
				</div>
			);
		}else{
			return(
				<div>
					<Initial/>
				</div>
			);
		}
	}
}

function mapStateToProps(state){
	return{
		user: state.user.username,
		logged: state.user.loggedIn,
		domain : state.domain.domain,
	}
}

function matchDispatchToProps(dispatch){
	return bindActionCreators({login, register, getDomain}, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(Layout);