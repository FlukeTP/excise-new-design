import { Action } from '@ngrx/store';
import { UserModel } from 'models/user.model';

export const GET = 'User => GET';
export const UPDATE = 'User => UPDATE';
export const CLEAR = 'User => CLEAR';
export const REMOVE = 'User => REMOVE';

export class UpdateUser implements Action {
     readonly type = UPDATE
     constructor(public payload: UserModel) { }
}
export class ClearUser implements Action {
     readonly type = CLEAR
     constructor() { }
}
export class RemoveUser implements Action {
     readonly type = REMOVE
     constructor(public payload: UserModel) { }
}
export type Actions = UpdateUser | ClearUser | RemoveUser