import { Ope020103Vo, Ope020103Store } from './ope020103.model';
import * as OPE020103ACTION from "./ope020103.action";

const INIT_DATA: Ope020103Store = {
    // wsUserId:null,
    // userThaiId:"",
    // userThaiName:"",
    // userThaiSurname:"",
    // userEngName:"",
    // userEngSurname:"",
    // title:"",
    // officeId:"",
    // accessAttr:"",
    // officeCode:"",
	// userId:"",
    auditer:[] = []


};

function clearStore (state: Ope020103Store):Ope020103Store{
    let store:Ope020103Store = INIT_DATA;
    while(state.auditer.length > 0) {
        state.auditer.pop();
    }
    return store;
}


export function Ope020103Reducer(state: Ope020103Store = INIT_DATA, action: OPE020103ACTION.Actions){
    switch (action.type) {
        case OPE020103ACTION.UPDATE:
            return  Object.assign({},action.payload);
        case OPE020103ACTION.CLEAR:
            return state = clearStore(state);
        case OPE020103ACTION.REMOVE:
            return  {
                auditer: state.auditer.filter(auditer => 
                    auditer.wsUserId !== action.payload.wsUserId)
            }
        default:
            return state;
    }

}
