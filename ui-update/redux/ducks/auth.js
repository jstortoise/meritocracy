import { createReducer } from 'redux-act';
import { notification } from 'antd';
import Router from 'next/router';
import NProgress from 'nprogress';
import { setCookie, removeCookie } from '../../utils/cookie';
import * as app from './app';
import * as api from '../api/auth';

export const REDUCER = 'auth';

// sign up
export const signup = params => dispatch => {
	dispatch(app.addSubmitForm(REDUCER));
	api.signup(params).then(res => {
		const { success, data, message } = res.data;
		if (success) {
			const { token } = data;
			setCookie('token', token);
			notification.open({ type: 'success', message: 'Sign up success' });
			Router.push('/dashboard');
		} else {
			notification.open({ type: 'error', message });
		}
	}).catch(err => {
		notification.open({ type: 'error', message: 'Sign up failed' });
	}).finally(() => {
		dispatch(app.deleteSubmitForm(REDUCER));
	});
};

// sign up with facebook
export const fbSignup = params => dispatch => {
	dispatch(app.addSubmitForm(REDUCER));
	api.fbSignup(params).then(res => {
		const { success, data, message } = res.data;
		if (success) {
			// set token
			const { token } = data;
			setCookie('token', token);
			notification.open({ type: 'success', message: 'Facebook sign up success' });
			Router.push('/dashboard');
		} else {
			notification.open({ type: 'error', message: message || 'Facebook sign up failed' });
		}
	}).catch(err => {
		notification.open({ type: 'error', message: 'Facebook sign up failed' });
	}).finally(() => {
		dispatch(app.deleteSubmitForm(REDUCER));
	});
};

// login
export const login = loginInfo => async dispatch => {
	dispatch(app.addSubmitForm(REDUCER));
	try {
		const params = app.getParamsFromQuery(window.location.href);
		let isLegacy = false;
		if (params.redirectUrl) {
			loginInfo['rootUrl'] = params.redirectUrl;
			if (params.appkey) {
				loginInfo['appkey'] = params.appkey;
				isLegacy = true;
			}
		}

		let res = {};
		if (isLegacy) {
			res = await api.legacyLogin(loginInfo);
		} else {
			res = await api.login(loginInfo);
		}

		const { success, data, message } = res.data;
		if (success) {
			const { token } = data;
			if (isLegacy) {
				window.opener.postMessage(token, '*');
				window.close();
			} else {
				// set token
				setCookie('token', token);
				notification.open({ type: 'success', message: 'Login success' });
				Router.push('/dashboard');
			}
		} else {
			notification.open({ type: 'error', message });
		}
	} catch (e) {
		notification.open({ type: 'error', message: 'Login failed' });
	}
	dispatch(app.deleteSubmitForm(REDUCER));
};

// logout
export const logout = (expired = false) => dispatch => {
	NProgress.start();
	api.logout().then(res => {
		if (res.data.success || res.data.token === false) {
			// set token
			dispatch(app.setUserState({ user: {} }));

			if (expired) {
				notification.open({ type: 'warning', message: 'Session expired due to inactivity. Please try to login again.' });
				Router.push('/expired');
			} else {
				removeCookie('token');
				notification.open({ type: 'success', message: 'Logout success' });
				Router.push('/login');
			}
		}
	}).catch(err => {
		NProgress.done();
		notification.open({ type: 'error', message: 'Logout failed' });
	});
};

export const updateProfile = params => dispatch => {
	dispatch(app.addSubmitForm(REDUCER));
	api.updateProfile(params).then(res => {
		if (res.data.success) {
			notification.open({ type: 'success', message: 'Profile updated successfully' });
			Router.push('/dashboard');
		} else {
			notification.open({ type: 'error', message: res.data.message });
		}
	}).catch(err => {
		notification.open({ type: 'error', message: 'Failed to update profile' });
	}).finally(() => {
		dispatch(app.deleteSubmitForm(REDUCER));
	});
};

