import { View, Text, TouchableOpacity, Image, Alert, ScrollView, StyleSheet } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../components/context'
import Loader from '../components/Loader'
import UIAvatar from '../components/UIAvatar'
import { Icon } from '@rneui/base'
import { List } from 'react-native-paper'

const Profile = ({navigation, actionSheet}) => {

	const [signOutLoading, setSignOutLoading] = useState(false)
	const { signOut, getUser } = useContext(AuthContext)
	const [user, setUser] = useState({});

	useEffect(() => {
	  getUser().then(r => {
			setUser(JSON.parse(r))
		})
	}, [])

	const handleSignOut = () => {
		Alert.alert("Are you sure?", "Are you sure do you want to sign out?", [
			{
				text:'Cancel',
				style: 'destructive',
				onPress: () => {}
			},
			{
				text: 'Sign Out',
				style: 'default',
				onPress: () => {
					setSignOutLoading(true)
					setTimeout(() => {
						setSignOutLoading(false)
						signOut()
					}, 2000)
				}
			},
		])
	}

  return (
    <View style={styles.container}>
			<Loader animating={signOutLoading}/>
			<View style={styles.header}>
				<UIAvatar/>
				<Text style={{fontWeight:'bold', fontSize:20, color:'#666'}}>{user.name}</Text>
				<TouchableOpacity onPress={() => handleSignOut()}>
					<Icon name='logout' size={20} color={"#3201ff"} type='ant-design'/>
				</TouchableOpacity>
			</View>
			<View style={styles.contentContainer}>
				<List.Item
					style={{padding:0}}
					title="General"
					description="General Settings"
					onPress={() => {
						navigation.navigate("GeneralSettings")
						actionSheet.current?.hide()
					}}
					left={props => <List.Icon {...props} icon="cog" color='#A66CFF' />}
				/>
				<List.Item
					style={{padding:0}}
					title="Notifications"
					description="Notifications Settings"
					onPress={() => {
						navigation.navigate("NotificationSettings")
						actionSheet.current?.hide()
					}}
					left={props => <List.Icon {...props} icon="bell" color='#A66CFF' />}
				/>
				<List.Item
					style={{padding:0}}
					title="Security"
					description="Security Settings"
					onPress={() => {
						navigation.navigate("SecuritySettings")
						actionSheet.current?.hide()
					}}
					left={props => <List.Icon {...props} icon="security" color='#A66CFF' />}
				/>
				<List.Item
					style={{padding:0}}
					title="Help"
					description="Help Center"
					onPress={() => {
						navigation.navigate("Help")
						actionSheet.current?.hide()
					}}
					left={props => <List.Icon {...props} icon="help-circle" color='#A66CFF' />}
				/>
			</View>
    </View>
  )
}

export default Profile

const styles = StyleSheet.create({
	container: {
		paddingVertical:30
	},
	header: {
		paddingHorizontal:30,
		flexDirection:'row',
		alignItems:'center',
		justifyContent:'space-between'
	},
	contentContainer: {
		paddingHorizontal:25,
		paddingVertical: 40,
		height:'100%'
	}
});