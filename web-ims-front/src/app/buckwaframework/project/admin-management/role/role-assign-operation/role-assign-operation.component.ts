import { Component, OnInit } from '@angular/core';
import { AjaxService } from 'services/ajax.service';
import { MessageBarService } from 'services/message-bar.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadCrumb } from 'models/breadcrumb.model';
import { FormGroup, FormControl } from '@angular/forms';
import { ResponseData } from 'models/response-data.model';
import { MessageService } from 'services/message.service';
import { RoleVo } from '../role';

declare var $: any;

const URL = {
  LIST: AjaxService.CONTEXT_PATH + "access-control/role/operation/list",
  LIST_DATA: AjaxService.CONTEXT_PATH + "access-control/role/operation/list-data",
  // CREATE: "access-control/role/create",
  //UPDATE: "access-control/role/update",
  // DELETE: "access-control/role/delete"
  FIND_BY_ID: "access-control/role/find-by-id"
}

@Component({
  selector: 'app-role-assign-operation',
  templateUrl: './role-assign-operation.component.html',
  styleUrls: ['./role-assign-operation.component.css']
})
export class RoleAssignOperationComponent implements OnInit {
  //breadcrumb
  breadcrumb: BreadCrumb[];

  roleId: string = "";

  // form
  dataForm: FormGroup;



  //table
  table: any;

  //obj
  dataRo: DataRoleOperation;
  //List
  dataRoList: DataRoleOperation[] = [];


  constructor(
    private ajax: AjaxService,
    private messageBar: MessageBarService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    //initial data
    this.breadcrumb = [
      { label: "จัดการข้อมูลผู้ใช้", route: "#" },
      { label: "Role", route: "#" },
      { label: "Assign Operation", route: "#" },
    ];

    this.dataForm = new FormGroup({
      roleCode: new FormControl(''),
      roleDesc: new FormControl(''),
    });

    this.roleId = this.route.snapshot.queryParams['id'] || "";
    this.setData(this.roleId);

    this.dataRo = {
      roleOperationId: 0,
      roleId: 0,
      operationId: 0
    }
  }


  ngAfterViewInit(): void {
    this.tableRole();
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
            "roleId": this.roleId
          }));
        }
      },
      columns: [
        // {
        //   render: function (data, type, full, meta) {
        //     return `<input class="ui checkbox" type="checkbox" name="chk${meta.row}" id="chk${
        //       meta.row
        //       }" value="${$("<div/>")
        //         .text(data)
        //         .html()}">`;
        //   },
        //   className: "center"
        // },
        {
          data: "isDeleted", className: "text-center",
          render: function (data, type, full, meta) {
            let box = '';
            if (data == 'N') {
              box = `<input class="ui checkbox" type="checkbox"  checked>`;
            } else {
              box = `<input class="ui checkbox" type="checkbox">`;
            }

            return box;
          }
        },
        {
          render: function (data, type, row, meta) {
            return meta.row + meta.settings._iDisplayStart + 1;
          },
          className: "text-center"
        }, {
          data: "operationCode", className: "text-left"
        }, {
          data: "operationDesc", className: "text-left"
        }
      ],
    });

    this.table.on("click", "td > input.checkbox", (event) => {
      var data = this.table.row($(event.currentTarget).closest("tr")).data();
      console.log(data);
      if (data.isDeleted == 'N') {
        this.dataRo.operationId = data.operationId;
        console.log(this.dataRo.operationId );
        
        console.log("update");
      } else {
        console.log("save");
      }
      // this.edit(data);
    });
    // this.table.on("click", "td > button.del", (event) => {
    //   var data = this.table.row($(event.currentTarget).closest("tr")).data();
    //   this.delete(data.roleId);
    // });

    // this.table.on("click", "td > button.assign", (event) => {
    //   var data = this.table.row($(event.currentTarget).closest("tr")).data();
    //   this.router.navigate(['/management/role-assign-operation'], {
    //     queryParams: {
    //       id: data.roleId
    //     }
    //   });
    // });

  }

  checkAll = (e) => {
    var rows = this.table.rows({ search: "applied" }).nodes();
    $('input[type="checkbox"]', rows).prop("checked", e.target.checked);
  }

  setData(id: String) {
    if (id) {
      this.ajax.doGet(`${URL.FIND_BY_ID}/${id}`).subscribe((result: ResponseData<RoleVo>) => {
        if (MessageService.MSG.SUCCESS == result.status) {
          this.dataForm.get('roleCode').patchValue(result.data.roleCode);
          this.dataForm.get('roleDesc').patchValue(result.data.roleDesc);
        } else {
          this.messageBar.errorModal(result.message);
        }
      });
    }
  }

}

interface DataRoleOperation {
  roleOperationId: number;
  roleId: number;
  operationId: number;
}
