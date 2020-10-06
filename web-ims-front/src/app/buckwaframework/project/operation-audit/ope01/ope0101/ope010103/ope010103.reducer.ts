import { Ope010103Store } from './ope010103.model';
import * as OPE010103ACTION from "./ope010103.action";
const INIT_DATA: Ope010103Store = {

    auditer:[] = []


};

function clearStore (state: Ope010103Store):Ope010103Store{
    let store:Ope010103Store = INIT_DATA;
    while(state.auditer.length > 0) {
        state.auditer.pop();
    }
    return store;
}


export function Ope010103Reducer(state: Ope010103Store = INIT_DATA, action: OPE010103ACTION.Actions){
    switch (action.type) {
        case OPE010103ACTION.UPDATE:
            return  Object.assign({},action.payload);
        case OPE010103ACTION.CLEAR:
            return state = clearStore(state);
        case OPE010103ACTION.REMOVE:
            return  {
                auditer: state.auditer.filter(auditer => 
                    auditer.wsUserId !== action.payload.wsUserId)
            }
        default:
            return state;
    }

}
