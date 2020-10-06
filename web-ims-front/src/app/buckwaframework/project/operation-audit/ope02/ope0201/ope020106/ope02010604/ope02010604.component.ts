import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { formatter, TextDateTH, DecimalFormat } from 'helpers/index';
import { ResponseData, NFDirective } from 'models/index';
import * as moment from 'moment';
import { Ope020703Vo } from 'projects/operation-audit/ope02/ope0207/ope020703/ope020703vo.model';
import { AjaxService, MessageBarService, MessageService } from 'services/index';
import { Ope020106ButtonVo, Ope020106Vo } from '../ope020106vo.model';
import { Ope02010604CompareVo, Ope02010604SummaryVo, Ope02010604Vo } from './ope02010604Vo.model';
import { DecimalFormatPipe } from 'app/buckwaframework/common/pipes/decimal-format.pipe';

declare var $: any;

const URL = {
  GET_FIND: "oa/02/03/01/01/find/customerLicense",
  GET_DETAILS: "oa/02/01/06/04/detail",
  PUT_UPDATE: "oa/02/01/06/04/save",
  GET_BUTTONS: "oa/02/01/06/detail",
  GET_FIND_CUSTOMER: "oa/02/01/06/customers",
}

@Component({
  selector: 'app-ope02010604',
  templateUrl: './ope02010604.component.html',
  styleUrls: ['./ope02010604.component.css']
})
export class Ope02010604Component implements OnInit {
  lubrID: string;
  id: string;
  add: number;
  obj: ope;
  beans: Bean[];
  from: FormGroup;
  diffMonth: number;
  currentDT = new Date();
  lubCompireFormArr: FormArray = new FormArray([]);
  formCompare: FormGroup = new FormGroup({});
  formSummaryArray: FormArray = new FormArray([]);
  fromSummaryMonth: FormArray = new FormArray([]);
  fromSummaryMonthArr: FormArray = new FormArray([]);

  fromMonth: FormArray = new FormArray([]);
  deletes: FormArray = new FormArray([]);
  monthArray: any[] = [];

  submitted: boolean = false;

  fromData: Ope02010604Vo = null;
  changeCalendar: boolean = false;
  setCalendar: boolean = false;
  buttons: Ope020106ButtonVo = null;
  data: Ope020703Vo = null;
  loading: boolean = false;

  df = new DecimalFormat('###,###.00');
  summaryMonthArray: any[] = [];
  formSummaryMonthArray:FormArray = new FormArray([]);

  constructor(private fb: FormBuilder, private ajax: AjaxService, private route: ActivatedRoute, private msg: MessageBarService) {
    this.add = 0;
    this.obj = new ope();
    this.beans = [new Bean()];

    this.formCompare = this.fb.group({
      lubCompireFormArr: this.fb.array([]),
      formSummaryArray: this.fb.array([]),
      formSummaryMonthArray:this.fb.array([]),
      result: ['', Validators.required]
    });
    // this.addLubFormArr();
    // this.addSummaryFormArr();
  }

  ngOnInit() {
    this.lubrID = this.route.snapshot.queryParams["oaLubricantsDtlId"] || "";
    this.id = this.route.snapshot.queryParams["id"] || "";
    this.fromData = {
      oaLubricantsDtlId: 0,
      oaLubricantsId: 0,
      listLubricantsCompare: [],
      listOaLubricantsSummary: [],
      result: ""
    }
    // this.calendar();
    this.from = new FormGroup({
      dateFrom: new FormControl(null, Validators.required),
      dateto: new FormControl(null, Validators.required)
    });

    this.diffMonth = 3;
    // this.pushMonthArray( Number(moment(this.currentDT).month()-1),Number(moment(this.currentDT).month()+1))
    // this.pushMonthArray(moment(new Date()).subtract(1, 'months').endOf('month').toDate(), 3);
    this.getLubricantsDetail();

  }

  ngAfterViewInit(): void {
    this.calendar();
    this.getButtonId();
  }

