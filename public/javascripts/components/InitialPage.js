import React from 'react';
import {Link} from "react-router";

export default class Initial extends React.Component{
	render(){
		return(
			<div class="container">
				<div class="row">
					<div class="col-md-4 col-md-offset-4">
						<div class="jumbotron">
							<Link to="/login"><button class="btn btn-primary init">Login</button></Link>
							<Link to="/register"><button class="btn btn-danger init">Register</button></Link>
						</div>
					</div>
				</div>
			</div>
		);
	}
}