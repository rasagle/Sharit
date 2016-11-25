import React from 'react';

export default class Initial extends React.Component{
	render(){
		return(
			<div class="container">
				<div class="jumbotron">
					<button class="btn btn-primary init">Login</button>
					<button class="btn btn-danger init">Register</button>
				</div>
			</div>
		);
	}
}