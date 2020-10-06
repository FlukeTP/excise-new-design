import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Chart } from 'chart.js';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HeaderTable, BodyTable } from '../table/table.model';
import { AjaxService } from 'services/ajax.service';
import { MessageBarService } from 'services/message-bar.service';
import { Store } from '@ngrx/store';
import { TextDateTH, formatter } from 'helpers/datepicker';
import { Vo, Response07Vo } from './op0703.model';
import { ResponseData } from 'models/response-data.model';
import { Utils } from 'helpers/utils';
declare var $: any;

const LABEL_TH = ['กราฟ', 'ลำดับ', 'เลขทะเบียนสรรพสามิต', 'ชื่อผู้ประกอบการ', 'ภาค/พื้นที่', 'ทุนจดทะเบียน', 'พิกัดสินค้า/บริการ', 'การชำระภาษี (บาท)'];
@Component({
  selector: 'app-ope0703',
  templateUrl: './ope0703.component.html',
  styleUrls: ['./ope0703.component.css']
})

export class Ope0703Component implements OnInit, AfterViewInit, OnDestroy {

  formGroup: FormGroup
  loading: boolean = false;
  headerTable: HeaderTable;
  bodyTable: BodyTable[] = [];
  body: BodyTable

  dataStore: any;
  taxAmsList: Vo[] = [];
  diffTaxList: string[] = [];
  //==> Chart
  monthNum: number = 0;
  years: string[] = [];
  backgroundColor: string[] = []
  datasChart: number[] = []
  datasChartForTable: string[] = []
  recordTotal: number = 0;
  myBarChart: any;
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

    $("#graph").modal({
      onVisible: () => {
        console.log('graphOnClick', e)
        console.log('datas', this.taxAmsList)
        console.log('datas', this.taxAmsList[e.idxArr])
        this.datasChart = [];
        this.backgroundColor = [];
        this.datasChartForTable = [];
        this.formGroup.get('facFullname').patchValue(this.taxAmsList[e.idxArr].facFullname);

        this.diffTaxList = [];
        this.taxAmsList[e.idxArr].perceneDiff.forEach(element => {

          this.diffTaxList.push(element);
        });
        console.log('diffTaxList', this.diffTaxList)
        this.taxAmsList[e.idxArr].taxPayList.forEach(element => {
          this.datasChartForTable.push(Utils.moneyFormatDecimal(element))
          this.datasChart.push(Number(element))
          this.backgroundColor.push('#2E9AFE');
        });
        console.log('datasChart', this.datasChart)

        if (this.myBarChart != null) {
          this.myBarChart.destroy();
        }
        this.barChart();
      }
    }).modal('show');
  }


  //================ end========================
  ngOnDestroy(): void {
    this.dataStore.unsubscribe();
  }
  ngOnInit() {
    this.headerTable = {
      label: LABEL_TH,
      rowspan: [1, 1, 1, 1, 1, 1, 1, 1],
      colspan: [1, 1, 1, 1, 1, 1, 1, 1],
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

    //ChartJs
    this.dataStore = this.store.select(state => state.ope07).subscribe(res => {
      this.years = [];
      this.diffTaxList = [];
      this.datasChartForTable = [];
      console.log('ngOnInit store ==>', res)
      this.formGroup.patchValue({
        taxType: res.formSearch.taxType,
        checkType: res.formSearch.checkType,
        budgetYear: res.formSearch.budgetYear,
        monthStart: res.formSearch.monthStart,
        monthEnd: res.formSearch.monthEnd,
        previousYear: res.formSearch.previousYear,
        newRegId: res.formSearch.newRegId,
        cusFullname: res.formSearch.cusFullname,
        facFullname: res.formSearch.facFullname,
      })

      // ==> get data table
      this.getDataTable(this.formGroup);

      // ==> calculate month
      let year = parseInt(this.formGroup.get('budgetYear').value);
      if (res.formSearch.checkType == '1') {
        let yearNum = parseInt(this.formGroup.get('previousYear').value);
        for (let i = 0; i < yearNum; i++) {
          let y = year - (yearNum - (i + 1));
          this.years.push(String(y));
        }
        console.log('month 1==>', this.years)
      }

      //chart
      this.backgroundColor = [];
      this.datasChart = [];
      if (this.myBarChart != null) {
        this.myBarChart.destroy();
      }
      this.barChart();

      setTimeout(() => {
        $("#taxType").dropdown('set selected', 'A3')
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
      start: [0],
      length: [10],
      facFullname: ['']
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
          data: this.datasChart,
          backgroundColor: this.backgroundColor,
          borderColor: this.backgroundColor
        }],

        // These labels appear in the legend and in the tooltips when hovering different arcs
        labels: this.years
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
    if (Utils.isNotNull(this.formGroup.get('budgetYear').value) && Utils.isNotNull(this.formGroup.get('previousYear').value)) {

      this.ajax.doPost("oa/07/reg4000/03", formGroup.value).subscribe((res: ResponseData<Response07Vo>) => {
        console.log('Res reg4000', res);

        // ==> add labelSub
        this.years
        let labelSub = [];
        let classCol = [];
        for (let i = 0; i < 5; i++) {
          if (i == 3) {

            classCol.push('text-right');
          } else {
            classCol.push('text-left');
          }
        }
        this.years.forEach(element => {
          labelSub.push(element);
          //labelSub.push(PERCEN_DIFF);
          classCol.push('text-right');
          //classCol.push('text-right');
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

            for (let i = 0; i < this.years.length; i++) {
              row.push(Utils.moneyFormatDecimal(element.taxPayList[i]));
              //row.push(Utils.moneyFormatDecimal(element.perceneDiff[i]));
            }

            this.body = {
              data: row,
              class: classCol
            };

            this.bodyTable.push(this.body);
          });
        }

      })
    }

  }
}
