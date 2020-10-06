import { Component, OnInit, AfterViewInit } from '@angular/core';
import { BreadCrumb, ResponseData } from 'models/index';
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { Router, ActivatedRoute, } from '@angular/router';
import { Location } from '@angular/common';
import { TextDateTH, formatter } from 'helpers/index';
import { ExciseService, MessageService } from 'services/index';
import { MessageBarService } from "../../../common/services/message-bar.service";
import { AjaxService } from "../../../common/services/ajax.service";
import { Int01TableVo, Int01Vo, Int01HdrVo } from './int01.models';

const URL = {
  FILTER_INITIAL: "ia/int01/filter/budget-year",
  UPDATE_CHOICE: "ia/int01/update/choice"
}

declare var $: any;

@Component({
  selector: 'int01',
  templateUrl: './int01.component.html',
  styleUrls: ['./int01.component.css']
})
export class Int01Component implements OnInit, AfterViewInit {
  showData: boolean = false;
  data: String[];
  riskList: any[];
  datatable: any;
  isSearch: any = false;
  riskYear: any;
  wsRiskList: any[];
  showForm: any;
  dataTableF1: any;
  riskAssRiskWsHdr: any;
  condition: any;
  riskHrdId: any;
  dataTableF2: any;
  dataTableF3: any;
  active: any;
  riskType: any;
  buttonFullYear: any;
  pageMapping: any[] = [];
  riskDataList: RiskData[];
  riskAssRiskWsHdrList: any;
  columnList: any[];
  percentList: any[];
  breadcrumb: BreadCrumb[] = [
    { label: "ตรวจสอบภายใน", route: "#" },
    { label: "แผนการตรวจสอบภายใน", route: "#" },
  ];
  months: any[] = [10, 11, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  dataTables: any = [];
  dataTables2: any = [];
  planForm: FormGroup;
  changeDetail: FormGroup;

  budgetYear = new FormControl('');
  table: Int01TableVo[];
  // header: Int01HdrVo;
  header: FormGroup;
  planDayAct: FormGroup;
  loading: boolean = false;
  thTag: any = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private _location: Location,
    private exciseService: ExciseService,
    private msg: MessageBarService,
    private ajax: AjaxService,
    private route: ActivatedRoute
  ) {
    this.initialVariable();
    this.changeDetail = this.fb.group({
      id: [''],
      month: [''],
      dateFrom: [''],
      dateTo: [''],
      submitted: ['']
    })
    this.dataTables = [
      {
        id: 1,
        area: 'สำนักงานสรรพสามิตภาคที่ 1',
        details: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        statusMsg: 'กำลังดำเนินการ',
        status: 'N',
        dateFrom: '22/10/2561',
        dateTo: '22/10/2561'
      },
    ];
    this.dataTables2 = [
      {
        id: 1,
        area: 'สำนักงานสรรพสามิตภาคที่ 1',
        details: [0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0],
        statusMsg: 'กำลังดำเนินการ',
        status: 'N',
        dateFrom: '22/10/2561',
        dateTo: '22/10/2561'
      },
    ];

  }

  initialVariable() {
    this.planForm = this.fb.group({
      year: [{ value: "", disabled: false }, Validators.required]
    })

    /* header */
    this.header = this.fb.group({
      planHdrId: [''],
      approvers: [''],
      position: [''],
      status: [''],
      statusStr: [''],
      budgetYear: ['']
    })

    /* default budgetYear */
    const budgetYear = MessageService.budgetYear();
    this.header.get('budgetYear').patchValue(budgetYear);

    this.planDayAct = this.fb.group({
      planDayActivityId: [''],
      planHdrId: [''],
      planDtlId: [''],
      dateStartActivity: [''],
      dateEndActivity: [''],
      activity: [''],
      activityStatus: [''],
      activityShort: [''],
      colorCode: ['']
    })

  }

  ngOnInit() {
    this.initialData();
  }

