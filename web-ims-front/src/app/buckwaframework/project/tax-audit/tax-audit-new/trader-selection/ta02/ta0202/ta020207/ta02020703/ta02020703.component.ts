import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AjaxService } from 'services/ajax.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageBarService } from 'services/message-bar.service';
import { TextDateTH, formatter } from 'helpers/datepicker';
import { File } from 'models/file.model';
import { MessageService } from 'services/message.service';
import { OparaterDTL } from '../../../ta02.model';
import { Store } from '@ngrx/store';
import { ResponseData } from 'models/response-data.model';
import { Utils } from 'helpers/utils';

declare var $: any;

const URL = {
  SEARCH: "ta/product-paper/inquiry-balance-material",
  EXPORT: AjaxService.CONTEXT_PATH + "ta/product-paper/export-balance-material",
  UPLOAD: "ta/product-paper/upload-balance-material",
  SAVE: "ta/product-paper/save-balance-material",
  PAPER_PR_NUMBER: "ta/product-paper/paper-pr-number-list/balance-material"
}

@Component({
  selector: 'app-ta02020703',
  templateUrl: './ta02020703.component.html',
  styleUrls: ['./ta02020703.component.css']
})
export class Ta02020703Component implements OnInit {

  loading: boolean = false;
  checkSearchFlag: boolean = false;
  showTable: boolean = true;
  showUpload: boolean = true;
  showBtSave: boolean = true;
  flagHeader: boolean = true;

  //formSearch
  formSearch: FormGroup;
  auditPlanCode: string = '';

  //table
  table: any;

  //upLoadfile
  file: File[];
  dataList: any = [];

  //Store
  dataStore: any;

