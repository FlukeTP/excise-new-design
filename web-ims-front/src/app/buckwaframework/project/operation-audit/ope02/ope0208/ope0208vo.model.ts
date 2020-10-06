export interface Ope0208Vo {
     id: number;
	auditStart: Date;
	auditEnd: Date;
	budgetYear: string;
	companies: string[];
	toggleList?: boolean;
}

export interface Ope0208ApproveVo {
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