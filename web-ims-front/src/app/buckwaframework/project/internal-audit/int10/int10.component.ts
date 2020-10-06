import { Component, OnInit } from '@angular/core';
import { BreadCrumb, ResponseData, ParameterInfo } from 'models/index';
import { TextDateTH, formatter } from 'helpers/datepicker';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'services/message.service';
import { MessageBarService } from 'services/message-bar.service';
import { AjaxService } from 'services/ajax.service';
import { routerNgProbeToken } from '@angular/router/src/router_module';
import { Router } from '@angular/router';
import { IA_CONSTANTS } from '../constants/params-group.model';

declare var $: any;
const URL = {
  FIND_INSPECTION_PLAN: "ia/int10/find/ins-plan",
  DROPDOWN: "preferences/parameter",
}

@Component({
  selector: 'app-int10',
  templateUrl: './int10.component.html',
  styleUrls: ['./int10.component.css']
})
export class Int10Component implements OnInit {


  dropdownInspection: any[] = [];
  tableMock: any = [];
  tableMock2: any = [];
  tableMock3: any = [];
  searchForm: FormGroup;
  submitted: any;
  dataFilter: any = [];

  breadcrumb: BreadCrumb[] = [
    { label: "ตรวจสอบภายใน", route: "#" },
    { label: "สรุปผลการตรวจและติดตาม", route: "#" }
  ];
  constructor(
    private fb: FormBuilder,
    private msg: MessageBarService,
    private ajax: AjaxService,
    private router: Router
  ) { }

  ngOnInit() {
    this.table = true;
    this.initVariable();
    this.getData();
    this.dropdown();
  }

  ngAfterViewInit(): void {
    this.calendar();
    $(".ui.dropdown").dropdown();
    $(".ui.dropdown.ai").css("width", "100%");
    setTimeout(() => {
      $('#risk').dropdown('set selected', "3");
    }, 300);

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

  calendar() {
    $("#budgetyearCld").calendar({
      maxDate: new Date(),
      type: "year",
      text: TextDateTH,
      formatter: formatter("ป"),
      onChange: (date, text) => {
        this.searchForm.get('budgetYear').patchValue(text);
        this.search();
      }
    })
  }

  dropdown() {
    this.ajax.doPost(`${URL.DROPDOWN}/${IA_CONSTANTS.PARAMS_GROUP.IA_INSPECTION_WORK}`, { groupCode: IA_CONSTANTS.PARAMS_GROUP.IA_INSPECTION_WORK }).subscribe((response: ResponseData<ParameterInfo[]>) => {
      if (response.status === MessageService.MSG.SUCCESS) {
        this.dropdownInspection = response.data;
      }
      else {
        this.msg.errorModal(response.message);
      }
    });
  }
  table: boolean = false;
  table2: boolean = false;
  table3: boolean = false;

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
    this.ajax.doGet(`${URL.FIND_INSPECTION_PLAN}/${budgetYear}/${riskType}/STATUS`).subscribe((response: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == response.status) {
        this.dataFilter = response.data;
        console.log("response: ", this.dataFilter);
      } else {
        this.msg.errorModal(response.message);
      }
    }, err => {
      this.msg.errorModal("กรุณาติดต่อผู้ดูแลระบบ");
    });
  }

  routeTo(id: number) {
    this.router.navigate(['/int10/01'], {
      queryParams: {
        id: id
      }
    })
  }
}

