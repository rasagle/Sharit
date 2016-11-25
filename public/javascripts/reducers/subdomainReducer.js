const info ={
	username: "",
	subdomain: []
}

export default function reducer(state = info, action){

	switch(action.type){
		case "SUBDOMAIN_RETREIVED":
			return {...state, username: action.username, subdomain: action.payload};
			break;
		case "SUBDOMAIN_FAILED":
			return {...state}
			break;
	}
	return state;
}