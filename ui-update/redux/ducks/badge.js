import { createReducer } from 'redux-act';
import * as api from '../api/badge';
import * as app from './app';

export const REDUCER = 'badge';

export const getBadgeList = async (callback) => {
	let res = { success: false };
	try {
		const ret = await api.getBadgeList();
		if (ret.data) {
			res = ret.data;
		}
	} catch (e) {}
	callback(res);
};

const initialState = {};

export default createReducer({}, initialState);
