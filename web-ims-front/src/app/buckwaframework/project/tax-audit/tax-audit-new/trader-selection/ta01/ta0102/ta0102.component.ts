import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EnDateToThDate, formatter, TextDateTH } from 'app/buckwaframework/common/helper/datepicker';
import { BreadCrumb, ResponseData } from 'app/buckwaframework/common/models/index';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { AjaxService } from 'app/buckwaframework/common/services/ajax.service';
import { MessageBarService } from 'app/buckwaframework/common/services/message-bar.service';
import { BreadcrumbContant } from '../../../BreadcrumbContant';
import { SelectService } from '../../select.service';
import { MessageService } from 'app/buckwaframework/common/services/message.service';
import { Utils } from 'app/buckwaframework/common/helper/utils';

declare var $: any;
@Component({
  selector: 'app-ta0102',
  templateUrl: './ta0102.component.html',
  styleUrls: ['./ta0102.component.css']
})
export class Ta0102Component implements OnInit {

  b: BreadcrumbContant = new BreadcrumbContant();
  breadcrumb: BreadCrumb[] = [
    { label: this.b.b00.label, route: this.b.b00.route },
    { label: this.b.b01.label, route: this.b.b01.route },
    { label: this.b.b07.label, route: this.b.b07.route },
    { label: this.b.b10.label, route: this.b.b10.route }
  ];

  toggleButtonTxt: string = 'แสดงเงื่อนไข'
  showBody: boolean = false;
  conNumber: string;
  searchForm: FormGroup;
  formatter: any;
  calendar: any;
  calendar1: any;
  submitted: boolean = false;
  dateStart: any;
  dateEnd: any;
  budgetYear: any;
  yearMonthStart: any;
  yearMonthEnd: any;
  loading: boolean = false;
  monthNum: any;
  masCondMainHdrList: any = [];
  masCondMainDtlList: any = [];
  formCondHdr: any = {
    condGroupNum: "",
    monthNum: ""
  }
  condSubList: string[] = [];
  condSub1: string = '';
  condSub2: string = '';
  condSub3: string = '';
  showCondDtl: boolean = false;
  constructor(
    private fb: FormBuilder,
    private select: SelectService,
    private router: Router,
    private msg: MessageBarService,
    private ajax: AjaxService
  ) {
    this.formatter = formatter('month-year');

  }

  // => static function
  setVariable() {
    this.searchForm = this.fb.group({
      calendar: ["", Validators.required],
      calendar1: ["", Validators.required],
      calendar2: [""],
      calendar3: [""],
      budgetYear: [""],
      condNumber: [""]
    });
  }

  //func check validator
  validateField(value: string) {
    return this.submitted && this.searchForm.get(value).errors;
  }

  toggleBody() {
    if (this.showBody) {
      this.showBody = false;
      this.toggleButtonTxt = 'แสดงเงื่อนไข'
    } else {
      this.showBody = true;
      this.toggleButtonTxt = 'ซ่อนเงื่อนไข'
    }
  }

  ngOnInit() {
    this.setVariable();
    this.getBudgetYear().subscribe(res => {

      this.searchForm.get("budgetYear").patchValue(res);
      this.getMasCondMainHdr().subscribe(res => {
        this.masCondMainHdrList = res;
        console.log("masCondMainHdrList : ", res)
        this.searchForm.get("condNumber").patchValue(res.length != 0 ? res[0].condNumber : '');
        if (res.length != 0) {
          this.formCondHdr = res[0];
          this.conNumber = res[0].condNumber;
        } else {
          this.formCondHdr = {
            condGroupNum: "",
            monthNum: ""
          }
        }
        console.log("change : ", this.formCondHdr);
        $("#condNumber").dropdown('set selected', this.searchForm.get('condNumber').value);

        this.getMasCondMainDtl().subscribe(res => {
          this.masCondMainDtlList = res;
          console.log("masCondMainDtlList : ", this.masCondMainDtlList);
        });
        console.log("MasCondMainHdrList : ", res);
      });
    })
  }

