import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

// Reducers
import userReducer from './userReducer';
import notifyCountReducer from './notifyCountReducer';
import notifyDetailReducer from './notifyDetailReducer';
import notifyDetailListReducer from './notifyDetailListReducer';

// Combine all reducers
const allReducers = combineReducers({
    user: userReducer,
    notifyCounts: notifyCountReducer,
    notifyDetails: notifyDetailReducer,
    notifyDetailList: notifyDetailListReducer,
    form: formReducer,
});
export default allReducers;