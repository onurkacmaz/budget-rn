import { Keyboard, View, Text, TouchableWithoutFeedback, KeyboardAvoidingView, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import AuthApi from '../../store/AuthApi'
import Loader from '../../components/Loader'
import GoBack from '../../components/GoBack'

const SmsVerification = ({route, navigation}) => {

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      header: () => <GoBack navigation={navigation}/>
    })
  }, [])

	const { email, phone, callback } = route.params;

	const [smsCode, setSmsCode] = useState()
	const [isLoading, setIsLoading] = useState(false)

	const handleVerifySmsCode = () => {
		setIsLoading(true)
		AuthApi.verifySmsCode(smsCode, email, phone)
		.then(r => {
			if(r.status === 200) {
				callback()
			}
		}).catch(err => {
			Alert.alert('Usps!', err?.response?.data?.errors?.join("\n") ?? err.message)
		})
		.finally(() => {
			setIsLoading(false)
		})
	}

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
				<Loader animating={isLoading}/>
        <View style={[styles.inputContainer, {alignItems:'center', marginBottom:10}]}>
          <Text style={{fontSize:30, fontWeight:'800'}}>VERIFY</Text>
        </View>
        <View style={styles.inputContainer}>
          <TextInput keyboardType='numeric' maxLength={6} value={smsCode} onChangeText={smsCode => setSmsCode(smsCode)} placeholder='Sms Code' placeholderTextColor={"#666"} style={styles.input} />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={() => handleVerifySmsCode()} style={styles.button}>
          <Text style={styles.buttonText}>Verify SMS Code</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  )
}

export default SmsVerification

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