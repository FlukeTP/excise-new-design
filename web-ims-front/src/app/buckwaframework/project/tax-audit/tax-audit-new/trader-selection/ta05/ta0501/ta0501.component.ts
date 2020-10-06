import { Component, OnInit } from '@angular/core';
import { BreadCrumb, ResponseData } from 'models/index';
import { BreadcrumbContant } from 'projects/tax-audit/tax-audit-new/BreadcrumbContant';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AjaxService, MessageBarService, MessageService, AuthService } from 'services/index';
import { Router, ActivatedRoute } from '@angular/router';
import { TextDateTH, formatter, Utils } from 'helpers/index';
import { ObjMonth, RequestStartLength, TableShowDetail } from '../../table-custom/table-custom.model';
import * as moment from 'moment';
import { TaUtils } from 'projects/tax-audit/tax-audit-new/TaAuthorized';
import { TaxOperatorFormVo } from './ta0501.model';
declare var $: any;

@Component({
  selector: 'app-ta0501',
  templateUrl: './ta0501.component.html',
  styleUrls: ['./ta0501.component.css']
})
export class Ta0501Component implements OnInit {
  b: BreadcrumbContant = new BreadcrumbContant();
  breadcrumb: BreadCrumb[] = [
    { label: this.b.b00.label, route: this.b.b00.route },
    { label: this.b.b01.label, route: this.b.b01.route },
    { label: this.b.b07.label, route: this.b.b07.route }
  ];

  loading: boolean = false;
  menuhide: boolean = false;
  showButton: boolean = false;
  formSearch: FormGroup;
  regStatusList: any[];
  recordTotal: number;
  pageLenght: number = 10;
  paginationTotal: number;
  objMonth: ObjMonth = new ObjMonth();
  datas: any = [];
  start: number = 0;
  length: number = 10;
  formVo: TaxOperatorFormVo;
  draftNumber: string;
  budgetYear: string;
  officeCode: string;
  budgetYearNumber: number;
  budgetYearList: any[] = [];
  tableDetail: TableShowDetail = new TableShowDetail();
  texStartDateMax:Date ;
  texEndDateMax:Date;
  texDateStart:Date;
  texDateEnd:Date;
  diffMonth:Number = 11;
  sector:string;
  area:string;
  areas:any[];
  sectors:any[];
  flagSearch:boolean = false;

  constructor(
    private ajax: AjaxService,
    private formBuilder: FormBuilder,
    private messageBar: MessageBarService,
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthService,
  ) { }

  ngOnInit() {
    this.formSearch = this.formBuilder.group({
      regStatus: [[]],
      texFormDate:[''],
      texToDate:[''],
      texFormDateCompare:[''],
      texToDateCompare:[''],
      sector:[''],
      area:[''],
      regDateStart:[''],
      regDateEnd:[''],
      incomeType:['']
    });
    this.getSector();
    this.getRegStatus();
    this.getBudgetYearList();
    this.objMonth = this.getMonthStart();
    // search data by formVo
    this.formVo = this.setForm();
    
    // this.getOperatorDraft(this.formVo);
    this.objMonth  = this.getMonthStart();
  }

  ngAfterViewInit(): void {
    this.formSearch.get("incomeType").patchValue("TAX");
    $("#sector").dropdown('set selected', 0).css('min-width', '3em');
    $("#area").dropdown('set selected', 0).css('min-width', '3em');
    $("#regStatus").dropdown('set selected', 0).css('min-width', '3em');
    this.calendar();
    // console.log("officeCode ",this.auth.getUserDetails().officeCode)
    let offCode = this.auth.getUserDetails().officeCode
    if (TaUtils.isCentral(offCode)) {
      // ส่วนกลาง
    } else if (TaUtils.isSector(offCode)) {
      // ภาค
      this.formSearch.get("sector").patchValue(offCode);
      this.getArea(offCode);
    } else if (TaUtils.isArea(offCode)) {
      // พื้นที่
      let sector = offCode.substring(0, 2)+"0000";
      this.formSearch.get("sector").patchValue(sector);
      this.getArea(sector);
      this.formSearch.get("area").patchValue(offCode);
    }
  }


