export interface Ope041301Vo {
     remark: string;
     status: string;
     approves: Ope041301ApproveVo[];
     checkers: Ope041301CheckerVo[];
}

export interface Ope041301FormVo {
     remark: string;
}

export interface Ope041301ApproveVo {
     sectorName: string;
     areaName: string;
     companyName: string;
     licenseType: string;
}

export interface Ope041301CheckerVo {
     name: string;
     position: string;
}