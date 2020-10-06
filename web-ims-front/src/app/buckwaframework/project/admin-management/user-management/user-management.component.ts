import { Component, OnInit } from '@angular/core';
import { BreadCrumb, ResponseData, User } from 'models/index';
import { Http, Headers } from '@angular/http';
import { AjaxService } from 'services/ajax.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MessageService } from 'services/message.service';
import { RoleVo } from '../role/role';
import { UserVo } from './userVo';

import { Router } from '@angular/router';
import { MessageBarService } from 'services/message-bar.service';
import { shiftInitState } from '@angular/core/src/view';

declare var $: any;

const URL = {
  LIST: AjaxService.CONTEXT_PATH + "access-control/user/listUser",
  UPDATE: "access-control/user/update",
  DELETE: "access-control/user/delete"
}
@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  [x: string]: any;
  breadcrumb: BreadCrumb[] = [
    { label: "จัดการข้อมูลผู้ใช้", route: "#" },
    { label: "User", route: "#" },
  ];

  table: any;
  searchForm: FormGroup;
  user: UserVo;

  states: String;

  constructor(private ajax: AjaxService, private messageBar: MessageBarService, private router: Router) { }


  ngOnInit() {
    this.searchForm = new FormGroup({
      username: new FormControl(''),
      enabled: new FormControl(''),
    });
    this.modalForm = new FormGroup({
      userId: new FormControl('null'),
      enabled: new FormControl(''),
    });
  }


  ngAfterViewInit(): void {
    this.tableUser();
  }

  handleSearch(e) {
    e.preventDefault();
    this.table.ajax.reload();
    console.log(this.searchForm.value);
  }

  tableUser = () => {
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
            "username": this.searchForm.value.username,
            "enabled": this.searchForm.value.enabled
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
          data: "username", className: "text-center"
        }, {
          data: "enabled", className: "text-center",
          render: function (data, type, full, meta) {
            let btn = '';
            if(data == 'Y'){
              btn = `<i class="check icon"></i>
            `;
            }else{
              btn = `<i class="close icon"></i>
              `;
            }
           
            return btn;
          }
        }, {
          render: function (data, type, full, meta) {
            let btn = '';
            btn += `<button class="ui mini yellow button edit" type="button">
                      <i class="edit icon"></i>
                      แก้ไข
                    </button>
               
                    `;
            return btn;
          }
        },
        {
          render: function (data, type, full, meta) {
            let btn = '';
            btn += `<button class="ui mini  button assign" type="button">
                      <i class="edit icon"></i>
                      assign Role
                    </button>
                  
                    `;
            return btn;
          }
        }
      ],
    });

    this.table.on("click", "td > button.edit", (event) => {
      var data = this.table.row($(event.currentTarget).closest("tr")).data();
      this.edit(data);
    });
    
    this.table.on("click", "td > button.assign", (event) => {
      var data = this.table.row($(event.currentTarget).closest("tr")).data();
      this.router.navigate(['/management/user-assign-role'], {
        queryParams: {
          id: data.userId
        }
      });
    });
  }
  


  edit(user) {
    console.log(this.modalForm.get('enabled'));
    $("#user-edit").modal('show');
    this.modalForm.reset();
    this.modalForm.get('userId').patchValue(user.userId);
    this.modalForm.get('enabled').patchValue(user.enabled);
    this.modalForm.get('enabled').value=user.enabled;
    console.log(this.modalForm.value);

  }


  update() {
    this.ajax.doPut(`${URL.UPDATE}/${this.modalForm.value.userId}`, this.modalForm.value).subscribe((result: ResponseData<UserVo>) => {
      if (MessageService.MSG.SUCCESS == result.status) {
        this.modalForm.reset();
        this.messageBar.successModal(result.message);
        this.table.ajax.reload();
      } else {
        this.messageBar.errorModal(result.message);
      }
    });
  }

}