  pageChangeOutput(req: RequestStartLength) {
    //console.log("pageChangeOutput : ", req);
    // this.loading = true;
    this.pageLenght = req.length;
    this.start = req.start;
    this.length = req.length;
    this.formVo = this.setForm();
    this.getOperatorDraft(this.formVo);

  }

  detailClick() {
    console.log("detailClick")
    if (this.tableDetail.show == false) {
      setTimeout(() => {
        let pos = $('#parent').scrollLeft() + 1570;
        $('#parent').scrollLeft(pos);
      }, 100);
      this.tableDetail = {
        color: 'grey',
        show: true
      }
    } else {
      setTimeout(() => {
        let pos = $('#parent').scrollLeft() - 2000;
        $('#parent').scrollLeft(pos);
      }, 100);
      this.tableDetail = {
        color: 'gray',
        show: false
      }
    }

    this.objMonth.showDetail = this.tableDetail.show;
    // this.serach();

  }

  calendar() {
    $("#dateFromCalendar").calendar({
      endCalendar: $('#dateToCalendar'),
      type: "date",
      text: TextDateTH,
      formatter: formatter('day-month-year'),
      onChange: (date, text) => {

        // this.startDate = text;
        this.formSearch.get('regDateStart').patchValue(date);
      }
    });
    $("#dateToCalendar").calendar({
      startCalendar: $('#dateFromCalendar'),
      type: "date",
      text: TextDateTH,
      formatter: formatter('day-month-year'),
      // minDate: this.startDate,
      onChange: (date, text) => {
        // this.startDate = text;
        this.formSearch.get('regDateEnd').patchValue(date);
      }
    });

    $("#monthYearFromCalendar").calendar({
      // endCalendar: $('#monthYearToCalendar'),
      type: "month",
      text: TextDateTH,
      formatter: formatter('month-year'),
      onChange: (date, text) => {
        this.formSearch.get('texFormDate').patchValue(text);

        // diff month
        let compMonthNum = 11;
        if ( this.texDateEnd != null ){
          compMonthNum =  moment( this.texDateEnd).diff(moment(date), 'months', true);
          this.diffMonth = Number(compMonthNum);
          // console.log("diff month" ,compMonthNum);
        }


        let compareYearStart = moment(date).add(543, "y").add(-12, 'month');
        this.formSearch.get('texFormDateCompare').patchValue(compareYearStart.format("MM/YYYY"));

        this.texEndDateMax = moment(date).add(compMonthNum, "month").toDate();

        this.texDateStart = date;

        // call compareYearEnd
        // let calendarAnalysisEnd = moment(date).add(543, 'y').add(compMonthNum-1, "month");
        let compareYearEnd = moment(date).add(543, "y").add(-12, 'month').add(compMonthNum, 'month');
        // this.formSearch.get('texToDate').patchValue(calendarAnalysisEnd.format('MM/YYYY'));
        this.formSearch.get('texToDateCompare').patchValue(compareYearEnd.format('MM/YYYY'));

        $('#monthYearToCalendar').calendar('setting', 'maxDate', this.texEndDateMax);
        $('#monthYearToCalendar').calendar('refresh');
      }
    });
    $("#monthYearToCalendar").calendar({
      // startCalendar: $('#monthYearFromCalendar'),
      type: "month",
      text: TextDateTH,
      formatter: formatter('month-year'),
      // minDate: this.startDate,
      onChange: (date, text) => {
        this.formSearch.get('texToDate').patchValue(text);


        // check diff month 
        let compMonthNum = 11;
        if (this.texDateStart  != null ){
          compMonthNum =  moment(date).diff(moment(this.texDateStart), 'months', true);
          // console.log("diff month" ,compMonthNum);
          this.diffMonth = Number(compMonthNum);
        }


        let compareYearEnd = moment(date).add(543, "y").add(-12, 'month');
        this.formSearch.get('texToDateCompare').patchValue(compareYearEnd.format("MM/YYYY"));

        this.texDateEnd = date;

        this.texStartDateMax= moment(date).add(-12, 'month').toDate();


        // let calendarAnalysisStart = moment(date).add(543, 'y').add(-compMonthNum+1, 'month');
        let compareYearStart = moment(date).add(543, "y").add(-12, 'month').add(-compMonthNum, 'month');
        // this.formSearch.get('texFormDate').patchValue(calendarAnalysisStart.format('MM/YYYY'));
        this.formSearch.get('texFormDateCompare').patchValue(compareYearStart.format('MM/YYYY'));

        // set mindate
        $('#monthYearFromCalendar').calendar('setting', 'minDate', this.texStartDateMax);
        $('#monthYearFromCalendar').calendar('refresh');
      }
    });
  }

