import { Ope0201 } from './ope0201Vo.model';
import * as OPE0201ACTION from "./ope0201.action";

const INIT_DATA: Ope0201 = {
    auditStartDate:null,
    auditEndDate:null,
    auditYear:""

};


export function Ope0201Reducer(state: Ope0201 = INIT_DATA, action: OPE0201ACTION.Actions){
    switch (action.type) {
        case OPE0201ACTION.UPDATE:
            return  Object.assign({},action.payload);
        case OPE0201ACTION.CLEAR:
            return state = INIT_DATA;
        default:
            return state;
    }
}