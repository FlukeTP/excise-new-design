import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadCrumb } from 'models/breadcrumb.model';
import { ResponseData } from 'models/index';
import { AjaxService, MessageBarService, MessageService } from 'services/index';
import { Ope041301ApproveVo, Ope041301CheckerVo, Ope041301Vo, Ope041301FormVo } from './ope041301vo.model';
import { FormGroup, FormBuilder } from '@angular/forms';
import { TypeOfCompany, TypeOfLicense } from './ope041301.mock';

const URL = {
  GET_FIND: "oa/04/13/findPlan",
  PUT_UPDATE: "oa/04/13/update"
}

@Component({
  selector: 'app-ope041301',
  templateUrl: './ope041301.component.html',
  styleUrls: ['./ope041301.component.css']
})
export class Ope041301Component implements OnInit {
  breadcrumb: BreadCrumb[] = [
    { label: "ตรวจปฏิบัติการ", route: "#" },
    { label: "สุรากลั่นชุมชน", route: "#" },
    { label: "อนุมัติการออกตรวจ", route: "#" },
    { label: "รายละเอียดแผนงานการออกตรวจ", route: "#" },
  ];
  id: string = "";
  form: FormGroup = new FormGroup({});
  data: Ope041301Vo = null;
  listApprove: Ope041301ApproveVo[] = [];
  listChecker: Ope041301CheckerVo[] = [];
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
    this.ajaxService.doGet(`${URL.GET_FIND}/${this.id}`).subscribe((response: ResponseData<Ope041301Vo>) => {
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
    const data: Ope041301FormVo = this.form.value;
    this.ajaxService.doPut(`${URL.PUT_UPDATE}/${id}/${status}`, data).subscribe((response: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == response.status) {
        this.data = response.data;
        this.msg.successModal(response.message, "สำเร็จ", (event: boolean) => {
          if (event) {
            this.router.navigate(['/ope04/13/']);
          }
        });
      } else {
        this.msg.errorModal(response.message);
      }
    });
  }

  back() {
    this.router.navigate(['/ope04/13/']);
  }

  checkTypeOfCompany(type: string): string {
    return TypeOfCompany[type.trim()];
  }

  checkTypeOfLicense(type: string): string {
    return TypeOfLicense[type.trim()];
  }

}
