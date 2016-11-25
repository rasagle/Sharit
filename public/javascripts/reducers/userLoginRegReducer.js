const info = {
	user: {
		username: null,
		first_name: null,
		last_name: null,
		email: null,
		phone: null,
		company: null
	},
	loggedIn: false
}

export default function reducer(state = info, action){
	if(action.payload != undefined){
		const {username, first_name, last_name, email, phone, company} = action.payload;
	}
	switch(action.type){
		case "LOGIN_SUCCESS":
			return {...state, user: {...state.user, username, first_name, last_name, email, phone, company,}, loggedIn: true};
			break;
		case "LOGIN_FAIL":
			return {...state};
			break;
		case "REGISTER_SUCCESS":
			return {...state, user: {...state.user, username, first_name, last_name, email, phone, company,}};
			break;
		case "REGISTER_FAIL":
			return {...state};
	}
	return state;
}