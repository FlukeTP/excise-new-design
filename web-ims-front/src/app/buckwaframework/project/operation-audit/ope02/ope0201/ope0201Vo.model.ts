import { Ope020102Vo, Ope0201001Vo } from './ope020102/ope020102.model';
import { Ope020103Vo } from './ope020103/ope020103.model';

export interface Ope0201Vo {
    listLicensePlan:Ope020102Vo[];
}


export interface Ope0201FromVo {

    planId:string
	dateFrom:Date,
	dateTo:Date,
	fiscolYear:string,
    listCompany:Ope0201001Vo[],
    listAuditer:Ope020103Vo[],
    listApprover:Ope020103Vo[],
}

export interface Ope0201 {
    auditStartDate:Date,
    auditEndDate:Date,
    auditYear:string;
}