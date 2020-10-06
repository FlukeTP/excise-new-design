import { NOTIFY } from '../actions/index';
import _ from 'lodash';

let notifyCounts = {
    "PROCESS_PLAN_COMPLETED": {
        index: 0,
        routeName: 'Filter',
        title: `ข้อมูลการคัดกรอง`,
        icon: 'tags',
        countType: 0
    },
    "OTHER_1": {
        index: 1,
        routeName: 'Recruit',
        title: `คัดเลือกราย`,
        icon: 'signal',
        countType: 0
    },
    "PROCESS_CHECKOUT": {
        index: 2,
        routeName: 'Checkout',
        title: `การออกตรวจ`,
        icon: 'calendar',
        countNotify: 0
    },
    "OTHER_3": {
        index: 3,
        routeName: 'Plan',
        title: `แผนประจำปี`,
        icon: 'columns',
        countNotify: 0
    },
}
export default function (state = notifyCounts, action) {
    switch (action.type) {
        case NOTIFY.SET_NOTIFY_COUNTS:
            let setState = _.clone(state);
            setState = action.payload;
            return setState;
        case NOTIFY.UPDATE_NOTIFY_COUNTS:
            const { type, data } = action.payload;
            let updateState = _.clone(state);
            updateState[type] = data;
            return updateState;
        default:
            return state;
    }
}