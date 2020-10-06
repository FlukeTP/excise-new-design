import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ResponseData } from 'models/index';
import { AjaxService, MessageBarService, MessageService } from 'services/index';
import { Int020101Vo } from '../int020101vo.model';
import { Int02010101FormVo, Int02010101Vo } from './int02010101vo.model';

const URL = {
     QTN_SIDE_ID: "ia/int02/01/01/by/id",
     QTN_SIDE_DTL: "ia/int02/01/01/01/by/side",
     QTN_SIDE_DTL_SAVE: "ia/int02/01/01/01/save/side/all"
}

@Injectable()
export class Int02010101Service {
     id: string = "";
     qtnSide: Int020101Vo;
     qtnDtlsAll: Int02010101Vo[] = [];
     constructor(
          private ajax: AjaxService,
          private messageBar: MessageBarService,
          private route: ActivatedRoute
     ) { }

     getQuestionnaireSideDtl(idSide: number) {
          return new Promise((resolve, reject) => {
               this.ajax.doGet(`${URL.QTN_SIDE_DTL}/${idSide}`).subscribe((response: ResponseData<Int02010101Vo[]>) => {
                    if (response.status == MessageService.MSG.SUCCESS) {
                         this.qtnDtlsAll = response.data;
                         resolve(this.qtnDtlsAll);
                    } else {
                         this.messageBar.errorModal(response.message);
                         reject(this.qtnDtlsAll);
                    }
               });
          });
     }

     getSideById(idSide: number) {
          return new Promise((resolve, reject) => {
               this.ajax.doGet(`${URL.QTN_SIDE_ID}/${idSide}`).subscribe((response: ResponseData<Int020101Vo>) => {
                    if (response.status == MessageService.MSG.SUCCESS) {
                         this.qtnSide = response.data;
                         resolve(this.qtnSide);
                    } else {
                         this.messageBar.errorModal(response.message);
                         reject(this.qtnSide);
                    }
               });
          });
     }

     updateQtnDtlsAll(qtnDtlsAll: Int02010101Vo[]) {
          this.qtnDtlsAll = qtnDtlsAll;
     }

     saveAll(form: Int02010101FormVo) {
          return new Promise((resolve, reject) => {
               this.ajax.doPost(`${URL.QTN_SIDE_DTL_SAVE}`, form).subscribe((response: ResponseData<Int02010101FormVo>) => {
                    if (response.status == MessageService.MSG.SUCCESS) {
                         this.id = this.route.snapshot.queryParams['id'] || "";
                         this.getQuestionnaireSideDtl(parseInt(this.id)).then(result => {
                              resolve(result);
                         });
                         this.messageBar.successModal(response.message);
                    } else {
                         this.messageBar.errorModal(response.message);
                         reject(this.qtnDtlsAll);
                         window.location.reload();
                    }
               })
          });
     }
}