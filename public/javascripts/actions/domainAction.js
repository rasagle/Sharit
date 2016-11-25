import axios from "axios";
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

export function getDomain(username){
	return dispatch =>{
		axios.post('/getDomain', username)
		.then(res =>{
			dispatch({type: "DOMAIN_RETREIVED", username, payload: res.data});
		})
		.catch(err =>{
			dispatch({type: "DOMAIN_FAILED"});
		});
	}
}