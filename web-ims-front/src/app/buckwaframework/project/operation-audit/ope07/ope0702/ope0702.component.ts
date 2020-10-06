import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Chart } from 'chart.js';
import { TextDateTH, formatter } from 'helpers/datepicker';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AjaxService } from 'services/ajax.service';
import { MessageBarService } from 'services/message-bar.service';
import { Store } from '@ngrx/store';
import { HeaderTable, BodyTable } from '../table/table.model';
import { ResponseData } from 'models/response-data.model';
import { Response07Vo, Vo } from '../ope0703/op0703.model';
import { Utils } from 'helpers/utils';
import * as moment from 'moment'
import { element } from '@angular/core/src/render3';
declare var $: any;
const LABEL_TH = ['กราฟ', 'ลำดับ', 'เลขทะเบียนสรรพสามิต', 'ชื่อผู้ประกอบการ', 'ภาค/พื้นที่', 'ทุนจดทะเบียน', 'พิกัดสินค้า/บริการ', 'การชำระภาษี (บาท)'];
@Component({
  selector: 'app-ope0702',
  templateUrl: './ope0702.component.html',
  styleUrls: ['./ope0702.component.css']
})
export class Ope0702Component implements OnInit, AfterViewInit, OnDestroy {

  formGroup: FormGroup
  loading: boolean = false;
  headerTable: HeaderTable;
  bodyTable: BodyTable[] = [];
  body: BodyTable
  taxAmsList: Vo[] = [];

  datasChart: number[] = [];
  dataStore: any;

  //==> Chart
  monthNum: number = 0;
  monthChart: string[] = [];
  monthTable: string[] = [];
  backgroundColor: string[] = []
  datas: number[] = []
  recordTotal: number = 0;
  myBarChart: any;

  //==> Table Chart
  headerTableChart: string[] = [];
  bodyTableChart: any[] = [];
  datasChartForTable: string[] = [];


  sizeModal: string = 'large';
  constructor(
    private formBuilder: FormBuilder,
    private ajax: AjaxService,
    private messageBar: MessageBarService,
    private store: Store<any>,
  ) {
    this.createForm();
  }
  ////================== response table ==================
  pageChangeOutput(e) {
    console.log('pageChangeOutput', e)
    this.formGroup.get('start').patchValue(e.start);
    this.formGroup.get('length').patchValue(e.length);
    this.getDataTable(this.formGroup);
  }
  graphOnClick(e) {

    if (Number(this.formGroup.get('monthNum').value) > 6 && Number(this.formGroup.get('previousYear').value) >= 3) {
      this.sizeModal = 'fullscreen';
    } else {
      this.sizeModal = 'large';
    }
    $("#graph").modal({
      onShow: () => {
        console.log('graphOnClick', e)
        console.log('datas', this.taxAmsList)
        console.log('datas[i]', this.taxAmsList[e.idxArr])
        this.datasChart = [];
        this.backgroundColor = [];
        this.monthChart = [];
        this.formGroup.get('facFullname').patchValue(this.taxAmsList[e.idxArr].facFullname);

        let monthNum = Number(this.formGroup.get('previousYear').value);

        let countMonth = 0;
        this.taxAmsList[e.idxArr].groupTaxPay.forEach(element => {

          if (countMonth == monthNum) {
            this.datasChart.push(null);
            this.datasChart.push(null);
            this.backgroundColor.push('');
            this.backgroundColor.push('');
            countMonth = 0;
          }
          countMonth++;
          this.datasChart.push(Number(element))
          this.backgroundColor.push('#2E9AFE');
        });

        countMonth = 0;
        this.taxAmsList[e.idxArr].groupYearMonthGraph.forEach(element => {


          if (countMonth == monthNum) {
            this.monthChart.push('');
            this.monthChart.push('');
            countMonth = 0;
          }
          countMonth++;
          this.monthChart.push(element);
        });
        console.log('datasChart', this.datasChart)
        console.log('monthChart', this.monthChart)

        //==> header table chart
        this.headerTableChart = [];
        let countTableChart = 0;
        this.taxAmsList[e.idxArr].groupYearMonth.forEach(element => {
          if (countTableChart < Number(this.formGroup.get('monthNum').value)) {
            let month = element.split(" ");
            console.log('month', month)
            this.headerTableChart.push(month[0]);
          }
          countTableChart++;
        })
        console.log('headerTableChart', this.headerTableChart)

        this.bodyTableChart = this.taxAmsList[e.idxArr].dataTableGraph.filter(row => {

          for (let i = 0; i < row.length; i++) {
            if (i > 0)
              if (Utils.isNotNull(row[i]))
                row[i] = Utils.moneyFormat(row[i]);
          }

          return row;
        });
        console.log('bodyTableChart', this.bodyTableChart);

        if (this.myBarChart != null) {
          this.myBarChart.destroy();
        }
        this.barChart();
      }
    }).modal('show')
  }


