import { Image } from 'react-native'
import { AuthContext } from '../components/context'
import React, { useContext, useEffect, useState } from 'react'

const UIAvatar = () => {

	const { getUser } = useContext(AuthContext)
  const [user, setUser] = useState({})

	useEffect(() => {
    getUser().then(r => {
			setUser(JSON.parse(r))
		})
	}, [])
	

  return (
    <Image source={{
        uri: "https://ui-avatars.com/api/?name=" + user.name + "&bold=true&color=fff&rounded=true&size=128&background=A66CFF&",
        width: 30,
        height: 30
      }}/>
  )
}

export default UIAvatar