  calendar() {
    let dateFrom = moment(new Date()).subtract(1, 'months').endOf('month').toDate();
    let dateTo = moment(new Date()).add(1, 'months').endOf('month').toDate();

    $("#startCld").calendar({
      endCalendar: $('#endCld'),
      type: "month",
      text: TextDateTH,
      formatter: formatter("ด"),
      onChange: (date, text) => {
        this.from.get('dateFrom').patchValue(date);
      }
    }).calendar("set date", dateFrom);

    $("#endCld").calendar({
      startCalendar: $('#startCld'),
      type: "month",
      text: TextDateTH,
      formatter: formatter("ด"),
      onChange: (date, text) => {
        this.from.get('dateto').patchValue(date);
        if (this.setCalendar) {
          this.calculateMonth(date);
        }
      }
    }).calendar("set date", dateTo);
  }
  getButtonId() {
    // this.loading = true;
    this.ajax.doGet(`${URL.GET_BUTTONS}/${this.id}`).subscribe((response: ResponseData<Ope020106ButtonVo>) => {
      if (MessageService.MSG.SUCCESS == response.status) {
        this.buttons = response.data;
        // this.loading = false;
      } else {
        this.msg.errorModal(response.message);
        // this.loading = false;
      }
    })
  }

  getLubricantsDetail() {
    this.loading = true;
    this.ajax.doGet(`${URL.GET_DETAILS}/${this.lubrID}`).subscribe((response: ResponseData<Ope02010604Vo>) => {
      if (MessageService.MSG.SUCCESS == response.status) {
        // this.fromData = response.data;
        var listCompare: Ope02010604CompareVo[] = response.data.listLubricantsCompare;
        var listSummary: Ope02010604SummaryVo[] = response.data.listOaLubricantsSummary;
        this.calucateMonthYear(listSummary);


        if (listCompare != null) {
          this.formCompare.patchValue({
            result: response.data.result
          });
          this.lubCompireFormArr = this.formCompare.get('lubCompireFormArr') as FormArray;
          listCompare.forEach(element => {
            this.lubCompireFormArr.push(this.fb.group({
              oaLubCompareId: Number(this.lubrID),
              name: element.name,
              compire1: this.df.format(element.auditStock),
              compire2:  this.df.format(element.sumaryStock),
              overRate:  this.df.format(element.overRate),
              remark: element.remark,

            }));
          });
        } else {
          this.addLubFormArr();
        }


        if (listSummary != null) {
          let j = 0;
          let totalMonth = this.diffMonth;
          this.formSummaryArray = this.formCompare.get('formSummaryArray') as FormArray;
          for (let index = 0; index < (listSummary.length / totalMonth); index++) {
            this.formSummaryArray.push(this.fb.group({
              name: listSummary[j].lubName,
              fromSummaryMonthArr: this.fb.array([]),

            }));
            this.fromSummaryMonthArr = new FormArray([]);
            this.monthArray.forEach(element => {
              let fromSummary
              if (index > 0) {
                fromSummary = this.formSummaryArray.controls[index];
              } else {
                fromSummary = this.formSummaryArray.controls[0];
              }

              this.fromSummaryMonthArr = fromSummary.get('fromSummaryMonthArr') as FormArray;
              this.fromSummaryMonthArr.push(this.fb.group({
                oaLubSumaryId: listSummary[j].oaLubSumaryId,
                oaLubricantsId: Number(this.lubrID),
                stockLatsMonth: this.df.format(listSummary[j].stockLatsMonth),
                sending: this.df.format(listSummary[j].sending),
                receive: this.df.format(listSummary[j].receive),
                stock: this.df.format(listSummary[j].stock),
              }));
              this.summaryMonthArray.push(listSummary[j].stockLatsMonth);
              this.summaryMonthArray.push(listSummary[j].stock);
              this.summaryMonthArray.push(listSummary[j].sending);
              this.summaryMonthArray.push(listSummary[j].receive);
              j++;

            });
          }

          this.formSummaryMonthArray = this.formCompare.get('formSummaryMonthArray') as FormArray;
          for (let index = 0; index < totalMonth; index++) {
            
          }

          this.loading = false;
        } else {
          this.loading = false;
          this.changeCalendar = true;
          this.addSummaryFormArr();
          this.pushMonthArray(moment(new Date()).subtract(1, 'months').endOf('month').toDate(), 3);
        }
        // this.changeCalendar = true;
      } else {
        this.loading = false;

      }
      this.changeCalendar = true;
    });
  }

