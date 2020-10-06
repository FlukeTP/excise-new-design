import { Component, OnInit, AfterViewInit } from '@angular/core';
import { BreadCrumb, ParameterInfo, ResponseData } from 'models/index';
import { TextDateTH, formatter } from 'helpers/datepicker';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AjaxService } from 'services/ajax.service';
import { MessageBarService } from 'services/message-bar.service';
import { Router } from '@angular/router';
import { MessageService } from 'services/message.service';
import { IA_CONSTANTS } from 'projects/internal-audit/constants/params-group.model';

const URL = {
  FIND_BY_INSPECTION_PLAN: "ia/int11/04/find/ins-plan",
  DROPDOWN: "preferences/parameter",
}

declare var $: any;
@Component({
  selector: 'app-int1104',
  templateUrl: './int1104.component.html',
  styleUrls: ['./int1104.component.css']
})
export class Int1104Component implements OnInit, AfterViewInit {
  dropdownRisk: any[] = [];
  tableMock: any = [];
  tableMock2: any = [];
  tableMock3: any = [];
  searchForm: FormGroup;
  submitted: any;
  table: boolean = false;
  table2: boolean = false;
  table3: boolean = false;

  dropdownInspection: ParameterInfo[] = [];
  dataFilter: any = [];

  breadcrumb: BreadCrumb[] = [
    { label: "ตรวจสอบภายใน", route: "#" },
    { label: "สรุปผลการตรวจและติดตาม", route: "#" },
    { label: "ติดตามผลการปฏิบัติตามข้อเสนอแนะ", route: "#" },
  ];
  constructor(
    private fb: FormBuilder,
    private ajax: AjaxService,
    private msg: MessageBarService,
    private router: Router
  ) { }

  ngOnInit() {
    this.dropdown();
    this.initVariable();
    this.table = true;
  }

  ngAfterViewInit(): void {
    this.calendar();
    $(".ui.dropdown").dropdown();
    $(".ui.dropdown.ai").css("width", "100%");
  }

  initVariable() {
    const budgetYear = MessageService.budgetYear();
    this.searchForm = this.fb.group({
      budgetYear: [budgetYear, Validators.required],
      riskType: ["3", Validators.required]
    });
  }

  //function check validator
  validateField(value: string) {
    return this.submitted && this.searchForm.get(value).errors;
  }

  closejob() {
    $('#detail').modal('show');
    $('#date1').calendar({
      type: 'date',
      text: TextDateTH,
      formatter: formatter('วดป')
    });
  }

  calendar() {
    $("#budgetyearCld").calendar({
      maxDate: new Date(),
      type: "year",
      text: TextDateTH,
      formatter: formatter("ป"),
      onChange: (date, text) => {
        this.search();
      }
    }).calendar("set date", '2561')
  }

  dropdown() {
    this.ajax.doPost(`${URL.DROPDOWN}/${IA_CONSTANTS.PARAMS_GROUP.IA_INSPECTION_WORK}`, { groupCode: IA_CONSTANTS.PARAMS_GROUP.IA_INSPECTION_WORK }).subscribe((response: ResponseData<ParameterInfo[]>) => {
      if (response.status === MessageService.MSG.SUCCESS) {
        this.dropdownInspection = response.data;
      } else {
        this.msg.errorModal(response.message);
      }
    });
  }

  search() {
    console.log(this.searchForm.get('riskType').value);
    if (this.searchForm.get('riskType').value == 3) {
      this.table = true
      this.table2 = false
      this.table3 = false
    } else if (this.searchForm.get('riskType').value == 4) {
      this.table = false
      this.table2 = true
      this.table3 = false
    } else if (this.searchForm.get('riskType').value == 5) {
      this.table = false
      this.table2 = false
      this.table3 = true
    }
    this.getData();
  }

  getData() {
    const { budgetYear, riskType } = this.searchForm.value;
    this.ajax.doGet(`${URL.FIND_BY_INSPECTION_PLAN}/${budgetYear}/${riskType}`).subscribe((response: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == response.status) {
        this.dataFilter = response.data;
      } else {
        this.msg.errorModal(response.message);
      }
    }, err => {
      this.msg.errorModal("กรุณาติดต่อผู้ดูแลระบบ");
    });
  }

  routeTo(id: number) {
    this.router.navigate(['/int11/04/01'], {
      queryParams: {
        idHdr: id
      }
    })
  }

}
