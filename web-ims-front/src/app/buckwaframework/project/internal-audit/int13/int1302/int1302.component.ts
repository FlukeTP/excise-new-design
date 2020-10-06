import { Component, OnInit, AfterViewInit } from '@angular/core';
import { BreadCrumb } from 'models/breadcrumb.model';
import { AjaxService } from 'services/ajax.service';
import { TextDateTH, formatter } from 'helpers/datepicker';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageBarService, MessageService } from 'services/index';
import { ResponseData } from 'models/response-data.model';
import { DepartmentDropdownService } from 'services/department-dropdown.service';

const URL = {
  GET_AUDITTXINSUR_NO_LIST: 'ia/int06/14/01/get-dropdown',
  SEARCH: AjaxService.CONTEXT_PATH + 'ia/int06/14/01/filter',
  GET_HEADER: 'ia/int06/14/02/get-data-header',
  SEARCH_DATA: 'ia/int13/02/findData',
  SAVE_DATA: 'ia/int13/02/saveData',
  EDIT_DATA: 'ia/int13/02/editData',
  GET_PY1_LIST: 'ia/int13/02/getPy1NoList',
  FIND_BY_PY1_NO: 'ia/int13/02/find-by-py1No/',
}

declare var $: any;
@Component({
  selector: 'app-int1302',
  templateUrl: './int1302.component.html',
  styleUrls: ['./int1302.component.css']
})
export class Int1302Component implements OnInit, AfterViewInit {
  breadcrumb: BreadCrumb[] = [
    { label: 'ตรวจสอบภายใน', route: '#' },
    { label: 'ออกตรวจ', route: '#' },
    { label: 'ตรวจสอบแบบประเมินระบบควบคุมภายใน', route: '#' },
    { label: 'รายงานผลการประเมินองค์ประกอบการควบคุมภายใน (แบบ ปย.1)', route: '#' }
  ];

  formHeader: FormGroup = new FormGroup({})
  formSave: FormGroup = new FormGroup({})
  sectors: any[] = []
  areas: any[] = []
  branch: any[] = []
  auditTxinsurNoList: any[] = []
  dataHdr: any
  dataDtl: any
  dataTable: any
  searchSubmitted = false
  py1List: any
  editState = false
  exciseDepartment: any
  disableDepartment = false
  yearInput: any
  loading = false;

  constructor(
    private ajax: AjaxService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private msg: MessageBarService,
    private router: Router,
    private department: DepartmentDropdownService
  ) { }

  ngOnInit() {
    this.initialVariable();
    this.department.getSector().subscribe(response => { this.sectors = response.data });
    this.getAuditTxinsurNo();
  }

  ngAfterViewInit(): void {
    $('.ui.dropdown').dropdown()
    // .css("width", "100%");
    this.calendar()
    this.initialDataTable()
    this.getPy1List()
  }

  getPy1List() {
    this.ajax.doGet(URL.GET_PY1_LIST).subscribe((response: ResponseData<any>) => {
      this.py1List = response.data
    })
  }
  initialVariable() {
    this.formHeader = this.fb.group({
      sector: ['', Validators.required],
      area: ['', Validators.required],
      branch: [''],
      officeCode: [''],
      auditTxinsurNo: [''],
      flagSearch: ['N'],

      budgetYear: [MessageService.budgetYear(), Validators.required],
    })

    this.formSave = this.fb.group({
      officeCode: [''],
      buggetYear: [''],
      overallResules: [''],
      iaAuditPy1DList: [null],
      auditPy1No: [''],

      auditResult: [''],
      conditionText: [''],
      criteriaText: [''],
    })
  }

  initialDataTable() {
    // ==> DataTable <==
    this.dataTable = $('#dataTable').DataTableTh({
      lengthChange: false,
      searching: false,
      processing: true,
      ordering: false,
      scrollX: true,
      data: this.dataDtl,
      columns: [
        {
          data: 'topicName',
          className: 'ui left aligned',
          render: function (data, type, row, meta) {
            let topicName = ''
            if (row.topicName) {
              topicName = row.topicName + '<br>' + row.topicDesc
            } else if (!row.topicName) {
              topicName = row.topicDesc
            }
            return topicName
          }
        }, {
          data: 'topicAnswer',
          className: 'ui left aligned',
        }, {
          data: 'topicName',
          className: 'ui left aligned',
          render: function (data, type, row, meta) {
            // Check Data if was data, It will ckecked
            let auditResultY = ''
            let auditResultN = ''
            if (row.auditResult) {
              if (row.auditResult === 'Y') {
                auditResultY = 'checked'
              } else if (row.auditResult === 'N') {
                auditResultN = 'checked'
              }
            }
            // Checked Data And Set name from rom number
            const radio =
              `<div class="ui form">
              <div class="grouped fields">
                <div class="field">
                  <div class="ui radio checkbox">
                    <input type="radio" name="checkbox${meta.row}" value="Y" ${auditResultY}>
                    <label>มีการดำเนินการจริง</label>
                  </div>
                </div>
                <div class="field">
                  <div class="ui radio checkbox">
                    <input type="radio" name="checkbox${meta.row}" value="N" ${auditResultN}>
                    <label>ไม่มี/ไม่เพียงพอ</label>
                  </div>
                </div>
              </div>
            </div>`
            return radio
          }
        },
      ],
    })
  }

