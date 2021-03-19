import { createReducer } from 'redux-act';
import { push } from 'react-router-redux';
import { notification } from 'antd';
import * as app from './app';
import * as api from 'api/auth';

export const REDUCER = 'user';

export const addUser = userInfo => (dispatch: Function, getState: Function) => {
	dispatch(app.addSubmitForm(REDUCER));

	api.addUser(userInfo)
		.then(result => {
			if (!result.data.success) {
				notification.open({
					type: 'error',
					message: result.data.message,
				});
			} else {
				dispatch(push('/user/list'));
				notification.open({ type: 'success', message: 'User added successfully' });
			}
		})
		.catch(err => {
			notification.open({
				type: 'error',
				message: err.errorMessage,
			});
		});

	dispatch(app.deleteSubmitForm(REDUCER));
};

export const editUser = (_id, userInfo) => (dispatch: Function, getState: Function) => {
	dispatch(app.addSubmitForm(REDUCER));

	api.editUser(_id, userInfo)
		.then(result => {
			if (!result.data.success) {
				notification.open({
					type: 'error',
					message: result.data.message,
				});
			} else {
				if (userInfo.username) {
					window.localStorage.setItem('app.username', userInfo.username);
				}
				if (userInfo.mid) {
					window.localStorage.setItem('app.mid', userInfo.mid);
				}

				if (window.localStorage.getItem('app.role') <= 1) {
					dispatch(push('/user/list'));
				} else {
					dispatch(push('/client/list'));
				}
				notification.open({ type: 'success', message: 'User updated successfully' });
			}
		})
		.catch(err => {
			notification.open({
				type: 'error',
				message: err.errorMessage,
			});
		});

	dispatch(app.deleteSubmitForm(REDUCER));
};

export const getUserDetail = async (_id, callback) => {
	let data = { success: false };
	try {
		const result = await api.getUserDetail(_id);
		if (result.data) {
			data = result.data;
		}
	} catch (e) {}
	callback(data);
};

export const deleteUser = async (_id, callback) => {
	let data = { success: false };
	try {
		const result = await api.deleteUser(_id);
		if (result.data) {
			data = result.data;
		}
	} catch (e) {}
	callback(data);
};

export const getUserList = async callback => {
	let data = { success: false };
	try {
		const result = await api.getUserList();
		if (result.data) {
			data = result.data;
		}
	} catch (e) {}
	callback(data);
};

export const getRates = async (username, callback) => {
	let data = { success: false };
	try {
		const result = await api.getRates(username);
		if (result.data) {
			data = result.data;
		}
	} catch (e) {}
	callback(data);
};

export const getScores = async (username, clientId, callback) => {
	let data = { success: false };
	try {
		const result = await api.getScores(username, clientId);
		if (result.data) {
			data = result.data;
		}
	} catch (e) {}
	callback(data);
};

export const getMyClientList = async callback => {
	let data = { success: false };
	try {
		const result = await api.getMyClientList();
		if (result.data) {
			data = result.data;
		}
	} catch (e) {}
	callback(data);
};

export const orgLogin = async (appkey, callback) => {
	let data = { success: false };
	try {
		const result = await api.orgLogin(appkey);
		if (result.data) {
			data = result.data;
		}
	} catch (e) {}
	callback(data);
};

const initialState = {};

export default createReducer({}, initialState);
