import { Component, OnInit } from '@angular/core';
import { BreadCrumb } from 'models/breadcrumb.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AjaxService } from 'services/ajax.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageBarService } from 'services/message-bar.service';
import { IaService } from 'services/ia.service';
import { MessageService } from 'services/message.service';
import { ResponseData } from 'models/response-data.model';
import { TextDateTH, formatter } from 'helpers/datepicker';
import { AuthService } from 'services/auth.service';
import { Store } from '@ngrx/store';
import { Ta020202 } from './ta020202.model';
import * as TA020202ACTION from "./ta020202.action";
import { Utils } from 'helpers/index';
import * as moment from 'moment';
import { OparaterDTL } from '../../ta02.model';

declare var $: any;

const URL = {
  FIND_BY_AUDIT_PLAN_CODE: "ta/tax-audit/get-operator-details-by-audit-plan-code",
}

@Component({
  selector: 'app-ta020202',
  templateUrl: './ta020202.component.html',
  styleUrls: ['./ta020202.component.css']
})
export class Ta020202Component implements OnInit {
  breadcrumb: BreadCrumb[] = [
    { label: 'ตรวจสอบภาษี', route: '#' },
    { label: 'แผนการตรวจสอบประจำปี', route: '#' },
    { label: 'วิเคราะห์ข้อมูลเบื้องต้น', route: '#' }
  ];

  dataStore: any;
  hideResult: boolean = false;
  loading: boolean = false;
  disableBtn: boolean = true;

  formGroup: FormGroup;
  checkSearchFlag: boolean = false;

  budgetYear: any;
  planNumber: any;
  auditPlanCode: any;
  actived: boolean[] = [true, false, false, false, false, false, false, false];

  note: string;
  regDutyList: any[];
  baNumberList: any[];

  constructor(
    private ajax: AjaxService,
    private router: Router,
    private route: ActivatedRoute,
    private messageBar: MessageBarService,
    private modelService: IaService,
    private formBuilder: FormBuilder,
    private store: Store<AppState>,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.setFormGroup();
    // this.budgetYear = this.route.snapshot.queryParams['budgetYear'] || "";
    // this.planNumber = this.route.snapshot.queryParams['planNumber'] || "";
    this.auditPlanCode = this.route.snapshot.queryParams['auditPlanCode'] || "";
    this.formGroup.get('auditPlanCode').patchValue(this.auditPlanCode);
    if (this.auditPlanCode) {
      this.searchAuditPlanCode();
    } else {
      this.router.navigate(["/tax-audit-new/ta02/05"]);
    }
    this.getBaNumber();
    this.findDetailHeader();
  }

  ngAfterViewInit(): void {
    this.calendar();
    this.callDropDown();
    $('.paperBaNumber').dropdown('set selected', 'default');
  }

  setFormGroup() {
    this.formGroup = this.formBuilder.group({
      newRegId: [''],
      auditPlanCode: [''],
      paperBaNumber: [''],
      planNumber: [''],
      cusFullname: [''],
      facFullname: [''],
      facAddress: [''],
      secDesc: [''],
      areaDesc: [''],
      dutyGroupId: [''],
      jobResp: [''],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
    });
  }

  calendar = () => {
    $('#date1').calendar({
      endCalendar: $("#date2"),
      type: 'month',
      text: TextDateTH,
      formatter: formatter('month-year'),
      onChange: (date, text, mode) => {
        this.formGroup.patchValue({
          startDate: text
        })
      }
    });
    $('#date2').calendar({
      startCalendar: $("#date1"),
      type: 'month',
      text: TextDateTH,
      formatter: formatter('month-year'),
      onChange: (date, text, mode) => {
        this.formGroup.patchValue({
          endDate: text
        })
      }
    });
  }

  callDropDown = () => {
    setTimeout(() => {
      $('.ui.dropdown').dropdown();
    }, 100);
  }

  onSearch() {
    this.hideResult = false;
    if ((this.formGroup.value.startDate && this.formGroup.value.endDate)
      || (Utils.isNotNull(this.formGroup.get('paperBaNumber').value)) && this.formGroup.get('paperBaNumber').value != 'default') {
      this.checkSearchFlag = false;
      this.searchAuditPlanCode();
      this.findDetailHeader();
      setTimeout(() => {
        this.hideResult = true;
        this.disableBtn = false;
        if ('default' == this.formGroup.get("paperBaNumber").value) {
          this.formGroup.get("paperBaNumber").patchValue("");
        }
        this.router.navigate(["/tax-audit-new/ta02/02/02/01"], {
          queryParams: {
            dutyGroupId: this.formGroup.get('dutyGroupId').value,
            paperBaNumber: this.formGroup.get('paperBaNumber').value,
            auditPlanCode: this.auditPlanCode
          }
        });
      }, 1000);
      this.modelService.setData(this.formGroup.value);
      // console.log("model service : ", this.modelService.getData());
    } else {
      this.checkSearchFlag = true;
    }
  }

