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

@Component({
  selector: 'app-ed0201',
  templateUrl: './ed0201.component.html',
  styleUrls: ['./ed0201.component.css']
})
export class Ed0201Component implements OnInit {
  breadcrumb: BreadCrumb[] = [
    { label: "เพิ่มตำแหน่งและอัตราเบิกจ่าย", route: "#" }
  ];
  formSaveConfig: FormGroup
  edPersonSeq: any;
  dataEdit: any = [];
  headerEd:any;
  constructor(
    private ajax: AjaxService,
    private messageBar: MessageBarService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.formSaveConfig = this.formBuilder.group({
      edPersonSeq : ["", Validators.required],
      edPositionName: ["", Validators.required],
      allowancesHalfDay: ["", Validators.required],
      allowancesDay: ["", Validators.required],
      accomFeeSingle: ["", Validators.required],
      accomFeeDouble: ["", Validators.required],
      accomFeePackages: ["", Validators.required]
    });
  }
  ngOnInit() {
    this.edPersonSeq = this.route.snapshot.queryParams["editId"];
    if (this.edPersonSeq == null) {
      this.headerEd = "เพิ่มตำแหน่งและอัตราเบิกจ่าย"
    } else {
      this.getDataEdit();
      this.headerEd = "แก้ไขตำแหน่งและอัตราเบิกจ่าย"
    }
  }

  saveConfig() {
    console.log("saveConfig :", this.formSaveConfig.value);
    this.messageBar.comfirm(confirm => {
      if (confirm) {
        const URL = "ed/ed02/01/saveConfigPosition"
        this.ajax.doPost(URL, this.formSaveConfig.value).subscribe((res: ResponseData<any>) => {
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

  getDataEdit() {
    let edPersonSeq = this.edPersonSeq;
    const URL = "ed/ed02/01/getConfigEdit"
    this.ajax.doGet(`${URL}/${edPersonSeq}`).subscribe((response: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == response.status) {
        console.log("datasetidcard : ", response.data);
        this.dataEdit = response.data[0]
        this.formSaveConfig.patchValue({
          edPositionName: this.dataEdit.edPositionName,
          allowancesHalfDay: this.dataEdit.allowancesHalfDay,
          allowancesDay: this.dataEdit.allowancesDay,
          accomFeeSingle: this.dataEdit.accomFeeSingle,
          accomFeeDouble: this.dataEdit.accomFeeDouble,
          accomFeePackages: this.dataEdit.accomFeePackages
        });
      } else {
        this.messageBar.errorModal(response.message);
      }
    }, err => {
      this.messageBar.errorModal("กรุณาติดต่อผู้ดูแลระบบ");
    });
  }

  editDataposition() {
    console.log(this.formSaveConfig.value);
    this.formSaveConfig.patchValue({
      edPersonSeq : this.edPersonSeq
    })
    this.messageBar.comfirm(confirm => {
      if (confirm) {
        const URL = "ed/ed02/01/updateConfigposition"
        this.ajax.doPost(URL, this.formSaveConfig.value).subscribe((res: ResponseData<any>) => {
          console.log("dataList", res);
          if (MessageService.MSG.SUCCESS == res.status) {
            this.messageBar.successModal(res.message)
          } else {
            this.messageBar.errorModal(res.message)
          }
        })
      }
    }, "ยืนยันการแก้ไขข้อมูล")
  }

  routeTo(parth: string) {
    this.router.navigate([parth])
  }
}
