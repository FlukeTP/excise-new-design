import { MessageBarModule } from 'components/index';
import { Component, OnInit, Input, Output, EventEmitter, SimpleChange } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BreadCrumb, ResponseData } from "models/index";
import { Router, ActivatedRoute } from '@angular/router';
import { TextDateTH, formatter } from 'helpers/datepicker';
import { MessageBarService } from 'services/message-bar.service';
import { AjaxService } from '../../../../common/services/ajax.service';
import { MessageService } from 'services/message.service';

declare var $: any;

@Component({
  selector: 'int0301',
  templateUrl: './int0301.component.html',
  styleUrls: ['./int0301.component.css']
})
export class Int0301Component implements OnInit {
  test: number = 100000000000.44
  factorsLevel: Number = 0;
  trHtml1: any[] = [];
  inspectionWorkList: any[] = [];
  listdynamic: any[] = [];
  lists: any[] = [];
  budgetYear: any;
  budgetYearStart: any;
  riskFactorsLevel: any;
  inspectionWork: any;
  inspectionWorkback: any;
  budgetYearback: any;
  dropdownRisk: any[] = [];
  searchForm: FormGroup;
  submitted: any;
  dataselect: any;
  dataselecteditstring: any;
  dataedit: any;
  dataselectlevel: any;
  datas: any[] = [];
  datahead: any;
  changeDetail: FormGroup;
  startdate: any;
  enddate: any;
  column: any[] = [];

  checkStatusScreen: String = "T";

  @Input() riskId: any;
  @Input() riskType: any;
  @Input() page: any;
  @Output() out: EventEmitter<number> = new EventEmitter<number>();
  @Output() has: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input() dateTo: string = "";
  @Output() dateToChange: EventEmitter<string> = new EventEmitter<string>();
  @Input() dateFrom: string = "";
  @Output() dateFromChange: EventEmitter<string> = new EventEmitter<string>();
  @Input() month: number = 1;

