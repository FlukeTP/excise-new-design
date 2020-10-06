
import { BreadCrumb, ResponseData } from "models/index";
import { ActivatedRoute, Router } from '@angular/router';
import { AjaxService } from 'services/ajax.service';
import { MessageBarService } from 'services/message-bar.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ExciseService, MessageService } from 'services/index';
import { Int020101Vo, Int020101NameVo, Int020101YearVo } from 'projects/internal-audit/int02/int0201/int020101/int020101vo.model';
import { Component, OnInit, Input, Output, EventEmitter, SimpleChange } from "@angular/core";
import { TextDateTH, formatter } from 'helpers/datepicker';
import { IaQuestionnaireHdr } from 'projects/internal-audit/int02/int02.models';

declare var $: any;
const ULRS = {
  GET_WEB_SERVICE: "preferences/parameter",
  GET_DATA_MASTER: "ia/int03/05/list",
  DELETE_DATA_MASTER: "ia/int03/05/delete",
  ADD_DATA_MASTER: "ia/int03/05/add",
  EDIT_DATA_MASTER: "ia/int03/05/edit",
  ADD_RISK_FACTORS: "ia/int03/05/addRiskFactors"
}
const URL = {
  QTN_HDR: "ia/int02",
  QTN_YEAR: "ia/int02/01/01/by/status",
  QTN_NAME: "ia/int02/01/01/by/year",
  QTN_COND_RANGE: "preferences/parameter/IA_COND_RANGE",
}
@Component({
  selector: 'app-int0305',
  templateUrl: './int0305.component.html',
  styleUrls: ['./int0305.component.css']
})
export class Int0305Component implements OnInit {
  inspectionWorkList: any[] = []
  sideList: any = []
  datas: any = []
  dataTable: any
  editForm: FormGroup
  saveForm: FormGroup
  submitted: boolean = false
  inspectionWork = new FormControl('');
  inspectionWorkData: any;
  budgetYear: any
  dontFrom0306: boolean = false
  isEdit: boolean = false
  factorsLevel: Number = 0;
  trHtml1: any[] = [];
  listdynamic: any[] = [];
  lists: any[] = [];
  budgetYearStart: any;
  names: Int020101NameVo[] = [];
  qtnYear: string = "2561";
  qtnName: number = null;
  years: Int020101YearVo[] = [];
  dataEvaluate: boolean = true;
  factorId: any
  riskFactorsLevel: any;
  inspectionWorkback: any;
  budgetYearback: any;
  dropdownRisk: any[] = [];
  searchForm: FormGroup;
  dataselect: any;
  dataselecteditstring: any;
  dataedit: any;
  dataselectlevel: any;
  datahead: any;
  changeDetail: FormGroup;
  startdate: any;
  enddate: any;
  column: any[] = [];
  qtnEdit: boolean = false;
  conditionRange: any;
  conditionNon: any;


