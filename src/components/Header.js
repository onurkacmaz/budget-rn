import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, RefreshControl } from 'react-native'
import React, { useRef, useState } from 'react'
import UIAvatar from './UIAvatar'
import { Icon } from '@rneui/base'
import ActionSheet from 'react-native-actions-sheet'
import Profile from './Profile'
import NotificationApi from '../store/NotificationApi'

const Header = (props) => {
	const {right, navigation} = props;
  const profileActionSheetRef = useRef(null)
  const notificationsActionSheetRef = useRef(null);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
	const [notifications, setNotifications] = useState([])
	
  const handleGoProfile = () => {
    profileActionSheetRef.current?.show()
  }

	const refreshNotifications = async () => {
		setNotificationsLoading(true)
		NotificationApi.getNotifications().then(r => {
			setNotifications(r.data)
		}).finally(() => {
			setNotificationsLoading(false)
		})
	}

	const handleOpenNotifications = () => {
		notificationsActionSheetRef.current?.show()
		refreshNotifications()
	}

	const markReadNotifications = async () => {
		return NotificationApi.markReadNotifications()
	}

	const RenderNotifications = () => {
		if(Object.keys(notifications).length > 0) {
      return (
        notifications.map((notification, i) => {
          return (
            <View key={i} style={{ marginBottom:30}}>
							<View style={{marginBottom:5, flexDirection:'row', justifyContent:'flex-start', alignItems:'center'}}>
								{
									notification.read_at === null
									? 
									<Icon name='dot' type='octicon' color={"#5CB8E4"} paddingRight={10} size={28}/>
									:
									<Icon name='dot-circle' type='font-awesome-5' color={"#ccc"} paddingRight={10} size={15}/>
								}
								<Text style={{fontSize:16, fontWeight:'700', fontSize:20, color:'#666'}}>{notification.title} </Text>
							</View>
              <Text style={{fontSize:16, fontWeight:'400', color:'#666'}}>{notification.body}</Text>
            </View>
          )
        })
      )
    }else {
      return (
        <View style={{marginTop:20, flexDirection:'row', alignItems:'center'}}>
          <View style={{width:40, height:40, backgroundColor:'#ccc', borderRadius:100, marginRight:10}}></View>
          <Text style={{fontSize:16, fontWeight:'400', color:'#666',}}>You dont have any notifications.</Text>
        </View>
      )
    }
	}

  return (
    <View style={styles.header}>
			<ActionSheet defaultOverlayOpacity={0.60} containerStyle={{height:'95%', paddingTop:20}} ref={profileActionSheetRef} animated={true} gestureEnabled={true}>
				<Profile navigation={navigation} actionSheet={profileActionSheetRef}/>
			</ActionSheet>
      <ActionSheet ref={notificationsActionSheetRef} containerStyle={{height:'100%', paddingTop:20}} animated={true} gestureEnabled={false}>
        <View style={{padding:30}}>
          <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'baseline'}}>
            <Text style={{fontWeight:'bold', fontSize:20}}>Notifications</Text>
            <TouchableOpacity onPress={() => notificationsActionSheetRef.current?.hide()}>
              <Text style={{fontWeight:'500', fontSize:17, color:'#5CB8E4'}}>Hide</Text>
            </TouchableOpacity>
          </View>
          {
            <ScrollView contentInset={{bottom:40}} style={{marginVertical:20, height:'100%'}} id='notificationsActionSheet' refreshControl={
							<RefreshControl
								refreshing={notificationsLoading}
								onRefresh={() => {
									markReadNotifications().finally(() => {
										refreshNotifications()
									})
								}}
							/>
						}>
              <RenderNotifications/>
            </ScrollView>
          }
        </View>
      </ActionSheet>
			<View>
				<TouchableOpacity onPress={() => handleGoProfile()}>
						<UIAvatar/>
				</TouchableOpacity>
			</View>
			<View style={{justifyContent:'flex-end', flexDirection:'row', flex:1}}>
				{
					right ?
					<>
						<TouchableOpacity onPress={() => handleOpenNotifications()}>
								<Icon
								paddingHorizontal={10}
								type='ionicon'
								name='notifications-outline'
								size={23}
								color='#3201ff'
								/>
						</TouchableOpacity>
						<TouchableOpacity>
								<Icon
								paddingHorizontal={10}
								type='ionicon'
								name='information-circle-outline'
								size={25}
								color='#3201ff'
								/>
						</TouchableOpacity>
					</> : null
				}
			</View>
    </View>
  )
}

export default Header

const styles = StyleSheet.create({
	header: {
		paddingVertical:10,
		marginBottom:10,
		flexDirection: 'row',
		alignItems:'center'
	}
})