import { createAction, createReducer } from 'redux-act';
import { push } from 'react-router-redux';
import { pendingTask, begin, end } from 'react-redux-spinner';
import { notification } from 'antd';
import * as AuthAPI from 'api/auth';
// import { generateRandomPassword } from 'util/password';

const REDUCER = 'app';
const NS = `@@${REDUCER}/`;

const _setFrom = createAction(`${NS}SET_FROM`);
const _setLoading = createAction(`${NS}SET_LOADING`);
const _setHideLogin = createAction(`${NS}SET_HIDE_LOGIN`);

export const setUserState = createAction(`${NS}SET_USER_STATE`);
export const setUpdatingContent = createAction(`${NS}SET_UPDATING_CONTENT`);
export const setActiveDialog = createAction(`${NS}SET_ACTIVE_DIALOG`);
export const deleteDialogForm = createAction(`${NS}DELETE_DIALOG_FORM`);
export const addSubmitForm = createAction(`${NS}ADD_SUBMIT_FORM`);
export const deleteSubmitForm = createAction(`${NS}DELETE_SUBMIT_FORM`);
export const setLayoutState = createAction(`${NS}SET_LAYOUT_STATE`);

export const setLoading = isLoading => {
	const action = _setLoading(isLoading);
	action[pendingTask] = isLoading ? begin : end;
	return action;
};

export const resetHideLogin = () => (dispatch, getState) => {
	const state = getState();
	if (state.pendingTasks === 0 && state.app.isHideLogin) {
		dispatch(_setHideLogin(false));
	}
	return Promise.resolve();
};

export const initAuth = roles => async (dispatch, getState) => {
	// Use Axios there to get User Data by Auth Token with Bearer Method Authentication

	// get user info
	let result = { success: false };
	try {
		const ret = await AuthAPI.checkAuth();
		if (ret.data) {
			result = ret.data;
		}
	} catch (e) {}

	// set user state
	if (result.success) {
		dispatch(
			setUserState({
				userState: {
					username: result.data.username,
					email: result.data.email,
					mid: result.data.mid,
					role: result.data.role,
				},
			}),
		);
	} else {
		initUserState(dispatch, getState);
	}

	const state = getState();
	const user_role = state.app.userState.role * 1;

	if (user_role >= 0) {
		if (roles.find(role => role === user_role) >= 0) {
			if (state.routing.location.pathname === '/') {
				if (user_role === 0) {
					dispatch(push('/user/list'));
				} else {
					dispatch(push('/client/list'));
				}
			}
			return Promise.resolve(true);
		} else {
			dispatch(push('/empty'));
			return Promise.reject(false);
		}
	} else {
		const location = state.routing.location;
		const from = location.pathname + location.search;
		dispatch(_setFrom(from));
		dispatch(push('/login'));
		return Promise.reject(false);
	}
};

export const getParamsFromQuery = () => {
	let query = window.location.href.split('?');
	let params = {};
	if (query.length > 1) {
		let queryStr = query[1];
		let paramStrs = queryStr.split('&');

		if (paramStrs.length > 0) {
			paramStrs.forEach(paramStr => {
				let paramFields = paramStr.split('=');
				if (paramFields.length > 1) {
					params[paramFields[0]] = paramFields[1];
				}
			});
		}
	}
	return params;
};

export const profile = () => (dispatch, getState) => {
	dispatch(push('/profile'));
};

export const logout = () => async (dispatch, getState) => {
	let result = { success: false };
	try {
		const ret = await AuthAPI.logout();
		if (ret.data) {
			result = ret.data;
		}
	} catch (e) {}

	if (result.success) {
		initUserState(dispatch, getState);
		window.localStorage.setItem('app.token', '');
		dispatch(push('/login'));
	} else {
		notification.open({
			type: 'error',
			message: 'Log out failed',
		});
	}
};

const initUserState = (dispatch, getState) => {
	dispatch(
		setUserState({
			userState: {
				username: '',
				email: '',
				mid: '',
				role: -1,
			},
		}),
	);
};

const initialState = {
	// APP STATE
	from: '',
	isUpdatingContent: false,
	isLoading: false,
	activeDialog: '',
	dialogForms: {},
	submitForms: {},
	isHideLogin: false,

	// LAYOUT STATE
	layoutState: {
		isMenuTop: false,
		menuMobileOpened: false,
		menuCollapsed: false,
		menuShadow: true,
		themeLight: true,
		squaredBorders: false,
		borderLess: true,
		fixedWidth: false,
		settingsOpened: false,
	},

	// USER STATE
	userState: {
		username: '',
		email: '',
		mid: '',
		role: -1,
	},
};

export default createReducer(
	{
		[_setFrom]: (state, from) => ({ ...state, from }),
		[_setLoading]: (state, isLoading) => ({ ...state, isLoading }),
		[_setHideLogin]: (state, isHideLogin) => ({ ...state, isHideLogin }),
		[setUpdatingContent]: (state, isUpdatingContent) => ({ ...state, isUpdatingContent }),
		[setUserState]: (state, { userState }) => ({ ...state, userState }),
		[setLayoutState]: (state, param) => {
			const layoutState = { ...state.layoutState, ...param };
			const newState = { ...state, layoutState };
			window.localStorage.setItem('app.layoutState', JSON.stringify(newState.layoutState));
			return newState;
		},
		[setActiveDialog]: (state, activeDialog) => {
			const result = { ...state, activeDialog };
			if (activeDialog !== '') {
				const id = activeDialog;
				result.dialogForms = { ...state.dialogForms, [id]: true };
			}
			return result;
		},
		[deleteDialogForm]: (state, id) => {
			const dialogForms = { ...state.dialogForms };
			delete dialogForms[id];
			return { ...state, dialogForms };
		},
		[addSubmitForm]: (state, id) => {
			const submitForms = { ...state.submitForms, [id]: true };
			return { ...state, submitForms };
		},
		[deleteSubmitForm]: (state, id) => {
			const submitForms = { ...state.submitForms };
			delete submitForms[id];
			return { ...state, submitForms };
		},
	},
	initialState,
);
