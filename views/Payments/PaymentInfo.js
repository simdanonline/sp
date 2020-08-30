import React from 'react'
import { View, Button } from 'react-native'

const PaymentInfo = ({navigation}) => {
    return (
        <View>
            <Button title='PAY' onPress={() => {navigation.navigate('subpay')}} />
        </View>
    )
}

export default PaymentInfo
