
export const reducers = {
    ta0301: Ta0301Reducer,
    listFormTsNumber: ListFormTsNumberReducer,
    pathTsSelectReducer: PathTsSelectReducer,
    proviceList: ProvinceListReducer,
    amphurList: AmphurListReducer,
    districtList: DistrictListReducer,
    dataCusTa: dataCusTaReducer
};

import * as TA0301ACTION from "./ta0301.action";
import { Ta0301, ListFormTsNumber, PathTsSelect, ProvinceList, AmphurList, DistrictList, DataCusTa} from './ta0301.model';

const INIT_DATA: Ta0301 = {
    formTsNumber: '',
    pathTs: ''
};

const LIST_FORMTSNUMBER: ListFormTsNumber = {
    listFormTsNumber: []
};

const PATH_TS_SELECT: PathTsSelect = {
    docType: '',
    topic: '',
}


const PROVINCE_LIST: ProvinceList[] = [
    // {
    //     provinceId: null,
    //     geoId: null,
    //     provinceCode: "",
    //     provinceName: ""
    // }
]

const AMPHUR_LIST: AmphurList[] = [
    // {
    //     amphurCode: "",
    //     amphurId: null,
    //     amphurName: "",
    //     geoId: null,
    //     provinceId: null
    // }
]

const DISTRICT_LIST: DistrictList[] = [
    // {
    //     amphurId: null,
    //     districtCode: "",
    //     districtId: null,
    //     districtName: "",
    //     geoId: null,
    //     provinceId: null
    // }
]

const INIT_DATA_DATACUS: DataCusTa = {
    newRegId: '',
    planNumber: ''
};



export function Ta0301Reducer(state: Ta0301 = INIT_DATA, action: TA0301ACTION.Actions) {
    switch (action.type) {
        case TA0301ACTION.ADD:
            return Object.assign({}, action.payload);
        case TA0301ACTION.REMOVE:
            return INIT_DATA;
        default:
            return state;
    }
}

export function ListFormTsNumberReducer(state: ListFormTsNumber = LIST_FORMTSNUMBER, action: TA0301ACTION.Actions) {
    switch (action.type) {
        case TA0301ACTION.ADD_LIST_FORM_TSNUMBER:
            return Object.assign({}, action.payload);
        case TA0301ACTION.REMOVE_LIST_FORM_TSNUMBER:
            return INIT_DATA;
        default:
            return state;
    }
}

export function PathTsSelectReducer(state: PathTsSelect = PATH_TS_SELECT, action: TA0301ACTION.Actions) {
    switch (action.type) {
        case TA0301ACTION.ADD_PATH_TS_SELECT:
            return Object.assign({}, action.payload);
        case TA0301ACTION.REMOVE_PATH_TS_SELECT:
            return INIT_DATA;
        default:
            return state;
    }
}

export function ProvinceListReducer(state: ProvinceList[] = PROVINCE_LIST, action: TA0301ACTION.Actions) {
    switch (action.type) {
        case TA0301ACTION.ADD_PROVINCE_LIST:
            return Object.assign([], action.payload);
        case TA0301ACTION.REMOVE_PROVINCE_LIST:
            return PROVINCE_LIST;
        default:
            return state;
    }
}

export function AmphurListReducer(state: AmphurList[] = AMPHUR_LIST, action: TA0301ACTION.Actions) {
    switch (action.type) {
        case TA0301ACTION.ADD_AMPHUR_LIST:
            return Object.assign([], action.payload);
        case TA0301ACTION.REMOVE_AMPHUR_LIST:
            return AMPHUR_LIST;
        default:
            return state;
    }
}

export function DistrictListReducer(state: DistrictList[] = DISTRICT_LIST, action: TA0301ACTION.Actions) {
    switch (action.type) {
        case TA0301ACTION.ADD_DISTRICT_LIST:
            return Object.assign([], action.payload);
        case TA0301ACTION.REMOVE_DISTRICT_LIST:
            return DISTRICT_LIST;
        default:
            return state;
    }
}


export function dataCusTaReducer(state: DataCusTa = INIT_DATA_DATACUS, action: TA0301ACTION.Actions) {
    switch (action.type) {
        case TA0301ACTION.ADD_DATA_CUS:
            return Object.assign({}, action.payload);
        case TA0301ACTION.REMOVE_DATA_CUS:
            return INIT_DATA;
        default:
            return state;
    }
}
