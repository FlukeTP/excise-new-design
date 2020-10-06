import { Component, OnInit } from '@angular/core';
import { BreadCrumb, ResponseData } from 'models/index';
import { AjaxService } from 'services/ajax.service';
import { MessageBarService } from 'services/message-bar.service';
import { TextDateTH, formatter } from 'helpers/datepicker';
import { Utils } from 'helpers/utils';
import { AuthService } from 'services/auth.service';
import { MessageService } from 'services/message.service';
import { JsonPipe } from '@angular/common';
import { jsonpCallbackContext } from '@angular/common/http/src/module';
import { IsEmptyPipe } from 'app/buckwaframework/common/pipes/empty.pipe';

declare var $: any;

const URL = {
  export: "ia/int120101/exportFile",
  DATATABLE: AjaxService.CONTEXT_PATH + 'ia/int120101/findAll',
  DROPDOWN_STATUS: "preferences/parameter",
  GET_DEPARTMENT: "ia/int120101//get/department",
}

@Component({
  selector: 'app-int120101',
  templateUrl: './int120101.component.html',
  styleUrls: ['./int120101.component.css']
})
export class Int120101Component implements OnInit {
  // BreadCrumb
  breadcrumb: BreadCrumb[];

  // sector: any;
  // area: any;
  // branch: any;
  statusList: any;
  officeCode: string = "";

  $form: any;
  listFileName: any;
  showData: boolean = true;
  loading: boolean = false;

  form: FormSearch = new FormSearch();
  formModal: FormModal = new FormModal();

  constructor(
    private ajax: AjaxService,
    private msg: MessageBarService,
    private authService: AuthService
  ) {

    this.breadcrumb = [
      { label: "ตรวจสอบภายใน", route: "#" },
      { label: "บันทึกข้อมูล", route: "#" },
      { label: "ข้อมูลแสตมป์", route: "#" },
    ];

  }

  ngOnInit() {
    this.$form = $("#formSearch");
    ////this.authService.reRenderVersionProgram('INT-05110');
    this.getDropdownStatus();
    this.getDepartmentLogin();
  }

  ngAfterViewInit() {
    $(".ui.dropdown.ai").dropdown().css('width', '100%');
    this.table();
    this.calenda();

  }

