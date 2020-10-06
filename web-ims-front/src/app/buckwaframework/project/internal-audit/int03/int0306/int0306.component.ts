import { MessageBarModule } from 'components/index';
import { Component, OnInit, Input, Output, EventEmitter, SimpleChange } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BreadCrumb, ResponseData } from "models/index";
import { Router, ActivatedRoute } from '@angular/router';
import { TextDateTH, formatter } from 'helpers/datepicker';
import { MessageBarService } from 'services/message-bar.service';
import { MessageService } from 'services/message.service';
import { AjaxService } from 'services/ajax.service';
import { IaQuestionnaireHdr } from 'projects/internal-audit/int02/int02.models';
import { Int020101Vo, Int020101NameVo, Int020101YearVo } from 'projects/internal-audit/int02/int0201/int020101/int020101vo.model';

declare var $: any;
const ULRS = {
  GET_WEB_SERVICE: "preferences/parameter"
}
const URL = {
  QTN_HDR: "ia/int02",
  QTN_YEAR: "ia/int02/01/01/by/status",
  QTN_NAME: "ia/int02/01/01/by/year",
  QTN_COND_RANGE: "preferences/parameter/IA_COND_RANGE"
}

@Component({
  selector: 'int0306',
  templateUrl: './int0306.component.html',
  styleUrls: ['./int0306.component.css']
})
export class Int0306Component implements OnInit {
  test: number = 100000000000.44
  factorsLevel: Number = 0;
  trHtml1: any[] = [];
  inspectionWorkList: any[] = [];
  listdynamic: any[] = [];
  lists: any[] = [];
  budgetYear: any;
  budgetYearStart: any;
  names: Int020101NameVo[] = [];
  isEdit: boolean = false
  qtnYear: string = "2561";
  qtnName: number = null;
  years: Int020101YearVo[] = [];
  dataEvaluate: boolean = true;
  factorId: any
  riskFactorsLevel: any;
  inspectionWork: any = 3;
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
  qtnEdit: boolean = false;
  riskFactorsLevelBefore: any;
  riskFactorsLevelList: any[] = [];
  conditionRange: any;
  conditionNon: any;
  webServiceData: any
  startDate: any;
  endDate: any;
  riskUnitList: any
  checkStatusScreen: String = "T";
  dataForm: FormGroup
  inspectionWorkTab: number = 3;

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
    { label: "กำหนดปัจจัยเสี่ยงประจำปีงบประมาณ", route: "#" }
  ];
  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    public router: Router,
    private messageBar: MessageBarService,
    private formBuilder: FormBuilder,
    private ajax: AjaxService,
  ) {
    this.dataForm = this.formBuilder.group({
      infoUsedRiskDesc: ["", Validators.required],
      riskIndicators: ["", Validators.required],
      riskFactorsMaster: [""],
      dateFrom: [""],
      dateTo: [""],
      side: [""],
      iaRiskFactorsDataList: [null],
      dataEvaluate: [],
      riskUnit: ["", Validators.required],
      inspectionWork: [""],
      budgetYear: [""],
      idFactors: [""]
    });
  }

  ngOnInit() {
    this.inspectionWorkDropdown();
    this.getDropdownRange();
    this.riskUnitDropDown()
    this.initVariable();
    this.riskFactorsLevelDropdown()
    this.inspectionWorkback = this.route.snapshot.queryParams["inspectionWork"];
    this.budgetYearback = this.route.snapshot.queryParams["budgetYear"];
    this.getWebService()
  }

  ngAfterViewInit(): void {
    this.loadYear();
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
    $(".ui.dropdown.rfl").css("min-width", "60px");
    this.search();
    this.calendar2();
  }

  getWebService = () => {
    this.ajax.doPost(`${ULRS.GET_WEB_SERVICE}/IA_RISK_WEBSERVICE`, {}).subscribe((result: any) => {
      this.webServiceData = result.data
      console.log("getWebService", result);
    })
  }

  getDropdownRange() {
    this.ajax.doPost(URL.QTN_COND_RANGE, {}).subscribe((result: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == result.status) {
        this.conditionRange = result.data;
        this.conditionNon = this.conditionRange.filter(function (value) {
          return value.value2 != 'N'
        })
        console.log("conditionRange :", this.conditionRange);
      } else {
        this.messageBar.errorModal(result.message);
      }
    });
  }

  riskUnitDropDown = () => {
    this.riskUnitList = [
      { value: 'หน่วย', data: 'หน่วย' },
      { value: 'ครั้ง', data: 'ครั้ง' },
      { value: 'ปี', data: 'ปี' },
      { value: 'เปอร์เซ็นต์', data: 'เปอร์เซ็นต์' },
      { value: 'บาท', data: 'บาท' },
      { value: 'คดี', data: 'คดี' },
      { value: 'ตำแหน่ง', data: 'ตำแหน่ง' },
    ]
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
    var inspectionWork = this.inspectionWork
    this.router.navigate(['/int03/01/02'], {
      queryParams: {
        inspectionWork: inspectionWork,
        budgetYear: budgetYear
      }
    });
  }

  riskFactorsLevelDropdown = () => {
    if ($("#riskFactorsLevelBefore").val() == 3) {
      this.riskFactorsLevelList = [
        { paramInfoId: 0, paramGroupId: 0, paramCode: '', value1: '3' },
        { paramInfoId: 0, paramGroupId: 0, paramCode: '', value1: '5' }]
    } else {
      this.riskFactorsLevelList = [
        { paramInfoId: 0, paramGroupId: 0, paramCode: '', value1: '5' },
        { paramInfoId: 0, paramGroupId: 0, paramCode: '', value1: '3' }]
    }

  }

  defineRiskFactors(data) {
    console.log("DefineRiskFactors data : ", data);
  }

  addRiskFactors() {
    console.log("router => /int03/05");
    var budgetYear = $('#budgetYear').val()
    var inspectionWork = this.inspectionWork
    this.router.navigate(['/int03/05'], {
      queryParams: {
        inspectionWork: inspectionWork,
        budgetYear: budgetYear
      }
    });
  }

  calendar2() {
    let dateFrom = new Date();
    let dateTo = new Date();
    if (this.dateTo && this.dateFrom && this.month) {
      const dF = this.dateFrom.split('/');
      const dT = this.dateTo.split('/');
      dateFrom = new Date(parseInt(dF[2]), parseInt(dF[1]), parseInt(dF[0]));
      dateTo = new Date(parseInt(dT[2]), parseInt(dT[1]), parseInt(dT[0]));
    }
    $("#dateCalendarFrom").calendar({
      type: "date",
      endCalendar: $('#dateCalendarTo'),
      text: TextDateTH,
      initialDate: dateFrom,
      formatter: formatter(),
      onChange: (date, text, mode) => {
        this.dateFromChange.emit(text);
      }
    });
    $("#dateCalendarTo").calendar({
      type: "date",
      startCalendar: $('#dateCalendarFrom'),
      text: TextDateTH,
      initialDate: dateTo,
      formatter: formatter(),
      onChange: (date, text, mode) => {
        this.dateToChange.emit(text);
      }
    });
  }

  setBudgetYear1() {

    if ("T" == this.checkStatusScreen) {
      console.log("router => /int03/01/03");
      var budgetYear = $('#budgetYear').val()
      var inspectionWork = this.inspectionWork
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

  inspectionWorkClick(paramInfoId: any) {
    this.inspectionWorkTab = paramInfoId;
    this.inspectionWork = paramInfoId;
    this.changeSearch(false);
  }

  changeSearch(budgetYear: any) {
    if (budgetYear) {
      this.budgetYear = budgetYear;
      this.getDatalistdynamic();
    } else {
      this.getDatalistdynamic();
    }
  }


  search() {
    this.budgetYear = $('#budgetYear').val()
    this.inspectionWork = this.inspectionWorkList[0].paramInfoId;
  }

  inspectionWorkDropdown = () => {
    const URL = "api/preferences/parameter-info";
    // this.ajax.get(URL,res => {
    //   this.inspectionWorkList = res.json();
    //     console.log(this.inspectionWorkList);
    // });
    this.inspectionWorkList = [
      { paramInfoId: 3, paramGroupId: 10, paramCode: '3', value1: 'งานตรวจสอบโครงการยุทธศาสตร์ของกรมสรรพสามิต', iconName: 'clipboard' },
      { paramInfoId: 4, paramGroupId: 10, paramCode: '4', value1: 'งานตรวจสอบระบบสารสนเทศฯ ของกรมสรรพสามิต', iconName: 'laptop' },
      { paramInfoId: 5, paramGroupId: 10, paramCode: '5', value1: 'งานตรวจสอบสำนักงานสรรพสามิตภาคพื้นที่', iconName: 'globe' }]
  }

  delete(data) {
    console.log("delete(data) : ", data);

    if (data.iaRiskFactors.statusScreen == 3) {
      return
    }
    this.messageBar.comfirm(confirm => {
      if (confirm) {
        const URL = "ia/int03/06/delete"
        this.ajax.post(URL, {
          "id": data.iaRiskFactors.idMaster,
          "status": "Y",
          "inspectionWork": this.inspectionWork,
          "budgetYear": this.budgetYear
        }, res => {
          res = res.json()
          if (MessageService.MSG.SUCCESS == res.status) {
            this.getDatalistdynamic();
          } else {
            this.messageBar.errorModal(res.message);
          }
        });
      }
    }, "ยืนยันการลบข้อมูล")
  }

  editDataRiskFactors(data) {
    $('#detail').modal('hide')
    this.router.navigate(['/int03/07'], {
      queryParams: {
        inspectionWork: this.inspectionWork,
        budgetYear: this.budgetYear,
        factorId: data.iaRiskFactors.id,
        dataEvaluate: data.iaRiskFactors.dataEvaluate
      }
    })
  }

  saveRiskFactorsLevel = () => {
    this.messageBar.comfirm(confirm => {
      if (confirm) {
        var year = $('#budgetYear').val()
        var budgetYear = $('#budgetYear').val()
        var riskFactorsLevel = $('#riskFactorsLevel').val()
        const URL = "ia/int03/01/02/saveRiskFactorsLevel";
        this.ajax.doPost(URL, {
          "inspectionWork": this.inspectionWork,
          "budgetYearTo": year,
          "budgetYear": budgetYear,
          "factorsLevel": riskFactorsLevel
        }).subscribe((res: ResponseData<any>) => {
          console.log(res);
          if (MessageService.MSG.SUCCESS == res.status) {
            this.messageBar.successModal(res.message)
            this.getDatalistdynamic();
            this.riskFactorsLevelDropdown();
            $("#riskFactorsLevel").dropdown('set selected', riskFactorsLevel);
          } else {
            this.messageBar.errorModal(res.message);
          }
        })
      } else {
        $("#riskFactorsLevel").dropdown('set selected', $("#riskFactorsLevelBefore").val());
      }
    }, "ยืนยันการบันทึกข้อมูลกำหนดระดับเกณฑ์ความเสี่ยง");
  }

  viewdetail2() {
    $('#detail2').modal('show');
  }

  changeCondution(i) {
    console.log("iiiii : ", i);
    var datamurt = "conditionTo" + i;
    switch (this.datas[i].condition) {
      case "<=":
        $('#valueone' + i).prop("disabled", false);
        $('#valuetwo' + i).prop("disabled", false);
        // $('#conditionTo' + i).dropdown('set selected', ">=");
        $(`.${datamurt}`).removeClass("disabled");
        $('#valuetwo' + i).on('change', (e) => {
          $('#valuetwo' + i).attr({
            min: $('#valueone' + i).val() | 0
          });
          $('#valueone' + i).attr({
            max: e.target.value
          });
        });
        $('#valueone' + i).on('change', (e) => {
          $('#valuetwo' + i).attr({
            min: e.target.value | 0
          });
          $('#valueone' + i).attr({
            max: $('#valuetwo' + i).val()
          });
        });
        break;
      case ">=":
        $('#valueone' + i).prop("disabled", false);
        $('#valuetwo' + i).prop("disabled", false);
        // $('#conditionTo' + i).dropdown('set selected', "<=");
        $(`.${datamurt}`).removeClass("disabled");
        $('#valuetwo' + i).on('change', (e) => {
          $('#valuetwo' + i).attr({
            min: $('#valueone' + i).val() | 0
          });
          $('#valueone' + i).attr({
            max: e.target.value
          });
        });
        $('#valueone' + i).on('change', (e) => {
          $('#valuetwo' + i).attr({
            min: e.target.value | 0
          });
          $('#valueone' + i).attr({
            max: $('#valuetwo' + i).val()
          });
        });
        break;
      case ">":
        $('#valueone' + i).prop("disabled", false);
        $('#valuetwo' + i).prop("disabled", true);
        // $(`.${datamurt}`).addClass("disabled");
        // $('#conditionTo' + i).dropdown('set selected', "N");
        break;
      case "<":
        $('#valueone' + i).prop("disabled", false);
        $('#valuetwo' + i).prop("disabled", true);
        // $(`.${datamurt}`).addClass("disabled");
        // $('#conditionTo' + i).dropdown('set selected', "N");
        break;
      case "=":
        $('#valueone' + i).prop("disabled", false);
        $('#valuetwo' + i).prop("disabled", true);
        $(`.${datamurt}`).addClass("disabled");
        $('#conditionTo' + i).dropdown('set selected', "N");
        break;
    }
  }

  changeCondutionTo(i) {
    var datamurt = "conditionTo" + i;
    switch (this.datas[i].conditionTo) {
      case "N":
        $('#valuetwo' + i).prop("disabled", true);
        break;
        case ">":
        $('#valuetwo' + i).prop("disabled", false);
        break;
        case "<":
        $('#valuetwo' + i).prop("disabled", false);
        break;
        case ">=":
        $('#valuetwo' + i).prop("disabled", false);
        break;
        case "<=":
        $('#valuetwo' + i).prop("disabled", false);
        break;
    }
  }

  cancel() {
    this.out.emit(this.riskId);
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
      if (factorsLevel == 0) {
        factorsLevel = 3
      }
      this.factorsLevel = factorsLevel;
      this.riskFactorsLevel = factorsLevel;
      $("#riskFactorsLevelBefore").val(this.riskFactorsLevel);
      this.riskFactorsLevelDropdown()
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
      console.log("trHtml1 => ", this.trHtml1);
    });
  }
  
  loadYear() {
    this.ajax.doGet(`${URL.QTN_YEAR}`).subscribe((result: ResponseData<Int020101YearVo[]>) => {
      if (MessageService.MSG.SUCCESS == result.status) {
        // GET DATA HERE
        this.years = result.data;
      } else {
        this.messageBar.errorModal(result.message);
      }
    });
  }

  idHdr :any
  getQuestionnaireHdr(idHdr: number) {
    // this.idHdr = idHdr
    this.ajax.doGet(`${URL.QTN_HDR}/${idHdr}`).subscribe((result: ResponseData<IaQuestionnaireHdr>) => {
      if (MessageService.MSG.SUCCESS == result.status) {
        this.qtnYear = result.data.budgetYear;
        this.selectYear();
        this.qtnName = idHdr;
      } else {
        this.messageBar.errorModal(result.message);
      }
    });
  }

  selectYear() {
    setTimeout(() => {
      if(this.qtnYear){
        $('.ui.fluid.dropdown.ai').dropdown().css('width', '100%');
        this.ajax.doGet(`${URL.QTN_NAME}/${this.qtnYear}/${this.idHdr}/status`).subscribe((result: ResponseData<Int020101NameVo[]>) => {
          if (MessageService.MSG.SUCCESS == result.status) {
            // GET DATA HERE
            if (AjaxService.isDebug) {
              console.log("QTN_NAME => ", result);
            }
            this.names = result.data;
          } else {
            this.messageBar.errorModal(result.message);
          }
        });
      }
    }, 200);
  }

  changeQtnEdit(data) {
    $('[name=qtnYear]').dropdown('clear')
    $('[name=qtnName]').dropdown('clear')
    if (data == "questionnaire") {
      this.loadYear();
      this.qtnEdit = true;
    } else {
      this.qtnEdit = false
    }
    setTimeout(() => {
      $(".ui.fluid.dropdown.ai").dropdown().css("width", "100%");

    }, 200);
  }


  saveCondition(e) {
    console.log("Data saveCondition : ", this.dataselect);
    this.onSave()
    e.preventDefault();
    this.startDate = $('#startDate').val();
    this.endDate = $('#endDate').val();
    let idConfig = this.dataselect.iaRiskFactorsConfig.id;
    var message = "";
    var i = 1;
    this.datas.forEach(element => {
      i++;
      element.parentId = this.riskId;
    });
    if (i - 1 == this.datas.length) {
      var url = "ia/int03/01/saveRiskFactorsConfig";
      let data = [];
      this.datas.forEach(element => {
        element.parentId = this.riskId;
        element.riskType = this.riskType;
        element.page = this.page;
        element.dateCalendarTo = element.dateCalendarTo == '' ? null : element.dateCalendarTo;
        element.budgetYearend = element.budgetYearend == '' ? null : element.budgetYearend;
        element.conditionId = element.conditionId == '' ? null : element.conditionId;
        element.condition = element.condition == '' ? null : element.condition;
        element.valueone = element.valueone == '' ? null : element.valueone;
        element.valuetwo = element.valuetwo == '' ? null : element.valuetwo;
        element.valueRl = element.valueRl == '' ? null : element.valueRl;
        element.color = element.color == '' ? null : element.color;
        data.push(element);
      });
      if (this.factorsLevel == 3) {
        console.log("testfact : ", this.factorsLevel);
        this.ajax.doPost(url, {
          startDate: this.startDate,
          endDate: this.endDate,
          iaRiskFactorsConfig: {
            id: idConfig,
            idFactors: this.dataselect.iaRiskFactorsConfig.idFactors,
            infoUsedRisk: this.qtnName,
            infoUsedRiskDesc: this.dataselect.iaRiskFactorsConfig.infoUsedRiskDesc,
            low: data[0].convertValue,
            lowStart: this.checknull($("#valueone0").val()),
            lowEnd: this.checknull($("#valuetwo0").val()),
            lowRating: $("#valueRl0").val(),
            lowColor: data[0].color,
            lowCondition: $("#condition0").val() + "|" + $("#conditionTo0").val(),
            medium: data[1].convertValue,
            mediumStart: this.checknull($("#valueone1").val()),
            mediumEnd: this.checknull($("#valuetwo1").val()),
            mediumRating: $("#valueRl1").val(),
            mediumColor: data[1].color,
            mediumCondition: $("#condition1").val() + "|" + $("#conditionTo1").val(),
            high: data[2].convertValue,
            highStart: this.checknull($("#valueone2").val()),
            highEnd: this.checknull($("#valuetwo2").val()),
            highRating: $("#valueRl2").val(),
            highColor: data[2].color,
            highCondition: $("#condition2").val() + "|" + $("#conditionTo2").val()
          }
        }).subscribe((res: ResponseData<any>) => {
          if (MessageService.MSG.SUCCESS == res.status) {
            this.messageBar.successModal(res.message)
            this.has.emit(true);
            this.out.emit(this.riskId);
            this.getDatalistdynamic()
          } else {
            this.messageBar.errorModal(res.message);
          }
        });
      }
      else if (this.factorsLevel == 5) {
        this.ajax.doPost(url, {
          startDate: this.startDate,
          endDate: this.endDate,
          iaRiskFactorsConfig: {
            id: idConfig,
            idFactors: this.dataselect.iaRiskFactorsConfig.idFactors,
            infoUsedRisk: this.qtnName,
            infoUsedRiskDesc: this.dataselect.iaRiskFactorsConfig.infoUsedRiskDesc,
            verylow: data[0].convertValue,
            verylowStart: this.checknull($("#valueone0").val()),
            verylowEnd: this.checknull($("#valuetwo0").val()),
            verylowRating: $("#valueRl0").val(),
            verylowColor: data[0].color,
            verylowCondition: $("#condition0").val() + "|" + $("#conditionTo0").val(),
            low: data[1].convertValue,
            lowStart: this.checknull($("#valueone1").val()),
            lowEnd: this.checknull($("#valuetwo1").val()),
            lowRating: $("#valueRl1").val(),
            lowColor: data[1].color,
            lowCondition: $("#condition1").val() + "|" + $("#conditionTo1").val(),
            medium: data[2].convertValue,
            mediumStart: this.checknull($("#valueone2").val()),
            mediumEnd: this.checknull($("#valuetwo2").val()),
            mediumRating: $("#valueRl2").val(),
            mediumColor: data[2].color,
            mediumCondition: $("#condition2").val() + "|" + $("#conditionTo2").val(),
            high: data[3].convertValue,
            highStart: this.checknull($("#valueone3").val()),
            highEnd: this.checknull($("#valuetwo3").val()),
            highRating: $("#valueRl3").val(),
            highColor: data[3].color,
            highCondition: $("#condition3").val() + "|" + $("#conditionTo3").val(),
            veryhigh: data[4].convertValue,
            veryhighStart: this.checknull($("#valueone4").val()),
            veryhighEnd: this.checknull($("#valuetwo4").val()),
            veryhighRating: $("#valueRl4").val(),
            veryhighColor: data[4].color,
            veryhighCondition: $("#condition4").val() + "|" + $("#conditionTo4").val()
          }
        }).subscribe((res: ResponseData<any>) => {
          if (MessageService.MSG.SUCCESS == res.status) {
            this.messageBar.successModal(res.message)
            this.has.emit(true);
            this.out.emit(this.riskId);
            this.getDatalistdynamic()
          } else {
            this.messageBar.errorModal(res.message);
          }
        });
      }
    }
  }

  checknull(data) {
    var rel = "";
    (data) ? rel = data : rel = "";
    return rel
  }

  newUpload() {
    $('#detail').modal('hide')
    this.router.navigate(['/int03/01/01'], {
      queryParams: {
        inspectionWork: this.inspectionWork,
        budgetYear: this.budgetYear,
        factorId: this.factorId
      }
    })
  }

  onSave() {
    // this.submitted = true
    console.log("aaaaaaaaaa", this.dataForm.value);
    // return
    if (this.dataForm.invalid) {
      this.messageBar.errorModal(`กรุณากรอกข้อมูลให้ครบ`);
      return;
    }
    // if (this.showCalendar) {
    //   let from = $('#startDateNew').val()
    //   let to = $('#endDateNew').val()
    //   if (!from || !to) {
    //     this.messageBar.errorModal(`กรุณากรอกข้อมูลให้ครบ`);
    //     return;
    //   }
    // }
    // this.messageBar.comfirm(confirm => {
    //   if (confirm) {
    const URL = "ia/int03/01/01/saveFactorsData"
    console.log(this.dataForm.value);

    // return
    this.ajax.doPost(URL, this.dataForm.value).subscribe((res: ResponseData<any>) => {
      console.log("dataList", res);
      if (MessageService.MSG.SUCCESS == res.status) {
        // this.locationBack()
        this.getDatalistdynamic()
        this.messageBar.successModal(res.message)
      } else {
        this.messageBar.errorModal(res.message)
      }

    })
    console.log(this.dataForm.value)
    // }
    // }, "ยืนยันการบันทึกข้อมูล")
  }

  showModal(data) {
    console.log(data);
    this.getFactorList(data.iaRiskFactors.idMaster);
    this.dataselect = data;
    console.log("this.dataselect", this.dataselect);
    this.idHdr = this.dataselect.iaRiskFactorsConfig.infoUsedRisk
    this.dataForm.patchValue({
      infoUsedRiskDesc: this.dataselect.iaRiskFactorsConfig.infoUsedRiskDesc,
      riskIndicators: this.dataselect.iaRiskFactorsConfig.riskIndicators,
      riskUnit: this.dataselect.iaRiskFactorsConfig.riskUnit,
      dateFrom: this.dataselect.iaRiskFactorsConfig.startDate,
      dateTo: this.dataselect.iaRiskFactorsConfig.endDate,
      idFactors: this.dataselect.iaRiskFactors.id,
      budgetYear: this.dataselect.iaRiskFactors.budgetYear,
      side: this.dataselect.iaRiskFactors.side,
      inspectionWork: this.dataselect.iaRiskFactors.inspectionWork,
      riskFactorsMaster: this.dataselect.iaRiskFactors.riskFactors
    })
    $("#riskUnit").dropdown('set selected', `${this.dataselect.iaRiskFactorsConfig.riskUnit}`)
    $("#dataEvaluate").dropdown('set selected', `${this.dataselect.iaRiskFactors.dataEvaluate}`)
    if (this.dataselect.iaRiskFactors.dataEvaluate == "questionnaire") {
      this.loadYear();
      this.qtnEdit = true;
      if (this.dataselect.iaRiskFactorsConfig) {
        const idHdr = this.dataselect.iaRiskFactorsConfig.infoUsedRisk;
        if (idHdr) {
          this.getQuestionnaireHdr(parseInt(idHdr));
        }
      }
      setTimeout(() => {
        $('.ui.fluid.dropdown.ai').dropdown().css('width', '100%');
      }, 400);
    } else {
      this.qtnEdit = false;
    }
    let chackvaluemodel = this.dataselect.iaRiskFactorsConfig.mediumColor;
    this.dataselecteditstring = this.dataselect.iaRiskFactorsConfig.infoUsedRiskDesc;
    this.factorsLevel = this.dataselect.iaRiskFactorsConfig.factorsLevel;
    this.datas = [];
    let test = [];
    for (let i = 0; i < this.factorsLevel; i++) {
      this.datas.push(i);
      test.push(new Condition());
    }
    this.datas = test;
    
    $('#qtnYear').dropdown('clear')
    $('#qtnName').dropdown('clear')
    if (this.factorsLevel == 3) {
      if (chackvaluemodel == null) {
        setTimeout(() => {
          $('#detail').modal('show');
          this.calendar();
          $("#dateCalendarFrom").calendar("set date", this.dataselect.iaRiskFactorsConfig.startDate);
          $("#dateCalendarTo").calendar("set date", this.dataselect.iaRiskFactorsConfig.endDate);
          $("#condition0").dropdown('set selected', "<");
          $("#conditionTo0").dropdown('set selected', "N");
          $("#condition1").dropdown('set selected', ">=");
          $("#conditionTo1").dropdown('set selected', "<=");
          $("#condition2").dropdown('set selected', ">");
          $("#conditionTo2").dropdown('set selected', "N");
          $("#convertValue0").dropdown('set selected', "ต่ำ");
          $("#convertValue1").dropdown('set selected', "ปานกลาง");
          $("#convertValue2").dropdown('set selected', "สูง");
          $("#color0").dropdown('set selected', "เขียว");
          $("#color1").dropdown('set selected', "เหลือง");
          $("#color2").dropdown('set selected', "แดง");
          $("#valueRl0").val("1");
          $("#valueRl1").val("2");
          $("#valueRl2").val("3");
        }, 500);
      } else {
        setTimeout(() => {
          $('#detail').modal('show');
          var lowComSpil = this.dataselect.iaRiskFactorsConfig.lowCondition.split("|")
          var mediumComSpil = this.dataselect.iaRiskFactorsConfig.mediumCondition.split("|")
          var highComSpil = this.dataselect.iaRiskFactorsConfig.highCondition.split("|")
          $("#dateCalendarFrom").calendar("set date", this.dataselect.iaRiskFactorsConfig.startDate);
          $("#dateCalendarTo").calendar("set date", this.dataselect.iaRiskFactorsConfig.endDate);
          $("#condition0").dropdown('set selected', lowComSpil[0]);
          $("#conditionTo0").dropdown('set selected', lowComSpil[1]);
          $("#condition1").dropdown('set selected', mediumComSpil[0]);
          $("#conditionTo1").dropdown('set selected', mediumComSpil[1]);
          $("#condition2").dropdown('set selected', highComSpil[0]);
          $("#conditionTo2").dropdown('set selected', highComSpil[1]);
          $("#convertValue0").dropdown('set selected', this.dataselect.iaRiskFactorsConfig.low);
          $("#convertValue1").dropdown('set selected', this.dataselect.iaRiskFactorsConfig.medium);
          $("#convertValue2").dropdown('set selected', this.dataselect.iaRiskFactorsConfig.high);
          $("#color0").dropdown('set selected', this.dataselect.iaRiskFactorsConfig.lowColor);
          $("#color1").dropdown('set selected', this.dataselect.iaRiskFactorsConfig.mediumColor);
          $("#color2").dropdown('set selected', this.dataselect.iaRiskFactorsConfig.highColor);
          $("#valueRl0").val(this.dataselect.iaRiskFactorsConfig.lowRating);
          $("#valueRl1").val(this.dataselect.iaRiskFactorsConfig.mediumRating);
          $("#valueRl2").val(this.dataselect.iaRiskFactorsConfig.highRating);
          $("#valueone0").val(this.dataselect.iaRiskFactorsConfig.lowStart)
          $("#valueone1").val(this.dataselect.iaRiskFactorsConfig.mediumStart)
          $("#valueone2").val(this.dataselect.iaRiskFactorsConfig.highStart)
          $("#valuetwo0").val(this.dataselect.iaRiskFactorsConfig.lowEnd)
          $("#valuetwo1").val(this.dataselect.iaRiskFactorsConfig.mediumEnd)
          $("#valuetwo2").val(this.dataselect.iaRiskFactorsConfig.highEnd)
        }, 500);
      }
    }

    else if (this.factorsLevel == 5) {
      if (chackvaluemodel == null) {
        setTimeout(() => {
          $('#detail').modal('show');
          this.calendar();
          $("#dateCalendarFrom").calendar("set date", this.dataselect.iaRiskFactorsConfig.startDate);
          $("#dateCalendarTo").calendar("set date", this.dataselect.iaRiskFactorsConfig.endDate);
          $("#condition0").dropdown('set selected', "<");
          $("#conditionTo0").dropdown('set selected', "N");
          $("#condition1").dropdown('set selected', ">=");
          $("#conditionTo1").dropdown('set selected', "<");
          $("#condition2").dropdown('set selected', ">=");
          $("#conditionTo2").dropdown('set selected', "<");
          $("#condition3").dropdown('set selected', ">=");
          $("#conditionTo3").dropdown('set selected', "<");
          $("#condition4").dropdown('set selected', ">");
          $("#conditionTo4").dropdown('set selected', "N");
          $("#convertValue0").dropdown('set selected', "ต่ำมาก");
          $("#convertValue1").dropdown('set selected', "ต่ำ");
          $("#convertValue2").dropdown('set selected', "ปานกลาง");
          $("#convertValue3").dropdown('set selected', "สูง");
          $("#convertValue4").dropdown('set selected', "สูงมาก");
          $("#color0").dropdown('set selected', "เขียวเข้ม");
          $("#color1").dropdown('set selected', "เขียว");
          $("#color2").dropdown('set selected', "เหลือง");
          $("#color3").dropdown('set selected', "ส้ม");
          $("#color4").dropdown('set selected', "แดง");
          $("#valueRl0").val("1");
          $("#valueRl1").val("2");
          $("#valueRl2").val("3");
          $("#valueRl3").val("4");
          $("#valueRl4").val("5");
        }, 500);
      } else {
        setTimeout(() => {
          $('#detail').modal('show');
          var varylow = this.dataselect.iaRiskFactorsConfig.verylowCondition.split("|")
          var lowComSpil = this.dataselect.iaRiskFactorsConfig.lowCondition.split("|")
          var mediumComSpil = this.dataselect.iaRiskFactorsConfig.mediumCondition.split("|")
          var highComSpil = this.dataselect.iaRiskFactorsConfig.highCondition.split("|")
          var veryhigh = this.dataselect.iaRiskFactorsConfig.veryhighCondition.split("|")
          $("#dateCalendarFrom").calendar("set date", this.dataselect.iaRiskFactorsConfig.startDate);
          $("#dateCalendarTo").calendar("set date", this.dataselect.iaRiskFactorsConfig.endDate);
          $("#condition0").dropdown('set selected', varylow[0]);
          $("#conditionTo0").dropdown('set selected', varylow[1]);
          $("#condition1").dropdown('set selected', lowComSpil[0]);
          $("#conditionTo1").dropdown('set selected', lowComSpil[1]);
          $("#condition2").dropdown('set selected', mediumComSpil[0]);
          $("#conditionTo2").dropdown('set selected', mediumComSpil[1]);
          $("#condition3").dropdown('set selected', highComSpil[0]);
          $("#conditionTo3").dropdown('set selected', highComSpil[1]);
          $("#condition4").dropdown('set selected', veryhigh[0]);
          $("#conditionTo4").dropdown('set selected', veryhigh[1]);
          $("#convertValue0").dropdown('set selected', this.dataselect.iaRiskFactorsConfig.verylow);
          $("#convertValue1").dropdown('set selected', this.dataselect.iaRiskFactorsConfig.low);
          $("#convertValue2").dropdown('set selected', this.dataselect.iaRiskFactorsConfig.medium);
          $("#convertValue3").dropdown('set selected', this.dataselect.iaRiskFactorsConfig.high);
          $("#convertValue4").dropdown('set selected', this.dataselect.iaRiskFactorsConfig.veryhigh);
          $("#color0").dropdown('set selected', this.dataselect.iaRiskFactorsConfig.verylowColor);
          $("#color1").dropdown('set selected', this.dataselect.iaRiskFactorsConfig.lowColor);
          $("#color2").dropdown('set selected', this.dataselect.iaRiskFactorsConfig.mediumColor);
          $("#color3").dropdown('set selected', this.dataselect.iaRiskFactorsConfig.highColor);
          $("#color4").dropdown('set selected', this.dataselect.iaRiskFactorsConfig.veryhighColor);
          $("#valueRl0").val(this.dataselect.iaRiskFactorsConfig.verylowRating);
          $("#valueRl1").val(this.dataselect.iaRiskFactorsConfig.lowRating);
          $("#valueRl2").val(this.dataselect.iaRiskFactorsConfig.mediumRating);
          $("#valueRl3").val(this.dataselect.iaRiskFactorsConfig.highRating);
          $("#valueRl4").val(this.dataselect.iaRiskFactorsConfig.veryhighRating);
          $("#valueone0").val(this.dataselect.iaRiskFactorsConfig.verylowStart);
          $("#valueone1").val(this.dataselect.iaRiskFactorsConfig.lowStart);
          $("#valueone2").val(this.dataselect.iaRiskFactorsConfig.mediumStart);
          $("#valueone3").val(this.dataselect.iaRiskFactorsConfig.highStart);
          $("#valueone4").val(this.dataselect.iaRiskFactorsConfig.veryhighStart);
          $("#valuetwo0").val(this.dataselect.iaRiskFactorsConfig.verylowEnd);
          $("#valuetwo1").val(this.dataselect.iaRiskFactorsConfig.lowEnd);
          $("#valuetwo2").val(this.dataselect.iaRiskFactorsConfig.mediumEnd);
          $("#valuetwo3").val(this.dataselect.iaRiskFactorsConfig.highEnd);
          $("#valuetwo4").val(this.dataselect.iaRiskFactorsConfig.veryhighEnd);
        }, 500);
      }
    }
  }

  getFactorList(idMaster) {
    this.dataEvaluate = true
    const URL = "ia/int03/01/02/factorList"
    this.ajax.doPost(URL, {
      "id": idMaster
    }).subscribe((res: any) => {
      this.factorId = res.data.id
      if (res.data.dataEvaluate != "NEW") {
        this.dataEvaluate = false
      }
    });
  }
}

class Condition {
  conditionId: any;
  parentId: any;
  condition: any = "<>";
  conditionTo: any;
  valueone: any;
  valuetwo: any;
  valueRl: any;
  convertValue: any;
  color: any;
  riskType: any = '';
  page: any;
}

