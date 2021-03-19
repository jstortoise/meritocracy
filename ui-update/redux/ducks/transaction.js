import { createReducer } from 'redux-act';
import * as api from '../api/transaction';

export const REDUCER = 'transaction';

export const getAllTransactions = async (params, callback) => {
	let res = { success: false };
	try {
		const ret = await api.getAllTransactions(params);
		if (ret.data) {
			res = ret.data;
		}
	} catch (e) {}
	callback(res);
};

export const getMyTransactions = async (params, callback) => {
	let res = { success: false };
	try {
		const ret = await api.getMyTransactions(params);
		if (ret.data) {
			res = ret.data;
		}
	} catch (e) {}
	callback(res);
};

const initialState = {};

export default createReducer({}, initialState);
