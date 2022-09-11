import config from './Config';

const instance = config.axiosInstance;

const TransactionApi = {
	getTransactions: () => {
		return instance.get('transactions', {
			params: {
				limit: 10
			}
		});
	},
	create: (type, amount, date) => {
		return instance.post('transactions', {
			type: type,
			amount: amount,
			date: date
		});
	}
}

export default TransactionApi