  onBackPages() {
    this.router.navigate(["/tax-audit-new/ta02/02/01"], {
      queryParams: {
        auditPlanCode: this.auditPlanCode,
      }
    });
  }

  goTo(link: string, numLink: number) {
    this.onActive(numLink);
    if ('default' == this.formGroup.get("paperBaNumber").value) {
      this.formGroup.get("paperBaNumber").patchValue("");
    }
    this.router.navigate([link], {
      queryParams: {
        dutyGroupId: this.formGroup.get('dutyGroupId').value,
        auditPlanCode: this.auditPlanCode,
        paperBaNumber: this.formGroup.get('paperBaNumber').value,
      }
    });
  }

  onActive(numLink: number) {
    this.actived = [false, false, false, false, false, false, false, false];
    this.actived[numLink] = true;
  }

  // ================ Action ==================
  reset() {
    this.formGroup.get('startDate').reset();
    this.formGroup.get('endDate').reset();
    this.hideResult = false;
    this.checkSearchFlag = false;
    this.disableBtn = true;
    this.note = "";
    this.formGroup.get("paperBaNumber").reset();
    setTimeout(() => {
      $('.paperBaNumber').dropdown('set selected', 'default');
    }, 100);
    this.store.dispatch(new TA020202ACTION.RemoveTa020202());
  }

  invalidSearchFormControl(control: string) {
    return this.formGroup.get(control).invalid && (this.formGroup.get(control).touched || this.checkSearchFlag);
  }

  detailModal() {
    $('#detailModal').modal('show');
  }

  searchAuditPlanCode() {
    // console.log("searchAuditPlanCode", this.auditPlanCode);
    this.getOperatorDetails(this.auditPlanCode);
  }

  onSave() {
    if (!this.disableBtn) {
      const URL = "ta/basic-analysis/save";
      let data = {};
      if ('default' == this.formGroup.get("paperBaNumber").value) {
        this.formGroup.get("paperBaNumber").patchValue("");
      }
      this.dataStore = this.store.select(state => state.Ta020202.Ta020202).subscribe(datas => {
        data = {
          // budgetYear: this.budgetYear,
          // planNumber: this.planNumber,
          auditPlanCode: this.auditPlanCode,
          newRegId: this.formGroup.get("newRegId").value,
          dutyGroupId: this.formGroup.get("dutyGroupId").value,
          paperBaNumber: this.formGroup.get("paperBaNumber").value,
          startDate: this.formGroup.get("startDate").value,
          endDate: this.formGroup.get("endDate").value,
          monthIncomeType: datas['monthIncType'],
          yearIncomeType: datas['yearIncType'],
          yearNum: datas['yearNum'],
          commentText1: datas['anaResultText1'],
          commentText2: datas['anaResultText2'],
          commentText3: datas['anaResultText3'],
          commentText4: datas['anaResultText4'],
          commentText5: datas['anaResultText5'],
          commentText6: datas['anaResultText6'],
          commentText7: datas['anaResultText7'],
          commentText8: datas['anaResultText8']
        }
      });
      // console.log("onSave data => ", data);
      this.messageBar.comfirm(confirm => {
        if (confirm) {
          this.loading = true;
          this.ajax.doPost(URL, data).subscribe((res: ResponseData<any>) => {
            if (MessageService.MSG.SUCCESS == res.status) {
              this.messageBar.successModal(res.message);
              this.findDetailHeader();
              this.getBaNumber();
            } else {
              this.messageBar.errorModal(res.message);
            }
            setTimeout(() => {
              this.loading = false;
            }, 1000)
          })
        }
      }, MessageService.MSG_CONFIRM.SAVE)
    }
  }

  exportPDF = e => {
    if ('default' == this.formGroup.get("paperBaNumber").value || '' == this.formGroup.get("paperBaNumber").value) {
      this.messageBar.errorModal("กรุณาเลือกเลขวิเคราะห์ข้อมูล");
      return;
    }
    if (!this.disableBtn) {

      //export
      var form = document.createElement("form");
      form.method = "GET";
      // form.target = "_blank";
      // ta/basic-analysis/pdf/{baNumber}
      form.action = AjaxService.CONTEXT_PATH + "ta/basic-analysis/pdf/" + this.formGroup.get('paperBaNumber').value;

      form.style.display = "none";
      // var jsonInput = document.createElement("input");
      // jsonInput.name = "json";
      // jsonInput.value = JSON.stringify();
      // form.appendChild(jsonInput);

      document.body.appendChild(form);
      form.submit();
    }
  };

  checkNull(data) {
    if (Utils.isNull(data)) {
      return "";
    } else {
      return data;
    }
  }

