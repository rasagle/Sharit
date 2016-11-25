import axios from "axios";

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

export function register(username, hash, first_name, last_name, email, phone, company){
	return dispatch =>{
		axios.post('/register', {
			username,
			hash,
			first_name,
			last_name,
			email,
			phone,
			company,
		})
		.then(res =>{
			if(res != '') dispatch({type: 'REGISTER_SUCCESS', payload: res.data});
			else dispatch({type: 'REGISTER_FAIL'});
		})
		.catch(err =>{
			dispatch({type: 'REGISTER_FAIL'});
		});
	};
}