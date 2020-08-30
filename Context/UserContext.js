import createDataContext from "./createDataContext";
import AsyncStorage from '@react-native-community/async-storage';
import appApi from "../api/appApi";


const userReducer = (state = initialState, action) => {
    switch (action.type) {
    case "AUTH":
        return { ...state, tokens: action.payload };
    case "LOGOUT":
        return {  };
    case "ME":
        return {...state, user: action.payload};
    case "FETCH_TWEETS":
        return {...state, tweets: action.payload};
      default:
        return state;
    }
};

const AutoLogin = dispatch => async () => {

    try {
        const token = await AsyncStorage.getItem('usertoken');
        if(token){
            dispatch({
                type: "AUTH",
                payload: token
            })
        }
    } catch (error) {
        
    }
}

const storeTokens = dispatch => async(token, user) => {


    try {

        const response = await appApi.post('/verify', {oauth_token: token.oauth_token, oauth_verifier: token.oauth_token_secret, token})

        const jsonValue = JSON.stringify(token);

        dispatch({
            type: "ME",
            payload: response.data.user
        });


        await AsyncStorage.setItem('tokens', jsonValue);

        await AsyncStorage.setItem('usertoken', response.data.authtoken)

        dispatch({
            type: "AUTH",
            payload: token
        });


    } catch (error) {
        
    }
    
};

const logOut = dispatch => async() => {

    try {
        const token = await AsyncStorage.getItem('usertoken');
        await AsyncStorage.removeItem('tokens');
        await AsyncStorage.removeItem('usertoken');
        dispatch({
            type: "LOGOUT"
        })
    } catch (error) {
        
    }
};

const fetchMe = dispatch => async() => {

    try {
        const token = await AsyncStorage.getItem('usertoken');
        const response = await appApi.get('/me', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        dispatch({
            type: "ME",
            payload: response.data
        })
    } catch (error) {
        
    }
}

const fetchTweets = dispatch => async () => {

    try {
        const token = await AsyncStorage.getItem('usertoken');
        const response = await appApi.get('/mytweets', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        dispatch({
            type: "FETCH_TWEETS",
            payload: response.data
        });

    } catch (error) {
        
    }
}

const postTweet = dispatch => async (data) => {

    try {
        const token = await AsyncStorage.getItem('usertoken');
        const response = await appApi.post('/newtweet', data, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        dispatch({
            type: "FETCH_TWEETS",
            payload: response.data
        });
    } catch (error) {
        
    }
}

export const { Provider, Context } = createDataContext(
    userReducer,
    {
        storeTokens,
        AutoLogin,
        logOut,
        fetchTweets,
        fetchMe,
        postTweet
    },
    {}
  );