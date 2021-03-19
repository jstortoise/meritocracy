import { createReducer } from 'redux-act';
import * as api from '../api/rating';
import * as app from './app';

export const REDUCER = 'rating';

export const searchBy = async (params, callback) => {
	let res = { success: false };
	try {
		const ret = await api.searchBy(params);
		if (ret.data) {
			res = ret.data;
		}
	} catch (e) {}
	callback(res);
};

const initialState = {};

export default createReducer({}, initialState);
