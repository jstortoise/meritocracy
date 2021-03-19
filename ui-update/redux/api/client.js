import * as common from './common';

// Create client
export const createClient = params => common.sendPut('/client/create', params);
// Update client
export const updateClient = (id, params) => common.sendPut(`/client/${id}/update`, params);
// Get all clients
export const getClientList = params => common.sendPost('/client/list', params);
// Get my clients
export const getMyClientList = params => common.sendPost('/client/list/me', params);
// Get user's clients
export const getClientListByUserId = userId => common.sendGet(`/client/${userId}/list`);
// Get client
export const getClientDetail = id => common.sendGet(`/client/${id}/detail`);
// Delete client
export const deleteClient = id => common.sendDelete(`/client/${id}/delete`);