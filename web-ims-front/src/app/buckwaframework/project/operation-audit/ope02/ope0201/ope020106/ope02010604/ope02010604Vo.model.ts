export interface Ope02010604Vo {

	oaLubricantsDtlId:number;
	oaLubricantsId:number;
	listLubricantsCompare:Ope02010604CompareVo[];
	listOaLubricantsSummary:Ope02010604SummaryVo[];
	result:string;

}
export interface Ope02010604CompareVo {
    oaLubCompareId:number;
    oaLubricantsId:number;
    seq:number;
    name:string;
    sumaryDate:Date;
    auditDate:Date;
    auditStock:number;
    sumaryStock:number;
    remark:string;
	overRate:number;
}

export interface Ope02010604SummaryVo {
    oaLubSumaryId:number;
    oaLubricantsId:number;
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