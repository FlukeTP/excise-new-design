export interface Int0402Vo {
  id: number;

   projectCode: string;
   projectName: string;

   exciseCode: string;
   sectorName: string;
   areaName: string;

   systemCode: string;
   systemName: string;

   budgetYear: string;
   inspectionWork: number;
   status: string;
   lists: Int0402ListVo[];
   listsCal: IntCalculateCriteriaVo[];
   riskItem: number;
   riskRate: number;
   riskText: string;
}

export interface Int0402ListVo {
  riskRate: number;
  riskText: string;
  riskCode: string;
}

export interface IntCalculateCriteriaVo {

  riskRate:number;
translatingRisk:String;
color:String;
codeColor:String;
}

export interface Int0402HeaderVo {
  name: string;
  dataCal: string;
  percent : number;
}