  /* _________________ calendar _________________ */
  calendar() {
    $('#budgetYearCld').calendar({
      type: 'year',
      text: TextDateTH,
      formatter: formatter('year'),
      onChange: (date, text) => {
        this.formHeader.get('budgetYear').patchValue(text)
        // this.search()
      }
    }).css('width', '100%')
  }

  dropdownChange(e, flagDropdown) {
    console.log('value: ', e.target.value)
    console.log('flagDropdown: ', flagDropdown)

    if ('0' !== e.target.value && '' !== e.target.value) {
      /* _____ set office code _____ */
      if (flagDropdown === 'SECTOR') {
        this.formHeader.get('officeCode').patchValue(this.formHeader.get('sector').value)
        this.areas = []
        this.branch = []
        $('#area').dropdown('restore defaults')
        $('#branch').dropdown('restore defaults')
        this.department.getArea(this.formHeader.get('officeCode').value).subscribe(response => { this.areas = response.data })
      } else if (flagDropdown === 'AREA') {
        this.formHeader.get('officeCode').patchValue(this.formHeader.get('area').value)
        // this.formHeader.patchValue({ branch: "0" })
        this.department.getBranch(this.formHeader.get('officeCode').value).subscribe(response => { this.branch = response.data })
      } else if (flagDropdown === 'BRANCH') {
        this.formHeader.get('officeCode').patchValue(this.formHeader.get('branch').value)
      }
    }

    /* ______ auditTxinsurNo dropdown _____ */
    if (flagDropdown === 'No.') {
      this.formHeader.get('auditTxinsurNo').patchValue(e.target.value)
      this.findByPy1No(e.target.value)
    }
  }

