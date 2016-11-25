import React from 'react';
import {connect} from 'react-redux';
import {Link} from "react-router";
import {bindActionCreators} from 'redux';
import getsubDomain from '../actions/subDomainAction';

class SubdomainDefault extends React.Component{
	constructor(props){
		super(props);

	}

	render(){
		const sub = this.props.subdomain.map((item)=>{
			var toStr = '/s/' + item.name;
			return (<Link to={toStr} key={item.id}>
						<div className="jumbotron">
							{item.name}
						</div>
					</Link>
			);
		})
		return(
			<div>
				{sub}
			</div>
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

export default connect(mapStateToProps, matchDispatchToProps)(SubdomainDefault);