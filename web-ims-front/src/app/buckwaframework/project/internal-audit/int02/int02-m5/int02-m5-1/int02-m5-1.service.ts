import { Injectable } from '@angular/core';
import { AjaxService } from 'services/ajax.service';

@Injectable()
export class Int02m51Service {
    constructor(
        private ajax: AjaxService,
    ) { }

    sector = ():Promise<any> => {
        return new Promise<any>((resolve, reject) => {
            var url = "ia/int02m51/sector";
            this.ajax.get(url, succes => {
                resolve(succes.json());
            });
        })

    }
}