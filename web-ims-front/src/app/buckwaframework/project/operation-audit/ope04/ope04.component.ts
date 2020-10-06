import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TextDateTH } from 'helpers/index';
import { BreadCrumb, ResponseData } from 'models/index';
import * as moment from 'moment';
import * as OPE0201ACTION from "projects/operation-audit/ope02/ope0201/ope0201.action";
import * as OPE020102ACTION from "projects/operation-audit/ope02/ope0201/ope020102/ope020102.action";
import * as OPE020103ACTION from "projects/operation-audit/ope02/ope0201/ope020103/ope020103.action";
import { AjaxService, AuthService, MessageBarService, MessageService } from 'services/index';
import { listOaPlan, OaPlan, planMonthVo } from '../ope02/ope02.model';
import { Ope020102Store } from '../ope02/ope0201/ope020102/ope020102.model';
import { Ope020103Store } from '../ope02/ope0201/ope020103/ope020103.model';
import { Ope0201 } from '../ope02/ope0201/ope0201Vo.model';

declare var $: any;

const URL = {
  GET_DETAILS: "oa/02/findPlanACH",
  PUT_UPDATE: "oa/02/01/save",
}


@Component({
  selector: 'app-ope04',
  templateUrl: './ope04.component.html',
  styleUrls: ['./ope04.component.css']
})
export class Ope04Component implements OnInit {

  breadcrumb: BreadCrumb[] = [
    { label: "ตรวจปฏิบัติการ", route: "#" },
    { label: "สุรากลั่นชุมชน", route: "#" },
    { label: "แผนการออกตรวจประจำปี", route: "#" },
  ];
  dataTables: any = [];
  yearSelect: string = "";
  selectZone: string = "";
  months: any[] = [];
  respData: OaPlan[] = [];
  monthObj: planMonthVo;
  selectYear: string[];
  formYear: FormGroup;
  ope0201: Ope0201;
  constructor(
    private router: Router,
    private ajax: AjaxService,
    private msg: MessageBarService,
    private store: Store<AppState>,
    private authService: AuthService
  ) {
    this.months = [];

    // this.monthObj
    this.formYear = new FormGroup({
      year: new FormControl('2562')
    });
    this.ope0201 = {
      auditStartDate: null,
      auditEndDate: null,
      auditYear: "",
    }

  }

  ngOnInit() {
    this.findPlan();
    this.getRoles();
    this.selectYear = ['2561', '2562', '2563'];
  }

  ngAfterViewInit() {

  }

  role: string[] = [];
  async getRoles() {
    await this.authService.getUserProfile().then(res => {
      if (res) {
        this.role = this.authService.getRole();
      }
    });
  }

  checkRole(listAuthRole: string[]): boolean {
    for (let i = 0; i < listAuthRole.length; i++) {
      for (let j = 0; j < this.role.length; j++) {
        if (listAuthRole[i] == this.role[j]) {
          return true;
        }
      }
    }
    return false;
  }

  onSearchPlan() {
    this.months = [];
    this.findPlan();
  }

  handleSearch(event) {
    console.log("event", this.formYear.value.year);

  }

  findPlan() {
    this.ajax.doGet(URL.GET_DETAILS + "/" + this.formYear.value.year).subscribe((response: ResponseData<listOaPlan>) => {
      if (MessageService.MSG.SUCCESS == response.status) {
        this.respData = response.data.listPlan;
        // console.log("find plan year ", this.respData);
        this.resultToMonth();
      } else {
        this.msg.errorModal(response.message);
      }

    });
  }

  resultToMonth() {
    for (let month = 0; month < 12; month++) {
      let plan: OaPlan[] = [];
      this.monthObj = this.initVo();

      this.monthObj.name = TextDateTH.months[month];
      plan = this.findDatamonth(month);
      this.monthObj.year = "2562";
      if (plan != undefined) {
        plan.forEach(element => {
          if (element.status == "1" || element.status == "4") {
            this.monthObj.create.push(element);
          } else if (element.status == "2") {
            this.monthObj.waiting.push(element);
          } else if (element.status == "3") {
            this.monthObj.approve.push(element);
          } else if (element.status == "5") {
            this.monthObj.audit.push(element);
          } else if (element.status == "6") {
            this.monthObj.close.push(element);
          }
        });
      }
      this.months.push(this.monthObj);
      // console.log(" find mont obj",  this.monthObj);

    }
  }

  findDatamonth(month: number): OaPlan[] {
    let plan: OaPlan[] = [];

    for (let i = 0; i < this.respData.length; i++) {
      const element = this.respData[i];
      let startMonth = moment(element.auditStart).month();
      if (month == startMonth) {
        // let plan = element;
        let index = this.respData.indexOf(element);
        if (index !== -1) {
          plan.push(element);

          this.respData.splice(index, 1);
          i--;
        }
        // return plan;
      }
    }
    return plan;
  }

  exportPDF = e => {
    var form = document.createElement("form");
    form.method = "POST";
    form.target = "_blank";
    form.action = AjaxService.CONTEXT_PATH + "hyddocabon/pdf/oa/hydDocabonService";

    // window.open("/hyddocabon/pdf/oa/hydDocabonService/file", "_blank");
    form.style.display = "none";
    var jsonInput = document.createElement("input");
    jsonInput.name = "json";
    form.appendChild(jsonInput);


    document.body.appendChild(form);
    form.submit();
  };

  progressClass(progress: number) {
    if (progress <= 24 && progress >= 0) {
      return 'ui active progress red';
    } else if (progress <= 50 && progress >= 25) {
      return 'ui active progress';
    } else if (progress <= 75 && progress >= 51) {
      return 'ui active progress warning';
    } else if (progress <= 100 && progress >= 76) {
      return 'ui active progress success';
    }
  }

  toSubPage(path: any) {
    this.router.navigate(['/' + path]);
  }

  search() { }

  createPlan() {
    this.ope0201.auditYear = this.formYear.value.year;
    this.store.dispatch(new OPE0201ACTION.UpdateOpe0201(this.ope0201));
    // this.store.dispatch(new OPE0201ACTION.ClearOpe0201());
    this.store.dispatch(new OPE020103ACTION.ClearLicenseUserAuditer());
    this.store.dispatch(new OPE020102ACTION.ClearLicenseCustomer());
    this.router.navigate(['/ope04/01'], {
      queryParams: {
        to: "DETAIL"
      }
    });
  }

  managePlan(type = "DETAIL") {
    this.router.navigate(['/ope04/01'], {
      queryParams: {
        to: type
      }
    });
  }

  gotoDetail(plan: OaPlan, status: string) {
    // console.log("deltail ", plan);
    this.router.navigate(['/ope04/01'], {
      queryParams: {
        to: this.convertStatusFromStirng(status),
        planId: plan.oaPlanId
      }
    });
  }

  gotoWaiting(plan: OaPlan, status: string) {
    this.router.navigate(['/ope04/01'], {
      queryParams: {
        to: this.convertStatusFromStirng(status),
        planId: plan.oaPlanId
      }
    });

  }

  convertStatusFromStirng(type: string): string {
    if (type == '1') {
      return "CREATE";
    } else if (type == '2') {
      return "WAITING"
    } else if (type == '3') {
      return ""
    }
  }

  initVo(): planMonthVo {
    return {
      name: "",
      year: null,
      create: [
      ],
      waiting: [
      ],
      approve: [
      ],
      audit: [
      ],
      close: [
      ]
    };
  }

}
interface AppState {
  Ope02: {
    Ope020102: Ope020102Store,
    Ope020103: Ope020103Store,
    Ope0201: Ope0201
  }
}