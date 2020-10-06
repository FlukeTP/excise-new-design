import { Component, OnInit } from '@angular/core';
import { AjaxService } from 'services/ajax.service';
import { BreadCrumb } from 'models/breadcrumb.model';
import { FormGroup, FormControl } from '@angular/forms';
import { UserVo, checkboxList } from '../userVo';

import { ActivatedRoute, Router } from '@angular/router';
import { MessageBarService } from 'services/message-bar.service';
import { ResponseData } from 'models/response-data.model';
import { MessageService } from 'services/message.service';

declare var $: any;



const URL = {
  LIST: AjaxService.CONTEXT_PATH + "access-control/user/role/list",
  LIST_DATA: AjaxService.CONTEXT_PATH + "access-control/user/role/list-data",
  FIND_BY_ID: "access-control/user/find-by-id"
}
@Component({
  selector: 'app-user-assign-role',
  templateUrl: './user-assign-role.component.html',
  styleUrls: ['./user-assign-role.component.css']
})
export class UserAssignRoleComponent implements OnInit {

 //breadcrumb
 breadcrumb: BreadCrumb[];

 userId: string = "";

 // form
 dataForm: FormGroup;
 resultSelect: checkboxList;
 //obj
 user: UserVo;

 //table
 table: any;


 constructor(
   private ajax: AjaxService,
   private messageBar: MessageBarService,
   private route: ActivatedRoute,
   private router: Router
 ) { 
  this.resultSelect = {
    typeCheckedAll: false,
    ids: []
  }
 }

 ngOnInit() {
   //initial data
   this.breadcrumb = [
     { label: "จัดการข้อมูลผู้ใช้", route: "#" },
     { label: "User", route: "#" },
     { label: "Assign Role", route: "#" },
   ];

   this.dataForm = new FormGroup({
    username: new FormControl(''),
    enabled: new FormControl(''),
   });

   this.userId = this.route.snapshot.queryParams['id'] || "";
   this.setData(this.userId);
 }


 ngAfterViewInit(): void {
   this.tableUser();
   this.table.ajax.reload();
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
           "userId":  this.userId
         }));
       }
     },
     columns: [
      {
        data: "isDeleted", className: "text-center",
        render: function (data, type, full, meta) {
          let cehk = '';
          if(data == 'N'){
            cehk = `<input class"ui checkbox" type="checkbox" checked>
          `;
          }else{
            cehk = `<input class"ui checkbox" type="checkbox" >
            `;
          }
         
          return cehk;
        }
      },
       
       {
         render: function (data, type, row, meta) {
           return meta.row + meta.settings._iDisplayStart + 1;
         },
         className: "text-center"
       }, {
         data: "roleCode", className: "text-left"
       }, {
         data: "roleDesc", className: "text-left"
       }
     ],
   });
   this.table.on("click", "td > input.checkbox", (event) => {
    var data = this.table.row($(event.currentTarget).closest("tr")).data();
    console.log(data);
    
  // this.edit(data);
  });

 }

 checkAll1 = (e, el ) => {
   var rows = this.table.rows({ search: "applied" }).nodes();
   $('input[type="checkbox"]', rows).prop("checked", e.target.checked);
   
   if(! e.target.checked){
    var el = this.table.rows({ search: "indeterminate" }).get(0);
    if(el && el.checked && ('indeterminate' in el)){
       el.indeterminate = true;
    }
 }


 };


 setData(id: String) {
   if (id) {
     this.ajax.doGet(`${URL.FIND_BY_ID}/${id}`).subscribe((result: ResponseData<UserVo>) => {
       if (MessageService.MSG.SUCCESS == result.status) {
         this.dataForm.get('username').patchValue(result.data.username);
         this.dataForm.get('enabled').patchValue(result.data.enabled);
       } else {
         this.messageBar.errorModal(result.message);
       }
     });
   }
 }

 
 checkboxOutput(e) {
  this.resultSelect = {
    typeCheckedAll: e.typeCheckedAll,
    ids: e.ids.userId
  }
  console.log("checkboxOutput : ", e);
}


}
