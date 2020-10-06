import { Component, OnInit } from '@angular/core';
import { BreadCrumb, ResponseData } from 'models/index';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { formatter, TextDateTH } from "helpers/datepicker";
import { AjaxService } from 'services/ajax.service';
import { MessageBarService } from 'services/message-bar.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'services/message.service';
import { AuthService } from 'services/auth.service';
declare var $: any;
const URL = {
  GET_USER: "ed/ed01/getIdCard"
}

@Component({
  selector: 'app-ed01',
  templateUrl: './ed01.component.html',
  styleUrls: ['./ed01.component.css']
})
export class Ed01Component implements OnInit {
  IdCard: any;
  breadcrumb: BreadCrumb[] = [
    { label: "ยืนยันเลขบัตรประชาชน", route: "#" }
  ];
  loading: boolean = false;
  datas: any[] = [];
  datasPosition:any[] = [];
  ConfirmIdCard: FormGroup
  constructor(
    private ajax: AjaxService,
    private messageBar: MessageBarService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {
    this.ConfirmIdCard = this.formBuilder.group({
      name: ["", Validators.required],
      position: ["", Validators.required],
      department: ["", Validators.required],
      idCardNumber: ["", Validators.required],
      username: ["", Validators.required],
      officeCode: ["", Validators.required]
    });
  }

  ngOnInit() {
   let test =  "I wish I were big.".toUpperCase();
console.log("test :",test);


    const URL = "ed/ed01/userProfile"
    this.ajax.doPost(URL, {}).subscribe((res: any) => {
      console.log(res.data);
      console.log("username :", res.data.username);
      this.ConfirmIdCard.patchValue({
        name: res.data.userThaiName + ' ' + res.data.userThaiSurname,
        position: res.data.title,
        department: res.data.departmentName,
        username: res.data.username,
        officeCode: res.data.officeCode
      })
      this.getdataintable();
    });
  }

  getdataintable() {
    let username = this.ConfirmIdCard.value.username;
    this.ajax.doGet(`${URL.GET_USER}/${username}`).subscribe((response: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == response.status) {
        console.log("datasetidcard : ",response.data);

        if(response.data == ''){

        }else{
          this.IdCard = this.checknull(response.data[0].edPersonId);
        }
        this.checkIdCard();
      } else {
        this.messageBar.errorModal(response.message);
      }
    }, err => {
      this.messageBar.errorModal("กรุณาติดต่อผู้ดูแลระบบ");
    });
  }



  checknull(data) {
    var rel = "";
    (data) ? rel = data : rel = "";
    return rel
  }

  checkIdCard() {
    if (this.IdCard != null) {
      this.ConfirmIdCard.patchValue({
        idCardNumber: this.IdCard
      });
    }
  }

  saveConfirmIdCard() {
    console.log("saveConfirmIdCard :", this.ConfirmIdCard.value);
    this.messageBar.comfirm(confirm => {
      if (confirm) {
        const URL = "ed/ed01/saveUserProfile"
        this.ajax.doPost(URL, this.ConfirmIdCard.value).subscribe((res: ResponseData<any>) => {
          console.log("dataList", res);
          if (MessageService.MSG.SUCCESS == res.status) {
            this.messageBar.successModal(res.message)
          } else {
            this.messageBar.errorModal(res.message)
          }
        })
      }
    }, "ยืนยันการบันทึกข้อมูล")
  }

  routeTo(parth: string) {
    this.router.navigate([parth])
  }

  clear() {
    this.loading = true;
    this.ConfirmIdCard.get('idCardNumber').reset();
  }

}
