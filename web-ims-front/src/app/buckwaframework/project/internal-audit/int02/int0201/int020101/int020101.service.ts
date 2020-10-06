import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ResponseData } from 'models/index';
import { Observable } from 'rxjs';
import { AjaxService, MessageBarService, MessageService } from 'services/index';
import { IaQuestionnaireHdr } from '../../int02.models';
import { CONFIG, CONFIG3 } from '../int0201.mock';
import { Int0201ConfigVo } from '../int0201vo.model';
import { Int020101NameVo, Int020101Vo, Int020101YearVo } from './int020101vo.model';

const URL = {
     QTN_HDR: "ia/int02",
     QTN_HDR_SAVE: "ia/int02/save",
     QTN_HDR_UPDATE: "ia/int02/update",

     QTN_YEAR: "ia/int02/01/01/by/user",
     QTN_NAME: "ia/int02/01/01/by/year",

     QTN_SIDE: "ia/int02/01/01/by/head",
     QTN_SIDE_SAVE: "ia/int02/01/01/save",
     QTN_SIDE_SAVE_ALL: "ia/int02/01/01/save/all",
     QTN_SIDE_UPDATE: "ia/int02/01/01/update",
     QTN_SIDE_DELETE: "ia/int02/01/01/delete",

     QTN_CONFIGS: "ia/int0201/config",

     CHECK_USE_QTN: "ia/int02/01/01/checkUseQtn",
};

const URLS_RISK = {
     get_RISK_DATA: "preferences/parameter"
}

@Injectable()
export class Int020101Service {

     idHead: number = null;
     qtnSides: Int020101Vo[] = [];

     constructor(
          private ajax: AjaxService,
          private router: Router,
          private messageBar: MessageBarService,
     ) { }

     getRiskColor() {
          // let promise = new Promise((resolve) => {
          //      this.ajax.get(URL.GET_CHART_OF_ACC,
          //           success => {
          //                resolve(success.json())
          //           }, error => {
          //                this.messageBar.errorModal(error.json());
          //           })
          // })
          // return promise
     }

     getRiskData(data) {
          let promise = new Promise((resolve) => {
               this.ajax.doPost(`${URLS_RISK.get_RISK_DATA}/${data}`, {}).subscribe((res: any) => {
                    if (MessageService.MSG.SUCCESS == res.status) {
                         resolve(res.data)
                    } else {
                         this.messageBar.errorModal(res.message)
                    }
               })
          })
          return promise
     }

     getCheckUseQtn(data: string) {
          let promise = new Promise((resolve) => {
               this.ajax.doGet(`${URL.CHECK_USE_QTN}/${data}`).subscribe((res: any) => {
                    if (MessageService.MSG.SUCCESS == res.status) {
                         resolve(res.data)
                    } else {
                         this.messageBar.errorModal(res.message)
                    }
               })
          })
          return promise
     }

     qtnIdSideObs(): Observable<number> {
          return new Observable<number>(obs => {
               setInterval(() => {
                    obs.next(this.idHead)
               }, 200);
          });
     }

     qtnSidesObs(): Observable<Int020101Vo[]> {
          return new Observable<Int020101Vo[]>(obs => {
               setInterval(() => {
                    obs.next(this.qtnSides)
               }, 200);
          });
     }

     findQtnHead(idHead: string, form: FormGroup) {
          this.ajax.doGet(`${URL.QTN_HDR}/${idHead}`).subscribe((result: ResponseData<IaQuestionnaireHdr>) => {
               if (MessageService.MSG.SUCCESS == result.status) {
                    console.log("findQtnHead: ", result);
                    form.get('qtnHeaderName').patchValue(result.data.qtnHeaderName);
                    form.get('budgetYear').patchValue(result.data.budgetYear);
                    form.get('note').patchValue(result.data.note);
                    form.get('createdBy').patchValue(result.data.createdBy);
                    form.get('createdDate').patchValue(result.data.createdDate);
                    form.get('updatedBy').patchValue(result.data.updatedBy);
                    form.get('updatedDate').patchValue(result.data.updatedDate);
                    form.get('status').patchValue(result.data.status);
                    form.get('toDepartment').patchValue(result.data.toDepartment);
                    form.get('usagePatterns').patchValue(result.data.usagePatterns);
                    form.get('factorLevel').patchValue(result.data.factorLevel);
               } else {
                    this.messageBar.errorModal(result.message);
               }
          });
     }

