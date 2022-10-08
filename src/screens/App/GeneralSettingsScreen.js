import { View, Text, StyleSheet } from 'react-native'
import React, { useLayoutEffect } from 'react'
import Header from '../../components/Header'

const GeneralSettingsScreen = ({navigation}) => {


  return (
    <View style={style.container}>
      <Header navigation={navigation} right={false}/>
      <Text>GeneralSettingsScreen</Text>
    </View>
  )
}

export default GeneralSettingsScreen

const style = StyleSheet.create({
  container: {
    paddingHorizontal:20,
    paddingVertical:0,
    flex: 1,
    backgroundColor: "#f9fbfa", 
  },
})