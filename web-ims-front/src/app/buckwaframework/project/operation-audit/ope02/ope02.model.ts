export interface OaPlan {

    oaPlanId:number,
    oaLicensePlanId:number,
    oaPersonAuditPlanId:string,
    oaPersonApprovPlanId:number,
    auditStart:Date,
    auditEnd:Date,
    officeCode:string,
    status:string,
    fiscolYear:string,
}

export interface listOaPlan {

    listPlan:OaPlan[]
}

export interface planMonthVo{
    name:string,
    year:string,
    create:OaPlan[],
    waiting:OaPlan[],
    approve:OaPlan[],
    audit:OaPlan[],
    close:OaPlan[]
}