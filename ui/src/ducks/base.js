import { createReducer } from 'redux-act';

import * as api from 'api/base';

export const REDUCER = 'base';

export const setValue = async (type, info, callback) => {
	let data = { success: false };
	try {
		const result = await api.setValue(type, info);
		if (result.data) {
			data = result.data;
		}
	} catch (e) {}
	callback(data);
};

export const getValue = async (type, callback) => {
	let data = { success: false };
	try {
		const result = await api.getValue(type);
		if (result.data) {
			data = result.data;
		}
	} catch (e) {}
	callback(data);
};

export const getValueList = async callback => {
	let data = { success: false };
	try {
		const result = await api.getList();
		if (result.data) {
			data = result.data;
		}
	} catch (e) {}
	callback(data);
};

const initialState = {};

export default createReducer({}, initialState);