  //================ end========================
  ngOnDestroy(): void {
    this.dataStore.unsubscribe();
  }
  ngOnInit() {
    this.monthChart = [];
    this.monthTable = []
    this.headerTable = {
      label: LABEL_TH,
      rowspan: [1, 1, 1, 1, 1, 1, 1],
      colspan: [1, 1, 1, 1, 1, 1, 1],
      labelSub: []
    }
    this.body = {
      data: [],
      class: []
    };
    this.bodyTable = [];
    this.recordTotal = 0;

    console.log('body', this.body)
    console.log('bodyTable', this.bodyTable)
  }
  ngAfterViewInit(): void {

    this.dataStore = this.store.select(state => state.ope07).subscribe(res => {
      console.log('ngOnInit 0702 store ==>', res)

      this.monthChart = [];
      this.monthTable = [];
      this.formGroup.patchValue({
        taxType: res.formSearch.taxType,
        checkType: res.formSearch.checkType,
        budgetYear: res.formSearch.budgetYear,
        monthStart: res.formSearch.monthStart,
        monthEnd: res.formSearch.monthEnd,
        previousYear: res.formSearch.previousYear,
        newRegId: res.formSearch.newRegId,
        cusFullname: res.formSearch.cusFullname,
        monthNum: res.formSearch.monthNum,
        facFullname: res.formSearch.facFullname,
      })

      //==> get data table
      if (Utils.isNotNull(this.formGroup.get('monthStart').value) && Utils.isNotNull(this.formGroup.get('monthEnd').value)) {
        this.getDataTable(this.formGroup);
      }

      // ==> calculate month
      if (res.formSearch.checkType == '2') {

        //==> start calculate date
        let dateTh = this.formGroup.get('monthStart').value.split("/");

        for (let i = 0; i < Number(this.formGroup.get('previousYear').value); i++) {

          let dateEn = dateTh[0] + "/" + String(Number(dateTh[1] - 543 - i));
          var momentMonthStart = moment(dateEn, 'MMYYYY');
          let addMonth = momentMonthStart.clone();

          for (let j = 0; j < this.formGroup.get('monthNum').value; j++) {
            addMonth = momentMonthStart.clone().add(j, 'M');
            let month = moment(addMonth).format('MM/YYYY');
            let m = month.split("/")
            this.monthTable.push(TextDateTH.monthsShort[Number(m[0]) - 1] + " " + (Number(m[1]) + 543))
            this.monthChart.push(TextDateTH.monthsShort[Number(m[0]) - 1] + " " + (Number(m[1]) + 543))
          }
        }
        console.log('monthTable', this.monthTable)

        console.log('month 2==>', this.monthChart)
        console.log('month 2==>', this.monthTable)
      }
      this.backgroundColor = [];
      this.datasChart = [];

      console.log('backgroundColor', this.backgroundColor)
      console.log('datas', this.datasChart)
      if (this.myBarChart != null) {
        this.myBarChart.destroy();
      }
      this.barChart();

      setTimeout(() => {
        $("#taxType").dropdown('set selected', 'A2')
      }, 200);
    })


  }
  createForm() {
    this.formGroup = this.formBuilder.group({
      taxType: [''],
      checkType: [''],
      budgetYear: [''],
      monthStart: [''],
      monthEnd: [''],
      previousYear: [''],
      newRegId: [''],
      cusFullname: [''],
      monthNum: [0],
      facFullname: [''],
      start: [0],
      length: [10],
    })
  }

