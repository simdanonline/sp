import React, {useContext} from 'react'
import { View, ActivityIndicator, Button } from 'react-native'
import { Context } from '../Context/UserContext'
import { useEffect } from 'react';
import Colors from '../Constants/Colors';

const UserLoader = () => {

    const {fetchMe, logOut} = useContext(Context);

    useEffect(() => {
        fetchMe();
    }, [])

    return (
        <View style={{flex:1, justifyContent:'center', alignItems:'center'}} >
            <ActivityIndicator color={Colors.appColor} size='large' />
            <Button title='Logout' onPress={logOut} />
        </View>
    )
}

export default UserLoader;
