import { BaseModel } from 'models/index';

export interface FactoryVo extends BaseModel {
    newRegId: string;
    cusFullname: string;
    facFullname: string;
    facAddress: string;
    secDesc: string;
    areaDesc: string;
    dutyDesc: string;
    auditType: string;
    auditStartDate: string;
    auditEndDate: string;
}