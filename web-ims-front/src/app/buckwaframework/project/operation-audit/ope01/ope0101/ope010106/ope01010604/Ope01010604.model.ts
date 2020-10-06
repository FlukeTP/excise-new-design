export interface Ope01010604Vo {

	oaLubricantsDtlId:number;
	oaLubricantsId:number;
	listOaHydrocarbCompare:Ope01010604CompareVo[];
	listOaHydrocarbSummary:Ope01010604SummaryVo[];
	result:string;

}
export interface Ope01010604CompareVo {
    oaHydCompareId:number;
    oaHydrocarbId:number;
    seq:number;
    name:string;
    sumaryDate:Date;
    auditDate:Date;
    auditStock:number;
    sumaryStock:number;
    remark:string;
	overRate:number;
}

export interface Ope01010604SummaryVo {
    oaHydSumaryId:number;
    oaHydrocarbId:number;
    seq:number;
    lubName:string;
    month:string;
    year:string;
    stockLatsMonth:number
    receive:number
    sending:number
    remark:string;
    stock:number
}