  onDelField = index => {
    // this.beans.splice(index, 1); 
    this.lubCompireFormArr = this.formCompare.get('lubCompireFormArr') as FormArray;
    this.lubCompireFormArr.removeAt(index);
  };

  onDelSummary = index => {
    this.formSummaryArray = this.formCompare.get('formSummaryArray') as FormArray;
    this.formSummaryArray.removeAt(index);
  }

  onAddField = () => {
    this.addLubFormArr();
    // this.beans.push(new Bean());
    this.add++;
    if (this.add >= 1) {
    }
  };

  onAddSummary = () => {
    this.addSummaryFormArrAtIndex();
  }

  addLubFormArr() {
    this.lubCompireFormArr = this.formCompare.get('lubCompireFormArr') as FormArray;
    this.lubCompireFormArr.push(this.fb.group({
      name: new FormControl(null, Validators.required),
      compire1: new FormControl(null, Validators.required),
      compire2: new FormControl(null, Validators.required),
      overRate: new FormControl(null, Validators.required),
      remark: new FormControl(null, Validators.required),
    }));
  }

  addSummaryFormArr() {

    // const fromSummaryMonth =
    this.formSummaryArray = this.formCompare.get('formSummaryArray') as FormArray;
    this.formSummaryArray.push(this.fb.group({
      name: ['', Validators.required],
      fromSummaryMonthArr: this.fb.array([]),

    }));
    this.fromSummaryMonthArr = new FormArray([]);
    this.monthArray.forEach(element => {
      this.addSummaryMonth();
    });


    // console.log("formsummarymonth",this.formSummaryArray)
  }

  addSummaryFormArrAtIndex() {
    this.formSummaryArray = this.formCompare.get('formSummaryArray') as FormArray;
    this.formSummaryArray.push(this.fb.group({
      name: ['', Validators.required],
      fromSummaryMonthArr: this.fb.array([]),

    }));
    this.monthArray.forEach(element => {
      this.addSummaryMonthIndex(this.formSummaryArray.length)
    });


  }

  addSummaryMonth() {
    this.formSummaryArray.controls.forEach(from => {
      // let summaryMonth = from.get('fromSummaryMonth') as FormArray;
      this.fromSummaryMonthArr = from.get('fromSummaryMonthArr') as FormArray;
      this.fromSummaryMonthArr.push(this.fb.group({
        stockLatsMonth: new FormControl(null, Validators.required),
        sending: new FormControl(null, Validators.required),
        receive: new FormControl(null, Validators.required),
        stock: new FormControl(null, Validators.required),
      }));
    });
  }

  addSummaryMonthIndex(index: number) {
    let fromSummary = this.formSummaryArray.controls[index - 1];
    this.fromSummaryMonthArr = fromSummary.get('fromSummaryMonthArr') as FormArray;
    this.fromSummaryMonthArr.push(this.fb.group({
      stockLatsMonth: new FormControl(null, Validators.required),
      sending: new FormControl(null, Validators.required),
      receive: new FormControl(null, Validators.required),
      stock: new FormControl(null, Validators.required),
    }));
  }


  addSummaryFrom() {

  }

  calculateMonth(date) {

    // this.monthArray =[];
    let start = new Date(this.from.value.dateFrom);
    let end = new Date(date);
    // this.diffMonth = end.getMonth() - start.getMonth();
    let diff: number = 0;
    diff = Number((moment(end).diff(moment(start), 'months', true) + 1).toPrecision(3));

    if (diff >= 0) {
      if (diff < 5) {
        this.msg.comfirm((isOk) => {
          if (isOk) {
            this.diffMonth = diff;
            let indexstart: number = Number(moment(start).month());
            let indexend: number = Number(moment(end).month());
            // this.pushMonthArray(indexstart,indexend);
            this.pushMonthArray(start, diff);
          } else {

            // setTimeout(() => {
            //   $('#endCld').calendar('set date', moment(date).toDate());
            //   this.setCalendar = true;
            // }, 200);

          }
        }, "ท่านต้องการเปลี่ยนแปลงข้อมูลหรือไม่");
      } else {
        this.msg.errorModal("ไม่สามารถดำเนินการเกิน 5 เดือน")
      }

    } else {
      this.diffMonth = 0;
    }
  }

