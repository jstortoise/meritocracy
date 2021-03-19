import { createReducer } from 'redux-act';
import * as api from '../api/notification';

export const REDUCER = 'notification';

export const getNotificationList = async (isRead, callback) => {
	let res = { success: false };
	try {
		const ret = await api.getNotificationList(isRead);
		if (ret.data) {
			res = ret.data;
		}
	} catch (e) {}
	callback(res);
};

export const updateNotification = async (id, params, callback) => {
	let res = { success: false };
	try {
		const ret = await api.updateNotification(id, params);
		if (ret.data) {
			res = ret.data;
		}
	} catch (e) {}
	callback(res);
};

export const deleteNotification = async (id, callback) => {
	let res = { success: false };
	try {
		const ret = await api.deleteNotification(id);
		if (ret.data) {
			res = ret.data;
		}
	} catch (e) {}
	callback(res);
};

const initialState = {};

export default createReducer({}, initialState);
