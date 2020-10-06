// Queried
export interface Int030402HeaderVo {
     name: string;
}

export interface Int030402InfoVo {
     sectorName: string;
     areaName: string;
     status: string;
     statusText: string;
     sentDate: Date;
     riskQuantity: number;
     passValue: number;
     failValue: number;
     avgRisk: number;
     riskText: string;
     riskColor: string;
     sideDtls: Int030402DataVo[];
     intCalculateCriteriaVo:IntCalculateCriteriaVo;
     riskNum: number;
}

export interface Int030402DataVo {
     acceptValue: number;
     declineValue: number;
     riskName: string;
     risk: string;
     intCalculateCriteriaVo:IntCalculateCriteriaVo;
}

export interface Int030402SummaryVo {
     riskQuantity: number;
     passValue: number;
     failValue: number;
     listQuantity: number;
     finishQuantity: number;
     draftQuantity: number;
}

export interface IntCalculateCriteriaVo {
  riskRate: number;
	translatingRisk: string;
	color: string;
	codeColor: string;
	percent: number;
}
