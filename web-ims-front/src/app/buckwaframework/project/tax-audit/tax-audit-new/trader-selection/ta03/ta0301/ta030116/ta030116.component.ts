import { Component, OnInit } from '@angular/core';
import { TextDateTH, formatter, converDate, patternDate } from 'helpers/datepicker';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AjaxService } from 'services/ajax.service';
import { ListFormTsNumber, Ta0301 } from '../ta0301.model';
import { MessageBarService } from 'services/message-bar.service';
import { Store } from '@ngrx/store';
import { Ta0301Service } from '../ts0301.service';
import { MessageService } from 'services/message.service';
import { ResponseData } from 'models/response-data.model';
import * as TA0301ACTION from "../ta0301.action";
import { PathTs } from '../path.model';
import { Utils } from 'helpers/utils';
import { Observable } from 'rxjs/internal/Observable';
import { ActivatedRoute } from '@angular/router';
declare var $: any;

const URL = {
  EXPORT: AjaxService.CONTEXT_PATH + "ta/report/form-ts/pdf/ta-form-ts0116",
  OPERATOR_DETAILS: "ta/tax-audit/get-operator-details",
  DATA_TABLE_LIST: 'person-info/person-info-list'
}
@Component({
  selector: 'app-ta030116',
  templateUrl: './ta030116.component.html',
  styleUrls: ['./ta030116.component.css']
})
export class Ta030116Component implements OnInit {
  submit: boolean = false;
  loading: boolean = false;
  pathTs: any;
  listFormTsNumber: ListFormTsNumber;
  dataStore: any;
  taformTS0116: FormGroup;

  auditPlanCode: string = "";
  auditStepStatus: string = "";

  ta0301: Ta0301
  formNumber: string = "";
  //data table
  dataList: any[] = [];
  table: any;

  constructor(

    private fb: FormBuilder,
    private messageBar: MessageBarService,
    private store: Store<AppState>,
    private ajax: AjaxService,
    private ta0301Service: Ta0301Service,
    private route: ActivatedRoute
  ) {
    this.setTaFormTS0116();
    this.getDataListForSearchModal();
  }

  // ================= Initial setting ===================
  ngOnInit() {
    this.auditPlanCode = this.route.snapshot.queryParams['auditPlanCode'] || "";
    this.auditStepStatus = this.route.snapshot.queryParams['auditStepStatus'] || "";
    this.taformTS0116.patchValue({
      auditPlanCode: this.auditPlanCode,
      auditStepStatus: this.auditStepStatus
    })

    console.log("ngOnInit formGroup : ", this.taformTS0116.value)
    this.dataStore = this.store.select(state => state.Ta0301.ta0301).subscribe(datas => {
      this.taformTS0116.get('formTsNumber').patchValue(datas.formTsNumber);
      this.pathTs = datas.pathTs;
      const pathModel = new PathTs();
      this.ta0301Service.checkPathFormTs(this.pathTs, pathModel.ts0116)
      console.log("store =>", datas)
      if (Utils.isNotNull(this.taformTS0116.get('formTsNumber').value)) {
        this.getFormTs(this.taformTS0116.get('formTsNumber').value);
        this.formNumber = this.taformTS0116.get('formTsNumber').value;
      } else {
        this.clear('');
        setTimeout(() => {
          this.taformTS0116.patchValue({
            auditPlanCode: this.auditPlanCode,
            auditStepStatus: this.auditStepStatus
          })
          this.formNumber = '';
          this.onSetNewRegId();
        }, 200);
      }
    });
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.   
    this.callCalendarDefault('calendarRequestDate', 'requestDate', 'date');
    this.callCalendarDefault('calendarSignHeadOfficerDate', 'signHeadOfficerDate', 'date');
    this.callCalendarDefault('calendarSignApproverDate', 'signApproverDate', 'date');
  }

  ngOnDestroy(): void {
    this.dataStore.unsubscribe();
  }