  breadcrumb: BreadCrumb[] = [
    { label: "ตรวจสอบภายใน", route: "#" },
    { label: "การประเมินความเสี่ยง ", route: "#" },
    { label: "กำหนดเงื่อนไขความเสี่ยงรวม", route: "#" }
  ];
  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    public router: Router,
    private messageBar: MessageBarService,
    private ajax: AjaxService,
  ) {
  }

  ngOnInit() {
    this.initVariable();
    this.inspectionWorkDropdown();
    this.inspectionWorkback = this.route.snapshot.queryParams["inspectionWork"];
    this.budgetYearback = this.route.snapshot.queryParams["budgetYear"];
    console.log("inspectionWorkback : ", this.inspectionWorkback);
    console.log("budgetYearback : ", this.budgetYearback);
  }

  ngAfterViewInit(): void {
    this.calendar();
    if (this.inspectionWorkback && this.budgetYearback) {
      $("#inspectionWork").dropdown('set selected', this.inspectionWorkback);
      var date = new Date(this.budgetYearback, 1, 1);
      $("#budgetYear1").calendar('set date', date);
    } else {
      var date = new Date();
      $("#budgetYear1").calendar('set date', date);
      $("#inspectionWork").dropdown('set selected', 3);
    }
    $(".ui.dropdown").dropdown();
    $(".ui.dropdown.ia").css("width", "100%");
    this.search();
    console.log(this.datas);

  }

  initVariable() {
    this.searchForm = this.fb.group({
      budgetYear: ["", Validators.required],
      riskType: ["", Validators.required]
    });
  }

  //function check validator
  validateField(value: string) {
    return this.submitted && this.searchForm.get(value).errors;
  }

  createBudgetYear() {
    var budgetYear = $('#budgetYear').val()
    var inspectionWork = $('#inspectionWork').val()
    this.router.navigate(['/int03/01/02'], {
      queryParams: {
        inspectionWork: inspectionWork,
        budgetYear: budgetYear
      }
    });
  }

  setBudgetYear1() {

    if ("T" == this.checkStatusScreen) {
      console.log("router => /int03/01/03");
      var budgetYear = $('#budgetYear').val()
      var inspectionWork = $('#inspectionWork').val()
      this.router.navigate(['/int03/01/03'], {
        queryParams: {
          inspectionWork: inspectionWork,
          budgetYear: budgetYear
        }
      });
    } else {
      console.log("กรุณากำหนดเกณฑ์ความเสี่ยง ให้ครบทุกปัจจัย");
      this.messageBar.errorModal("กรุณากำหนดเกณฑ์ความเสี่ยง ให้ครบทุกปัจจัย", "แจ้งเตือน");
      return false;
    }


  }

  calendar() {
    $("#budgetYear1").calendar({
      type: "year",
      initialDate: new Date(),
      text: TextDateTH,
      formatter: formatter("ป"),
      onChange: (date, text) => {
        this.changeSearch(text);
      }
    });
  }

  changeSearch(budgetYear: any) {
    if (budgetYear) {
      this.budgetYear = budgetYear
      this.inspectionWork = $('#inspectionWork').val()
      this.getDatalistdynamic();
    } else {
      this.inspectionWork = $('#inspectionWork').val()
      this.budgetYear = this.budgetYear
      this.getDatalistdynamic();
    }
  }


  search() {
    this.budgetYear = $('#budgetYear').val()
    this.inspectionWork = $('#inspectionWork').val()

  }

  inspectionWorkDropdown = () => {
    const URL = "api/preferences/parameter-info";
    // this.ajax.get(URL,res => {
    //   this.inspectionWorkList = res.json();
    //     console.log(this.inspectionWorkList);
    // });
    this.inspectionWorkList = [
      { paramInfoId: 3, paramGroupId: 10, paramCode: '3', value1: 'งานตรวจสอบโครงการยุทธศาสตร์ของกรมสรรพสามิต' },
      { paramInfoId: 4, paramGroupId: 10, paramCode: '4', value1: 'งานตรวจสอบระบบสารสนเทศฯ ของกรมสรรพสามิต' },
      { paramInfoId: 5, paramGroupId: 10, paramCode: '5', value1: 'งานตรวจสอบสำนักงานสรรพสามิตภาคพื้นที่' }]
  }

  saveRiskFactorsLevel() {
    this.messageBar.comfirm((res) => {
      if (res) {
        $('.ui.sidebar').sidebar({
          context: '.ui.grid.pushable'
        })
          .sidebar('setting', 'transition', 'push')
          .sidebar('setting', 'dimPage', false)
          .sidebar('hide');
        var budgetYear = $('#budgetYear').val()
        var riskFactorsLevel = $('#riskFactorsLevel').val()
        const URL = "ia/int03/01/saveRiskFactorsLevel";
        this.ajax.doPost(URL, {
          "budgetYear": budgetYear,
          "factorsLevel": riskFactorsLevel
        }).subscribe((res: ResponseData<any>) => {
          console.log(res);
          if (MessageService.MSG.SUCCESS == res.status) {
            this.messageBar.successModal(res.message)
          } else {
            this.messageBar.errorModal(res.message);
          }
        })
      }
    }, "ยืนยันการการบันทึกข้อมูล ")
  }

  viewdetail2() {
    $('#detail2').modal('show');
  }

  getDatalistdynamic = () => {
    var URL = "ia/int03/01/listdynamic";
    this.ajax.post(URL, {
      "budgetYear": this.budgetYear,
      "inspectionWork": this.inspectionWork
    }, res => {
      this.listdynamic = res.json();
      console.log("listdynamic : ", this.listdynamic);
      this.checkStatusScreen = 'T';
      this.listdynamic.forEach(element => {
        if (element.iaRiskFactors.statusScreen == '1') {
          this.checkStatusScreen = 'F';
        }
      });
      console.log("checkStatusScreen : ", this.checkStatusScreen);

      let factorsLevel = (this.listdynamic.length != 0) ? parseInt(this.listdynamic[0].iaRiskFactorsConfig.factorsLevel) : 0;
      this.factorsLevel = factorsLevel;
      console.log("factorsLevelTable : ", this.factorsLevel);
      if (this.factorsLevel == 3) {
        this.trHtml1 = [];
        this.trHtml1.push('ต่ำ');
        this.trHtml1.push('กลาง');
        this.trHtml1.push('สูง');
      } else if (this.factorsLevel == 5) {
        this.trHtml1 = [];
        this.trHtml1.push('ต่ำมาก');
        this.trHtml1.push('ต่ำ');
        this.trHtml1.push('กลาง');
        this.trHtml1.push('สูง');
        this.trHtml1.push('สูงมาก');
      }
    });
  }
}

