import {combineReducers} from 'redux';
import user from './userLoginRegReducer';
import domain from './domainReducer';

export default combineReducers({
	user,
	domain,
});