  ngAfterViewInit(): void {
    console.log("form  :", this.searchForm.value)
    // this.budgetYear = null;
    // this.findByBudgetYear().subscribe(res => {
    //   if (res) {
    //     this.budgetYear = res.budgetYear;
    //     this.monthNum = res.monthNum;
    //   }
    // });
    $("#budgetYear").calendar({
      // maxDate: new Date(),
      type: "year",
      text: TextDateTH,
      formatter: formatter('ป'),
      onChange: (date, text) => {
        this.searchForm.get('calendar').patchValue('');
        this.searchForm.get('calendar1').patchValue('');
        this.masCondMainHdrList = [];
        setTimeout(() => {
          $(".condNumber").dropdown();
        }, 100);
        this.searchForm.get("budgetYear").patchValue(text);
        console.log("text : ", text);
        this.getMasCondMainHdr().subscribe(res => {
          this.masCondMainHdrList = res;
          this.searchForm.get("condNumber").patchValue(res.length != 0 ? res[0].condNumber : '');
          $(".condNumber").dropdown('set selected', this.searchForm.get('condNumber').value);
          this.conNumber = this.searchForm.get("condNumber").value;

          if (res.length != 0) {
            this.formCondHdr = res[0];
          } else {
            this.formCondHdr = {
              condGroupNum: "",
              monthNum: ""
            }
            $(".condNumber option:selected").prop("selected", false);
          }
          console.log("change : ", this.formCondHdr);
          this.getMasCondMainDtl().subscribe(res => {
            this.masCondMainDtlList = res;
            console.log("masCondMainDtlList : ", this.masCondMainDtlList);
          });
          console.log("MasCondMainHdrList : ", res);
        });

      }
    });

    $(".ui.checkbox").checkbox();
    this.calendarFunc();
  }

