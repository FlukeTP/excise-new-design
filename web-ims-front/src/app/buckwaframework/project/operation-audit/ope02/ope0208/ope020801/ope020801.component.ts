import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadCrumb } from 'models/breadcrumb.model';
import { ResponseData } from 'models/index';
import { AjaxService, MessageBarService, MessageService } from 'services/index';
import { Ope020801ApproveVo, Ope020801CheckerVo, Ope020801Vo, Ope020801FormVo } from './ope020801vo.model';
import { FormGroup, FormBuilder } from '@angular/forms';
import { TypeOfCompany, TypeOfLicense } from './ope020801.mock';

const URL = {
  GET_FIND: "oa/02/08/findPlan",
  PUT_UPDATE: "oa/02/08/update"
}

@Component({
  selector: 'app-ope020801',
  templateUrl: './ope020801.component.html',
  styleUrls: ['./ope020801.component.css']
})
export class Ope020801Component implements OnInit {
  breadcrumb: BreadCrumb[] = [
    { label: "ตรวจปฏิบัติการ", route: "#" },
    { label: "น้ำมันหล่อลื่น", route: "#" },
    { label: "อนุมัติการออกตรวจ", route: "#" },
    { label: "รายละเอียดแผนงานการออกตรวจ", route: "#" },
  ];
  id: string = "";
  form: FormGroup = new FormGroup({});
  data: Ope020801Vo = null;
  listApprove: Ope020801ApproveVo[] = [];
  listChecker: Ope020801CheckerVo[] = [];
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private msg: MessageBarService,
    private ajaxService: AjaxService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      remark: ['']
    });
  }

  ngOnInit() {
    // TODO
    this.id = this.route.snapshot.queryParams["id"] || "";
    if (this.id) {
      this.find();
    }
  }

  find() {
    this.ajaxService.doGet(`${URL.GET_FIND}/${this.id}`).subscribe((response: ResponseData<Ope020801Vo>) => {
      if (MessageService.MSG.SUCCESS == response.status) {
        this.data = response.data;
        this.listApprove = this.data.approves;
        this.listChecker = this.data.checkers;
        this.form.get('remark').patchValue(this.data.remark);
      } else {
        this.msg.errorModal(response.message);
      }
    });
  }

  approve() {
    this.msg.comfirm((event: boolean) => {
      if (event) {
        this.update(this.id, 3);
      }
    }, MessageBarService.CONFIRM_APPROVE);
  }

  reject() {
    this.msg.comfirm((event: boolean) => {
      if (event) {
        this.update(this.id, 4);
      }
    }, MessageBarService.CONFIRM_REJECT);
  }

  update(id: string, status: number) {
    const data: Ope020801FormVo = this.form.value;
    this.ajaxService.doPut(`${URL.PUT_UPDATE}/${id}/${status}`, data).subscribe((response: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == response.status) {
        this.data = response.data;
        this.msg.successModal(response.message, "สำเร็จ", (event: boolean) => {
          if (event) {
            this.router.navigate(['/ope02/08/']);
          }
        });
      } else {
        this.msg.errorModal(response.message);
      }
    });
  }

  back() {
    this.router.navigate(['/ope02/08/']);
  }

  checkTypeOfCompany(type: string): string {
    return TypeOfCompany[type.trim()];
  }

  checkTypeOfLicense(type: string): string {
    return TypeOfLicense[type.trim()];
  }

}
