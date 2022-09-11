import config from './Config';

const instance = config.axiosInstance;

const NotificationApi = {
	getNotifications: (limit) => {
		return instance.get('notifications', {
			params: {
				limit: limit
			}
		});
	},
	markReadNotifications: () => {
		return instance.get('notifications/mark-read');
	}
}

export default NotificationApi