  calendarFunc() {
    $("#calendar").calendar({
      maxDate: new Date(),
      type: "month",
      text: TextDateTH,
      formatter: this.formatter,
      onChange: (date, text, meta) => {

        let masCondMainHdrList = this.masCondMainHdrList.filter(e => e.condNumber == this.searchForm.get("condNumber").value)
        let masCondMainHdr = masCondMainHdrList[0];
        let condtype = masCondMainHdr.compType;


        if (condtype == 1) {

          let number = this.masCondMainDtlList[0].taxMonthEnd - 1;
          // let number = this.masCondMainHdrList[0].monthNum - 1;
          let numMonth = Math.trunc(number % 12)
          let numYear = Math.trunc(number / 12)
          let monthEnd
          let start = text
          let end = start.split("/")
          let yearEnd = parseInt(end[1]) + numYear
          if (parseInt(end[0]) + numMonth > 12) {
            yearEnd += 1
            let cc = (parseInt(end[0]) + numMonth) - 12
            monthEnd = cc
          } else if (parseInt(end[0]) + numMonth <= 12) {
            monthEnd = parseInt(end[0]) + numMonth
          }
          console.log(monthEnd.toString().padStart(2, 0) + "/" + yearEnd);
          let cerrentYear = new Date().getFullYear() + 543
          if (cerrentYear < yearEnd) {
            this.monthErr()
            return
          } else if (cerrentYear == yearEnd) {
            if (new Date().getMonth() + 1 < monthEnd) {
              this.monthErr()
              return
            }
          }
          this.yearMonthStart = start
          this.yearMonthEnd = (monthEnd.toString().padStart(2, 0) + "/" + yearEnd).toString()
          const page = "select11";
          let data = {
            budgetYear: this.budgetYear,
            yearMonthStart: text,
            yearMonthEnd: (monthEnd.toString().padStart(2, 0) + "/" + yearEnd).toString()
          }
          console.log(data);
          this.select.setData(page, data);
          this.searchForm.get('calendar').patchValue(text.toString());
          this.searchForm.get('calendar1').patchValue((monthEnd.toString().padStart(2, 0) + "/" + yearEnd).toString());
          // console.log("formCondHdr : ", this.formCondHdr.monthNum)
          // let addDateMonth = moment(date).add(this.formCondHdr.monthNum - 1, 'month').calendar();
          // this.yearMonthStart = text;
          // let editYearMonthEnd = moment(addDateMonth).format("MM/YYYY");
          // let arrYearMonthEnd = editYearMonthEnd.split("/");
          // let newYearEnd = Number(arrYearMonthEnd[1]) + 543;
          // this.yearMonthEnd = (arrYearMonthEnd[0] + "/" + newYearEnd).toString();
          // const page = "select11";
          // let data = {
          //   budgetYear: this.budgetYear,
          //   yearMonthStart: this.yearMonthStart,
          //   yearMonthEnd: this.yearMonthEnd
          // }
          // console.log(data);

          // this.select.setData(page, data);
          // this.searchForm.get('calendar').patchValue(text);
          // this.searchForm.get('calendar1').patchValue((arrYearMonthEnd[0] + "/" + newYearEnd).toString());

          this.searchForm.get('calendar').patchValue(text)
          let monthNum = masCondMainHdr.monthNum;
          this.addMonth(date, (monthNum / 2) - 1, 'calendar1', condtype);
        } else { //conNumber == 2
          this.searchForm.get('calendar').patchValue(text)
          let monthNum = masCondMainHdr.monthNum;
          this.addMonth(date, (monthNum / 2) - 1, 'calendar1', condtype);
        }
      }
    });
    $("#calendar1").calendar({
      maxDate: new Date(),
      type: "month",
      text: TextDateTH,
      formatter: this.formatter,
      onChange: (date, text, meta) => {
        let masCondMainHdrList = this.masCondMainHdrList.filter(e => e.condNumber == this.searchForm.get("condNumber").value)
        let masCondMainHdr = masCondMainHdrList[0];
        let condtype = masCondMainHdr.compType;

        console.log('masCondMainHdrList', masCondMainHdrList)
        console.log('masCondMainHdr', masCondMainHdr)
        console.log('condtype : ', condtype)
        if (condtype == 1) {
          console.log("======================================")
          let number = this.masCondMainDtlList[0].taxMonthEnd - 1;
          console.log(Math.trunc(number % 12));
          let numMonth = Math.trunc(number % 12)
          let numYear = Math.trunc(number / 12)
          console.log(Math.trunc(number / 12));

          // console.log(text);
          // let addDateMonth = moment(date).add(this.formCondHdr.monthNum - 1, 'month').calendar();
          // this.yearMonthStart = text;
          // let editYearMonthEnd = moment(addDateMonth).format("MM/YYYY");
          // let arrYearMonthEnd = editYearMonthEnd.split("/");
          // let newYearEnd = Number(arrYearMonthEnd[1]) + 543;
          // this.yearMonthEnd = (arrYearMonthEnd[0] + "/" + newYearEnd).toString();
          let monthStart
          let end = text
          let start = end.split("/")
          let yearStart = start[1] - numYear
          if (start[0] - numMonth <= 0) {
            yearStart -= 1
            let cc = (start[0] - numMonth) * -1
            monthStart = 12 - cc
          } else if (start[0] - numMonth > 0) {
            monthStart = start[0] - numMonth
          }
          console.log(monthStart.toString().padStart(2, 0), yearStart);
          this.yearMonthStart = (monthStart.toString().padStart(2, 0) + "/" + yearStart).toString()
          this.yearMonthEnd = end
          const page = "select11";
          let data = {
            budgetYear: this.budgetYear,
            yearMonthStart: (monthStart.toString().padStart(2, 0) + "/" + yearStart).toString(),
            yearMonthEnd: end
          }
          console.log("data : ", data);

          this.select.setData(page, data);
          // this.searchForm.get('calendar').patchValue((arrYearMonthEnd[0] + "/" + newYearEnd).toString());
          // this.searchForm.get('calendar').patchValue((monthStart.toString().padStart(2, 0) + "/" + yearStart).toString());

          //this.searchForm.get('calendar').patchValue(text)
          let monthNum = masCondMainHdr.monthNum;

          let addDateStr = moment(date).add((monthNum/-2)+1, 'month').format("YYYY-MM-DD")
          console.log('add Date : ', addDateStr)
          let dateSplit = addDateStr.split("-")
          let result = dateSplit[1] + "/" + (Number(dateSplit[0]) + 543).toString();

          this.searchForm.get('calendar').patchValue(result);
          this.searchForm.get('calendar1').patchValue(end);
          this.addMonth(date, (monthNum / 2) - 1, 'calendar1', condtype);
        } else { //type == 2
          console.log('====type 2=============')
          this.searchForm.get('calendar1').patchValue(text)
          let monthNum = masCondMainHdr.monthNum;
          this.addMonth(date, ((monthNum / -2) + 1), 'calendar', condtype);
        }

      }
    });

  }

