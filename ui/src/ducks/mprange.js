import { createReducer } from 'redux-act';
import { push } from 'react-router-redux';
import { notification } from 'antd';

import * as app from './app';
import * as api from 'api/mprange';

export const REDUCER = 'mprange';

export const addPoints = info => (dispatch: Function, getState: Function) => {
	dispatch(app.addSubmitForm(REDUCER));

	api.addPoints(info)
		.then(result => {
			if (!result.data.success) {
				notification.open({ type: 'error', message: result.data.message });
			} else {
				notification.open({ type: 'success', message: 'Merit Points added successfully!' });
				dispatch(push('/mprange/list'));
			}
		})
		.catch(err => {
			notification.open({ type: 'error', message: err.errorMessage });
		});

	dispatch(app.deleteSubmitForm(REDUCER));
};

export const editPoints = (type, info) => (dispatch: Function, getState: Function) => {
	dispatch(app.addSubmitForm(REDUCER));

	api.editPoints(type, info)
		.then(result => {
			if (!result.data.success) {
				notification.open({ type: 'error', message: result.data.message });
			} else {
				notification.open({
					type: 'success',
					message: 'Merit Points updated successfully!',
				});
				dispatch(push('/mprange/list'));
			}
		})
		.catch(err => {
			notification.open({ type: 'error', message: err.errorMessage });
		});

	dispatch(app.deleteSubmitForm(REDUCER));
};

export const getPointsList = async callback => {
	let data = { success: false };
	try {
		const result = await api.getList();
		if (result.data) {
			data = result.data;
		}
	} catch (e) {}
	callback(data);
};

export const getPointsDetail = async (type, callback) => {
	let data = { success: false };
	try {
		const result = await api.getPointsDetail(type);
		if (result.data) {
			data = result.data;
		}
	} catch (e) {}
	callback(data);
};

const initialState = {};

export default createReducer({}, initialState);
