import { BaseModel } from 'models/index';

export interface UserVo extends BaseModel {
    userId: number;
    username: string;
    enabled: string;
}

export interface checkboxList {
    typeCheckedAll: boolean;
    ids: any[];
}