import * as common from './common';

export const setValue = (type, info) => {
	return common.sendPut(`/base/update/${type}`, info);
};

export const getValue = type => {
	return common.sendGet(`/base/detail/${type}`);
};

export const getList = () => {
	return common.sendGet('/base/list');
};
