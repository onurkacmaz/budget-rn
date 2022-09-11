import React from 'react'
import { View, Modal, ActivityIndicator, StyleSheet, Platform } from 'react-native'

const Loader = (props) => {
    return (
        <View>
            {
                Platform.OS === 'ios' || Platform.OS == 'android' ? <Modal
                    transparent={true}
                    animationType={'none'}
                    visible={props.animating}>
                    <View style={styles.modalBackground}>
                        <View style={styles.activityIndicatorWrapper}>
                            <ActivityIndicator animating={props.animating} />
                        </View>
                    </View>
                </Modal> : null
            }
        </View>
    )
}

const styles = StyleSheet.create({
    activityIndicatorWrapper: {
        backgroundColor: '#FFFFFF',
        height: 100,
        width: 100,
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    modalBackground: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-around',
        backgroundColor: '#00000040'
    }
});

export default Loader
