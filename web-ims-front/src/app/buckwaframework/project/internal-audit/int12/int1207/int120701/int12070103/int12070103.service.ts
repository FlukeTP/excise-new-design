import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MessageBarService } from 'services/message-bar.service';
import { AjaxService } from 'services/ajax.service';
import { Utils } from 'helpers/utils';

declare var $: any;
const SAVE_SUCCESS = 'บันทึกรายการ';
const SAVE_ERROR = 'บันทึกไม่สำเร็จ';
const URL = {
  UPLOAD: 'ia/int061103/upload'
};
@Injectable({
  providedIn: 'root'
})
export class Int12070103Service {
  fileUpload: any = [];
  readDtl: any = [];
  constructor(
    private ajax: AjaxService,
    private messege: MessageBarService,
    private router: Router
  ) { }
  save(form: any): Promise<any> {
    const url = '/ia/int061103/save';
    console.log(form);
    return new Promise((resolve, reject) => {
      this.ajax.post(url, JSON.stringify(form), res => {
        console.log(res.json());
        resolve(res.json());
      }, err => {
        this.messege.errorModal(SAVE_ERROR);
        reject();
      });
    });
  }

  saveFile = (obj) => {

    if (Utils.isNotNull(obj.id)) {
      const execelFiles = new FormData();
      execelFiles.append('id', obj.id);
      /**
       * loop get file
       */
      this.fileUpload.forEach(file => {
        execelFiles.append('files', file.inputFIle.files[0]);
      });
      console.log('fileUpload : ', this.fileUpload);
      console.log('execelFiles : ', execelFiles);
      this.ajax.upload(URL.UPLOAD, execelFiles,
        res => {
          this.messege.successModal(res.json().messageTh);
          this.router.navigate(['/int06/11']);
        },
        error => {
          this.messege.errorModal('ไม่สามารถบันทึกได้');
        });
    }
  }

  onUpload() {
    const inputTypeFile = `<input type="file" name="files" id="files" accept=".pdf, image/*, text/plain, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,
                      application/vnd.ms-excel,.doc,.docx">`;

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

}
