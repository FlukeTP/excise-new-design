import { Ope020102Vo, Ope0201001Vo, Ope020102Store } from './ope020102.model';
import { Action } from '@ngrx/store';

export const GET    = 'LicenseCustomer => GET';
export const UPDATE   = 'LicenseCustomer => UPDATE';
export const CLEAR    = 'LicenseCustomer => CLEAR';
export const REMOVE    = 'LicenseCustomer => REMOVE';


export class UpdateLicenseCustomer implements Action {
    readonly type = UPDATE
    constructor(public payload: Ope020102Store) {}
}
export class ClearLicenseCustomer implements Action {
    readonly type = CLEAR
    constructor() {}
}
export class RemoveLicenseCustomer implements Action {
    readonly type = REMOVE
    constructor(public payload: Ope0201001Vo) {}
}
export type Actions =  UpdateLicenseCustomer | ClearLicenseCustomer | RemoveLicenseCustomer