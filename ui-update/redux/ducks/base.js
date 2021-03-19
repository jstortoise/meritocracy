import { createReducer } from 'redux-act';
import * as api from '../api/base';

export const REDUCER = 'base';

export const getBaseDetailList = async (type, callback) => {
	let res = { success: false };
	try {
		const ret = await api.getBaseDetailList(type);
		if (ret.data) {
			res = ret.data;
		}
	} catch (e) {}
	callback(res);
};

const initialState = {};

export default createReducer({}, initialState);