  findByPy1No(py1No: string) {
    // (Validator) if Dropdonw change data and don't have py1No => exit Function
    if (!py1No) {
      return
    }
    this.loading = true
    this.editState = true
    this.ajax.doPost(URL.FIND_BY_PY1_NO, py1No).subscribe((response: ResponseData<any>) => {
      console.log(response)
      const datares = response.data
      this.loading = false
      // if have iaAuditPy1H
      if (datares.iaAuditPy1H) {
        this.formSave.patchValue({
          officeCode: datares.iaAuditPy1H.officeCode,
          buggetYear: datares.iaAuditPy1H.buggetYear,
          overallResules: datares.iaAuditPy1H.overallResules,
          auditPy1No: datares.iaAuditPy1H.auditPy1No,
          auditResult: datares.iaAuditPy1H.auditResult,
          conditionText: datares.iaAuditPy1H.conditionText,
          criteriaText: datares.iaAuditPy1H.criteriaText,
        })
      }
      this.dataDtl = response.data.iaAuditPy1DList
      // new draw DataTable
      this.dataTable.clear().draw()
      this.dataTable.rows.add(this.dataDtl).draw()
      this.dataTable.columns.adjust().draw()

      // if change Data Disable input DOM Template => Set Data, Show text data
      this.exciseDepartment = response.data.exciseDepartmentVo
      this.disableDepartment = true
      this.yearInput = datares.iaAuditPy1H.buggetYear
    }, err => {
      this.loading = false
      this.msg.errorModal(MessageService.MSG.FAILED_CALLBACK)
    })
  }
  /* ______________ get Dropdown ________________ */
  getAuditTxinsurNo() {
    this.ajax.doGet(`${URL.GET_AUDITTXINSUR_NO_LIST}`).subscribe((response: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS === response.status) {
        this.auditTxinsurNoList = response.data
      } else {
        this.msg.errorModal(response.message)
      }
    }, err => {
      this.msg.errorModal(MessageService.MSG.FAILED_CALLBACK)
    })
  }

  onSearch() {
    $('#auditIncNo').dropdown('clear')
    this.onClearData()
    // validator Data
    this.editState = false
    if (this.formHeader.invalid) {
      this.searchSubmitted = true
      return
    }
    this.searchSubmitted = false
    // ajax search
    this.loading = true
    this.ajax.doPost(URL.SEARCH_DATA, this.formHeader.value).subscribe((response: ResponseData<any>) => {
      this.loading = false
      if (MessageService.MSG.SUCCESS === response.status) {
        // push value form response
        this.dataHdr = response.data.wsPmPy1H
        this.dataDtl = response.data.wsPmPy1DList
        this.formSave.patchValue({
          officeCode: this.dataHdr.offCode,
          buggetYear: this.dataHdr.formYear,
          overallResules: this.dataHdr.summary,
        })

        // if success => new draw dataTable
        console.log(response)
        this.dataTable.clear().draw()
        this.dataTable.rows.add(this.dataDtl).draw()
        this.dataTable.columns.adjust().draw()
      } else {
        this.msg.errorModal(response.message)
      }
    }, err => {
      this.loading = false
      console.log(err)
      this.msg.errorModal(MessageService.MSG.FAILED_CALLBACK)
    })
  }

  onSave(flag) {
    if (this.dataDtl === undefined || this.dataDtl == null) {
      this.msg.errorModal('ไม่พบข้อมูลที่ต้องการบันทึก')
      return
    }
    this.loading = true
    const py1DtlListSave = []
    for (let i = 0; i < this.dataTable.data().length; i++) {
      const radiosDetail = document.getElementsByName('checkbox' + i)
      if (radiosDetail.length > 0) {

        // check edit or Save => and set id Edit
        let auditPy1DId = null
        if (this.dataDtl[i].auditPy1DId) {
          auditPy1DId = this.dataDtl[i].auditPy1DId
        }
        // loop all radio
        radiosDetail.forEach(ele => {
          // if this radio has checked => push value
          if ((<HTMLInputElement>ele).checked) {
            console.log((<HTMLInputElement>ele).value)
            py1DtlListSave.push({
              auditPy1DId: auditPy1DId,
              auditResult: (<HTMLInputElement>ele).value,
              formCode: this.dataDtl[i].formCode,
              offCode: this.dataDtl[i].offCode,
              topicAnswer: this.dataDtl[i].topicAnswer,
              topicCode: this.dataDtl[i].topicCode,
              topicDesc: this.dataDtl[i].topicName + '<br>' + this.dataDtl[i].topicDesc,
              topicName: this.dataDtl[i].topicName,
            })
          }
        });
        // if null both radio => set null value and push
        if (!py1DtlListSave[i]) {
          py1DtlListSave.push({
            auditPy1DId: auditPy1DId,
            auditResult: null,
            formCode: this.dataDtl[i].formCode,
            isDeleted: this.dataDtl[i].isDeleted,
            offCode: this.dataDtl[i].offCode,
            topicAnswer: this.dataDtl[i].topicAnswer,
            topicCode: this.dataDtl[i].topicCode,
            topicDesc: this.dataDtl[i].topicName + '<br>' + this.dataDtl[i].topicDesc,
            topicName: this.dataDtl[i].topicName,
          })
        }
      }
    }
    this.formSave.patchValue({
      iaAuditPy1DList: py1DtlListSave
    })

    console.log(this.formSave.value)
    // ---> check event => save or edit
    if (flag === 'save') {
      this.ajax.doPost(URL.SAVE_DATA, this.formSave.value).subscribe((response: ResponseData<any>) => {
        this.loading = false
        if (MessageService.MSG.SUCCESS === response.status) {
          this.getPy1List()
          this.onClearData()
          setTimeout(() => {
            // this.findByPy1No(this.formHeader.value.officeCode)
            $('#auditIncNo').dropdown('set selected', response.data)
          }, 500)
          console.log('TCL: onSave -> response.data', response.data)
          this.msg.successModal(response.message)
        } else {
          this.msg.errorModal(response.message)
        }
      }, err => {
        this.loading = false
        console.log(err)
        this.msg.errorModal(MessageService.MSG.FAILED_CALLBACK)
      })
    } else if (flag === 'edit') {
      this.ajax.doPut(URL.EDIT_DATA, this.formSave.value).subscribe((response: ResponseData<any>) => {
        this.loading = false
        if (MessageService.MSG.SUCCESS === response.status) {
          this.msg.successModal(response.message)
        } else {
          this.msg.errorModal(response.message)
        }
      }, err => {
        this.loading = false
        console.log(err)
        this.msg.errorModal(MessageService.MSG.FAILED_CALLBACK)
      })
    }
  }

  onClearData(flag: string = 'fromFunc') {
    // if clicked from Buttuon => clear more data
    if ('fromButton' === flag) {
      $(`.area`).dropdown('clear')
      $(`.branch`).dropdown('clear')
      $(`.sector`).dropdown('clear')
      this.branch = []
      this.areas = []
      this.disableDepartment = false
      this.formHeader.reset()
      setTimeout(() => {
        this.calendar()
        $('#budgetYearCld').calendar('set date', new Date().getFullYear() + 543)
        $('.ui.dropdown').dropdown()
      }, 100)
    }
    // clear some detail save data
    $('#auditIncNo').dropdown('clear')
    this.formSave.reset()
    this.dataDtl = null
    this.dataTable.clear().draw()
  }

  // check varidation Search Header
  invalidControl(control: string) {
    return this.formHeader.get(control).invalid && (this.formHeader.get(control).touched || this.searchSubmitted)
  }
}
