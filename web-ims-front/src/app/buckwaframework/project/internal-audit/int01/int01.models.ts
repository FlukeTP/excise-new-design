export interface Int01Vo {
    header: Int01HdrVo;
    tableVo: Int01TableVo[];
}

export interface Int01HdrVo {
    planHdrId: number;
    budgetYear: string;
    status: string;
    statusStr: string;
    position: string;
    approvers: string;
}

export interface Int01TableVo {
    inspectionWork: string;
    inspectionWorkStr: string;
    frequency: number;
    unit: string;
    detail: Int01DtlVo[];
}

export interface Int01DtlVo {
    planDtlId: number;
    planHdrId: number;
    inspectionWork: string;
    budgetYear: string;
    activity: string;
    frequency: number;
    unit: string;
    activityStatus: string;
    responsiblePerson: string;
    inspector: string;
    officer: string;
    monthVo: monthVo;
}

export interface monthVo {
    header01: string;
    header02: string;
    header03: string;
    header04: string;
    header05: string;
    header06: string;
    header07: string;
    header08: string;
    header09: string;
    header10: string;
    header11: string;
    header12: string;
    header10Y: string;
    header11Y: string;
}