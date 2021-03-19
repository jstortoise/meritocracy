import { createReducer } from 'redux-act';
import * as api from '../api/social';

export const REDUCER = 'social';

export const getFacebookInfo = async (fbToken, callback) => {
	let res = { success: false };
	try {
		const ret = await api.getFacebookInfo(fbToken);
		if (ret.data) {
			res = ret.data;
		}
	} catch (e) {}
	callback(res);
};

const initialState = {};

export default createReducer({}, initialState);
