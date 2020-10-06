import { Pipe, PipeTransform } from '@angular/core';
import { EnDateToThDate, digit } from '../helper';
import * as moment from 'moment';

@Pipe({
    name: 'dateString',
    pure: false
})
export class DateStringPipe implements PipeTransform {
    transform(value: Date, time: boolean = false): any {
        if (time) {
            const timeStr: string = digit((new Date(value)).getHours()) + ":" + digit((new Date(value)).getMinutes()) + " น.";
            const dateStr: string = EnDateToThDate(moment(new Date(value), "DD/MM/YYYY").format("DD/MM/YYYY").toString());
            return dateStr + " " + timeStr;
        }
        return EnDateToThDate(moment(new Date(value), "DD/MM/YYYY").format("DD/MM/YYYY").toString());
    }
}