  addMonth(date: any, monthNum: number, formControlName: string, type: string) {
    // type = '1';
    let addDateStr = moment(date).add((monthNum), 'month').format("YYYY-MM-DD")
    console.log('add Date : ', addDateStr)
    let dateSplit = addDateStr.split("-")
    let result = dateSplit[1] + "/" + (Number(dateSplit[0]) + 543).toString();
    this.searchForm.get(formControlName).patchValue(result);

    setTimeout(() => {

      let calendar = $("#calendarraw").val().split("/");
      let calendar1 = $("#calendar1raw").val().split("/");

      if (type == '1') {
        let _date = moment(calendar1[0] + "/01/" + (Number(calendar1[1]) - 543).toString(), "MM-DD-YYYY");
        console.log('date type 1 => ', _date)
        let _addDateStr = moment(_date).add((1), 'month').format("YYYY-MM-DD")
        let _addDateStr2 = moment(_date).add(monthNum + 1, 'month').format("YYYY-MM-DD")
        let _dateSplit = _addDateStr.split("-")
        let _dateSplit2 = _addDateStr2.split("-")
        let _result = _dateSplit[1] + "/" + (Number(_dateSplit[0]) + 543).toString();
        let _result2 = _dateSplit2[1] + "/" + (Number(_dateSplit2[0]) + 543).toString();

        setTimeout(() => {
          this.searchForm.get('calendar2').patchValue(_result);
          this.searchForm.get('calendar3').patchValue(_result2);

          console.log('formSearch', this.searchForm.value)
        }, 50);
      } else {
        let calendarResult = calendar[0] + "/" + (Number(calendar[1]) - 1).toString();
        let calendar1Result = calendar1[0] + "/" + (Number(calendar1[1]) - 1).toString();
        this.searchForm.get('calendar2').patchValue(calendarResult);
        this.searchForm.get('calendar3').patchValue(calendar1Result);
        console.log('formSearch', this.searchForm.value)
      }



    }, 100);

  }

  monthErr() {
    const page = "";
    let data = {
      budgetYear: "",
      yearMonthStart: "",
      yearMonthEnd: ""
    }
    this.select.setData(page, data);
    this.msg.errorModal("ช่วงวันเกินเดือนปัจจุบัน")
    this.searchForm.get('calendar').patchValue('')
    this.searchForm.get('calendar1').patchValue('')
    this.searchForm.get('calendar2').patchValue('')
    this.searchForm.get('calendar3').patchValue('')
    $('#calendarraw').val('')
    $('#calen1darraw').val('')
  }

  clear() {
    this.searchForm.reset();
  }

  back() {
    this.router.navigate(["/tax-audit-new/ta01/01"]);
  }

  onClickCondHdr(e) {
    this.showCondDtl = false;
    console.log("change CondHdr", this.searchForm.value.condNumber);
    this.conNumber = this.searchForm.value.condNumber
    console.log("conNumber :", this.conNumber)
    this.searchForm.get('calendar').patchValue('');
    this.searchForm.get('calendar1').patchValue('');
    this.searchForm.get('calendar2').patchValue('')
    this.searchForm.get('calendar3').patchValue('')
    let conHdr = [];
    if (this.masCondMainHdrList.length != 0) {
      conHdr = this.masCondMainHdrList.filter(element => {
        return element.condNumber == this.searchForm.value.condNumber;
      })
    }
    console.log("conHdr : ", conHdr);
    if (conHdr.length != 0) {
      this.formCondHdr = conHdr[0];
    } else {
      this.formCondHdr = {
        condGroupNum: "",
        monthNum: ""
      }
    }
    console.log("change formCondHdr : ", this.formCondHdr);

    this.getMasCondMainDtl().subscribe(res => {
      this.masCondMainDtlList = res;
      console.log("masCondMainDtlList : ", this.masCondMainDtlList)
    });

  }

  onChangeChecked(e, id) {
    console.log("E : ", e.target.checked)
    console.log("id : ", id)


    if ("condSub1" == id) {
      this.condSub1 = this.pushIdCondSub(e, id);
    } else if ("condSub2" == id) {
      this.condSub2 = this.pushIdCondSub(e, id);
    } else {
      this.condSub3 = this.pushIdCondSub(e, id);
    }

    console.log("checklist ; ", this.condSubList);
    console.log("monthNum 1: ", this.condSub1)
    console.log("monthNum 2: ", this.condSub2)
    console.log("monthNum 3: ", this.condSub3)
  }

