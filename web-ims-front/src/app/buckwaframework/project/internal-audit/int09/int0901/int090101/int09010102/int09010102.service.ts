import { Injectable } from "@angular/core";
import { AjaxService } from "services/ajax.service";
import { MessageBarService } from "services/message-bar.service";
import { Utils } from "helpers/utils";
import { FormVo } from './form.model';
import { Int0901011Service } from '../int090101-1.service';

declare var $: any;

@Injectable()
export class Int09010102Service {

  form: FormVo = new FormVo();
  table: any;
  data: any;  
  constructor(
    private ajax: AjaxService,
    private message : MessageBarService
  ) {
    // this.data = [];  
    // this.formEditModal = new FormEditModal();
  }

  async onSubmit(form: any,int0901011Service :Int0901011Service) {
    let url = await "ia/int0612/upload";
    let params = await form;
    await console.log("Params : ", params);
    return await this.ajax.upload(url, params, success => {
      this.data = success.json();      
      int0901011Service.setDataLedger(this.data.data);
      if(this.data.data.length == 0){
        this.message.errorModal('ไม่สามารถอัปโหลดไฟล์');
      }

    }, error => {
      console.log("Fail!");
      this.message.errorModal("อัปโหลดไฟล์ไม่สำเร็จ");
    }).then(data => {
      console.log(this.data);
      this.table.clear().draw();
      this.table.rows.add(this.data.data); // Add new data        
      this.table.columns.adjust().draw(); // Redraw the DataTable    
    });
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
        this.form.fileName = [f];
        console.log(this.form);
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  claer=(int0901011Service : Int0901011Service)=>{
    $("#fileName").val("");    
    int0901011Service.setDataLedger(null);
     this.table.clear().draw();
    // // this.table.rows.add(this.data.data); // Add new data
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
          "data": "id",
          "render": function (data, type, row, meta) {
            return meta.row + meta.settings._iDisplayStart + 1;
          },
          "className": "ui center aligned"
        }, {
          "data": "accountId",
          "className": "ui center aligned"
        }, {
          "data": "accountName",          
        },{
          "data": "amount",
          "className": "ui right aligned",
          "render": function (data) {
            return Utils.moneyFormat(data);
          }          
        }
      ]
    });
    // this.table.clear().draw();
    // this.table.rows.add(this.data.data); // Add new data
    // this.table.columns.adjust().draw(); // Redraw the DataTable    

    //on click edit
    this.table.on('click', 'tbody tr button.btn-edit', (e) => {
      var closestRow = $(e.target).closest('tr');
      var data = this.table.row(closestRow).data(); 
      $('#edit-modal').modal({
        onShow : ()=>{
          $("#columId").val(data.columId);
          $("#accountNumber").val(data.colum0);
          $("#accountName").val(data.colum2);
          $("#monryComes").val(data.colum4);
          $("#debit").val(data.colum7);
          $("#credit").val(data.colum8);
          $("#moneyGoes").val(data.colum9);
        },
        autofocus : false
      }).modal('show');

    });

    this.table.on('click', 'tbody tr button.btn-delete', (e) => {
      var closestRow = $(e.target).closest('tr');
      var data = this.table.row(closestRow).data(); 
      this.message.comfirm((res)=>{
        if (res) {
          const index = this.data.data.findIndex(obj => obj.columId == data.columId);
          this.data.data.splice(index, 1);
          this.table.clear().draw();
          this.table.rows.add(this.data.data); // Add new data
          this.table.columns.adjust().draw(); // Redraw the DataTable    
        }
      },"","ยืนยันการลบ");      
    });
  }

}