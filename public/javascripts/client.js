import React from "react";
import ReactDOM from "react-dom";
import {Provider} from 'react-redux';
import {Router, Route, IndexRoute, browserHistory} from "react-router";
import Layout from './components/Layout';
import store from './store';

import Login from './components/Login';
//import Register from './components/Register';

const app = document.getElementById('app');

ReactDOM.render(
<Provider store={store}>
	<Router history={browserHistory}>
		<Route path='/' component={Layout}>
			<Route path="/login" component={Login}></Route>
			
		</Route>
	</Router>
</Provider>, app);
