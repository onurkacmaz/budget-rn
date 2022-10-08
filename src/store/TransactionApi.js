import config from './Config';

const instance = config.axiosInstance;

const TransactionApi = {
	getTransactions: (limit) => {
		return instance.get('transactions', {
			params: {
				limit: limit
			}
		});
	},
	create: (type, amount, date) => {
		return instance.post('transactions', {
			type: type,
			amount: amount,
			date: date
		});
	},
	delete: (id) => {
		return instance.delete('transactions/' + id);
	},
	deleteAll: () => {
		return instance.delete('transactions');
	}
}

export default TransactionApi