import { Ope020102Vo, Ope0201001Vo, Ope020102Store } from './ope020102.model';
import * as OPE020102ACTION from "./ope020102.action";


const INIT_DATA: Ope020102Store = {
    customerLicenseList:[]

};
function clearStore (state: Ope020102Store):Ope020102Store{
    let store:Ope020102Store = INIT_DATA;
    while(state.customerLicenseList.length > 0) {
        state.customerLicenseList.pop();
    }
    return store;
}


export function Ope020102Reducer(state: Ope020102Store = INIT_DATA, action: OPE020102ACTION.Actions){
    switch (action.type) {
        case OPE020102ACTION.UPDATE:
            return  Object.assign({},action.payload);
        case OPE020102ACTION.CLEAR:
            return state = clearStore(state);
        case OPE020102ACTION.REMOVE:
            return {
                customerLicenseList: state.customerLicenseList.filter(customerLicenseList => 
                    customerLicenseList.oaCuslicenseId !== action.payload.oaCuslicenseId)
            }
        default:
            return state;
    }

}