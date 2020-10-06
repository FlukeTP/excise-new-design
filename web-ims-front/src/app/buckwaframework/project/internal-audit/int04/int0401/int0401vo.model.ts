export interface Int0401Vo {
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
      lists: Int0401ListVo[];
      listsCal: IntCalculateCriteriaVo[];
      riskItem: number;
      riskRate: number;
      riskText: string;
}

export interface Int0401ListVo {
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

export interface Int0401HeaderVo {
     name: string;
     dataCal: string;
     percent : number;
}
