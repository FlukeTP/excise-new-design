export interface Ta0301 {
    formTsNumber: string;
    pathTs: string;
}

export interface ListFormTsNumber {
    listFormTsNumber: string[];
}

export interface PathTsSelect {
    docType: string;
    topic: string;
}

export interface ProvinceList {
    provinceId: number,
    geoId: number,
    provinceCode: string,
    provinceName: string
}

export interface AmphurList {
    amphurCode: string,
    amphurId: number,
    amphurName: string,
    geoId: number,
    provinceId: number
}

export interface DistrictList {
    amphurId: number,
    districtCode: string,
    districtId: number,
    districtName: string,
    geoId: number,
    provinceId: number
}

export interface DataCusTa {
    newRegId: string;
    planNumber: string;
}

export interface DocTypeName {
    groupCode: number,
    code: string,
    value: number,
    desc: string
}