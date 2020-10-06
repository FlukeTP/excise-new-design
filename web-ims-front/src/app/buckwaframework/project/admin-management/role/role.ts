import { BaseModel } from 'models/index';

export interface RoleVo extends BaseModel {
    roleId: number;
    roleCode: string;
    roleDesc: string;
}