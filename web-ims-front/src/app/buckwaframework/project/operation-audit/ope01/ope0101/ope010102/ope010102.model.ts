export interface Ope010102Vo {
    oaLicensePlanId:Number;
    oaPlanId:Number;
    auditStart:Date;
    auditEnd:Date;
    officeCode:string;
    status:string;
    fiscolYear:string;
    licenseId:Number;
}

export interface Ope0101001Vo {
    officeName1:string;
    officeName2:string;
    oaCuslicenseId: number;
	oaCustomerId?: number;
	companyName: string;
    licenseType: string;
    address:string;
    identifyNo: string;
    licensePlanId:number;

}
export interface Ope010102Store {
    customerLicenseList:Ope0101001Vo[];

}


