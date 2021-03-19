import * as common from './common';

// My info
export const getMe = () => common.sendGet('/user/me');
// Users list
export const getUserList = params => common.sendPost('/user/list', params);
// User search
export const searchUsers = params => common.sendPost('/user/search', params);
// User detail
export const getUserDetailById = userId => common.sendGet(`/user/detail/${userId}`);
