import { BaseModel } from 'models/index';

export interface OperationVo extends BaseModel {
    operationId: number;
    operationCode: string;
    operationDesc: string;
}