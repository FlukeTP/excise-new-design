export interface PlantWorkSheetVo {
  typeCheckedAll: boolean;
  ids: string[];

  budgetYear: string;
  analysisNumber: string;
  planNumber: string;
  planStatus: string;
  authComment: string;
  planComment: string;
}

export interface FormVo {
  cond: string[];
  analysisNumber: string;
  start: number;
  length: number;
  dateRange: number;
  seeDataSelect: string;
  capital: string;
  newRegFlag: string,
  risk: string;
  condSubNoAuditFlag: string;
  newRegId: string;
  taxAuditLast: string;
  sumTaxAmStart: number;
  sumTaxAmEnd: number;
  cuscatId:string
  budgetYear:string;
}
