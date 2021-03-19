import { createReducer } from 'redux-act';
import { push } from 'react-router-redux';
import { notification } from 'antd';

import * as app from './app';
import * as api from 'api/range';

export const REDUCER = 'range';

export const addRange = info => (dispatch: Function, getState: Function) => {
	dispatch(app.addSubmitForm(REDUCER));

	api.addRange(info)
		.then(result => {
			if (!result.data.success) {
				notification.open({ type: 'error', message: result.data.message });
			} else {
				notification.open({ type: 'success', message: 'Added successfully!' });
				dispatch(push('/range/list'));
			}
		})
		.catch(err => {
			notification.open({ type: 'error', message: err.errorMessage });
		});

	dispatch(app.deleteSubmitForm(REDUCER));
};

export const editRange = (type, info) => (dispatch: Function, getState: Function) => {
	dispatch(app.addSubmitForm(REDUCER));

	api.editRange(type, info)
		.then(result => {
			if (!result.data.success) {
				notification.open({ type: 'error', message: result.data.message });
			} else {
				notification.open({
					type: 'success',
					message: 'Updated successfully!',
				});
				dispatch(push('/range/list'));
			}
		})
		.catch(err => {
			notification.open({ type: 'error', message: err.errorMessage });
		});

	dispatch(app.deleteSubmitForm(REDUCER));
};

export const getRangeList = async callback => {
	let data = { success: false };
	try {
		const result = await api.getList();
		if (result.data) {
			data = result.data;
		}
	} catch (e) {}
	callback(data);
};

export const deleteRange = async (type, callback) => {
	let data = { success: false };
	try {
		const result = await api.deleteRange(type);
		if (result.data) {
			data = result.data;
		}
	} catch (e) {}
	callback(data);
};

export const getRangeDetail = async (type, callback) => {
	let data = { success: false };
	try {
		const result = await api.getDetail(type);
		if (result.data) {
			data = result.data;
		}
	} catch (e) {}
	callback(data);
};

const initialState = {};

export default createReducer({}, initialState);
