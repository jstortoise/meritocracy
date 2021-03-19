import { createReducer } from 'redux-act';
import * as api from '../api/wallet';

export const REDUCER = 'wallet';

export const createWallet = async (coinType, callback) => {
	let res = { success: false };
	try {
		const ret = await api.createWallet(coinType);
		if (ret.data) {
			res = ret.data;
		}
	} catch (e) {}
	callback(res);
};

export const withdrawCoin = async (coinType, address, amount, callback) => {
	let res = { success: false };
	try {
		const ret = await api.withdrawCoin(coinType, address, amount);
		if (ret.data) {
			res = ret.data;
		}
	} catch (e) {}
	callback(res);
};

const initialState = {};

export default createReducer({}, initialState);
