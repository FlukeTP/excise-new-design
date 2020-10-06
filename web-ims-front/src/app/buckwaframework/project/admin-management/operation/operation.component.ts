import { Component, OnInit } from '@angular/core';
import { AjaxService } from 'services/ajax.service';
import { BreadCrumb } from 'models/breadcrumb.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MessageService } from 'services/message.service';

import { ResponseData } from 'models/response-data.model';
import { MessageBarService } from 'services/message-bar.service';
import {  OperationVo } from './opration';

declare var $: any;

const URL = {
  LIST: AjaxService.CONTEXT_PATH + "access-control/operation/list",
  CREATE: "access-control/operation/create",
  UPDATE: "access-control/operation/update",
  DELETE: "access-control/operation/delete"
}
@Component({
  selector: 'app-operation',
  templateUrl: './operation.component.html',
  styleUrls: ['./operation.component.css']
})
export class OperationComponent implements OnInit {
   //breadcrumb
   breadcrumb: BreadCrumb[] = [
    { label: "จัดการข้อมูลผู้ใช้", route: "#" },
    { label: "Operation", route: "#" },
  ];

  //table
  table: any;

  // form
  searchForm: FormGroup;
  modalForm: FormGroup;

  //submit
  submitmodal: boolean = false;

  //obj
  operation: OperationVo[] = [];

  constructor(private ajax: AjaxService, private messageBar: MessageBarService, ) { }

  ngOnInit() {
    this.searchForm = new FormGroup({
      operationCode: new FormControl(''),
      operationDesc: new FormControl(''),
    });

    this.modalForm = new FormGroup({
      operationId: new FormControl('null'),
      operationCode: new FormControl('', Validators.required),
      operationDesc: new FormControl('', Validators.required),
    });
  }

  ngAfterViewInit(): void {
    this.operationRole();
    $("#opration-create").modal('hide');
    $("#operation-edit").modal('hide');
  }

  handleSearch(e) {
    e.preventDefault();
    this.table.ajax.reload();
  }


  operationRole = () => {
    this.table = $("#dataTable").DataTableTh({
      lengthChange: true,
      searching: false,
      ordering: false,
      processing: true,
      serverSide: true,
      paging: true,
      ajax: {
        type: "POST",
        url: URL.LIST,
        contentType: "application/json",
        data: (d) => {
          return JSON.stringify($.extend({}, d, {
            "operationCode": this.searchForm.value.operationCode,
            "operationDesc": this.searchForm.value.operationDesc
          }));
        }
      },
      columns: [
        {
          render: function (data, type, row, meta) {
            return meta.row + meta.settings._iDisplayStart + 1;
          },
          className: "text-center"
        }, {
          data: "operationCode", className: "text-left"
        }, {
          data: "operationDesc", className: "text-left"
        }, {
          render: function (data, type, full, meta) {
            let btn = '';
            btn += `<button class="ui mini yellow button edit" type="button">
                      <i class="edit icon"></i>
                      แก้ไข
                    </button>
                    <button class="ui mini red button del" type="button">
                    <i class="trash icon"></i>
                      ลบ
                  </button
                    `;
            return btn;
          },
          className: "text-center"
        },
      
      ],
    });

    this.table.on("click", "td > button.edit", (event) => {
      var data = this.table.row($(event.currentTarget).closest("tr")).data();
      this.edit(data);
    });
    this.table.on("click", "td > button.del", (event) => {
      var data = this.table.row($(event.currentTarget).closest("tr")).data();
      this.delete(data.operationId);
    });

    this.table.on("click", "td > button.detail", (event) => {
      var data = this.table.row($(event.currentTarget).closest("tr")).data();
      console.log(data);
      //this.route.navigate(['/tax-audit-new/select16/se01'])
    });
  }


  delete(id: number) {
    this.messageBar.comfirm(event => {
      if (event) {
        this.ajax.doDelete(`${URL.DELETE}/${id}`).subscribe((result: ResponseData<OperationVo>) => {
          if (MessageService.MSG.SUCCESS == result.status) {
            this.messageBar.successModal(result.message);
            this.table.ajax.reload();
          } else {
            this.messageBar.errorModal(result.message);
          }
        });
      }
    }, "ต้องการลบข้อมูลหรือไม่ ?");
  }

  edit(operation) {
    $("#operation-edit").modal('show');
    this.modalForm.reset();
    this.modalForm.get('operationId').patchValue(operation.operationId);
    this.modalForm.get('operationCode').patchValue(operation.operationCode);
    this.modalForm.get('operationDesc').patchValue(operation.operationDesc);
  }

  update() {
    this.submitmodal = true;
    if (this.modalForm.valid) {
      this.ajax.doPut(`${URL.UPDATE}/${this.modalForm.value.operationId}`, this.modalForm.value).subscribe((result: ResponseData<OperationVo>) => {
        if (MessageService.MSG.SUCCESS == result.status) {
          this.modalForm.reset();
          this.messageBar.successModal(result.message);
          this.table.ajax.reload();
        } else {
          this.messageBar.errorModal(result.message);
        }
      });
      this.submitmodal = false;
    }
  }


  add() {
    $("#opration-create").modal('show');
    this.modalForm.reset();
  }

  save() {
    this.submitmodal = true;
    if (this.modalForm.valid) {
      this.ajax.doPost(URL.CREATE, this.modalForm.value).subscribe((result: ResponseData<OperationVo>) => {
        if (MessageService.MSG.SUCCESS == result.status) {
          this.modalForm.reset();
          this.messageBar.successModal(result.message);
          this.table.ajax.reload();
        } else {
          this.messageBar.errorModal(result.message);
        }
      });
      this.submitmodal = false;
    }
  }

  invalidModalFormControl(control: string) {
    return this.modalForm.get(control).invalid && (this.modalForm.get(control).touched || this.submitmodal);
  }
}
