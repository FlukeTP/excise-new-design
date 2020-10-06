
import { Action } from '@ngrx/store';
import { FormSearch } from './ope07.model';

export const ADD_FORM = 'Form => ADD';
export const REMOVE_FORM = 'Form => REMOVE';
export class AddFormSearch implements Action {
    readonly type = ADD_FORM
    constructor(public payload: FormSearch) { }
}
export class RemoveFormSearch implements Action {
    readonly type = REMOVE_FORM
    constructor() { }
}

export type Actions = AddFormSearch | RemoveFormSearch 