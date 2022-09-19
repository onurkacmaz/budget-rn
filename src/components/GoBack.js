import { Text, SafeAreaView, TouchableOpacity } from 'react-native'
import React from 'react'
import { Icon } from '@rneui/base'

const GoBack = (props) => {

  const handleGoBack = () => {
    props.navigation.goBack()
  }

  return (
    <SafeAreaView style={{backgroundColor:'rgb(242,242,242)'}}>
      <TouchableOpacity onPress={() => handleGoBack()} style={{flexDirection:'row', alignItems:'center', paddingHorizontal:40, paddingTop:20, backgroundColor:'rgb(242,242,242)'}}>
        <Icon name='angle-left' color={'#0782F9'} type='font-awesome' size={17} style={{paddingRight:10}} />
        <Text style={{color:'#0782F9', fontWeight:'500', fontSize:17}}>Back</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

export default GoBack