  riskFactorsLevelBefore: any;
  riskFactorsLevelList: any[] = [];
  ftl: any;
  startDate: any;
  endDate: any;
  riskUnitList: any
  checkStatusScreen: String = "T";
  dataForm: FormGroup
  webServiceData: any;
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
    { label: "ข้อมูลหลักปัจจัยเสี่ยง", route: "#" },
  ]
  constructor(
    private route: ActivatedRoute,
    private ajax: AjaxService,
    private router: Router,
    private messageBar: MessageBarService,
    private formBuilder: FormBuilder,
    private fb: FormBuilder,
  ) {
    this.editForm = this.fb.group({
      id: [''],
      riskFactorsMaster: ['', Validators.required],
      side: [[], Validators.required],
      inspectionWork: ['', Validators.required],
      budgetYear: ['']
    })
    this.saveForm = this.fb.group({
      riskFactorsMaster: ['', Validators.required],
      side: [[], Validators.required],
      inspectionWork: ['', Validators.required],
      budgetYear: ['']
    })

    this.dataForm = this.formBuilder.group({
      id: [''],
      side: [null, Validators.required],
      inspectionWork: ['', Validators.required],
      budgetYear: [''],

      infoUsedRiskDesc: ["", Validators.required],
      riskIndicators: ["", Validators.required],
      riskFactorsMaster: ["", Validators.required],
      // dataName: ["", Validators.required],
      dateFrom: [""],
      dateTo: [""],
      iaRiskFactorsDataList: [null],
      riskUnit: ["", Validators.required],
      idFactors: [""],
      idMaster: [''],
      dataEvaluate: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.getDropdownRange();
    this.calendar();
    this.inspectionWorkDropdown()
    this.riskUnitDropDown();
    this.inspectionWorkData = this.route.snapshot.queryParams["inspectionWork"]
    this.budgetYear = this.route.snapshot.queryParams["budgetYear"]

    this.inspectionWork.setValue(this.inspectionWorkData)
    if (!(this.budgetYear && this.inspectionWorkData)) {
      this.budgetYear = MessageService.budgetYear();
      this.inspectionWork.setValue(this.inspectionWorkList[0].paramInfoId)
      this.dontFrom0306 = true
    }


    console.log("budgetYear : ", this.budgetYear);

    this.sideDropdown()
    this.getListMaster()
    this.getWebService()
  }

  ngAfterViewInit() {
    this.loadYear();
    this.calendar();
    this.genDataTable()
    if (this.inspectionWorkback && this.budgetYearback) {
      // $("#inspectionWork").dropdown('set selected', this.inspectionWorkback);
      var date = new Date(this.budgetYearback, 1, 1);
      $('#budgetYear').val(MessageService.budgetYear());
    } else {
      var date = new Date();
      $("#budgetYear1").calendar('set date', date);
      // $("#inspectionWork").dropdown('set selected', 3);
    }
    $(".ui.dropdown").dropdown();
    $(".ui.dropdown.ia").css("width", "100%");
    $(".ui.dropdown.rfl").css("min-width", "60px");
    this.getListMaster();
    console.log(this.datas);

    this.calendar2();
  }

  getWebService = () => {
    this.ajax.doPost(`${ULRS.GET_WEB_SERVICE}/IA_RISK_WEBSERVICE`, {}).subscribe((result: any) => {
      this.webServiceData = result.data
      console.log("getWebService", result);
    })
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

  loacationAdd() {

  }
  calendar() {
    $("#budgetYear1").calendar({
      type: "year",
      initialDate: new Date(),
      text: TextDateTH,
      formatter: formatter("ป"),
      onChange: (date, text) => {
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

  genDataTable() {
    if (this.dontFrom0306) {
      this.dataTable = $("#dataTableFrom0306").DataTableTh({
        processing: true,
        serverSide: false,
        paging: false,
        scrollX: true,
        data: this.datas,
        columns: [
          {
            className: "ui center aligned",
            render: function (data, type, row, meta) {
              return meta.row + meta.settings._iDisplayStart + 1;
            }
          }, {
            className: "text-left",
            render: function (data, type, row, meta) {
              if (row && row.iaRiskFactorsMaster) {
                row = row.iaRiskFactorsMaster.riskFactorsMaster
              }
              return row
            }
          }, {
            className: "text-left",
            render: function (data, type, row, meta) {
              if (row && row.iaRiskFactorsMaster) {
                row = row.iaRiskFactorsMaster.side
              }
              return row
            }
          }, {
            className: "ui center aligned",
            render: function (data, type, row, meta) {
              let btn = ''
              if (row && row.iaRiskFactorsMaster) {
                if ("Y" == row.iaRiskFactorsMaster.notDelete) {
                  btn += `<button type="button" class="ui mini orange button edit-button"><i class="edit icon"></i>แก้ไข</button>`
                  btn += `<button type="button" class="ui mini red button delete-button" disabled><i class="trash icon"></i>ลบ</button>`
                } else if ("N" == row.iaRiskFactorsMaster.notDelete) {
                  btn += `<button type="button" class="ui mini orange button edit-button"><i class="edit icon"></i>แก้ไข</button>`
                  btn += `<button type="button" class="ui mini red button delete-button"><i class="trash icon"></i>ลบ</button>`
                }
              }
              return btn
            }
          }
        ],
      })
    } else if (!this.dontFrom0306) {
      this.dataTable = $("#dataTable").DataTableTh({
        processing: true,
        serverSide: false,
        paging: false,
        scrollX: true,
        data: this.datas,
        columns: [
          {
            className: "ui center aligned",
            render: function (data, type, full, meta) {
              return `<input type="checkbox" name="chk-${meta.row}"
            id="chk-${meta.row}" > `
            }
          }, {
            className: "ui center aligned",
            render: function (data, type, row, meta) {
              return meta.row + meta.settings._iDisplayStart + 1;
            }
          }, {
            className: "text-left",
            render: function (data, type, row, meta) {
              if (row && row.iaRiskFactorsMaster) {
                row = row.iaRiskFactorsMaster.riskFactorsMaster
              }
              return row
            }
          }, {
            className: "text-left",
            render: function (data, type, row, meta) {
              if (row && row.iaRiskFactorsMaster) {
                row = row.iaRiskFactorsMaster.side
              }
              return row
            }
          }
        ],
      })
    }
    $('.ui.grid .row').css('padding-top', '0');
    this.dataTable.on("click", "td > button.edit-button", (event) => {
      // var data = this.dataTable.row($(event.currentTarget).closest("tr")).data().iaRiskFactorsMaster
      // this.openEditModal(data)

      var data = this.dataTable.row($(event.currentTarget).closest("tr")).data()
      // console.log(data);
      this.showModalEdit(data);
    })

    this.dataTable.on("click", "td > button.delete-button", (event) => {
      var id = this.dataTable.row($(event.currentTarget).closest("tr")).data().iaRiskFactorsMaster.id
      this.deleteMaster(id)
    })
  }

  inspectionWorkDropdown = () => {
    this.inspectionWorkList = [
      { paramInfoId: 3, paramGroupId: 10, paramCode: '3', value1: 'งานตรวจสอบโครงการยุทธศาสตร์ของกรมสรรพสามิต', iconName: 'clipboard' },
      { paramInfoId: 4, paramGroupId: 10, paramCode: '4', value1: 'งานตรวจสอบระบบสารสนเทศฯ ของกรมสรรพสามิต', iconName: 'laptop' },
      { paramInfoId: 5, paramGroupId: 10, paramCode: '5', value1: 'งานตรวจสอบสำนักงานสรรพสามิตภาคพื้นที่', iconName: 'globe' }]
  }
  sideDropdown = () => {
    this.sideList = [
      { value: 'S', data: 'ด้านกลยุทธ์(Startegy - S)' },
      { value: 'O', data: 'ด้านการดำเนินงาน(Operation - O)' },
      { value: 'P', data: 'ด้านผลการปฎิบัติงานหรือผลการดำเนินการ(Performance - P)' },
      { value: 'F', data: 'ด้านการเงิน(Financial - F)' },
      { value: 'C', data: 'ด้านการปฏิบัติตามกฎหมายและระเบียบ(Compliance - C)' },
      { value: 'Technology', data: 'ด้านเทคโนโลยีสารสนเทศ(Information Technology)' },
      { value: 'I', data: 'ด้านการควบคุมภายใน(Internal Control - I)' },
    ]
  }

  getListMasterClick(paramInfoId: any) {
    $('table').removeClass(`table${this.inspectionWorkTab}`);
    this.inspectionWorkTab = paramInfoId;
    this.inspectionWork.patchValue(paramInfoId);
    this.getListMaster();
  }

  getListMaster() {
    this.ajax.doPost(ULRS.GET_DATA_MASTER, { "inspectionWork": this.inspectionWork.value, "budgetYear": this.budgetYear }).subscribe((result: any) => {
      console.log("result : ", result);
      this.datas = result.data
      console.log("this.datas : ", this.datas);
      if (this.datas.length != 0) {
        this.ftl = result.data[0].iaRiskFactorsConfig.factorsLevel
      }
      this.dataTable.clear().draw()
      this.dataTable.rows.add(this.datas).draw()
      this.dataTable.columns.adjust().draw();
      $('table').addClass(`table${this.inspectionWorkTab}`);
    })
  }

  deleteMaster(id: any) {
    console.log(id);

    this.messageBar.comfirm(confirm => {
      if (confirm) {
        this.ajax.doPost(ULRS.DELETE_DATA_MASTER, { "id": id }).subscribe((result: any) => {
          if (MessageService.MSG.SUCCESS == result.status) {
            // this.dataTable.ajax.reload();
            this.getListMaster()
            this.messageBar.successModal(result.message)
          } else {
            this.messageBar.errorModal(result.message);
          }
        })
      }
    }, "ยืนยันการลบปัจจัยเสี่ยง")
  }

  clickCheckAll = event => {
    if (event.target.checked) {
      var node = $("#dataTable")
        .DataTable()
        .rows()
        .nodes()
      $.each(node, function (index, value) {
        $(this)
          .find("input")
          .prop("checked", true);
      });
    } else {
      var node = $("#dataTable")
        .DataTable()
        .rows()
        .nodes();
      $.each(node, function (index, value) {
        $(this)
          .find("input")
          .prop("checked", false);
      })
    }
    $('.ui.grid .row').css('padding-top', '0');
  }

  openEditModal(data: any) {
    console.log("Data openEditModal : ", data)

    let sides: string[] = [];
    if (data.side.search(",") != -1) {
      // found comma `,`
      sides = data.side.split(",")
    } else {
      sides = [data.side]
    }
    this.editForm.patchValue({
      id: data.id,
      riskFactorsMaster: data.riskFactorsMaster,
      side: sides,
      inspectionWork: data.inspectionWork,
      budgetYear: data.budgetYear,
      // dataEvaluate:data.dataEvaluate
    })
    let dataStr: string[] = [];
    for (let i = 0; i < sides.length; i++) {
      for (let j = 0; j < this.sideList.length; j++) {
        if (this.sideList[j].value == sides[i]) {
          dataStr[i] = `${j}: '${sides[i]}'`
        }
      }
    }
    console.log("DATASTR => ", dataStr)
    $('#sideEdit').dropdown('clear')
    $('#editModal').modal({
      onShow: () => {
        setTimeout(() => {
          $('#sideEdit').dropdown('set selected', dataStr)
        }, 200);
      }
    }).modal('show')
  }

  openSaveModal(data: any) {
    // $('#saveModal').modal('show')
    // console.log("aaaaaaaaaaaaaaaaaa=>",this.datas[0].iaRiskFactorsConfig.factorsLevel);

    $('#detail').modal('show')
  }

  saveFactos(e) {
    this.submitted = true
    let side = this.saveForm.value.side.toString()
    $('#budgetYear').val(this.budgetYear);
    this.saveForm.patchValue({
      inspectionWork: this.inspectionWork.value
    })
    if (this.saveForm.invalid) {
      return
    }
    console.log(this.saveForm.value);
    this.saveForm.patchValue({
      side: side
    })
    this.saveForm.patchValue({
      budgetYear: this.budgetYear
    })
    this.ajax.doPost(ULRS.ADD_DATA_MASTER, this.saveForm.value).subscribe((result: any) => {
      if (MessageService.MSG.SUCCESS == result.status) {
        this.messageBar.successModal(result.message);
        $('#saveModal').modal('hide');
        $('#detail').modal('hide')
        this.submitted = false
        this.saveForm.reset()
        $('#sideSave').dropdown('clear')
        this.getListMaster();
      } else {
        this.submitted = false
        this.messageBar.errorModal(result.message);
      }
    })
  }


  editFactos(event?: any) {
    this.submitted = true
    let side = this.dataForm.value.side.toString()
    $('#budgetYear').val(this.budgetYear);
    this.dataForm.patchValue({
      inspectionWork: this.inspectionWork.value
    })
    if (this.dataForm.invalid) {
      return
    }
    console.log(this.dataForm.value);
    this.dataForm.patchValue({
      side: side
    })
    this.saveForm.patchValue({
      budgetYear: this.budgetYear
    })
    console.log(this.dataForm.value);

    // return
    this.ajax.doPost(ULRS.EDIT_DATA_MASTER, this.dataForm.value).subscribe((result: any) => {
      if (MessageService.MSG.SUCCESS == result.status) {
        this.messageBar.successModal(result.message);
        $('#sideSave').dropdown('clear')
        $('#saveModal').modal('hide');
        $('#detail').modal('hide')
        this.submitted = false
        this.saveForm.reset()
        this.getListMaster();
      } else {
        this.messageBar.errorModal(result.message);
        this.submitted = false
      }
    })

  }

  saveRiskFactor() {
    let node = $("#dataTable").DataTable().rows()
    $('.ui.grid .row').css('padding-top', '0');
    let int0305FormVoData = []
    let status
    for (let i = 0; i < node.nodes().length; i++) {
      if ($(node.nodes()[i]).find("input[type='checkbox']").is(":checked")) {
        status = "N"
      } else {
        status = "Y"
      }
      int0305FormVoData.push({
        "id": node.data()[i].iaRiskFactorsMaster.id,
        "budgetYear": node.data()[i].iaRiskFactorsMaster.budgetYear,
        "inspectionWork": node.data()[i].iaRiskFactorsMaster.inspectionWork,
        "status": status
      })

    }
    let int0305FormVoList = {
      "int0305FormVoList": int0305FormVoData
    }
    console.log("Data => ", int0305FormVoList);
    this.messageBar.comfirm(confirm => {
      if (confirm) {
        this.ajax.doPost(ULRS.ADD_RISK_FACTORS, int0305FormVoList).subscribe((result: any) => {
          if (MessageService.MSG.SUCCESS == result.status) {
            this.messageBar.successModal(result.message);
            this.goLocation()
          } else {
            this.messageBar.errorModal(result.message);
          }
        })
      }
    }, "ยืนยันการเพิ่มปัจจัยเสี่ยง")
  }

  goLocation() {
    this.router.navigate(["/int03/06"], {
      queryParams: {
        inspectionWork: this.inspectionWork.value,
        budgetYear: this.budgetYear
      }
    })
  }

  invalidSaveControl(control: string) {
    return this.saveForm.get(control).invalid && (this.saveForm.get(control).touched || this.submitted);
  }

  invalidDataControl(control: string) {
    return this.dataForm.get(control).invalid && (this.submitted);
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

  getQuestionnaireHdr(idHdr: number) {

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
  // qtnYear:any

  selectYear() {
    setTimeout(() => {
      $('.ui.fluid.dropdown.ai').dropdown().css('width', '100%');
      if (this.qtnYear) {
        this.ajax.doGet(`${URL.QTN_NAME}/${this.qtnYear}/status`).subscribe((result: ResponseData<Int020101NameVo[]>) => {
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

  cancel() {
    this.out.emit(this.riskId);
  }

  changeCondution(i) {
    console.log("iiiii : ", i);
    var datamurt = "conditionTo" + i;
    switch (this.datas[i].condition) {
      case "<=":
        $('#valueone' + i).prop("disabled", false);
        $('#valuetwo' + i).prop("disabled", false);
        // $('#conditionTo' + i).dropdown('set selected', "<");
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
        $('#valuetwo' + i).prop("disabled", false);
        // $(`.${datamurt}`).addClass("disabled");
        // $('#conditionTo' + i).dropdown('set selected', "N");
        break;
      case "<":
        $('#valueone' + i).prop("disabled", false);
        $('#valuetwo' + i).prop("disabled", false);
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
  viewdetail2() {
    this.dataForm.reset()
    $('#detail2').modal('show');
  }

  showModalAdd() {
    this.submitted = false
    this.isEdit = false
    console.log(this.ftl);
    if (this.ftl == null || this.ftl == '' || this.ftl == undefined) {
      this.ftl = 3
    }
    let data = {
      iaRiskFactorsConfig: {
        id: 0,
        idFactors: 0,
        mediumColor: null,
        factorsLevel: this.ftl
      },
      iaRiskFactorsMaster: {
        budgetYear: $('#budgetYear').val(this.budgetYear),
        id: 0,
        inspectionWork: this.inspectionWork.value,
        side: "",
      },
    }

    this.showModalEdit(data, false);
  }

  showModalEdit(data, edit: boolean = true) {
    this.isEdit = edit;
    $('#sideEditDtl').dropdown('clear')
    $('#riskUnit').dropdown('clear')
    $('#dataEvaluate').dropdown('clear')
    let sides: string[] = [];
    if (data.iaRiskFactorsMaster.side.search(",") != -1) {
      // found comma `,`
      sides = data.iaRiskFactorsMaster.side.split(",")
    } else {
      sides = [data.iaRiskFactorsMaster.side]
    }
    let dataStr: string[] = [];
    for (let i = 0; i < sides.length; i++) {
      for (let j = 0; j < this.sideList.length; j++) {
        if (this.sideList[j].value == sides[i]) {
          dataStr[i] = `${j}: '${sides[i]}'`
        }
      }
    }
    this.getFactorList(data.iaRiskFactorsMaster.id);
    this.dataselect = data;
    this.dataForm.patchValue({
      id: data.iaRiskFactorsConfig.id,
      riskFactorsMaster: data.iaRiskFactorsMaster.riskFactorsMaster,
      side: sides,
      riskUnit: this.dataselect.iaRiskFactorsConfig.riskUnit,
      inspectionWork: data.iaRiskFactorsMaster.inspectionWork,
      budgetYear: data.iaRiskFactorsMaster.budgetYear,
      infoUsedRiskDesc: this.dataselect.iaRiskFactorsConfig.infoUsedRiskDesc,
      riskIndicators: this.dataselect.iaRiskFactorsConfig.riskIndicators,
      idMaster: data.iaRiskFactorsMaster.id,
      dataEvaluate: data.iaRiskFactorsMaster.dataEvaluate,
    })
    console.log("this.dataselect", this.dataselect);

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
        $('.ui.fluid.dropdown.ai').dropdown().css('width', '100%');
      }, 400);
    } else {
      this.qtnEdit = false;
    }
    var chackvaluemodel = this.dataselect.iaRiskFactorsConfig.mediumColor;
    this.dataselecteditstring = this.dataselect.iaRiskFactorsConfig.infoUsedRiskDesc;
    this.factorsLevel = data.iaRiskFactorsConfig.factorsLevel;

    this.datas = [];
    let test = [];
    for (let i = 0; i < this.factorsLevel; i++) {
      this.datas.push(i);
      test.push(new Condition());
    }
    this.datas = test;

    if (this.factorsLevel == 3) {
      if (chackvaluemodel == null) {
        setTimeout(() => {
          $('#detail').modal({
            onShow: () => {
              setTimeout(() => {
                $('#sideEditDtl').dropdown('set selected', dataStr)
                $("#riskUnit").dropdown('set selected', `${this.dataselect.iaRiskFactorsConfig.riskUnit}`)
              }, 500);
            }
          }).modal('show');
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
          $('#detail').modal({
            onShow: () => {
              setTimeout(() => {
                $('#sideEditDtl').dropdown('set selected', dataStr)
                $("#riskUnit").dropdown('set selected', `${this.dataselect.iaRiskFactorsConfig.riskUnit}`)
                $("#dataEvaluate").dropdown('set selected', `${this.dataselect.iaRiskFactorsMaster.dataEvaluate}`)
              }, 500);
            }
          }).modal('show');
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
          $('#detail').modal({
            onShow: () => {
              setTimeout(() => {
                $('#sideEditDtl').dropdown('set selected', dataStr)
                $("#riskUnit").dropdown('set selected', `${this.dataselect.iaRiskFactorsConfig.riskUnit}`)
              }, 500);
            }
          }).modal('show');
          this.calendar();
          $("#dateCalendarFrom").calendar("set date", this.dataselect.iaRiskFactorsConfig.startDate);
          $("#dateCalendarTo").calendar("set date", this.dataselect.iaRiskFactorsConfig.endDate);
          $("#condition0").dropdown('set selected', "<");
          $("#condition1").dropdown('set selected', "<=");
          $("#condition2").dropdown('set selected', "<=");
          $("#condition3").dropdown('set selected', "<=");
          $("#condition4").dropdown('set selected', ">");
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
          $('#detail').modal({
            onShow: () => {
              setTimeout(() => {
                $('#sideEditDtl').dropdown('set selected', dataStr)
                $("#riskUnit").dropdown('set selected', `${this.dataselect.iaRiskFactorsConfig.riskUnit}`)
              }, 500);
            }
          }).modal('show');
          $("#dateCalendarFrom").calendar("set date", this.dataselect.iaRiskFactorsConfig.startDate);
          $("#dateCalendarTo").calendar("set date", this.dataselect.iaRiskFactorsConfig.endDate);
          $("#condition0").dropdown('set selected', this.dataselect.iaRiskFactorsConfig.verylowCondition);
          $("#condition1").dropdown('set selected', this.dataselect.iaRiskFactorsConfig.lowCondition);
          $("#condition2").dropdown('set selected', this.dataselect.iaRiskFactorsConfig.mediumCondition);
          $("#condition3").dropdown('set selected', this.dataselect.iaRiskFactorsConfig.highCondition);
          $("#condition4").dropdown('set selected', this.dataselect.iaRiskFactorsConfig.veryhighCondition);
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

  save() {
    console.log(
      this.dataForm.value
    );

  }


  saveCondition(e) {
    if (this.dataForm.value.side[0] == "") {
      this.dataForm.patchValue({
        side: null
      })
    }
    this.submitted = true
    if (this.dataForm.invalid) {
      return
    }
    console.log("Data saveCondition : ", this.dataselect);

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
      var url = "ia/int03/05/saveRiskFactorsConfig";
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
        this.messageBar.comfirm(confirm => {
          if (confirm) {
            this.ajax.doPost(url, {
              startDate: this.startDate,
              endDate: this.endDate,
              id: this.dataForm.get('id').value,
              riskFactorsMaster: this.dataForm.get('riskFactorsMaster').value,
              side: this.dataForm.value.side.toString(),
              riskUnit: this.dataForm.get('riskUnit').value,
              inspectionWork: this.inspectionWorkData,
              budgetYear: this.budgetYear,
              infoUsedRiskDesc: this.dataForm.get('infoUsedRiskDesc').value,
              riskIndicators: this.dataForm.get('riskIndicators').value,

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
                // this.messageBar.successModal(res.message)
                this.has.emit(true);
                this.out.emit(this.riskId);
                this.editFactos()
                this.getListMaster()
                this.submitted = false
              } else {
                this.messageBar.errorModal(res.message);
              }
            });
          }
        }, "ยืนยันการแก้ไขปัจจัยเสี่ยง")
      }
      else if (this.factorsLevel == 5) {
        this.messageBar.comfirm(confirm => {
          if (confirm) {
            this.ajax.doPost(url, {
              startDate: this.startDate,
              endDate: this.endDate,

              id: this.dataForm.get('id').value,
              riskFactorsMaster: this.dataForm.get('riskFactorsMaster').value,
              side: this.dataForm.value.side.toString(),
              riskUnit: this.dataForm.get('riskUnit').value,
              inspectionWork: this.inspectionWorkData,
              budgetYear: this.budgetYear,
              infoUsedRiskDesc: this.dataForm.get('infoUsedRiskDesc').value,
              riskIndicators: this.dataForm.get('riskIndicators').value,

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
                // this.messageBar.successModal(res.message)
                this.has.emit(true);
                this.out.emit(this.riskId);
                this.editFactos()
                this.getListMaster()
                this.submitted = false
              } else {
                this.messageBar.errorModal(res.message);
              }
            });
          }
        }, "ยืนยันการแก้ไขปัจจัยเสี่ยง")
      }
    }
  }

  saveCondition2(e) {
    console.log(this.dataForm.value);
    if (this.dataForm.value.side) {
      if (this.dataForm.value.side[0] == "") {
        this.dataForm.patchValue({
          side: null
        })
      }
    }
    this.submitted = true
    if (this.dataForm.invalid) {
      return
    }
    console.log("Data saveCondition : ", this.dataselect);

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
      var url = "ia/int03/05/saveAll";
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
          inspectionWork: this.inspectionWork.value,
          id: this.dataForm.get('id').value,
          riskFactorsMaster: this.dataForm.get('riskFactorsMaster').value,
          side: this.dataForm.value.side.toString(),
          riskUnit: this.dataForm.get('riskUnit').value,
          budgetYear: this.budgetYear,
          factorsLevel: this.ftl,
          dataEvaluate: this.dataForm.get('dataEvaluate').value,
          iaRiskFactorsConfig: {
            infoUsedRiskDesc: this.dataForm.get('infoUsedRiskDesc').value,
            riskIndicators: this.dataForm.get('riskIndicators').value,
            riskUnit: this.dataForm.get('riskUnit').value,
            id: idConfig,
            idFactors: this.dataselect.iaRiskFactorsConfig.idFactors,
            infoUsedRisk: this.qtnName,
            // infoUsedRiskDesc: this.dataselect.iaRiskFactorsConfig.infoUsedRiskDesc,
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
            // this.editFactos()
            this.getListMaster()
          } else {
            this.messageBar.errorModal(res.message);
          }
        });
      }
      else if (this.factorsLevel == 5) {
        this.ajax.doPost(url, {
          startDate: this.startDate,
          endDate: this.endDate,

          id: this.dataForm.get('id').value,
          riskFactorsMaster: this.dataForm.get('riskFactorsMaster').value,
          side: this.dataForm.value.side.toString(),
          riskUnit: this.dataForm.get('riskUnit').value,
          inspectionWork: this.inspectionWork.value,
          budgetYear: this.budgetYear,
          infoUsedRiskDesc: this.dataForm.get('infoUsedRiskDesc').value,
          riskIndicators: this.dataForm.get('riskIndicators').value,
          // inspectionWork:this.inspectionWorkData.value,
          factorsLevel: this.ftl,
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
            // this.editFactos()
            this.getListMaster()
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
}

class Condition {
  conditionId: any;
  parentId: any;
  condition: any = "<=";
  conditionTo: any;
  valueone: any;
  valuetwo: any;
  valueRl: any;
  convertValue: any;
  color: any;
  riskType: any = '';
  page: any;
}