  initialData = () => {
    this.ajax.doGet(`${URL.FILTER_INITIAL}/${this.header.get('budgetYear').value}`).subscribe((response: ResponseData<Int01Vo>) => {
      if (MessageService.MSG.SUCCESS == response.status) {
        // this.header = response.data.header;
        this.header.patchValue({
          planHdrId: response.data.header.planHdrId,
          approvers: response.data.header.approvers,
          position: response.data.header.position,
          status: response.data.header.status,
          statusStr: response.data.header.statusStr,
          budgetYear: response.data.header.budgetYear,
        })

        // if (response.data.tableVo[0].detail.length > 0) {
        //   this.thTag.push({ header10: response.data.tableVo[0].detail[0].monthVo.header10 });
        //   this.thTag.push({ header11: response.data.tableVo[0].detail[0].monthVo.header11 });
        //   this.thTag.push({ header12: response.data.tableVo[0].detail[0].monthVo.header12 });
        //   this.thTag.push({ header01: response.data.tableVo[0].detail[0].monthVo.header01 });
        //   this.thTag.push({ header02: response.data.tableVo[0].detail[0].monthVo.header02 });
        //   this.thTag.push({ header03: response.data.tableVo[0].detail[0].monthVo.header03 });
        //   this.thTag.push({ header04: response.data.tableVo[0].detail[0].monthVo.header04 });
        //   this.thTag.push({ header05: response.data.tableVo[0].detail[0].monthVo.header05 });
        //   this.thTag.push({ header06: response.data.tableVo[0].detail[0].monthVo.header06 });
        //   this.thTag.push({ header07: response.data.tableVo[0].detail[0].monthVo.header07 });
        //   this.thTag.push({ header08: response.data.tableVo[0].detail[0].monthVo.header08 });  
        //   this.thTag.push({ header09: response.data.tableVo[0].detail[0].monthVo.header09 });
        //   this.thTag.push({ header10Y: response.data.tableVo[0].detail[0].monthVo.header10Y });
        //   this.thTag.push({ header11Y: response.data.tableVo[0].detail[0].monthVo.header11Y });
        // }
        // console.log("thTag: ", this.thTag);
        this.table = response.data.tableVo;


      } else {
        // this.msg.errorModal(response.message);
      }
    }), error => {
      this.msg.errorModal("กรุณาติดต่อผู้ดูแลระบบ");
    };
  }

  ngAfterViewInit() {

    $('.dropdown').dropdown();
    $('#year').calendar({
      type: 'year',
      text: TextDateTH,
      formatter: formatter('ป'),
      onChange: (date, text) => {
        this.header.get('budgetYear').patchValue(text);
        console.log('1');
        this.initialData();
      }
    })
    // Initial
    $("#year").dropdown('set selected', 2561).css('min-width', '100%');
    $(".dropdown").dropdown();
    $(".ui.dropdown.ai").css("width", "100%");
    $('#riskType').dropdown('set selected', '1');

  }

  async toSubPage(path: any) {
    this.router.navigate(['/' + path]);
  }

  progressClass(progress: number) {
    if (progress <= 24 && progress >= 0) {
      return 'ui progress red';
    } else if (progress <= 50 && progress >= 25) {
      return 'ui active progress';
    } else if (progress <= 75 && progress >= 51) {
      return 'ui progress warning';
    } else if (progress <= 100 && progress >= 76) {
      return 'ui progress success';
    }
  }

  onClick() {
    this.router.navigate(['/cop-home/cop-home-m/cop-plan-level/cop-detail-send']);
  }

  goToAuditForm() {
    this.router.navigate(['/cop-home/cop-home-m/cop-plan-level/cop-audit-form']);
  }

  goBack() {
    this._location.back();
  }

  gopage(ids: number, months: number) {
    const data = Object.assign({}, this.exciseService.getData());
    this.exciseService.setData({ ...data, dataTables: this.dataTables, idSelect: ids, monthSelect: months });
    this.router.navigate(['/int01/int01-details-main']);
  }

