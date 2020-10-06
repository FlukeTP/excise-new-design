import React from 'react';
import { Dimensions } from 'react-native';
import { createDrawerNavigator, createStackNavigator } from "react-navigation";
import {
    HomeScreen,
    FilterScreen, FilterDetailScreen,
    PlanScreen, PlanDetailScreen,
    CheckoutScreen, CheckoutDetailScreen
} from '../screens/index';
import { SideBar } from "../components/index";

const { width } = Dimensions.get('window');

const FilterStack = createStackNavigator(
    {
        Filter: { screen: FilterScreen },
        FilterDetail: { screen: FilterDetailScreen }
    },
    {
        initialRouteName: 'Filter',
        headerMode: 'none'
    }
)

const PlanStack = createStackNavigator(
    {
        Plan: { screen: PlanScreen },
        PlanDetail: { screen: PlanDetailScreen }
    },
    {
        initialRouteName: 'Plan',
        headerMode: 'none'
    }
)

const CheckoutStack = createStackNavigator(
    {
        Checkout: { screen: CheckoutScreen },
        CheckoutDetail: { screen: CheckoutDetailScreen }
    },
    {
        initialRouteName: 'Checkout',
        headerMode: 'none'
    }
)

export default createDrawerNavigator(
    {
        Home: { screen: HomeScreen },
        Filter: { screen: FilterStack },
        Plan: { screen: PlanStack },
        Checkout: { screen: CheckoutStack },
    },
    {
        initialRouteName: 'Home',
        contentComponent: SideBar,
        drawerWidth: width - 70,
        headerMode: 'none'
    }
);