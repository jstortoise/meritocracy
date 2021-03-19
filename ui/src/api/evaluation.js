import * as common from './common';

export const getList = () => {
	return common.sendGet('/eval/list');
};

export const addEval = info => {
	return common.sendPut('/eval/add', info);
};

export const editEval = (type, info) => {
	return common.sendPut(`/eval/edit/${type}`, info);
};

export const getEvalDetail = type => {
	return common.sendGet(`/eval/detail/${type}`);
};