  viewDetail(ids: number, months: number) {
    const { id, month, dateFrom, dateTo } = this.changeDetail.controls;
    const index = this.dataTables.findIndex(obj => obj.id == ids);
    if (this.dataTables[index].status == 'N') {
      id.patchValue(ids);
      month.patchValue(months);
      dateFrom.patchValue(this.dataTables[index].dateFrom);
      dateTo.patchValue(this.dataTables[index].dateTo);
      $('#detail').modal('show');
      setTimeout(() => {
        const from = dateFrom.value.split('/');
        const minDate = new Date();
        minDate.setFullYear(parseInt(from[2]));
        minDate.setMonth(this.months[months] - 1);
        minDate.setDate(1);
        $("#dateCalendarFrom").calendar({
          type: "date",
          initialDate: new Date(parseInt(from[2]), parseInt(from[1]) - 1, parseInt(from[0])),
          minDate: minDate,
          maxDate: new Date(minDate.getFullYear(), this.months[months], 0),
          endCalendar: $('#dateCalendarTo'),
          text: TextDateTH,
          formatter: formatter(),
          onChange: (date, text, mode) => {
            dateFrom.patchValue(text);
          }
        });
        const to = dateTo.value.split('/');
        $("#dateCalendarTo").calendar({
          type: "date",
          initialDate: new Date(parseInt(to[2]), parseInt(to[1]) - 1, parseInt(to[0])),
          minDate: minDate,
          maxDate: new Date(minDate.getFullYear(), this.months[months], 0),
          startCalendar: $('#dateCalendarFrom'),
          text: TextDateTH,
          formatter: formatter(),
          onChange: (date, text, mode) => {
            dateTo.patchValue(text);
          }
        });
      }, 200);
    }
  }

  viewResultSelect() {
    this.router.navigate(["/cop-home/cop-home-m/cop-plan-level/cop-result-button"]);
  }

  viewResultList() {
    this.router.navigate(["/cop-home/cop-home-m/cop-plan-level/cop-result-list"]);
  }

  saveDetail() {
    const { id, month, dateFrom, dateTo } = this.changeDetail.controls;
    const index = this.dataTables.findIndex(obj => obj.id == id.value);
    for (let i = 0; i < this.dataTables[index].details.length; i++) {
      if (i == month.value) {
        this.dataTables[index].dateFrom = dateFrom.value;
        this.dataTables[index].dateTo = dateTo.value;
        this.dataTables[index].details[month.value] = 1;
      } else {
        this.dataTables[index].details[i] = 0;
      }
    }
  }

  remove(index: number) {
    this.dataTables.splice(index, 1);
  }

  send(index: number) {
    const data = Object.assign({}, this.exciseService.getData());
    this.exciseService.setData({ ...data, dataTables: this.dataTables, index: index });
    this.onClick();
  }

  complete(index: number) {
    const data = Object.assign({}, this.exciseService.getData());
    this.exciseService.setData({ ...data, dataTables: this.dataTables, index: index });
    this.goToAuditForm();
  }

  chioce(e, flag: string) {
    this.loading = true;
    e.preventDefault();
    this.ajax.doPut(`${URL.UPDATE_CHOICE}/${this.header.get('planHdrId').value}/${flag}`, {}).subscribe((response: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == response.status) {
        console.log(response);
        this.initialData();
        setTimeout(() => {
          this.loading = false;
        }, 300);
      } else {
        this.msg.errorModal(response.message);
        this.loading = false;
      }
    }), error => {
      this.msg.errorModal("กรุณาติดต่อผู้ดูแลระบบ");
      this.loading = false;
    };
  }

  routeTo(parth: string, planDtlId: number) {
    this.router.navigate([parth], {
      queryParams: {
        planDtlId: planDtlId
      }
    })
  }

  getColor(color: string) {
    if (color == '#646464') {
      return 'act-nothing';
    } else if (color == '#3880df') {
      return 'act-current';
    } else if (color == '#5ef35e') {
      return 'act-finish';
    }
  }

}

class RiskData {
  projectBase: any = '';
  riskHrdId: any = 0;
  departmentName: any = '';
  riskCost: any = '';
  rl: any = '';
  valueTranslation: any = '';
  color: any = '';
  riskOtherDtlId: any = 0;
  isDeleted: any = '';
}