     findQtnSide(idHead: string) {
          this.ajax.doGet(`${URL.QTN_SIDE}/${idHead}`).subscribe((result: ResponseData<Int020101Vo[]>) => {
               if (MessageService.MSG.SUCCESS == result.status) {
                    // GET DATA HERE
                    console.log("findQtnSide: ", result.data);
                    this.qtnSides = result.data;
               } else {
                    this.messageBar.errorModal(result.message);
               }
          })
     }

     findQtnSideByName(idHead: string) {
          this.ajax.doGet(`${URL.QTN_SIDE}/${idHead}`).subscribe((result: ResponseData<Int020101Vo[]>) => {
               if (MessageService.MSG.SUCCESS == result.status) {
                    // GET DATA HERE
                    this.qtnSides = result.data;
                    for (let i = 0; i < this.qtnSides.length; i++) {
                         // this.qtnSides[i].id = null; // use id to pulling data children
                         this.qtnSides[i].idHead = null;
                         this.qtnSides[i].isDeleted = 'N';
                         this.qtnSides[i].version = 1;
                         this.qtnSides[i].createdBy = null;
                         this.qtnSides[i].createdDate = null;
                         this.qtnSides[i].updatedBy = null;
                         this.qtnSides[i].updatedDate = null;
                         this.qtnSides[i].checked = true;
                    }
               } else {
                    this.messageBar.errorModal(result.message);
               }
          });
     }

     findByUsername(): Promise<Int020101YearVo[]> {
          return new Promise((resolve, reject) => {
               this.ajax.doGet(`${URL.QTN_YEAR}`).subscribe((result: ResponseData<Int020101YearVo[]>) => {
                    if (MessageService.MSG.SUCCESS == result.status) {
                         // GET DATA HERE
                         resolve(result.data);
                    } else {
                         this.messageBar.errorModal(result.message);
                         reject([]);
                    }
               });
          });
     }

     findByYearAndUsername(year: string): Promise<Int020101NameVo[]> {
          return new Promise((resolve, reject) => {
               this.ajax.doGet(`${URL.QTN_NAME}/${year}/user`).subscribe((result: ResponseData<Int020101NameVo[]>) => {
                    if (MessageService.MSG.SUCCESS == result.status) {
                         // GET DATA HERE
                         if (AjaxService.isDebug) {
                              console.log("QTN_NAME => ", result);
                         }
                         resolve(result.data);
                    } else {
                         this.messageBar.errorModal(result.message);
                         reject([]);
                    }
               });
          });
     }

     saveConfigs(idHead: string, factorLevel: string) {
          let configs: Int0201ConfigVo
          if (factorLevel == '3') {
               configs = CONFIG3;
          } else if (factorLevel == '5') {
               configs = CONFIG;
          }
          configs.idQtnHdr = parseInt(idHead);
          return this.ajax.doPost(`${URL.QTN_CONFIGS}/`, configs).subscribe((result: ResponseData<Int0201ConfigVo>) => {
               if (MessageService.MSG.SUCCESS == result.status) {
                    // GET DATA HERE
                    this.messageBar.successModal(result.message, "สำเร็จ", event => {
                         if (event) {
                              this.findQtnSide(idHead);
                              console.log("SAVE CONFIG");
                              // location.reload()
                         }
                    });
               } else {
                    this.messageBar.errorModal(result.message);
               }
          });
     }

