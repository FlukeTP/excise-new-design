import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import { Provider } from 'react-redux';

// Other Sources
import App from './src/App';
import { name as appName } from './app.json';
import configStore from './src/store/store';

const store = configStore();

class AppWithStore extends Component {
    render() {
        return (
            <Provider store={store}>
                <App />
            </Provider>
        )
    }
}

AppRegistry.registerComponent(appName, () => AppWithStore);
