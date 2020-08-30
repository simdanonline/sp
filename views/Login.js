import React, { useCallback, useState, useContext } from "react";
import * as AuthSession from "expo-auth-session";
import {
  ActivityIndicator,
  Button,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  ImageBackground
} from "react-native";
import axios from 'axios';
import { Context } from "../Context/UserContext";
import Colors from "../Constants/Colors";

const requestTokenURL = "https://simdanpost.herokuapp.com/request-token";
const accessTokenURL = "https://simdanpost.herokuapp.com/at";




const redirect = AuthSession.makeRedirectUri({useProxy:true});
// This is the callback or redirect URL you need to whitelist in your Twitter app
const {width, height} = Dimensions.get('window')

export default function TwitterButton() {

  const [username, setUsername] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  const {storeTokens} = useContext(Context)



  const onLogin = useCallback(async () => {
    setLoading(true);

    try {
      const requestParams = toQueryString({ callback_url: redirect });
      const requestTokens = await fetch(
        requestTokenURL + requestParams
      ).then((res) => res.json());

      // console.log("Request tokens fetched!", requestTokens);

      // Step #2 - after we received the request tokens, we can start the auth session flow using these tokens
      const authResponse = await AuthSession.startAsync({
        authUrl:
          "https://api.twitter.com/oauth/authenticate" +
          toQueryString(requestTokens),
      });

      // console.log("Auth response received!", authResponse);

      // Validate if the auth session response is successful
      // Note, we still receive a `authResponse.type = 'success'`, thats why we need to check on the params itself
      if (authResponse.params && authResponse.params.denied) {
        return setError("AuthSession failed, user did not authorize the app");
      }

      // Step #3 - when the user (successfully) authorized the app, we will receive a verification code.
      // With this code we can request an access token and finish the auth flow.
      const accessParams = toQueryString({
        oauth_token: requestTokens.oauth_token,
        oauth_token_secret: requestTokens.oauth_token_secret,
        oauth_verifier: authResponse.params.oauth_verifier,
      });

      const response = await axios.get(`${accessTokenURL+accessParams}`)

      const accessTokens = response.data;


      // Now let's store the username in our state to render it.
      // You might want to store the `oauth_token` and `oauth_token_secret` for future use.
      setUsername(accessTokens.screen_name);
      // const user = await getUser(accessTokens);
      // console.log(user)
      storeTokens(accessTokens)
    } catch (error) {
      console.log("Something went wrong...", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);


  return (
    <View style={styles.container}>
      <ImageBackground 
        source={require('../assets/bg.jpg')}
        style={styles.coverImage}
        imageStyle={styles.image}
        
      >

    
      <Text style={styles.topText} >Welcome!</Text>
      <Text style={styles.topTextTwo}>Let's get your tweet up at the right time</Text>
        <View>
          <TouchableOpacity
            onPress={onLogin}
            style={{backgroundColor:Colors.appColor, paddingHorizontal:25, paddingVertical:15, borderRadius:30, alignSelf:'center'}}
          >
            <Text>Login with Twitter</Text>
          </TouchableOpacity>
        </View>

      {error !== undefined && <Text style={styles.error}>Error: {error}</Text>}

      {loading && (
        <View style={[StyleSheet.absoluteFill, styles.loading]}>
          <ActivityIndicator color="#fff" size="large" animating />
        </View>
      )}
      </ImageBackground>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  loading: {
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    textAlign: "center",
    marginTop: 40,
  },
  error: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 40,
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    width,
  },
  coverImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    width,
    opacity: 1,
    backgroundColor: 'rgba(0,0,0, .8)'
  },
  topText: {
    color: '#fff', 
    fontSize:40, 
    position:'absolute', 
    top: width / 4, 
    textAlign:'center', 
    width
  },
  topTextTwo: {
    color: '#fff', 
    fontSize: 20,
    position:'absolute', 
    top: width / 3 + 20, 
    textAlign:'center', 
    width
  }
});

/**
 * Converts an object to a query string.
 */
function toQueryString(params) {
  return (
    "?" +
    Object.entries(params)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
      )
      .join("&")
  );
}