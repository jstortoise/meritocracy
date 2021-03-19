const http = require('http');
const app = require('./app');
const dotenv = require('dotenv');
const cron = require('node-cron');

const config = require('./config');
const cronjob = require('./controllers/cronjob');

dotenv.config();

const server = http.createServer(app);
const port = process.env.PORT || 4000;

const io = require('socket.io')(server);
const Notification = require('./controllers/notification');
const Transaction = require('./controllers/transaction');
const Wallet = require('./controllers/wallet');
const WalletAPI = require('./meritocracy-wallets-api');

const { ADMIN_GLX_ADDRESS, ADMIN_ETH_ADDRESS, ADMIN_BTC_ADDRESS, ADMIN_BCH_ADDRESS } = require('./config');

const getAdminAddress = (coinType = 0) => {
    if (coinType == 1) {
        return ADMIN_ETH_ADDRESS;
    } else if (coinType == 2) {
        return ADMIN_BTC_ADDRESS;
    } else if (coinType == 3) {
        return ADMIN_BCH_ADDRESS;
    } else {
        return ADMIN_GLX_ADDRESS;
    }
};

const getCoinName = coinType => {
    if (coinType == 1) {
        return 'ETH';
    } else if (coinType == 2) {
        return 'BTC';
    } else if (coinType == 3) {
        return 'BCH';
    } else {
        return 'GLX';
    }
};

// io.on('connection', client => {
// 	client.on('deposit', (coinType, address, periodMinute) => {
// 		console.log('Deposit request', coinType, address);
// 		const intervalId = setInterval(() => checkWallet(coinType, address), 60000); // 1 min
// 		let timeMinute = 0;
// 		const checkWallet = async (coinType, address) => {
// 			try {
// 				if (periodMinute > 0 && timeMinute >= periodMinute) clearInterval(intervalId);

// 				console.log('Check wallet')
// 				timeMinute++;

// 				const wallet = await Wallet.findOne({ coinType, address });
// 				const { balance, userId } = wallet;
// 				const balanceAmount = await WalletAPI.getBalance(coinType, address); // ETH or BTC but not Wei or Satoshi
// 				const adminAddress = getAdminAddress(coinType);

// 				if (!balanceAmount || balanceAmount <= 0) return;
				
// 				console.log(`CoinType=${coinType}, Address=${address}, Amount=${balanceAmount}`);
// 				// Send transaction
// 				if (coinType == 2) {
// 					await WalletAPI.sendTransaction(coinType, wallet, adminAddress, -1, 0);
// 				} else {
// 					await WalletAPI.sendTransaction(coinType, wallet, adminAddress, balanceAmount, 0);
// 				}
// 				// Update balances on DB
// 				const totalBalance = balance * 1 + balanceAmount * 1;
// 				await Wallet.update({ balance: totalBalance }, { address, coinType });
// 				// Create notification
// 				const msg = `${balanceAmount} ${getCoinName(coinType)} is successfully deposited on your address.`
// 				await Notification.create({ type: 0, userId, description: msg });
// 				// Create transaction history
// 				await Transaction.create({ coinType, txType: 1, from: '', to: address, value: balanceAmount, txFee: 0, description: 'Deposit' });

// 				// Send response to client side
// 				client.emit('deposit', { coinType, address, amount: balanceAmount, balance: totalBalance, msg });

// 				// Finish setInterval
// 				clearInterval(intervalId);
// 			} catch(e) {
// 				console.log(e);
// 			}
// 		};
// 	});
// });

server.listen(port, () => {
	console.log(`Server is running at port ${port}`);
});

/**
 * Calculate Merit Points
 */
cron.schedule(config.MP_CRONJOB_SCHEDULE, async () => {
	try {
		let time = new Date();
		console.log(time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds());
		await cronjob.calcMemberRating()
		await cronjob.calcConsistency();
		await cronjob.calcOrgMeritPoints();
	} catch (e) {}
});

/**
 * Manage All ETH Wallets's balance
 */
cron.schedule(config.ETH_CRONJOB_SCHEDULE, async () => {
	try {
		let time = new Date();
		console.log('Check wallets', time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds());
		await cronjob.checkWalletBalances(); // Check All wallets
	} catch (e) {}
});
