import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AjaxService } from 'services/ajax.service';
import { RoleVo } from '../role';
import { MessageBarService } from 'services/message-bar.service';
import { ResponseData } from 'models/response-data.model';
import { MessageService } from 'services/message.service';
import { Router } from '@angular/router';



const URL = {
  create: "access-control/role/create"
}

@Component({
  selector: 'app-add-role',
  templateUrl: './add-role.component.html',
  styleUrls: ['./add-role.component.css']
})
export class AddRoleComponent implements OnInit {
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
        this.router.navigate(["/management/role"]);
      } else {
        this.messageBar.errorModal(result.message);
      }
    });
  }


}
