import React from 'react';
import Initial from './InitialPage';
import {connect} from 'react-redux';
import {Link} from "react-router";
import {bindActionCreators} from 'redux';

import {login, register} from '../actions/userLoginRegAction';

class Layout extends React.Component{
	render(){
		if(this.props.logged){
			return(
				<div>
					<div class="container"> 
						<div class="row">
							<div class="col-lg-12">
								{this.props.children}
							</div>
						</div>
					</div>
				</div>
			);
		}else{
			return(<Initial/>);
		}
	}
}

function mapStateToProps(state){
	return{
		user: state.user.user,
		logged: state.user.loggedIn
	}
}

function matchDispatchToProps(dispatch){
	return bindActionCreators({login, register}, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(Layout);