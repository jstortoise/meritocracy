import * as common from './common';

export const getList = () => {
	return common.sendGet('/range/list');
};

export const addRange = info => {
	return common.sendPut('/range/add', info);
};

export const editRange = (type, info) => {
	return common.sendPut(`/range/edit/${type}`, info);
};

export const deleteRange = type => {
	return common.sendDelete(`/range/delete/${type}`);
};

export const getDetail = type => {
	return common.sendGet(`/range/detail/${type}`);
};
