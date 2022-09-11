import config from './Config';

const instance = config.axiosInstance;

const WalletApi = {
	getWallet: () => {
		return instance.get('wallet');
	}
}

export default WalletApi