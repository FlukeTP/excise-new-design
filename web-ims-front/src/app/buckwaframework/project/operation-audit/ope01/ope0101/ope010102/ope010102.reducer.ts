import { Ope010102Store } from './ope010102.model';
import * as OPE010102ACTION from "./ope010102.action";

const INIT_DATA: Ope010102Store = {
    customerLicenseList:[]
};
function clearStore (state: Ope010102Store):Ope010102Store{
    let store:Ope010102Store = INIT_DATA;
    while(state.customerLicenseList.length > 0) {
        state.customerLicenseList.pop();
    }
    return store;
}


export function Ope010102Reducer(state: Ope010102Store = INIT_DATA, action: OPE010102ACTION.Actions){
    switch (action.type) {
        case OPE010102ACTION.UPDATE:
            return  Object.assign({},action.payload);
        case OPE010102ACTION.CLEAR:
            return state = clearStore(state);
        case OPE010102ACTION.REMOVE:
            return {
                customerLicenseList: state.customerLicenseList.filter(customerLicenseList => 
                    customerLicenseList.oaCuslicenseId !== action.payload.oaCuslicenseId)
            }
        default:
            return state;
    }

}