import { Alert } from 'react-native';
import { useEffect, useMemo, useReducer, useState } from 'react';
import {AuthContext} from './src/components/context'
import { loginReducer } from './src/reducers/loginReducer';
import AuthApi from './src/store/AuthApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from './src/components/Loader';
import AppStack from './src/screens/App/AppStack';
import AuthStack from './src/screens/Auth/AuthStack';

export default function App() {

  const initialLoginState = {
    id: null,
    name: null,
    email: null,
    token: null,
    isLoading: true,
  }

  const [isLoading, setIsLoading] = useState(false);

  const [loginState, dispatch] = useReducer(loginReducer, initialLoginState)

  const authContent = useMemo(() => ({
    signIn: (email, password) => {
      setIsLoading(true)
      AuthApi.login(email, password)
      .then(res => {
        AsyncStorage.setItem('user', JSON.stringify(res.data.data)).then(r => {
          dispatch({
            type: 'LOGIN', 
            email: email, 
            token: res.data.data.token, 
            id: res.data.data.id
          })
        })
      })
      .catch(err => {
        Alert.alert('Usps!', err.response.data.errors.join("\n"))
      }).finally(() => {
        setIsLoading(false)
      })
    },
    signOut: () => {
      setIsLoading(true)
      AsyncStorage.removeItem('user').then(r => {
        dispatch({type: 'LOGOUT'})
      })
      .finally(() => {
        setIsLoading(false)
      })
    },
    signUp: (name, email, phone, password, passwordConfirmation) => {
      setIsLoading(true)
      AuthApi.register(name, email, phone, password, passwordConfirmation)
      .then(res => {
        AsyncStorage.setItem('user', JSON.stringify(res.data.data)).then(r => {
          dispatch({type: 'LOGIN', email: email, token: res.data.data.token, id: res.data.data.id})
        })
      })
      .catch(err => {
        Alert.alert('Usps!', err.response.data.errors.join("\n"))
      })
      .finally(() => {
        setIsLoading(false)
      })
    },
    resetPassword: (email) => {
      setIsLoading(true)
      AuthApi.sendResetPasswordEmail(email)
      .then(res => {
        Alert.alert('Usps!', err.response.data.message)
      })
      .catch(err => {
        Alert.alert('Usps!', err.response.data.errors.join("\n"))
      })
      .finally(() => {
        setIsLoading(false)
      })
    },
    retrieveToken: () => {
      AsyncStorage.getItem('user').then(user => {
        if (user) {
          user = JSON.parse(user)
          AuthApi.retrieveToken(user.id, user.token).then(r => {
            dispatch({type: 'RETRIEVE_TOKEN', token: r.data.data, id: r.data.data.id})
          }).catch(err => {
            Alert.alert('Usps!', 'Please login retry.')
            dispatch({type: 'LOGOUT'})
          })
        }
      })
    },
    getUser: async () => {
      return await AsyncStorage.getItem('user')
    },
    syncUser: async (user) => {
      return await AsyncStorage.mergeItem('user', JSON.stringify(user))
    }
  }))

  useEffect(() => {
    authContent.retrieveToken()
  }, [])
  
  return (
    <AuthContext.Provider value={authContent}>
			<Loader animating={isLoading}/>
      { loginState.token ? (<AppStack />) : (<AuthStack/>)}
    </AuthContext.Provider>
  );
}