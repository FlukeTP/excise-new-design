import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Int1501Service } from './int1501.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AjaxService } from 'services/ajax.service';
import { BreadCrumb } from 'models/breadcrumb.model';
import { File } from 'models/file.model';
import { TextDateTH, formatter } from 'helpers/datepicker';
import { Utils } from 'helpers/utils';
declare let $: any;

@Component({
  selector: 'app-int1501',
  templateUrl: './int1501.component.html',
  styleUrls: ['./int1501.component.css'],
  providers: [Int1501Service]
})

export class Int1501Component implements OnInit, AfterViewInit {
  typeData: any;
  dataSave: FormGroup;
  submitted = false;
  $form: any;
  file: File[];
  dataUpload = [];
  type1_2: FormGroup;
  type3_4: FormGroup;
  saveAll: FormGroup;
  loading = true;
  dataTable1: any;
  dataTable2: any;
  dataTable3: any;
  dataTable4: any;
  periodData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  fileName: string;
  disburseunit: any;
  breadcrumb: BreadCrumb[] = [
    { label: 'ตรวจสอบภายใน', route: '#' },
    { label: 'การประเมินความเสี่ยง', route: '#' },
    { label: 'เพิ่มข้อมูลปัจจัยเสี่ยง', route: '#' },
  ];
  constructor(
    private selfService: Int1501Service,
    private formBuilder: FormBuilder,
    private ajax: AjaxService,
  ) {
    this.dataSave = this.formBuilder.group({
      typeData: ['', Validators.required],
      disburseMoney: ['', Validators.required],
      // monthly: ['', Validators.required],
      // des: ['']
    });

    this.type1_2 = this.formBuilder.group({
      period: ['', Validators.required],
      year: [null, Validators.required],
    });

    this.type3_4 = this.formBuilder.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
    });

    this.saveAll = this.formBuilder.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      period: ['', Validators.required],
      year: ['', Validators.required],
      typeData: ['', Validators.required],
      disburseMoney: ['', Validators.required],
      formData1: ['', Validators.required],
      formData2: ['', Validators.required],
      formData3: ['', Validators.required],
      formData4: ['', Validators.required],
      fileName: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.getGroupCode();
  }

  ngAfterViewInit(): void {
    $('.ui.dropdown.ia-dropdown').dropdown().css('width', '100%');
    $('#dataTableC1').hide();
    $('#dataTableC2').hide();
    $('#dataTableC3').hide();
    $('#dataTableC4').hide();
    // this.inDataTable1()
    // this.inDataTable2()
    // this.inDataTable3()
    // this.inDataTable4()
    this.findDisburseunit();
  }

  findDisburseunit() {
    this.loading = true;
    this.selfService.findDisburseunit().then((data) => {
      this.disburseunit = data;
      this.loading = false;
    }).catch(() => {
      this.loading = false;
    });
  }

  onDisbusMoney(e) {
    console.log(e);
  }

  changeType() {
    this.dataUpload = [];
    if (this.dataSave.value.typeData === 'IA_TYPE_DATA1') {
      $('#dataTableC1').show();
      $('#dataTableC2').hide();
      $('#dataTableC3').hide();
      $('#dataTableC4').hide();
      this.inDataTable1();
      this.dataTable1.clear().draw();
      setTimeout(() => {
        this.yearCalendar();
        this.dateCalendar();
      }, 100);
    } else if (this.dataSave.value.typeData === 'IA_TYPE_DATA2') {
      $('#dataTableC2').show();
      $('#dataTableC1').hide();
      $('#dataTableC3').hide();
      $('#dataTableC4').hide();
      this.inDataTable2();
      this.dataTable2.clear().draw();
      setTimeout(() => {
        this.yearCalendar();
        $('.ui.fluid.dropdown.ia-dropdown').dropdown().css('width', '100%');
      }, 100);
    } else if (this.dataSave.value.typeData === 'IA_TYPE_DATA3') {
      $('#dataTableC3').show();
      $('#dataTableC1').hide();
      $('#dataTableC2').hide();
      $('#dataTableC4').hide();
      this.inDataTable3();
      this.dataTable3.clear().draw();
      setTimeout(() => {
        this.yearCalendar();
        $('.ui.fluid.dropdown.ia-dropdown').dropdown().css('width', '100%');
      }, 100);
    } else if (this.dataSave.value.typeData === 'IA_TYPE_DATA4') {
      $('#dataTableC4').show();
      $('#dataTableC1').hide();
      $('#dataTableC2').hide();
      $('#dataTableC3').hide();
      this.inDataTable4();
      this.dataTable4.clear().draw();
      setTimeout(() => {
        this.yearCalendar();
        this.dateCalendar();
      }, 100);
    }
    $('#file').val('');
    // this.dataTable1.clear().draw()
    // this.dataTable2.clear().draw()
    // this.dataTable3.clear().draw()
    // this.dataTable4.clear().draw()
  }

  yearCalendar() {
    $('#budgetYearCld').calendar({
      type: 'year',
      text: TextDateTH,
      formatter: formatter('year'),
      onChange: (date, text) => {
        this.type1_2.get('year').patchValue(text);
        // this.search()
      }
    }).css('width', '100%');
  }

  dateCalendar() {
    $('#startDate').calendar({
      type: 'date',
      endCalendar: $('#endDate'),
      initialDate: new Date(),
      text: TextDateTH,
      formatter: formatter('ววดดปปปป'),
      onChange: (date, text) => {
        this.type3_4.get('startDate').patchValue(text);
      }
    });
    $('#endDate').calendar({
      type: 'date',
      startCalendar: $('#startDate'),
      initialDate: new Date(),
      text: TextDateTH,
      formatter: formatter('ววดดปปปป'),
      onChange: (date, text) => {
        this.type3_4.get('endDate').patchValue(text);
      }
    });
  }

  getGroupCode() {
    this.selfService.getGroupCode().then((data) => {
      console.log('TCL: Int1501Component -> getGroupCode -> data', data);
      this.typeData = data;
    });
  }

  invalidControl(control: string) {
    return this.dataSave.get(control).invalid && (this.dataSave.get(control).touched || this.submitted);
  }

  invalid1_2(control: string) {
    return this.type1_2.get(control).invalid && (this.type1_2.get(control).touched || this.submitted);
  }

  invalid3_4(control: string) {
    return this.type3_4.get(control).invalid && (this.type3_4.get(control).touched || this.submitted);
  }

  onChangeUpload = (event: any) => {
    if (event.target.files && event.target.files.length > 0) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const f = {
          name: event.target.files[0].name,
          type: event.target.files[0].type,
          value: e.target.result
        };
        this.file = [f];
      };
      reader.readAsDataURL(event.target.files[0]);
      this.onUpload(event);
    }
  }

  onUpload = (event?: any) => {
    this.loading = true;
    if ($('#file').val() === '') {
      this.selfService.errModalServie('กรุณาเลือกไฟล์ที่จะอัพโหลด');
      return;
    } else if (this.dataSave.invalid) {
      this.selfService.errModalServie('กรุณากรอกข้อมูลให้ครบ');
      return;
    } else {
      event.preventDefault();
      const form = $('#upload-form')[0];
      const formBody = new FormData(form);
      // formBody.append( 'typeData' , this.dataSave.value.typeData)
      console.log('Data Check', this.dataSave.controls.typeData);

      this.selfService.onUploadService(formBody, this.convertPath(this.dataSave.value.typeData))
        .then((data: any) => {
          this.fileName = data.fileName;
          let dataList;
          if (data.formData1) {
            dataList = data.formData1;
          } else if (data.formData2) {
            dataList = data.formData2;
          } else if (data.formData3) {
            dataList = data.formData3;
          } else if (data.formData4) {
            dataList = data.formData4;
          }
          this.dataUpload = dataList;
          console.log(this.dataUpload);
          this.newDrawDataTable(dataList, this.dataSave.value.typeData);
          this.loading = false;
        })
        .catch((error) => {
          this.dataUpload = [];
          console.log('Error : ', error);
          // this.selfService.errModalServie(error);
          this.loading = false;
        });
    }

  }

  newDrawDataTable(data: any, typeData: string) {
    if (typeData === 'IA_TYPE_DATA1') {
      this.dataTable1.clear().draw();
      this.dataTable1.rows.add(data).draw();
      this.dataTable1.columns.adjust().draw();
    } else if (typeData === 'IA_TYPE_DATA2') {
      console.log(2);
      this.dataTable2.clear().draw();
      this.dataTable2.rows.add(data).draw();
      this.dataTable2.columns.adjust().draw();
    } else if (typeData === 'IA_TYPE_DATA3') {
      console.log(3);
      this.dataTable3.clear().draw();
      this.dataTable3.rows.add(data).draw();
      this.dataTable3.columns.adjust().draw();
    } else if (typeData === 'IA_TYPE_DATA4') {
      this.dataTable4.clear().draw();
      this.dataTable4.rows.add(data).draw();
      this.dataTable4.columns.adjust().draw();
    }
  }

  disableUpload() {
    let statusDis = true;
    if (this.dataSave.value.typeData === 'IA_TYPE_DATA3' || this.dataSave.value.typeData === 'IA_TYPE_DATA2') {
      statusDis = this.dataSave.invalid || this.type1_2.invalid;
    } else if (this.dataSave.value.typeData === 'IA_TYPE_DATA1' || this.dataSave.value.typeData === 'IA_TYPE_DATA4') {
      statusDis = this.dataSave.invalid || this.type3_4.invalid;
    }
    return statusDis;
  }

  onSubmit() {
    this.submitted = true;
    if (this.dataSave.value.typeData === 'IA_TYPE_DATA3' || this.dataSave.value.typeData === 'IA_TYPE_DATA2') {
      if (this.dataSave.invalid || this.type1_2.invalid) {
        this.selfService.errModalServie('กรุณากรอกข้อมูลให้ครบ');
        return;
      }
    } else if (this.dataSave.value.typeData === 'IA_TYPE_DATA1' || this.dataSave.value.typeData === 'IA_TYPE_DATA4') {
      if (this.dataSave.invalid || this.type3_4.invalid) {
        this.selfService.errModalServie('กรุณากรอกข้อมูลให้ครบ');
        return;
      }
    }
    if (!this.dataUpload || this.dataUpload.length === 0) {
      this.selfService.errModalServie('ไม่พบข้อมูลที่บันทึกนำเข้า');
      return;
    }
    this.submitted = false;
    this.loading = true;
    this.saveAll.reset();
    this.saveAll.patchValue(this.dataSave.value, this.type3_4.value);
    this.saveAll.patchValue(this.type1_2.value);
    this.saveAll.patchValue({ 'fileName': this.fileName });
    if (this.dataSave.value.typeData === 'IA_TYPE_DATA1') {
      this.saveAll.patchValue({ 'formData1': this.dataUpload });
    } else if (this.dataSave.value.typeData === 'IA_TYPE_DATA2') {
      this.saveAll.patchValue({ 'formData2': this.dataUpload });
    } else if (this.dataSave.value.typeData === 'IA_TYPE_DATA3') {
      this.saveAll.patchValue({ 'formData3': this.dataUpload });
    } else if (this.dataSave.value.typeData === 'IA_TYPE_DATA4') {
      this.saveAll.patchValue({ 'formData4': this.dataUpload });
    }
    this.selfService.onSave(this.convertPath(this.dataSave.value.typeData), this.saveAll.value)
      .then(() => {
        this.loading = false;
      })
      .catch(() => {
        this.loading = false;
      });
  }

  inDataTable1() {
    if (this.dataTable1) {
      return;
    }
    //render check number is null or empty
    let renderNumber = function (data, type, row, meta) {
      return Utils.isNull($.trim(data))
        ? "-"
        : $.fn.dataTable.render.number(",", ".", 2, "").display(data);
    };

    //render check string is null or empty
    let renderString = function (data, type, row, meta) {
      if (Utils.isNull(data)) {
        data = "-";
      }
      return data;
    };
    this.dataTable1 = $('#dataTable1').DataTableTh({
      processing: true,
      serverSide: false,
      paging: true,
      scrollX: true,
      data: this.dataUpload,
      columns: [
        {
          className: 'ui center aligned',
          render: function (data, type, row, meta) {
            return meta.row + meta.settings._iDisplayStart + 1;
          }
        }, {
          data: 'recordDate', className: 'text-left', render: renderString
        }, {
          data: 'recodeApproveDate', className: 'text-left', render: renderString
        }, {
          data: 'type', className: 'text-left', render: renderString
        }, {
          data: 'docNo', className: 'text-right', render: renderString
        }, {
          data: 'sellerName', className: 'text-left', render: renderString
        }, {
          data: 'sellerBookBank', className: 'text-right', render: renderNumber
        }, {
          data: 'referenceCode', className: 'text-left'
        }, {
          data: 'budgetCode', className: 'text-right'
        }, {
          data: 'disbAmt', className: 'text-right', render: renderString
        }, {
          data: 'taxAmt', className: 'text-right', render: renderNumber
        }, {
          data: 'mulctAmt', className: 'text-right', render: renderNumber
        }
      ]
    });
  }
  inDataTable2() {
    if (this.dataTable2) {
      return;
    }
    //render check number is null or empty
    let renderNumber = function (data, type, row, meta) {
      return Utils.isNull($.trim(data))
        ? "-"
        : $.fn.dataTable.render.number(",", ".", 2, "").display(data);
    };

    //render check string is null or empty
    let renderString = function (data, type, row, meta) {
      if (Utils.isNull(data)) {
        data = "-";
      }
      return data;
    };
    this.dataTable2 = $('#dataTable2').DataTableTh({
      processing: true,
      serverSide: false,
      paging: true,
      scrollX: true,
      data: this.dataUpload,
      columns: [
        {
          className: 'ui center aligned',
          render: function (data, type, row, meta) {
            return meta.row + meta.settings._iDisplayStart + 1;
          }
        }, {
          data: 'accNo', className: 'text-center', render: renderString
        }, {
          data: 'accName', className: 'text-left', render: renderString
        }, {
          data: 'carryForward', className: 'text-right', render: renderNumber
        }, {
          data: 'debit', className: 'text-right', render: renderNumber
        }, {
          data: 'credit', className: 'text-right', render: renderNumber
        }, {
          data: 'bringForward', className: 'text-right', render: renderNumber
        }
      ]
    });
  }
  inDataTable3() {
    if (this.dataTable3) {
      return;
    }
    //render check number is null or empty
    let renderNumber = function (data, type, row, meta) {
      return Utils.isNull($.trim(data))
        ? "-"
        : $.fn.dataTable.render.number(",", ".", 2, "").display(data);
    };

    //render check string is null or empty
    let renderString = function (data, type, row, meta) {
      if (Utils.isNull(data)) {
        data = "-";
      }
      return data;
    };
    this.dataTable3 = $('#dataTable3').DataTableTh({
      processing: true,
      serverSide: false,
      paging: true,
      scrollX: true,
      data: this.dataUpload,
      columns: [
        {
          className: 'ui center aligned',
          render: function (data, type, row, meta) {
            return meta.row + meta.settings._iDisplayStart + 1;
          }
        }, {
          data: 'type', className: 'text-left'
        }, {
          data: 'period', className: 'text-left'
        }, {
          data: 'docDate', className: 'text-left'
        }, {
          data: 'postingDate', className: 'text-right'
        }, {
          data: 'docNo', className: 'text-left'
        }, {
          data: 'refCode', className: 'text-right'
        }, {
          data: 'currAmt', className: 'text-right', render: renderNumber
        }, {
          data: 'pkCode', className: 'text-right'
        }, {
          data: 'rorKor', className: 'text-right'
        }, {
          data: 'deptDisb', className: 'text-right'
        }, {
          data: 'msg', className: 'text-left;'
        }, {
          data: 'keyRef3', className: 'text-right'
        }, {
          data: 'keyRef1', className: 'text-right'
        }, {
          data: 'keyRef2', className: 'text-right'
        }, {
          data: 'hlodingTaxes', className: 'text-right'
        }, {
          data: 'depositAcc', className: 'text-right'
        }, {
          data: 'accType', className: 'text-left'
        }, {
          data: 'costCenter', className: 'text-right'
        }, {
          data: 'deptDisb', className: 'text-right'
        }, {
          data: 'clrngDoc', className: 'text-right'
        }
      ]
    });
  }
  inDataTable4() {
    if (this.dataTable4) {
      return;
    }
    //render check number is null or empty
    let renderNumber = function (data, type, row, meta) {
      return Utils.isNull($.trim(data))
        ? "-"
        : $.fn.dataTable.render.number(",", ".", 2, "").display(data);
    };

    //render check string is null or empty
    let renderString = function (data, type, row, meta) {
      if (Utils.isNull(data)) {
        data = "-";
      }
      return data;
    };
    this.dataTable4 = $('#dataTable4').DataTableTh({
      processing: true,
      serverSide: false,
      paging: true,
      scrollX: true,
      data: this.dataUpload,
      columns: [
        {
          className: 'ui center aligned',
          render: function (data, type, row, meta) {
            return meta.row + meta.settings._iDisplayStart + 1;
          }
        }, {
          data: 'gfDocDate', className: 'text-left'
        }, {
          data: 'gfDocNo', className: 'text-right'
        }, {
          data: 'gfDocTyep', className: 'text-left'
        }, {
          data: 'gfRefDoc', className: 'text-right'
        }, {
          data: 'careInstead', className: 'text-right'
        }, {
          data: 'depCode', className: 'text-right'
        }, {
          data: 'determinaton', className: 'text-right'
        }, {
          data: 'debit', className: 'text-right', render: renderNumber
        }, {
          data: 'credit', className: 'text-right', render: renderNumber
        }
      ]
    });
  }

  convertPath(data) {
    let path;
    if (data === 'IA_TYPE_DATA1') {
      path = 'ia-type-data1';
    } else if (data === 'IA_TYPE_DATA2') {
      path = 'ia-type-data2';
    } else if (data === 'IA_TYPE_DATA3') {
      path = 'ia-type-data3';
    } else if (data === 'IA_TYPE_DATA4') {
      path = 'ia-type-data4';
    } else if (data === 'IA_TYPE_DATA5') {
      path = 'ia-type-data5';
    } else if (data === 'IA_TYPE_DATA6') {
      path = 'ia-type-data6';
    }
    return path;
  }
}

