export interface License {
	oaCuslicenseId: number;
	oaCustomerId?: number;
    name: string;
	companyName: string;
	identifyNo: string;
	identifyType: string;
	licenseType: string;
	licenseNo: string;
	licenseDate: Date;
	licenseTypeFor: string;
	licenseTypeDesp: string;
	bankGuarantee: string;
	bankGuaranteeNo: string;
	bankGuaranteeDate: Date;
	oldLicenseYear: string;
	operateName: string;
	operateRemark: string;
	startDate: Date;
	endDate: Date;
	offCode: string;
	receiveDate: Date;
	receiveNo: string;
	approveName: string;
	approve: string;
	oldCustomer: string;
	mobile: string;
	address: string;
	warehouseAddress: string;
	sectorName?: string;
	areaName?: string;
    details?: LicenseDetail[];
    deletes?: LicenseDetail[];
}

export interface LicenseHydrocarbon {
	oaCuslicenseId: number;
	oaCustomerId?: number;
    name: string;
	companyName: string;
	identifyNo: string;
	identifyType: string;
	licenseType: string;
	licenseNo: string;
	licenseDate: Date;
	licenseTypeFor: string;
	licenseTypeDesp: string;
	bankGuarantee: string;
	bankGuaranteeNo: string;
	bankGuaranteeDate: Date;
	oldLicenseYear: string;
	operateName: string;
	operateRemark: string;
	startDate: Date;
	endDate: Date;
	offCode: string;
	receiveDate: Date;
	receiveNo: string;
	approveName: string;
	approve: string;
	oldCustomer: string;
	mobile: string;
	address: string;
	warehouseAddress: string;
    bankGuaranteeTxt: string;
    licenseTypeUsr: string;
    licenseTypeUsrATxt: string;
	licenseTypeUsrBTxt: string;
	email: string;
	sectorName?: string;
	areaName?: string;
    details?: LicenseDetail[];
    deletes?: LicenseDetail[];
}

export interface LicenseAlcohol {
    oaCuslicenseId: number;
	oaCustomerId: number;
	licenseNo: string;
	licenseDate: Date;
	operateName: string;
	operateRemark: string;
	approveName: string;
	startDate: Date;
	endDate: Date;
	offCode: string;
	receiveDate: Date;
	receiveNo: string;
	approve: string;
	licenseTypeFor: string;
	licenseTypeDesp: string;
	licenseAddress: string;
	createdFactTime: string;
    usedDate: Date;
	money: number;
	name: string;
	companyName: string;
	identifyNo: string;
	identifyType: string;
	warehouseAddress: string;
	mobile: string;
	address: string;
    details?: LicenseDetail[];
    deletes?: LicenseDetail[];
}

export interface LicenseDetail {
    oaCuslicenseDtlId: number;
    oaCuslicenseId: number;
    seq: number;
    name: string;
    type: string;
    amount: number;
    licenseNo: string;
}