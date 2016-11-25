const info ={
	username: "",
	domain: []
}

export default function reducer(state = info, action){

	switch(action.type){
		case "DOMAIN_RETREIVED":
			return {...state, username: action.username, domain: action.payload};
			break;
		case "DOMAIN_FAILED":
			return {...state}
			break;
	}
	return state;
}