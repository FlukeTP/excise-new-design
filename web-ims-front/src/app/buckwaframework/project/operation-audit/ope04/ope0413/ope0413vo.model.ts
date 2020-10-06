export interface Ope0413Vo {
     id: number;
	auditStart: Date;
	auditEnd: Date;
	budgetYear: string;
	companies: string[];
	toggleList?: boolean;
}

export interface Ope0413ApproveVo {
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