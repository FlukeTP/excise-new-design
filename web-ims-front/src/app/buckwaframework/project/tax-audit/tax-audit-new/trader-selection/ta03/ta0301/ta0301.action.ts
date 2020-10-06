
import { Action } from '@ngrx/store';
import { Ta0301, ListFormTsNumber, PathTsSelect, ProvinceList, AmphurList, DistrictList, DataCusTa } from './ta0301.model';

export const ADD = 'FormTsNumber => ADD';
export const REMOVE = 'FormTsNumber => REMOVE';


export class AddFormTsNumber implements Action {
    readonly type = ADD
    constructor(public payload: Ta0301) { }
}
export class RemoveFormTsNumber implements Action {
    readonly type = REMOVE
    constructor() { }
}

//==> List FormTsNumber
export const ADD_LIST_FORM_TSNUMBER = 'List FormTsNumber => ADD';
export const REMOVE_LIST_FORM_TSNUMBER = 'List TFormTsNumber => REMOVE';


export class AddListFormTsNumber implements Action {
    readonly type = ADD_LIST_FORM_TSNUMBER
    constructor(public payload: ListFormTsNumber) { }
}
export class RemoveListFormTsNumber implements Action {
    readonly type = REMOVE_LIST_FORM_TSNUMBER
    constructor() { }
}

//==> Path ts select
export const ADD_PATH_TS_SELECT = 'Path Ts select=> ADD';
export const REMOVE_PATH_TS_SELECT = 'Path Ts select=> REMOVE';


export class AddPathTsSelect implements Action {
    readonly type = ADD_PATH_TS_SELECT
    constructor(public payload: PathTsSelect) { }
}
export class RemovePathTsSelect implements Action {
    readonly type = REMOVE_PATH_TS_SELECT
    constructor() { }
}

//==> province list
export const ADD_PROVINCE_LIST = 'province list=> ADD';
export const REMOVE_PROVINCE_LIST = 'province list=> REMOVE';

export class AddProvinceList implements Action {
    readonly type = ADD_PROVINCE_LIST
    constructor(public payload: ProvinceList[]) { }
}
export class RemoveProvinceList implements Action {
    readonly type = REMOVE_PROVINCE_LIST
    constructor() { }
}

//==> amphur list
export const ADD_AMPHUR_LIST = 'amphur list=> ADD';
export const REMOVE_AMPHUR_LIST = 'amphur list=> REMOVE';

export class AddAmphurList implements Action {
    readonly type = ADD_AMPHUR_LIST
    constructor(public payload: AmphurList[]) { }
}
export class RemoveAmphurList implements Action {
    readonly type = REMOVE_AMPHUR_LIST
    constructor() { }
}

//==> district list
export const ADD_DISTRICT_LIST = 'district list=> ADD';
export const REMOVE_DISTRICT_LIST = 'district list=> REMOVE';

export class AddDistrictList implements Action {
    readonly type = ADD_DISTRICT_LIST
    constructor(public payload: DistrictList[]) { }
}
export class RemoveDistrictList implements Action {
    readonly type = REMOVE_DISTRICT_LIST
    constructor() { }
}


export const ADD_DATA_CUS = 'DataCusTa => ADD';
export const REMOVE_DATA_CUS = 'DataCusTa => REMOVE';


export class AddDataCusTa implements Action {
    readonly type = ADD_DATA_CUS
    constructor(public payload: DataCusTa) { }
}
export class RemoveDataCusTa implements Action {
    readonly type = REMOVE_DATA_CUS
    constructor() { }
}

export type Actions = AddFormTsNumber | RemoveFormTsNumber
    | AddListFormTsNumber | RemoveListFormTsNumber
    | AddPathTsSelect | RemovePathTsSelect
    | AddProvinceList | RemoveProvinceList
    | AddAmphurList | RemoveAmphurList
    | AddDistrictList | RemoveDistrictList
    | AddDataCusTa | RemoveDataCusTa
