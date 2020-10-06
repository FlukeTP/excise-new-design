import { NOTIFY } from '../actions/index';
import _ from 'lodash';

let notifyDetailList = [];
export default function (state = notifyDetailList, action) {
    switch (action.type) {
        case NOTIFY.SET_NOTIFY_DETAIL_LIST:
            let setState = _.clone(state);
            setState = action.payload;
            return setState;
        case NOTIFY.SET_NOTIFY_DETAIL_LIST:
            const { index, data } = action.payload;
            let updateState = _.clone(state);
            updateState[index] = data;
            return updateState;
        default:
            return state;
    }
}