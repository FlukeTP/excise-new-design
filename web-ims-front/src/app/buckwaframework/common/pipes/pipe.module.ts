import { NgModule } from '@angular/core';
import { DateStringPipe } from '.';
import { DateStringTypePipe } from './date-string-type.pipe';
import { DecimalFormatPipe } from './decimal-format.pipe';
import { IsEmptyPipe } from './empty.pipe';
import { PhoneFormatPipe } from './phone-format.pipe';
import { IsNaNPipe } from './isnan.pipe';

@NgModule({
    imports: [],
    declarations: [
        DateStringPipe,
        DateStringTypePipe,
        DecimalFormatPipe,
        IsEmptyPipe,
        PhoneFormatPipe,
        IsNaNPipe
    ],
    exports: [
        DateStringPipe,
        DateStringTypePipe,
        DecimalFormatPipe,
        IsEmptyPipe,
        PhoneFormatPipe,
        IsNaNPipe
    ],
})
export class PipeModule { }
