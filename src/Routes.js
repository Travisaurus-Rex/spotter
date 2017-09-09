import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import { App } from './App';
import { Dashboard } from './Dashboard';

export const Routes = (props) => (
	<Router>
		<div>
			<Route exact path='/' component={ App } />
			<Route path='/dashboard' component={ Dashboard } />
		</div>
	</Router>
)

