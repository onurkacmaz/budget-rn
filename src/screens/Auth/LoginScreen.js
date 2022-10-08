import { Alert, Keyboard, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React, { useContext, useState } from 'react'
import AuthApi from '../../store/AuthApi';
import Loader from '../../components/Loader'
import { AuthContext } from '../../components/context';

const LoginScreen = ({route, navigation}) => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { signIn } = useContext(AuthContext)

  const handleSignIn = () => {
    setIsLoading(true)
    AuthApi.sendVerificationSms(email, password)
    .then(r => {
      if(r.data.isTwoFactorAuthEnabled == undefined) {
        navigation.navigate('SmsVerification', {
          email: email,
          callback: () => {
            signIn(email, password)
          }
        })
      }else {
        signIn(email, password)
      }
    }).catch(err => {
			Alert.alert('Usps!', err?.response?.data?.errors?.join("\n") ?? err.message)
		})
    .finally(() => {
      setIsLoading(false)
    })
  }

  const navigateToRegisterScreen = () => {
    navigation.navigate('Register')
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
        <Loader animating={isLoading}/>
        <View style={styles.inputContainer}>
          <TextInput autoCapitalize="none" value={email} onChangeText={email => setEmail(email)} keyboardType='email-address' placeholder='Email' placeholderTextColor={"#666"} style={styles.input} />
          <TextInput value={password} onChangeText={password => setPassword(password)} placeholder='Password' placeholderTextColor={"#666"} style={styles.input} secureTextEntry />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={() => handleSignIn()} style={styles.button}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigateToRegisterScreen()} style={[styles.button, styles.buttonOutline]}>
            <Text style={styles.buttonOutlineText}>Register</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  )
}

export default LoginScreen

const styles = StyleSheet.create({
  container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center"
  },
  inputContainer: {
      width: '80%'
  },
  input: {
      backgroundColor: 'white',
      padding:20,
      borderRadius: 10,
      marginTop: 10
  },
  buttonContainer: {
      width: '80%',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 20
  },
  button: {
      alignItems:'center',
      backgroundColor: '#0782F9',
      width: '100%',
      padding: 15,
      borderRadius:10
  },
  buttonOutline: {
    backgroundColor: 'white',
    marginTop: 5,
    borderColor: '#0782F9',
    borderWidth:2
  },
  buttonText: {
      color:'white',
      fontWeight: '700',
      fontSize: 16
  },
  buttonOutlineText: {
      color:'#0782F9',
      fontWeight: '700',
      fontSize: 16
  }
})