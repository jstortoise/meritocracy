import * as common from './common';

// Generate Wallet Address
export const createWallet = coinType => common.sendGet(`/wallet/${coinType}/create`);
// Withdraw
export const withdrawCoin = (coinType, address, amount) => common.sendPost(`/wallet/${coinType}/withdraw`, { coinType, address, amount });
