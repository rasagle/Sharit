import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {browserHistory} from 'react-router';
import {login} from '../actions/userLoginRegAction';

class Login extends React.Component{
	constructor(props){
		super(props);
		this.onSubmit.bind(this);
		this.onChange.bind(this);
		this.state={
			username: "",
			password: ""
		}
	}

	onChange(e){
		this.setState({[e.target.name]: e.target.value});
	}

	onSubmit(e){
		const {username, password} = this.state;
		this.props.login(username, password);
		browserHistory.push('/');
	}

	render(){
		return(
			<div class="container">
				<div class="jumbotron">
					<form onChange={this.onChange} onSubmit={this.onSubmit}>
						<div class="form-group">
							<label for="username">Username</label>
						    <input type="text" name="username" class="form-control"/>
						    <label for="password">Password</label>
						    <input type="text" name="password" class="form-control"/>
						    <input type="submit" class="btn btn-primary" value="Login"/>
						</div>
					</form>
				</div>
			</div>
		);
	}
}

function mapStateToProps(state){
	return{
		user: state.user.user,
		logged: state.user.loggedIn
	}
}

function matchDispatchToProps(dispatch){
	return bindActionCreators(login, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(Login);