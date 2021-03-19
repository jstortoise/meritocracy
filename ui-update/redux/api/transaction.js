import * as common from './common';

// Get all transactions
export const getAllTransactions = params => common.sendPost('/transaction/list', params);

// Get my transactions
export const getMyTransactions = params => common.sendPost('/transaction/list/me', params);