import * as common from './common';

export const getClientList = type => {
	return common.sendPost('/client/list', { type });
};

export const getClientDetail = clientId => {
	return common.sendGet('/client/detail/' + clientId);
};

export const addClient = newClient => {
	return common.sendPut('/client/add', newClient);
};

export const deleteClient = appkey => {
	return common.sendDelete(`/client/delete/${appkey}`);
};
