import { createReducer } from 'redux-act';
import { push } from 'react-router-redux';
import { notification } from 'antd';
import * as app from './app';
import * as api from 'api/client';

export const REDUCER = 'client';

export const addClient = newClient => (dispatch: Function, getState: Function) => {
	dispatch(app.addSubmitForm(REDUCER));
	api.addClient(newClient)
		.then(result => {
			if (!result.data.success) {
				notification.open({ type: 'error', message: result.data.message });
			} else {
				notification.open({
					type: 'success',
					message: 'Organization created successfully!',
				});
				if (newClient.type === 1) {
					dispatch(push('/certorg/list'));
				} else {
					dispatch(push('/client/list'));
				}
			}
		})
		.catch(err => {
			notification.open({ type: 'error', message: err.errorMessage });
		});
	dispatch(app.deleteSubmitForm(REDUCER));
};

export const getClientList = async (type, callback) => {
	let data = { success: false };
	try {
		const result = await api.getClientList(type);
		if (result.data) {
			data = result.data;
		}
	} catch (e) {}
	callback(data);
};

export const getClientDetail = async (clientId, callback) => {
	let data = { success: false };
	try {
		const result = await api.getClientDetail(clientId);
		if (result.data) {
			data = result.data;
		}
	} catch (e) {}
	callback(data);
};

export const deleteClient = async (appkey, callback) => {
	const result = await api.deleteClient(appkey);
	callback(result.data);
};

const initialState = {};

export default createReducer({}, initialState);
