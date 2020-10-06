import { Component, OnInit } from '@angular/core';
import { BreadCrumb, ResponseData } from 'models/index';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { formatter, TextDateTH } from "helpers/datepicker";
import { AjaxService } from 'services/ajax.service';
import { MessageBarService } from 'services/message-bar.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'services/message.service';
import { promise } from 'protractor';
import { Utils } from 'helpers/index';
declare var $: any;

const URL = {
  LIST_USER_PROFILE: "ed/ed01/01/listUser",
  GET_POSITION: "ed/ed01/01/listPosition",
  GET_DEPARTMENT00: "ed/ed01/01/listDepartment00",
  GET_DEPARTMENT01: "ed/ed01/01/listDepartment01"
}
@Component({
  selector: 'app-ed0102',
  templateUrl: './ed0102.component.html',
  styleUrls: ['./ed0102.component.css']
})
export class Ed0102Component implements OnInit {
  showFormDown: boolean = false;
  datas: any = [];
  datasPosition: any = [];
  datasDepartment00: any = [];
  datasDepartment01: any = [];
  datatable: any;
  breadcrumb: BreadCrumb[] = [
    { label: "รายชื่อพนักงานที่ไม่มีรหัสเข้าใช้ระบบ", route: "#" }
  ];
  addUser: FormGroup
  constructor(
    private ajax: AjaxService,
    private messageBar: MessageBarService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.addUser = this.formBuilder.group({
      name: ["", Validators.required],
      positionSeq: ["", Validators.required],
      position: ["", Validators.required],
      department: ["", Validators.required],
      idCardNumber: ["", Validators.required],
      officeCode: ["", Validators.required],
      toDepartment: ["", Validators.required]
    });
  }

  async ngOnInit() {
    this.getdata();
    await this.getPosition();

  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      $("#position").dropdown().css('width', '100%');
      $("#officeCode").dropdown().css('width', '100%');
      console.log("calllll");
    }, 500);
  }

  // checkIdCard() {
  //   let id_val = this.addUser.value.idCardNumber
  //   let sum : any;
  //   if (id_val.length != 13) 
  //     return false;
  //   for (let i = 0, sum = 0; i < 12; i++)
  //     sum += parseFloat(id_val.charAt(i)) * (13 - i); if ((11 - sum % 11) % 10 != parseFloat(id_val.charAt(12)))
  //     return false; 
  //     return true;
  //     console.log("SUM : ",sum);

  // }

  getdata() {
    this.ajax.doGet(`${URL.LIST_USER_PROFILE}`).subscribe((response: ResponseData<any>) => {
      if (response.status === MessageService.MSG.SUCCESS) {
        this.datas = response.data
        this.initDatatable()
        console.log("response.data : ", response.data);
      } else {
        this.messageBar.errorModal(response.message);
      }
    }, error => {
      this.messageBar.errorModal("กรุณาติดต่อผู้ดูแลระบบ");
    });
  }


  getPosition() {
    return new Promise((resolve, reject) => {
      this.ajax.doGet(`${URL.GET_POSITION}`).subscribe((response: ResponseData<any>) => {
        if (response.status === MessageService.MSG.SUCCESS) {
          this.datasPosition = response.data
          resolve(response.data)
          console.log("datasPosition : ", response.data);
        } else {
          reject(response)
          this.messageBar.errorModal(response.message);
        }
      }, error => {
        reject(error)
        this.messageBar.errorModal("กรุณาติดต่อผู้ดูแลระบบ");
      });
    })
  }

  initDatatable(): void {
    if (this.datatable != null) {
      this.datatable.destroy();
    }
    this.datatable = $("#dataTable").DataTableTh({
      lengthChange: false,
      searching: false,
      ordering: false,
      processing: true,
      serverSide: false,
      paging: false,
      data: this.datas,
      columns: [
        {
          className: "ui center aligned",
          render: function (data, type, row, meta) {
            return meta.row + meta.settings._iDisplayStart + 1;
          }
        },
        {
          data: "edPersonId",
          className: "center aglined",
          render: function (data, type, row, meta) {
            let dataout
            if (row.edLogin != null) {
              dataout = "*************"
            } else {
              dataout = data;
            }
            return dataout;
          }
        },
        {
          data: "edPersonName",
          className: "left aglined"
        },
        {
          data: "edPositionName",
          className: "left aglined"
        },
        {
          data: "exciseDepartmentVo",
          className: "left aglined",
          render: function (data, type, row, meta) {
            let datas
            if (data == null) {
              datas = " - "
            } else {
              let datadd
              if (data.area == null) {
                datadd = ' '
              } else {
                datadd = data.area
              }
              datas = data.sector + ' ' + datadd;
            }
            return datas;
          }
        }
      ]
    });
  }

  RaDepartment(event) {
    const value: string = this.addUser.get('toDepartment').value;
    switch (value) {
      case "00":
        this.ajax.doGet(`${URL.GET_DEPARTMENT00}`).subscribe((response: ResponseData<any>) => {
          if (response.status === MessageService.MSG.SUCCESS) {
            this.datasDepartment00 = response.data
            console.log("datasDepartment00 : ", response.data);
          } else {
            this.messageBar.errorModal(response.message);
          }
        }, error => {
          this.messageBar.errorModal("กรุณาติดต่อผู้ดูแลระบบ");
        });
        $("#officeCode").dropdown("restore defaults");
        break;
      case "01":
        this.ajax.doGet(`${URL.GET_DEPARTMENT01}`).subscribe((response: ResponseData<any>) => {
          if (response.status === MessageService.MSG.SUCCESS) {
            this.datasDepartment00 = response.data
            console.log("datasDepartment01 : ", response.data);
          } else {
            this.messageBar.errorModal(response.message);
          }
        }, error => {
          this.messageBar.errorModal("กรุณาติดต่อผู้ดูแลระบบ");
        });
        $("#officeCode").dropdown("restore defaults");
        break;
    }
  }

  saveAddUser() {
    // this.checkIdCard();
    let Datasplit = this.addUser.value.position.split("|")
    this.addUser.patchValue({
      positionSeq: Datasplit[0],
      position: Datasplit[1]
    })
    this.messageBar.comfirm(confirm => {
      if (confirm) {
        const URL = "ed/ed01/saveUserProfile"
        this.ajax.doPost(URL, this.addUser.value).subscribe((res: ResponseData<any>) => {
          console.log("dataList", res);
          if (MessageService.MSG.SUCCESS == res.status) {
            this.messageBar.successModal(res.message)
            this.getdata();
            this.clearForm();
          } else {
            this.messageBar.errorModal(res.message)
          }
        })
      }
    }, "ยืนยันการบันทึกข้อมูล")
  }

  clearForm() {
    this.addUser.reset();
    $("#position").dropdown("restore defaults");
    $("#officeCode").dropdown("restore defaults");
  }

  showform() {
    if (this.showFormDown) {
      this.showFormDown = false;
      console.log("showFormDown", this.showFormDown);
    } else {
      this.showFormDown = true;
      setTimeout(() => {
        $("#position").dropdown().css('width', '100%');
        $("#officeCode").dropdown().css('width', '100%');
        console.log("calllll");
      }, 500);
      console.log("showFormDown 2 ", this.showFormDown);
    }
  }

  routeTo(parth: string) {
    this.router.navigate([parth])
  }

}