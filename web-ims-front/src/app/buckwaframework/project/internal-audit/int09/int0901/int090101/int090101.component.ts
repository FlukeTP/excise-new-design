import { Component, OnInit, AfterViewInit, AfterViewChecked } from '@angular/core';
import { Router } from '@angular/router';
import { Utils } from 'helpers/utils';
import { MessageBarService } from 'services/message-bar.service';
import { AuthService } from 'services/auth.service';
import { Int0901011Service } from './int090101-1.service';
import { BreadCrumb } from 'models/index';
import { From } from './form.model';
import { Int0901013Service } from './int090101-3.service';
import { TextDateTH, formatter } from 'helpers/datepicker';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';
import { AjaxService } from 'services/ajax.service';

declare var $: any;
@Component({
  selector: 'app-int090101',
  templateUrl: './int090101.component.html',
  styleUrls: ['./int090101.component.css']
})
// tslint:disable: max-line-length
export class Int090101Component implements OnInit, AfterViewInit, AfterViewChecked {
  form: From = new From();
  sectorList: any;
  araeList: any;
  yearList: any;
  compareForm: FormGroup
  dataTableData: any
  loading = true
  submitted = false
  periodStart = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  periodEnd = this.periodStart
  summary = []
  // value init
  breadcrumb: BreadCrumb[] = [
    { label: 'ตรวจสอบภายใน', route: '#' },
    { label: 'ออกตรวจ', route: '#' },
    { label: 'ตรวจสอบเบิกจ่าย', route: '#' },
    { label: 'ตรวจสอบข้อมูลค่าใช้จ่าย', route: '#' },
    { label: 'ตรวจสอบข้อมูลค่าใช้จ่าย', route: '#' }
  ];
  datas: any;

  constructor(
    private int0901013Service: Int0901013Service,
    private int0901011Service: Int0901011Service,
    private router: Router,
    private authService: AuthService,
    private message: MessageBarService,
    private fb: FormBuilder,
    private ajax: AjaxService
  ) {
    this.compareForm = this.fb.group({
      startYear: ['', Validators.required],
      endYear: ['', Validators.required],
      periodMonthStart: ['', Validators.required],
      periodMonthEnd: ['', Validators.required],
      year: [''],
      sector: ['', Validators.required],
      area: ['', Validators.required],
    })
  }

  ngOnInit() {
    // this.authService.reRenderVersionProgram('INT-06130');
    // this.callDropdown();
  }

  ngAfterViewInit() {
    // this.dataTable();
    this.getSector();
    // this.year();
    this.calendar();
    this.innitDatable()
    // setTimeout(() => {
    //   $('.ui.dropdown.rfl').css('min-width', '120px');
    // }, 300);
  }

  ngAfterViewChecked() {
    $('.ui.dropdown.rfl').css('min-width', '120px');
  }
  changePeraid(flag: string) {
    const yearStart = this.compareForm.value.startYear
    const yearEnd = this.compareForm.value.endYear
    const periodStart = this.compareForm.value.periodMonthStart
    const periodEnd = this.compareForm.value.periodMonthEnd
    if (yearStart === yearEnd && periodStart && yearStart && yearEnd) {
      this.periodEnd = this.periodStart.slice(Number(periodStart) - 1);
    } else {
      this.periodEnd = this.periodStart
    }
    if (Number(periodStart) > Number(periodEnd) && yearStart && periodEnd && periodStart) {
      $('#endYear').calendar('clear');
      $('#endYear').calendar('setting', 'minDate', new Date((Number(yearStart) + 1).toString()));
      $('#endYear').calendar('refresh');
    } else if (yearStart) {
      $('#endYear').calendar('clear');
      $('#endYear').calendar('setting', 'minDate', new Date(yearStart));
      $('#endYear').calendar('refresh');
    } else {
      $('#endYear').calendar('setting', 'minDate', new Date());
      $('#endYear').calendar('refresh');
    }
  }

