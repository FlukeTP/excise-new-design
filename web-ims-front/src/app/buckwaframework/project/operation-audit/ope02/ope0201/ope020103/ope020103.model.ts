export interface Ope020103Vo {
    wsUserId:Number,
    userThaiId:string,
    userThaiName:string,
    userThaiSurname:string,
    userEngName:string,
    userEngSurname:string,
    title:string,
    officeId:string,
    accessAttr:string,
    officeCode:string,
    userId:string,
    oaPersonAuditPlanId:number,
}

export interface Ope020103Store {
    auditer:Ope020103Vo[];
}