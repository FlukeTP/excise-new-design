import { Component, OnInit, Input, Output, EventEmitter, SimpleChange } from "@angular/core";
import { BreadCrumb, ResponseData } from "models/index";
import { ActivatedRoute, Router } from '@angular/router';
import { AjaxService } from 'services/ajax.service';
import { MessageBarService } from 'services/message-bar.service';
import { MessageService } from 'services/message.service';
import { TextDateTH, formatter } from 'helpers/datepicker';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IaQuestionnaireHdr } from 'projects/internal-audit/int02/int02.models';
import { Int020101Vo, Int020101NameVo, Int020101YearVo } from 'projects/internal-audit/int02/int0201/int020101/int020101vo.model';

declare var $: any;

const URL = {
  QTN_HDR: "ia/int02",
  QTN_YEAR: "ia/int02/01/01/by/status",
  QTN_NAME: "ia/int02/01/01/by/year",
  QTN_COND_RANGE: "preferences/parameter/IA_COND_RANGE"
}

@Component({
  selector: "int030102",
  templateUrl: "./int030102.component.html",
  styleUrls: ["./int030102.component.css"]
})
export class Int030102Component implements OnInit {
  factorsLevel: Number = 0;
  riskFactorsLevelBefore: any;
  riskFactorsLevel: any;
  dataselecteditstring: any;
  inspectionWork: any;
  budgetYearBefore: any;
  budgetYear: any;
  budgetYearList: any[] = [];
  idHead: any;
  private datatable: any;
  dataSet: any;
  searchForm: FormGroup;
  changeDetail: FormGroup;
  formConfigMasterFive: FormGroup;
  formConfigMasterThree: FormGroup;
  submitted: any;
  inspectionWorkList: any[] = [];
  riskFactorsLevelList: any[] = [];
  date = new Date()
  ckeck: boolean = false;
  // chackfactorhide1: boolean = false;
  // chackfactorhide2: boolean = false;
  dataselect: any;
  datas: any[] = [];
  startDate: any;
  endDate: any;
  conditionRange: any[] = [];
  dataEvaluate: boolean = true;
  factorId: any
  _isDisabled: any;
  conditionNon: any;

  breadcrumb: BreadCrumb[] = [
    { label: "ตรวจสอบภายใน", route: "#" },
    { label: "การประเมินความเสี่ยง ", route: "#" },
    { label: "กำหนดปัจจัยเสี่ยง", route: "#" },
  ];

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

  constructor(
    private route: ActivatedRoute,
    private ajaxService: AjaxService,
    private router: Router,
    private messageBar: MessageBarService,
    private fb: FormBuilder,
  ) {
    this.changeDetail = this.fb.group({
      id: [''],
      month: [''],
      dateFrom: [''],
      dateTo: [''],
      submitted: ['']
    })
    this.formConfigMasterFive = this.fb.group({
      id: [''],
      idFactors: [''],
      infoUsedRisk: [''],
      infoUsedRiskDesc: [''],
      verylow: ['ต่ำมาก'],
      verylowStart: [''],
      verylowEnd: [''],
      verylowRating: ['1'],
      verylowColor: ['เขียวเข้ม'],
      verylowCondition: ['<'],
      verylowConditionTo: ['N'],
      low: ['ต่ำ'],
      lowStart: [''],
      lowEnd: [''],
      lowRating: ['2'],
      lowColor: ['เขียว'],
      lowCondition: ['<='],
      lowConditionTo: ['>='],
      medium: ['ปานกลาง'],
      mediumStart: [''],
      mediumEnd: [''],
      mediumRating: ['3'],
      mediumColor: ['เหลือง'],
      mediumCondition: ['<='],
      mediumConditionTo: ['>='],
      high: ['สูง'],
      highStart: [''],
      highEnd: [''],
      highRating: ['4'],
      highColor: ['แดง'],
      highCondition: ['<='],
      highConditionTo: ['>='],
      veryhigh: ['สูงมาก'],
      veryhighStart: [''],
      veryhighEnd: [''],
      veryhighRating: ['5'],
      veryhighColor: ['ส้ม'],
      veryhighCondition: ['>'],
      veryhighConditionTo: ['N']
    })

    this.formConfigMasterThree = this.fb.group({
      id: [''],
      idFactors: [''],
      infoUsedRisk: [''],
      infoUsedRiskDesc: [''],
      verylow: [''],
      verylowStart: [''],
      verylowEnd: [''],
      verylowRating: [''],
      verylowColor: [''],
      verylowCondition: [''],
      verylowConditionTo: [''],
      low: ['ต่ำ'],
      lowStart: [''],
      lowEnd: [''],
      lowRating: ['1'],
      lowColor: ['เขียว'],
      lowCondition: ['<'],
      lowConditionTo: ['N'],
      medium: ['ปานกลาง'],
      mediumStart: [''],
      mediumEnd: [''],
      mediumRating: ['2'],
      mediumColor: ['เหลือง'],
      mediumCondition: ['<='],
      mediumConditionTo: ['>='],
      high: ['สูง'],
      highStart: [''],
      highEnd: [''],
      highRating: ['3'],
      highColor: ['แดง'],
      highCondition: ['>'],
      highConditionTo: ['N'],
      veryhigh: [''],
      veryhighStart: [''],
      veryhighEnd: [''],
      veryhighRating: [''],
      veryhighColor: [''],
      veryhighCondition: [''],
      veryhighConditionTo: ['']
    })
  }

  ngOnInit() {
    this.getDropdownRange();
    this.initVariable();
    this.inspectionWorkDropdown();
    this.riskFactorsLevelDropdown()
    this.inspectionWork = this.route.snapshot.queryParams["inspectionWork"]
    if (this.inspectionWork == undefined) {
      this.inspectionWork = this.inspectionWorkList[0].paramInfoId
    }
    this.budgetYear = this.route.snapshot.queryParams["budgetYear"]
    if (this.budgetYear == undefined) {
      this.budgetYear = this.date.getFullYear() + 543
    }

  }

  ngAfterViewInit() {
    var date = new Date();
    $("#budgetYear2").calendar('set date', this.budgetYear);
    $("#inspectionWork").dropdown('set selected', this.inspectionWork);
    this.initDatatable();
    this.calendar();
    this.calendar2();
    this.budgetYearDropdown();
    $(".ui.dropdown").dropdown()
    $(".ui.dropdown.ia").css("width", "100%")
  }

