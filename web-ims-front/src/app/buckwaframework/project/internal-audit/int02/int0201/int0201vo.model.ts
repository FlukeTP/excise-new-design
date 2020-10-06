import { BaseModel } from 'models/index';

export interface Int0201ConfigVo extends BaseModel {
     id: number;
     idQtnHdr: number;
     low: string;
     lowStart: number;
     lowEnd: number;
     lowRating: number;
     lowColor: string;
     lowCondition: string;
     medium: string;
     mediumStart: number;
     mediumEnd: number;
     mediumRating: number;
     mediumColor: string;
     mediumCondition: string;
     high: string;
     highStart: number;
     highEnd: number;
     highRating: number;
     highColor: string;
     highCondition: string;

     verylow: string;
     verylowStart: number;
     verylowEnd: number;
     verylowRating: number;
     verylowColor: string;
     verylowCondition: string;
     veryhigh: string;
     veryhighStart: number;
     veryhighEnd: number;
     veryhighRating: number;
     veryhighColor: string;
     veryhighCondition: string;
}

export interface Department {
     officeCode: string;
     deptName: string;
     deptShortName: string;
     chckAll?: boolean;
     checked?: boolean;
     excises?: Department[];
}