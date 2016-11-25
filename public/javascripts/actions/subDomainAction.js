import axios from "axios";
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

export function getsubDomain(username){
	return dispatch =>{
		axios.post('/getsubDomain', {username})
		.then(res =>{
			dispatch({type: "SUBDOMAIN_RETREIVED", username, payload: res.data});
		})
		.catch(err =>{
			dispatch({type: "SUBDOMAIN_FAILED"});
		});
	}
}