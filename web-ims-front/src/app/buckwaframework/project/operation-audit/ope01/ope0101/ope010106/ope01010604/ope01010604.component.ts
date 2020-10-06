import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { formatter, TextDateTH } from 'helpers/datepicker';
import { ResponseData } from 'models/index';
import * as moment from 'moment';
import { Ope020703Vo } from 'projects/operation-audit/ope02/ope0207/ope020703/ope020703vo.model';
import { AjaxService, MessageBarService, MessageService } from 'services/index';
import { Ope010106ButtonVo, Ope010106Vo } from '../ope010106vo.model';
import { Ope01010604CompareVo, Ope01010604SummaryVo, Ope01010604Vo } from './Ope01010604.model';

const URL = {
  GET_FIND: "oa/0/03/01/01/find/customerLicense",
  GET_DETAILS: "oa/01/01/06/04/detail",
  PUT_UPDATE: "oa/01/01/06/04/save",
  GET_BUTTONS: "oa/01/01/06/detail",
  GET_FIND_CUSTOMER: "oa/01/01/06/customers",
}

declare var $: any;
@Component({
  selector: 'app-ope01010604',
  templateUrl: './ope01010604.component.html',
  styleUrls: ['./ope01010604.component.css']
})
export class Ope01010604Component implements OnInit {
  lubrID: string;
  id:string;
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

  fromData: Ope01010604Vo = null;
  changeCalendar: boolean = false;
  setCalendar: boolean = false;
  buttons: Ope010106ButtonVo = null;
  data: Ope020703Vo = null;
  loading: boolean = false;
  constructor(private fb: FormBuilder, private ajax: AjaxService, private route: ActivatedRoute, private msg: MessageBarService) {
    this.add = 0;
    this.obj = new ope();
    this.beans = [new Bean()];

    this.formCompare = this.fb.group({
      lubCompireFormArr: this.fb.array([]),
      formSummaryArray: this.fb.array([]),
      result: ['', Validators.required]
    });
    // this.addLubFormArr();
    // this.addSummaryFormArr();
  }

  ngOnInit() {
    this.lubrID = this.route.snapshot.queryParams["oaHydrocarbDtlId"] || "";
    this.id = this.route.snapshot.queryParams["id"] || "";
    this.fromData = {
      oaLubricantsDtlId: 0,
      oaLubricantsId: 0,
      listOaHydrocarbCompare: [],
      listOaHydrocarbSummary: [],
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
    this.ajax.doGet(`${URL.GET_BUTTONS}/${this.id}`).subscribe((response: ResponseData<Ope010106ButtonVo>) => {
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
    this.ajax.doGet(`${URL.GET_DETAILS}/${this.lubrID}`).subscribe((response: ResponseData<Ope01010604Vo>) => {
      if (MessageService.MSG.SUCCESS == response.status) {
        // this.fromData = response.data;
        var listCompare: Ope01010604CompareVo[] = response.data.listOaHydrocarbCompare;
        var listSummary: Ope01010604SummaryVo[] = response.data.listOaHydrocarbSummary;
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
              compire1: element.auditStock,
              compire2: element.sumaryStock,
              overRate: element.overRate,
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
                oaLubSumaryId: listSummary[j].oaHydSumaryId,
                oaLubricantsId: Number(this.lubrID),
                stockLatsMonth: listSummary[j].stockLatsMonth,
                sending: listSummary[j].sending,
                receive: listSummary[j].receive,
                stock: listSummary[j].stock,
              }));
              j++;

            });
            this.loading = false;
          }
        } else {
          this.changeCalendar = true;
          this.loading = false;
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
        this.msg.errorModal("ไม่สามารถดำเนินการเกิน 5 เดือน");
      }

    } else {
      this.diffMonth = 0;
    }
  }

  calucateMonthYear(listSummary: Ope01010604SummaryVo[]) {
    // console.log("formsummarymonth",listSummary)
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


    while (this.formSummaryArray.length !== 0) {
      this.formSummaryArray.removeAt(0)
    }

    if (this.changeCalendar) {
      this.addSummaryFormArr();
    }

    // console.log("monthArray",this.monthArray)
  }
  submitForm() {
    var listLubricantsCompare: Ope01010604CompareVo[] = [];
    var listOaLubricantsSummary: Ope01010604SummaryVo[] = [];
    this.submitted = true;
    // let summaryVo:Ope02010604SummaryVo = this.initOpe();
    // let compareVo:Ope02010604CompareVo = this.initOpeCompare();
    if (this.formCompare.valid) {

      let index = 0;
      let formCompare = this.formCompare.get('lubCompireFormArr') as FormArray;
      formCompare.controls.forEach(element => {
        let compareVo: Ope01010604CompareVo = this.initOpeCompare();
        compareVo.oaHydrocarbId = Number(this.lubrID);
        compareVo.oaHydCompareId = element.value.oaLubCompareId;
        compareVo.remark = element.value.remark;
        compareVo.name = element.value.name;
        compareVo.overRate = element.value.overRate;
        compareVo.seq = index;
        compareVo.sumaryStock = element.value.compire1;
        compareVo.auditStock = element.value.compire2;
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
          summaryVo.oaHydrocarbId = Number(this.lubrID);
          summaryVo.oaHydSumaryId = element2.value.oaLubSumaryId;
          summaryVo.month = month;
          summaryVo.year = year;
          summaryVo.receive = element2.value.receive;
          summaryVo.sending = element2.value.sending;
          summaryVo.stockLatsMonth = element2.value.stockLatsMonth;
          summaryVo.stock = element2.value.stock;
          listOaLubricantsSummary.push(summaryVo);
          j++;
        });
        index++;

      });

      this.fromData.listOaHydrocarbSummary = listOaLubricantsSummary;
      this.fromData.listOaHydrocarbCompare = listLubricantsCompare;
      this.fromData.result = this.formCompare.value.result;

      this.ajax.doPut(`${URL.PUT_UPDATE}/${this.lubrID}`, this.fromData).subscribe((response: ResponseData<Ope010106Vo>) => {
        if (MessageService.MSG.SUCCESS == response.status) {
          this.msg.successModal(response.message);
        } else {
          this.msg.errorModal(response.message);
        }
      });
    }


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

  initOpe(): Ope01010604SummaryVo {
    let ope: Ope01010604SummaryVo = {
      oaHydSumaryId: 0,
      oaHydrocarbId: 0,
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
    let ope: Ope01010604CompareVo = {
      oaHydCompareId: 0,
      oaHydrocarbId: 0,
      seq: 0,
      name: "",
      sumaryDate: null,
      auditDate: null,
      auditStock: 0,
      sumaryStock: 0,
      remark: "",
      overRate: 0,
    }
    return ope;
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


}
class Bean {

}

class ope {

}