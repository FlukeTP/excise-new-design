import { NOTIFY } from '../actions/index';
import _ from 'lodash';

let notifyDetailList = [];
export default function (state = notifyDetailList, action) {
    switch (action.type) {
        case NOTIFY.ADD_NOTIFY_DETAILS:
            let addState = _.clone(state);
            addState.push(action.payload);
            return addState;
        case NOTIFY.SET_NOTIFY_DETAILS:
            let setState = _.clone(state);
            setState = action.payload;
            return setState;
        case NOTIFY.UPDATE_NOTIFY_DETAILS:
            const { type, data } = action.payload;
            let updateState = _.clone(state);
            updateState[type] = data;
            return updateState;
        default:
            return state;
    }
}