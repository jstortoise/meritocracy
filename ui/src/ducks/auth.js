import { createReducer } from 'redux-act';
import { push } from 'react-router-redux';
import { notification } from 'antd';
import * as app from './app';
import * as api from 'api/auth';
import config from 'config/config';

export const REDUCER = 'login';

export const login = loginInfo => async (dispatch: Function, getState: Function) => {
	dispatch(app.addSubmitForm(REDUCER));
	try {
		let params = app.getParamsFromQuery();
		let isLegacy = false;
		if (params.redirect_uri) {
			loginInfo['rootUrl'] = params.redirect_uri;
			if (params.appkey) {
				loginInfo['appkey'] = params.appkey;
				isLegacy = true;
			}
		}

		let result = {};
		if (isLegacy) {
			result = await api.legacyLogin(loginInfo);
		} else {
			result = await api.login(loginInfo);
		}

		if (result.data.success) {
			let data = result.data.data;
			window.localStorage.setItem('app.token', data.token);

			if (isLegacy) {
				// window.location.href = params.redirect_uri + '?token=' + data.token;
				window.opener.postMessage(data.token, '*');
				window.close();
			} else {
				notification.open({
					type: 'success',
					message: 'You have successfully logged in!',
				});
				dispatch(push('/client/list'));
			}
		} else {
			notification.open({
				type: 'error',
				message: result.data.message,
			});
		}
	} catch (err) {
		notification.open({
			type: 'error',
			message: 'Error occurred',
		});
	}
	dispatch(app.deleteSubmitForm(REDUCER));
};

export const signup = newUser => async (dispatch: Function, getState: Function) => {
	dispatch(app.addSubmitForm(REDUCER));
	try {
		let params = app.getParamsFromQuery();
		let isLegacy = false;
		if (params.redirect_uri) {
			newUser['rootUrl'] = params.redirect_uri;
			if (params.appkey) {
				newUser['appkey'] = params.appkey;
				isLegacy = true;
			}
		}

		let result = {};
		if (isLegacy) {
			result = await api.legacySignup(newUser);
		} else {
			result = await api.signup(newUser);
		}

		if (result.data.success) {
			notification.open({ type: 'success', message: 'You are successfully registered' });
			if (isLegacy) {
				window.location.href = params.redirect_uri;
			} else {
				dispatch(push('/login'));
			}
		} else {
			notification.open({
				type: 'error',
				message: result.data.message,
			});
		}
	} catch (err) {
		notification.open({
			type: 'error',
			message: 'Error occured',
		});
	}
	dispatch(app.deleteSubmitForm(REDUCER));
};

export const showFbLogin = callback => {
	var win = window.open(config.API_URL + '/social/facebook/login/null');
	// Create IE + others compatible event handler
	var eventMethod = window.addEventListener ? 'addEventListener' : 'attachEvent';
	var eventer = window[eventMethod];
	var messageEvent = eventMethod === 'attachEvent' ? 'onmessage' : 'message';
	// Listen to message from child window

	var fb_token = null;
	eventer(
		messageEvent,
		e => {
			fb_token = e.data;
		},
		false,
	);

	// check if child window is closed
	var timer = setInterval(() => {
		if (win.closed) {
			callback(fb_token);
			clearInterval(timer);
		}
	}, 500);
};

export const fbSignup = fbToken => (dispatch: Function, getState: Function) => {
	dispatch(app.addSubmitForm(REDUCER));
	api.fbSignup(fbToken)
		.then(result => {
			if (result.data.success) {
				let data = result.data.data;
				window.localStorage.setItem('app.token', data.token);

				notification.open({
					type: 'success',
					message: 'Signup successfully!',
				});
				dispatch(push('/client/list'));
			} else {
				notification.open({ type: 'error', message: result.data.message });
			}
		})
		.catch(err => {
			notification.open({ type: 'error', message: err.errorMessage });
		});
	dispatch(app.deleteSubmitForm(REDUCER));
};

const initialState = {};

export default createReducer({}, initialState);
