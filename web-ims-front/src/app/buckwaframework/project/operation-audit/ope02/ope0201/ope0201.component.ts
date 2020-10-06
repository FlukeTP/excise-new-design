import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { formatter, TextDateTH } from 'helpers/datepicker';
import { BreadCrumb, ResponseData } from 'models/index';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { AjaxService, MessageBarService, MessageService } from 'services/index';
import * as OPE0201ACTION from "./ope0201.action";
import * as OPE020102ACTION from "./ope020102/ope020102.action";
import { Ope0201001Vo, Ope020102Store, Ope020102Vo } from './ope020102/ope020102.model';
import * as OPE020103ACTION from "./ope020103/ope020103.action";
import { Ope020103Store, Ope020103Vo } from './ope020103/ope020103.model';
import { Ope0201, Ope0201FromVo, Ope0201Vo } from './ope0201Vo.model';

declare var $: any;

const URL = {
  GET_DETAILS: "oa/02/01/02/getLicensePlan",
  PUT_SAVE: "oa/02/01/save",
  PUT_UPDATE: "oa/02/01/update",
  GET_PLAN_DETAIL: "oa/02/01/findOaPlan",
  GET_APPROVER: "oa/02/01/findApprover",
  GET_SENDAPPROVE: "oa/02/01/sendApprove",
}

@Component({
  selector: 'app-ope0201',
  templateUrl: './ope0201.component.html',
  styleUrls: ['./ope0201.component.css']
})
export class Ope0201Component implements OnInit {
  header: string = "สร้างแผนการออกตรวจ";
  breadcrumb: BreadCrumb[] = [
    { label: "ตรวจปฏิบัติการ", route: "#" },
    { label: "น้ำมันหล่อลื่น", route: "#" },
    { label: "สร้างแผนการออกตรวจ", route: "#" }
  ];
  licenseTypeArr = {
    A: "ผู้ใช้",
    B: "ตัวแทน",
  }
  customerLicense: Ope020102Vo[] = [];
  auditer: Ope020103Vo[] = [];
  approver: Ope020103Vo[] = [];
  // companies: any[] = [];
  // employees: any[] = [];
  company: Ope0201001Vo;
  auditors: Ope020103Vo;
  ope020102: Ope0201001Vo[] = [];
  dataStore: Observable<Ope020102Store>;
  ope020102Store: Ope020102Store;
  data020103Store: Observable<Ope020103Store>;
  ope020103Store: Ope020103Store;
  from: FormGroup;
  year: string;

