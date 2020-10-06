export interface Ope020106Vo {
	oaLubricantsDtlId: number;
	oaLubricantsId: number;
	officePlaceOwner: string;
	officeRentAmount: number;
	workingStartDate: Date;
	workingEndDate: Date;
	workdayPermonth: number;
	numberOfTank: number;
	tankCapacity: string;
	numberUtility: string;
	orderType: string;
	orderPayMethod: string;
	employeePermanent: number;
	employeeTemporary: number;
	payMethodOther: string;
	dailyAcc: string;
	dailyAccDoc: string;
	dailyAuditRemark: string;
	monthlyAcc: string;
	monthlyAccDoc: string;
	monthlyAuditRemark: string;
	monthlyAcc04: string;
	monthlyAccDoc04: string;
	monthlyAuditRemark04: string;
	materail: string;
	document: number;
	productProcess: string;
	productNextime: string;
	useStartDate: Date;
	useEndDate: Date;
	buyOverlimit: string;
	buyFromIndust: string;
	buyIndustLicense: string;
	buyFromImporter: string;
	buyImporterLicense: string;
	buyFromAgent: string;
	buyAgentLicense: string;
	usedType: string;
	usedRemark: string;
	salerType: string;
	salerCapacity: string;
	numOfCust: number;
	goodQuality: string;
	agentStartDate: Date;
	agentEndDate: Date;
	agentOverlimit: string;
	abuyFromIndust: string;
	abuyIndustLicense: string;
	abuyFromImporter: string;
	aimporterLicense: string;
	abuyFromAgent: string;
	abuyAgentLicense: string;
	asaleToAgent: string;
	asaleAgentLicense: string;
	asaleToUser: string;
	asaleUserLicense: string;
	sentToAgent: string;
	agentRemark: string;
	sentToUser: string;
	otherRemark: string;
	customers?: Ope020106CustomerVo[];
	custdeles?: Ope020106CustomerVo[];
	auditResult: string;
}

export interface Ope020106CustomerVo {
	oaLubricantsCustId: number;
	oaLubricantsId: number;
	custName: string;
	address: string;
	mobile: string;
}

export interface Ope020106ButtonVo {
	oaLubricantsId: number;
	oaPlanId: number;
	oaLubricantsDtlId: number;
	oaCuslicenseId: number;
	oaCustomerId: number;
	licenseNo: string;
	licenseType: string;
	oldCustomer: string;
}