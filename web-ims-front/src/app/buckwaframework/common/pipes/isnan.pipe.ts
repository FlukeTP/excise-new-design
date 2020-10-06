import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'isNaN' })
export class IsNaNPipe implements PipeTransform {
    transform(value: any): any {
        console.log(value);
        let number = 0;
        if (!isNaN(value) && value) {
            number = value;
        }
        return number;
    }
}