  setTaFormTS0116() {
    this.taformTS0116 = this.fb.group({
      formTsNumber: [""],
      docText: [""],
      docDear: [""],
      factoryName2: [""],
      newRegId: [""],
      requestDate: [""],
      requestReason: [""],
      requestDesc: [""],
      fineNoFlag: [""],
      factoryType: [""],
      factoryName1: [""],
      findReduceFlag: [""],
      finePercent: [""],
      extraNoFlag: [""],
      extraPercent: [""],
      beforeTaxAmt: ['0'],
      beforeFinePercent: [''],
      beforeFineAmt: ['0'],
      beforeExtraAmt: ['0'],
      beforeMoiAmt: ['0'],
      beforeSumAmt: ['0'],
      afterTaxAmt: ['0'],
      afterFinePercent: [''],
      afterFineAmt: ['0'],
      afterExtraAmt: ['0'],
      afterMoiAmt: ['0'],
      afterSumAmt: ['0'],
      signOfficerFullName: [""],
      signOfficerPosition: [""],
      headOfficerComment: [""],
      signHeadOfficerFullName: [""],
      signHeadOfficerPosition: [""],
      signHeadOfficerDate: [""],
      approverComment: [""],
      signApproverFullName: [""],
      signApproverPosition: [""],
      signApproverDate: [""],
      requestTypeExcept: ["N",],
      requestTypeReduce: ["N",],
      requestTypeFineAmt: ["N",],
      requestTypeExtraAmt: ["N",],
      fineExceptAmtFlag: ["N",],
      fineReduceAmtFlag: ["N",],
      extraReduceAmtFlag: ["N",],
      auditPlanCode: [""],
      auditStepStatus: [""]
    })
  }

  callCalendarDefault(id: string, formControlName: string, type: string): void {
    $(`#${id}`).calendar({
      maxDate: new Date(),
      type: `${type}`,
      text: TextDateTH,
      formatter: formatter('วดป'),
      onChange: (date, text) => {
        this.taformTS0116.get(`${formControlName}`).patchValue(text);
      }
    });
  }

  searchNewRegId() {
    console.log("searchNewRegId", this.taformTS0116.get('newRegId').value)
    let newRegId = this.taformTS0116.get('newRegId').value;
    if (Utils.isNull(newRegId)) {
      this.messageBar.errorModal(MessageBarService.VALIDATE_NEW_REG_ID);
      return;
    }
    this.getOperatorDetails(newRegId);
  }

  async onSetNewRegId() {
    if (Utils.isNotNull(this.auditPlanCode)) {
      try {
        const data = await this.getNewRegId(this.auditPlanCode);
        await this.getOperatorDetails(data.toString());
      } catch (error) {
        console.error(error.message)
      }
    }
  }

  getNewRegId(auditPlanCode: string) {
    return new Promise((resolve) => {
      const URL = "ta/tax-audit/get-operator-details-by-audit-plan-code";
      this.ajax.doPost(URL, { auditPlanCode: auditPlanCode }).subscribe((res: ResponseData<any>) => {
        if (MessageService.MSG.SUCCESS == res.status) {
          this.taformTS0116.get('newRegId').patchValue(res.data.newRegId);
          resolve(this.taformTS0116.get('newRegId').value);
        } else {
          console.log('error getNewRegId taformTS0116');
        }
      });
    });
  }


