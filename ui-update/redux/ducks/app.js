import { createAction, createReducer } from 'redux-act';

const REDUCER = 'app';
const NS = `@@${REDUCER}/`;
export const setUserState = createAction(`${NS}SET_USER_STATE`);
export const addSubmitForm = createAction(`${NS}ADD_SUBMIT_FORM`);
export const deleteSubmitForm = createAction(`${NS}DELETE_SUBMIT_FORM`);

export const getParamsFromQuery = url => {
	let query = url.split('?');
	let params = {};
	if (query.length > 1) {
		let queryStr = query[1];
		let paramStrs = queryStr.split('&');

		if (paramStrs.length > 0) {
			paramStrs.forEach(paramStr => {
				let paramFields = paramStr.split('=');
				if (paramFields.length > 1) {
					params[paramFields[0]] = decodeURIComponent(paramFields[1]);
				}
			});
		}
	}
	return params;
};

export const getQueryFromParams = (params = {}) => {
	var query = '';
	for (let i = 0; i < Object.keys(params).length; i++) {
		let field = Object.keys(params)[i];
		if (i > 0) {
			query += '&';
		}
		query += `${field}=${params[field]}`;
	}
	return query;
};

export const dateFormat = date => {
    var monthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

	if (!date) {
		return '';
	}
		
    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();

    return day + ' ' + monthNames[monthIndex] + ' ' + year;
};

export const timeFormat = date => {
	if (!date) {
		return '';
	}
		
    var hour = date.getUTCHours();
	var minute = date.getUTCMinutes();
	var apm = 'am';

	if (hour > 12) {
		hour = hour - 12;
		apm = 'pm';
	}

    return hour + ':' + minute + ' ' + apm;
};

const initialState = {
	// APP STATE
    submitForms: {},
	// USER STATE
    user: {},
};

export default createReducer({
    [setUserState]: (state, { user }) => ({ ...state, user }),
    [addSubmitForm]: (state, id) => {
        const submitForms = { ...state.submitForms, [id]: true };
        return { ...state, submitForms };
    },
    [deleteSubmitForm]: (state, id) => {
        const submitForms = { ...state.submitForms };
        delete submitForms[id];
        return { ...state, submitForms };
    },
}, initialState);
