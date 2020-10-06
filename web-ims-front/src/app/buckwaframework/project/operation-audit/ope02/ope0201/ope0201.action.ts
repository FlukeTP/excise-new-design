import { Ope0201 } from './ope0201Vo.model';
import { Action } from '@ngrx/store';


export const GET    = 'ope0201 => GET';
export const UPDATE   = 'ope0201 => UPDATE';
export const CLEAR    = 'ope0201 => CLEAR';
export const REMOVE    = 'ope0201 => REMOVE';


export class UpdateOpe0201 implements Action {
    readonly type = UPDATE
    constructor(public payload: Ope0201) {}
}
export class ClearOpe0201 implements Action {
    readonly type = CLEAR
    constructor() {}
}

export type Actions =  UpdateOpe0201 | ClearOpe0201 