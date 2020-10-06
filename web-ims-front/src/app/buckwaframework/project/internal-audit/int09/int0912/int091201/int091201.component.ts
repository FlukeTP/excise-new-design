import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Int091201Service } from './int091201.service';
import { TextDateTH, formatter } from 'helpers/datepicker';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { AjaxService } from 'services/ajax.service';
import { MessageBarService } from 'services/message-bar.service';
import { Router } from '@angular/router';

declare let $: any
@Component({
  selector: 'app-int091201',
  templateUrl: './int091201.component.html',
  styleUrls: ['./int091201.component.css'],
  providers: [Int091201Service]
})

export class Int091201Component implements OnInit, AfterViewInit {
  submitted = false
  loading = false
  monthList: any
  paperList: any
  dataList: any
  formSearch: FormGroup
  formSave: FormGroup
  hdrData: any
  forms: FormGroup = new FormGroup({})
  iaAuditWorkingD1List: FormArray = new FormArray([]);
  sectors: any
  areas: any
  branch: any
  showDepartDtl = false
  departDtl: any
  yearPick: any
  constructor(
    private selfService: Int091201Service,
    private fb: FormBuilder,
    private ajax: AjaxService,
    private messageBar: MessageBarService,
    private router: Router,
  ) {
    this.getSector()
    // this.forms = this.fb.group({
    //   datas: this.fb.array([])
    // });
    // this.datas = this.forms.get('datas') as FormArray
    this.formSearch = this.fb.group({
      iaAuditWorkingD1List: this.fb.array([]),
      sector: ['', Validators.required],
      area: [''],
      branch: [''],
      auWorkingMonth: ['', Validators.required],
      auPetitionNo: ['', Validators.required],
      auditWorkingNo: [''],
      workingConditionText: [''],
      workingCriteriaText: [''],
    })
    this.iaAuditWorkingD1List = this.formSearch.get('iaAuditWorkingD1List') as FormArray
  }


  ngOnInit() {
    // this.selfService.getMonthService().then(data => {
    //   this.monthList = data
    //   console.log('monthList => ', data)
    // })
    // this.searchData()
    this.getAuditWorkingNo()
  }

  ngAfterViewInit(): void {
    $('.ui.dropdown').dropdown()
    this.calendar()
  }

  calendar() {
    $('#monthly').calendar({
      type: 'month',
      text: TextDateTH,
      formatter: formatter('month-year'),
      onChange: (date, text, mode) => {
        this.formSearch.patchValue({
          auWorkingMonth: text
        })
      }
    })
  }

  onChangeSector(e) {
    // set to all area
    $('#area').val('0');
    this.formSearch.patchValue({ area: '0' });
    // $('#area').dropdown('restore defaults');
    this.areas = []
    if ('0' !== e.target.value && '' !== e.target.value) {
      this.getArea(e.target.value)
    }
  }

  onChangeArea(e) {
    // set to all area
    $('#branch').val('0');
    this.formSearch.patchValue({ branch: '0' });

    // $('#branch').dropdown('restore defaults');
    this.branch = [];
    if ('0' !== e.target.value && '' !== e.target.value) {
      this.getBranch(e.target.value);
    }
  }

  getSector() {
    this.selfService.getSectorService().then(data => {
      this.sectors = data
    })
  }

  getArea(officeCode) {
    this.selfService.getAreaService(officeCode).then(data => {
      this.areas = data
    })
  }

  getBranch(officeCode) {
    this.selfService.getBranchService(officeCode).then(data => {
      this.branch = data
    })
  }

  getAuditWorkingNo() {
    this.selfService.getAuditWorkingNoService().then(data => {
      console.log('AuditWorkingNo => ', data);
      this.paperList = data
    })
  }

  searchData() {
    if (this.showDepartDtl) {
      return
    }
    // this.formSearch.reset()
    this.formSearch.patchValue({
      workingConditionText: null,
      workingCriteriaText: null
    })
    $('#auditWorkingNo').dropdown('clear')
    this.loading = true
    this.selfService.getDataList(this.formSearch.value).then(data => {
      this.dataList = data
      this.iaAuditWorkingD1List = this.formSearch.get('iaAuditWorkingD1List') as FormArray
      this.iaAuditWorkingD1List.patchValue([])
      for (let i = this.iaAuditWorkingD1List.length - 1; i >= 0; i--) {
        this.iaAuditWorkingD1List.removeAt(i)
      }
      for (let i = 0; i < this.dataList.length; i++) {
        this.iaAuditWorkingD1List.push(
          this.fb.group({
            personName: [this.dataList[i].userName],
            personPosName: [this.dataList[i].userPosition],
            workOutDay: [this.dataList[i].day],
            auWorkingRemarks: [],
            resultAllowanceFlag: ['Y'],
            resultAccomFeeFlag: ['Y'],
            resultTransportFlag: ['Y'],
          })
        )
      }
      this.loading = false
    })
  }

  saveData = () => {
    console.log('save => ', this.formSearch.value);
    // return
    console.log(this.iaAuditWorkingD1List);
    if (this.iaAuditWorkingD1List.value.length === 0) {
      this.messageBar.errorModal('ไม่พบข้อมูลที่ต้องการบันทึก')
      return
    }
    if (this.formSearch.invalid) {
      this.submitted = true
      return
    }
    this.submitted = false
    this.messageBar.comfirm(confirm => {
      if (confirm) {
        this.selfService.saveIaAuditWorkingService(this.formSearch.value).then(() => {
          this.formSearch.reset()
          $('#monthlyInput').val('')
          $('#sector').dropdown('clear')
          $('#area').dropdown('clear')
          $('#branch').dropdown('clear')
          this.iaAuditWorkingD1List = this.formSearch.get('iaAuditWorkingD1List') as FormArray
          this.iaAuditWorkingD1List.patchValue([])
          for (let i = this.iaAuditWorkingD1List.length - 1; i >= 0; i--) {
            this.iaAuditWorkingD1List.removeAt(i)
          }
          this.getAuditWorkingNo()
        })
      }
    }, 'ยืนยันการบันทึก')
  }