  calucateMonthYear(listSummary: Ope02010604SummaryVo[]) {
    if (listSummary != null) {
      if (listSummary.length > 0) {
        let startMonth = listSummary[0].month;
        let startYear = listSummary[0].year;
        let endMonth = listSummary[listSummary.length - 1].month;
        let endYear = listSummary[listSummary.length - 1].year;
        let startDate = moment(startYear + "-" + startMonth + "-01");
        let endDate = moment(endYear + "-" + endMonth + "-01");
        let diff = Number((moment(endDate).diff(moment(startDate), 'months', true) + 1).toPrecision(3));
        this.pushMonthArray(moment(startDate).toDate(), diff);
        this.diffMonth = diff;

        setTimeout(() => {
          const dateS = startDate;
          $('#startCld').calendar('set date', moment(dateS).toDate());
          const dateE = endDate;
          $('#endCld').calendar('set date', moment(dateE).toDate());
          this.setCalendar = true;
        }, 200);

      } else {
        let start = new Date(this.from.value.dateFrom);
        this.pushMonthArray(moment(start).subtract(1, 'months').endOf('month').toDate(), 3);
      }
    } else {

    }

  }

  // pushMonthArray(start:number,end:number){
  pushMonthArray(start: Date, diff: number) {
    this.monthArray = [];
    // for (let index = start; index <= end; index++) {
    //     this.monthArray.push(TextDateTH.months[index]);
    // }
    for (let index = 0; index < diff; index++) {
      let monthYear = moment(start).add(index, 'months').endOf('month').toDate();
      let month = monthYear.getMonth();
      this.monthArray.push(TextDateTH.months[month]);
    }
    this.summaryMonthArray = [];

    while (this.formSummaryArray.length !== 0) {
      this.formSummaryArray.removeAt(0)
    }

    if (this.changeCalendar) {
      this.addSummaryFormArr();
    }

    // console.log("monthArray",this.monthArray)
  }
  submitForm() {
    var listLubricantsCompare: Ope02010604CompareVo[] = [];
    var listOaLubricantsSummary: Ope02010604SummaryVo[] = [];
    this.submitted = true;
    // let summaryVo:Ope02010604SummaryVo = this.initOpe();
    // let compareVo:Ope02010604CompareVo = this.initOpeCompare();
    if (this.formCompare.valid) {

      let index = 0;
      let formCompare = this.formCompare.get('lubCompireFormArr') as FormArray;
      formCompare.controls.forEach(element => {
        let compareVo: Ope02010604CompareVo = this.initOpeCompare();
        compareVo.oaLubricantsId = Number(this.lubrID);
        compareVo.oaLubCompareId = element.value.oaLubCompareId;
        compareVo.remark = element.value.remark;
        compareVo.name = element.value.name;
        compareVo.overRate = parseFloat(element.value.overRate.toString().replace(/,/g, ''));
        compareVo.seq = index;
        compareVo.sumaryStock =  parseFloat(element.value.compire1.toString().replace(/,/g, ''));
        compareVo.auditStock = parseFloat(element.value.compire2.toString().replace(/,/g, ''));
        compareVo.sumaryDate = this.currentDT;
        compareVo.auditDate = this.currentDT;
        listLubricantsCompare.push(compareVo);
        index++;
      });

      let start = new Date(this.from.value.dateFrom);

      index = 0;
      let fromCompare = this.formCompare.get('formSummaryArray') as FormArray;
      fromCompare.controls.forEach(element => {
        // let summaryVo:Ope02010604SummaryVo = this.initOpe();
        let formSummaryArr = element.get('fromSummaryMonthArr') as FormArray;

        let j = 0;
        formSummaryArr.controls.forEach(element2 => {

          let summaryVo = this.initOpe();
          summaryVo.lubName = element.value.name;
          summaryVo.seq = index;
          let date = moment(start).add(j, 'months').endOf('month').toDate();
          let month: string = Number(date.getMonth() + 1).toString();
          let year: string = date.getFullYear().toString();
          summaryVo.oaLubricantsId = Number(this.lubrID);
          summaryVo.oaLubSumaryId = element2.value.oaLubSumaryId;
          summaryVo.month = month;
          summaryVo.year = year;
          summaryVo.receive =  parseFloat(element2.value.receive.toString().replace(/,/g, ''));
          summaryVo.sending = parseFloat(element2.value.sending.toString().replace(/,/g, ''));
          summaryVo.stockLatsMonth = parseFloat(element2.value.stockLatsMonth.toString().replace(/,/g, ''));
          summaryVo.stock = parseFloat(element2.value.stock.toString().replace(/,/g, ''));
          listOaLubricantsSummary.push(summaryVo);
          j++;
        });
        index++;

      });

      this.fromData.listOaLubricantsSummary = listOaLubricantsSummary;
      this.fromData.listLubricantsCompare = listLubricantsCompare;
      this.fromData.result = this.formCompare.value.result;

      this.ajax.doPut(`${URL.PUT_UPDATE}/${this.lubrID}`, this.fromData).subscribe((response: ResponseData<Ope020106Vo>) => {
        if (MessageService.MSG.SUCCESS == response.status) {
          this.msg.successModal(response.message);
        } else {
          this.msg.errorModal(response.message);
        }
      });
    }


  }

