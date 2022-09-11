import { SafeAreaView, StyleSheet } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import GeneralSettingsScreen from './GeneralSettingsScreen';
import NotificationsScreen from './NotificationsScreen';
import SecurityScreen from './SecurityScreen';
import HelpCenterScreen from './HelpCenterScreen';
import HomeScreen from './HomeScreen'
import TransactionsScreen from './TransactionsScreen'
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';

const Stack = createNativeStackNavigator();

const AppStack = () => {
  return (
    <PaperProvider>
        <SafeAreaView style={styles.container}>
          <NavigationContainer>
            <Stack.Navigator initialRouteName='Home' screenOptions={{
              headerShown:false
            }}>
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="Transactions" component={TransactionsScreen} />
              <Stack.Screen name="GeneralSettings" component={GeneralSettingsScreen} />
              <Stack.Screen name="NotificationSettings" component={NotificationsScreen} />
              <Stack.Screen name="SecuritySettings" component={SecurityScreen} />
              <Stack.Screen name="HelpCenter" component={HelpCenterScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaView>
      </PaperProvider>
  )
}

export default AppStack



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fbfa", 
  },
});