  // paperPrNumber
  prNumberList: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private ajax: AjaxService,
    private messageBar: MessageBarService,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>
  ) {

  }

  // ================ Initial setting ================
  ngOnInit() {
    this.auditPlanCode = this.route.snapshot.queryParams['auditPlanCode'] || "";
    this.formDataSearch();
    this.dataList = [];

    this.dataStore = this.store.select(state => state.Ta02.opa_dtl).subscribe(data => {
      this.formSearch.get('auditPlanCode').patchValue(this.auditPlanCode);
      this.formSearch.get('dutyGroupId').patchValue(data.dutyGroupId);
    })

    this.getPrNumberList();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      $('.ui.dropdown').dropdown();
      this.calendar();
    }, 200);
  }

  //======================= Form =======================
  formDataSearch() {
    this.formSearch = this.formBuilder.group({
      auditPlanCode: [''],
      newRegId: [''],
      dutyGroupId: [''],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      paperPrNumber: [''],
      json: ['']
    })
  }

  //=======================  calendar =====================
  calendar = () => {
    $('#date1').calendar({
      endCalendar: $("#date2"),
      type: 'month',
      text: TextDateTH,
      formatter: formatter('month-year'),
      onChange: (date, text, mode) => {
        this.formSearch.patchValue({
          startDate: text
        })
        $("#paperPrNumber").dropdown('restore defaults');
      }
    });
    $('#date2').calendar({
      startCalendar: $("#date1"),
      type: 'month',
      text: TextDateTH,
      formatter: formatter('month-year'),
      onChange: (date, text, mode) => {
        this.formSearch.patchValue({
          endDate: text
        })
        $("#paperPrNumber").dropdown('restore defaults');
      }
    });
  }

  //================ dropdown ====================
  getPrNumberList() {
    this.ajax.doPost(URL.PAPER_PR_NUMBER, this.formSearch.value).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.prNumberList = res.data;
      } else {
        console.log("getPrNumberList Error !!");
      }
    });
  }
  // ============= Action ================
  onSerach() {
    //hidden from upload
    this.showUpload = true;

    if (this.showBtSave === true && this.flagHeader === true) {
      if (Utils.isNotNull((this.formSearch.get('paperPrNumber').value))) {
        this.checkSearchFlag = false;
        this.searchData(this.formSearch.value);
      } else {
        this.checkSearchFlag = true;
        if (this.formSearch.valid) {
          setTimeout(() => {
            this.dataStore = this.store.select(state => state.Ta02.opa_dtl).subscribe(data => {
              this.formSearch.get('auditPlanCode').patchValue(this.auditPlanCode);
              this.formSearch.get('dutyGroupId').patchValue(data.dutyGroupId);
            })
            console.log('this.formSearch', this.formSearch.value);
            this.searchData(this.formSearch.value);
          }, 1000);
        }
      }
    }

  }

  onClear() {
    this.flagHeader = true;
    this.checkSearchFlag = false;
    this.loading = true;
    $("#paperPrNumber").dropdown('restore defaults');
    $("#inputDate1").val('');
    $("#inputDate2").val('');
    //clear date
    this.formSearch.reset();
    this.formSearch.patchValue({
      paperPrNumber: '',
      json: ''
    })

    setTimeout(() => {
      this.dataList = [];
      // disabled button save
      this.showBtSave = true;
      this.showTable = true;
      this.showUpload = true;
      $(".ui.dropdown").dropdown();
      this.calendar();
      this.loading = false;
    }, 100);
  }

  uploadTemplate() {
    setTimeout(() => {
      this.dataList = [];
      $("#file").val('');
      //hidden  table
      this.showTable = true;
      //show from upload
      this.showUpload = false;
      // disabled button save
      this.showBtSave = true;
    }, 100);
  }

  onUpload = (event: any) => {
    if ($('#file').val() == "") {
      this.messageBar.successModal("กรุณาเลือกไฟล์ที่จะอัปโหลด", "แจ้งเตือน")
      return
    } else {
      event.preventDefault();
      console.log("อัปโหลด Excel");
      const form = $("#upload-form")[0];
      let formBody = new FormData(form);
      //call uploadFile
      this.uploadFile(formBody);
    }
  }

  onBackPages = () => {
    this.router.navigate(["/tax-audit-new/ta02/02/01/03/01"], {
      queryParams: {
        auditPlanCode: this.auditPlanCode
      }
    });
  }

  onChangeUpload = (event: any) => {
    if (event.target.files && event.target.files.length > 0) {
      let reader = new FileReader();

      reader.onload = (e: any) => {
        const f = {
          name: event.target.files[0].name,
          type: event.target.files[0].type,
          value: e.target.result
        }
        this.file = [f];
      }
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  onSave() {
    if (this.showBtSave === false) {
      this.messageBar.comfirm(confirm => {
        if (confirm) {
          this.formSearch.patchValue({ json: '' })
          this.formSearch.patchValue({ json: JSON.stringify(this.dataList) })
          //call save data
          console.log(this.formSearch.value);
          this.saveData(this.formSearch.value);
        }
      }, MessageService.MSG_CONFIRM.SAVE)
    }
  }

  onChangePaperPrNumber(e) {
    if (Utils.isNotNull(this.formSearch.get('paperPrNumber').value)) {
      $("#inputDate1").val('');
      $("#inputDate2").val('');
    }
  }
  // =============== call back-end ===============

  searchData(data: any) {
    this.dataList = [];
    this.loading = true;
    this.showTable = false;
    this.ajax.doPost(`${URL.SEARCH}`, data).subscribe((res) => {
      this.dataList = res.data.dataTableAjax.data;
      if (Utils.isNotNull(this.formSearch.get('paperPrNumber').value)) {
        //path data header        
        this.formSearch.patchValue({
          startDate: res.data.startDate,
          endDate: res.data.endDate
        })
        // show readonly input
        this.flagHeader = false;
      }
    });
    setTimeout(() => {
      this.dataTable();
      this.loading = false;
    }, 1000);
  }


  exportFile() {
    if (this.showTable == false) {
      console.log("newRegId :", this.formSearch.get('newRegId').value);

      var form = $("#form-excel").get(0);
      form.method = "POST";
      form.action = URL.EXPORT;
      form.newRegId.value = this.formSearch.get('newRegId').value;
      form.auditPlanCode.value = this.formSearch.get('auditPlanCode').value;
      form.dutyGroupId.value = this.formSearch.get('dutyGroupId').value;

      form.startDate.value = this.formSearch.get('startDate').value;
      form.endDate.value = this.formSearch.get('endDate').value;

      form.paperPrNumber.value = this.formSearch.get('paperPrNumber').value;
      form.submit();

    }
  }

  uploadFile(formBody: any) {
    this.loading = true;
    this.dataList = [];
    this.ajax.upload(URL.UPLOAD, formBody, res => {
      if (MessageService.MSG.SUCCESS == res.json().status) {
        this.dataList = res.json().data.dataTableAjax.data;
        //hidden from upload
        this.showUpload = true;
        //path data header        
        this.formSearch.patchValue({
          auditPlanCode: res.json().data.auditPlanCode,
          newRegId: res.json().data.newRegId,
          dutyGroupId: res.json().data.dutyGroupId,
          startDate: res.json().data.startDate,
          endDate: res.json().data.endDate,
          paperPrNumber: res.json().data.paperPrNumber
        })

        // show readonly input
        this.flagHeader = false;
        // show table
        this.showTable = false;
        // open button save
        this.showBtSave = false;
      } else {
        this.messageBar.errorModal("ไม่สามารถอัปโหลดไฟล์ได้", "แจ้งเตือน");
        console.log("error uploadFile :", res.json().message);
        // disabled button save
        this.showBtSave = true;
      }

      setTimeout(() => {
        this.dataTable();
        this.loading = false;
      }, 1000);

    })
  }

  saveData = (data: any): any => {
    this.loading = true;
    this.ajax.doPost(URL.SAVE, data).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        //path data header        
        this.formSearch.patchValue({
          paperPrNumber: res.data
        })
        this.getPrNumberList();
        this.messageBar.successModal(res.message);
      } else {
        this.messageBar.errorModal(res.message);
        console.log("error saveData :", res.message);
      }
    });

    setTimeout(() => {
      this.loading = false;
    }, 1000);

  }

  // =================== dataTable ======================
  dataTable() {
    if (this.table != null) {
      this.table.destroy();
    }
    this.table = $("#dataTable").DataTableTh({
      lengthChange: true,
      searching: false,
      loading: true,
      ordering: false,
      pageLength: 10,
      processing: true,
      serverSide: false,
      paging: true,
      data: this.dataList,
      columns: [
        {
          render: function (data, type, row, meta) {
            return meta.row + meta.settings._iDisplayStart + 1;
          },
          className: "text-center"
        }, {
          data: "materialDesc", className: "text-left"
        }, {
          data: "balanceByAccountQty", className: "text-right",
          render: (data, type, row, meta) => {
            return Utils.moneyFormatDecimal(data);
          }
        }, {
          data: "balanceByStockQty", className: "text-right",
          render: (data, type, row, meta) => {
            return Utils.moneyFormatDecimal(data);
          }
        }, {
          data: "balanceByCountQty", className: "text-right",
          render: (data, type, row, meta) => {
            return Utils.moneyFormatDecimal(data);
          }
        }, {
          data: "maxDiffQty1", className: "text-right",
          render: (data, type, row, meta) => {
            return Utils.moneyFormatDecimal(data);
          }
        }, {
          data: "maxDiffQty2", className: "text-right",
          render: (data, type, row, meta) => {
            return Utils.moneyFormatDecimal(data);
          }
        }
      ],
    });
  }



  //==================== valid ================================
  invalidSearchFormControl(control: string) {
    return this.formSearch.get(control).invalid && (this.formSearch.get(control).touched || this.checkSearchFlag);
  }

}

class AppState {
  Ta02: {
    opa_dtl: OparaterDTL
  }
}
