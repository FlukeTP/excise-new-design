import { Action } from '@ngrx/store';
import { Ope010102Store, Ope0101001Vo } from './ope010102.model';

export const GET    = 'LicenseCustomer => GET';
export const UPDATE   = 'LicenseCustomer => UPDATE';
export const CLEAR    = 'LicenseCustomer => CLEAR';
export const REMOVE    = 'LicenseCustomer => REMOVE';


export class UpdateLicenseCustomer implements Action {
    readonly type = UPDATE
    constructor(public payload: Ope010102Store) {}
}
export class ClearLicenseCustomer implements Action {
    readonly type = CLEAR
    constructor() {}
}
export class RemoveLicenseCustomer implements Action {
    readonly type = REMOVE
    constructor(public payload: Ope0101001Vo) {}
}
export type Actions =  UpdateLicenseCustomer | ClearLicenseCustomer | RemoveLicenseCustomer