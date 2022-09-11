import config from './Config';

const instance = config.axiosInstance;

const AuthApi = {
	login: (email, password) => {
		return instance.post('auth/login', {
			email: email,
			password: password
		});
	},
  register: (name, email, password, passwordConfirmation) => {
		return instance.post('auth/register', {
      name: name,
      email: email,
      password: password,
      password_confirmation: passwordConfirmation,
    });
	},
  retrieveToken: (id, token) => {
    return instance.post('auth/retrieve-token', {
      id: id,
      token: token
    });
  },
  sendResetPasswordEmail: (email) => {
    return instance.post('auth/send-reset-password-email', {
      email: email
    });
  },
  sendVerificationSms: (email, password) => {
    return instance.post('auth/send-sms-verification-code', {
      email: email,
      password: password
    });
  },
  verifySmsCode: (email, smsCode) => {
    return instance.post('auth/verify-sms-code', {
      email: email,
      smsCode: smsCode
    });
  }
}

export default AuthApi