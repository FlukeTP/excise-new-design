import { Component, OnInit } from '@angular/core';
import { BreadCrumb } from 'models/breadcrumb.model';
import { AjaxService } from 'services/ajax.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageBarService } from 'services/message-bar.service';
import { DepartmentDropdownService } from 'services/department-dropdown.service';
import { MessageService } from 'services/message.service';
import { TextDateTH, formatter } from 'helpers/datepicker';
import { ResponseData } from 'models/response-data.model';
import { DecimalFormatPipe } from 'app/buckwaframework/common/pipes/decimal-format.pipe';


const URL = {
  GET_DEPACC_MAS_LIST: "ia/int08/04/get-depacc-mas-dropdown",
  GET_COA_LIST: "ia/int08/03/get-coa-dropdown",
  SEARCH: "ia/int08/03/search",
}
declare var $: any;
@Component({
  selector: 'app-int0803',
  templateUrl: './int0803.component.html',
  styleUrls: ['./int0803.component.css']
})
export class Int0803Component implements OnInit {
  breadcrumb: BreadCrumb[] = [];
  sectors: any[] = [];
  areas: any[] = [];
  // branch: any[] = [];
  submitted: boolean = false;
  depaccMasList: any[] = [];
  coaList: any[] = [];
  formSearch: FormGroup = new FormGroup({});
  fomrHeader: FormGroup = new FormGroup({});
  loading: boolean = false;
  experimentalBudgetList: any[] = [];
  depositsReportList: any[] = [];
  sumExperimentalBudget: any[] = [];
  sumDepositsReport: any[] = [];
  difference: any[] = [];

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
    this.getDropdown();
  }

  ngAfterViewInit() {
    $(".ui.dropdown").dropdown();
    this.calendar();
  }

  getDropdown() {
    this.ajax.doGet(URL.GET_DEPACC_MAS_LIST).subscribe((response: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS === response.status) {
        this.depaccMasList = response.data;
        this.formSearch.get('gfDepositCode').patchValue("10778");
      } else {
        this.msg.errorModal(response.message);
      }
    }, err => {
      this.msg.errorModal(MessageService.MSG.FAILED_CALLBACK);
    });

    this.ajax.doGet(URL.GET_COA_LIST).subscribe((response: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS === response.status) {
        this.coaList = response.data;
        this.formSearch.get('coaCode').patchValue("2101020101");
      } else {
        this.msg.errorModal(response.message);
      }
    }, err => {
      this.msg.errorModal(MessageService.MSG.FAILED_CALLBACK);
    });
  }

  dropdownChange(e, flagDropdown: string) {
    if ("0" !== e.target.value && "" !== e.target.value) {
      /* ____________ set office code ____________ */
      if (flagDropdown === 'SECTOR') {
        this.formSearch.get('officeCode').patchValue(this.formSearch.get('sector').value);

        /* ____________ clear dropdown ____________ */
        this.areas = [];
        // this.branch = [];
        $("#area").dropdown('restore defaults');
        // $("#branch").dropdown('restore defaults');

        /* ____________ set default value ____________ */
        this.formSearch.patchValue({ area: "0" });

        /* ____________ get area list ____________  */
        this.department.getArea(this.formSearch.get('officeCode').value).subscribe(response => { this.areas = response.data });
      } else if (flagDropdown === 'AREA') {
        this.formSearch.get('officeCode').patchValue(this.formSearch.get('area').value);

        /* ____________ get branch list ____________  */
        // this.department.getBranch(this.formSearch.get('officeCode').value).subscribe(response => { this.branch = response.data });
      }
    }
  }

  search() {
    this.submitted = true;
    // if (Number(this.formSearch.get('periodFrom').value) > Number(this.formSearch.get('periodTo').value)) {
    //   this.formSearch.get('periodTo').setValidators([Validators.min(Number(this.formSearch.get('periodFrom').value))]);
    //   return this.msg.errorModal(MessageService.MSG.REQUIRE_FIELD);
    // }
    if (this.formSearch.invalid) {
      return this.msg.errorModal(MessageService.MSG.REQUIRE_FIELD);
    }

    this.loading = true;
    this.ajax.doPost(URL.SEARCH, this.formSearch.value).subscribe((response: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS === response.status) {
        this.experimentalBudgetList = response.data.experimentalBudgetList;
        this.depositsReportList = response.data.depositsReportList;
        this.sumExperimentalBudget = response.data.sumExperimentalBudget;
        this.sumDepositsReport = response.data.sumDepositsReport;
        this.difference = response.data.difference;

        /* set fomrHeader */
        this.fomrHeader.get('sumCarryForward1').patchValue(new DecimalFormatPipe().transform(response.data.sumExperimentalBudget[0].sumCarryForward));
        this.fomrHeader.get('sumCarryForward2').patchValue(new DecimalFormatPipe().transform(response.data.sumDepositsReport[0].sumCarryForward));
        this.fomrHeader.get('difference').patchValue(new DecimalFormatPipe().transform(response.data.difference[0].diffCarryForward));
      } else {
        this.msg.errorModal(response.message);
      }
      this.loading = false;
    }, err => {
      this.msg.errorModal(MessageService.MSG.FAILED_CALLBACK);
      this.loading = false;
    });
  }

  /* _________________ calendar _________________ */
  calendar() {
    $('#fromYearCld').calendar({
      type: "year",
      text: TextDateTH,
      formatter: formatter('year'),
      onChange: (date, text) => {
        this.formSearch.get('fromYear').patchValue(text);

        $('#toYearCld').calendar({
          minDate: new Date(this.formSearch.get('fromYear').value),
          type: "year",
          text: TextDateTH,
          formatter: formatter('year'),
          onChange: (date, text) => {
            this.formSearch.get('toYear').patchValue(text);
          }
        }).css("width", "100%");
      }
    }).css("width", "100%");

    $('#toYearCld').calendar({
      minDate: new Date(this.formSearch.get('fromYear').value),
      type: "year",
      text: TextDateTH,
      formatter: formatter('year'),
      onChange: (date, text) => {
        this.formSearch.get('toYear').patchValue(text);
      }
    }).css("width", "100%");
  }

  setMinValidator(e) {
    this.formSearch.get('periodTo').setValidators([Validators.min(Number(e.target.value))]);
  }

  initialVariable() {
    /* __________________ formSearch _____________________ */
    this.formSearch = this.fb.group({
      sector: ['', Validators.required],
      area: ['', Validators.required],
      officeCode: [''],
      gfDepositCode: ['', Validators.required],
      coaCode: ['', Validators.required],
      coaName: [''],
      periodFrom: ['', [Validators.required, Validators.minLength(3)]],
      periodTo: ['', [Validators.required, Validators.minLength(3)]],
      fromYear: [MessageService.budgetYear()],
      toYear: [MessageService.budgetYear()]
    });

    /* __________________ formHeader _____________________ */
    this.fomrHeader = this.fb.group({
      sumCarryForward1: [''],
      sumCarryForward2: [''],
      difference: [''],
    });
  }

  /* _________________ validate field details _________________ */
  validateField(control) {
    return this.submitted && this.formSearch.get(control).invalid;
  }

}
