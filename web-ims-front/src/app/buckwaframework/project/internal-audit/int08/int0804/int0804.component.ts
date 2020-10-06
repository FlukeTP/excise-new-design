import { Component, OnInit, AfterViewInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { AjaxService, AuthService, MessageService } from '../../../../common/services';
import { MessageBarService } from 'app/buckwaframework/common/services';
import { BreadCrumb, ResponseData } from '../../../../common/models';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DepartmentDropdownService } from 'services/department-dropdown.service';
import { TextDateTH } from 'helpers/index';
import { formatter } from 'helpers/datepicker';

declare var $: any;

const URL = {
  GET_DEPACC_MAS_LIST: "ia/int08/04/get-depacc-mas-dropdown",
  SEARCH: "ia/int08/04/search",
}

@Component({
  selector: 'app-int0804',
  templateUrl: './int0804.component.html',
  styleUrls: ['./int0804.component.css']
})
export class Int0804Component implements OnInit {
  breadcrumb: BreadCrumb[] = [
    { label: "ตรวจสอบภายใน", route: "#" },
    { label: "ตรวจสอบบัญชี", route: "#" },
    { label: "ตรวจสอบการนำส่งเงินบัญชีเจ้าหนี้ อปท.", route: "#" }
  ];;

  formSearch: FormGroup = new FormGroup({});
  sectors: any[] = [];
  areas: any[] = [];
  // branch: any[] = [];
  submitted: boolean = false;
  depaccMasList: any[] = [];
  table: any[] = [];
  cols: any[] = [];
  loading: boolean = false;

  constructor(
    private ajax: AjaxService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private msg: MessageBarService,
    private router: Router,
    private department: DepartmentDropdownService
  ) {
  }

  ngOnInit() {
    this.initialVariable();
    this.department.getSector().subscribe(response => { this.sectors = response.data });  //get sector list
    this.getDepaccMasDropdown();  // depaccMas dropdown
  }

  ngAfterViewInit() {
    $(".ui.dropdown").dropdown();
    this.calendar();
  }

  getDepaccMasDropdown() {
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
  }

  search() {
    this.submitted = true;
    if (this.formSearch.invalid) {
      return this.msg.errorModal(MessageService.MSG.REQUIRE_FIELD);
    }

    this.loading = true;
    this.ajax.doPost(URL.SEARCH, this.formSearch.value).subscribe((response: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS === response.status) {
        this.table = response.data.dateList;
        this.cols = response.data.th;
      } else {
        this.msg.errorModal(response.message);
      }
      this.loading = false;
    }, err => {
      this.msg.errorModal(MessageService.MSG.FAILED_CALLBACK);
      this.loading = false;
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

  /* _________________ calendar _________________ */
  calendar() {
    $('#dateFromCld').calendar({
      endCalendar: $('#dateToCld'),
      type: "month",
      text: TextDateTH,
      formatter: formatter('month-year'),
      onChange: (date, text) => {
        this.formSearch.get('dateFrom').patchValue(text);
      }
    }).css("width", "100%");

    $('#dateToCld').calendar({
      startCalendar: $('#dateFromCld'),
      type: "month",
      text: TextDateTH,
      formatter: formatter('month-year'),
      onChange: (date, text) => {
        this.formSearch.get('dateTo').patchValue(text);
      }
    }).css("width", "100%");
  }

  initialVariable() {
    /* __________________ formSearch _____________________ */
    this.formSearch = this.fb.group({
      sector: ['', Validators.required],
      area: ['', Validators.required],
      dateFrom: ['', Validators.required],
      dateTo: ['', Validators.required],
      officeCode: [''],
      gfDepositCode: ['', Validators.required],

    });
  }

  /* _________________ validate field details _________________ */
  validateField(control) {
    return this.submitted && this.formSearch.get(control).invalid;
  }

}



