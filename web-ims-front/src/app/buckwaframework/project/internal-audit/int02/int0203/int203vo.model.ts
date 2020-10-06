// Queried
export interface Int0203HeaderVo {
     name: string;
}

export interface Int0203InfoVo {
     sectorName: string;
     areaName: string;
     statusText: string;
     sentDate: Date;
     riskQuantity: number;
     passValue: number;
     failValue: number;
     sideDtls: Int0203DataVo[];
}

export interface Int0203DataVo {
     acceptValue: number;
     declineValue: number;
     riskName: string;
}

export interface Int0203SummaryVo {
     riskQuantity: number;
     passValue: number;
     failValue: number;
     listQuantity: number;
     finishQuantity: number;
     draftQuantity: number;
}