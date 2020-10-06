import { Injectable } from '@angular/core';
import { AjaxService } from 'services/ajax.service';
import { MessageBarService } from 'services/message-bar.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Utils } from 'helpers/utils';
import * as moment from 'moment';
import { ComboBox } from 'models/combobox.model';
import { ResponseData } from 'models/response-data.model';
import { MessageService } from 'services/message.service';

declare var $: any;
const URL = {
  SAVE: 'ia/int12/07/01/01/save',
  DROPDOWN: 'combobox/controller/getDropByTypeAndParentId',
  AUTH_LOGIN: 'ia/int061101/getAuthLogin',
  UPLOAD: 'ia/int061101/upload',
  // AUTH_LOGIN: '/restful/versionProgramByPageCode'
  GENARATE_REPORT: 'ia/int12/07/01/01/export/',
};

@Injectable()
export class Int12070101Service {
  fileUpload: any = [];
  readDtl: any = [];

  constructor(
    private ajax: AjaxService,
    private msg: MessageBarService,
    private router: Router,
  ) { }

  // getUserLogin = () => {
  //   return new Promise<any>((resolve, reject) => {
  //     this.ajax.post(URL.AUTH_LOGIN, {}, res => {
  //       resolve(res.json());
  //     }),
  //       error => {
  //         reject(error);
  //       };
  //   });
  // };

  dropdown = (type: string, id?: number): Observable<any> => {
    const DATA = { type: type, lovIdMaster: id || null };
    return new Observable<ComboBox[]>(obs => {
      this.ajax
        .post(URL.DROPDOWN, DATA, res => {
          this[type] = res.json();
        })
        .then(() => {
          obs.next(this[type]);
        });
    });
  }

  convertToNumber(strNumber: any) {
    if (!strNumber) {
      return strNumber;
    }
    return Number(strNumber.toString().replace(/\,/g, ''));
  }
  //   affiliation: "ทุกสำนักงานฯ"
  // billAmount: "3"
  // name: "ผู้ดูแลระบบ000000 นามสกุล"
  // notOver: "3.00"
  // paymentCost: "ค่าผ่อนชำระเงินกู้"
  // paymentFor: "ฟ"
  // period: "กุมภาพันธ์"
  // periodWithdraw: "มกราคม"
  // periodWithdrawTo: "กุมภาพันธ์"
  // position: "เจ้าหน้าที่ดูแลระบบ สำนักงานสรรพสามิต"
  // receipts: 1
  // receiptsRH: [{…}]
  // refReceipts: "3"
  // salary: "3"
  // totalMonth: 2
  // totalWithdraw: 6
  save(formData: any, cbLoading: Function) {
    for (let i = 0; i < formData.receiptsRH.length; i++) {
      formData.receiptsRH[i].receiptAmount = Number(this.convertToNumber(formData.receiptsRH[i].receiptAmount));
      // formData.receiptsRH[i].averageFrom = Number(this.convertToNumber(formData.receiptsRH[i].averageFrom))
    }
    const dataSave = {
      affiliation: formData.affiliation,
      billAmount: this.convertToNumber(formData.billAmount),
      name: formData.name,
      notOver: this.convertToNumber(formData.notOver),
      paymentCost: formData.paymentCost,
      paymentFor: formData.paymentFor,
      period: formData.period,
      periodWithdraw: formData.periodWithdraw,
      periodWithdrawTo: formData.periodWithdrawTo,
      position: formData.position,
      receipts: this.convertToNumber(formData.receipts),
      refReceipts: this.convertToNumber(formData.refReceipts),
      salary: this.convertToNumber(formData.salary),
      totalMonth: this.convertToNumber(formData.totalMonth),
      totalWithdraw: this.convertToNumber(formData.totalWithdraw),
      receiptsRH: formData.receiptsRH
    };
    const promise1 = new Promise<any>((resolve, reject) => {
      this.ajax.post(URL.SAVE, dataSave,
        (res) => {
          if (MessageService.MSG.SUCCESS === res.json().status) {
            this.msg.successModal(res.json().message);
          } else {
            this.msg.errorModal(res.json().message);
          }
          resolve(res.json());
        },
        () => {
          reject(this.msg.errorModal('ไม่สามารถบันทึกได้'));
          cbLoading(false);
        });
    });

    promise1.then(returnForm => {
      if (Utils.isNotNull(returnForm.rentHouseId)) {
        const execelFiles = new FormData();
        execelFiles.append('type', 'RH');
        execelFiles.append('rentHouseId', returnForm.rentHouseId);
        /**
         * loop get file
         */
        this.fileUpload.forEach(file => {
          execelFiles.append('files', file.inputFIle.files[0]);
        });
        const _receipts = formData.receiptsRH;
        // tslint:disable-next-line: forin
        for (const key in _receipts) {
          _receipts[key].id = returnForm.rentHouseId;
          _receipts[key].receiptDate = moment(_receipts[key].receiptDate, 'DD/MM/YYYY').toDate();
          _receipts[key].receiptType = 'RH';
        }
        this.ajax.upload(URL.UPLOAD, execelFiles, res => {
          const urlReceipt = 'ia/int061102/receipt/save';
          this.ajax.post(urlReceipt, _receipts, response => {
            this.msg.successModal(response.json().messageTh);
            cbLoading(false);
            this.router.navigate(['/int06/11']);
          }).catch(err => {
            this.msg.errorModal('ไม่สามารถทำการบันทึกได้');
            console.error(err);
          });
        }).catch(err => {
          this.msg.errorModal('ไม่สามารถทำการบันทึกได้');
          console.error(err);
        });
      }
    },
      () => {
        this.msg.errorModal('ไม่สามารถบันทึกได้');
        cbLoading(false);
      });
  }

  onUpload() {
    // tslint:disable-next-line: max-line-length
    const inputTypeFile = `<input type='file' name='files' id='files' accept='.pdf, image/*, text/plain, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,
                    application/vnd.ms-excel,.doc,.docx'>`;

    const f = $('.upload-panel > input')[0];
    $('.upload-panel').html(inputTypeFile); // add to html

    const lastText = f.value.split('\\').length;
    const u = {
      name: f.value.split('\\')[lastText - 1],
      // type: f.type,
      // size: f.size,
      // value: f.value,
      date: new Date().toLocaleDateString(),
      typePage: 'RH',
      inputFIle: f
    };
    this.fileUpload.push(u);

    return new Promise<any>((resolve, reject) => {
      resolve(this.fileUpload);
    });
  }

  onDel(index: number) {
    this.fileUpload.splice(index, 1);
  }

  onSerchById(id: any) {
    return new Promise((resolve, reject) => {
      this.ajax.doGet(`ia/int12/07/01/01/find-by-renhouse/${id}`).subscribe(
        (res: ResponseData<any>) => {
          if (MessageService.MSG.SUCCESS === res.status) {
            resolve(res.data);
          } else {
            this.msg.errorModal(res.message);
            reject();
          }
        },
        (err) => {
          this.msg.errorModal(err);
          reject();
        }
      );
    });
  }

  exportReport(id: string) {
    this.ajax.download(URL.GENARATE_REPORT + id);
  }
}
