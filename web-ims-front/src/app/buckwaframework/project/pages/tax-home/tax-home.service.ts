import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MessageBarService, AjaxService, IaService } from 'services/index';
@Injectable()
export class TaxHomeService {
     constructor(
          private ajax: AjaxService,
          private router: Router,
          private obectService: IaService,
     ) { }

     countNotification = (): Promise<any> => {
          let url = "mobile-api/countNotification";
          return new Promise((resolve, reject) => {
               this.ajax.post(url, {}, res => {
                    resolve(res.json());
               })
          });
     }

     queryData = (dataForm: any): Promise<any> => {
          let url = "taxHome/selectType";
          return new Promise((resolve, reject) => {
               this.ajax.post(url, dataForm, res => {
                    resolve(res.json());
               });
          });
     }

     save(form): Promise<any> {
          let url = "taxAudit/selectList/findCondition1";
          return new Promise((resolve, reject) => {
               resolve();
               this.obectService.setData(form);
               this.router.navigate(['/tax-audit/tax00006']);
          });
     }

     taxPull(): Promise<any> {
          let url = "combobox/controller/configCreteria";
          return this.ajax.get(url, res => {
               return res.json();
          });
     }

}