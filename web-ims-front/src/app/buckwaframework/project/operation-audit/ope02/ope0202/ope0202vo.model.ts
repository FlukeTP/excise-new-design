export interface Ope0202 {
	day: number;
     date: Date;
     details: Ope0202Vo[];
}

export interface Ope0202Vo {
     oaPlanId: number;
	oaLicensePlanId: number;
	oaCuslicenseId: number;
	companyName: string;
	address: string;
}