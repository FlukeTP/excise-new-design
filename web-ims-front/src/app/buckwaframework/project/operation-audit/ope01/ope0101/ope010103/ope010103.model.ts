export interface Ope010103Vo {
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
}

export interface Ope010103Store {
    auditer:Ope010103Vo[];
}