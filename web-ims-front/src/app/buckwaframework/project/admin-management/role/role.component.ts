import { Component, OnInit } from '@angular/core';
import { BreadCrumb, ResponseData } from 'models/index';
import { AjaxService } from 'services/ajax.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MessageBarService } from 'services/message-bar.service';
import { RoleVo } from './role';
import { MessageService } from 'services/message.service';
import { Router } from '@angular/router';

declare var $: any;

const URL = {
  LIST: AjaxService.CONTEXT_PATH + "access-control/role/list",
  CREATE: "access-control/role/create",
  UPDATE: "access-control/role/update",
  DELETE: "access-control/role/delete"
}

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css']
})
export class RoleComponent implements OnInit {

  //breadcrumb
  breadcrumb: BreadCrumb[];

  //table
  table: any;

  // form
  searchForm: FormGroup;
  modalForm: FormGroup;

  //submit
  submitmodal: boolean = false;

  //obj
  role: RoleVo[] = [];

  constructor(private ajax: AjaxService, private messageBar: MessageBarService, private router: Router) { }

  ngOnInit() {
    //initial data
    this.breadcrumb = [
      { label: "จัดการข้อมูลผู้ใช้", route: "#" },
      { label: "Role", route: "#" },
    ];

    this.searchForm = new FormGroup({
      roleCode: new FormControl(''),
      roleDesc: new FormControl(''),
    });

    this.modalForm = new FormGroup({
      roleId: new FormControl('null'),
      roleCode: new FormControl('', Validators.required),
      roleDesc: new FormControl('', Validators.required),
    });
  }

  ngAfterViewInit(): void {
    this.tableRole();
    $("#role-create").modal('hide');
    $("#role-edit").modal('hide');
  }

  handleSearch(e) {
    e.preventDefault();
    this.table.ajax.reload();
  }


  tableRole = () => {
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
            "roleCode": this.searchForm.value.roleCode,
            "roleDesc": this.searchForm.value.roleDesc
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
          data: "roleCode", className: "text-left"
        }, {
          data: "roleDesc", className: "text-left"
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
        {
          render: function (data, type, full, meta) {
            let btn = '';
            btn += `<button class="ui mini  button assign" type="button">
                      <i class="edit icon"></i>
                      assign Operation
                    </button>`;
            return btn;
          },
          className: "text-center"
        }
      ],
    });

    this.table.on("click", "td > button.edit", (event) => {
      var data = this.table.row($(event.currentTarget).closest("tr")).data();
      this.edit(data);
    });
    this.table.on("click", "td > button.del", (event) => {
      var data = this.table.row($(event.currentTarget).closest("tr")).data();
      this.delete(data.roleId);
    });

    this.table.on("click", "td > button.assign", (event) => {
      var data = this.table.row($(event.currentTarget).closest("tr")).data();
      this.router.navigate(['/management/role-assign-operation'], {
        queryParams: {
          id: data.roleId
        }
      });
    });
  }


  delete(id: number) {
    this.messageBar.comfirm(event => {
      if (event) {
        this.ajax.doDelete(`${URL.DELETE}/${id}`).subscribe((result: ResponseData<RoleVo>) => {
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

  edit(role) {
    $("#role-edit").modal('show');
    this.modalForm.reset();
    this.modalForm.get('roleId').patchValue(role.roleId);
    this.modalForm.get('roleCode').patchValue(role.roleCode);
    this.modalForm.get('roleDesc').patchValue(role.roleDesc);
  }

  update() {
    this.submitmodal = true;
    if (this.modalForm.valid) {
      this.ajax.doPut(`${URL.UPDATE}/${this.modalForm.value.roleId}`, this.modalForm.value).subscribe((result: ResponseData<RoleVo>) => {
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
    $("#role-create").modal('show');
    this.modalForm.reset();
  }

  save() {
    this.submitmodal = true;
    if (this.modalForm.valid) {
      this.ajax.doPost(URL.CREATE, this.modalForm.value).subscribe((result: ResponseData<RoleVo>) => {
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

  //Validators
  invalidModalFormControl(control: string) {
    return this.modalForm.get(control).invalid && (this.modalForm.get(control).touched || this.submitmodal);
  }
}
