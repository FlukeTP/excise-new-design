import { Action } from '@ngrx/store';
import { Ope010103Store, Ope010103Vo } from './ope010103.model';

export const GET    = 'UserAuditer => GET';
export const UPDATE   = 'UserAuditer => UPDATE';
export const CLEAR    = 'UserAuditer => CLEAR';
export const REMOVE    = 'UserAuditer => REMOVE';


export class UpdateUserAuditer implements Action {
    readonly type = UPDATE
    constructor(public payload: Ope010103Store) {}
}
export class ClearLicenseUserAuditer implements Action {
    readonly type = CLEAR
    constructor() {}
}
export class RemoveLicenseUserAuditer implements Action {
    readonly type = REMOVE
    constructor(public payload:Ope010103Vo) {}
}
export type Actions =  UpdateUserAuditer | ClearLicenseUserAuditer | RemoveLicenseUserAuditer