     saveSides(sides: Int020101Vo[]) {
          let data = sides;
          for (let i = 0; i < data.length; i++) {
               data[i].idHead = this.idHead;
               data[i].seq = i + 1;
          }
          return this.ajax.doPost(URL.QTN_SIDE_SAVE_ALL, sides).subscribe((result: ResponseData<Int020101Vo[]>) => {
               if (MessageService.MSG.SUCCESS == result.status) {
                    // GET DATA HERE
                    this.qtnSides = result.data;
                    // this.messageBar.successModal(result.message);
               } else {
                    this.messageBar.errorModal(result.message);
               }
          })
     }

     saveAll(form: FormGroup, data: Int020101Vo[] = []) {
          /* set status */
          if (data.length > 0) {
               form.get('status').patchValue('2');
          } else {
               form.get('status').patchValue('1');
          }
          if (!form.value.factorLevel) {
               form.patchValue({
                    factorLevel: 3
               })
          }
          return new Promise((resolve, reject) => {
               this.ajax.doPost(URL.QTN_HDR_SAVE, form.value).subscribe((result: ResponseData<IaQuestionnaireHdr>) => {
                    if (MessageService.MSG.SUCCESS == result.status) {
                         this.router.navigate(['/int02/01/01/'], {
                              queryParams: {
                                   id: result.data.id
                              }
                         });
                         this.idHead = result.data.id;
                         const idHead: string = result.data.id.toString();
                         let factorLevel = result.data.factorLevel.toString();
                         form.get('id').patchValue(idHead);
                         this.findQtnHead(idHead, form);
                         if (data.length > 0) {
                              this.saveSides(data);
                         } else {
                              this.findQtnSide(idHead);
                         }
                         if (!factorLevel) {
                              factorLevel = '3'
                         }
                         console.log("A", factorLevel);

                         this.saveConfigs(idHead, factorLevel);
                         setTimeout(() => {
                              resolve(true);
                         }, 1250);
                    } else {
                         this.messageBar.errorModal(result.message);
                         reject(false);
                    }
               });
          });
     }

     updateAll(idHead: string, form: FormGroup, flag?: boolean) {
          return this.ajax.doPut(`${URL.QTN_HDR_UPDATE}/${idHead}`, form.value).subscribe((result: ResponseData<IaQuestionnaireHdr>) => {
               if (MessageService.MSG.SUCCESS == result.status) {
                    this.findQtnHead(idHead, form);
                    this.findQtnSide(idHead);
                    if (flag) {
                         /* something */
                    } else {
                         this.messageBar.successModal(result.message);
                    }
               } else {
                    this.messageBar.errorModal(result.message);
               }
          });
     }

     save(formChild: FormGroup) {
          this.ajax.doPost(URL.QTN_SIDE_SAVE, formChild.value).subscribe((result: ResponseData<Int020101Vo>) => {
               if (MessageService.MSG.SUCCESS == result.status) {
                    const idHead: string = result.data.idHead.toString();
                    this.findQtnSide(idHead);
                    formChild.reset();
                    this.messageBar.successModal(result.message);
               } else {
                    this.messageBar.errorModal(result.message);
               }
          });
     }

     update(formChild: FormGroup) {
          this.ajax.doPut(`${URL.QTN_SIDE_UPDATE}/${formChild.value.id}`, formChild.value).subscribe((result: ResponseData<Int020101Vo>) => {
               if (MessageService.MSG.SUCCESS == result.status) {
                    const idHead: string = result.data.idHead.toString();
                    this.findQtnSide(idHead);
                    formChild.reset();
                    this.messageBar.successModal(result.message);
               } else {
                    this.messageBar.errorModal(result.message);
               }
          });
     }

     delete(id: number) {
          this.ajax.doDelete(`${URL.QTN_SIDE_DELETE}/${id}`).subscribe((result: ResponseData<Int020101Vo>) => {
               if (MessageService.MSG.SUCCESS == result.status) {
                    const idHead: string = result.data.idHead.toString();
                    this.findQtnSide(idHead);
                    this.messageBar.successModal(result.message);
               } else {
                    this.messageBar.errorModal(result.message);
               }
          });
     }

}