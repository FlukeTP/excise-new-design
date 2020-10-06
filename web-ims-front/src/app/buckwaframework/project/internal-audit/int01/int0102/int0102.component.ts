import { Component, OnInit } from '@angular/core';
import { BreadCrumb, ResponseData } from 'models/index';
import { Router, ActivatedRoute } from '@angular/router';
import { AjaxService } from 'services/ajax.service';
import { MessageService } from 'services/message.service';
import { MessageBarService } from 'services/message-bar.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DateStringPipe } from 'app/buckwaframework/common/pipes/date-string.pipe';

const URL = {
  FIND_HEADER: "/ia/int01/02/01/find-by/id-idDtl",
}

@Component({
  selector: 'app-int0102',
  templateUrl: './int0102.component.html',
  styleUrls: ['./int0102.component.css']
})
export class Int0102Component implements OnInit {
  breadcrumb: BreadCrumb[] = [
    { label: "ตรวจสอบภายใน", route: "#" },
    { label: "แผนการตรวจสอบภายใน", route: "#" },
    { label: "รายละเอียดการดำเนินการ ", route: "#" }
  ];

  planDtlId: number;
  dataHeader: FormGroup = new FormGroup({});

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private ajax: AjaxService,
    private msg: MessageBarService,
    private fb: FormBuilder
  ) { }

  initVariable() {
    this.dataHeader = this.fb.group({
      dateEndActivity: [""],
      dateStartActivity: [""],
      inspectionWork: [""],
      inspectionWorkStr: [""],
      inspector: [""],
      officer: [""]
    });
  }

  ngOnInit() {
    this.initVariable();
    this.planDtlId = this.route.snapshot.queryParams["planDtlId"] || null;
    if (this.planDtlId != null) {
      this.initData(this.planDtlId);
    }
    this.clickfirst();
  }

  clickfirst() {
    this.router.navigate(['/int01/02/01']);
  }

  initData(planDtlId: number) {
    this.ajax.doGet(`${URL.FIND_HEADER}/${planDtlId}`).subscribe((response: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == response.status) {

        this.dataHeader.get('dateEndActivity').patchValue(new DateStringPipe().transform(response.data.dateEndActivity));
        this.dataHeader.get('dateStartActivity').patchValue(new DateStringPipe().transform(response.data.dateStartActivity));
        this.dataHeader.get('inspectionWork').patchValue(response.data.inspectionWork);
        this.dataHeader.get('inspectionWorkStr').patchValue(response.data.inspectionWorkStr);
        this.dataHeader.get('inspector').patchValue(response.data.inspector);
        this.dataHeader.get('officer').patchValue(response.data.officer);
      } else {
        this.msg.errorModal(response.message);
      }
    }, err => {
      this.msg.errorModal("กรุณาติดต่อผู้ดูแลระบบ");
    });
  }

}
