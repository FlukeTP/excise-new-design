export const reducers = {
    Ta020202: Ta020202Reducer
};

import * as TA020202ACTION from "./ta020202.action";
import { Ta020202 } from './ta020202.model';

const INIT_DATA: Ta020202 = {
    monthIncType: 'TAX',
    yearIncType: 'TAX',
    yearNum: '1',
    anaResultText1: '',
    anaResultText2: '',
    anaResultText3: '',
    anaResultText4: '',
    anaResultText5: '',
    anaResultText6: '',
    anaResultText7: '',
    anaResultText8: ''
};

export function Ta020202Reducer(state: Ta020202 = INIT_DATA, action: TA020202ACTION.Actions) {
    switch (action.type) {
        case TA020202ACTION.ADD_TA020202:
            return Object.assign({}, action.payload);
        case TA020202ACTION.REMOVE_TA020202:
            return INIT_DATA;
        default:
            return state;
    }
}