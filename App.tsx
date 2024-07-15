import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React, {useEffect, useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {LoginScreen} from './src/infrastructure/ui/screens/login_screen.tsx';
import {RegisterScreen} from './src/infrastructure/ui/screens/register_screen.tsx';
import {HomeScreen} from './src/infrastructure/ui/screens/home_screen.tsx';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {Provider} from 'react-redux';
import store from './src/infrastructure/redux/store/store.ts';
import SplashScreen from './src/infrastructure/ui/screens/splash_screen.tsx';

// import {decode, encode} from 'base-64'
// if (!global.btoa) {  global.btoa = encode }
// if (!global.atob) { global.atob = decode }

export type RootStackParamList = {
  SplashScreen: undefined;
  Login: undefined;
  Register: undefined;
  Home: undefined;
};

export type SplashScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'SplashScreen'
>;

export type LoginScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Login'
>;
export type RegisterScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Register'
>;
export type HomeScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Home'
>;

const Stack = createStackNavigator<RootStackParamList>();

export const App = () => {
  return (
    <NavigationContainer>
      <Provider store={store}>
        <Stack.Navigator initialRouteName="SplashScreen">
          <Stack.Screen
            name="SplashScreen"
            component={SplashScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{headerShown: false}}
          />
        </Stack.Navigator>
      </Provider>
    </NavigationContainer>
  );
};
