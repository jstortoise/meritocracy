import { createAction, createReducer } from 'redux-act';
import * as api from '../api/user';

export const REDUCER = 'user';
const NS = `@@${REDUCER}/`;
export const setDataState = createAction(`${NS}SET_DATA_STATE`);

/**
 * Get current user info
 * @param {Function} callback Callback function
 */
export const getMe = async () => {
	let res = { success: false };
	try {
		const ret = await api.getMe();
		if (ret.data) {
			res = ret.data;
		}
	} catch (e) {}
	return res;
};

export const getUserList = async (params, callback) => {
	let res = { success: false };
	try {
		const ret = await api.getUserList(params);
		if (ret.data) {
			res = ret.data;
		}
	} catch (e) {}
	callback(res);
};

export const getUserDetailById = async (id, callback) => {
	let res = { success: false };
	try {
		const ret = await api.getUserDetailById(id);
		if (ret.data) {
			res = ret.data;
		}
	} catch (e) {}
	callback(res);
};

export const searchUsers = async (params, callback) => {//(dispatch, getState) => {
	let res = { success: false };
	try {
		const ret = await api.searchUsers(params);
		if (ret.data) {
			res = ret.data;
		}
	} catch (e) {}
	callback(res);
};

const initialState = {
	// result
    data: {},
};

export default createReducer({
    [setDataState]: (state, { data }) => ({ ...state, data }),
}, initialState);
