import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { formatter, TextDateTH } from 'app/buckwaframework/common/helper/datepicker';
import { Utils } from 'app/buckwaframework/common/helper/utils';
import { BreadCrumb, ResponseData } from 'app/buckwaframework/common/models/index';
import { DecimalFormatPipe } from 'app/buckwaframework/common/pipes/decimal-format.pipe';
import { AjaxService } from 'app/buckwaframework/common/services/ajax.service';
import { MessageBarService } from 'app/buckwaframework/common/services/message-bar.service';
import { MessageService } from 'app/buckwaframework/common/services/message.service';
import * as moment from 'moment';
import { BreadcrumbContant } from '../../../BreadcrumbContant';
import { SelectService } from '../../select.service';

declare var $: any;
export interface onChangLink {
  id: number, index: number, idxChk1: number, idxChk2: number
}

@Component({
  selector: 'app-ta0101',
  templateUrl: './ta0101.component.html',
  styleUrls: ['./ta0101.component.css']
})
export class Ta0101Component implements OnInit, AfterViewInit {

  b: BreadcrumbContant = new BreadcrumbContant();

  breadcrumb: BreadCrumb[] = [
    { label: this.b.b00.label, route: this.b.b00.route },
    { label: this.b.b08.label, route: this.b.b08.route }
  ];
  items = []
  formYear: FormGroup;
  hdrForm: FormGroup;
  modalForm: FormGroup;
  se01Form: FormGroup;
  se21Form: FormGroup;
  se22Form: FormGroup;
  se23Form: FormGroup;
  condGroup: FormArray;
  productTypeGroup: FormArray;
  formatter1: any;
  formatter2: any;
  selectedStartMonth: any;
  selectedSEndMonth: any;
  selectStartDateObj: any;
  selectEndDateObj: any;
  menuhide: boolean = false;
  loading: boolean = false;
  buttonHide: boolean = false;
  submitted: boolean = false;
  addCapModalSubmitted: boolean = false;
  modalSubmitted: boolean = false;
  dataIsNotNull: boolean = false;
  linkTab: any = [[true, false, false], false, false, false];
  linkTab1: boolean = false;
  confModal: boolean = false;
  submitType: String = "save";
  submitModalType: number;
  resHdr: any;
  resDtl: any;
  selectMonth: any[] = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36];
  selectGroup: any[] = [1, 2, 3, 4, 5];
  taxFreqTypeLevel: any[] = [{ paramCode: 1, value1: "สม่ำเสมอ" }, { paramCode: 2, value1: "ไม่สม่ำเสมอ" }];
  numMonthLevel: any[];
  numMonthLevel2: any[];
  explainCondText: any;
  condTextUsed: any = { month: [], tax: [] };
  condMain2: string;
  selectProduct: any;
  capital: any;
  dutyCodeModal: any;
  productType: any;
  selectRiskLevel: any[];
  selectRisk3Level: any[];
  listLink1: any[];
  listLink1Id: number;
  rangeTypeEndHide: boolean;
  changeLinkId: onChangLink = { id: null, index: null, idxChk1: null, idxChk2: null };
  regDateStartFirst: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private select: SelectService,
    private msg: MessageBarService,
    private ajax: AjaxService
  ) {
    this.selectedStartMonth = null;
    this.selectedSEndMonth = null;
    this.selectStartDateObj = null;
    this.selectEndDateObj = null;
    this.formatter1 = formatter('ดป');
    this.formatter2 = formatter('ดป');
    this.formatter1.cell = (cell, date, cellOptions) => {
      if (date.getMonth() % TextDateTH.months.findIndex(obj => obj == $("#calendarraw").val().split(" ")[0])) {
      }
    }
    this.formatter2.cell = (cell, date, cellOptions) => {
      if (date.valueOf() > new Date().valueOf()) {
        cell[0].className = "link disabled";
        return;
      }


      if (this.selectedStartMonth % 2 === 0) {
        if ((date.getMonth() % 2) === 1) {
          cell[0].className = "link";
        } else {
          cellOptions.disabled = true;
          cell[0].className = "link disabled";
        }
      } else if (this.selectedStartMonth % 2 === 1) {
        if ((date.getMonth() % 2) === 0) {
          cell[0].className = "link";
        } else {
          cell[0].className = "link disabled";
        }
      }
    }
  }

  munuHide() {
    if (this.menuhide) {
      this.menuhide = false;
    } else {
      this.menuhide = true;
    }
  }

  callDropDown = () => {
    setTimeout(() => {
      // $('#selectRiskLevel').dropdown();
      // $('#selectMonthDropdown').dropdown();
      // $('#selectGroupDropdown').dropdown();
      // $('#selectProduct').dropdown();
      // $('#selectRisk3Level').dropdown();
      $('.ui.dropdown').dropdown();
    }, 100);
  }

  reDropDownModal = () => {
    this.addCapModalSubmitted = false;
    setTimeout(() => {
      $('.dutyCodeModal').dropdown('clear');
    }, 100);
  }

  ngOnInit() {
    //this.getTaxFreqTypeLevel()
    this.setHdrForm();
    this.setModalForm();
    this.setVariable();
    this.setFormYear();
    this.setSe21Form();
    this.setSe22Form();
    this.setSe23Form();
    this.getMainCondFreqType();
    this.getRiskLevel();
    this.getCondMessage();
    this.getCondMain2();
    let currYear
    let currMonth = new Date().getMonth() + 1;
    if (currMonth >= 8 && currMonth <= 12) {
      currYear = new Date().getFullYear() + 543 + 1;
    } else {
      currYear = new Date().getFullYear() + 543;
    }
    this.formYear.get("budgetYear").patchValue(currYear);
    this.getCondMainHdrAll();
    // this.findByBudgetYear(0);
    this.getCapital();
    this.getCapitalWithoutOld();
    this.getRisk();
    this.getNoAudit();
    this.getMainCondRange();
  }

  ngAfterViewInit(): void {
    this.callDropDown();
    $("#calendar").calendar({
      // maxDate: new Date(),
      type: "year",
      text: TextDateTH,
      formatter: formatter('ป'),
      onChange: (date) => {
        let newYear = moment(date).year();
        this.formYear.get("budgetYear").patchValue(newYear);
      }
    });
    this.callRegDateCalendar();
    $(".ui.checkbox").checkbox();
  }

  callRegDateCalendar() {
    setTimeout(() => {
      $("#regDateStart").calendar({
        endCalendar: $('#regDateEnd'),
        type: "date",
        text: TextDateTH,
        formatter: formatter(),
        onChange: (date, text) => {
          this.modalForm.get('regDateStart').patchValue(text);
          this.regDateStartFirst = false;
          // let regDateStart = moment(date);
          // let regDateEnd = this.modalForm.get('regDateEnd').value.split("/");
          // let newRegDateEnd = moment(`${regDateEnd[2] - 543}-${regDateEnd[1]}-${regDateEnd[0]}`);

          // if (regDateStart.isAfter(newRegDateEnd, 'days')) {
          //   this.modalForm.get('regDateEnd').patchValue("");
          // }
        }
      });
      $("#regDateEnd").calendar({
        startCalendar: $('#regDateStart'),
        type: "date",
        text: TextDateTH,
        formatter: formatter(),
        onChange: (date, text) => {
          this.modalForm.get('regDateEnd').patchValue(text);
        }
      });
    }, 150);
  }

  getCondMessage() {
    const PATH = "ta/master-condition-main/condition-message/";
    this.ajax.doGet(PATH).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        if (null != res.data) {
          this.condTextUsed = { month: [], tax: [] };
          this.explainCondText = res.data;
        }
      }
    });
  }

  getCapital() {
    const URL = "ta/master-condition-sub/get-capital/";
    let data = {
      capital: {
        budgetYear: this.formYear.get("budgetYear").value
      }
    }
    this.ajax.doPost(URL, data).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.capital = [];
        if (0 != res.data.length) {
          this.capital = res.data;
          this.se21Form.get("dutyCode").patchValue("0000");
          this.getCapitalByDutyCode();
        } else {
          this.setSe21Form();
        }
      } else {
        this.msg.errorModal(res.message);
      }
    });
  }

  getCapitalByDutyCode() {

    const URL = "ta/master-condition-sub/get-capital-by-dutycode/";
    let data = {
      budgetYear: this.formYear.get("budgetYear").value,
      dutyCode: this.se21Form.get("dutyCode").value
    }
    this.ajax.doPost(URL, data).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        if (null != res.data) {
          this.se21Form.get("hugeCapitalAmount").patchValue(res.data.hugeCapitalAmount);
          this.se21Form.get("largeCapitalAmount").patchValue(res.data.largeCapitalAmount);
          this.se21Form.get("mediumCapitalAmount").patchValue(res.data.mediumCapitalAmount);
          this.se21Form.get("smallCapitalAmount").patchValue(res.data.smallCapitalAmount);
        } else {
          this.se21Form.get("hugeCapitalAmount").patchValue(null);
          this.se21Form.get("largeCapitalAmount").patchValue(null);
          this.se21Form.get("mediumCapitalAmount").patchValue(null);
          this.se21Form.get("smallCapitalAmount").patchValue(null);
        }
      } else {
        this.msg.errorModal(res.message);
      }
    });
  }

  getCapitalWithoutOld() {
    const URL = "ta/master-condition-sub/get-capital-without-old/";
    let data = {
      budgetYear: this.formYear.get("budgetYear").value
    }
    this.ajax.doPost(URL, data).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        if (0 != res.data.length) {
          this.selectProduct = res.data;
        } else {
        }
      } else {
        this.msg.errorModal(res.message);
      }
    });
  }

  getRisk() {
    const URL = "ta/master-condition-sub/get-risk/";
    let data = {
      budgetYear: this.formYear.get("budgetYear").value
    }
    this.ajax.doPost(URL, data).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        if (0 != res.data.length) {
          this.setSe22Form();
          for (let index = 0; index < res.data.length; index++) {
            let element = res.data[index];
            this.addProductTypeGroup();
            this.se22Form.get("productTypeGroup").get(index.toString()).get("dutyCode").patchValue(element.dutyCode);
            this.se22Form.get("productTypeGroup").get(index.toString()).get("riskDesc").patchValue(element.riskDesc);
            this.se22Form.get("productTypeGroup").get(index.toString()).get("riskLevel").patchValue(element.riskLevel);
          }
        }
      } else {
        this.msg.errorModal(res.message);
      }
    });
  }

  getNoAudit() {
    const URL = "ta/master-condition-sub/get-noaudit/";
    let data = {
      budgetYear: this.formYear.get("budgetYear").value
    }
    this.ajax.doPost(URL, data).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        if (null != res.data) {
          this.se23Form.get("noTaxAuditYearNum").patchValue(res.data.noTaxAuditYearNum);
        } else {
          this.se23Form.get("noTaxAuditYearNum").patchValue(null);
        }
      } else {
        this.msg.errorModal(res.message);
      }
    });
  }

  findByBudgetYear(type: number) {
    this.linkTab = [[true], false, false, false];

    this.condTextUsed = { month: [], tax: [] };
    this.getCondMainHdr();
    this.getCondMainDtl(type);

  }

  getCondMainHdrAll() {
    this.loading = true;
    const pathHdr = "ta/master-condition-main/find-hdr-all/";
    let body = {
      budgetYear: this.formYear.get("budgetYear").value
    }
    this.listLink1 = [];
    this.ajax.doPost(pathHdr, body).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.resHdr = res.data;
        if (0 != res.data.length) {
          this.listLink1 = res.data.sort((a, b) => {
            let condNumberA = a.condNumber.split("-");
            let condNumberB = b.condNumber.split("-");
            return Number(condNumberA[2]) - Number(condNumberB[2]);
          });
          this.onChangeLink(0, this.listLink1.length);
        } else {
          this.linkTab = [[true], false, false, false];
        }

        this.loading = false;
      } else {
        this.msg.errorModal(res.message);
      }
    });
  }

  getCondMainHdr() {
    this.loading = true;
    const pathHdr = "ta/master-condition-main/find-hdr/";
    let body = {
      budgetYear: this.formYear.get("budgetYear").value,
      condNumber: this.hdrForm.get("condNumber").value
    }
    this.ajax.doPost(pathHdr, body).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.resHdr = res.data;
        if (res.data != null) {
          this.hdrForm.get("monthNum").patchValue(this.resHdr.monthNum);
          this.hdrForm.get("condGroupNum").patchValue(this.resHdr.condGroupNum);
          this.hdrForm.get("condNumber").patchValue(this.resHdr.condNumber);
          this.hdrForm.get("condGroupDesc").patchValue(this.resHdr.condGroupDesc);
          this.hdrForm.get("officeCode").patchValue(this.resHdr.officeCode);
          this.hdrForm.get("budgetYear").patchValue(this.resHdr.budgetYear);
          this.hdrForm.get("newFacFlag").patchValue(this.resHdr.newFacFlag);
          this.hdrForm.get("regDateStart").patchValue(this.resHdr.regDateStart);
          this.hdrForm.get("regDateEnd").patchValue(this.resHdr.regDateEnd);
          this.dataIsNotNull = true;
        } else {
          this.setVariable();
          this.buttonHide = true;
          this.submitType = "save";
          this.dataIsNotNull = false;
        }
        this.callDropDown();
        this.loading = false;
      } else {
        this.msg.errorModal(res.message);
      }
    });
  }

  getCondMainDtl(type: number) {
    this.loading = true;
    const pathDtl = "ta/master-condition-main/find-dtl/";
    let body = {
      budgetYear: this.formYear.get("budgetYear").value,
      condNumber: this.hdrForm.get("condNumber").value
    }
    this.ajax.doPost(pathDtl, body).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        if (0 != res.data.length) {
          this.setVariable();
          this.resDtl = res.data;
          this.resDtl.sort((a, b) => {
            return a.condGroup - b.condGroup;
          })
          for (let i = 0; i < this.resDtl.length; i++) {
            const element = this.resDtl[i];
            this.se01Form.get("condGroup").get((i).toString()).get("condGroup").patchValue((i + 1).toString());
            this.se01Form.get("condGroup").get((i).toString()).get("condNumber").patchValue(this.resDtl[0].condNumber);
            this.se01Form.get("condGroup").get((i).toString()).get("taxFreqType").patchValue(element.taxFreqType);
            this.se01Form.get("condGroup").get((i).toString()).get("taxMonthStart").patchValue(element.taxMonthStart);
            this.se01Form.get("condGroup").get((i).toString()).get("taxMonthEnd").patchValue(element.taxMonthEnd);
            this.se01Form.get("condGroup").get((i).toString()).get("rangeTypeStart").patchValue(element.rangeTypeStart);
            if (null == this.se01Form.get("condGroup").get((i).toString()).get("rangeTypeEnd").value) {
              this.se01Form.get("condGroup").get((i).toString()).get("rangeTypeEnd").patchValue("0");
            } else {
              this.se01Form.get("condGroup").get((i).toString()).get("rangeTypeEnd").patchValue(element.rangeTypeEnd);
            }
            this.se01Form.get("condGroup").get((i).toString()).get("rangeStart").patchValue(element.rangeStart.toFixed(2));
            if (element.rangeEnd != null) {
              this.se01Form.get("condGroup").get((i).toString()).get("rangeEnd").patchValue(element.rangeEnd.toFixed(2));
            }
            this.se01Form.get("condGroup").get((i).toString()).get("riskLevel").patchValue(element.riskLevel);
            this.se01Form.get("condGroup").get((i).toString()).get("condDtlDesc").patchValue(element.condDtlDesc);
            this.addCondText();
            this.condTextTax(i.toString());

            this.condTextMonth(i.toString());
            if (i < this.resDtl.length - 1) {
              this.addCondGroup();
            }
          }
          if (this.resDtl.length < this.hdrForm.get("condGroupNum").value) {
            for (let index = 0; index < this.hdrForm.get("condGroupNum").value - this.resDtl.length; index++) {
              this.addCondGroup();
            }
          }
          if (this.hdrForm.get("condGroupNum").value > this.resDtl.length) {
            this.buttonHide = true;
          }
          this.submitType = "update";
        } else {
          if (1 < this.changeLinkId.id || this.changeLinkId.index == 0 || 0 == type) {
            this.setVariable();
            for (let i = 0; i < this.hdrForm.get("condGroupNum").value - 1; i++) {
              this.se01Form.get("condGroup").get((i).toString()).get("condGroup").patchValue(i + 1);
              this.addCondGroup();
            }
            this.se01Form.get("condGroup").get((this.se01Form.get("condGroup").value.length - 1).toString()).get("condGroup").patchValue(this.se01Form.get("condGroup").value.length);

            this.submitType = "save";
          }

          if (this.resDtl && this.hdrForm.get("condGroupNum").value > this.resDtl.length) {
            this.buttonHide = true;
          }
        }
        if (0 == type) {
          this.buttonHide = true;
        } else {
          this.buttonHide = false;
        }



        for (let i = 0; i < this.se01Form.get("condGroup").value.length; i++) {
          if ('1' == this.checkRangeTypeStart(i.toString()) || '2' == this.checkRangeTypeStart(i.toString())) {
            setTimeout(() => {
              $(`.rangeTypeEnd${i}`).show();
            }, 100);
          } else {
            setTimeout(() => {
              $(`.rangeTypeEnd${i}`).hide();
            }, 100);
          }
        }
        this.loading = false;
      } else {
        this.msg.errorModal(res.message);
      }
    })
  }

  getMainCondFreqType() {
    const URL = "ta/master-condition-main/get-main-cond-freq-type";
    const compVar = "Y";
    this.ajax.doGet(URL).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.taxFreqTypeLevel = res.data.filter(data => {
          return compVar == data.value2;
        })
      } else {
        this.msg.errorModal(res.message);
      }
    })
  }

  getCondMain2() {
    const URL = "preferences/parameter/TA_MAS_COND_MAIN_DESC/NEW_COMP";
    this.ajax.doPost(URL, {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.condMain2 = res.data.value1;
      } else {
        this.msg.errorModal(res.message);
      }
    })
  }

  getRiskLevel() {
    const URL = "preferences/parameter/TA_RISK_LEVEL";
    this.ajax.doPost(URL, {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.selectRiskLevel = res.data;
        this.selectRisk3Level = res.data.filter(({ value3 }) => "Y" == value3);
      } else {
        this.msg.errorModal(res.message);
      }
    })
  }

  getMainCondRange() {
    const URL = "ta/master-condition-main/get-main-cond-range/";
    this.ajax.doGet(URL).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.numMonthLevel = [];
        this.numMonthLevel2 = [];
        res.data.forEach(element => {
          if ("Y" == element.value2) {
            this.numMonthLevel.push({
              value: element.paramCode,
              text: element.value1
            })
          }
          if ("Y" == element.value3) {
            this.numMonthLevel2.push({
              value: element.paramCode,
              text: element.value1
            })
          }
        });

      } else {
        this.msg.errorModal(res.message);
      }
    })
  }

  setFormYear() {
    this.formYear = this.fb.group({
      budgetYear: [null, Validators.required]
    });
  }

  setHdrForm() {
    this.hdrForm = this.fb.group({
      officeCode: ["", Validators.required],
      condNumber: ["", Validators.required],
      budgetYear: ["", Validators.required],
      condGroupDesc: ["", Validators.required],
      monthNum: [null, Validators.required],
      condGroupNum: [null, Validators.required],
      newFacFlag: ["", Validators.required],
      regDateStart: ["", Validators.required],
      regDateEnd: ["", Validators.required]
    })
  }

  setModalForm() {
    this.modalForm = this.fb.group({
      officeCode: [""],
      condNumber: [""],
      budgetYear: [""],
      condGroupDesc: ["", Validators.required],
      monthNum: [null, Validators.required],
      condGroupNum: [null, Validators.required],
      newFacFlag: [true],
      regDateStart: ["", Validators.required],
      regDateEnd: ["", Validators.required]
    })
  }

  setVariable() {
    this.se01Form = this.fb.group({
      condGroup: this.fb.array([this.createCondGroup()])
    });

    let index = this.se01Form.get("condGroup").value.length;
    this.se01Form.get("condGroup").get((index - 1).toString()).get("condGroup").patchValue(index.toString());
    // this.se01Form.get("condGroup").value[index-1].condGroup.patchValue(this.se01Form.get("condGroup").value[index-1].length);
    // this.se22Form = this.fb.group({
    //   test: [null, Validators.required]
    // });
    this.callDropDown();
  }

  setSe21Form() {
    this.se21Form = this.fb.group({
      dutyCode: ["0000", Validators.required],
      hugeCapitalAmount: ["", Validators.required],
      largeCapitalAmount: ["", Validators.required],
      mediumCapitalAmount: ["", Validators.required],
      smallCapitalAmount: ["", Validators.required]
    })
  }

  setSe22Form() {
    this.se22Form = this.fb.group({
      productTypeGroup: this.fb.array([])
    })
  }

  setSe23Form() {
    this.se23Form = this.fb.group({
      noTaxAuditYearNum: [null, Validators.required]
    });
  }

  reDropDown(i) {
    this.onBtnHide();
    if ('1' == this.checkRangeTypeStart(i) || '2' == this.checkRangeTypeStart(i)) {
      $(`.rangeTypeEnd${i}`).show();
    } else {
      $(`.rangeTypeEnd${i}`).hide();
      $(`.rangeTypeEnd${i}`).remove();
    }

    setTimeout(() => {
      $(`.rangeTypeEnd${i}`).dropdown();
    }, 200);
  }

  checkFrequency(index: string) {
    if ('2' == this.se01Form.get('condGroup').get(index.toString()).get('taxFreqType').value) {
      return true;
    } else {
      return false;
    }
  }

  checkRangeTypeEnd(index: string) {
    return this.se01Form.get('condGroup').get(index.toString()).get('rangeTypeEnd').value;
  }

  checkRangeTypeStart(index: string) {
    return this.se01Form.get('condGroup').get(index.toString()).get('rangeTypeStart').value;
  }

  search() {
    console.log("dddddd");
    this.dataIsNotNull = false;
    this.getCondMainHdrAll();
    // this.findByBudgetYear(0);
    this.onChangeLink("", "");

    this.getCapital();
    this.getCapitalWithoutOld();
    this.getRisk();
    this.getNoAudit();
  }
  createCondGroup(): FormGroup {
    return this.fb.group({
      condGroup: [""],
      condNumber: [""],
      taxFreqType: ["", Validators.required],
      taxMonthStart: [null, Validators.required],
      taxMonthEnd: [null, Validators.required],
      rangeTypeStart: ["", Validators.required],
      rangeTypeEnd: ["0"],
      rangeStart: [null, Validators.required],
      rangeEnd: [null, Validators.required],
      riskLevel: ["4", Validators.required],
      condDtlDesc: ["", Validators.required]
    });
  }

  createProductTypeGroup(): FormGroup {
    return this.fb.group({
      dutyCode: ["", Validators.required],
      riskDesc: ["", Validators.required],
      riskLevel: ["", Validators.required]
    });
  }

  addCondGroup(): void {
    this.condGroup = this.se01Form.get("condGroup") as FormArray;
    this.condGroup.push(this.createCondGroup());
    this.buttonHide = true;
    this.callDropDown();
  }

  addProductTypeGroup(): void {
    this.productTypeGroup = this.se22Form.get("productTypeGroup") as FormArray;
    this.productTypeGroup.push(this.createProductTypeGroup());
  }

  removeCondGroup(index: number): void {
    this.condGroup.removeAt(index);
    this.buttonHide = true;
  }

  onChangeLink(id, index) {
    this.changeLinkId.idxChk1 = index;
    this.submitted = false;
    if (null == this.changeLinkId.idxChk2) {
      this.changeLinkId.idxChk2 = this.changeLinkId.idxChk1;
    } else {
      if (this.changeLinkId.idxChk2 == this.changeLinkId.idxChk1) {
        this.changeLinkId.index = 0;
      } else {
        this.changeLinkId.index = 1;
        this.changeLinkId.idxChk2 = this.changeLinkId.idxChk1;
      }
    }
    if (0 == id) {
      this.changeLinkId.id += 1;
    } else {
      this.changeLinkId.id = 0;
    }
    this.linkTab = [[true], false, false, false];
    this.linkTab1 = false;
    if (id === 0) {
      if (null != index) {

        this.dataIsNotNull = true;
        this.listLink1Id = index;
        this.hdrForm.get("officeCode").patchValue(this.listLink1[index - 1].officeCode)
        this.hdrForm.get("budgetYear").patchValue(this.listLink1[index - 1].budgetYear)
        this.hdrForm.get("condNumber").patchValue(this.listLink1[index - 1].condNumber)
        this.hdrForm.get("condGroupDesc").patchValue(this.listLink1[index - 1].condGroupDesc)
        this.hdrForm.get("monthNum").patchValue(this.listLink1[index - 1].monthNum)
        this.hdrForm.get("condGroupNum").patchValue(this.listLink1[index - 1].condGroupNum)
        this.hdrForm.get("newFacFlag").patchValue(this.listLink1[index - 1].newFacFlag)
        this.hdrForm.get("regDateStart").patchValue(this.listLink1[index - 1].regDateStart);
        this.hdrForm.get("regDateEnd").patchValue(this.listLink1[index - 1].regDateEnd);

        this.findByBudgetYear(1);
        this.linkTab[0] = [true];
        this.listLink1.forEach(element => {
          this.linkTab[0].push(false);
        });
        this.linkTab[0][index] = [true];
        this.linkTab1 = true;
      }
    } else if (id == 1) {
      setTimeout(() => {
        $('#capital').dropdown('set selected', '0000');
      }, 100);
      this.linkTab = [false, true, false, false];
    } else if (id == 2) {
      this.linkTab = [false, false, true, false];
    } else if (id == 3) {
      this.linkTab = [false, false, false, true];
    }
    this.callDropDown();
  }

  onChangeRangeTypeEnd(num: string) {
    console.log("rangeTypeEnd ", num, " : ", '0' == this.se01Form.get('condGroup').value[num].rangeTypeEnd);
    if ('0' == this.se01Form.get('condGroup').get(num.toString()).get("rangeTypeEnd").value) {
      this.se01Form.get('condGroup').get(num.toString()).get("rangeEnd").patchValue("0");
    }
    this.onBtnHide();
  }

  onRiskLevelChange(index: string) {
    this.condTextMonth(index);
    this.onBtnHide();
  }

  numMonthModalShow(id: number) {
    this.submitModalType = id;
    let index = this.listLink1Id;
    if (0 == id) {
      this.confModal = false;
      this.setModalForm();
    } else {
      this.confModal = true;
      this.setModalForm();
      this.modalForm.get("officeCode").patchValue(this.listLink1[index - 1].officeCode)
      this.modalForm.get("budgetYear").patchValue(this.listLink1[index - 1].budgetYear)
      this.modalForm.get("condNumber").patchValue(this.listLink1[index - 1].condNumber)
      this.modalForm.get("condGroupDesc").patchValue(this.listLink1[index - 1].condGroupDesc)
      this.modalForm.get("monthNum").patchValue(this.listLink1[index - 1].monthNum)
      this.modalForm.get("condGroupNum").patchValue(this.listLink1[index - 1].condGroupNum)
      let regDateStart = moment(this.listLink1[index - 1].regDateStart).format("DD/MM/YYYY")
      let regDateEnd = this.listLink1[index - 1].regDateEnd.split("/");
      let newRegDateEnd = moment(`${regDateEnd[1]}/${regDateEnd[0]}/${regDateEnd[2]}`).format("DD/MM/YYYY")
      this.modalForm.get("regDateStart").patchValue(regDateStart)
      this.modalForm.get("regDateEnd").patchValue(newRegDateEnd)
      this.regDateStartFirst = true;
      // this.modalForm.get("regDateStart").patchValue(this.listLink1[index - 1].regDateStart)
      // this.modalForm.get("regDateEnd").patchValue(this.listLink1[index - 1].regDateEnd)
      if ("Y" == this.listLink1[index - 1].newFacFlag) {
        this.modalForm.get("newFacFlag").patchValue(true);
      } else {
        this.modalForm.get("newFacFlag").patchValue(false);
      }
    }
    this.callRegDateCalendar();
    this.callDropDown();
    $('#numMonthModal').modal('show');
  }

  addCapitalModalShow() {
    this.getCapitalWithoutOld();
    this.callDropDown();
    this.dutyCodeModal = null;
    $('#addCapitalModal').modal('show');
    this.reDropDownModal();
    // $('.dutyCodeModal').dropdown("set selected", '0');
  }

  onChangeValue(index: string, name: string, event) {
    this.se01Form.get("condGroup").get(index.toString()).get(name).patchValue(Number(event.target.value).toFixed(2));
    this.condTextTax(index);
    this.onBtnHide();
  }

  condTextTax(index: string) {
    let rangeStart = this.se01Form.get("condGroup").get(index.toString()).get("rangeStart").value;
    let rangeEnd = this.se01Form.get("condGroup").get(index.toString()).get("rangeEnd").value;
    let rangeTypeStart = this.numMonthLevel.filter(({ value }) => {
      return value == this.se01Form.get("condGroup").get(index.toString()).get("rangeTypeStart").value;
    });
    let rangeTypeEnd = this.numMonthLevel2.filter(({ value }) => {
      if (null == this.se01Form.get("condGroup").get(index.toString()).get("rangeTypeEnd").value) {
        return { value: "", text: "" };
      } else {
        return value == this.se01Form.get("condGroup").get(index.toString()).get("rangeTypeEnd").value;
      }
    });

    if (((0 != rangeTypeStart.length && "1" == rangeTypeStart[0].value) || (0 != rangeTypeStart.length && "2" == rangeTypeStart[0].value))
      && ((0 != rangeTypeEnd.length && "4" == rangeTypeEnd[0].value) || (0 != rangeTypeEnd.length && "5" == rangeTypeEnd[0].value))) {
      let mapObj = { "#RTS#": rangeTypeStart[0].text, "#RS#": Number(rangeStart), "#RTE#": rangeTypeEnd[0].text, "#RE#": Number(rangeEnd) };
      let re = new RegExp(Object.keys(mapObj).join("|"), "gi");
      this.condTextUsed.tax[Number(index)] = this.explainCondText.msgTax2;
      this.condTextUsed.tax[Number(index)] = this.condTextUsed.tax[Number(index)].replace(re, function (matched) {
        return mapObj[matched];
      });
      if (Utils.isNull(this.condTextUsed.month[Number(index)])) {
        this.se01Form.get("condGroup").get(index.toString()).get("condDtlDesc").patchValue(this.condTextUsed.tax[Number(index)]);
      } else if (Utils.isNull(this.condTextUsed.tax[Number(index)])) {
        this.se01Form.get("condGroup").get(index.toString()).get("condDtlDesc").patchValue(this.condTextUsed.month[Number(index)]);
      } else {
        this.se01Form.get("condGroup").get(index.toString()).get("condDtlDesc").patchValue(this.condTextUsed.month[Number(index)] + " " + this.condTextUsed.tax[Number(index)]);
      }
    } else {
      let mapObj = { "#RTS#": rangeTypeStart[0].text, "#RS#": Number(rangeStart) };
      let re = new RegExp(Object.keys(mapObj).join("|"), "gi");
      this.condTextUsed.tax[Number(index)] = this.explainCondText.msgTax1;
      this.condTextUsed.tax[Number(index)] = this.condTextUsed.tax[Number(index)].replace(re, function (matched) {
        return mapObj[matched];
      });
      if (Utils.isNull(this.condTextUsed.month[Number(index)])) {
        this.se01Form.get("condGroup").get(index.toString()).get("condDtlDesc").patchValue(this.condTextUsed.tax[Number(index)]);
      } else if (Utils.isNull(this.condTextUsed.tax[Number(index)])) {
        this.se01Form.get("condGroup").get(index.toString()).get("condDtlDesc").patchValue(this.condTextUsed.month[Number(index)]);
      } else {
        this.se01Form.get("condGroup").get(index.toString()).get("condDtlDesc").patchValue(this.condTextUsed.month[Number(index)] + " " + this.condTextUsed.tax[Number(index)]);
      }
    }

    // if (-100 == Number(rangeStart) && 100 == Number(rangeEnd) || -100 < Number(rangeStart) && 100 > Number(rangeEnd)) {
    //   let mapObj = { "#Tax1#": Number(rangeStart), "#Tax2#": Number(rangeEnd) };
    //   let re = new RegExp(Object.keys(mapObj).join("|"), "gi");
    //   this.condTextUsed.tax[Number(index)] = this.explainCondText.msgTax2;
    //   this.condTextUsed.tax[Number(index)] = this.condTextUsed.tax[Number(index)].replace(re, function (matched) {
    //     return mapObj[matched];
    //   });
    //   // this.se01Form.get("condGroup").get(index.toString()).get("rangeTypeStart").patchValue("2");
    // } else if (100 == Number(rangeEnd)) {
    //   this.condTextUsed.tax[Number(index)] = this.explainCondText.msgTax1;
    //   this.condTextUsed.tax[Number(index)] = this.condTextUsed.tax[Number(index)].replace("#Tax#", Number(rangeStart));
    //   // this.se01Form.get("condGroup").get(index.toString()).get("rangeTypeStart").patchValue("3");
    // } else if (-100 == Number(rangeStart)) {
    //   this.condTextUsed.tax[Number(index)] = this.explainCondText.msgTax3;
    //   this.condTextUsed.tax[Number(index)] = this.condTextUsed.tax[Number(index)].replace("#Tax#", Number(rangeEnd));
    //   // this.se01Form.get("condGroup").get(index.toString()).get("rangeTypeStart").patchValue("1");
    // }
  }

  condTextMonth(index: string) {
    let numMonth = this.hdrForm.get("monthNum").value;
    let taxMonthStart = this.se01Form.get("condGroup").get(index.toString()).get("taxMonthStart").value;
    let taxMonthEnd = this.se01Form.get("condGroup").get(index.toString()).get("taxMonthEnd").value;

    let riskLevel = this.selectRiskLevel.filter(({ paramCode }) => {
      return paramCode == this.se01Form.get("condGroup").get(index.toString()).get("riskLevel").value;
    })

    if (Number(numMonth) == Number(taxMonthStart) && Number(numMonth) == Number(taxMonthEnd)) {
      this.condTextUsed.month[Number(index)] = this.explainCondText.msgMonth1;
      this.condTextUsed.month[Number(index)] = this.condTextUsed.month[Number(index)].replace("#RISK#", riskLevel[0].value1);
      this.condTextUsed.month[Number(index)] = this.condTextUsed.month[Number(index)].replace("#MONTH#", numMonth);
      if ("" == this.se01Form.get("condGroup").get(index.toString()).get("taxFreqType").value) {
        this.se01Form.get("condGroup").get(index.toString()).get("taxFreqType").patchValue("1");
      } else {
        this.se01Form.get("condGroup").get(index.toString()).get("taxFreqType").patchValue(this.se01Form.get("condGroup").get(index.toString()).get("taxFreqType").value);
      }
      if (Utils.isNull(this.condTextUsed.month[Number(index)])) {
        this.se01Form.get("condGroup").get(index.toString()).get("condDtlDesc").patchValue(this.condTextUsed.tax[Number(index)]);
      } else if (Utils.isNull(this.condTextUsed.tax[Number(index)])) {
        this.se01Form.get("condGroup").get(index.toString()).get("condDtlDesc").patchValue(this.condTextUsed.month[Number(index)]);
      } else {
        this.se01Form.get("condGroup").get(index.toString()).get("condDtlDesc").patchValue(this.condTextUsed.month[Number(index)] + " " + this.condTextUsed.tax[Number(index)]);
      }
    } else {
      this.condTextUsed.month[Number(index)] = this.explainCondText.msgMonth2;
      this.condTextUsed.month[Number(index)] = this.condTextUsed.month[Number(index)].replace("#RISK#", riskLevel[0].value1);
      this.condTextUsed.month[Number(index)] = this.condTextUsed.month[Number(index)].replace("#MONTH#", numMonth);
      if ("" == this.se01Form.get("condGroup").get(index.toString()).get("taxFreqType").value) {
        this.se01Form.get("condGroup").get(index.toString()).get("taxFreqType").patchValue("2");
      } else {
        this.se01Form.get("condGroup").get(index.toString()).get("taxFreqType").patchValue(this.se01Form.get("condGroup").get(index.toString()).get("taxFreqType").value);
      }
      if (Utils.isNull(this.condTextUsed.month[Number(index)])) {
        this.se01Form.get("condGroup").get(index.toString()).get("condDtlDesc").patchValue(this.condTextUsed.tax[Number(index)]);
      } else if (Utils.isNull(this.condTextUsed.tax[Number(index)])) {
        this.se01Form.get("condGroup").get(index.toString()).get("condDtlDesc").patchValue(this.condTextUsed.month[Number(index)]);
      } else {
        this.se01Form.get("condGroup").get(index.toString()).get("condDtlDesc").patchValue(this.condTextUsed.month[Number(index)] + " " + this.condTextUsed.tax[Number(index)]);
      }
    }
  }

  addCondText() {
    this.condTextUsed.month.push("");
    this.condTextUsed.tax.push("");
  }

  onFocus(event, formControlName: string) {
    this.se21Form.get(formControlName).patchValue(event.target.value.replace(/,/g, ''));
  }

  onBlur(event, formControlName: string) {
    this.se21Form.get(formControlName).patchValue(new DecimalFormatPipe().transform(event.target.value, "###,###"));
    this.se2FormChange(formControlName);
  }

  onBtnHide() {
    this.buttonHide = true;
  }

  onSubmit(e) {
    e.preventDefault();

    console.log(" budgetYear => ", this.formYear.get("budgetYear").value);
    console.log(" monthNum => ", this.hdrForm.get("monthNum").value);
    let hdrForm;
    if (null == this.hdrForm.get("monthNum").value) {
      this.findByBudgetYear(0);
    } else {
      hdrForm = this.hdrForm.value;
    }
    console.log(" condGroup => ", this.se01Form.get("condGroup").value);
    console.log(" hdrForm => ", hdrForm);

    this.submitted = true;

    let numMonth = this.hdrForm.get("monthNum").value;
    for (let index = 0; index < this.se01Form.get("condGroup").value.length; index++) {
      const element = this.se01Form.get("condGroup").value[index];
      if (Number(element.taxMonthStart) < 0 || Number(element.taxMonthStart) > Number(numMonth) ||
        Number(element.rangeStart) < -100 || Number(element.rangeEnd) > 100) {
        this.msg.errorModal("กรุณากรอกข้อมูลให้ถูกต้อง");
        this.linkTab = [true, false, false, false];
        return;
      }
    }

    for (let index = 0; index < this.se01Form.get("condGroup").value.length; index++) {
      let element = this.se01Form.get("condGroup").value[index];
      if (1 == element.taxFreqType) {
        let monthNum = this.hdrForm.get("monthNum").value;
        this.se01Form.get("condGroup").get(index.toString()).get("taxMonthStart").patchValue(monthNum);
        this.se01Form.get("condGroup").get(index.toString()).get("taxMonthEnd").patchValue(monthNum);
      }
      if (3 == Number(this.se01Form.get("condGroup").get(index.toString()).get("rangeTypeStart").value)) {
        this.se01Form.get("condGroup").get(index.toString()).get("rangeStart").patchValue(Number.parseFloat(element.rangeStart));
        this.se01Form.get("condGroup").get(index.toString()).get("rangeEnd").patchValue(Number.parseFloat(element.rangeStart));
        this.se01Form.get("condGroup").get(index.toString()).get("rangeTypeEnd").patchValue("0");
      } else if (4 == Number(this.se01Form.get("condGroup").get(index.toString()).get("rangeTypeStart").value)) {
        this.se01Form.get("condGroup").get(index.toString()).get("rangeStart").patchValue(Number.parseFloat(element.rangeStart));
        this.se01Form.get("condGroup").get(index.toString()).get("rangeEnd").patchValue(-100);
        this.se01Form.get("condGroup").get(index.toString()).get("rangeTypeEnd").patchValue("0");
      } else if (5 == Number(this.se01Form.get("condGroup").get(index.toString()).get("rangeTypeStart").value)) {
        this.se01Form.get("condGroup").get(index.toString()).get("rangeStart").patchValue(Number.parseFloat(element.rangeStart));
        this.se01Form.get("condGroup").get(index.toString()).get("rangeEnd").patchValue(-100);
        this.se01Form.get("condGroup").get(index.toString()).get("rangeTypeEnd").patchValue("0");
      } else {
        if (0 == Number(this.se01Form.get("condGroup").get(index.toString()).get("rangeTypeEnd").value)) {
          this.se01Form.get("condGroup").get(index.toString()).get("rangeStart").patchValue(Number.parseFloat(element.rangeStart));
          this.se01Form.get("condGroup").get(index.toString()).get("rangeEnd").patchValue(100);
          this.se01Form.get("condGroup").get(index.toString()).get("rangeTypeEnd").patchValue("0");
        } else {
          this.se01Form.get("condGroup").get(index.toString()).get("rangeStart").patchValue(Number.parseFloat(element.rangeStart));
          this.se01Form.get("condGroup").get(index.toString()).get("rangeEnd").patchValue(Number.parseFloat(element.rangeEnd));
        }
      }
    }

    if (this.se01Form.invalid) {
      this.msg.errorModal("กรุณากรอกข้อมูลให้ครบ");
      return;
    }

    this.msg.comfirm(confirm => {

      if (confirm) {

        this.loading = true;
        let dataDetail = this.se01Form.get("condGroup").value;
        let dataHeader = this.hdrForm.value;
        let dataAll = {
          detail: dataDetail,
          header: dataHeader
        }
        const page = "select06";
        let data = {
          budgetYear: this.formYear.get("budgetYear").value,
          monthNum: this.hdrForm.get("monthNum").value
        }
        this.select.setData(page, data);
        if (this.submitType == "save") {
          const URL = "ta/master-condition-main/create-dtl/";
          this.ajax.doPost(URL, dataAll).subscribe((res: ResponseData<any>) => {
            if (MessageService.MSG.SUCCESS == res.status) {
              this.msg.successModal(res.message);
              this.buttonHide = false;
              this.findByBudgetYear(1);
            } else {
              this.msg.successModal(res.message);
            }
            this.onChangeLink(0, 1);
            this.loading = false;
          });
        } else {
          for (let index = 0; index < dataDetail.length; index++) {
            if (this.resDtl.length < dataDetail.length && index > this.resDtl.length - 1) {
              dataDetail[index]["masCondMainDtlId"] = null;
            } else {
              dataDetail[index]["masCondMainDtlId"] = this.resDtl[index].masCondMainDtlId;
            }
          }
          let dataAll = {
            detail: dataDetail,
            header: dataHeader
          }
          const URL = "ta/master-condition-main/update-dtl/";
          this.ajax.doPost(URL, dataAll).subscribe((res: ResponseData<any>) => {
            if (MessageService.MSG.SUCCESS == res.status) {
              this.msg.successModal(res.message);
              this.buttonHide = false;
              this.findByBudgetYear(1);
            } else {
              this.msg.errorModal(res.message);
            }
            this.onChangeLink(0, 1);
            this.loading = false;
          })
        }
      }
    }, "ยืนยันการบันทึกข้อมูล");
  }

  createWs() {
    const page = "select06";
    let data = {
      budgetYear: this.formYear.get("budgetYear").value,
      monthNum: this.hdrForm.get("monthNum").value
    }
    this.select.setData(page, data);
    this.router.navigate(["/tax-audit-new/ta01/02"]);
  }

  dutyCodeChange() {
    this.onBtnHide();
    this.getCapitalByDutyCode();
  }

  submitSe21Form() {
    if (this.se21Form.invalid) {
      this.msg.errorModal("กรุณากรอกข้อมูลให้ครบ");
      return;
    }

    this.msg.comfirm(confirm => {
      if (confirm) {
        const URL = "ta/master-condition-sub/insert-capital/";
        let data = {
          budgetYear: this.formYear.get("budgetYear").value,
          dutyCode: this.se21Form.get("dutyCode").value,
          hugeCapitalAmount: this.se21Form.get("hugeCapitalAmount").value,
          largeCapitalAmount: this.se21Form.get("largeCapitalAmount").value,
          mediumCapitalAmount: this.se21Form.get("mediumCapitalAmount").value,
          smallCapitalAmount: this.se21Form.get("smallCapitalAmount").value
        }
        this.ajax.doPost(URL, data).subscribe((res: ResponseData<any>) => {
          if (MessageService.MSG.SUCCESS == res.status) {
            this.msg.successModal(res.message);
          } else {
            this.msg.errorModal(res.message);
          }
        })
      }
    }, "ยืนยันการบันทึกข้อมูล");
  }

  submitSe22Form() {
    if (this.se22Form.invalid) {
      this.msg.errorModal("กรุณากรอกข้อมูลให้ครบ");
      return;
    }

    const URL = "ta/master-condition-sub/insert-risk/";
    let data = {
      budgetYear: this.formYear.get("budgetYear").value,
      riskList: this.se22Form.get("productTypeGroup").value
    }
    this.loading = true;
    this.ajax.doPost(URL, data).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.msg.successModal(res.message);
      } else {
        this.msg.errorModal(res.message);
      }
      this.loading = false;
    });
  }

  submitSe23Form() {
    if (this.se23Form.get("noTaxAuditYearNum").value < 0) {
      this.msg.errorModal("กรุณากรอกข้อมูลให้ถูกต้อง");
      return;
    }
    if (this.se23Form.invalid) {
      this.msg.errorModal("กรุณากรอกข้อมูลให้ครบ");
      this.linkTab = [false, false, false, true]
      return;
    }

    const URL = "ta/master-condition-sub/insert-noaudit/";
    let data = {
      budgetYear: this.formYear.get("budgetYear").value,
      noTaxAuditYearNum: this.se23Form.get("noTaxAuditYearNum").value
    }
    this.loading = true;
    this.ajax.doPost(URL, data).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.msg.successModal(res.message);
      } else {
        this.msg.errorModal(res.message);
      }
      this.loading = false;
    })
  }

  se2FormChange(formCongtrolName: string) {
    let number = Number(this.se21Form.get(formCongtrolName).value.replace(/,/g, ''));
    let hugeCapitalAmount = Number(this.setNumToString(this.se21Form.get("hugeCapitalAmount").value).replace(/,/g, ''));
    let largeCapitalAmount = Number(this.setNumToString(this.se21Form.get("largeCapitalAmount").value).replace(/,/g, ''));
    let mediumCapitalAmount = Number(this.setNumToString(this.se21Form.get("mediumCapitalAmount").value).replace(/,/g, ''));
    let smallCapitalAmount = Number(this.setNumToString(this.se21Form.get("smallCapitalAmount").value).replace(/,/g, ''));
    if (0 >= number) {
      this.se21Form.get(formCongtrolName).patchValue(0);
    } else {
      if (hugeCapitalAmount <= largeCapitalAmount) {
        this.se21Form.get("largeCapitalAmount").patchValue(new DecimalFormatPipe().transform(Number(hugeCapitalAmount - 1).toString(), "###,###"));
        if (0 >= largeCapitalAmount) {
          this.se21Form.get("largeCapitalAmount").patchValue(0);
        }
      }
      if (largeCapitalAmount <= mediumCapitalAmount) {
        this.se21Form.get("mediumCapitalAmount").patchValue(new DecimalFormatPipe().transform(Number(largeCapitalAmount - 1).toString(), "###,###"));
        if (0 >= mediumCapitalAmount) {
          this.se21Form.get("mediumCapitalAmount").patchValue(0);
        }
      }
      if (mediumCapitalAmount <= smallCapitalAmount) {
        this.se21Form.get("smallCapitalAmount").patchValue(new DecimalFormatPipe().transform(Number(mediumCapitalAmount).toString(), "###,###"));
        if (0 >= smallCapitalAmount) {
          this.se21Form.get("smallCapitalAmount").patchValue(0);
        }
      }
    }

  }

  setNumToString(number: any) {
    const zero = 0;
    let data = "0"
    if (zero != number) {
      data = number.toString();
    }
    return data;
  }

  onSaveModal() {
    this.modalSubmitted = true;

    if (true == this.modalForm.get("newFacFlag").value) {
      this.modalForm.get("newFacFlag").patchValue("Y");
    } else if (false == this.modalForm.get("newFacFlag").value) {
      this.modalForm.get("newFacFlag").patchValue("N");
    }

    if (this.modalForm.invalid) {
      this.msg.errorModal("กรุณากรอกข้อมูลให้ครบ", "เกิดข้อผิดพลาด", (res: any) => {
        if (res) {
          this.numMonthModalShow(0);
        }
      });
      return;
    }

    if (this.regDateStartFirst) {
      let regDateStart = this.modalForm.get("regDateStart").value.split("/");
      this.modalForm.get("regDateStart").patchValue(`${regDateStart[1]}/${regDateStart[0]}/${regDateStart[2]}`)
    }

    let checkMonthNumCondGroupNum = this.listLink1.some(e =>
      e.monthNum == Number(this.modalForm.get("monthNum").value)
      && e.condGroupNum == Number(this.modalForm.get("condGroupNum").value) 
      && e.condNumber != this.modalForm.get("condNumber").value
    );
    if (checkMonthNumCondGroupNum) {
      this.msg.errorModal("จำนวนเดือนในการประเมินคัดเลือกรายซ้ำ!!!", "เกิดข้อผิดพลาด", (res: any) => {
        if (res) {
          if ("Y" == this.modalForm.get("newFacFlag").value) {
            this.modalForm.get("newFacFlag").setValue(true);
          } else {
            this.modalForm.get("newFacFlag").setValue(false);
          }
          $('#numMonthModal').modal('show');
        }
      });
      return;
    }

    if (0 == this.submitModalType) {

      this.msg.comfirm(confirm => {
        if (confirm) {
          const URL = "ta/master-condition-main/create-hdr/";
          let data = {
            condNumber: this.modalForm.get("condNumber").value,
            budgetYear: this.formYear.get("budgetYear").value,
            condGroupDesc: this.modalForm.get("condGroupDesc").value,
            monthNum: this.modalForm.get("monthNum").value,
            condGroupNum: this.modalForm.get("condGroupNum").value,
            newFacFlag: this.modalForm.get("newFacFlag").value,
            regDateStart: this.modalForm.get("regDateStart").value,
            regDateEnd: this.modalForm.get("regDateEnd").value
          }
          this.ajax.doPost(URL, data).subscribe((res: ResponseData<any>) => {
            if (MessageService.MSG.SUCCESS == res.status) {
              this.msg.successModal(res.message);
              this.setModalForm();
            } else {
              this.msg.errorModal(res.message);
            }
            this.getCondMainHdrAll();
          })
        }
      }, "ยืนยันการบันทึกข้อมูล");
    } else {
      this.msg.comfirm(confirm => {
        if (confirm) {
          const URL = "ta/master-condition-main/update-hdr/";
          let data = {
            condNumber: this.modalForm.get("condNumber").value,
            budgetYear: this.formYear.get("budgetYear").value,
            condGroupDesc: this.modalForm.get("condGroupDesc").value,
            monthNum: this.modalForm.get("monthNum").value,
            condGroupNum: this.modalForm.get("condGroupNum").value,
            newFacFlag: this.modalForm.get("newFacFlag").value,
            regDateStart: this.modalForm.get("regDateStart").value,
            regDateEnd: this.modalForm.get("regDateEnd").value
          }
          this.ajax.doPost(URL, data).subscribe((res: ResponseData<any>) => {
            if (MessageService.MSG.SUCCESS == res.status) {
              this.msg.successModal(res.message);
              this.setModalForm();
            } else {
              this.msg.errorModal(res.message);
            }
            this.getCondMainHdrAll();
          })
        }
      }, "ยืนยันการบันทึกข้อมูล");
    }
  }

  onDeleteModal() {
    this.msg.comfirm(confirm => {
      if (confirm) {
        const URL = "ta/master-condition-main/delete/";
        let data = {
          condNumber: this.modalForm.get("condNumber").value
        }
        this.ajax.doPost(URL, data).subscribe((res: ResponseData<any>) => {
          if (MessageService.MSG.SUCCESS == res.status) {
            this.msg.successModal(res.message);
            this.setModalForm();
          } else {
            this.msg.errorModal(res.message);
          }
          this.getCondMainHdrAll();
        })
        this.onChangeLink("", "");
      }
    }, "ยืนยันการลบข้อมูล");
  }

  onClearModal() {
    this.modalForm.reset();
    this.callDropDown();
  }

  onAddCapitalModal() {
    if (Utils.isNull(this.dutyCodeModal)) {
      // this.msg.errorModal(MessageBarService.VALIDATE_INCOMPLETE);
      this.addCapModalSubmitted = true;
      // return this.addCapitalModalShow();
    } else {
      this.addCapModalSubmitted = false;
      this.msg.comfirm(confirm => {
        if (confirm) {
          const URL = "ta/master-condition-sub/insert-capital/";
          let data = {
            budgetYear: this.formYear.get("budgetYear").value,
            dutyCode: this.dutyCodeModal,
            hugeCapitalAmount: this.se21Form.get("hugeCapitalAmount").value,
            largeCapitalAmount: this.se21Form.get("largeCapitalAmount").value,
            mediumCapitalAmount: this.se21Form.get("mediumCapitalAmount").value,
            smallCapitalAmount: this.se21Form.get("smallCapitalAmount").value
          }
          this.ajax.doPost(URL, data).subscribe((res: ResponseData<any>) => {
            if (MessageService.MSG.SUCCESS == res.status) {
              this.msg.successModal(res.message);
              this.getCapital();
              this.getCapitalWithoutOld();
            } else {
              this.msg.errorModal(res.message);
            }
          })
        }
      }, "ยืนยันการเพิ่มข้อมูล");
    }
  }

  onDeleteCapital() {
    this.msg.comfirm(confirm => {
      if (confirm) {
        const URL = "ta/master-condition-sub/delete-capital/";
        let data = {
          budgetYear: this.formYear.get("budgetYear").value,
          dutyCode: this.se21Form.get("dutyCode").value
        }
        this.ajax.doPost(URL, data).subscribe((res: ResponseData<any>) => {
          if (MessageService.MSG.SUCCESS == res.status) {
            this.msg.successModal(res.message);
            this.getCapital();
            this.getCapitalWithoutOld();
            $('.dutyCode').dropdown('set selected', '0000');
          } else {
            this.msg.errorModal(res.message);
          }
        })
      }
    }, "ยืนยันการลบข้อมูล");
  }

  validateModalForm(value: string) {
    return this.modalSubmitted && this.modalForm.get(value).errors;
  }

  validateSe01Form(index: string, value: string) {
    return this.submitted && this.se01Form.get('condGroup').get(index.toString()).get(value).errors;
  }

  validateSe21Form(value: string) {
    return this.submitted && this.se21Form.get(value).errors;
  }

  validateSe22Form(index: string, value: string) {
    return this.submitted && this.se22Form.get('productTypeGroup').get(index.toString()).get(value).errors;
  }

  validateSe23Form(value: string) {
    return this.submitted && this.se23Form.get(value).errors;
  }

  valedateFieldCondGroup(event, name: string) {
    let numMonth = this.hdrForm.get("monthNum").value;
    if (name == 'taxMonthStart') {
      if (numMonth < event.value) {
        return true;
      } else if (0 > event.value) {
        return true;
      } else if (null == event.value) {
        return true;
      }
    } else if (name == 'taxMonthEnd') {
      if (numMonth < event.value) {
        return true;
      } else if (0 > event.value) {
        return true;
      } else if (null == event.value) {
        return true;
      }
    } else if (name == 'rangeStart') {
      if (null == event.value) {
        return true;
      }
    } else if (name == 'rangeEnd') {
      if (null == event.value) {
        return true;
      }
    } else if (name == 'riskLevel') {
      if (null == event.value) {
        return true;
      }
    } else {
      return false;
    }
  }

  onFormValueChange(form, name: string, index: string) {
    let numMonth = this.hdrForm.get("monthNum").value;
    if ("taxFreqType" == name) {
      let riskLevel = this.selectRiskLevel.filter(({ paramCode }) => {
        return paramCode == this.se01Form.get("condGroup").get(index.toString()).get("riskLevel").value;
      })
      this.se01Form.get("condGroup").get(index.toString()).get("taxMonthStart").patchValue(null);
      this.se01Form.get("condGroup").get(index.toString()).get("taxMonthEnd").patchValue(null);
      if ('1' == form.value) {
        this.condTextUsed.month[Number(index)] = this.explainCondText.msgMonth1;
        this.condTextUsed.month[Number(index)] = this.condTextUsed.month[Number(index)].replace("#RISK#", riskLevel[0].value1);
        this.condTextUsed.month[Number(index)] = this.condTextUsed.month[Number(index)].replace("#MONTH#", numMonth);
        this.se01Form.get("condGroup").get(index.toString()).get("taxFreqType").patchValue("1");
        this.se01Form.get("condGroup").get(index.toString()).get("taxMonthStart").patchValue(numMonth);
        this.se01Form.get("condGroup").get(index.toString()).get("taxMonthEnd").patchValue(numMonth);
        if (Utils.isNull(this.condTextUsed.month[Number(index)])) {
          this.se01Form.get("condGroup").get(index.toString()).get("condDtlDesc").patchValue(this.condTextUsed.tax[Number(index)]);
        } else if (Utils.isNull(this.condTextUsed.tax[Number(index)])) {
          this.se01Form.get("condGroup").get(index.toString()).get("condDtlDesc").patchValue(this.condTextUsed.month[Number(index)]);
        } else {
          this.se01Form.get("condGroup").get(index.toString()).get("condDtlDesc").patchValue(this.condTextUsed.month[Number(index)] + " " + this.condTextUsed.tax[Number(index)]);
        }
      } else {
        this.condTextMonth(index);
      }
    } else if ("noTaxAuditYearNum" == name) {
      if (0 > Number(form.value)) {
        form.patchValue(0);
      }
    } else if ("taxMonth" == name) {
      if (numMonth < Number(form.value)) {
        form.patchValue(numMonth);
      } else if (0 > Number(form.value)) {
        form.patchValue(0);
      }
      this.condTextMonth(index);
    }
    this.buttonHide = true;
    this.callDropDown();
  }

  resetSe21Form() {
    this.se21Form.get("dutyCode").patchValue("");
    this.se21Form.get("hugeCapitalAmount").patchValue("");
    this.se21Form.get("largeCapitalAmount").patchValue("");
    this.se21Form.get("mediumCapitalAmount").patchValue("");
    this.se21Form.get("smallCapitalAmount").patchValue("");
  }

  // changeMoney(event, name: string) {

  //   if ("bigProduct" == name) {
  //     this.bigProduct = Utils.moneyFormat(this.bigProduct);
  //   } else if ("nomal1Product" == name) {
  //     this.nomal1Product = Utils.moneyFormat(this.bigProduct);
  //   } else if ("nomal2Product" == name) {
  //     this.nomal2Product = Utils.moneyFormat(this.bigProduct);
  //   } else if ("smallProduct" == name) {
  //     this.smallProduct = Utils.moneyFormat(this.bigProduct);
  //   }
  // }

  // onKeydown(value, name: string) {
  //   const reg = /\D/g
  //   if ("bigProduct" == name) {
  //     this.bigProduct = value.replace(reg, "");
  //     this.bigProduct = Utils.moneyFormat(this.bigProduct);
  //   } else if ("nomal1Product" == name) {
  //     this.nomal1Product = value.replace(reg, "");
  //     this.nomal1Product = Utils.moneyFormat(this.nomal1Product);
  //   } else if ("nomal2Product" == name) {
  //     this.nomal2Product = value.replace(reg, "");
  //     this.nomal2Product = Utils.moneyFormat(this.nomal2Product);
  //   } else if ("smallProduct" == name) {
  //     this.smallProduct = value.replace(reg, "");
  //     this.smallProduct = Utils.moneyFormat(this.smallProduct);
  //   }
  // }

  // getTaxFreqTypeLevel(){
  //   this.getTaxFreqTypeLevel
  //   this.ajax.doPost("TA_MAIN_COND_FREQ_TYPE/")
  //   taMainCondFreqType
  // }
}
