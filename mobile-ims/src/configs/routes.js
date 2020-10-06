import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { AuthLoadingScreen } from '../screens/index';
import AppStack from './authed';
import AuthStack from './unauthed';

export default createAppContainer(createSwitchNavigator(
    {
        AuthLoading: AuthLoadingScreen,
        App: AppStack,
        Auth: AuthStack
    },
    {
        initialRouteName: 'AuthLoading',
    }
));