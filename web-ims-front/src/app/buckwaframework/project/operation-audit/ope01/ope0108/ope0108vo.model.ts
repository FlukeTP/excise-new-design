export interface Ope0108Vo {
     id: number;
	auditStart: Date;
	auditEnd: Date;
	budgetYear: string;
	companies: string[];
	toggleList?: boolean;
}

export interface Ope0108ApproveVo {
     id: number;
	areaName: string;
	auditStart: Date;
	auditEnd: Date;
	budgetYear: string;
	companies: string[];
	sectorName: string;
	status: string;
	toggleList?: boolean;
}