import { Component, OnInit } from '@angular/core';
import { BreadCrumb ,ResponseData } from 'models/index';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MessageBarService } from 'services/message-bar.service';
import { AjaxService } from 'services/ajax.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'services/message.service';
const URLS = {
  GET_DETAIL_EDIT: "ia/int11/01/01/findConcludeFollowEdit",
}
@Component({
  selector: 'app-int110101',
  templateUrl: './int110101.component.html',
  styleUrls: ['./int110101.component.css']
})
export class Int110101Component implements OnInit {
  breadcrumb: BreadCrumb[] = [
    { label: "ตรวจสอบภายใน", route: "#" },
    { label: "สรุปผลการตรวจและติดตาม", route: "#" },
    { label: "สรุปผลการตรวจสอบภายใน", route: "#" },
    { label: "แก้ไขรายละเอียดการสรุปผลการตรวจสอบภายใน", route: "#" },
  ];

  editForm: FormGroup;
  id : any;
  idHead : any;
  detailList: any;

  constructor(
    private fb: FormBuilder,
    private messageBarService: MessageBarService,
    private ajaxService: AjaxService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.editForm = this.fb.group({
      id: ["", Validators.required],
      issues: ["", Validators.required],
      detectedObserved: ["", Validators.required],
      whatShouldBe: ["", Validators.required],
      riskEffect: ["", Validators.required],
      cause: ["", Validators.required],
      recommend: ["", Validators.required]
    });
  }

  ngOnInit() {
    this.idHead = this.route.snapshot.queryParams["detailId"]
    console.log("idHead : ",this.idHead);
    
    this.id = this.route.snapshot.queryParams["editId"];
    this.getDataList();
  }

  getDataList() {
    this.ajaxService.doGet(`${URLS.GET_DETAIL_EDIT}/${this.id}`).subscribe((result: any) => {
      if (MessageService.MSG.SUCCESS == result.status) {
        this.detailList = result.data;
        this.editForm.patchValue({
          issues: this.detailList[0].issues ,
          detectedObserved: this.detailList[0].detectedObserved ,
          whatShouldBe: this.detailList[0].whatShouldBe ,
          riskEffect: this.detailList[0].riskEffect ,
          cause: this.detailList[0].cause ,
          recommend: this.detailList[0].recommend 
        })
        console.log("detailList : ",this.detailList);
      } else {
        this.messageBarService.errorModal(result.message);
      }
    })
  }

  sendEdit() {
    console.log("editForm : ", this.editForm.value);
    this.messageBarService.comfirm((comfirm) => {
      if (comfirm) {
        this.editForm.patchValue({
          id: this.id
        })
        var URL = "ia/int11/01/01/editDetails";
        this.ajaxService.doPost(URL, this.editForm.value).subscribe((res: ResponseData<any>) => {
          if (MessageService.MSG.SUCCESS == res.status) {
            this.messageBarService.successModal(res.message)
          } else {
            this.messageBarService.errorModal(res.message)
          }
        })
      }
    }, "ยืนยันการแก้ไข")
  }

  routeTo(parth: string, fontEditId: number) {
    this.router.navigate([parth], {
      queryParams: {
        detailId : fontEditId
      }
    })
  }

}

