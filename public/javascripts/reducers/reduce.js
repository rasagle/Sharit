import {combineReducers} from 'redux';
import user from './userLoginRegReducer';
import domain from './domainReducer';
import subdomain from './subdomainReducer';

export default combineReducers({
	user,
	domain,
	subdomain,
});