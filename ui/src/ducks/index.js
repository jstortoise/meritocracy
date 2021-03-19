import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { pendingTasksReducer } from 'react-redux-spinner';

import app from './app';
import base from './base';
import client from './client';
import comment from './comment';
import evaluation from './evaluation';
import auth from './auth';
import mprange from './mprange';
import range from './range';
import user from './user';

export default combineReducers({
	routing: routerReducer,
	pendingTasks: pendingTasksReducer,
	app,
	base,
	client,
	comment,
	evaluation,
	auth,
	mprange,
	range,
	user,
});
