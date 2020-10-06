export interface Ope020801Vo {
     remark: string;
     status: string;
     approves: Ope020801ApproveVo[];
     checkers: Ope020801CheckerVo[];
}

export interface Ope020801FormVo {
     remark: string;
}

export interface Ope020801ApproveVo {
     sectorName: string;
     areaName: string;
     companyName: string;
     licenseType: string;
}

export interface Ope020801CheckerVo {
     name: string;
     position: string;
}