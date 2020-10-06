export class User {
  userId?: number;
  username: string = null;
  password: string = null;
  exciseBaseControl: string = null;
  enabled?: string = null;

}

export interface UserDetail {
  fullName: string;
  title: string;
  position: string;
  versionProgram: string;
  pageCode: string;
  userDetail: string;
}

export interface UserModel {
  authorityList: string[];
  officeCode: string;
  title: string;
  userThaiName: string;
  userThaiSurname: string;
  username: string;
  departmentName: string;
  subdeptCode: string;
  subdeptLevel: string;
  isCentral: boolean;
  systemName:string
}
