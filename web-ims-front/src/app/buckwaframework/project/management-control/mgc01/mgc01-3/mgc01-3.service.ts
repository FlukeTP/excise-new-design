import { Injectable } from '@angular/core';
import { AjaxService } from 'services/ajax.service';

@Injectable()
export class Mgc013Service {

    constructor(
        private ajax: AjaxService
    ){}

    getData():Promise<any> {
        return new Promise((resolve,reject)=>{
            let url = "preferences/restful/summaryInvestigateFull";
            this.ajax.get(url, res => {              
              resolve(res.json());
            });
        });        
      }
}