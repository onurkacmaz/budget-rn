import { StyleSheet } from 'react-native'
import React from 'react'
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SmsVerification from './SmsVerification';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <NavigationContainer>
        <Stack.Navigator initialRouteName='Login' screenOptions={{
            headerShown:false
        }}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="SmsVerification" component={SmsVerification} />
        </Stack.Navigator>
    </NavigationContainer>
  )
}

export default AuthStack

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fbfa", 
  },
});
