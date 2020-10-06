
export const reducers = {
    formSearch: FormSearchReducer,
};


import * as OP07ACTOIN from "./ope07.action";
import { FormSearch } from './ope07.model';


const INIT_FORMSEARCH: FormSearch = {
    taxType: '',
    checkType: '',
    budgetYear: '',
    monthStart: '',
    monthEnd: '',
    previousYear: '',
    newRegId: '',
    cusFullname: '',
    monthNum: 0,
    facFullname: ''
};
export function FormSearchReducer(state: FormSearch = INIT_FORMSEARCH, action: OP07ACTOIN.Actions) {
    switch (action.type) {
        case OP07ACTOIN.ADD_FORM:
            return Object.assign({}, action.payload);
        case OP07ACTOIN.REMOVE_FORM:
            return INIT_FORMSEARCH;
        default:
            return state;
    }
}