  calendar() {
    $('#startYear').calendar({
      type: 'year',
      // endCalendar: $('#endYear'),
      initialDate: new Date(),
      text: TextDateTH,
      formatter: formatter('year'),
      onChange: (date, text) => {
        if (text) {
          this.changePeraid('year')
        }
        this.compareForm.patchValue({ startYear: text })
      }
    });
    $('#endYear').calendar({
      type: 'year',
      startCalendar: $('#startYear'),
      initialDate: new Date(),
      // minDate: this.endYear,
      text: TextDateTH,
      formatter: formatter('year'),
      onChange: (date, text) => {
        if (text) {
          this.changePeraid('year')
        }
        this.compareForm.patchValue({ endYear: text })
      }
    });
    $('#year').calendar({
      type: 'year',
      initialDate: new Date(),
      text: TextDateTH,
      formatter: formatter('year'),
      onChange: (date, text) => {
        this.compareForm.patchValue({ year: text })
      }
    });
  }

  getSector = () => {
    $('#area').dropdown('restore defaults');
    this.loading = true
    this.compareForm.patchValue({
      sector: null, area: null
    })
    this.int0901013Service.sector()
      .then((sectorList) => {
        this.sectorList = sectorList
        this.loading = false
      })
      .catch(() => {
        this.loading = false
      });
  }

  changeSector = (e) => {
    this.loading = true
    this.araeList = null;
    this.compareForm.patchValue({
      area: null
    })
    if (e.target.value != null && e.target.value !== '') {
      $('#area').dropdown('restore defaults');
      this.int0901013Service.area(this.compareForm.value.sector)
        .then((areaList) => {
          this.araeList = areaList
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        });
    }
  }

  year = () => {
    this.int0901013Service.year(this.callBackYear);
  }
  search = () => {

    if (Utils.isNull($('#sector').val())) {
      this.message.alert('กรุณาระบุ สำนักงานสรรพสามิตภาค');
      return false;
    }
    if (Utils.isNull($('#area').val())) {
      this.message.alert('กรุณาระบุ สำนักงานสรรพสามิตพื้นที่');
      return false;
    }
    if (Utils.isNull($('#year').val())) {
      this.message.alert('กรุณาระบุ ปีงบประมาณ');
      return false;
    }

    this.int0901013Service.search(this.int0901011Service);
  }

  clear = async () => {
    await this.int0901013Service.clear();
    await $('.ui.dropdown').dropdown('restore defaults');

  }

  dataTable = () => {
    // this.int0901013Service.dataTable();
  }

  callDropdown = () => {
    $('.ui.dropdown').dropdown();
  }

  callBackSector = (result) => {
    this.sectorList = result;
  }
  callBackArea = (result) => {
    this.araeList = result;
  }
  callBackYear = (result) => {
    this.yearList = result;
  }

  onCompare() {
    // this.compareForm.patchValue({ endYear: $('#endYearInput').val() })
    if (this.compareForm.invalid) {
      this.submitted = true
      this.message.errorModal('กรุณากรอกข้อมูลให้ครบ')
      return
    }
    this.loading = true
    this.submitted = false
    this.int0901013Service.compareService(this.compareForm.value)
      .then((data) => {
        this.datas = data
        this.summary = this.int0901013Service.summaryTable(data)
        console.log(this.summary);
        // this.dataTableData.data.reload();
        this.dataTableData.clear().draw()
        this.dataTableData.rows.add(this.datas).draw()
        this.dataTableData.columns.adjust().draw()
        this.loading = false
      })
      .catch(() => {
        this.loading = false
      })
  }

  innitDatable() {
    this.dataTableData = this.int0901013Service.dataTableSerive()
  }

  validateForm(control) {
    return this.compareForm.get(control).invalid && (this.compareForm.get(control).touched || this.submitted)
  }

  getExportFile() {

    this.submitted = true
    if (this.compareForm.invalid) {
      this.submitted = true
      this.message.errorModal('กรุณากรอกข้อมูลให้ครบ')
      return
    }
    this.submitted = false
    this.ajax.download(`ia/int09/01/01/year/export-${this.compareForm.value.area}-${this.compareForm.value.startYear}-${this.compareForm.value.periodMonthStart}-${this.compareForm.value.endYear}-${this.compareForm.value.periodMonthEnd}`)
  }
}
