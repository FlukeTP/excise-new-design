export interface Ope010801Vo {
     remark: string;
     status: string;
     approves: Ope010801ApproveVo[];
     checkers: Ope010801CheckerVo[];
}

export interface Ope010801FormVo {
     remark: string;
}

export interface Ope010801ApproveVo {
     sectorName: string;
     areaName: string;
     companyName: string;
     licenseType: string;
}

export interface Ope010801CheckerVo {
     name: string;
     position: string;
}