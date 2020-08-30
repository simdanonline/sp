import React, {useContext} from 'react';
import { Context } from '../Context/UserContext';
import Home from '../views/Home';
// import TwitterButton from '../views/Login';
import { useEffect } from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
// import Tweets from '../views/Tweets';
// import UserLoader from '../components/UserLoader';
import { createStackNavigator } from '@react-navigation/stack';
// import PostTweet from '../views/PostTweet';
import { Text } from 'react-native';
// import Payment from '../views/Payments/Payment';
// import PaymentInfo from '../views/Payments/PaymentInfo';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function CustomDrawerContent(props) {
    const {state:{tokens}, logOut} = useContext(Context);
    return (
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
        <DrawerItem
          label="Log out"
          onPress={() => {logOut()}}
        />
      </DrawerContentScrollView>
    );
}

const HomeStack = () => (
    <Stack.Navigator>
        <Stack.Screen component={Home} name='home' options={{headerShown: false}} />
        {/* <Stack.Screen component={PostTweet} name='postTweet' options={{title: 'Post tweet'}} /> */}
    </Stack.Navigator>
)

// const PayStack = () => (
//     <Stack.Navigator>
//         <Stack.Screen name='subInfo' component={PaymentInfo} />
//         <Stack.Screen name='subpay' component={Payment} />
//     </Stack.Navigator>
// )

const AppDrawer = () => {
    return (
        <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />} >
            <Drawer.Screen name='homeDrawer' component={HomeStack} />
            {/* <Drawer.Screen name='tweets' component={Tweets} /> */}
            {/* <Drawer.Screen name='Subscription' component={PayStack} /> */}
        </Drawer.Navigator>
    )
}

const Nav = () => {


    const {state:{tokens, user}, AutoLogin} = useContext(Context);

    useEffect(() => {
        AutoLogin()
    }, []);

    let Rendered = <Text>LOGIN </Text>

    if(tokens){
        Rendered = <Text >LOAD </Text>
    }

    if(user){
        Rendered = <AppDrawer />
    }

    return (
        <>
            {Rendered}
        </>
    )
}

export default Nav
