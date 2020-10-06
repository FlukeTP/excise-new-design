import { Pipe, PipeTransform } from '@angular/core';
import { IsEmptyPipe } from './empty.pipe';

@Pipe({ name: 'phoneFormat' })
export class PhoneFormatPipe implements PipeTransform {
    transform(phoneNumber: string): any {
        if (new IsEmptyPipe().transform(phoneNumber)) {
            if (phoneNumber.length <= 10) {
                /* __________ mobile phone ______ */
                if (phoneNumber.length == 10) {
                    return phoneNumber.slice(0, 3) + '-' + phoneNumber.slice(3, 10)
                } else {
                    return phoneNumber;
                }
            } else {
                return ""
            }
        }
    }
}