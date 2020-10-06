export interface Ope020102Vo {
    oaLicensePlanId:Number;
    oaPlanId:Number;
    auditStart:Date;
    auditEnd:Date;
    officeCode:string;
    status:string;
    fiscolYear:string;
    licenseId:Number;
}

export interface Ope0201001Vo {
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
export interface Ope020102Store {
    customerLicenseList:Ope0201001Vo[];

}


