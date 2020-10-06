export class CondGroup {
  analysisNumber: string;
  budgetYear: string;
  condDtlId: string;
  condGroup: string;
  productType: string;
  rangeEnd: number;
  rangeStart: number;
  riskLevel: string;
  taxMonthEnd: number;
  taxMonthStart: number;
  riskLevelDesc: string;
}

export interface FormVo {
  cond: string[];
  analysisNumber: string;
  start: number;
  length: number;
  dateRange: number;
  capital: string;
  risk: string;
  condSubNoAuditFlag: string;
  newRegId: string;
  newRegFlag: string;
  taxAuditLast: string;
  dutyCode: string;
  facType: string;
  sector: string;
  area: string;
  sumTaxAmStart: number
  sumTaxAmEnd: number
  cuscatId:string
  budgetYear:string
}

export interface FormSave {
  analysisNumber: string;
  budgetYear: string;
  sendAllFlag: string;
}

export interface WorksheetHdr {
  worksheetHdrId: string;
  officeCode: string;
  budgetYear: string;
  analysisNumber: string;
  worksheetStatus: string;
  condSubCapitalFlag: string;
  condSubRiskFlag: string;
  condSubNoAuditFlag: string;
}
