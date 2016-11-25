import React from 'react';
import {Link} from "react-router";

export default class Initial extends React.Component{
	render(){
		return(
			<div class="container">
				<div class="jumbotron">
					<button class="btn btn-primary init">
						<Link to="/login">Login</Link>
					</button>
					<button class="btn btn-danger init">
						<Link to="/register">Register</Link>
					</button>
				</div>
			</div>
		);
	}
}