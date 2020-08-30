import React from 'react'
import { View, Text } from 'react-native'
// import TwitterButton from './views/Login'
import {NavigationContainer} from '@react-navigation/native';
import Nav from './navigation/Nav';
import { Provider } from './Context/UserContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Root } from 'native-base';

const App = () => {


  return (
      <NavigationContainer>
        <Provider>
          <SafeAreaProvider>
            <Root>
              <Nav />
            </Root>
          </SafeAreaProvider>
        </Provider>
      </NavigationContainer>
  )
}

export default App
