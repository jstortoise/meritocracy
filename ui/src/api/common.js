import axios from 'axios';
import config from '../config/config';

export const sendGet = async url => {
	let headers = {
		headers: {
			'Content-Type': 'application/json',
			'x-token': window.localStorage.getItem('app.token'),
		},
	};

	const result = await axios.get(config.API_URL + url, headers);

	if (result.headers) {
		if (result.headers['x-token']) {
			window.localStorage.setItem('app.token', result.headers['x-token']);
		}
	}

	if (result.data) {
		if (result.data.token === false && !result.data.success) {
			window.localStorage.setItem('app.token', '');
		}
	}

	return result;
};

export const sendPost = async (url, body) => {
	let headers = {
		headers: {
			'Content-Type': 'application/json',
			'x-token': window.localStorage.getItem('app.token'),
		},
	};

	const result = await axios.post(config.API_URL + url, body, headers);

	if (result.headers) {
		if (result.headers['x-token']) {
			window.localStorage.setItem('app.token', result.headers['x-token']);
		}
	}

	if (result.data) {
		if (result.data.token === false && !result.data.success) {
			window.localStorage.setItem('app.token', '');
		}
	}

	return result;
};

export const sendPut = async (url, body) => {
	let headers = {
		headers: {
			'Content-Type': 'application/json',
			'x-token': window.localStorage.getItem('app.token'),
		},
	};

	const result = await axios.put(config.API_URL + url, body, headers);

	if (result.headers) {
		if (result.headers['x-token']) {
			window.localStorage.setItem('app.token', result.headers['x-token']);
		}
	}

	if (result.data) {
		if (result.data.token === false && !result.data.success) {
			window.localStorage.setItem('app.token', '');
		}
	}

	return result;
};

export const sendDelete = async url => {
	let headers = {
		headers: {
			'Content-Type': 'application/json',
			'x-token': window.localStorage.getItem('app.token'),
		},
	};

	const result = await axios.delete(config.API_URL + url, headers);

	if (result.headers) {
		if (result.headers['x-token']) {
			window.localStorage.setItem('app.token', result.headers['x-token']);
		}
	}

	if (result.data) {
		if (result.data.token === false && !result.data.success) {
			window.localStorage.setItem('app.token', '');
		}
	}

	return result;
};
