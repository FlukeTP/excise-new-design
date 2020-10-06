import { Component, OnInit, AfterViewInit, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { RequestStartLength, ObjMonth, checkboxList } from './table-custom.model';
import { TaUtils } from '../../TaAuthorized';
import { AuthService } from 'services/auth.service';
import { Utils } from 'helpers/utils';
import { MessageBarService } from 'services/message-bar.service';
import { CondGroup } from '../ta01/ta0104/ta0104.model';
import * as moment from 'moment';
import { DecimalFormatPipe } from 'app/buckwaframework/common/pipes/decimal-format.pipe';
import { Store } from '@ngrx/store';

declare var $: any;
@Component({
  selector: 'app-table-custom',
  templateUrl: './table-custom.component.html',
  styleUrls: ['./table-custom.component.css']
})
export class TableCustomComponent implements OnInit, AfterViewInit {


  @Input() datas: any[] = [];
  @Input() recordTotal: number = 0;
  @Input() objMonth: ObjMonth = new ObjMonth();
  @Input() checkbox: boolean = false;
  @Input() datasChecked: any[] = [];
  @Input() disabledCheckbox: boolean = false;
  @Input() showCondition: boolean = false;
  @Input() budgetYear: number;
  @Input() condGroupDtl: CondGroup[];

  @Output() pageChangeOutput: EventEmitter<RequestStartLength> = new EventEmitter();
  @Output() checkboxOutput: EventEmitter<any> = new EventEmitter();
  paginationTotal: number = 0;
  pageLenght: number;
  header: string[];
  lenght: number[];
  pagination: number;
  start: number;
  end: number;
  startDispaly: number;
  startLength: RequestStartLength;
  // ==> data
  monthsArr: any = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
  months: any = [];
  finish: boolean = false;
  checkedAll: boolean = false;
  checkboxList: checkboxList;
  pushDatachecked: boolean = true;
  isCentral: boolean = true;
  yearLast: number = 0;

  officeCode: string = '';

  recordTotalDesc: string = "";

  yearMonthEnd: string = ""
  yearMonthEndCompare: string = ""
  yearMonthStart: string = ""
  yearMonthStartCompare: string = ""
  //==> modal
  details: Detail = new Detail();

  constructor(
    private auth: AuthService,
    private messageBar: MessageBarService,
  ) {
    this.lenght = [10, 25, 50, 100];
    this.pageLenght = 10;
    this.pagination = 1;
    this.start = 0;
    this.end = 10;

    this.startLength = {
      start: this.start,
      length: this.pageLenght
    }
    this.checkboxList = {
      typeCheckedAll: false,
      ids: []
    }
    this.calculatePagination();
  }

  ngOnInit() {
    this.isCentral = TaUtils.isCentral(this.auth.getUserDetails().officeCode);
    this.officeCode = this.auth.getUserDetails().officeCode;
    this.calculateHeaderHtml();
  }

  ngAfterViewInit(): void {
    $("#pageLenght").dropdown().css('min-width', '3em', 'margin-left', '4px', 'margin-right', '4px');
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.recordTotalDesc = Utils.moneyFormatInt(this.recordTotal);
    console.log("ngOnChange objMonth=>", this.objMonth)

    //Table heaer
    let start = this.objMonth.yearMonthStart.split("/");
    let startCompare = this.objMonth.yearMonthStartCompare.split("/");
    let end = this.objMonth.yearMonthEnd.split("/");
    let endCompare = this.objMonth.yearMonthEndCompare.split("/");

    if (start.length > 1 && end.length > 1 && startCompare.length > 1 && endCompare.length > 1) {

      this.yearMonthStart = this.monthsArr[Number(start[0]) - 1] + " " + start[1].substr(2, 4);
      this.yearMonthStartCompare = this.monthsArr[Number(startCompare[0]) - 1] + " " + startCompare[1].substr(2, 4);
      this.yearMonthEnd = this.monthsArr[Number(end[0]) - 1] + " " + end[1].substr(2, 4);
      this.yearMonthEndCompare = this.monthsArr[Number(endCompare[0]) - 1] + " " + endCompare[1].substr(2, 4);
    }


    let year = this.objMonth.yearMonthEnd.split("/");
    // this.yearLast = parseInt(year[1]);
    if (this.budgetYear == undefined){
      let currentYear = moment(new Date()).year()+543;
      this.yearLast = currentYear;
    }else{
      this.yearLast = this.budgetYear;
    }

    this.finish = false;
    this.calculateHeaderHtml();
    this.calculatePagination();
    if (this.datas.length == 0) {
      this.end = 0;
      this.start = 0;
    } else {
      if (!this.finish) {
        if (this.pushDatachecked) {
          this.datasChecked.forEach(e => {
            this.checkboxList.ids.push(e.newRegId);
          })
          this.pushDatachecked = false;
        }

        console.log("checkboxList : ", this.checkboxList.ids);
        if (this.checkbox) {

          this.datas.forEach(element => {
            element.checked = "N";
            if (this.checkboxList.ids.length != 0) {
              for (let i = 0; i < this.checkboxList.ids.length; i++) {
                if (element.newRegId == this.checkboxList.ids[i]) {
                  element.checked = "Y";
                }
              }
            }
          });

          //set data checked
          if (this.datasChecked.length != 0) {
            console.log("datasChecked ; ", this.datasChecked);
            this.datas.forEach(element => {
              for (let i = 0; i < this.datasChecked.length; i++) {
                if (element.newRegId == this.datasChecked[i].newRegId) {
                  element.checked = "Y";
                  this.checkboxList.ids.push(element.newRegId);
                }
              }
            });

            var arr = this.checkboxList.ids;
            this.checkboxList.ids = arr.filter((item, pos) => {
              return arr.indexOf(item) == pos;
            });

            this.checkboxOutput.emit(this.checkboxList);
          }
        }
        setTimeout(() => {
          let left = 3;
          if (this.checkbox) left += 1
          $("#fixTable").tableHeadFixer({ "head": true, "left": left, 'z-index': 0 });
        }, 300);
        this.finish = true;
      }

    }

    this.onClickPagination();
  }

  calculatePagination() {
    this.paginationTotal = (this.recordTotal / this.pageLenght);
    let paginationTotalStr = this.paginationTotal.toString();
    this.paginationTotal = (paginationTotalStr.split(".").length > 1 ? Math.trunc(this.paginationTotal) + 1 : this.paginationTotal)
  }

  onChangePageLenght(e) {
    this.pagination = 1;
    this.pageLenght = e.target.value;
    this.onClickPagination();

    let objChangePageLenght = {
      //pageLenght: this.pageLenght,
      start: this.start,
      length: this.pageLenght
    }
    this.checkedAll = false;
    this.pageChangeOutput.emit({
      start: this.start,
      length: this.pageLenght
    });

  }
  pageChange(e) {
    this.start = e - this.pageLenght;
    this.pagination = this.start / this.pageLenght + 1;

    this.onClickPagination();
    this.checkedAll = false;
    this.pageChangeOutput.emit({
      start: this.start,
      length: this.pageLenght
    });
  }

  onClickPagination() {
    if (this.datas.length == 0) {
      this.end = 0;
      this.start = 0;

    } else {
      this.start = (this.pageLenght * this.pagination) - this.pageLenght;
      this.end = (this.pageLenght * this.pagination) >= this.recordTotal ? this.recordTotal : (this.pageLenght * this.pagination);

      this.startDispaly = this.end != 0 ? this.start + 1 : this.start
    }
  }

  calculateHeaderHtml() {
    console.log("calculateHeaderHtml this.objMonth", this.objMonth);
    this.months = [];
    let monthsTemp = [];
    let monthsTemp2 = [];
    if (this.objMonth.monthTotal < 24) {
      // type = '2';
      // string to date
      for (let i = 0; i < 2; i++) {

        for (let j = 0; j < this.objMonth.monthTotal / 2; j++) {
          let start = this.objMonth.yearMonthStart.split("/");
          let _date = moment(start[0] + "/01/" + (Number(start[1]) - 543).toString(), "MM-DD-YYYY");
          let _addDateStr = moment(_date).add((j), 'month').format("YYYY-MM-DD")

          // date to string

          let dateSplit = _addDateStr.split("-")
          let result = this.monthsArr[Number(dateSplit[1]) - 1] + " " + (Number(dateSplit[0]) + 543 - i).toString();


          monthsTemp.push(result);
        }
      }

      for (let i = monthsTemp.length / 2; i > 0; i--) {
        monthsTemp2.push(monthsTemp[i - 1]);
      }

      for (let i = monthsTemp.length; i > monthsTemp.length / 2; i--) {
        monthsTemp2.push(monthsTemp[i - 1]);
      }

      // console.log('month', monthsTemp2)

      for (let i = 0; i < monthsTemp2.length; i++) {
        this.months.push(monthsTemp2[i])
      }

    } else {
      let monthStart = this.objMonth.monthStart;
      let yearSp = this.objMonth.yearMonthStart.split("/");
      let year = parseInt(yearSp[1]);
      for (let i = 0; i < this.objMonth.monthTotal; i++) {
        if (monthStart == 13) {
          monthStart = 1;
          year += 1;
        }

        let monthNum = monthStart;
        this.months.push(this.monthsArr[monthNum - 1] + ' ' + year);

        monthStart++;
      }

    }
  }

  checkAll(e) {
    if (e.target.checked) {
      this.checkedAll = true;
      this.checkboxList.typeCheckedAll = this.checkedAll;
      let unchecked = [];
      this.datas.forEach(element => {

        element.checked = "Y";
        console.log(element.checked)
        if (!this.isCentral && Utils.isNotNull(element.selectBy)) {
          unchecked.push(element.newRegId);
          console.log("unchecked pish : ", element.newRegId)
          this.messageBar.comfirm(res => {
            if (!res) {
              this.checkedAll = false;
              unchecked.forEach(id => {
                $('#' + id).prop('checked', false);
                this.checkboxList.ids = this.checkboxList.ids.filter(ids => ids != id);
                this.datas.forEach(element => {
                  if (element.newRegId == id) {

                    element.checked = "N";
                  }
                });
              });
              this.checkboxOutput.emit(this.checkboxList);
            } else {
              //unchecked.forEach(id => {
              //$('#' + id).prop('checked', true);
              // });
            }
          }, `${element.cusFullname} ถูกเลือกโดย ${element.selectBy} คุณต้องการเลือกซ้ำหรือไม่ ?`);

        }
        for (let i = 0; i < this.checkboxList.ids.length; i++) {

          if (element.newRegId == this.checkboxList.ids[i]) {
            var contain = true;
          }
        }
        if (!contain) {
          this.checkboxList.ids.push(element.newRegId);
        }
      });

    } else {
      this.checkedAll = false;
      this.checkboxList.typeCheckedAll = this.checkedAll;
      this.datas.forEach(element => {
        let newRegId = element.newRegId;
        this.checkboxList.ids = this.checkboxList.ids.filter(element => element != newRegId);
        element.checked = "N"
      });
    }
    this.checkboxOutput.emit(this.checkboxList);
  }

  changeCheckbox(e, item) {
    if (e.target.checked) {
      if (!this.isCentral && Utils.isNotNull(item.selectBy)) {
        this.messageBar.comfirm(res => {
          if (res) {
            item.checked = "Y"
            if (this.checkedAll) {
              this.checkboxList.ids = this.checkboxList.ids.filter(arr => arr != item.newRegId);
            } else {
              console.log("check all", item.newRegId)
              this.checkboxList.ids.push(item.newRegId);
            }
            this.checkboxOutput.emit(this.checkboxList);
          } else {
            item.checked = "N"
            $('#' + item.newRegId).prop('checked', false);
            console.log(" item.checked ", item.checked)
            this.checkboxOutput.emit(this.checkboxList);
          }
        }, "ผู้ประกอบการรายนี้ถูกเลือกไปแล้ว คุณต้องการเลือกซ้ำหรือไม่ ?");
      } else {

        item.checked = "Y"
        if (this.checkedAll) {
          let indx = this.checkboxList.ids.findIndex(arr => arr == item.newRegId);
          this.checkboxList.ids.splice(indx, 1);
        } else {
          this.checkboxList.ids.push(item.newRegId);
        }
      }

    } else {
      item.checked = "N"
      this.checkedAll = false;
      this.checkboxList.ids = this.checkboxList.ids.filter(arr => arr != item.newRegId);
    }
    this.checkboxOutput.emit(this.checkboxList);
  }

  onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }

  //==> modal table
  showDetails(newRegId) {
    let data = this.datas.filter(element => element.newRegId == newRegId);
    this.details = data[0];
    console.log("details : ", this.details);
    $("#tableModal").modal({
      autofocus: false,
      onShow: () => {

      }
    }).modal('show');
  }


  //////============= ckeck risk
  checkRisk(condTaxGrp) {
    let result = this.condGroupDtl.filter(e => e.condGroup == condTaxGrp);
    if (result.length > 0) {
      //console.log('result[0].riskLevel : ', result[0].riskLevel)
      return result[0].riskLevel;
    } else {
      return '';
    }
    //  this.condGroupDtl.forEach(element => {

    //     if(element.condGroup == condTaxGrp){
    //       console.log('object', element.condGroup == condTaxGrp)
    //       return element.riskLevel;
    //     }
    //   });
    //   return '';
  }

  showTotip(newRegId) {
    console.log('newRegId', newRegId)
  }

  //หน้า 05 คัดเลือกทั้งหมด
  mychecked(newRegId) {
    // console.log('object', this.objMonth)
    if (this.objMonth.isDisabled) {
      let rs = this.datasChecked.filter(e => e.newRegId == newRegId);
      //console.log('rs', rs)
      if (rs.length != 0) {
        return rs[0].officeCode != this.officeCode
      }
      return false;
    } else {
      return false
    }
  }

  //หน้า 09 คัดเลือกทั้งหมด
  listChecked(newRegId) {
    // if (this.objMonth.isDisabled) {
    let rs = this.datasChecked.filter(e => e.newRegId == newRegId);
    //console.log('rs', rs)
    if (rs.length != 0) {
      return rs.length != 0
    }
    return false;
  }
}

class Detail {
  facAddress: string = '';
  regStatus: string = '';
  facFullname: string = '';
  oldRegId: string = '';
  otherDutyName: string = '';
  syncDate:string = '';
  dutyName:string = '';
  multiDutyDesc:string = '';
  multiDutyFlag:string = '';
}
