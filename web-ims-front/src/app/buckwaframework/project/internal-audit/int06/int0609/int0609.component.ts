import { Component, OnInit } from '@angular/core';
import { BreadCrumb } from 'models/breadcrumb.model';
import { TextDateTH, formatter } from 'helpers/datepicker';
import { AjaxService } from 'services/ajax.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageBarService, MessageService } from 'services/index';
import { DepartmentDropdownService } from 'services/department-dropdown.service';
import { ResponseData } from 'models/index';

const URL = {
  SEARCH: "ia/int06/09/search",
  SAVE: "ia/int06/09/save",
  GET_INC_SEND_NO: "ia/int06/09/get-dropdown/inc-send-no",
  FIND_BY_INC_SEND_NO: "ia/int06/09/find-by/inc-send-no",
}
declare var $: any;
@Component({
  selector: 'app-int0609',
  templateUrl: './int0609.component.html',
  styleUrls: ['./int0609.component.css']
})
export class Int0609Component implements OnInit {
  breadcrumb: BreadCrumb[] = [];

  /* departments */
  sectors: any[] = [];
  areas: any[] = [];
  branch: any[] = [];

  /* form */
  submitted: boolean = false;
  formSearch: FormGroup = new FormGroup({});
  formHeader: FormGroup = new FormGroup({});

  /* loading */
  loading: boolean = false;

  flagExport: boolean = false;
  table: any[] = [];
  footer: object = {};

  incSendNoList: any[] = [];

  test: string = "TEST TOOTIP";
  tbCssHight: number = 40;
  constructor(
    private ajax: AjaxService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private msg: MessageBarService,
    private router: Router,
    private department: DepartmentDropdownService
  ) { }

  ngOnInit() {
    this.initialVariable();
    this.department.getSector().subscribe(response => { this.sectors = response.data });  //get sector list
    this.getIncSendNo();
  }

  ngAfterViewInit() {
    $(".ui.dropdown").dropdown();
    this.calendar();
    $('.pane-hScroll').scroll(function () {
      $('.pane-vScroll').width($('.pane-hScroll').width() + $('.pane-hScroll').scrollLeft());
    });
  }


  dropdownChange(e, flagDropdown: string) {
    if ("0" !== e.target.value && "" !== e.target.value) {
      /* ____________ set office code ____________ */
      if (flagDropdown === 'SECTOR') {
        this.formSearch.get('officeCode').patchValue(this.formSearch.get('sector').value);

        /* ____________ clear dropdown ____________ */
        this.areas = [];
        this.branch = [];
        $("#area").dropdown('restore defaults');
        $("#branch").dropdown('restore defaults');

        /* ____________ set default value ____________ */
        this.formSearch.patchValue({ area: "0" });

        /* ____________ get area list ____________  */
        this.department.getArea(this.formSearch.get('officeCode').value).subscribe(response => { this.areas = response.data });
      } else if (flagDropdown === 'AREA') {
        this.formSearch.get('officeCode').patchValue(this.formSearch.get('area').value);

        /* ____________ set default value ____________ */
        this.formSearch.patchValue({ branch: "0" });

        /* ____________ get branch list ____________  */
        this.department.getBranch(this.formSearch.get('officeCode').value).subscribe(response => { this.branch = response.data });
      } else if (flagDropdown === 'BRANCH') {
        this.formSearch.get('officeCode').patchValue(this.formSearch.get('branch').value);
      }
    }
  }

