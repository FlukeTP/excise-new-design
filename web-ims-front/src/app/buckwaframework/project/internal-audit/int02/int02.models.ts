import { BaseModel } from 'models/index';

export interface QtnMaster {
    qtnMasterId: number;
    qtnName: string;
    qtnYear: string;
    qtnFinished?: string;
    qtnSector: string;
    qtnStart?: Date;
    qtnEnd?: Date;
    isDeleted?: string;
}

export interface IaQuestionnaireHdr extends BaseModel {
    id: number;
    budgetYear: string;
    qtnHeaderName: string;
    note: string;
    status: string;
    toDepartment: string;
    factorLevel: string;
    usagePatterns: string;
}

export interface QtnTimeAlert {
    qtnAlertId: number;
    qtnAlertTime: Date;
    qtnTimes: number;
    status: string;
    qtnMasterId: number;
}

export interface Int022FormVo extends QtnMaster {
    alerts: QtnTimeAlert[];
}