  search() {
    console.log('search ==> ', this.formGroup.value)
  }

  previousYearChange(e) {
    if (e.target.value < 1) {
      this.formGroup.get('previousYear').patchValue(1)
      return e.target.value = 1;
    }
  }

  barChart() {

    var canvas: any = document.getElementById("barChart");
    var ctx = canvas.getContext("2d");
    this.myBarChart = new Chart(ctx, {
      type: 'bar',
      data: {
        datasets: [{
          //data: this.datasChart,
          data: this.datasChart,
          backgroundColor: this.backgroundColor,
          borderColor: this.backgroundColor
        }],

        // These labels appear in the legend and in the tooltips when hovering different arcs
        labels: this.monthChart
      },
      options: {
        hover: {
          mode: false
        },
        legend: {
          display: false,
          labels: {
            fontColor: '#2E9AFE',
          }
        },
        tooltips: {
          callbacks: {
            label: (tooltipItem, data) => {
              return Utils.moneyFormatDecimal(tooltipItem.yLabel);
            }
          }
        },
        scales: {

          xAxes: [{
            stacked: false,
            beginAtZero: true,
            ticks: {
              stepSize: 1,
              min: 0,
              autoSkip: false
            }
          }],
          yAxes: [{
            stacked: true,
            beginAtZero: true,
            ticks: {
              callback: (label, index, labels) => {
                return Utils.moneyFormatDecimal(label);
              }
            }
          }]
        }
      }
    });

  }

  //======================= backend =========================

  getDataTable(formGroup: FormGroup) {
    //if (Utils.isNotNull(this.formGroup.get('budgetYear').value) && Utils.isNotNull(this.formGroup.get('previousYear').value)) {
    this.loading = true;
    console.log('getDataTable formGroup', formGroup.value);
    this.ajax.doPost("oa/07/reg4000/02", formGroup.value).subscribe((res: ResponseData<Response07Vo>) => {
      console.log('Res reg4000', res);

      // ==> add labelSub
      // this.years
      let labelSub = [];
      let classCol = [];
      for (let i = 0; i < 5; i++) {
        if (i == 3) {

          classCol.push('text-right');
        } else {
          classCol.push('text-left');
        }
      }


      if (res.data.dataList.length == 0) {
        labelSub = []
      } else {

        labelSub = res.data.dataList[0].groupYearMonth;
      }
      this.monthTable = labelSub;
      this.monthTable.forEach(element => {
        classCol.push('text-right');
      });

      this.headerTable = {
        label: LABEL_TH,
        rowspan: [2, 2, 2, 2, 2, 2, 2, 1],
        colspan: [1, 1, 1, 1, 1, 1, 1, labelSub.length],
        labelSub: labelSub
      }

      // ==> add body
      this.recordTotal = res.data.count;
      console.log('dataToTal', this.recordTotal);

      this.bodyTable = [];
      this.body = { data: [], class: [] }

      if (res.data != null) {
        this.taxAmsList = res.data.dataList;
        res.data.dataList.forEach(element => {
          let row = [];
          row.push(element.newRegId);
          row.push(element.facFullname);
          row.push(element.secDesc + " / " + element.areaDesc);
          row.push(Utils.moneyFormatDecimal(element.regCapital));
          row.push(element.dutyDesc);

          for (let i = 0; i < labelSub.length; i++) {

            row.push(Utils.moneyFormatDecimal(element.groupTaxPay[i]));
            //row.push(Utils.moneyFormatDecimal(element.perceneDiff[i]));
          }

          this.body = {
            data: row,
            class: classCol
          };

          this.bodyTable.push(this.body);
        });
      }
      this.loading = false;
    })
    // }

  }
}
