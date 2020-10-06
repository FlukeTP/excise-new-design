import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

import allReducers from './reducers/index';

// Configuration
export default function configStore() {
    const middleWare = compose(
        applyMiddleware(thunk),
        applyMiddleware(logger)
    );
    return createStore(allReducers, middleWare);
}