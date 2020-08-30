import React, {useEffect, useContext} from 'react'
import { View, ActivityIndicator, FlatList, Text } from 'react-native'
import axios from 'axios';
import { Context } from "../Context/UserContext";
import { useState } from 'react';
import { Header } from 'react-native-elements';
import { Entypo } from '@expo/vector-icons';

const Tweets = ({navigation}) => {

    const {state:{tokens}, fetchTweets} = useContext(Context);

    const [tweets, setTweets] = useState([]);

    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        fetchTweets()
    }, [])


    if(isLoading){
        return <ActivityIndicator color='#ff0000' size='large' />
    }

    const ListHeader = () => {
        return (
            <View>
                <Header 
                    containerStyle={{backgroundColor: 'red'}}
                    centerComponent={<Text>Your scheduled tweets</Text>}
                    leftComponent={<Entypo name='menu' size={30} color='#fff' />}
                />
            </View>
        )
    }

    return (
        <View style={{paddingVertical:0}} >
            <FlatList 
                data={tweets}
                ListHeaderComponent={<ListHeader />}
                ListEmptyComponent={<ListHeader />}
                keyExtractor={(id) => id._id.toString()}
                renderItem={({item}) => {
                    return (
                        <View style={{paddingHorizontal:10, backgroundColor: 'skyblue', marginVertical:5, paddingVertical: 10}}>
                            <Text>Text: {item.tweet} </Text>
                        </View>
                    )
                }}
            />
        </View>
    )
}

export default Tweets;
