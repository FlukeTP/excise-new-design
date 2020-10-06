import React from 'react';
import { createStackNavigator } from "react-navigation";
import { LoginScreen } from '../screens/index';

export default createStackNavigator(
    {
        Login: { screen: LoginScreen }
    },
    {
        initialRouteName: 'Login',
        headerMode: 'none'
    }
);