// get reset password link
export const getPwdResetLink = email => dispatch => {
	dispatch(app.addSubmitForm(REDUCER));
	api.getPwdResetLink(email).then(res => {
		if (res.data.success) {
			Router.push('/forgot/sent');
		} else {
			notification.open({ type: 'error', message: res.data.message });
		}
	}).catch(err => {
		notification.open({ type: 'error', message: 'Failed to send email' });
	}).finally(() => {
		dispatch(app.deleteSubmitForm(REDUCER));
	});
};

// check reset link if valid
export const checkPwdResetLink = async (resetId, callback) => {
	let res = { success: false };
	try {
		const ret = await api.checkPwdResetLink(resetId);
		if (ret.data) {
			res = ret.data;
		}
	} catch (e) {}
	callback(res);
};

// reset password
export const resetPassword = (resetId, params) => dispatch => {
	dispatch(app.addSubmitForm(REDUCER));
	api.resetPassword(resetId, params).then(res => {
		if (res.data.success) {
			notification.open({ type: 'success', message: 'Successfully reset your password' });
			Router.push('/login');
		} else {
			notification.open({ type: 'error', message: 'Failed to reset password' });
		}
	}).catch(err => {
		notification.open({ type: 'error', message: 'Failed to reset password' });
	}).finally(() => {
		dispatch(app.deleteSubmitForm(REDUCER));
	});
};

export const verifyUserEmail = verifyId => dispatch => {
	let msg = 'An error occurred.', msgType = 'error';
	api.verifyEmail(verifyId).then(res => {
		if (res.data.success) {
			msg = 'Email verified successfully. Now, your account is activated.';
			msgType = 'success';
		} else if (res.data.message) {
			msg = res.data.message;
		}
	}).finally(() => {
		notification.open({ type: msgType, message: msg });
		Router.push('/');
	});
};

export const sendVerifyEmail = async (email, callback) => {
	let res = { success: false };
	try {
		const ret = await api.sendVerifyEmail(email);
		if (ret.data) {
			res = ret.data;
		}
	} catch (e) {}
	callback(res);
};

export const checkAuth = async (dispatch, ctx) => {
	let result = { success: false };
	try {
		const ret = await api.checkAuth(ctx.req);
		if (ret.data) {
			result = ret.data;
		}
	} catch (e) {}

	if (result.success) {
		dispatch(app.setUserState({ user: result.data }));
		return result.data;
	} else {
		dispatch(app.setUserState({ user: {} }));
		return {};
	}
};

export const getCaptcha = async callback => {
	let res = { success: false };
	try {
		const ret = await api.getCaptcha();
		if (ret.data) {
			res = ret.data;
		}
	} catch (e) {}
	callback(res);
};

export const getSettings = async callback => {
	let res = { success: false };
	try {
		const ret = await api.getSettings();
		if (ret.data) {
			res = ret.data;
		}
	} catch (e) {}
	callback(res);
};

export const updateSettings = params => dispatch => {
	dispatch(app.addSubmitForm(REDUCER));
	api.updateSettings(params).then(res => {
		if (res.data.success) {
			notification.open({ type: 'success', message: 'Settings updated successfully.' });
		} else {
			notification.open({ type: 'error', message: res.data.message });
		}
	}).catch(err => {
		notification.open({ type: 'error', message: 'Failed to update settings' });
	}).finally(() => {
		dispatch(app.deleteSubmitForm(REDUCER));
	});
};

export const searchAll = async (params, callback) => {
	let res = { success: false };
	try {
		const ret = await api.searchAll(params);
		if (ret.data) {
			res = ret.data;
		}
	} catch (e) {}
	callback(res);
};

export const sendTokenTo = params => dispatch => {
	dispatch(app.addSubmitForm(REDUCER));
	api.sendTokenTo(params).then(res => {
		const ret = res.data;
		notification.open({ type: ret.success ? 'success' : 'error', message: ret.message });
	}).catch(err => {
		notification.open({ type: 'error', message: 'Failed to send token' });
	}).finally(() => {
		dispatch(app.deleteSubmitForm(REDUCER));
	});
};

const initialState = {};

export default createReducer({}, initialState);
