import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'

const domain = "http://127.0.0.1:8082/";
const baseUrl = domain + "api/"
const axiosOptions = {
  baseURL: baseUrl,
  headers: {
    'Content-type': 'Application/json',
    'Accept': 'Application/json'
  }
}

const axiosInstance = axios.create(axiosOptions);

axiosInstance.interceptors.request.use(
  async config => {
    let user = await AsyncStorage.getItem('user')
    if (user) {
      user = JSON.parse(user)
      config.headers.Authorization = "Bearer " + user.token
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
);

export default {domain, axiosInstance}