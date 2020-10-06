import { Injectable } from '@angular/core';
import { AjaxService, MessageBarService } from '../../../../../../common/services';
import { File } from '../../../../../../common/models';
import { Utils } from 'helpers/utils';
import { Int0901011Service } from '../int090101-1.service';

declare var $: any;

@Injectable()
export class Int09010101Service {
  formVo: FormVo;
  table: any;
  data: any;
  formEditModal: FormEditModal;
  constructor(
    private ajax: AjaxService,
    private message: MessageBarService
  ) {
    this.formVo = new FormVo();
    this.data = [];
    this.formEditModal = new FormEditModal();
  }

  onSubmit(form: any, int0901011Service: Int0901011Service): Promise<any> {
    let url = "ia/int0611/upload";
    let params = form;
    return new Promise((resolve, reject) => {
      console.log("Params : ", params);
      this.ajax.upload(url, params, success => {
        this.data = success.json();
        int0901011Service.setDataBudget(this.data.data);
        if (this.data.data.length == 0) {
          this.message.errorModal('ไม่สามารถอัปโหลดไฟล์');

        }
        this.table.clear().draw();
        this.table.rows.add(this.data.data); // Add new data        
        this.table.columns.adjust().draw(); // Redraw the DataTable    
        resolve(this.data.data.length);
      }, error => {
        this.message.errorModal('ไม่สามารถอัปโหลดไฟล์');
        reject(0);
      });
    })
  }

  onChangeUpload = async (event: any) => {
    if (event.target.files && event.target.files.length > 0) {
      let reader = new FileReader();
      reader.onload = (e: any) => {
        const f = {
          name: event.target.files[0].name,
          type: event.target.files[0].type,
          value: e.target.result
        };
        this.formVo.fileName = [f];
        console.log(this.formVo);
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };


  claer = (int0901011Service: Int0901011Service) => {
    $("#fileName").val("");
    int0901011Service.setDataBudget(null);
    this.table.clear().draw();
    // this.table.rows.add(this.data.data); // Add new data
    this.table.columns.adjust().draw(); // Redraw the DataTable    

  }

  dataTable = () => {
    this.table = $("#dataTable").DataTableTh({
      "serverSide": false,
      "searching": false,
      "ordering": false,
      "processing": true,
      "scrollX": true,
      "pageLength": 25,
      "data": this.data,
      "columns": [
        {
          "data": "colum0",
          "render": function (data, type, row, meta) {
            return meta.row + meta.settings._iDisplayStart + 1;
          },
          "className": "ui center aligned"
        }, {
          "data": "colum0"
        }, {
          "data": "colum2",
          "className": "ui left aligned",
        }, {
          "data": "colum4",
          "className": "ui right aligned",
          "render": function (data) {
            return Utils.moneyFormat(data);
          }
        }, {
          "data": "colum7",
          "className": "ui right aligned",
          "render": function (data) {
            return Utils.moneyFormat(data);
          }
        }, {
          "data": "colum8",
          "className": "ui right aligned",
          "render": function (data) {
            return Utils.moneyFormat(data);
          }
        }, {
          "data": "colum9",
          "className": "ui right aligned",
          "render": function (data) {
            return Utils.moneyFormat(data);
          }
        }
      ]
    });
  }
}

class FormVo {
  fileName: File[]
}
class FormEditModal {
  accountNumber: string;
  accountName: string;
  monryComes: number;
  moneyGoes: number;
  debit: string;
  credit: string;
  columnId: string;
}