  resultCompany: boolean = false;
  resultAuditer: boolean = false;
  submitted: boolean = false;
  planStatus: string;
  planId: string;
  ope0201: Ope0201;
  ope0201Store: Observable<Ope0201>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private msg: MessageBarService,
    private ajax: AjaxService,
    private store: Store<AppState>,
    private fb: FormBuilder,

  ) {

    this.ope0201 = {
      auditStartDate: null,
      auditEndDate: null,
      auditYear: "",
    }
    this.year = "2562";
  }

  ngOnInit() {
    this.company = this.initVo();
    this.auditors = this.initAuVo();
    this.getApprover();

    this.planStatus = this.route.snapshot.queryParams["to"] || "";
    this.planId = this.route.snapshot.queryParams["planId"] || "";

    this.from = this.fb.group({
      dateFrom: [new Date()],
      dateTo: [new Date()],
    });
    $(".ui.dropdown").dropdown();

    if (this.planStatus == "CREATE") {
      this.findOaPlan();
    } else if (this.planStatus == "WAITING") {
      this.findOaPlan();
    } else {
      this.getDataStore();
    }

  }

  ngAfterViewInit(): void {
    if (this.onApprove) {
      this.breadcrumb[this.breadcrumb.length - 1] = { label: "อนุมัติแผนการออกตรวจ", route: "#" };
      this.header = "อนุมัติแผนการออกตรวจ";
    }
    this.calenda();
    this.getCustomerLicense();
  }

  getDataStore() {
    // this.store.dispatch(new OPE020102ACTION.UpdateLicenseCustomer(this.formData));
    this.dataStore = this.store.select(state => state.Ope02.Ope020102);
    this.data020103Store = this.store.select(state => state.Ope02.Ope020103);
    this.ope0201Store = this.store.select(state => state.Ope02.Ope0201);
    this.ope0201Store.subscribe(data => {
      this.ope0201 = data;
    });

    this.year = this.ope0201.auditYear;
    this.from.patchValue({ dateFrom: this.ope0201.auditStartDate, dateTo: this.ope0201.auditEndDate });
    setTimeout(() => {
      const dateS: Date = this.from.value.dateFrom ? new Date(this.from.value.dateFrom) : new Date();
      $('#date1').calendar('set date', moment(dateS).toDate());
      const dateE: Date = this.from.value.dateTo ? new Date(this.from.value.dateTo) : new Date();
      $('#date2').calendar('set date', moment(dateE).toDate());
    }, 200);

    this.dataStore.subscribe(data => {
      while (this.ope020102.length > 0) {
        this.ope020102.pop();
      }
      data.customerLicenseList.forEach(element => {
        this.ope020102.push(element)
      });

      if (this.ope020102.length > 0) {
        this.resultCompany = true;
      }
    });

    this.data020103Store.subscribe(data => {
      while (this.auditer.length > 0) {
        this.auditer.pop();
      }

      data.auditer.forEach(element => {
        this.auditer.push(element)
      });

      if (this.auditer.length > 0) {
        this.resultAuditer = true;
      }
    });

  }

  onSavePlan() {
    this.submitted = true;
    let oaPlan: Ope0201FromVo = this.initOaPlanV();
    oaPlan.fiscolYear = this.year;
    oaPlan.dateFrom = this.from.value.dateFrom;
    oaPlan.dateTo = this.from.value.dateTo;
    oaPlan.listCompany = this.ope020102;
    oaPlan.listAuditer = this.auditer;
    oaPlan.planId = this.planId;
    if (this.planId == "") {
      this.ajax.doPut(`${URL.PUT_SAVE}`, oaPlan).subscribe((response: ResponseData<Ope0201FromVo>) => {
        if (MessageService.MSG.SUCCESS == response.status) {
          this.msg.successModal(response.message);
          // [routerLink]="['/ope02']"
          this.router.navigate(["/ope02"]);
        } else {
          this.msg.errorModal(response.message);
        }
      });
    } else {
      this.ajax.doPut(`${URL.PUT_UPDATE}`, oaPlan).subscribe((response: ResponseData<Ope0201FromVo>) => {
        if (MessageService.MSG.SUCCESS == response.status) {
          this.msg.successModal(response.message);
          // [routerLink]="['/ope02']"
          this.router.navigate(["/ope02"]);
        } else {
          this.msg.errorModal(response.message);
        }
      });

    }

  }

  onSendApprove() {
    this.ajax.doGet(`${URL.GET_SENDAPPROVE}/${this.planId}`).subscribe((response: ResponseData<Ope0201FromVo>) => {
      if (MessageService.MSG.SUCCESS == response.status) {
        this.msg.successModal(response.message);
        // [routerLink]="['/ope02']"
        this.router.navigate(["/ope02"]);
      } else {
        this.msg.errorModal(response.message);
      }
    });
  }

  findOaPlan() {
    this.ajax.doGet(`${URL.GET_PLAN_DETAIL}/${this.planId}`).subscribe((response: ResponseData<Ope0201FromVo>) => {
      if (MessageService.MSG.SUCCESS == response.status) {
        let companyList: Ope0201001Vo[] = response.data.listCompany;
        let auditerList: Ope020103Vo[] = response.data.listAuditer;

        let companyStore: Ope020102Store = {
          customerLicenseList: []
        };
        let auditStore: Ope020103Store = {
          auditer: []
        };


        companyList.forEach(element => {
          let company: Ope0201001Vo = this.initVo();
          company.officeName1 = element.officeName1
          company.officeName2 = element.officeName2
          company.companyName = element.companyName
          company.licenseType = element.licenseType
          company.oaCuslicenseId = element.oaCuslicenseId
          company.licensePlanId = element.licensePlanId
          companyStore.customerLicenseList.push(company);
        });
        this.ope020102 = companyList;

        if (this.ope020102.length > 0) {
          this.resultCompany = true;
        }

        auditerList.forEach(element => {
          let audit: Ope020103Vo = this.initAuVo();
          audit.userThaiName = element.userThaiName;
          audit.title = element.title;
          audit.wsUserId = element.wsUserId;
          audit.oaPersonAuditPlanId = element.oaPersonAuditPlanId
          auditStore.auditer.push(audit);
        });

        this.auditer = auditerList;
        if (this.auditer.length > 0) {
          this.resultAuditer = true;
        }

        setTimeout(() => {
          const dateS: Date = response.data.dateFrom ? new Date(response.data.dateFrom) : new Date();
          $('#date1').calendar('set date', moment(dateS).toDate());
          const dateE: Date = response.data.dateTo ? new Date(response.data.dateTo) : new Date();
          $('#date2').calendar('set date', moment(dateE).toDate());
        }, 200);
        this.store.dispatch(new OPE020103ACTION.UpdateUserAuditer(auditStore));
        this.store.dispatch(new OPE020102ACTION.UpdateLicenseCustomer(companyStore));
      } else {

        this.msg.errorModal(response.message);
      }
    });
  }


  gotoFindCustomer() {
    this.store.dispatch(new OPE0201ACTION.UpdateOpe0201(this.ope0201));
    // this.router.navigate(['/ope02/01/02']);
    this.router.navigate(['/ope02/01/02'], {
      queryParams: {
        to: this.planStatus,
        planId: this.planId
      }
    });
  }

  gotoFindUserAudit() {
    this.store.dispatch(new OPE0201ACTION.UpdateOpe0201(this.ope0201));
    // this.router.navigate(['/ope02/01/03']);
    this.router.navigate(['/ope02/01/03'], {
      queryParams: {
        to: this.planStatus,
        planId: this.planId
      }
    });
  }

  removeAuditUser(user: Ope020103Vo) {
    let index = this.auditer.indexOf(user);
    if (index !== -1) {
      this.auditer.splice(index, 1);
    }
    this.store.dispatch(new OPE020103ACTION.RemoveLicenseUserAuditer(user));
  }

  removeCompany(company: Ope0201001Vo) {
    let index = this.ope020102.indexOf(company);
    if (index !== -1) {
      this.ope020102.splice(index, 1);
    }
    this.store.dispatch(new OPE020102ACTION.RemoveLicenseCustomer(company));

  }

  calenda = () => {
    $('#date1').calendar({
      endCalendar: $("#date2"),
      type: 'date',
      initialDate: new Date(),
      text: TextDateTH,
      formatter: formatter('วดป'),
      onChange: (date, text) => {
        this.from.get('dateFrom').patchValue(date);
        this.ope0201.auditStartDate = date;
      }
    });
    $('#date2').calendar({
      startCalendar: $("#date1"),
      type: 'date',
      initialDate: new Date(),
      text: TextDateTH,
      formatter: formatter('วดป'),
      onChange: (date, text) => {
        this.from.get('dateTo').patchValue(date);
        this.ope0201.auditEndDate = date;
      }
    });
  }
  getApprover() {
    this.ajax.doGet(`${URL.GET_APPROVER}`).subscribe((response: ResponseData<Ope020103Vo[]>) => {
      if (MessageService.MSG.SUCCESS == response.status) {
        let approver = response.data;
        // console.log("apporver ",response.data);
        this.approver = approver;
      } else {

        this.msg.errorModal(response.message);
      }
    });
  }

  getCustomerLicense() {
    this.ajax.doGet(`${URL.GET_DETAILS}/0`).subscribe((response: ResponseData<Ope0201Vo>) => {
      if (MessageService.MSG.SUCCESS == response.status) {
        this.customerLicense = response.data.listLicensePlan;
      } else {

        this.msg.errorModal(response.message);
      }
    });
  }
  onCancel() {
    this.store.dispatch(new OPE020103ACTION.ClearLicenseUserAuditer());
    this.store.dispatch(new OPE020102ACTION.ClearLicenseCustomer());
    this.router.navigate(['/ope02']);
  }

  get onInitial() {
    const initial = this.route.snapshot.queryParams['to'] || "";
    if (initial == 'DETAIL') {
      return true;
    }
    return false;
  }

  get onApprove() {
    const approve = this.route.snapshot.queryParams['to'] || "";
    if (approve == 'APPROVE') {
      return true;
    }
    return false;
  }
  get onCreate() {
    const create = this.route.snapshot.queryParams['to'] || "";
    if (create == 'CREATE') {
      return true;
    }
    return false;
  }
  initOaPlanV() {
    return {
      planId: "",
      dateFrom: null,
      dateTo: null,
      fiscolYear: "",
      listCompany: [],
      listAuditer: [],
      listApprover: [],
    }
  }

  initVo() {
    return {
      officeName1: "",
      officeName2: "",
      oaCuslicenseId: null,
      oaCustomerId: null,
      companyName: "",
      licenseType: "",
      address: "",
      identifyNo: "",
      licensePlanId: null
    }
  }
  initAuVo() {
    return {
      wsUserId: null,
      userThaiId: "",
      userThaiName: "",
      userThaiSurname: "",
      userEngName: "",
      userEngSurname: "",
      title: "",
      officeId: "",
      accessAttr: "",
      officeCode: "",
      userId: "",
      oaPersonAuditPlanId: null
    }

  }

  invalid(control: string) {
    return this.from.get(control).invalid && (this.from.get(control).touched || this.submitted);
  }

}
interface AppState {
  Ope02: {
    Ope020102: Ope020102Store,
    Ope020103: Ope020103Store,
    Ope0201: Ope0201
  }
}

