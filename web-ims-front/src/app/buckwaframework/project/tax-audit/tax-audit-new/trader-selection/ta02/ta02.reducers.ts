export const reducers = {
    opa_dtl: Ta02Reducer
};

import * as TA02ACTION from "./ta02.action";
import { OparaterDTL } from './ta02.model';

const INIT_DATA: OparaterDTL = {
    dutyGroupId: ''
};

export function Ta02Reducer(state: OparaterDTL = INIT_DATA, action: TA02ACTION.Actions) {
    switch (action.type) {
        case TA02ACTION.ADD_OPARATER_DTL:
            return Object.assign({}, action.payload);
        case TA02ACTION.REMOVE_OPARATER_DTL:
            return INIT_DATA;
        default:
            return state;
    }
}