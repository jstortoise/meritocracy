import * as common from './common';

export const getList = () => {
	return common.sendGet('/mprange/list');
};

export const addPoints = info => {
	return common.sendPut('/mprange/add', info);
};

export const editPoints = (type, info) => {
	return common.sendPut(`/mprange/edit/${type}`, info);
};

export const getPointsDetail = type => {
	return common.sendGet(`/mprange/detail/${type}`);
};
