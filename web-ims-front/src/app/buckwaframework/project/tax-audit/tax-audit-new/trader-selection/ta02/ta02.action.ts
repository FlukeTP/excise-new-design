import { Action } from '@ngrx/store';
import { OparaterDTL } from './ta02.model';

export const ADD_OPARATER_DTL = 'OparaterDTL => ADD_DUTY_GROUP_ID';
export const REMOVE_OPARATER_DTL = 'OparaterDTL => REMOVE_DUTY_GROUP_ID';

export class AddOparaterDTL implements Action {
    readonly type = ADD_OPARATER_DTL
    constructor(public payload: OparaterDTL) { }
}
export class RemoveOparaterDTL implements Action {
    readonly type = REMOVE_OPARATER_DTL
    constructor() { }
}

export type Actions = AddOparaterDTL | RemoveOparaterDTL