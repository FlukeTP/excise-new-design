import { Action } from '@ngrx/store';
import { Ta020202 } from './ta020202.model';

export const ADD_TA020202 = 'Ta020202 => ADD_NOTE';
export const REMOVE_TA020202 = 'Ta020202 => REMOVE_NOTE';

export class AddTa020202 implements Action {
    readonly type = ADD_TA020202
    constructor(public payload: Ta020202) { }
}
export class RemoveTa020202 implements Action {
    readonly type = REMOVE_TA020202
    constructor() { }
}

export type Actions = AddTa020202 | RemoveTa020202