  nfDirective(control: string, index: number): NFDirective {
    this.lubCompireFormArr = this.formCompare.get('lubCompireFormArr') as FormArray;
    return {
      control: control,
      form: this.lubCompireFormArr.at(index) as FormGroup
    };
}

  onFocus(event, index: number, name: string) {
    this.lubCompireFormArr = this.formCompare.get('lubCompireFormArr') as FormArray;
    this.lubCompireFormArr.at(index).get(name).patchValue(event.target.value.replace(/,/g, ''));
    // this.details.at(index).get('amount').patchValue(event.target.value.replace(/,/g, ''));
  }

  onBlur(event, index: number, name: string) {
    // this.details = this.form.get('details') as FormArray;
    // this.details.at(index).get('amount').patchValue(new DecimalFormatPipe().transform(event.target.value, "###,###"));
    this.lubCompireFormArr = this.formCompare.get('lubCompireFormArr') as FormArray;
    this.lubCompireFormArr.at(index).get(name).patchValue(new DecimalFormatPipe().transform(event.target.value, "###,###.00"));
    let compare1 = this.lubCompireFormArr.at(index).get('compire1').value.replace(/,/g, '');
    let compate2 = this.lubCompireFormArr.at(index).get('compire2').value.replace(/,/g, '');
    let sumOverReate =  this.df.format(compare1-compate2)
    this.lubCompireFormArr.at(index).get('overRate').patchValue(sumOverReate);

  }

  onFocusMonth(event, index: number, name: string, month: number) {
    this.lubCompireFormArr = this.formCompare.get('formSummaryArray') as FormArray;
    this.fromSummaryMonthArr = this.lubCompireFormArr.at(index).get("fromSummaryMonthArr") as FormArray;
    this.fromSummaryMonthArr.at(month).get(name).patchValue(event.target.value.replace(/,/g, ''))

  }

  onBlurMonth(event, index: number, name: string, month: number) {
    this.lubCompireFormArr = this.formCompare.get("formSummaryArray") as FormArray;
    this.fromSummaryMonthArr = this.lubCompireFormArr.at(index).get("fromSummaryMonthArr") as FormArray;
    this.fromSummaryMonthArr.at(month).get(name).patchValue(new DecimalFormatPipe().transform(event.target.value, "###,###.00"))

    // let compare1 = this.lubCompireFormArr.at(index).get('compire1').value.replace(/,/g, '');
    // let compate2 = this.lubCompireFormArr.at(index).get('compire2').value.replace(/,/g, '');
    // let sumOverReate =  this.df.format(compare1-compate2)
    // this.lubCompireFormArr.at(index).get('overRate').patchValue(sumOverReate);

  }

