import axios from "axios";
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

export function login(username, password){
	return dispatch =>{
		axios.post('/login', {
			username,
			password,
		})
		.then(res =>{
			if(res.data != ''){
				 dispatch({type: 'LOGIN_SUCCESS', payload: res.data.username});
				 
				 axios.post('/getDomain', {username})
					.then(res =>{
						dispatch({type: "DOMAIN_RETREIVED", username, payload: res.data});
					})
					.catch(err =>{
						dispatch({type: "DOMAIN_FAILED"});
					});

				axios.post('/getsubDomain', {username})
					.then(res =>{
						dispatch({type: "SUBDOMAIN_RETREIVED", username, payload: res.data});
					})
					.catch(err =>{
						dispatch({type: "SUBDOMAIN_FAILED"});
					});
			}
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
			if(res.data != '') dispatch({type: 'REGISTER_SUCCESS', payload: res.data});
			else dispatch({type: 'REGISTER_FAIL'});
		})
		.catch(err =>{
			dispatch({type: 'REGISTER_FAIL'});
		});
	};
}
