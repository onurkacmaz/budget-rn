import { Alert, Keyboard, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React, { useContext, useLayoutEffect, useState } from 'react'
import { AuthContext } from '../../components/context'
import GoBack from '../../components/GoBack'
import AuthApi from '../../store/AuthApi'
import Loader from '../../components/Loader'

const RegisterScreen = ({ navigation }) => {

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      header: () => <GoBack navigation={navigation}/>
    })
  }, [])

  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [phone, setPhone] = useState(null);
  const [password, setPassword] = useState("");
  const [passwordRetry, setPasswordRetry] = useState();
  const { signUp } = useContext(AuthContext)
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = () => {
    setIsLoading(true)
    AuthApi.sendVerificationSms(null, null, phone)
    .then(r => {
      navigation.navigate('SmsVerification', {
        phone: phone,
        callback: signUp(name, email, phone, password, passwordRetry)
      })
    }).catch(err => {
      Alert.alert('Usps!', err?.response?.data?.errors?.join("\n") ?? err.message)
    }).finally(() => {
      setIsLoading(false)
    })
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
        <Loader animating={isLoading}/>
        <View style={[styles.inputContainer, {alignItems:'center', marginBottom:10}]}>
          <Text style={{fontSize:30, fontWeight:'800'}}>REGISTER</Text>
        </View>
        <View style={styles.inputContainer}>
          <TextInput value={name} onChangeText={name => setName(name)} placeholder='Name' placeholderTextColor={"#666"} style={styles.input} />
          <TextInput value={email} onChangeText={email => setEmail(email)} keyboardType='email-address' placeholder='Email' placeholderTextColor={"#666"} style={styles.input} />
          <TextInput value={phone} onChangeText={phone => setPhone(phone)} keyboardType='phone-pad' placeholder='Phone' placeholderTextColor={"#666"} style={styles.input} />
          <TextInput value={password} onChangeText={password => setPassword(password)} placeholder='Password' placeholderTextColor={"#666"} style={styles.input} secureTextEntry />
          <TextInput value={passwordRetry} onChangeText={passwordRetry => setPasswordRetry(passwordRetry)} placeholder='Password Retry' placeholderTextColor={"#666"} style={styles.input} secureTextEntry />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={() => handleRegister()} style={styles.button}>
          <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  )
}

export default RegisterScreen

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