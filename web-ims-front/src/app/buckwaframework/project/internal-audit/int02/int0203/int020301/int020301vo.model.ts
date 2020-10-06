// Queried
export interface Int020301HeaderVo {
     name: string;
     conclude: string;
}

export interface Int020301InfoVo {
     idMadeHdr: number;
     sectorName: string;
     areaName: string;
     status: string;
     statusText: string;
     sentDate: Date;
     sentBy: string;
     riskQuantity: number;
     passValue: number;
     failValue: number;
     avgRisk: number;
     riskText: string;
     riskColor: string;
     sideDtls: Int020301DataVo[];
}

export interface Int020301DataVo {
     acceptValue: number;
     declineValue: number;
     riskName: string;
     risk: string;
}

export interface Int020301SummaryVo {
     riskQuantity: number;
     passValue: number;
     failValue: number;
     listQuantity: number;
     finishQuantity: number;
     draftQuantity: number;
}
