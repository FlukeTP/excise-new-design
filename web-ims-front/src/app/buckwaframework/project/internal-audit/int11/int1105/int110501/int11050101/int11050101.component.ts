import { Component, OnInit } from '@angular/core';
import { BreadCrumb, ResponseData } from 'models/index';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MessageBarService } from 'services/message-bar.service';
import { AjaxService } from 'services/ajax.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'services/message.service';

declare var $: any;

const URLS = {
  GET_DETAIL_EDIT: "ia/int11/01/01/findConcludeFollowEdit",
}

@Component({
  selector: 'app-int11050101',
  templateUrl: './int11050101.component.html',
  styleUrls: ['./int11050101.component.css']
})
export class Int11050101Component implements OnInit {

  id: any;
  idHead: any;
  detailList: any;
  issuesFont: any;
  whatShouldBeFont: any;
  editForm: FormGroup;

  breadcrumb: BreadCrumb[] = [
    { label: "ตรวจสอบภายใน", route: "#" },
    { label: "สรุปผลการตรวจและติดตาม", route: "#" },
    { label: "รายงานผลการปฏิบัติตามข้อเสนอแนะ", route: "#" },
    { label: "รายละเอียดรายงานผลการปฏิบัติตามข้อเสนอแนะ", route: "#" },
    { label: "แก้ไขรายละเอียดรายงานผลการปฏิบัติตามข้อเสนอแนะ", route: "#" },
  ];

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
      whatShouldBe: ["", Validators.required],
      guidelinesDeveloping: ["", Validators.required],
      reference: ["", Validators.required]
    });
  }

  ngOnInit() {
    this.idHead = this.route.snapshot.queryParams["detailId"]
    this.id = this.route.snapshot.queryParams["editId"];
    this.getDataList();

  }

  ngAfterViewInit(): void {
    $('textarea.ui.issues').prop('disabled', true);
    $('textarea.ui.whatShouldBe').prop('disabled', true);
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.

  }

  getDataList() {
    this.ajaxService.doGet(`${URLS.GET_DETAIL_EDIT}/${this.id}`).subscribe((result: any) => {
      if (MessageService.MSG.SUCCESS == result.status) {
        this.detailList = result.data;
        this.issuesFont = this.detailList[0].issues
        this.whatShouldBeFont = this.detailList[0].whatShouldBe
        this.editForm.patchValue({
          issues: this.detailList[0].issues,
          whatShouldBe: this.detailList[0].whatShouldBe,
          guidelinesDeveloping: this.detailList[0].guidelinesDeveloping,
          reference: this.detailList[0].reference
        })
        console.log("detailList : ", this.detailList);
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
        var URL = "ia/int11/05/01/01/editDetailPerformance";
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
        detailId: fontEditId
      }
    })
  }

}