  initVariable() {
    this.searchForm = this.fb.group({
      budgetYear: ["", Validators.required],
      riskType: ["", Validators.required]
    });
  }

  validateField(value: string) {
    return this.submitted && this.searchForm.get(value).errors;
  }

  getDropdownRange() {
    this.ajaxService.doPost(URL.QTN_COND_RANGE, {}).subscribe((result: ResponseData<any>) => {
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

  budgetYearDropdown() {
    const URL = "ia/int03/01/02/budgetYearDropdown"
    this.ajaxService.doPost(URL, {}).subscribe((res: any) => {
      this.budgetYearList = res;
      if (this.budgetYearList.findIndex(obj => obj.budgetYear == this.budgetYear) == -1) {
        this.budgetYearList.unshift({
          budgetYear: this.budgetYear,
          budgetYearTo: null,
          factorsLevel: null,
          iaRiskFactorsConfigAll: null,
          id: null,
          idHead: null,
          inspectionWork: null,
          status: null
        });
      }
    });
  }

  inspectionWorkDropdown = () => {
    const URL = "api/preferences/parameter-info";
    this.inspectionWorkList = [
      { paramInfoId: 3, paramGroupId: 10, paramCode: '3', value1: 'งานตรวจสอบโครงการยุทธศาสตร์ของกรมสรรพสามิต' },
      { paramInfoId: 4, paramGroupId: 10, paramCode: '4', value1: 'งานตรวจสอบระบบสารสนเทศฯ ของกรมสรรพสามิต' },
      { paramInfoId: 5, paramGroupId: 10, paramCode: '5', value1: 'งานตรวจสอบสำนักงานสรรพสามิตภาคพื้นที่' }]
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

  loacationBack() {
    this.router.navigate(['/int03/01'], {
      queryParams: {
        inspectionWork: this.inspectionWork,
        budgetYear: this.budgetYear
      }
    });
  }

  loacationAdd() {
    this.router.navigate(['/int03/01/01'], {
      queryParams: {
        inspectionWork: this.inspectionWork,
        budgetYear: this.budgetYear
      }
    });
  }

  ngOnChanges(changes: SimpleChange) {
    if ((changes.previousValue != changes.currentValue) && this.dateTo && this.dateFrom) {
      const dF = this.dateFrom.split('/');
      const dT = this.dateTo.split('/');
      const dateFrom = new Date(parseInt(dF[2]), parseInt(dF[1]), parseInt(dF[0]));
      const dateTo = new Date(parseInt(dT[2]), parseInt(dT[1]), parseInt(dT[0]));
      $("#dateCalendarFrom").calendar('set date', dateFrom);
      $("#dateCalendarTo").calendar('set date', dateTo);
    }
  }

  calendar() {
    $("#budgetYear1").calendar({
      maxDate: new Date(),
      type: "year",
      text: TextDateTH,
      formatter: formatter("ป"),
      onChange: (date, text) => {
      }
    }).calendar("set date", '2561')

    $("#budgetYear2").calendar({
      type: "year",
      initialDate: new Date(),
      text: TextDateTH,
      formatter: formatter("ป"),
      onChange: (date, text) => {
        this.changeSearch(text);
        this.budgetYearDropdown();
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

  changeSearch(budgetYear: any) {
    if (budgetYear) {
      this.budgetYear = budgetYear
      this.inspectionWork = $('#inspectionWork').val()
    } else {
      this.inspectionWork = $('#inspectionWork').val()
      this.budgetYear = this.budgetYear
    }
    setTimeout(() => {
      this.datatable.ajax.reload()
    }, 150);
  }

  initDatatable = () => {
    this.datatable = $("#dataTable").DataTableTh({
      lengthChange: false,
      searching: false,
      processing: true,
      ordering: false,
      scrollX: true,
      ajax: {
        type: "POST",
        url: AjaxService.CONTEXT_PATH + "ia/int03/01/02/list",
        contentType: "application/json",
        data: (d) => {
          return JSON.stringify($.extend({}, d, {
            "idHead": this.idHead,
            "budgetYear": this.budgetYear,
            "inspectionWork": this.inspectionWork
          }));
        }
      },
      columns: [
        {
          className: "ui center aligned",
          render: function (data, type, row, meta) {
            return meta.row + meta.settings._iDisplayStart + 1;
          }
        }, {
          data: "iaRiskFactorsMaster.riskFactorsMaster",
          className: "ui",
        }, {
          data: "iaRiskFactorsMaster.budgetYear",
          className: "ui center aligned",
        }, {
          data: "iaRiskFactorsMaster.createdBy",
          className: "ui center aligned",
        }, {
          data: "createdDateDesc",
          className: "ui center aligned",
        }, {
          data: "iaRiskFactorsMaster.status",
          className: "ui center aligned",
          render: function (data) {
            if (data == 'N') {
              return '<button type="button" class="ui mini orange button editStatus-button"><i class="power off icon"></i>ปิด</button>';
            } else if (data == 'Y') {
              return '<button type="button" class="ui mini green button editStatus-button"><i class="power off icon"></i>เปิด</button>';
            }
          }
        },
        {
          data: "iaRiskFactorsMaster.notDelete",
          className: "ui center aligned",
          render: function (data) {
            var button = '';
            if ('Y' == data) {
              button += '<button type="button" class="ui mini blue button DefineRiskFactors-button">ระดับความเสี่ยง</button> ';
              button += '<button type="button" class="ui mini red button delete-button" disabled><i class="trash icon"></i>ลบ</button>';
            } else if ('N' == data) {
              button += '<button type="button" class="ui mini blue button DefineRiskFactors-button">ระดับความเสี่ยง</button>';
              button += '<button type="button" class="ui mini red button delete-button"><i class="trash icon"></i>ลบ</button>';
            }
            return button
          }
        },
      ],
      "rowCallback": (row, data) => {
        if (data.iaRiskFactorsConfig.factorsLevel != null) {
          this.riskFactorsLevel = data.iaRiskFactorsConfig.factorsLevel;
          this.riskFactorsLevelBefore = data.iaRiskFactorsConfig.factorsLevel;
          $("#riskFactorsLevelBefore").val(data.iaRiskFactorsConfig.factorsLevel);
        }
      },
      "drawCallback": (settings) => {
        this.riskFactorsLevelDropdown()
      }
    });
    this.datatable.on("click", "td > button.delete-button", (event) => {
      var data = this.datatable.row($(event.currentTarget).closest("tr")).data();
      this.messageBar.comfirm((res) => {
        if (res) {
          if (data.iaRiskFactorsMaster.status == "Y") {
            this.editStatus(data.iaRiskFactorsMaster.id, data.iaRiskFactorsMaster.status);
          }
          this.delete(data.iaRiskFactorsMaster.id, data.iaRiskFactorsMaster.riskFactorsMaster);
        }
      }, "ยืนยันการลบข้อมูล " + data.iaRiskFactorsMaster.riskFactorsMaster)
    });
    this.datatable.on("click", "td > button.editStatus-button", (event) => {
      var data = this.datatable.row($(event.currentTarget).closest("tr")).data();
      this.editStatus(data.iaRiskFactorsMaster.id, data.iaRiskFactorsMaster.status);
    });
    this.datatable.on("click", "td > button.DefineRiskFactors-button", (event) => {
      var data = this.datatable.row($(event.currentTarget).closest("tr")).data();
      this.showModal(data);
    });
  };

  delete(data, riskFactorsMaster) {
    $('.ui.sidebar').sidebar({
      context: '.ui.grid.pushable'
    })
      .sidebar('setting', 'transition', 'push')
      .sidebar('setting', 'dimPage', false)
      .sidebar('hide');
    const URL = "ia/int03/01/02/delete"
    this.ajaxService.doPost(URL, { "id": data }).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.datatable.ajax.reload();
        this.messageBar.successModal(res.message)
      } else {
        this.messageBar.errorModal(res.message);
      }
    });
  }

  editStatus(id, status) {
    const URL = "ia/int03/01/02/editStatus"
    this.ajaxService.post(URL, {
      "id": id,
      "status": status,
      "inspectionWork": this.inspectionWork,
      "budgetYear": this.budgetYear
    }, res => {
      res = res.json()
      if (MessageService.MSG.SUCCESS == res.status) {
        this.submit();
      } else {
        this.messageBar.errorModal(res.message);
      }
      this.datatable.ajax.reload();
    });
  }

  ckeckRadio(check) {
    this.ckeck = check;
    this.budgetYearDropdown();
    setTimeout(() => {
      this.calendar()
      $(".ui.dropdown").dropdown()
      $(".ui.dropdown.ia").css("width", "100%")
      $("#budgetYearBefore").val($('#budgetYear').val());
    }, 100);
  }

  submit() {
    $('.ui.sidebar').sidebar({
      context: '.ui.grid.pushable'
    })
      .sidebar('setting', 'transition', 'push')
      .sidebar('setting', 'dimPage', false)
      .sidebar('hide');
    const URL = "ia/int03/01/02/save"
    this.ajaxService.doPost(URL, {
      "inspectionWork": this.inspectionWork,
      "budgetYear": this.budgetYear
    }).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.messageBar.successModal(res.message)
        this.budgetYearDropdown();
      } else {
        this.messageBar.errorModal(res.message);
        this.budgetYearDropdown();
      }
    })
  }

  saveRiskFactorsLevel = () => {
    this.messageBar.comfirm(confirm => {
      if (confirm) {
        var year = $('#budgetYear').val()
        var budgetYear = $('#budgetYearInput').val()
        var riskFactorsLevel = $('#riskFactorsLevel').val()
        const URL = "ia/int03/01/02/saveRiskFactorsLevel";
        this.ajaxService.doPost(URL, {
          "inspectionWork": this.inspectionWork,
          "budgetYearTo": year,
          "budgetYear": budgetYear,
          "factorsLevel": riskFactorsLevel
        }).subscribe((res: ResponseData<any>) => {
          console.log(res);
          if (MessageService.MSG.SUCCESS == res.status) {
            this.messageBar.successModal(res.message)
            this.datatable.ajax.reload();
          } else {
            this.messageBar.errorModal(res.message);
          }
        })
      } else {
        $("#riskFactorsLevel").dropdown('set selected', $("#riskFactorsLevelBefore").val());
      }
    }, "ยืนยันการบันทึกข้อมูลกำหนดระดับเกณฑ์ความเสี่ยง");
  }

  updateStatus() {
    this.messageBar.comfirm(confirm => {
      if (confirm) {
        var year = $('#budgetYear').val()
        var budgetYear = $('#budgetYearInput').val()
        var riskFactorsLevel = $('#riskFactorsLevel').val()
        const URL = "ia/int03/01/02/updateStatus";
        this.ajaxService.doPost(URL, {
          "inspectionWork": this.inspectionWork,
          "budgetYearTo": year,
          "budgetYear": budgetYear,
          "factorsLevel": riskFactorsLevel
        }).subscribe((res: ResponseData<any>) => {
          console.log(res);
          if (MessageService.MSG.SUCCESS == res.status) {
            this.messageBar.successModal(res.message)
            this.datatable.ajax.reload();
            $("#budgetYearBefore").val($('#budgetYear').val());
          } else {
            this.messageBar.errorModal(res.message);
          }
        })
      } else {
        console.log("budgetYearBefore : ", $("#budgetYearBefore").val());
        $("#budgetYear").dropdown('set selected', $("#budgetYearBefore").val());
      }
    }, "ยืนยันการบันทึกเลือกใช้ข้อมูลปีก่อนหน้า");
  }

  selectYear() {
    setTimeout(() => {
      $('.ui.fluid.dropdown.ai').dropdown().css('width', '100%');
      this.ajaxService.doGet(`${URL.QTN_NAME}/${this.qtnYear}/status`).subscribe((result: ResponseData<Int020101NameVo[]>) => {
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
    }, 200);
  }

  getFactorList(idMaster) {
    this.dataEvaluate = true
    const URL = "ia/int03/01/02/factorList"
    this.ajaxService.doPost(URL, {
      "id": idMaster
    }).subscribe((res: any) => {
      this.factorId = res.data.id
      if (res.data.dataEvaluate != "NEW") {
        this.dataEvaluate = false
      }
    });
  }

  // dropdown
  years: Int020101YearVo[] = [];
  names: Int020101NameVo[] = [];
  qtnEdit: boolean = false;
  qtnYear: string = "2561";
  qtnName: number = null;
  idHdr: number = null;

  getQuestionnaireHdr(idHdr: number) {
    this.ajaxService.doGet(`${URL.QTN_HDR}/${idHdr}`).subscribe((result: ResponseData<IaQuestionnaireHdr>) => {
      if (MessageService.MSG.SUCCESS == result.status) {
        this.qtnYear = result.data.budgetYear;
        this.selectYear();
        this.qtnName = idHdr;
      } else {
        this.messageBar.errorModal(result.message);
      }
    });;
  }

  loadYear() {
    this.ajaxService.doGet(`${URL.QTN_YEAR}`).subscribe((result: ResponseData<Int020101YearVo[]>) => {
      if (MessageService.MSG.SUCCESS == result.status) {
        // GET DATA HERE
        this.years = result.data;
      } else {
        this.messageBar.errorModal(result.message);
      }
    });
  }

  //เริ่มฟังชั่น ของ modal ที่ใช้ในการคอนฟิกค่าความเสี่ยงตรงนี้
  //โดยที่ฟั่งชั่น showMoal รับ data มาจาก callback faction ของ datatable
  showModal(data) {
    this.dataselect = data;
    console.log("dataselect :", this.dataselect);
    this.getFactorList(data.iaRiskFactorsMaster.id);
    var checkDefals = this.dataselect.iaRiskFactorsConfig.mediumColor
    this.factorsLevel = this.dataselect.iaRiskFactorsConfig.factorsLevel;
    this.dataselecteditstring = this.dataselect.iaRiskFactorsConfig.infoUsedRiskDesc;
    var idConfig = this.dataselect.idConfig;
    //ฟั่งชั่นแปลงค่าอะไรก็ไม่รู้
    if (this.dataselect.iaRiskFactorsMaster.dataEvaluate == "questionnaire") {
      this.loadYear();
      this.qtnEdit = true;
      if (this.dataselect.iaRiskFactorsConfig) {
        const idHdr = this.dataselect.iaRiskFactorsConfig.infoUsedRisk;
        if (idHdr) {
          this.getQuestionnaireHdr(parseInt(idHdr));
        }
      }
      setTimeout(() => {
        $('.ui.dropdown.ai').dropdown().css('width', '100%');
      }, 400);
    } else {
      this.qtnEdit = false;
    }
    this.calendar2();
    $("#dateCalendarFrom").calendar("set date", this.dataselect.iaRiskFactorsConfig.startDate);
    $("#dateCalendarTo").calendar("set date", this.dataselect.iaRiskFactorsConfig.endDate);
    // ส่วนเซ็ตค่าลงไปในตัวคอนฟิก
    // ถ้าตัวกำหนด factorlevel เท่ากับ 3 จะเข้าเป็นเซ็ตค่าที่ condition เป็น 3 
    // เช็คว่าถ้าหากชุดข้อมูลที่ส่งมาไม่มีค่าให้ formcontrol เป็นค่าพื้นฐานให้
    // ถ้ามีค่าให้เอาค่าที่ได้มา patchValue เข้า formcontrol
    if (this.factorsLevel == 3) {
      this.changeCondution("<", "lowCondition", "lowEnd")
      this.changeCondution("<=", "mediumCondition", "mediumEnd")
      this.changeCondution(">", "highCondition", "highEnd")
      if (checkDefals == 'เหลือง') {
        $('#detail').modal('show');
        this.formConfigMasterThree.patchValue({
          id: idConfig,
          idFactors: this.dataselect.iaRiskFactorsConfig.idFactors,
          infoUsedRisk: this.qtnName,
          infoUsedRiskDesc: this.dataselecteditstring,
          low: this.dataselect.iaRiskFactorsConfig.low,
          lowStart: this.dataselect.iaRiskFactorsConfig.lowStart,
          lowEnd: this.dataselect.iaRiskFactorsConfig.lowEnd,
          lowRating: this.dataselect.iaRiskFactorsConfig.lowRating,
          lowColor: this.dataselect.iaRiskFactorsConfig.lowColor,
          lowCondition: this.dataselect.iaRiskFactorsConfig.lowCondition,
          lowConditionTo: 'N',
          medium: this.dataselect.iaRiskFactorsConfig.medium,
          mediumStart: this.dataselect.iaRiskFactorsConfig.mediumStart,
          mediumEnd: this.dataselect.iaRiskFactorsConfig.mediumEnd,
          mediumRating: this.dataselect.iaRiskFactorsConfig.mediumRating,
          mediumColor: this.dataselect.iaRiskFactorsConfig.mediumColor,
          mediumCondition: this.dataselect.iaRiskFactorsConfig.mediumCondition,
          mediumConditionTo: '>=',
          high: this.dataselect.iaRiskFactorsConfig.high,
          highStart: this.dataselect.iaRiskFactorsConfig.highStart,
          highEnd: this.dataselect.iaRiskFactorsConfig.highEnd,
          highRating: this.dataselect.iaRiskFactorsConfig.highRating,
          highColor: this.dataselect.iaRiskFactorsConfig.highColor,
          highCondition: this.dataselect.iaRiskFactorsConfig.highCondition,
          highConditionTo: 'N'
        })
      } else {
        $('#detail').modal('show');
        this.formConfigMasterFive.patchValue({
          low: 'ต่ำ',
          lowStart: '',
          lowEnd: '',
          lowRating: '1',
          lowColor: 'เขียว',
          lowCondition: '<',
          lowConditionTo: 'N',
          medium: 'ปานกลาง',
          mediumStart: '',
          mediumEnd: '',
          mediumRating: '2',
          mediumColor: 'เหลือง',
          mediumCondition: '<=',
          mediumConditionTo: '>=',
          high: 'สูง',
          highStart: '',
          highEnd: '',
          highRating: '3',
          highColor: 'แดง',
          highCondition: '>',
          highConditionTo: 'N'
        })
      }
    }
    if (this.factorsLevel == 5) {
      this.changeCondution("<", "verylowCondition", "verylowEnd")
      this.changeCondution("<=", "lowCondition", "lowEnd")
      this.changeCondution("<=", "mediumCondition", "mediumEnd")
      this.changeCondution("<=", "highCondition", "highEnd")
      this.changeCondution(">", "veryhighCondition", "veryhighEnd")
      if (checkDefals == 'เหลือง') {
        $('#detail2').modal('show');
        this.formConfigMasterFive.patchValue({
          id: idConfig,
          idFactors: this.dataselect.iaRiskFactorsConfig.idFactors,
          infoUsedRisk: this.qtnName,
          infoUsedRiskDesc: this.dataselecteditstring,
          verylow: this.dataselect.iaRiskFactorsConfig.verylow,
          verylowStart: this.dataselect.iaRiskFactorsConfig.verylowStart,
          verylowEnd: this.dataselect.iaRiskFactorsConfig.verylowEnd,
          verylowRating: this.dataselect.iaRiskFactorsConfig.veryhighRating,
          verylowColor: this.dataselect.iaRiskFactorsConfig.verylowColor,
          verylowCondition: this.dataselect.iaRiskFactorsConfig.verylowCondition,
          verylowConditionTo: 'N',
          low: this.dataselect.iaRiskFactorsConfig.low,
          lowStart: this.dataselect.iaRiskFactorsConfig.lowStart,
          lowEnd: this.dataselect.iaRiskFactorsConfig.lowEnd,
          lowRating: this.dataselect.iaRiskFactorsConfig.lowRating,
          lowColor: this.dataselect.iaRiskFactorsConfig.lowColor,
          lowCondition: this.dataselect.iaRiskFactorsConfig.lowCondition,
          lowConditionTo: 'N',
          medium: this.dataselect.iaRiskFactorsConfig.medium,
          mediumStart: this.dataselect.iaRiskFactorsConfig.mediumStart,
          mediumEnd: this.dataselect.iaRiskFactorsConfig.mediumEnd,
          mediumRating: this.dataselect.iaRiskFactorsConfig.mediumRating,
          mediumColor: this.dataselect.iaRiskFactorsConfig.mediumColor,
          mediumCondition: this.dataselect.iaRiskFactorsConfig.mediumCondition,
          mediumConditionTo: '>=',
          high: this.dataselect.iaRiskFactorsConfig.high,
          highStart: this.dataselect.iaRiskFactorsConfig.highStart,
          highEnd: this.dataselect.iaRiskFactorsConfig.highEnd,
          highRating: this.dataselect.iaRiskFactorsConfig.highRating,
          highColor: this.dataselect.iaRiskFactorsConfig.highColor,
          highCondition: this.dataselect.iaRiskFactorsConfig.highCondition,
          highConditionTo: 'N',
          veryhigh: this.dataselect.iaRiskFactorsConfig.veryhigh,
          veryhighStart: this.dataselect.iaRiskFactorsConfig.veryhighStart,
          veryhighEnd: this.dataselect.iaRiskFactorsConfig.veryhighEnd,
          veryhighRating: this.dataselect.iaRiskFactorsConfig.veryhighRating,
          veryhighColor: this.dataselect.iaRiskFactorsConfig.veryhighColor,
          veryhighCondition: this.dataselect.iaRiskFactorsConfig.veryhighCondition,
          veryhighConditionTo: 'N'
        })
      } else {
        $('#detail2').modal('show');
        this.formConfigMasterFive.patchValue({
          verylow: ['ต่ำมาก'],
          verylowStart: '',
          verylowEnd: '',
          verylowRating: '1',
          verylowColor: 'เขียวเข้ม',
          verylowCondition: '<',
          verylowConditionTo: 'N',
          low: 'ต่ำ',
          lowStart: '',
          lowEnd: '',
          lowRating: '2',
          lowColor: 'เขียว',
          lowCondition: '<=',
          lowConditionTo: '>=',
          medium: 'ปานกลาง',
          mediumStart: '',
          mediumEnd: '',
          mediumRating: '3',
          mediumColor: 'เหลือง',
          mediumCondition: '<=',
          mediumConditionTo: '>=',
          high: 'สูง',
          highStart: '',
          highEnd: '',
          highRating: '4',
          highColor: 'แดง',
          highCondition: '<=',
          highConditionTo: '>=',
          veryhigh: 'สูงมาก',
          veryhighStart: '',
          veryhighEnd: '',
          veryhighRating: '5',
          veryhighColor: 'ส้ม',
          veryhighCondition: '>',
          veryhighConditionTo: 'N'
        })
      }
    }
  }

  cancel() {
    this.formConfigMasterFive.reset();
  }

  saveCondition(e) {
    console.log("config : ", this.formConfigMasterFive.value);
  }

  //ฟังชั่น ต่อเมื่อ ความเสี่ยงที่เป็น face new
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

  //ฟั่งชั่นใช้เช็คว่าต้องการปิดหรือเปิดให้ เลิอกหรือกรอกฟิลได้ในตัวกำหนดปัจจัยเสี่ยง
  changeCondution(e, data, boxend) {
    var dataCheck = e;
    var datamurt = data + "To"
    console.log("datamurt :",datamurt);
    
    if (dataCheck == ">") {
      $(`.${datamurt}`).addClass("disabled");
      $(`#${datamurt}`).dropdown('set selected', "N");
      $(`#${boxend}`).prop("disabled", true);
    } else if (dataCheck == "=") {
      $(`.${datamurt}`).addClass("disabled");
      $(`#${datamurt}`).dropdown('set selected', "N");
      $(`#${boxend}`).prop("disabled", true);
    } else if (dataCheck == "<") {
      $(`.${datamurt}`).addClass("disabled");
      $(`#${datamurt}`).dropdown('set selected', "N");
      $(`#${boxend}`).prop("disabled", true);
    } else if (dataCheck == "<=") {
      $(`#${datamurt}`).dropdown('set selected', ">=");
      $(`.${datamurt}`).removeClass("disabled");
      $(`#${boxend}`).prop("disabled", false);
    } else if (dataCheck == ">=") {
      $(`#${datamurt}`).dropdown('set selected', "<=");
      $(`.${datamurt}`).removeClass("disabled");
      $(`#${boxend}`).prop("disabled", false);
    }
  }


  // saveCondition(e) {
  //   e.preventDefault();
  //   this.startDate = $('#startDate').val();
  //   this.endDate = $('#endDate').val();
  //   let idConfig = this.dataselect.idConfig;
  //   var i = 1;
  //   this.datas.forEach(element => {
  //     i++;
  //     element.parentId = this.riskId;
  //   });

  //   if (i - 1 == this.datas.length) {
  //     var url = "ia/int03/01/saveRiskFactorsConfig";
  //     let data = [];
  //     this.datas.forEach(element => {
  //       element.parentId = this.riskId;
  //       element.riskType = this.riskType;
  //       element.page = this.page;
  //       element.dateCalendarTo = element.dateCalendarTo == '' ? null : element.dateCalendarTo;
  //       element.budgetYearend = element.budgetYearend == '' ? null : element.budgetYearend;
  //       element.conditionId = element.conditionId == '' ? null : element.conditionId;
  //       element.condition = element.condition == '' ? null : element.condition;
  //       element.valueone = element.valueone == '' ? null : element.valueone;
  //       element.conditionTo = element.conditionTo == '' ? null : element.conditionTo;
  //       element.valuetwo = element.valuetwo == '' ? null : element.valuetwo;
  //       element.valueRl = element.valueRl == '' ? null : element.valueRl;
  //       element.color = element.color == '' ? null : element.color;
  //       data.push(element);
  //     });
  //     if (this.factorsLevel == 3) {
  //       console.log("testfact : ", this.factorsLevel);
  //       this.ajaxService.doPost(url, {
  //         startDate: this.startDate,
  //         endDate: this.endDate,
  //         iaRiskFactorsConfig: {
  //           id: idConfig,
  //           idFactors: this.dataselect.iaRiskFactorsConfig.idFactors,
  //           infoUsedRisk: this.qtnName,
  //           infoUsedRiskDesc: this.dataselecteditstring,
  //           low: data[0].convertValue,
  //           lowStart: this.checknull($("#valueone0").val()),
  //           lowEnd: this.checknull($("#valuetwo0").val()),
  //           lowRating: $("#valueRl0").val(),
  //           lowColor: data[0].color,
  //           lowCondition: $("#condition0").val(),
  //           medium: data[1].convertValue,
  //           mediumStart: this.checknull($("#valueone1").val()),
  //           mediumEnd: this.checknull($("#valuetwo1").val()),
  //           mediumRating: $("#valueRl1").val(),
  //           mediumColor: data[1].color,
  //           mediumCondition: $("#condition1").val() + "|" + $("#conditionTo1").val(),
  //           high: data[2].convertValue,
  //           highStart: this.checknull($("#valueone2").val()),
  //           highEnd: this.checknull($("#valuetwo2").val()),
  //           highRating: $("#valueRl2").val(),
  //           highColor: data[2].color,
  //           highCondition: $("#condition2").val()
  //         }
  //       }).subscribe((res: ResponseData<any>) => {
  //         if (MessageService.MSG.SUCCESS == res.status) {
  //           this.messageBar.successModal(res.message)
  //           this.has.emit(true);
  //           this.out.emit(this.riskId);
  //           this.datatable.ajax.reload()
  //         } else {
  //           this.messageBar.errorModal(res.message);
  //         }
  //       });
  //     }
  //     else if (this.factorsLevel == 5) {
  //       this.ajaxService.doPost(url, {
  //         startDate: this.startDate,
  //         endDate: this.endDate,
  //         iaRiskFactorsConfig: {
  //           id: idConfig,
  //           idFactors: this.dataselect.iaRiskFactorsConfig.idFactors,
  //           infoUsedRisk: this.qtnName,
  //           infoUsedRiskDesc: this.dataselecteditstring,
  //           verylow: data[0].convertValue,
  //           verylowStart: this.checknull($("#valueone0").val()),
  //           verylowEnd: this.checknull($("#valuetwo0").val()),
  //           verylowRating: $("#valueRl0").val(),
  //           verylowColor: data[0].color,
  //           verylowCondition: $("#condition0").val(),
  //           low: data[1].convertValue,
  //           lowStart: this.checknull($("#valueone1").val()),
  //           lowEnd: this.checknull($("#valuetwo1").val()),
  //           lowRating: $("#valueRl1").val(),
  //           lowColor: data[1].color,
  //           lowCondition: $("#condition1").val() + "|" + $("#conditionTo1").val(),
  //           medium: data[2].convertValue,
  //           mediumStart: this.checknull($("#valueone2").val()),
  //           mediumEnd: this.checknull($("#valuetwo2").val()),
  //           mediumRating: $("#valueRl2").val(),
  //           mediumColor: data[2].color,
  //           mediumCondition: $("#condition2").val() + "|" + $("#conditionTo2").val(),
  //           high: data[3].convertValue,
  //           highStart: this.checknull($("#valueone3").val()),
  //           highEnd: this.checknull($("#valuetwo3").val()),
  //           highRating: $("#valueRl3").val(),
  //           highColor: data[3].color,
  //           highCondition: $("#condition3").val() + "|" + $("#conditionTo3").val(),
  //           veryhigh: data[4].convertValue,
  //           veryhighStart: this.checknull($("#valueone4").val()),
  //           veryhighEnd: this.checknull($("#valuetwo4").val()),
  //           veryhighRating: $("#valueRl4").val(),
  //           veryhighColor: data[4].color,
  //           veryhighCondition: $("#condition4").val()
  //         }
  //       }).subscribe((res: ResponseData<any>) => {
  //         if (MessageService.MSG.SUCCESS == res.status) {
  //           this.messageBar.successModal(res.message)
  //           this.has.emit(true);
  //           this.out.emit(this.riskId);
  //           this.datatable.ajax.reload()
  //         } else {
  //           this.messageBar.errorModal(res.message);
  //         }
  //       });
  //     }
  //   }
  // }
  // checknull(data) {
  //   var rel = "";
  //   (data) ? rel = data : rel = "";
  //   return rel
  // }

  // cancel() {
  //   this.out.emit(this.riskId);
  // }

  // changeCondution(i) {
  //   switch (this.datas[i].condition) {
  //     case "=":
  //       $('#valueone' + i).prop("disabled", false);
  //       $('#valuetwo' + i).prop("disabled", true);
  //       $('#conditionTo' + i).prop("disabled", true);
  //       $('#conditionTo' + i).dropdown('set selected', "N");
  //       break;

  //     case ">=":
  //       $('#valueone' + i).prop("disabled", false);
  //       $('#valuetwo' + i).prop("disabled", false);
  //       $('#conditionTo' + i).attr('disabled', true);
  //       $('#conditionTo' + i).dropdown('set selected', "<=");
  //       $('#valuetwo' + i).on('change', (e) => {
  //         $('#valuetwo' + i).attr({
  //           min: $('#valueone' + i).val() | 0
  //         });
  //         $('#valueone' + i).attr({
  //           max: e.target.value
  //         });
  //       });

  //       $('#valueone' + i).on('change', (e) => {
  //         $('#valuetwo' + i).attr({
  //           min: e.target.value | 0
  //         });
  //         $('#valueone' + i).attr({
  //           max: $('#valuetwo' + i).val()
  //         });
  //       });
  //       break;

  //     case "<=":
  //       $('#valueone' + i).prop("disabled", false);
  //       $('#valuetwo' + i).prop("disabled", false);
  //       $('#conditionTo' + i).prop("disabled", true);
  //       $('#conditionTo' + i).dropdown('set selected', ">=");
  //       $('#valuetwo' + i).on('change', (e) => {
  //         $('#valuetwo' + i).attr({
  //           min: $('#valueone' + i).val() | 0
  //         });
  //         $('#valueone' + i).attr({
  //           max: e.target.value
  //         });
  //       });
  //       $('#valueone' + i).on('change', (e) => {
  //         $('#valuetwo' + i).attr({
  //           min: e.target.value | 0
  //         });
  //         $('#valueone' + i).attr({
  //           max: $('#valuetwo' + i).val()
  //         });
  //       });
  //       $(".ui.dropdown").dropdown()
  //       $(".ui.dropdown.ia").css("width", "100%")

  //       break;
  //     case ">":
  //       $('#valueone' + i).prop("disabled", false);
  //       $('#valuetwo' + i).prop("disabled", true);
  //       $('#conditionTo' + i).prop("disabled", true);
  //       $('#conditionTo' + i).dropdown('set selected', "N");
  //       break;

  //     case "<":
  //       $('#valueone' + i).prop("disabled", false);
  //       $('#valuetwo' + i).prop("disabled", true);
  //       $('#conditionTo' + i).prop("disabled", true);
  //       $("#conditionTo" + i).dropdown('set selected', "N");
  //       break;
  //   }
  // }

  // isEmpty(value) {
  //   return value == null || value == undefined || value == '';
  // }

  // addRow() {
  //   this.datas.length < 5 && this.datas.push(new Condition());
  // }

  // delRow(index) {
  //   if (this.datas.length > 3) {
  //     this.datas.splice(index, 1);
  //   } else {
  //     this.messageBar.errorModal("เงื่อนไขต้องมีอย่างน้อย 3 เงื่อนไข");
  //   }
  // }

  // viewDetail() {
  //   $('#detail').modal('show');
  // }

  // showModal(data) {
  //   this.getFactorList(data.iaRiskFactorsMaster.id);
  //   this.dataselect = data;
  //   if (this.dataselect.iaRiskFactorsMaster.dataEvaluate == "questionnaire") {
  //     this.loadYear();
  //     this.qtnEdit = true;
  //     if (this.dataselect.iaRiskFactorsConfig) {
  //       const idHdr = this.dataselect.iaRiskFactorsConfig.infoUsedRisk;
  //       if (idHdr) {
  //         this.getQuestionnaireHdr(parseInt(idHdr));
  //       }
  //     }
  //     setTimeout(() => {
  //       $('.ui.fluid.dropdown.ai').dropdown().css('width', '100%');
  //     }, 400);
  //   } else {
  //     this.qtnEdit = false;
  //   }
  //   let chackvaluemodel = this.dataselect.iaRiskFactorsConfig.mediumColor;
  //   this.dataselecteditstring = this.dataselect.iaRiskFactorsConfig.infoUsedRiskDesc;
  //   this.factorsLevel = this.dataselect.iaRiskFactorsConfig.factorsLevel;
  //   var url = "ia/condition/findConditionByParentId";
  //   this.ajaxService.postOld(url, { parentId: this.riskId, riskType: this.riskType, page: this.page }, res => {
  //     var data = res.json();
  //     if (data.length > 0) {
  //       this.has.emit(true);
  //     } else {
  //       this.has.emit(false);
  //     }
  //     this.datas = [];
  //     for (let i = 0; i < data.length; i++) {
  //       this.datas.push(data[i]);
  //     }
  //     if (this.datas.length < this.factorsLevel) {
  //       let test = [];
  //       for (let i = 0; i < this.factorsLevel; i++) {
  //         test.push(new Condition());
  //       }
  //       this.datas = test;
  //     }
  //   });
  //   if (chackvaluemodel == null) {
  //     if (this.factorsLevel == 3) {
  //       setTimeout(() => {
  //         $('#detail').modal('show');
  //         this.calendar();
  //         $("#dateCalendarFrom").calendar("set date", this.dataselect.iaRiskFactorsConfig.startDate);
  //         $("#dateCalendarTo").calendar("set date", this.dataselect.iaRiskFactorsConfig.endDate);
  //         $("#condition0").dropdown('set selected', "<");
  //         $("#condition1").dropdown('set selected', ">=");
  //         $("#conditionTo1").dropdown('set selected', "<=");
  //         $("#condition2").dropdown('set selected', ">");
  //         $("#convertValue0").dropdown('set selected', "ต่ำ");
  //         $("#convertValue1").dropdown('set selected', "ปานกลาง");
  //         $("#convertValue2").dropdown('set selected', "สูง");
  //         $("#color0").dropdown('set selected', "เขียว");
  //         $("#color1").dropdown('set selected', "เหลือง");
  //         $("#color2").dropdown('set selected', "แดง");
  //         $("#valueRl0").val("1");
  //         $("#valueRl1").val("2");
  //         $("#valueRl2").val("3");
  //       }, 500);
  //     }
  //     else if (this.factorsLevel == 5) {
  //       setTimeout(() => {
  //         $('#detail').modal('show');
  //         this.calendar();
  //         $("#dateCalendarFrom").calendar("set date", this.dataselect.iaRiskFactorsConfig.startDate);
  //         $("#dateCalendarTo").calendar("set date", this.dataselect.iaRiskFactorsConfig.endDate);
  //         $("#condition0").dropdown('set selected', "<");
  //         $("#condition1").dropdown('set selected', ">=");
  //         $("#conditionTo1").dropdown('set selected', "<=");
  //         $("#condition2").dropdown('set selected', ">=");
  //         $("#conditionTo2").dropdown('set selected', "<=");
  //         $("#condition3").dropdown('set selected', ">=");
  //         $("#conditionTo3").dropdown('set selected', "<=");
  //         $("#condition4").dropdown('set selected', ">");
  //         $("#convertValue0").dropdown('set selected', "ต่ำมาก");
  //         $("#convertValue1").dropdown('set selected', "ต่ำ");
  //         $("#convertValue2").dropdown('set selected', "ปานกลาง");
  //         $("#convertValue3").dropdown('set selected', "สูง");
  //         $("#convertValue4").dropdown('set selected', "สูงมาก");
  //         $("#color0").dropdown('set selected', "เขียวเข้ม");
  //         $("#color1").dropdown('set selected', "เขียว");
  //         $("#color2").dropdown('set selected', "เหลือง");
  //         $("#color3").dropdown('set selected', "ส้ม");
  //         $("#color4").dropdown('set selected', "แดง");
  //         $("#valueRl0").val("1");
  //         $("#valueRl1").val("2");
  //         $("#valueRl2").val("3");
  //         $("#valueRl3").val("4");
  //         $("#valueRl4").val("5");
  //       }, 500);
  //     }
  //   } else {
  //     if (this.factorsLevel == 3) {
  //       setTimeout(() => {
  //         $('#detail').modal('show');
  //         $("#dateCalendarFrom").calendar("set date", this.dataselect.iaRiskFactorsConfig.startDate);
  //         $("#dateCalendarTo").calendar("set date", this.dataselect.iaRiskFactorsConfig.endDate);
  //         $("#condition0").dropdown('set selected', this.dataselect.iaRiskFactorsConfig.lowCondition);
  //         $("#condition1").dropdown('set selected', this.dataselect.iaRiskFactorsConfig.mediumCondition);
  //         $("#condition2").dropdown('set selected', this.dataselect.iaRiskFactorsConfig.highCondition);
  //         $("#convertValue0").dropdown('set selected', this.dataselect.iaRiskFactorsConfig.low);
  //         $("#convertValue1").dropdown('set selected', this.dataselect.iaRiskFactorsConfig.medium);
  //         $("#convertValue2").dropdown('set selected', this.dataselect.iaRiskFactorsConfig.high);
  //         $("#color0").dropdown('set selected', this.dataselect.iaRiskFactorsConfig.lowColor);
  //         $("#color1").dropdown('set selected', this.dataselect.iaRiskFactorsConfig.mediumColor);
  //         $("#color2").dropdown('set selected', this.dataselect.iaRiskFactorsConfig.highColor);
  //         $("#valueRl0").val(this.dataselect.iaRiskFactorsConfig.lowRating);
  //         $("#valueRl1").val(this.dataselect.iaRiskFactorsConfig.mediumRating);
  //         $("#valueRl2").val(this.dataselect.iaRiskFactorsConfig.highRating);
  //         $("#valueone0").val(this.dataselect.iaRiskFactorsConfig.lowStart)
  //         $("#valueone1").val(this.dataselect.iaRiskFactorsConfig.mediumStart)
  //         $("#valueone2").val(this.dataselect.iaRiskFactorsConfig.highStart)
  //         $("#valuetwo0").val(this.dataselect.iaRiskFactorsConfig.lowEnd)
  //         $("#valuetwo1").val(this.dataselect.iaRiskFactorsConfig.mediumEnd)
  //         $("#valuetwo2").val(this.dataselect.iaRiskFactorsConfig.highEnd)
  //       }, 500);
  //     }
  //     else if (this.factorsLevel == 5) {
  //       setTimeout(() => {
  //         $('#detail').modal('show');
  //         $("#dateCalendarFrom").calendar("set date", this.dataselect.iaRiskFactorsConfig.startDate);
  //         $("#dateCalendarTo").calendar("set date", this.dataselect.iaRiskFactorsConfig.endDate);
  //         $("#condition0").dropdown('set selected', this.dataselect.iaRiskFactorsConfig.verylowCondition);
  //         $("#condition1").dropdown('set selected', this.dataselect.iaRiskFactorsConfig.lowCondition);
  //         $("#condition2").dropdown('set selected', this.dataselect.iaRiskFactorsConfig.mediumCondition);
  //         $("#condition3").dropdown('set selected', this.dataselect.iaRiskFactorsConfig.highCondition);
  //         $("#condition4").dropdown('set selected', this.dataselect.iaRiskFactorsConfig.veryhighCondition);
  //         $("#convertValue0").dropdown('set selected', this.dataselect.iaRiskFactorsConfig.verylow);
  //         $("#convertValue1").dropdown('set selected', this.dataselect.iaRiskFactorsConfig.low);
  //         $("#convertValue2").dropdown('set selected', this.dataselect.iaRiskFactorsConfig.medium);
  //         $("#convertValue3").dropdown('set selected', this.dataselect.iaRiskFactorsConfig.high);
  //         $("#convertValue4").dropdown('set selected', this.dataselect.iaRiskFactorsConfig.veryhigh);
  //         $("#color0").dropdown('set selected', this.dataselect.iaRiskFactorsConfig.verylowColor);
  //         $("#color1").dropdown('set selected', this.dataselect.iaRiskFactorsConfig.lowColor);
  //         $("#color2").dropdown('set selected', this.dataselect.iaRiskFactorsConfig.mediumColor);
  //         $("#color3").dropdown('set selected', this.dataselect.iaRiskFactorsConfig.highColor);
  //         $("#color4").dropdown('set selected', this.dataselect.iaRiskFactorsConfig.veryhighColor);
  //         $("#valueRl0").val(this.dataselect.iaRiskFactorsConfig.verylowRating);
  //         $("#valueRl1").val(this.dataselect.iaRiskFactorsConfig.lowRating);
  //         $("#valueRl2").val(this.dataselect.iaRiskFactorsConfig.mediumRating);
  //         $("#valueRl3").val(this.dataselect.iaRiskFactorsConfig.highRating);
  //         $("#valueRl4").val(this.dataselect.iaRiskFactorsConfig.veryhighRating);
  //         $("#valueone0").val(this.dataselect.iaRiskFactorsConfig.verylowStart);
  //         $("#valueone1").val(this.dataselect.iaRiskFactorsConfig.lowStart);
  //         $("#valueone2").val(this.dataselect.iaRiskFactorsConfig.mediumStart);
  //         $("#valueone3").val(this.dataselect.iaRiskFactorsConfig.highStart);
  //         $("#valueone4").val(this.dataselect.iaRiskFactorsConfig.veryhighStart);
  //         $("#valuetwo0").val(this.dataselect.iaRiskFactorsConfig.verylowEnd);
  //         $("#valuetwo1").val(this.dataselect.iaRiskFactorsConfig.lowEnd);
  //         $("#valuetwo2").val(this.dataselect.iaRiskFactorsConfig.mediumEnd);
  //         $("#valuetwo3").val(this.dataselect.iaRiskFactorsConfig.highEnd);
  //         $("#valuetwo4").val(this.dataselect.iaRiskFactorsConfig.veryhighEnd);
  //       }, 500);
  //     }
  //   }
  // }

  //   newUpload() {
  //     $('#detail').modal('hide')
  //     this.router.navigate(['/int03/01/01'], {
  //       queryParams: {
  //         inspectionWork: this.inspectionWork,
  //         budgetYear: this.budgetYear,
  //         factorId: this.factorId
  //       }
  //     })
  //   }
}