  getRegStatus() {
    const URL = "ta/tax-audit/get-reg-status";
    this.ajax.doGet(URL).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.regStatusList = res.data;
      } else {
        this.messageBar.errorModal(res.message);
      }
    })
  }

  onSerach(){
    this.flagSearch = true;
    let sector = this.formSearch.get("sector").value;
    let area = this.formSearch.get("area").value;
    if (area != "" && area != "0") {
      this.officeCode = area;
    } else if (sector != "" && sector != "0") {
      this.officeCode = sector;
    }

    this.formVo = this.setForm();
    console.log("form serch draft ", this.formVo)
    this.getOperatorDraft( this.formVo);
    this.objMonth  = this.setMonthStart();
  }

  onClear(){
    this.flagSearch = false;
    this.formSearch.reset();
    $("#sector").dropdown('clear');
    $("#area").dropdown('clear');
    $("#regStatus").dropdown('clear');
    this.formSearch.get('incomeType').patchValue("TAX");
  }
  

  getSector() {
    this.ajax.doPost("ta/tax-operator/sector-list", {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.sectors = res.data;
      } else {
        //this.messageBar.errorModal(res.message);
        console.log("getSector Error !!");
      }
    })
  }

  getArea(officeCode) {
    this.ajax.doPost("preferences/department/area-list/" + officeCode, {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.areas = res.data;
      } else {
        //   this.messageBar.errorModal(res.message);
        console.log("getArea Error !!");
      }
    })
  }

  getTaxDepartment() {
    const URL = "preferences/department/dept/central-ta";
    this.ajax.doPost(URL, {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.areas = res.data;
      }
    })
  }

  onChangeSector(e: any) {
    this.areas = [];
    if ("0" != e.target.value && "" != e.target.value){
      if( TaUtils.isCentral(e.target.value)){
        this.getTaxDepartment();
      }else{
        this.getArea(e.target.value);
      }
    }
  }


  getOperatorDraft = (formvo: TaxOperatorFormVo): any => {
    this.loading = true;
    this.ajax.doPost("ta/tax-operator2/preview-data", formvo).subscribe((res: any) => {
      if (MessageService.MSG.SUCCESS == res.status) {


        res.data.datas.forEach(element => {
          element.sumTaxAmtG1 = Utils.moneyFormatDecimal(element.sumTaxAmtG1);
          element.sumTaxAmtG2 = Utils.moneyFormatDecimal(element.sumTaxAmtG2);
          element.taxAmtChnPnt = Utils.moneyFormatDecimal(element.taxAmtChnPnt);
          element.taxAmtChnPnt = Utils.moneyFormatDecimal(element.taxAmtChnPnt);
          element.taxAmtSd = element.taxAmtSd == null ? "-" : Utils.moneyFormatDecimal(element.taxAmtSd);
          element.taxAmtMaxPnt = element.taxAmtMaxPnt == null ? "-" : Utils.moneyFormatDecimal(element.taxAmtMaxPnt);
          element.taxAmtMean = element.taxAmtMean == null ? "-" : Utils.moneyFormatDecimal(element.taxAmtMean);
          element.taxAmtMinPnt = element.taxAmtMinPnt == null ? "-" : Utils.moneyFormatDecimal(element.taxAmtMinPnt);
          element.regCapital = element.regCapital == null ? "-" : Utils.moneyFormatDecimal(element.regCapital);
          for (let i = 0; i < element.taxAmtList.length; i++) {
            if ("-" != element.taxAmtList[i]) {
              element.taxAmtList[i] = Utils.moneyFormatDecimal((+element.taxAmtList[i]));
            }
          }
        });
        //console.log("res getOperator : ", res.data.datas);
        this.datas = res.data.datas;
        this.recordTotal = res.data.count;
        // this.objMonth = this.getMonthStart();
        // this.objMonth  = this.setMonthStart();
      } else {
        this.messageBar.errorModal(res.message);
        console.log("error getOperator  :", res.message);
      }
      this.loading = false;
    })
  }

  getBudgetYearList() {
    this.ajax.doGet('ta/tax-operator/budgetYearList').subscribe((res: ResponseData<string[]>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        console.log('getBudgetYearList res.data', res.data)
        this.budgetYearList = res.data;

        if (this.budgetYearList.length != 0) {

          if (this.budgetYear != null && this.budgetYear != "" && this.budgetYear != undefined) {
            // this.formSearch.get('budgetYear').patchValue(this.budgetYear);
          } else {
            // this.formSearch.get('budgetYear').patchValue(this.budgetYearList[0]);

            // cal budgetyear at datatable 
            this.budgetYearNumber = Number(this.budgetYearList[0]);
          }

          // $("#budgetYear").dropdown('set selected', this.formSearch.get('budgetYear').value)
        } else {
          this.budgetYearList = [];
        }
      } else {
        console.log("Error getBudgetYearList !!");
      }
    });
  }

  getMonthStart()  {
    let now = new Date();
    let start  = moment(now).add(543, "y").format("MM/YYYY").toString();
    let end = moment(now).add(543, "y").add(11, 'month').format("MM/YYYY").toString();
    let startCompare = moment(now).add(543, "y").add(-11, 'month').add(11, 'month').format("MM/YYYY").toString();
    let endCompare = moment(now).add(543, "y").add(-11, 'month').add(-1, 'month').format("MM/YYYY").toString();

    console.log("get month start ", start," : ",end," : ",startCompare," : ",endCompare);
    return   {
      condSubCapitalFlag: null,
      condSubNoAuditFlag: null,
      condSubRiskFlag: null,
      countGroup: 2,
      isDisabled: true,
      monthStart: 10,
      monthTotal: 24,
      worksheetStatus: "D",
      yearCondSubNoAudit: "3",
      // yearMonthEnd: "08/2561",
      // yearMonthEndCompare: "08/2560",
      // yearMonthStart: "10/2560",
      // yearMonthStartCompare: "10/2559",
      yearMonthEnd: end,
      yearMonthEndCompare: endCompare,
      yearMonthStart: start,
      yearMonthStartCompare: startCompare,
      condNumber:'',
      showCondFlag:'Y',
      showDetail:false
    }
  }

  
  setMonthStart()  {
    let start =  this.formSearch.get("texFormDate").value.split("/");

    return   {
      condSubCapitalFlag: null,
      condSubNoAuditFlag: null,
      condSubRiskFlag: null,
      countGroup: 2,
      isDisabled: true,
      monthStart: Number(start[0]),
      monthTotal:  (Number(this.diffMonth)+1)*2,
      worksheetStatus: "D",
      yearCondSubNoAudit: "3",
      yearMonthEnd: this.formSearch.get("texToDate").value,
      yearMonthEndCompare: this.formSearch.get("texToDateCompare").value,
      yearMonthStart: this.formSearch.get("texFormDate").value,
      yearMonthStartCompare: this.formSearch.get("texFormDateCompare").value,
      condNumber:'',
      showCondFlag:'Y',
      showDetail:false
    }
  }
  calculateDateCompare() {

    console.log('calculateDateCompare this.objMonth', this.objMonth);

    let start = this.objMonth.yearMonthStart.split("/");
    let end = this.objMonth.yearMonthEnd.split("/");

    // let start = '10/2560'.split("/");
    // let end = '08/2561'.split("/");
    let _dateStart = moment(start[0] + "-01-" + (Number(start[1]) - 543).toString(), "MM-DD-YYYY");
    let _dateEnd = moment(end[0] + "-01-" + (Number(end[1]) - 543).toString(), "MM-DD-YYYY");

    if (this.objMonth.monthTotal < 24) {

      let _addDateStrStart = moment(_dateStart).add(-1, 'year').format("YYYY-MM-DD")
      let _addDateStrEnd = moment(_dateEnd).add(-1, 'year').format("YYYY-MM-DD")

      let s = _addDateStrStart.split("-");
      let e = _addDateStrEnd.split("-");

      this.objMonth.yearMonthStartCompare = s[1] + "/" + (Number(s[0]) + 543).toString();
      this.objMonth.yearMonthEndCompare = e[1] + "/" + (Number(e[0]) + 543).toString();
    } else {

      let _addDateStrStart = moment(_dateStart).add(1, 'month').format("YYYY-MM-DD")
      let _addDateStrEnd = moment(_dateEnd).add(this.objMonth.monthTotal - 1, 'month').format("YYYY-MM-DD")

      let s = _addDateStrStart.split("-");
      let e = _addDateStrEnd.split("-");

      this.objMonth.yearMonthStartCompare = s[1] + "/" + (Number(s[0]) + 543).toString();
      this.objMonth.yearMonthEndCompare = e[1] + "/" + (Number(e[0]) + 543).toString();

    }

    console.log('calculateDateCompare', this.objMonth)
  }

  get isCentral() {
    return TaUtils.isCentral(this.auth.getUserDetails().officeCode);
  }

  get isSector() {
    return TaUtils.isSector(this.auth.getUserDetails().officeCode);
  }

  get isArea() {
    return TaUtils.isArea(this.auth.getUserDetails().officeCode);
  }

  setForm() {
    return {
      start: this.start,
      length: this.length,
      // dateRange: this.objMonth.monthTotal,
      // dateStart: this.objMonth.yearMonthStart,
      // dateEnd: this.objMonth.yearMonthEnd,
      dateEnd: this.formSearch.get("texToDate").value,
      dateRange: (Number(this.diffMonth)+1)*2,
      dateStart: this.formSearch.get("texFormDate").value,
      draftNumber: this.draftNumber,
      // budgetYear: this.budgetYear,
      budgetYear: "2562",
      dutyCode: "",
      facType: "",
      sector: "",
      area: "",
      // dutyCode: this.formSearch.get("dutyCode").value == '0' ? this.formSearch.get("dutyCode").patchValue('') : this.formSearch.get("dutyCode").value,
      // facType: this.formSearch.get("facType").value == '0' ? this.formSearch.get("facType").patchValue('') : this.formSearch.get("facType").value,
      // sector: this.formSearch.get("sector").value == '0' ? this.formSearch.get("sector").patchValue('') : this.formSearch.get("sector").value,
      // area: this.formSearch.get("area").value == '0' ? this.formSearch.get("area").patchValue('') : this.formSearch.get("area").value,
      officeCode: this.officeCode,
      condNumber: "",
      newRegId: "",
      sumTaxAmStart: 0,
      sumTaxAmEnd: 0,
      cuscatId: "",
      skipCond: "Y",
      regStatus:this.formSearch.get("regStatus").value,
      regDateStart:this.formSearch.get("regDateStart").value,
      regDateEnd:this.formSearch.get("regDateEnd").value,
      incomeType:this.formSearch.get("incomeType").value
      // newRegId: this.formSearch.get('newRegId').value,
      // sumTaxAmStart: this.formSearch.get('sumTaxAmStart').value != null && this.formSearch.get('sumTaxAmStart').value != '' ? Number(this.formSearch.get('sumTaxAmStart').value.replace(/\,/g, '')) : null,
      // sumTaxAmEnd: this.formSearch.get('sumTaxAmEnd').value != null && this.formSearch.get('sumTaxAmEnd').value != '' ? Number(this.formSearch.get('sumTaxAmEnd').value.replace(/\,/g, '')) : null,
      // cuscatId: this.formSearch.get('cuscatId').value


    }
  }


}
