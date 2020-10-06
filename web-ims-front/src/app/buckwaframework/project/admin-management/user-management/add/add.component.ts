import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { ResponseData, BreadCrumb } from 'models/index';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AjaxService } from 'services/ajax.service';
import { MessageBarService } from 'services/message-bar.service';
import { MessageService } from 'services/message.service';
import { RoleVo } from 'projects/admin-management/role/role';


const URL = {
  create: "access-control/role/create"
}

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})


export class AddComponent implements OnInit {

  breadcrumb: BreadCrumb[] = [
    { label: "จัดการข้อมูลผู้ใช้", route: "/management/user-management" },
    { label: "เพิ่ม", route: "#" },
  ];
  saveForm: FormGroup;
  constructor(private ajax: AjaxService, private messageBar: MessageBarService,private router: Router) {

  }

  ngOnInit() {
    this.saveForm = new FormGroup({
      roleCode: new FormControl(''),
      roleDesc: new FormControl('')
    });
  }
  handleSave(e) {
    e.preventDefault();
    console.log(this.saveForm.value);
    this.ajax.doPost(URL.create, this.saveForm.value).subscribe((result: ResponseData<RoleVo>) => {
      if (MessageService.MSG.SUCCESS == result.status) {
        this.saveForm.reset();
        this.messageBar.successModal(result.message);
        this.router.navigate(["/management/operation"]);
      } else {
        this.messageBar.errorModal(result.message);
      }
    });
  }


}