  getOperatorDetails(newRegId: string) {
    this.ajax.doPost(URL.OPERATOR_DETAILS, { newRegId: newRegId }).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        console.log("getOperatorDetails : ", res.data)
        this.taformTS0116.patchValue({
          factoryName1: res.data.facFullname,
          factoryName2: res.data.facFullname,
          factoryType: res.data.factoryType
        })
        console.log("formTS0116 : ", this.taformTS0116.value)
      } else {
        this.messageBar.errorModal(res.message);
        console.log("Error getOperatorDetails : " + res.message)
      }
    });
  }



  onChangeCheck(name: string, event) {
    if (event.target.checked) {
      this.taformTS0116.get(`${name}`).patchValue('Y');

    } else {
      this.taformTS0116.get(`${name}`).patchValue('N');
    }
    console.log(this.taformTS0116.value);

  }

  calculateMoney(number: number) {
    switch (number) {
      case 1:
        if (Utils.isNull(this.taformTS0116.get('beforeTaxAmt').value)) {
          this.taformTS0116.get('beforeTaxAmt').patchValue('0');
        }
        if (Utils.isNull(this.taformTS0116.get('beforeFineAmt').value)) {
          this.taformTS0116.get('beforeFineAmt').patchValue('0');
        }
        if (Utils.isNull(this.taformTS0116.get('beforeExtraAmt').value)) {
          this.taformTS0116.get('beforeExtraAmt').patchValue('0');
        }
        let beforeTaxAmt = Number(this.taformTS0116.get('beforeTaxAmt').value.toString().replace(/,/g, ""));
        let beforeFineAmt = Number(this.taformTS0116.get('beforeFineAmt').value.toString().replace(/,/g, ""));
        let beforeExtraAmt = Number(this.taformTS0116.get('beforeExtraAmt').value.toString().replace(/,/g, ""));
        let beforeMoiAmt = (beforeTaxAmt + beforeFineAmt + beforeExtraAmt) * 0.1;
        let beforeSumAmt = beforeMoiAmt * 10;
        this.taformTS0116.get('beforeMoiAmt').patchValue(Utils.moneyFormatDecimal(beforeMoiAmt));
        this.taformTS0116.get('beforeSumAmt').patchValue(Utils.moneyFormatDecimal(beforeMoiAmt + beforeSumAmt));
        break;
      case 2:
        if (Utils.isNull(this.taformTS0116.get('afterTaxAmt').value)) {
          this.taformTS0116.get('afterTaxAmt').patchValue('0');
        }
        if (Utils.isNull(this.taformTS0116.get('afterFineAmt').value)) {
          this.taformTS0116.get('afterFineAmt').patchValue('0');
        }
        if (Utils.isNull(this.taformTS0116.get('afterExtraAmt').value)) {
          this.taformTS0116.get('afterExtraAmt').patchValue('0');
        }
        let afterTaxAmt = Number(this.taformTS0116.get('afterTaxAmt').value.toString().replace(/,/g, ""));
        let afterFineAmt = Number(this.taformTS0116.get('afterFineAmt').value.toString().replace(/,/g, ""));
        let afterExtraAmt = Number(this.taformTS0116.get('afterExtraAmt').value.toString().replace(/,/g, ""));
        let afterMoiAmt = (afterTaxAmt + afterFineAmt + afterExtraAmt) * 0.1;
        let afterSumAmt = afterMoiAmt * 10;
        this.taformTS0116.get('afterMoiAmt').patchValue(Utils.moneyFormatDecimal(afterMoiAmt));
        this.taformTS0116.get('afterSumAmt').patchValue(Utils.moneyFormatDecimal(afterMoiAmt + afterSumAmt));
        break;
      default:
        break;
    }

  }

  onFocusMoney(name: string) {
    if (Utils.isNull(this.taformTS0116.get(name).value)) {
      this.taformTS0116.get(name).patchValue('0');
    }
    let count = this.taformTS0116.get(name).value.toString().replace(/,/g, "");
    this.taformTS0116.get(name).patchValue(Number(count));

  }

  onBlurMoney(index: number, name: string) {
    if (Utils.isNull(this.taformTS0116.get(name).value)) {
      this.taformTS0116.get(name).patchValue('0');
    }
    let count = Number(this.taformTS0116.get(name).value);
    this.taformTS0116.get(name).patchValue(Utils.moneyFormatDecimal(count));

    this.calculateMoney(index);
  }

  export(e) {
    if (Utils.isNull(this.taformTS0116.get('newRegId').value)) {
      this.messageBar.errorModal(MessageBarService.VALIDATE_NEW_REG_ID);
      return;
    }
    this.loading = true;
    this.submit = true;
    this.saveTs().subscribe((res: ResponseData<any>) => {
      this.getFromTsNumberList().subscribe(res => {
        this.getFormTs(this.taformTS0116.get('formTsNumber').value)

        console.log("export : ", this.taformTS0116.value);
        var form = document.createElement("form");
        form.action = URL.EXPORT;
        form.method = "POST";
        form.style.display = "none";
        //  form.target = "_blank";

        var jsonInput = document.createElement("input");
        jsonInput.name = "json";
        jsonInput.value = JSON.stringify(this.taformTS0116.value).toString();
        form.appendChild(jsonInput);
        document.body.appendChild(form);
        form.submit();
        this.loading = false;
      });
    })
  }

  save(e) {
    if (Utils.isNull(this.taformTS0116.get('newRegId').value)) {
      this.messageBar.errorModal(MessageBarService.VALIDATE_NEW_REG_ID);
      return;
    }
    this.messageBar.comfirm(res => {
      if (res) {
        this.loading = true;
        this.saveTs().subscribe((res: ResponseData<any>) => {

          this.messageBar.successModal(res.message);

          this.getFromTsNumberList().subscribe(res => {

            this.getFormTs(this.taformTS0116.get('formTsNumber').value)
            this.loading = false;
          });
        })
      }
    }, "ยืนยันการบันทึก")
  }

  searchModalOpen(num: number) {
    $('#searchModal').modal('show');
    this.dataTable(num);
  }

  saveTs(): Observable<any> {
    return new Observable(obs => {

      if (Utils.isNotNull(this.auditPlanCode)) {
        this.taformTS0116.patchValue({
          auditPlanCode: this.auditPlanCode,
          auditStepStatus: this.auditStepStatus,
          formTsNumber: this.formNumber
        })
      } else {
        this.taformTS0116.patchValue({
          formTsNumber: this.formNumber
        })
      }
      // convert date DD MMMM YYYY to DD/MM/YYYY
      if (Utils.isNotNull(this.taformTS0116.get('requestDate').value)) {
        let requestDate = converDate(this.taformTS0116.get('requestDate').value, patternDate.DD_MMMM_YYYY);
        this.taformTS0116.get('requestDate').patchValue(requestDate);
      }
      if (Utils.isNotNull(this.taformTS0116.get('signHeadOfficerDate').value)) {
        let signHeadOfficerDate = converDate(this.taformTS0116.get('signHeadOfficerDate').value, patternDate.DD_MMMM_YYYY);
        this.taformTS0116.get('signHeadOfficerDate').patchValue(signHeadOfficerDate);
      }
      if (Utils.isNotNull(this.taformTS0116.get('signApproverDate').value)) {
        let signApproverDate = converDate(this.taformTS0116.get('signApproverDate').value, patternDate.DD_MMMM_YYYY);
        this.taformTS0116.get('signApproverDate').patchValue(signApproverDate);
      }
      // delete ',' on number
      let beforeTaxAmt = Utils.isNotNull(this.taformTS0116.get('beforeTaxAmt').value) ? Number(this.taformTS0116.get('beforeTaxAmt').value.toString().replace(/,/g, "")) : '0';
      let beforeFineAmt = Utils.isNotNull(this.taformTS0116.get('beforeFineAmt').value) ? Number(this.taformTS0116.get('beforeFineAmt').value.toString().replace(/,/g, "")) : '0';
      let beforeExtraAmt = Utils.isNotNull(this.taformTS0116.get('beforeExtraAmt').value) ? Number(this.taformTS0116.get('beforeExtraAmt').value.toString().replace(/,/g, "")) : '0';
      let beforeMoiAmt = Utils.isNotNull(this.taformTS0116.get('beforeMoiAmt').value) ? Number(this.taformTS0116.get('beforeMoiAmt').value.toString().replace(/,/g, "")) : '0';
      let beforeSumAmt = Utils.isNotNull(this.taformTS0116.get('beforeSumAmt').value) ? Number(this.taformTS0116.get('beforeSumAmt').value.toString().replace(/,/g, "")) : '0';
      this.taformTS0116.get('beforeTaxAmt').patchValue(beforeTaxAmt);
      this.taformTS0116.get('beforeFineAmt').patchValue(beforeFineAmt);
      this.taformTS0116.get('beforeExtraAmt').patchValue(beforeExtraAmt);
      this.taformTS0116.get('beforeMoiAmt').patchValue(beforeMoiAmt);
      this.taformTS0116.get('beforeSumAmt').patchValue(beforeSumAmt);
      let afterTaxAmt = Utils.isNotNull(this.taformTS0116.get('afterTaxAmt').value) ? Number(this.taformTS0116.get('afterTaxAmt').value.toString().replace(/,/g, "")) : '0';
      let afterFineAmt = Utils.isNotNull(this.taformTS0116.get('afterFineAmt').value) ? Number(this.taformTS0116.get('afterFineAmt').value.toString().replace(/,/g, "")) : '0';
      let afterExtraAmt = Utils.isNotNull(this.taformTS0116.get('afterExtraAmt').value) ? Number(this.taformTS0116.get('afterExtraAmt').value.toString().replace(/,/g, "")) : '0';
      let afterMoiAmt = Utils.isNotNull(this.taformTS0116.get('afterMoiAmt').value) ? Number(this.taformTS0116.get('afterMoiAmt').value.toString().replace(/,/g, "")) : '0';
      let afterSumAmt = Utils.isNotNull(this.taformTS0116.get('afterSumAmt').value) ? Number(this.taformTS0116.get('afterSumAmt').value.toString().replace(/,/g, "")) : '0';
      this.taformTS0116.get('afterTaxAmt').patchValue(afterTaxAmt);
      this.taformTS0116.get('afterFineAmt').patchValue(afterFineAmt);
      this.taformTS0116.get('afterExtraAmt').patchValue(afterExtraAmt);
      this.taformTS0116.get('afterMoiAmt').patchValue(afterMoiAmt);
      this.taformTS0116.get('afterSumAmt').patchValue(afterSumAmt);
      setTimeout(() => {
        this.ajax.doPost(`ta/report/save-form-ts/${this.pathTs}`, { json: JSON.stringify(this.taformTS0116.value).toString() }).subscribe((res: ResponseData<any>) => {
          if (MessageService.MSG.SUCCESS == res.status) {
            obs.next(res);
          } else {
            this.messageBar.errorModal(res.message)
          }
        })
      }, 200);

    })
  }
  getFormTs(formTsNumber: string) {
    this.ajax.doPost(`ta/report/get-form-ts/ta-form-ts0116/${formTsNumber}`, {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        console.log("getFormTs : ", res.data);
        let json = JSON.parse(res.data)
        this.taformTS0116.patchValue({
          formTsNumber: json.formTsNumber,
          docText: json.docText,
          docDear: json.docDear,
          factoryName1: json.factoryName1,
          factoryName2: json.factoryName2,
          factoryType: json.factoryType,
          newRegId: json.newRegId,
          requestDate: Utils.isNotNull(json.requestDate) ? converDate(json.requestDate, patternDate.DD_MM_YYYY) : '',
          requestReason: json.requestReason,
          requestDesc: json.requestDesc,
          fineNoFlag: json.fineNoFlag,
          finePercent: json.finePercent,
          extraNoFlag: json.extraNoFlag,
          extraPercent: json.extraPercent,
          beforeTaxAmt: json.beforeTaxAmt,
          beforeFinePercent: json.beforeFinePercent,
          beforeFineAmt: json.beforeFineAmt,
          beforeExtraAmt: json.beforeExtraAmt,
          beforeMoiAmt: json.beforeMoiAmt,
          beforeSumAmt: json.beforeSumAmt,
          afterTaxAmt: json.afterTaxAmt,
          afterFinePercent: json.afterFinePercent,
          afterFineAmt: json.afterFineAmt,
          afterExtraAmt: json.afterExtraAmt,
          afterMoiAmt: json.afterMoiAmt,
          afterSumAmt: json.afterSumAmt,
          signOfficerFullName: json.signOfficerFullName,
          signOfficerPosition: json.signOfficerPosition,
          headOfficerComment: json.headOfficerComment,
          signHeadOfficerFullName: json.signHeadOfficerFullName,
          signHeadOfficerPosition: json.signHeadOfficerPosition,
          signHeadOfficerDate: Utils.isNotNull(json.signHeadOfficerDate) ? converDate(json.signHeadOfficerDate, patternDate.DD_MM_YYYY) : '',
          approverComment: json.approverComment,
          signApproverFullName: json.signApproverFullName,
          signApproverPosition: json.signApproverPosition,
          signApproverDate: Utils.isNotNull(json.signApproverDate) ? converDate(json.signApproverDate, patternDate.DD_MM_YYYY) : '',
          requestTypeExcept: json.requestTypeExcept,
          requestTypeReduce: json.requestTypeReduce,
          requestTypeFineAmt: json.requestTypeFineAmt,
          requestTypeExtraAmt: json.requestTypeExtraAmt,
          fineExceptAmtFlag: json.fineExceptAmtFlag,
          fineReduceAmtFlag: json.fineReduceAmtFlag,
          extraReduceAmtFlag: json.extraReduceAmtFlag,
          auditPlanCode: json.auditPlanCode

        })
      } else {
        this.messageBar.errorModal(res.message);
        console.log("Error !! getFormTsNumber ");
      }
    })
  }

  clear(e) {
    this.taformTS0116.reset();
  }

  getFromTsNumberList(): Observable<any> {
    return new Observable(obs => {
      let data = {
        auditPlanCode: this.auditPlanCode
      }
      this.ajax.doPost(`ta/report/form-ts-number/${this.pathTs}`, data).subscribe((res: ResponseData<any>) => {
        if (MessageService.MSG.SUCCESS == res.status) {
          this.listFormTsNumber = {
            listFormTsNumber: res.data
          }
          if (res.data.length != 0) {

            this.taformTS0116.get('formTsNumber').patchValue(res.data[0]);
          }
          console.log(" getFromTsNumberList ==> : ", res.data)
          obs.next(res.data);
          this.store.dispatch(new TA0301ACTION.AddListFormTsNumber(this.listFormTsNumber))

          //==== set formTsNumber  to store =======
          setTimeout(() => {
            this.ta0301 = {
              formTsNumber: this.taformTS0116.get('formTsNumber').value,
              pathTs: this.pathTs
            }
            this.store.dispatch(new TA0301ACTION.AddFormTsNumber(this.ta0301));
          }, 200);
          //!==== set formTsNumber  to store =======
        } else {
          this.messageBar.errorModal(res.message);
          console.log("Error !! getFormTsNumber 19");
        }
      })
    })
  }

  getDataListForSearchModal() {
    this.ajax.doGet(URL.DATA_TABLE_LIST).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.dataList = res.data;
      } else {
        this.messageBar.errorModal(res.message);
      }
    })
  }

  // ================ data table ==============
  dataTable(num: number) {
    if (this.table != null) {
      this.table.destroy();
    }
    this.table = $("#tableModal").DataTableTh({
      lengthChange: true,
      searching: false,
      loading: true,
      ordering: false,
      pageLength: 10,
      processing: true,
      serverSide: false,
      paging: true,
      data: this.dataList,
      columns: [
        {
          render: function (data, type, row, meta) {
            return meta.row + meta.settings._iDisplayStart + 1;
          },
          className: "text-center"
        }, {
          render: function (data, type, row, meta) {
            return row.personThName + " " + row.personThSurname;
          },
          className: "text-center"
        }, {
          data: "linePosition", className: "text-center"
        }
      ],
    });

    $.fn.DataTable.ext.pager.numbers_length = 5;

    this.table.on("dblclick", "tr", (event) => {
      let data = this.table.row($(event.currentTarget).closest("tr")).data();
      // console.log("double data => ", data);
      if (num == 1) {
        this.taformTS0116.get('signHeadOfficerFullName').patchValue(data.personThName + " " + data.personThSurname);
        this.taformTS0116.get('signHeadOfficerPosition').patchValue(data.linePosition);
      } else if (num == 2) {
        this.taformTS0116.get('signApproverFullName').patchValue(data.personThName + " " + data.personThSurname);
        this.taformTS0116.get('signApproverPosition').patchValue(data.linePosition);
      }

      $('#searchModal').modal('hide');
    });

    this.table.on('draw.dt', function () {
      $('.paginate_button').not('.previous, .next').each(function (i, a) {
        var val = $(a).text();
        val = val.toString().replace(/(\d+)(\d{3})/, '$1' + ',' + '$2');
        $(a).text(val);
      })
    });
  }

}
class AppState {
  Ta0301: {
    ta0301: Ta0301
  }
}
