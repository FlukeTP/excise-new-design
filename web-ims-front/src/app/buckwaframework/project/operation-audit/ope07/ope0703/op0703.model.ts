export interface Vo {

    newRegId: string;
    cusFullname: string;
    facFullname: string;
    facAddress: string;
    dutyCode: string;
    dutyDesc: string;
    officeCodeR4000: string;
    secCode: string;
    secDesc: string;
    areaCode: string;
    areaDesc: string;
    regStatus: string;
    regDate: string;
    regCapital: string;
    taxPayList: string[];
    perceneDiff: string[];
    groupTaxPay: string[];
    groupYearMonth: string[];
    groupYearMonthGraph: string[];
    dataTableGraph: any[];
}

export interface Response07Vo {
    dataList: Vo[];
    count: number;
}