  editData = () => {
    console.log('editData => ', this.formSearch.value);
    // return
    if (this.formSearch.invalid) {
      this.submitted = true
      return
    }
    this.submitted = false
    this.messageBar.comfirm(confirm => {
      if (confirm) {
        this.loading = true
        this.selfService.editIaAuditWorkingService(this.formSearch.value).then(() => {
          this.loading = false
          this.formSearch.reset()
          $('#monthlyInput').val('')
          $('#sector').dropdown('clear')
          $('#area').dropdown('clear')
          $('#branch').dropdown('clear')
          this.iaAuditWorkingD1List = this.formSearch.get('iaAuditWorkingD1List') as FormArray
          this.iaAuditWorkingD1List.patchValue([])
          for (let i = this.iaAuditWorkingD1List.length - 1; i >= 0; i--) {
            this.iaAuditWorkingD1List.removeAt(i)
          }
          this.getAuditWorkingNo()
        }).catch(() => {
          this.loading = false
        })
      }
    }, 'ยืนยันการบันทึก')
  }

  searchAuditNo() {
    if (!this.formSearch.get('auditWorkingNo').value) {
      return
    }
    this.loading = true
    this.selfService.getDtlService(this.formSearch.get('auditWorkingNo').value).then(data => {
      this.loading = false
      console.log('res => ', data);

      this.dataList = data
      this.departDtl = this.dataList.exciseDepartmentVo
      this.hdrData = this.dataList.iaAuditWorkingH
      this.setYearPick(this.hdrData.auWorkingMonth)
      this.dataList = this.dataList.iaAuditWorkingD1List
      this.formSearch.patchValue({
        workingConditionText: this.hdrData.workingConditionText,
        workingCriteriaText: this.hdrData.workingCriteriaText,
      })

      this.iaAuditWorkingD1List = this.formSearch.get('iaAuditWorkingD1List') as FormArray
      this.iaAuditWorkingD1List.patchValue([])
      for (let i = this.iaAuditWorkingD1List.length - 1; i >= 0; i--) {
        this.iaAuditWorkingD1List.removeAt(i)
      }
      for (let i = 0; i < this.dataList.length; i++) {
        this.iaAuditWorkingD1List.push(
          this.fb.group({
            iaAuditWorkingD1Id: [this.dataList[i].iaAuditWorkingD1Id],
            personName: [this.dataList[i].personName],
            personPosName: [this.dataList[i].personPosName],
            workOutDay: [this.dataList[i].workOutDay],
            auWorkingRemarks: [this.dataList[i].auWorkingRemarks],
            resultAllowanceFlag: [this.dataList[i].resultAllowanceFlag],
            resultAccomFeeFlag: [this.dataList[i].resultAccomFeeFlag],
            resultTransportFlag: [this.dataList[i].resultTransportFlag],
          })
        )
      }
      this.showDepartDtl = true
    }).catch(() => {
      this.loading = false
    })
  }

  setYearPick(monthYear) {
    const year = parseInt(monthYear.substring(0, 4).toString(), 10) + 543
    const month = monthYear.substring(4, 6)
    this.yearPick = `${month}/${year}`
  }

  invalidDataControl(control: string) {
    return this.formSearch.get(control).invalid && (this.submitted)
  }

  clearDataHead() {
    // clear Data
    this.submitted = false
    this.showDepartDtl = false
    this.formSearch.reset()
    $('#monthlyInput').val('')
    $('#sector').dropdown('clear')
    $('#area').dropdown('clear')
    $('#branch').dropdown('clear')
    $('#auditWorkingNo').dropdown('clear')
    this.iaAuditWorkingD1List = this.formSearch.get('iaAuditWorkingD1List') as FormArray
    this.iaAuditWorkingD1List.patchValue([])
    for (let i = this.iaAuditWorkingD1List.length - 1; i >= 0; i--) {
      this.iaAuditWorkingD1List.removeAt(i)
    }
    setTimeout(() => {
      $('.ui.dropdown').dropdown()
    }, 100);
  }

  showDetial() {
    let yearMonth = this.formSearch.value.auWorkingMonth
    yearMonth = yearMonth.toString().split('/')
    yearMonth = yearMonth[1] + yearMonth[0]
    let offCode = this.formSearch.value.sector

    if (!this.formSearch.value.branch || this.formSearch.value.branch === '0') {
      offCode = this.formSearch.value.area
    }
    if (!this.formSearch.value.area || this.formSearch.value.area === '0') {
      offCode = this.formSearch.value.sector
    }
    if (this.formSearch.value.branch && this.formSearch.value.branch !== '0') {
      offCode = this.formSearch.value.branch
    }
    if (!offCode || !yearMonth) {
      this.messageBar.errorModal('กรุณาเลือกสำนักงานและเดือน')
      return
    }
    // return
    this.router.navigate(['/int09/12/02'], {
      queryParams: {
        yearMonth: yearMonth,
        offCode: offCode
      }
    })
  }
}
