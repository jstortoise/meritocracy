import Router from 'next/router';
import { createReducer } from 'redux-act';
import { notification } from 'antd';
import * as api from '../api/client';
import * as app from './app';

export const REDUCER = 'client';

export const getClientList = async (params, callback) => {
	let res = { success: false };
	try {
		const ret = await api.getClientList(params);
		if (ret.data) {
			res = ret.data;
		}
	} catch (e) {}
	callback(res);
};

export const getMyClientList = async (params, callback) => {
	let res = { success: false };
	try {
		const ret = await api.getMyClientList(params);
		if (ret.data) {
			res = ret.data;
		}
	} catch (e) {}
	callback(res);
};

export const getClientListByUserId = async (userId, callback) => {
	let res = { success: false };
	try {
		const ret = await api.getClientListByUserId(userId);
		if (ret.data) {
			res = ret.data;
		}
	} catch (e) {}
	callback(res);
};

export const getClientDetail = async (id, callback) => {
	let res = { success: false };
	try {
		const ret = await api.getClientDetail(id);
		if (ret.data) {
			res = ret.data;
		}
	} catch (e) {}
	callback(res);
};

export const createClient = params => (dispatch, getState) => {
	dispatch(app.addSubmitForm(REDUCER));

	api.createClient(params).then(res => {
		const { success, message, data } = res.data;
		if (success) {
			const { secret } = data;
			notification.open({ type: 'success', duration: 0, message: `Organisation created successfully. APP_SECRET: ${secret}` });
			// if (user.role > 1) {
			// 	Router.push('/organisations/me');
			// } else {
				Router.push('/organisations/me');
			// }
		} else {
			notification.open({ type: 'error', message });
		}
	}).catch(err => {
		notification.open({ type: 'error', message: 'Failed to create organisation' });
	}).finally(() => {
		dispatch(app.deleteSubmitForm(REDUCER));
	});
};

export const updateClient = (id, params) => (dispatch, getState) => {
	dispatch(app.addSubmitForm(REDUCER));

	api.updateClient(id, params).then(res => {
		if (res.data.success) {
			notification.open({ type: 'success', message: 'Organisation updated successfully' });
			// if (user.role > 1) {
			// 	Router.push('/organisations/me');
			// } else {
				Router.push('/organisations/me');
			// }
		} else {
			notification.open({ type: 'error', message: res.data.message });
		}
	}).catch(err => {
		notification.open({ type: 'error', message: 'Failed to create organisation' });
	}).finally(() => {
		dispatch(app.deleteSubmitForm(REDUCER));
	});
};

export const deleteClient = async (id, callback) => {
	let res = { success: false };
	try {
		const ret = await api.deleteClient(id);
		if (ret.data) {
			res = ret.data;
		}
	} catch (e) {}
	callback(res);
};

const initialState = {};

export default createReducer({}, initialState);
