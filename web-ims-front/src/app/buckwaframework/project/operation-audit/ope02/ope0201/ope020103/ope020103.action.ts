import { Action } from '@ngrx/store';
import { Ope020103Vo, Ope020103Store } from './ope020103.model';

export const GET    = 'UserAuditer => GET';
export const UPDATE   = 'UserAuditer => UPDATE';
export const CLEAR    = 'UserAuditer => CLEAR';
export const REMOVE    = 'UserAuditer => REMOVE';


export class UpdateUserAuditer implements Action {
    readonly type = UPDATE
    constructor(public payload: Ope020103Store) {}
}
export class ClearLicenseUserAuditer implements Action {
    readonly type = CLEAR
    constructor() {}
}
export class RemoveLicenseUserAuditer implements Action {
    readonly type = REMOVE
    constructor(public payload:Ope020103Vo) {}
}
export type Actions =  UpdateUserAuditer | ClearLicenseUserAuditer | RemoveLicenseUserAuditer