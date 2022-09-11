import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

const Toast = (props) => {
    switch(props.status) {
        case "error":
            return (
                <View style={[styles.containerMain, styles.error, styles.visible]}>
                    <Text style={styles.text}>{props.message}</Text>
                </View>  
            )
        case "success":
            return (
                <View style={[styles.containerMain, styles.success, styles.visible]}>
                    <Text style={styles.text}>{props.message}</Text>
                </View>  
            )
    }
}

const styles = StyleSheet.create({
    containerMain: {
        position: "absolute",
        left: 0,
        right: 0,
        padding:20,
        zIndex: 101,
        justifyContent:'center',
        alignItems:'center'
    },
    success: {
        backgroundColor: 'rgba(50, 1, 255, 1)',
    },
    error: {
        backgroundColor: 'rgba(255, 74, 74, 1)',
    },
    text: {
        fontWeight:'bold',
        fontSize:17,
        color:'#fff'
    }
})

export default Toast