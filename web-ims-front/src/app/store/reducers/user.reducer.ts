import { UserModel } from 'models/user.model';
import * as UserAction from "../actions/user.action";

const INIT_DATA: UserModel = {
  authorityList: [],
  departmentName: null,
  officeCode: null,
  title: null,
  userThaiName: null,
  userThaiSurname: null,
  username: null,
  subdeptCode: null,
  subdeptLevel: null,
  isCentral: false,
  systemName:null
};

export function UserReducer(state: UserModel = INIT_DATA, action: UserAction.Actions) {
  switch (action.type) {
    case UserAction.UPDATE:
      return Object.assign({}, action.payload);
    case UserAction.CLEAR:
      return INIT_DATA;
    default:
      return state;
  }

}
