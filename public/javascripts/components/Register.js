import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {browserHistory} from 'react-router';
import {register} from '../actions/userLoginRegAction';

class Register extends React.Component{
	constructor(props){
		super(props);
		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
		this.state={
			username: "",
			password: "",
			first_name: "",
			last_name: "",
			email: "",
			phone: "",
			company: ""
		}
	}

	onChange(e){
		this.setState({[e.target.name]: e.target.value});
	}

	onSubmit(e){
		e.preventDefault();
		const {username, password, first_name, last_name, email, phone, company} = this.state;
		//this.props.register(username, password, first_name, last_name, email, phone, company);
		this.props.register(this.state);
		console.log(this.state);
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
								    <input type="password" name="password" class="form-control" onChange={this.onChange} required/>
								    <label for="first_name">First Name</label>
								    <input type="text" name="first_name" class="form-control" onChange={this.onChange} required/>
								    <label for="last_name">Last Name</label>
								    <input type="text" name="last_name" class="form-control" onChange={this.onChange} required/>
								    <label for="email">Email</label>
								    <input type="email" name="email" class="form-control" onChange={this.onChange} required/>
								    <label for="phone">Phone</label>
								    <input type="text" name="phone" class="form-control" onChange={this.onChange} required/>
								    <label for="company">Company</label>
								    <input type="text" name="company" class="form-control" onChange={this.onChange} required/><br></br>
								    <input type="submit" class="btn btn-primary" value="Register" />
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
		registered: state.user.registered
	}
}

function matchDispatchToProps(dispatch){
	return bindActionCreators({register}, dispatch);
}

export default connect(null, matchDispatchToProps)(Register);