  invalidChildren(control: string, index: number) {
    this.lubCompireFormArr = this.formCompare.get("lubCompireFormArr") as FormArray;
    return this.lubCompireFormArr.at(index).get(control).invalid && (this.lubCompireFormArr.at(index).get(control).touched || this.submitted);
  }

  invalidChildrenSummary(control: string, index: number, index2: number) {
    this.lubCompireFormArr = this.formCompare.get("formSummaryArray") as FormArray;
    this.fromSummaryMonthArr = this.lubCompireFormArr.at(index).get("fromSummaryMonthArr") as FormArray;
    return this.fromSummaryMonthArr.at(index2).get(control).invalid && (this.fromSummaryMonthArr.at(index2).get(control).touched || this.submitted);
  }

  invalidChildrenSummaryheader(control: string, index: number) {
    this.lubCompireFormArr = this.formCompare.get("formSummaryArray") as FormArray;
    return this.lubCompireFormArr.at(index).get(control).invalid && (this.lubCompireFormArr.at(index).get(control).touched || this.submitted);
  }


  invalid(control: string) {
    return this.formCompare.get(control).invalid && (this.formCompare.get(control).touched || this.submitted);
  }

  initOpe(): Ope02010604SummaryVo {
    let ope: Ope02010604SummaryVo = {
      oaLubSumaryId: 0,
      oaLubricantsId: 0,
      seq: 0,
      lubName: "",
      month: "",
      year: "",
      stockLatsMonth: 0,
      receive: 0,
      sending: 0,
      remark: "",
      stock: 0
    }
    return ope;
  }
  initOpeCompare() {
    return {
      oaLubCompareId: 0,
      oaLubricantsId: 0,
      seq: 0,
      name: "",
      sumaryDate: null,
      auditDate: null,
      auditStock: 0,
      sumaryStock: 0,
      remark: "",
      overRate: 0,
    }
  }


  get currentDate() {
    return moment(this.currentDT).format("DD/MM/YYYY");
  }

  get currentTime() {
    return moment(this.currentDT).format("HH:mm");
  }
  get fromSummary() {
    return this.formCompare.get('formSummaryArray').value
  }

  get calBalance(): number {
    this.lubCompireFormArr = this.formCompare.get("lubCompireFormArr") as FormArray;
    let summary: number = 0;
    for (let i = 0; i < this.lubCompireFormArr.length; i++) {
      if (this.lubCompireFormArr.at(i).get('compire1').value && this.lubCompireFormArr.at(i).get('compire1').value != '-')
        summary += parseFloat(this.lubCompireFormArr.at(i).get('compire1').value.replace(/,/g, ''));
    }
    return summary;
  }

  get calAudit(): number {
    this.lubCompireFormArr = this.formCompare.get("lubCompireFormArr") as FormArray;
    let summary: number = 0;
    for (let i = 0; i < this.lubCompireFormArr.length; i++) {
      if (this.lubCompireFormArr.at(i).get('compire2').value && this.lubCompireFormArr.at(i).get('compire2').value != '-')
        summary += parseFloat(this.lubCompireFormArr.at(i).get('compire2').value.replace(/,/g, ''));
    }
    return summary;
  }

  get calOverRate(): number {
    this.lubCompireFormArr = this.formCompare.get("lubCompireFormArr") as FormArray;
    let summary: number = 0;
    for (let i = 0; i < this.lubCompireFormArr.length; i++) {
      if (this.lubCompireFormArr.at(i).get('overRate').value && this.lubCompireFormArr.at(i).get('overRate').value != '-')
        summary += parseFloat(this.lubCompireFormArr.at(i).get('overRate').value.replace(/,/g, ''));
    }
    return summary;
  }
  get calLastMonth():number{

    return 0;
  }


}
class Bean {

}

class ope {

}