  search() {
    this.submitted = true;
    if (this.formSearch.invalid) {
      return this.msg.errorModal(MessageService.MSG.REQUIRE_FIELD);
    }
    /* ________ loading ________ */
    this.loading = true;

    /* ________ clear data ________ */
    this.table = [];

    this.ajax.doPost(URL.SEARCH, this.formSearch.value).subscribe((response: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS === response.status) {
        this.table = response.data.table;
        this.footer = response.data.footer;
      } else {
        this.msg.errorModal(response.message);
      }
      this.loading = false;
    }, err => {
      this.msg.errorModal(MessageService.MSG.FAILED_CALLBACK);
      this.loading = false;
    }, () => {
      let period = this.formSearch.get('periodMonth').value.split("/");
      setTimeout(() => {
        for (let index = 0; index < this.table.length; index++) {
          /* ______ calendar ______ */
          $(`#incsendAccCashCld${index}`).calendar({
            type: "date",
            minDate: new Date(period[1], period[0] - 1, 1),
            text: TextDateTH,
            formatter: formatter()
          }).css("width", "100%");

          $(`#incsendAccPayInCld${index}`).calendar({
            type: "date",
            minDate: new Date(period[1], period[0] - 1, 1),
            text: TextDateTH,
            formatter: formatter()
          }).css("width", "100%");

          /* ______ tootip ______ */
          // str.indexOf(",") > -1
          if (this.table[index].tootip.length > 0) {
            $(`#tootip-custom${index}`).popup({
              // position: 'right center',
              // target   : '.test.image',
              // title: this.table[index].tootip,
              content: this.table[index].tootip
            });
          }
        }
      }, 200);

      // calculate hight table
      let tbHighth = this.table.length * 40;
      if (tbHighth > 400) {
        this.tbCssHight = 400
      } else {
        this.tbCssHight = tbHighth
      }
    });
  }

  onCheckboxChange(e, i: number, control: string) {
    if (e.target.checked) {
      switch (control) {
        case 'incsendIncStm':
          this.table[i].incsendIncStm = 'Y';
          break;
        case 'incTransfer115010_116010':
          this.table[i].incTransfer115010_116010 = 'Y';
          break;
        default:
          break;
      }
    } else {
      switch (control) {
        case 'incsendIncStm':
          this.table[i].incsendIncStm = 'N';
          break;
        case 'incTransfer115010_116010':
          this.table[i].incTransfer115010_116010 = 'N';
          break;
        default:
          break;
      }
    }
  }

  save(e) {
    e.preventDefault();
    /* ________ loading ________ */
    this.loading = true;
    let header = {
      incsendOfficeCode: this.formSearch.get('officeCode').value,
      incsendPeriodMonth: this.formSearch.get('periodMonth').value,
      auditFlag: this.formHeader.get('auditFlag').value,
      incsendConditionText: this.formHeader.get('incsendConditionText').value,
      incsendCreteriaText: this.formHeader.get('incsendCreteriaText').value
    }

    let details = [];
    for (let i = 0; i < this.table.length; i++) {
      let t = this.table[i];
      details.push({
        incsendTrnDateStr: t.trnDateStr,
        incsendGfDateStr: t.gfDateStr,
        incsendPeriod: t.dateDiff,
        incsendGfOffcode: t.offcode,
        incsendActcostCent: t.actcostCent,
        incsendRefNo: t.gfRefNo,
        incsendCnt: t.cnt,
        incsendTotalAmt: t.totalAmt,
        incsendAmount: t.sum1Sum2,
        incsendEdc: t.sum4Sum5,
        incsendEdcLicense: t.sum7,
        incsendAccCash: (<HTMLInputElement>document.getElementById('incsendAccCash' + i)).value,
        incsendAccPayIn: (<HTMLInputElement>document.getElementById('incsendAccPayIn' + i)).value,
        incsendAmtDelivery: t.totalSendAmt,
        incsendIncKtb: (<HTMLInputElement>document.getElementById('incsendIncKtb' + i)).value,
        incsendIncStm: t.incsendIncStm,
        incsendInc115010: t.sum4I,
        incsendInc116010: t.sum4II,
        incsendNote: (<HTMLInputElement>document.getElementById('note' + i)).value,
        incTransfer115010_116010: t.incTransfer115010_116010
      });
    }

    let incsendNo = "";
    this.ajax.doPost(URL.SAVE, { header: header, details: details }).subscribe((response: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS === response.status) {
        incsendNo = response.data;
        this.msg.successModal(response.message);
        this.getIncSendNo();
      } else {
        this.msg.errorModal(response.message);
      }
      this.loading = false;
    }, err => {
      this.msg.errorModal(MessageService.MSG.FAILED_CALLBACK);
      this.loading = false;
    }, () => {
      setTimeout(() => {
        $('#incsendNo').dropdown('set selected', incsendNo);
      }, 300);
    });
  }

  getIncSendNo() {
    this.ajax.doGet(URL.GET_INC_SEND_NO).subscribe((response: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS === response.status) {
        this.incSendNoList = response.data;
      } else {
        this.msg.errorModal(response.message);
      }
      this.loading = false;
    }, err => {
      this.msg.errorModal(MessageService.MSG.FAILED_CALLBACK);
      this.loading = false;
    });
  }

  incSendNoChange(e) {
    this.loading = true;
    this.ajax.doPost(URL.FIND_BY_INC_SEND_NO, e.target.value).subscribe((response: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS === response.status) {
        this.flagExport = true;

        this.table = response.data.table;
        this.footer = response.data.footer;

        /* ______ set header ______ */
        this.formSearch.get('sector').patchValue(response.data.exciseDepartmentVo.sector);
        this.formSearch.get('area').patchValue(response.data.exciseDepartmentVo.area);
        this.formSearch.get('branch').patchValue(response.data.exciseDepartmentVo.branch);
        this.formSearch.get('periodMonth').patchValue(response.data.header.incsendPeriodMonth.substring(4, 6).concat("/").concat(response.data.header.incsendPeriodMonth.substring(0, 4)));
        this.formHeader.get('auditFlag').patchValue(response.data.header.auditFlag);
        this.formHeader.get('incsendConditionText').patchValue(response.data.header.incsendConditionText);
        this.formHeader.get('incsendCreteriaText').patchValue(response.data.header.incsendCreteriaText);
      } else {
        this.msg.errorModal(response.message);
      }
      this.loading = false;
    }, err => {
      this.msg.errorModal(MessageService.MSG.FAILED_CALLBACK);
      this.loading = false;
    }, () => {
      setTimeout(() => {
        $(".ui.dropdown").dropdown();
      }, 100);
      // calculate hight table
      let tbHighth = this.table.length * 40;
      if (tbHighth > 400) {
        this.tbCssHight = 400
      } else {
        this.tbCssHight = tbHighth
      }
    }
    );
  }

  checkIndexGfDateMuti(index: number) {
    let dataFilter = this.table.map((arr, idx) => (this.table[index].gfDateStr === arr.gfDateStr) ? idx : '').filter(x => x);
    if (dataFilter.length >= 2) {
      return dataFilter[dataFilter.length - 1] == index;
    }
    return true;
  }

  doubleClick(index: number, totalSendAmt: any) {
    let sumTotalSendAmt = 0;
    let dataFilter = this.table.map((arr, idx) => (this.table[index].gfDateStr === arr.gfDateStr) ? idx : '').filter(x => x);
    if (dataFilter.length >= 2) {
      dataFilter.forEach(idx => { sumTotalSendAmt += this.table[idx].totalSendAmt });
      (<HTMLInputElement>document.getElementById('incsendIncKtb' + (dataFilter[dataFilter.length - 1]))).value = sumTotalSendAmt.toString();
    } else {
      (<HTMLInputElement>document.getElementById('incsendIncKtb' + index)).value = totalSendAmt;
    }
  }

  clearData() {
    this.flagExport = false;
    this.submitted = false;
    this.areas = [];
    this.branch = [];
    this.table = [];
    this.footer = {};
    $('#sector').dropdown('restore defaults');
    $('#area').dropdown('restore defaults');
    $('#branch').dropdown('restore defaults');
    this.initialVariable();
    setTimeout(() => {
      $(".ui.dropdown").dropdown();
      this.calendar();
    }, 100);
    this.tbCssHight = 40;
  }

  /* _________________ calendar _________________ */
  calendar() {
    $('#periodMonthCld').calendar({
      type: "month",
      text: TextDateTH,
      formatter: formatter('month-year'),
      onChange: (date, text) => {
        this.formSearch.get('periodMonth').patchValue(text);
      }
    }).css("width", "100%");
  }

  initialVariable() {
    /* __________________ formSearch _____________________ */
    this.formSearch = this.fb.group({
      sector: ['', Validators.required],
      area: ['', Validators.required],
      branch: [''],
      officeCode: [''],
      periodMonth: ['', [Validators.required]],
      incsendNo: [''],
    });
    this.formHeader = this.fb.group({
      auditFlag: [''],
      incsendConditionText: [''],
      incsendCreteriaText: [''],
    })
  }

  /* _________________ validate field details _________________ */
  validateField(control) {
    return this.submitted && this.formSearch.get(control).invalid;
  }

}
