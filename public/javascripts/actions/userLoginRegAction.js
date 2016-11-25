import axios from "axios";
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

export function login(username, password){
	return dispatch =>{
		axios.post('/login', {
			username,
			password,
		})
		.then(res =>{
			if(res.data != '') dispatch({type: 'LOGIN_SUCCESS', payload: res.data});
			else dispatch({type: 'LOGIN_FAIL'});
		})
		.catch(err =>{
			dispatch({type: 'LOGIN_FAIL'});
		});
	};
}

export function register(data){
	return dispatch =>{
		axios.post('/register', data)
		.then(res =>{
			if(res != '') dispatch({type: 'REGISTER_SUCCESS', payload: res.data});
			else dispatch({type: 'REGISTER_FAIL'});
		})
		.catch(err =>{
			dispatch({type: 'REGISTER_FAIL'});
		});
	};
}