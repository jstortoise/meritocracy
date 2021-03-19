import * as common from './common';

export const signup = newUser => {
	return common.sendPost('/auth/signup', newUser);
};

export const login = userInfo => {
	return common.sendPost('/auth/login', userInfo);
};

export const logout = () => {
	return common.sendGet('/auth/logout');
};

export const checkAuth = () => {
	return common.sendGet('/auth/userinfo');
};

export const legacySignup = newUser => {
	return common.sendPost('/legacy/signup', newUser);
};

export const legacyLogin = userInfo => {
	return common.sendPost('/legacy/login', userInfo);
};

export const fbSignup = fbToken => {
	return common.sendPost('/auth/facebook/signup', { fbToken });
};

export const orgLogin = appkey => {
	return common.sendPost('/auth/org/login', { appkey });
};

export const addUser = newUser => {
	return common.sendPost('/auth/add', newUser);
};

export const editUser = (_id, newUser) => {
	return common.sendPut(`/auth/edit/${_id}`, newUser);
};

export const deleteUser = _id => {
	return common.sendDelete(`/auth/delete/${_id}`);
};

export const getUserDetail = _id => {
	return common.sendGet(`/auth/detail/${_id}`);
};

export const getRates = username => {
	return common.sendGet(`/auth/rates/${username}`);
};

export const getScores = (username, clientId) => {
	return common.sendGet(`/auth/scores/${username}/${clientId}`);
};

export const getUserList = () => {
	return common.sendGet('/auth/list');
};

export const getMyClientList = () => {
	return common.sendGet('/auth/clientlist');
};
