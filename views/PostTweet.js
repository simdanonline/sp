import React, {useState, useRef, useContext} from 'react';
import { View, TouchableOpacity, Image, Dimensions, Text } from 'react-native';
import { Form, Item, Input, Label, Button, Toast, DatePicker } from "native-base";
import * as ImagePicker from "expo-image-picker";
import { Video } from "expo-av";
import {MaterialIcons} from '@expo/vector-icons';
import { Context } from '../Context/UserContext';

const { width } = Dimensions.get("window");


const PostTweet = () => {
  const [tweet, setTweet] = useState("");
  const [mediaURI, setMediaURI] = useState("");
  const [shouldPlay, setShouldPlay] = useState(true);
  const [tweeting, setTweeting] = useState(false);
  const [date, setPostDate] = useState(new Date());

  const { postTweet } = useContext(Context)

  const videoRef = useRef();

  const _pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 4],
        quality: 1,
      });
      if (!result.cancelled) {
        setMediaURI(result);
        console.log(result);
      }

      console.log(result);
    } catch (E) {
      console.log(E);
    }
  };

  const makeTweet = async () => {
    try {
      setTweeting(true);
      const formdata = new FormData();
      formdata.append("twit", tweet);
      formdata.append("token", tokens.oauth_token);
      formdata.append("tokenSecret", tokens.oauth_token_secret);
      formdata.append('date', new Date(date).toUTCString())

      if (mediaURI) {
        formdata.append("file", {
          type: "application/octet-stream",
          uri: mediaURI.uri,
          name: mediaURI.uri.substring(mediaURI.uri.length - 10),
        });
      }
      // {twit: tweet, token: tokens.oauth_token, tokenSecret: tokens.oauth_token_secret}
      // console.log(formdata)

      await postTweet(formdata);
      Toast.show({
          type: 'success',
          text: 'Tweet sent successful'
      });
      setTweet('');
      setMediaURI('')
      setTweeting(false);
    } catch (error) {
        setTweeting(false);
        Toast.show({
            type: 'danger',
            text: 'Something went wrong, try again'
        })
    }
    };
    return (
        <View>
            <View style={{paddingHorizontal: 20}} >
            <Form>
                <Item floatingLabel>
                <Label>Tweet</Label>
                <Input value={tweet} onChangeText={setTweet} />
                </Item>

                <View style={{ marginTop: 20 }} />

                <TouchableOpacity
                onPress={_pickImage}
                style={{ paddingVertical: 10 }}
                >
                    <MaterialIcons name='perm-media' size={30} />
                    <Text style={{  }}>Select attachment</Text>
                </TouchableOpacity>

                <DatePicker
                minimumDate={new Date()}
                defaultDate={new Date()}
                androidMode={'spinner'}
                locale={"en"}
                timeZoneOffsetInMinutes={undefined}
                modalTransparent={false}
                animationType={"fade"}
                placeHolderText="Select date"
                textStyle={{ color: "green" }}
                placeHolderTextStyle={{ color: "#d3d3d3" }}
                onDateChange={(d) => setPostDate(d)}
                disabled={false}
                />

                <Button
                onPress={makeTweet}
                bordered
                style={{
                    alignSelf: "center",
                    paddingHorizontal: 20,
                    marginTop: 20,
                }}
                >
                <Text>{tweeting ? "Sending tweet" : "Tweet"}</Text>
                </Button>
            </Form>
            </View>

            <View style={{marginTop: 20}} />

            {mediaURI.type === "video" ? (
            <View>
                <TouchableOpacity
                    onPress={() => {
                        setShouldPlay(!shouldPlay)
                    }}
                    activeOpacity={.8}
                >
                    <Video
                    ref={videoRef}
                    source={{ uri: mediaURI.uri }}
                    rate={1.0}
                    volume={1}
                    isMuted={false}
                    resizeMode="cover"
                    shouldPlay={shouldPlay}
                    isLooping
                    style={{ width, height: 300 }}
                    />
                </TouchableOpacity>
                <View
                style={{ flexDirection: "row", justifyContent: "space-around" }}
                >
                <TouchableOpacity
                    onPress={() => {
                    videoRef.current.playAsync();
                    }}
                    style={{
                    padding: 20,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "red",
                    width: width / 2,
                    }}
                >
                    <Text>PLAY</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => {
                    videoRef.current.pauseAsync();
                    }}
                    style={{
                    padding: 20,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "red",
                    width: width/2
                    }}
                >
                    <Text>PAUSE</Text>
                </TouchableOpacity>
                </View>
            </View>
            ) : (
            <Image
                source={{ uri: mediaURI.uri }}
                style={{ width, height: width, resizeMode:'stretch' }}
            />
            )}
        </View>
    )
}

export default PostTweet
