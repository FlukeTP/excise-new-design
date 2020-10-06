import { BaseModel } from 'models/index';

export interface Int020101Vo extends BaseModel{
     id: number;
     idHead: number;
     sideName: string;
     quantity: number;
     checked?: boolean;
     seq: number;
}

export interface Int020101YearVo {
     year: string;
}

export interface Int020101NameVo {
     id: number;
     name: string;
}