import { Pipe, PipeTransform } from '@angular/core';

// services
import { TranslateService } from '../services/translate.service';

@Pipe({
    name: 'translate',
    pure: false
})
export class TranslatePipe implements PipeTransform {

    constructor(private translateService: TranslateService){}

    transform(value: string, args: any[]): any {
        return this.translateService.instant(value);
    }
}