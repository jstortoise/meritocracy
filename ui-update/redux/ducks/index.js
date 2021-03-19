import { combineReducers } from 'redux';
import app from './app';
import auth from './auth';
import badge from './badge';
import base from './base';
import client from './client';
import notification from './notification';
import rating from './rating';
import social from './social';
import user from './user';
import transaction from './transaction';
import wallet from './wallet';

export default combineReducers({
	app,
	auth,
	badge,
	base,
	client,
	notification,
	rating,
	social,
	user,
	transaction,
	wallet,
});