  // ============ call back-end ================
  getOperatorDetails(auditPlanCode: string) {
    this.loading = true;
    this.ajax.doPost(URL.FIND_BY_AUDIT_PLAN_CODE, { auditPlanCode: auditPlanCode }).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        // console.log("getOperatorDetails : ", res.data);
        let jobResp = this.auth.getUserDetails().userThaiName + " " + this.auth.getUserDetails().userThaiSurname;
        this.formGroup.get('newRegId').patchValue(res.data.wsRegfri4000Vo.newRegId);
        this.formGroup.get('cusFullname').patchValue(res.data.wsRegfri4000Vo.cusFullname);
        this.formGroup.get('facFullname').patchValue(res.data.wsRegfri4000Vo.facFullname);
        this.formGroup.get('facAddress').patchValue(res.data.wsRegfri4000Vo.facAddress);
        this.formGroup.get('secDesc').patchValue(res.data.wsRegfri4000Vo.secDesc);
        this.formGroup.get('areaDesc').patchValue(res.data.wsRegfri4000Vo.areaDesc);
        this.formGroup.get('dutyGroupId').patchValue(res.data.wsRegfri4000Vo.regDutyList[0].groupName);
        this.formGroup.get('jobResp').patchValue(jobResp);
        this.regDutyList = res.data.wsRegfri4000Vo.regDutyList;
        setTimeout(() => {
          $('.dutyGroupId').dropdown('set selected', res.data.wsRegfri4000Vo.regDutyList[0].groupName);
        }, 150);
        // console.log("formGroup : ", this.formGroup.value);
        this.callDropDown();
      } else {
        this.messageBar.errorModal(res.message);
      }
      setTimeout(() => {
        this.loading = false;
      }, 1000)
    });
  }

  findDetailHeader() {
    const URL = "ta/basic-analysis/get-paper-ba-header";
    if ('default' == this.formGroup.get("paperBaNumber").value) {
      this.formGroup.get("paperBaNumber").patchValue("");
    }
    let data = {
      newRegId: this.formGroup.get("newRegId").value,
      paperBaNumber: this.formGroup.get("paperBaNumber").value,
      auditPlanCode: this.auditPlanCode
    }
    this.ajax.doPost(URL, data).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        console.log("findDetailHeader => ", res.data);
        // this.budgetYear = res.data.budgetYear;
        // this.planNumber = res.data.planNumber;
        // this.auditPlanCode = res.data.auditPlanCode;
        // this.newRegId = res.data.newRegId;
        // this.formGroup.get("newRegId").patchValue(null != res.data.newRegId ? res.data.newRegId : this.newRegId);
        // let auditPlanCode = "";
        // if (null != res.data.auditPlanCode) {
        //   auditPlanCode = res.data.auditPlanCode;
        // }
        // this.formGroup.get("auditPlanCode").patchValue(auditPlanCode);
        // this.formGroup.get("paperBaNumber").patchValue(null != res.data.paperBaNumber ? res.data.paperBaNumber : '');
        // this.formGroup.get("dutyGroupId").patchValue(null != res.data.dutyGroupId ? res.data.dutyGroupId : '');
        // let startDate = moment(res.data.startDate).format("MM/YYYY").split("/");
        // let endDate = moment(res.data.endDate).format("MM/YYYY").split("/");
        if (Utils.isNotNull(res.data['startDate'])) {
          this.formGroup.get("startDate").patchValue(res.data['startDate']);
        }
        if (Utils.isNotNull(res.data['endDate'])) {
          this.formGroup.get("endDate").patchValue(res.data['endDate']);
        }
        let dataDispatch = {
          monthIncType: Utils.isNotNull(res.data['monthIncomeType']) ? res.data['monthIncomeType'] : 'TAX',
          yearIncType: Utils.isNotNull(res.data['yearIncomeType']) ? res.data['yearIncomeType'] : 'TAX',
          yearNum: Utils.isNotNull(res.data['yearNum']) ? res.data['yearNum'] : '1',
          anaResultText1: res.data['commentText1'],
          anaResultText2: res.data['commentText2'],
          anaResultText3: res.data['commentText3'],
          anaResultText4: res.data['commentText4'],
          anaResultText5: res.data['commentText5'],
          anaResultText6: res.data['commentText6'],
          anaResultText7: res.data['commentText7'],
          anaResultText8: res.data['commentText8']
        }
        this.store.dispatch(new TA020202ACTION.AddTa020202(dataDispatch));
      } else {
        this.messageBar.errorModal(res.message);
      }
    })
  }

  getBaNumber() {
    const URL = "ta/basic-analysis/get-paper-ba-number-list/";
    if ('default' == this.formGroup.get("paperBaNumber").value) {
      this.formGroup.get("paperBaNumber").patchValue("");
    }
    let data = {
      auditPlanCode: this.auditPlanCode,
      paperBaNumber: this.formGroup.get("paperBaNumber").value
    }
    this.ajax.doPost(URL, data).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.baNumberList = res.data;
      } else {
        this.messageBar.errorModal(res.message);
      }
    })
  }

}

class AppState {
  Ta020202: {
    Ta020202: Ta020202,
  }
}