  getDepartmentLogin() {
    this.ajax.doGet(`${URL.GET_DEPARTMENT}`).subscribe((response: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == response.status) {
        $('#sector').val(new IsEmptyPipe().transform(response.data.sector));
        $('#area').val(new IsEmptyPipe().transform(response.data.area));
        $('#branch').val(new IsEmptyPipe().transform(response.data.branch));
        this.officeCode = response.data.officeCode;
      } else {
        this.msg.errorModal(response.message);
      }
    }, err => {
      this.msg.errorModal(MessageService.MSG.FAILED_CALLBACK);
    });
  }

  getDropdownStatus() {
    this.ajax.doPost(`${URL.DROPDOWN_STATUS}/IA_STAMP_STATUS`, {}).subscribe((response: ResponseData<any>) => {
      if (response.status === 'SUCCESS') {
        this.statusList = response.data;
      } else {
        this.msg.errorModal(response.message);
      }
    }), error => {
      this.msg.errorModal("กรุณาติดต่อผู้ดูแลระบบ");
    };
  }

  calenda = () => {
    $("#dateF").calendar({
      maxDate: new Date(),
      endCalendar: $("#dateT"),
      type: "date",
      text: TextDateTH,
      formatter: formatter()
    });
    $("#dateT").calendar({
      maxDate: new Date(),
      startCalendar: $("#dateF"),
      type: "date",
      text: TextDateTH,
      formatter: formatter()
    });
    $("#dateOfPayForm").calendar({
      maxDate: new Date(),
      type: "date",
      text: TextDateTH,
      formatter: formatter()
    }, 'blur');
    $("#dateWithdrawStampForm").calendar({
      maxDate: new Date(),
      type: "date",
      text: TextDateTH,
      formatter: formatter()
    });
    $("#dateDeliverStampForm").calendar({
      maxDate: new Date(),
      type: "date",
      text: TextDateTH,
      formatter: formatter()
    });
    $("#fivePartDateForm").calendar({
      maxDate: new Date(),
      type: "date",
      text: TextDateTH,
      formatter: formatter()
    });
    $("#stampCheckDateForm").calendar({
      maxDate: new Date(),
      type: "date",
      text: TextDateTH,
      formatter: formatter()
    });
  }
  onSearch = () => {
    $("#searchFlag").val("TRUE");
    $("#dataTable").DataTable().ajax.reload();
  }
  onClear = () => {
    $(".ui.dropdown.ai").dropdown('restore defaults');
    $("#dateForm").val("");
    $("#dateTo").val("");
    $("#searchFlag").val("FALSE");
    $("#dataTable").DataTable().ajax.reload();
  }
  exportFile = () => {
    let param = "";
    param += "?sector=" + this.form.sector;
    param += "&area=" + this.form.area;
    param += "&branch=" + this.form.branch;
    param += "&dateFrom=" + this.form.dateFrom;
    param += "&dateTo=" + this.form.dateTo;
    param += "&budgetType=" + $("#budgetType").val();
    this.ajax.download(URL.export + param);
  }
  modalEditSubmit = () => {
    this.ajax.doPost('ia/int120101/save', { data: this.formModal }).subscribe((response: ResponseData<any>) => {
      if (response.status === 'SUCCESS') {
        this.msg.successModal("ทำรายการสำเร็จ");
        $("#dataTable").DataTable().ajax.reload();
      } else {
        this.msg.errorModal(response.message);
      }
    }), error => {
      this.msg.errorModal("กรุณาติดต่อผู้ดูแลระบบ");
    };
  }
  table = () => {
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

    const table = $("#dataTable").DataTableTh({
      "serverSide": true,
      "searching": false,
      "processing": true,
      "ordering": false,
      "scrollX": true,
      "ajax": {
        "url": URL.DATATABLE,
        "contentType": "application/json",
        "type": "POST",
        "data": (d) => {
          return JSON.stringify($.extend({}, d, {
            // "sector": $("#sector").val(),
            // "area": $("#area").val(),
            // "branch": $("#branch").val(),
            "officeCode": this.officeCode,
            "dateForm": $("#dateForm").val(),
            "dateTo": $("#dateTo").val(),
            "searchFlag": $("#searchFlag").val(),
            "paramCode": $("#status").val()
          }));
        },
      },

      "columns": [
        {
          "render": function (data, type, row, meta) {
            return meta.row + meta.settings._iDisplayStart + 1;
          },
          "className": "ui center aligned"
        }, {
          "data": "dateOfPay",
          "className": "ui center aligned",
          render: renderString
        }, {
          "data": "status",
          "className": "ui center aligned",
          render: renderString
        }, {
          "data": "departmentName",
          "className": "ui left aligned",
          render: renderString
        }, {
          "data": "bookNumberWithdrawStamp",
          "className": "ui left aligned",
          render: renderString
        }, {
          "data": "dateWithdrawStamp",
          "className": "ui center aligned",
          render: renderString
        }, {
          "data": "bookNumberDeliverStamp",
          "className": "ui left aligned",
          render: renderString
        }, {
          "data": "dateDeliverStamp",
          "className": "ui center aligned",
          render: renderString
        }, {
          "data": "fivePartNumber",
          "className": "ui left aligned",
          render: renderString
        }, {
          "data": "fivePartDate",
          "className": "ui center aligned",
          render: renderString
        }, {
          "data": "stampCheckDate",
          "className": "ui center aligned",
          render: renderString
        }, {
          "data": "stampChecker",
          "className": "ui left aligned",
          render: renderString
        }, {
          "data": "stampChecker2",
          "className": "ui left aligned",
          render: renderString
        }, {
          "data": "stampChecker3",
          "className": "ui left aligned",
          render: renderString
        }, {
          "data": "stampBrand",
          "className": "ui left aligned",
          render: renderString
        }, {
          "data": "numberOfBook",
          "className": "ui right aligned",
          render: renderNumber
        }, {
          "data": "numberOfStamp",
          "className": "ui right aligned",
          "render": function (data) {
            return Utils.moneyFormatInt(data);
          }
        }, {
          "data": "valueOfStampPrinted",
          "className": "ui right aligned",
          "render": function (data) {
            return Utils.moneyFormat(data);
          }
        }, {
          "data": "sumOfValue",
          "className": "ui right aligned",
          "render": function (data) {
            return Utils.moneyFormat(data);
          }
        }, {
          "data": "taxStamp",
          "className": "ui right aligned",
          "render": function (data) {
            return Utils.moneyFormat(data);
          }
        }, {
          "data": "stampCodeStart",
          "className": "ui left aligned"
        }, {
          "data": "stampCodeEnd",
          "className": "ui left aligned"
        }, {
          "data": "note",
          "className": "ui left aligned",
          render: renderString
        }, {
          "render": function (data, type, row) {
            var btn = '';
            // btn += '<button class="ui mini blue button btn-detail"><i class="eye icon"></i>รายละเอียด</button>';
            btn += '<button class="ui mini yellow button btn-edit"><i class="edit icon"></i>แก้ไข</button>';
            btn += '<button class="ui mini red button btn-delete"><i class="trash alternate icon"></i>ลบ</button>';
            return btn;
          },
          "className": "ui center aligned"
        }
      ]
    });
    table.on('click', 'tbody tr button.btn-detail', (e) => {
      var closestRow = $(e.target).closest('tr');
      var data = table.row(closestRow).data();

      $('#modal-detail').modal({
        autofocus: false,
        onHidden: () => {
          this.formModal = new FormModal();
        },
        onDeny: () => {
          this.formModal = new FormModal();
        },
        onShow: () => {
          this.formModal.bookNumberDeliverStamp = data.bookNumberDeliverStamp;
          this.formModal.bookNumberWithdrawStamp = data.bookNumberWithdrawStamp;
          this.formModal.createdDate = data.createdDate;
          this.formModal.dateDeliverStamp = data.dateDeliverStamp;
          this.formModal.dateWithdrawStamp = data.dateWithdrawStamp;
          this.formModal.departmentName = data.departmentName;
          this.formModal.exciseDepartment = data.exciseDepartment;
          this.formModal.exciseDistrict = data.exciseDistrict;
          this.formModal.exciseRegion = data.exciseRegion;
          this.formModal.fivePartDate = data.fivePartDate;
          this.formModal.fivePartNumber = data.fivePartNumber;
          this.formModal.note = data.note;
          this.formModal.numberOfBook = data.numberOfBook;
          this.formModal.numberOfStamp = data.numberOfStamp;
          this.formModal.serialNumber = data.serialNumber;
          this.formModal.stampBrand = data.stampBrand;
          this.formModal.stampCheckDate = data.stampCheckDate;
          this.formModal.stampChecker = data.stampChecker;
          this.formModal.stampChecker2 = data.stampChecker2;
          this.formModal.stampChecker3 = data.stampChecker3;
          this.formModal.stampCodeEnd = data.stampCodeEnd;
          this.formModal.stampCodeStart = data.stampCodeStart;
          this.formModal.stampType = data.stampType;
          this.formModal.status = data.status;
          this.formModal.sumOfValue = data.sumOfValue;
          this.formModal.taxStamp = data.taxStamp;
          this.formModal.valueOfStampPrinted = data.valueOfStampPrinted;
          this.formModal.workSheetDetailId = data.workSheetDetailId;
          this.formModal.fileName = data.fileName;
          this.formModal.dateOfPay = data.dateOfPay;

          var url = 'ia/int120101/listFile';
          this.ajax.post(url, JSON.stringify(data.workSheetDetailId), res => {
            this.listFileName = res.json();
          });
        }

      }).modal('show');
    });
    table.on('click', 'tbody tr button.btn-edit', (e) => {
      var closestRow = $(e.target).closest('tr');
      var data = table.row(closestRow).data();
      this.loading = true;
      $('#modal-edit').modal({
        autofocus: false,
        onHidden: () => {
          this.formModal = new FormModal();
          this.loading = false;
        },
        onDeny: () => {
          this.formModal = new FormModal();
          this.loading = false;
        },
        onShow: async () => {
          this.calenda();
          this.formModal.dateOfPay = await data.dateOfPay;
          this.formModal.bookNumberDeliverStamp = await data.bookNumberDeliverStamp;
          this.formModal.bookNumberWithdrawStamp = await data.bookNumberWithdrawStamp;
          this.formModal.createdDate = await data.createdDate;
          this.formModal.dateDeliverStamp = await data.dateDeliverStamp;
          this.formModal.dateWithdrawStamp = await data.dateWithdrawStamp;
          this.formModal.departmentName = await data.departmentName;
          this.formModal.exciseDepartment = await data.exciseDepartment;
          this.formModal.exciseDistrict = await data.exciseDistrict;
          this.formModal.exciseRegion = await data.exciseRegion;
          this.formModal.fivePartDate = await data.fivePartDate;
          this.formModal.fivePartNumber = await data.fivePartNumber;
          this.formModal.note = await data.note;
          this.formModal.numberOfBook = await data.numberOfBook;
          this.formModal.numberOfStamp = await data.numberOfStamp;
          this.formModal.serialNumber = await data.serialNumber;
          this.formModal.stampBrand = await data.stampBrand;
          this.formModal.stampCheckDate = await data.stampCheckDate;
          this.formModal.stampChecker = await data.stampChecker;
          this.formModal.stampChecker2 = await data.stampChecker2;
          this.formModal.stampChecker3 = await data.stampChecker3;
          this.formModal.stampCodeEnd = await data.stampCodeEnd;
          this.formModal.stampCodeStart = await data.stampCodeStart;
          this.formModal.stampType = await data.stampType;
          this.formModal.status = await data.status;
          this.formModal.sumOfValue = await data.sumOfValue;
          this.formModal.taxStamp = await data.taxStamp;
          this.formModal.valueOfStampPrinted = await data.valueOfStampPrinted;
          this.formModal.workSheetDetailId = await data.workSheetDetailId;
          this.formModal.fileName = await data.fileName;
          this.formModal.dateOfPay = await data.dateOfPay;
          await $("#statusModal").dropdown('set selected', this.formModal.status);

        },
      }).modal('show');
    });
    table.on('click', 'tbody tr button.btn-delete', (e) => {
      var closestRow = $(e.target).closest('tr');
      var data = table.row(closestRow).data();

      this.msg.comfirm((res) => {
        if (res) {
          const URL = 'ia/int120101/delete'

          let Data = {
            "data": data
          };
          this.ajax.post(URL, JSON.stringify(Data),
            res => {
              this.msg.successModal("ทำรายการสำเร็จ", "แจ้งเตือน");
              $("#dataTable").DataTable().ajax.reload();
            }, error => {
              this.msg.errorModal("ทำรายการไม่สำเร็จ", "แจ้งเตือน");
            });
        }
      }, "คุณต้องการลบข้อมูลใช่หรือไม่ ? ");

    });
  }

}

class FormModal {
  workSheetDetailId: string = null;
  exciseDepartment: string = null;
  exciseRegion: string = null;
  exciseDistrict: string = null;
  dateOfPay: string = null;
  status: string = null;
  departmentName: string = null;
  bookNumberWithdrawStamp: string = null;
  dateWithdrawStamp: string = null;
  bookNumberDeliverStamp: string = null;
  dateDeliverStamp: string = null;
  fivePartNumber: string = null;
  fivePartDate: string = null;
  stampCheckDate: string = null;
  stampChecker: string = null;
  stampChecker2: string = null;
  stampChecker3: string = null;
  stampType: string = null;
  stampBrand: string = null;
  numberOfBook: string = null;
  numberOfStamp: string = null;
  valueOfStampPrinted: string = null;
  sumOfValue: string = null;
  serialNumber: string = null;
  taxStamp: string = null;
  stampCodeStart: string = null;
  stampCodeEnd: string = null;
  note: string = null;
  createdDate: string = null;
  fileName: string = null;
}

export class FormSearch {
  sector: string = "";
  area: string = "";
  branch: string = "";
  dateFrom: string = "";
  dateTo: string = "";
  searchFlag: string = "FALSE";
}
