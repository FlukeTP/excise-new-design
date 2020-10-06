import { Injectable } from '@angular/core';
import { AjaxService } from 'services/ajax.service';
declare var $: any;
@Injectable()
export class AnalysisService {
    constructor(
        private ajax: AjaxService
    ) { }

    exciseIdList = (): Promise<any> => {
        let url = "ta/analysis/findExciseId";

        return new Promise((resolve, reject) => {
            this.ajax.get(url, res => {
                resolve(res.json())
            })
        });

    }

    changeExciseId = (exciseId): Promise<any> => {
        let url = "ta/analysis/findByExciseId";
        return new Promise((resolve, reject) => {
            this.ajax.post(url, JSON.stringify(exciseId), res => {
                resolve(res.json())
            })
        });
    }

    clear=()=>{
        $("#exciseId").dropdown('restore defaults');
        $("#coordinates").val('');
        $("#type").val('');
        $("#dateTo").val('');
        $("#dateFrom").val('');
        $("#userNumber").val('');
      }
}