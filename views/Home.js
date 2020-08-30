import React, { useContext, useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from "react-native";
import { Context } from "../Context/UserContext";
import { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "react-native-elements";
import { Entypo, AntDesign } from "@expo/vector-icons";
import Colors from "../Constants/Colors";
// import PostTweet from "./PostTweet";

const { width } = Dimensions.get("window");

const Home = ({ navigation }) => {
  const {
    state: { tokens, user, tweets },
    fetchTweets,
  } = useContext(Context);

  useEffect(() => {
    fetchTweets();
  }, []);

  const combineDateAndTime = (date, time) => {
    timeString = time.getHours() + ":" + time.getMinutes() + ":00";

    var year = date.getFullYear();
    var month = date.getMonth() + 1; // Jan is 0, dec is 11
    var day = date.getDate();
    var dateString = "" + year + "-" + month + "-" + day;
    var combined = new Date(dateString + " " + timeString);

    return combined;
  };

  const MyHeader = () => (
    <Header
      containerStyle={{ backgroundColor: Colors.appColor }}
      centerComponent={<Text>Home</Text>}
      leftComponent={
        <Entypo name="menu" size={30} onPress={() => navigation.openDrawer()} />
      }
    />
  );

  if (!user) {
    return (
      <View>
        <MyHeader />
        <ActivityIndicator />
      </View>
    );
  }

  let imgURl = user.picture;
  if (user.picture) {
    imgURl = user.picture.replace("_normal", "");
  }

  var myDate = new Date();
  var hrs = myDate.getHours();
  var greet;

  if (hrs < 12) greet = "Good Morning";
  else if (hrs >= 12 && hrs <= 17) greet = "Good Afternoon";
  else if (hrs >= 17 && hrs <= 24) greet = "Good Evening";

  const ListHeader = () => (
    <View>
      <MyHeader />

      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          marginTop: 15,
        }}
      >
        <Image
          source={{ uri: imgURl }}
          style={{ width: 200, height: 200, borderRadius: 200 }}
        />
        <View style={{ padding: 20 }}>
          <Text>
            <Text style={{ fontSize: 20 }}>{greet}, </Text>
            {user.name}
          </Text>
        </View>
      </View>
    </View>
  );

  const ListEmpty = () => (
    <View style={{ justifyContent: "center", alignItems: "center" }}>
      <Entypo name="inbox" color="red" size={120} />
      <Text>You don't have any tweet here</Text>
      <TouchableOpacity
        style={{
          borderWidth: 0.5,
          flexDirection: "row",
          alignItems: "center",
          justifyContent:'space-around',
          marginTop: 20,
          borderRadius: 50
        }}
        onPress={() => navigation.navigate('postTweet')}
      >
        <Text style={{padding: 15}}>Post a tweet</Text>
        <AntDesign name="twitter" color={"#1DA1F2"} style={{paddingHorizontal: 15, paddingVertical: 10}} />
      </TouchableOpacity>
    </View>
  );
  return (
    <SafeAreaView>
      <FlatList
        ListHeaderComponent={<ListHeader />}
        ListEmptyComponent={<ListEmpty />}
        data={tweets}
      />
    </SafeAreaView>
  );
};

export default Home;
