import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {browserHistory} from 'react-router';
import {login} from '../actions/userLoginRegAction';

class Login extends React.Component{
	constructor(props){
		super(props);
		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
		this.state={
			username: "",
			password: ""
		}
	}

	onChange(e){
		this.setState({[e.target.name]: e.target.value});
	}

	onSubmit(e){
		e.preventDefault();
		const {username, password} = this.state;
		this.props.login(username, password);
		console.log(this.state);
		//browserHistory.push('/');
	}

	render(){
		return(
			<div class="container">
				<div class="row">
					<div class="col-md-4 col-md-offset-4">
						<div class="jumbotron">
							<form onSubmit={this.onSubmit}>
								<div class="form-group">
									<label for="username">Username</label>
								    <input type="text" name="username" class="form-control" onChange={this.onChange} required/>
								    <label for="password">Password</label>
								    <input type="password" name="password" class="form-control" onChange={this.onChange} required/><br></br>
								    <input type="submit" class="btn btn-primary" value="Login" />
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

function mapStateToProps(state){
	return{
		logged: state.user.loggedIn
	}
}

function matchDispatchToProps(dispatch){
	return bindActionCreators({login}, dispatch);
}

export default connect(null, matchDispatchToProps)(Login);