export interface Ope0102 {
	day: number;
     date: Date;
     details: Ope0102Vo[];
}

export interface Ope0102Vo {
     oaPlanId: number;
	oaLicensePlanId: number;
	oaCuslicenseId: number;
	companyName: string;
	address: string;
}