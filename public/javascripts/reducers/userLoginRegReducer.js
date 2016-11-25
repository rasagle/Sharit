import {browserHistory} from 'react-router';
const info = {
	loggedIn: false,
	registered: false,
	username: ""
}

export default function reducer(state = info, action){

	switch(action.type){
		case "LOGIN_SUCCESS":
			browserHistory.push('/');
			return {...state, loggedIn: true, username: action.payload};
			break;
		case "LOGIN_FAIL":
			return {...state};
			break;
		case "REGISTER_SUCCESS":
			browserHistory.push('/');
			return {...state, registered: true};
			break;
		case "REGISTER_FAIL":
			return {...state};
			break;
	}
	return state;
}