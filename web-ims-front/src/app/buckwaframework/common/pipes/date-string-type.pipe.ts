import { Pipe, PipeTransform } from '@angular/core';
import { EnDateToThDate, digit, TextDateTH } from '../helper';
import * as moment from 'moment';

@Pipe({
    name: 'dateStringType',
    pure: false
})
export class DateStringTypePipe implements PipeTransform {
    transform(value: Date, type: string = "DD/MM/YYYY"): any {
        if (type == "DD MMMM YYYY") {
            const dateStr: string = EnDateToThDate(moment(new Date(value), "DD/MM/YYYY").format("DD/MM/YYYY").toString());
            const dateArr: string[] = dateStr.split("/");
            return `${parseInt(dateArr[0])} ${TextDateTH.months[parseInt(dateArr[1]) - 1]} ${dateArr[2]}`;
        }
        return EnDateToThDate(moment(new Date(value), "DD/MM/YYYY").format("DD/MM/YYYY").toString());
    }
}