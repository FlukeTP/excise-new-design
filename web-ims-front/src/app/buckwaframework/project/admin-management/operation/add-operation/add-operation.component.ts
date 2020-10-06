import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AjaxService } from 'services/ajax.service';
import { MessageBarService } from 'services/message-bar.service';
import { Router } from '@angular/router';
import { MessageService } from 'services/message.service';
import { ResponseData } from 'models/response-data.model';
import { RoleVo } from 'projects/admin-management/role/role';
const URL = {
  create: "access-control/operation/create"
}
@Component({
  selector: 'app-add-operation',
  templateUrl: './add-operation.component.html',
  styleUrls: ['./add-operation.component.css']
})
export class AddOperationComponent implements OnInit {

  saveForm: FormGroup;
  constructor(private ajax: AjaxService, private messageBar: MessageBarService,private router: Router) {

  }

  ngOnInit() {
    this.saveForm = new FormGroup({
      operationCode: new FormControl(''),
      operationDesc: new FormControl('')
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
