import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

const Button = (props) => {
  return (
    <TouchableOpacity onPress={props.onPress} style={[styles.button, {backgroundColor: props.bgColor}, props.style]}>
      <View style={{marginRight:5}}>
        {props.icon}
      </View>
      <Text style={[styles.buttonText, {color: props.textColor}]}>{props.text}</Text>
    </TouchableOpacity>
  )
}

export default Button

const styles = StyleSheet.create({
    button: {
      flex: 1,
      flexDirection:'row', 
      alignContent:'center',
      justifyContent:'center',
      alignItems:'center',
      paddingHorizontal:40,
      paddingVertical:10,
      borderRadius:10
    },
    buttonText: {
        fontWeight:'bold'
    }
})