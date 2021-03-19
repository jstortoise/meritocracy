import { createReducer } from 'redux-act';
import { push } from 'react-router-redux';
import { notification } from 'antd';

import * as app from './app';
import * as api from 'api/evaluation';

export const REDUCER = 'evaluation';

export const addEval = info => (dispatch: Function, getState: Function) => {
	dispatch(app.addSubmitForm(REDUCER));

	api.addEval(info)
		.then(result => {
			if (!result.data.success) {
				notification.open({ type: 'error', message: result.data.message });
			} else {
				notification.open({ type: 'success', message: 'Successfully added!' });
				dispatch(push('/eval/list'));
			}
		})
		.catch(err => {
			notification.open({ type: 'error', message: err.errorMessage });
		});

	dispatch(app.deleteSubmitForm(REDUCER));
};

export const editEval = (type, info) => (dispatch: Function, getState: Function) => {
	dispatch(app.addSubmitForm(REDUCER));

	api.editEval(type, info)
		.then(result => {
			if (!result.data.success) {
				notification.open({ type: 'error', message: result.data.message });
			} else {
				notification.open({
					type: 'success',
					message: 'Updated successfully!',
				});
				dispatch(push('/eval/list'));
			}
		})
		.catch(err => {
			notification.open({ type: 'error', message: err.errorMessage });
		});

	dispatch(app.deleteSubmitForm(REDUCER));
};

export const getEvalList = async callback => {
	let data = { success: false };
	try {
		const result = await api.getList();
		if (result.data) {
			data = result.data;
		}
	} catch (e) {}
	callback(data);
};

export const getEvalDetail = async (type, callback) => {
	let data = { success: false };
	try {
		const result = await api.getEvalDetail(type);
		if (result.data) {
			data = result.data;
		}
	} catch (e) {}
	callback(data);
};

const initialState = {};

export default createReducer({}, initialState);
