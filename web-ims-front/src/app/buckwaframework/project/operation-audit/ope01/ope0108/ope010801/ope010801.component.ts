import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadCrumb } from 'models/breadcrumb.model';
import { ResponseData } from 'models/index';
import { AjaxService, MessageBarService, MessageService } from 'services/index';
import { Ope010801ApproveVo, Ope010801CheckerVo, Ope010801Vo, Ope010801FormVo } from './ope010801vo.model';
import { FormGroup, FormBuilder } from '@angular/forms';
import { TypeOfCompany, TypeOfLicense } from './ope010801.mock';

const URL = {
  GET_FIND: "oa/01/08/findPlan",
  PUT_UPDATE: "oa/01/08/update"
}

@Component({
  selector: 'app-ope010801',
  templateUrl: './ope010801.component.html',
  styleUrls: ['./ope010801.component.css']
})
export class Ope010801Component implements OnInit {
  breadcrumb: BreadCrumb[] = [
    { label: "ตรวจปฏิบัติการ", route: "#" },
    { label: "สารละลายประเภทไฮโดรคาร์บอน", route: "#" },
    { label: "อนุมัติการออกตรวจ", route: "#" },
    { label: "รายละเอียดแผนงานการออกตรวจ", route: "#" },
  ];
  id: string = "";
  form: FormGroup = new FormGroup({});
  data: Ope010801Vo = null;
  listApprove: Ope010801ApproveVo[] = [];
  listChecker: Ope010801CheckerVo[] = [];
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
    this.ajaxService.doGet(`${URL.GET_FIND}/${this.id}`).subscribe((response: ResponseData<Ope010801Vo>) => {
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
    const data: Ope010801FormVo = this.form.value;
    this.ajaxService.doPut(`${URL.PUT_UPDATE}/${id}/${status}`, data).subscribe((response: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == response.status) {
        this.data = response.data;
        this.msg.successModal(response.message, "สำเร็จ", (event: boolean) => {
          if (event) {
            this.router.navigate(['/ope01/08/']);
          }
        });
      } else {
        this.msg.errorModal(response.message);
      }
    });
  }

  back() {
    this.router.navigate(['/ope01/08/']);
  }

  checkTypeOfCompany(type: string): string {
    return TypeOfCompany[type.trim()];
  }

  checkTypeOfLicense(type: string): string {
    return TypeOfLicense[type.trim()];
  }

}