  pushIdCondSub(e, id) {
    if (e.target.checked) {
      this.condSubList.push(id);
      return id;
    } else {
      this.condSubList = this.condSubList.filter(idCondSub => {
        return idCondSub != id;
      })
      return "";
    }
  }
  onSubmit(e) {
    e.preventDefault();
    this.submitted = true;
    if (this.searchForm.invalid) {
      this.msg.errorModal("กรุณากรอกระยะเวลาที่ตรวจสอบ");
      return;
    }
    console.log('summit',  this.searchForm.get('calendar').value,  this.searchForm.get('calendar1').value)
    this.yearMonthStart = $("#calendarraw").val()
    this.yearMonthEnd = $("#calendar1raw").val()

    this.router.navigate(["/tax-audit-new/ta01/02/01"], {
      queryParams: {
        monthNum: this.formCondHdr.monthNum,
        yearMonthStart: this.yearMonthStart,
        yearMonthEnd: this.yearMonthEnd,
        yearMonthStartCompare: this.searchForm.get("calendar2").value,
        yearMonthEndCompare: this.searchForm.get("calendar3").value,
        condNumber: this.formCondHdr.condNumber,
        budgetYear: this.searchForm.get("budgetYear").value,
        condSub1: this.condSub1,
        condSub2: this.condSub2,
        condSub3: this.condSub3
      }
    });


    // this.loading = true;
    // this.insertWs().subscribe(res => {
    //   let data = {
    //     analysisNumber: res,
    //     budgetYear: this.budgetYear,
    //     yearMonthStart: this.yearMonthStart,
    //     yearMonthEnd: this.yearMonthEnd
    //   }
    //   this.loading = false;
    //   this.router.navigate(["/tax-audit-new/ta0102/01"], {
    //     queryParams: data
    //   });
    // });
  }

  onChangeCondNumber(e) {
    e.preventDefault();
    this.searchForm.get('calendar').patchValue('');
    this.searchForm.get('calendar1').patchValue('');
    this.searchForm.get('calendar2').patchValue('');
    this.searchForm.get('calendar3').patchValue('');
    let conHdr = [];
    if (this.masCondMainHdrList.length != 0) {
      conHdr = this.masCondMainHdrList.filter(element => {
        return element.condNumber == e.target.value;
      })
    }
    console.log("conHdr : ", conHdr);
    if (conHdr.length != 0) {
      this.formCondHdr = conHdr[0];
    } else {
      this.formCondHdr = {
        condGroupNum: "",
        monthNum: ""
      }
    }
    console.log("change formCondHdr : ", this.formCondHdr);

    this.getMasCondMainDtl().subscribe(res => {
      this.masCondMainDtlList = res;
    });
  }

  toggleCondDtl(e) {
    console.log("taggle e ", e)
    console.log("taggle condnNumber ", this.conNumber)
    if (e) {
      if (this.showCondDtl) {
        this.showCondDtl = false;
      } else {
        this.showCondDtl = true;
      }
    }

    console.log("showCondDtl : ", this.showCondDtl)
  }

  // ==========================> call back-end function <================================

  getMasCondMainHdr(): Observable<any> {
    return new Observable(obs => {
      this.ajax.doPost("ta/master-condition-main/get-main-cond-hdr",
        {
          "budgetYear": this.searchForm.get("budgetYear").value
        }).subscribe((res: ResponseData<any>) => {
          if (MessageService.MSG.SUCCESS == res.status) {
            obs.next(res.data);
          } else {
            this.msg.errorModal(res.message);
            console.log("Error ! getMasCondMainHdr")
          }
        });
    })
  }

  getMasCondMainDtl(): Observable<any> {
    return new Observable(obs => {
      this.ajax.doPost("ta/master-condition-main/get-main-cond-dtl",
        {
          "budgetYear": this.searchForm.get("budgetYear").value,
          "condNumber": this.searchForm.get('condNumber').value
        }).subscribe((res: ResponseData<any>) => {
          if (MessageService.MSG.SUCCESS == res.status) {
            obs.next(res.data);
          } else {
            this.msg.errorModal(res.message);
            console.log("Error ! getMasCondMainDtl")
          }
        });
    })
  }
  getBudgetYear(): Observable<any> {
    return new Observable(obs => {
      this.ajax.doPost("preferences/budget-year", {}).subscribe((res: ResponseData<any>) => {
        if (MessageService.MSG.SUCCESS == res.status) {
          obs.next(res.data);
        } else {
          this.msg.errorModal(res.message);
          console.log("Error ! getBudgetYear")
        }
      })
    })
  }
}
