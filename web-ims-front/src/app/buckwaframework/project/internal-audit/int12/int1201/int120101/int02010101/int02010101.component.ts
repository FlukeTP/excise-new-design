import { Component, OnInit } from '@angular/core';
import { MessageBarService } from 'services/message-bar.service';
import { AjaxService } from 'services/ajax.service';
import { AuthService } from 'services/auth.service';
import { Router } from '@angular/router';
import { TextDateTH, formatter } from 'helpers/datepicker';
import { File, BreadCrumb } from '../../../../../../common/models';
import { Int12010101Service } from './int12010101.service';
import { Utils } from 'helpers/utils';

declare var $: any;

@Component({
  selector: 'app-int02010101',
  templateUrl: './int02010101.component.html',
  styleUrls: ['./int02010101.component.css'],
  providers: [Int12010101Service]
})
export class Int02010101Component implements OnInit {

  formModal: FormModal = new FormModal();
  data: FormModal[];
  stampType: any;
  stampGenre: any;
  table: any;
  randomNumber: number;
  listButton: any;
  numberButton: number;
  file: File[];
  loading: boolean;
  statusList: any;
  statusReceive: boolean = false;
  statusSendBack: boolean = false;
  statusSendBackFile: boolean = false;
  statusPay: boolean = false;
  breadcrumb: BreadCrumb[]

  constructor(
    private message: MessageBarService,
    private ajax: AjaxService,
    private authService: AuthService,
    private int12010101Service: Int12010101Service,
    private route: Router
  ) {

    this.breadcrumb = [
      { label: "ตรวจสอบภายใน", route: "#" },
      { label: "บันทึกข้อมูล", route: "#" },
      { label: "ข้อมูลแสตมป์", route: "#" },
      { label: "เพิ่มข้อมูลแสตมป์", route: "#" },
    ];

    this.data = [];
    this.randomNumber = 0;
    this.stampType = null;
    this.stampGenre = null;
    this.file = new Array<File>();
    this.listButton = [];
    this.numberButton = 1;
    this.loading = false;
   }

  ngOnInit() {
    ////this.authService.reRenderVersionProgram('INT-05111');

    this.stampTypeList();
    this.listButton.push(this.numberButton);
    this.status()
 
  }

  ngAfterViewInit() {
    this.calenda();
    this.callDropdown();
    this.dataTable();
  }


  backConfirm = () => {
    let countTable = $("#dataTable").DataTable().data().count();
    console.log(countTable);
    if (countTable > 0) {
      this.message.comfirm((res) => {
        if (res) {
          this.route.navigate(['/int12/01/01']);
        }
      }, "ยกเลิกการทำรายการ");
    }else{
      this.route.navigate(['/int12/01/01']);
    }
  }
  status = () => {
    this.int12010101Service.status().then((res) => {

      this.statusList = res.data;

      console.log(this.statusList);
      
    });
  }
  checkBlank = (e) => {
    if (e == null || e == "") return true;
  }
  restoreDropdown() {
    $("#stampType").dropdown('restore defaults');
    $("#stampBrand").dropdown('restore defaults');
    $("#status").dropdown('restore defaults');
  }
  callDropdown() {
    $("#stampType").dropdown().css('width', '100%');
    $("#stampBrand").dropdown().css('width', '100%');
    $("#status").dropdown().css('width', '100%');
  }
  stampTypeList = () => {
    let url = "ia/int12/01/01/01/stamTypes";
    this.ajax.get(url, res => {
      this.stampType = res.json();
    })
  }
  stampGenreList = (e) => {
    if (!this.checkBlank(e.target.value)) { 
      $("#stampBrand").dropdown('restore defaults');
      console.log("id : " + e.target.value);

      let url = "ia/int12/01/01/01/stamGenre/" + e.target.value;
      this.ajax.get(url, res => {
        console.log(res.json());
        this.stampGenre = res.json();
      })
    }
  }

  changeStatus = (e) => {
    let customreadonly = 'custom-readonly';

    if (e.target.value == "รับ") {
      this.statusReceive = true;
      this.statusSendBackFile = true;
      this.statusPay = false;
      this.statusSendBack = false;

      $(".statusSendBack").removeClass(customreadonly);
      $(".statusPay").removeClass(customreadonly);

      $(".statusSendBackFile").addClass(customreadonly);
      $(".statusReceive").addClass(customreadonly);
    }
    if (e.target.value == "ส่งคืน") {
      this.statusSendBack = true;
      this.statusPay = true;
      this.statusReceive = true;
      $(".statusReceive").removeClass(customreadonly);
      $(".statusPay").removeClass(customreadonly);

      $(".statusSendBack").addClass(customreadonly);
      $(".statusPay").addClass(customreadonly);
      $(".statusReceive").addClass(customreadonly);

      this.statusSendBackFile = false;
      $(".statusSendBackFile").removeClass(customreadonly);
    }
    if (e.target.value == "จ่าย") {
      this.statusPay = true;
      this.statusSendBack = false;
      this.statusReceive = false;
      this.statusSendBackFile = false;
      $(".statusSendBackFile").removeClass(customreadonly);

      $(".statusSendBack").removeClass(customreadonly);
      $(".statusReceive").removeClass(customreadonly);

      $(".statusPay").addClass(customreadonly);
    }
  }

  onAddButton = () => {
    console.log("Add Button");
    this.listButton.push(++this.numberButton);
    console.log(this.listButton);
  }

  deleteButton = (e) => {
    console.log("Delete Button : ", e);
    let id = "#" + e;
    let idButton = "#delete" + e;
    $(id).remove();
    let index = this.listButton.findIndex(obj => obj == e);
    this.listButton.splice(index, 1);
  }

  onAddFile = () => {
    this.listButton.forEach(element => {
      var fileName = "#fileName" + element;
      var file = $(fileName)[0].files[0];
      this.onUpload(file);
    });
  }
  
  onUpload = (event) => {
    if (event) {
      let reader = new FileReader();

      reader.onload = (e: any) => {
        const { name, type } = event;
        const f = {
          name: name,
          type: type,
          value: e.target.result
        };

        this.file.push(f);
        console.log(this.file);
      };
      reader.readAsDataURL(event);
    }
  }

  onAdd = () => {    
    if (Utils.isNull($("#dateOfPay").val())) {
      this.message.successModal("กรุณาระบุ วันที่รับ - จ่าย", "แจ้งเตือน");
    }
    if (this.checkBlank($("#status").val())) {
      this.message.successModal("กรุณาระบุ สถานะการ รับ - จ่าย" , "แจ้งเตือน");
      return false;
    }
    if (this.checkBlank($("#departmentName").val())) {
      this.message.successModal("กรุณาระบุ หน่วยงาน / ผู้ประกอบการ", "แจ้งเตือน");
      return false;
    }
    if (this.checkBlank($("#stampType").val())) {
      this.message.successModal("กรุณาระบุ ประเภทแสตมป์", "แจ้งเตือน");
      return false;
    }
    if (this.checkBlank($("#stampBrand").val())) {
      this.message.successModal("กรุณาระบุ ชนิดแสตมป์", "แจ้งเตือน");
      return false;
    }
    if (this.checkBlank($("#valueOfStampPrinted").val())) {
      this.message.successModal("กรุณาระบุ มูลค่าพิมพ์ (บาท/ดวง)", "แจ้งเตือน");
      return false;
    }
    if ($("#edit").val() == "edit" && $("#idEdit").val() != "") {
      const index = this.data.findIndex(obj => obj.idRandom == $("#idEdit").val());
      this.formModal.sumOfValue = this.formModal.numberOfStamp * this.formModal.valueOfStampPrinted;
      this.formModal.dateOfPay = $("#dateOfPay").val();
      this.formModal.dateDeliverStamp = $("#dateDeliverStamp").val();
      this.formModal.dateWithdrawStamp = $("#dateWithdrawStamp").val();
      this.formModal.fivePartDate = $("#fivePartDate").val();
      this.formModal.stampCheckDate = $("#stampCheckDate").val();
      this.formModal.stampTypeId = this.formModal.stampType;
      this.formModal.stampType = ($("#stampType option:selected").text() == "กรุณาเลือก" ? "" : $("#stampType option:selected").text());
      this.formModal.stampBrandId = this.formModal.stampBrand
      this.formModal.stampBrand = ($("#stampBrand option:selected").text() == "กรุณาเลือก" ? "" : $("#stampBrand option:selected").text())
      this.formModal.file = this.file;
      this.data[index] = this.formModal;
      $("#edit").val("");
      $("#idEdit").val("");
    } else {
      console.log("Add : ", this.formModal.dateOfPay);
      for (let i = 0; i < this.listButton; i++) {
        let getNameFile = $("input[name=fileName" + this.listButton[i] + "]").val();
        this.onUpload(getNameFile);
      }
      this.formModal.idRandom = this.randomNumber++;
      // sum money
      this.formModal.sumOfValue = this.formModal.numberOfStamp * this.formModal.valueOfStampPrinted;
      this.formModal.dateOfPay = $("#dateOfPay").val();
      this.formModal.dateDeliverStamp = $("#dateDeliverStamp").val();
      this.formModal.dateWithdrawStamp = $("#dateWithdrawStamp").val();
      this.formModal.fivePartDate = $("#fivePartDate").val();
      this.formModal.stampCheckDate = $("#stampCheckDate").val();
      this.formModal.stampTypeId = this.formModal.stampType;
      this.formModal.stampType = ($("#stampType option:selected").text() == "กรุณาเลือก" ? "" : $("#stampType option:selected").text());
      this.formModal.stampBrandId = this.formModal.stampBrand
      this.formModal.stampBrand = ($("#stampBrand option:selected").text() == "กรุณาเลือก" ? "" : $("#stampBrand option:selected").text())
      this.formModal.file = this.file;

      this.data.push(this.formModal);
    }
    console.log("datatotable : ",this.data);
    this.table.clear().draw();
    this.table.rows.add(this.data); // Add new data
    this.table.columns.adjust().draw(); // Redraw the DataTable
    //this.message.successModal("ทำรายการสำเร็จ", "แจ้งเตือน");
    this.formModal = new FormModal();
    this.formModal.dateOfPay = "";
    this.formModal.dateDeliverStamp = "";
    this.formModal.dateWithdrawStamp = "";
    this.formModal.fivePartDate = "";
    this.formModal.stampCheckDate = "";
    this.restoreDropdown();
    this.onAddFile();
    this.numberButton = 1;
    this.listButton = [this.numberButton];
    $("#fileName1").val("");
  }

  onSave = () => {
    console.log(this.data.length);
    if (this.data.length == 0) {
      this.message.successModal("ไม่มีข้อมูล", "แจ้งเตือน");
      return false;
    }

    this.message.comfirm((res) => {

      if (res) {
        this.loading = true;
        let url = 'ia/int12/01/01/01/save';
        this.ajax.post(url, JSON.stringify(this.data),
          res => {
            $("#success").modal({
              "onHidden": () => {
                this.data = [];
                this.loading = false;
                this.route.navigate(['/int12/01/01']);
              },
              "onDeny": () => {
                this.data = [];
                this.loading = false;
                this.route.navigate(['/int12/01/01']);
              }
            }).modal('show');

          }, error => {
            this.message.errorModal("ทำรายการไม่สำเร็จ", "แจ้งเตือน");
            this.loading = false;
          });

      }
    }, "คุณต้องการบันทึกใช่หรือไม่ ?");
  }

  dataTable = () => { 
    this.table = $("#dataTable").DataTableTh({
      serverSide: false,
      searching: false,
      ordering: false,
      processing: true,
      scrollX: true,
      data: this.data,
      columns : [
        {
          "data": "dateOfPay",
          "render": function (data, type, row, meta) {
            return meta.row + meta.settings._iDisplayStart + 1;
          },
          "className": "ui center aligned"
        }, {
          "data": "dateOfPay",
          "className": "ui center aligned",
        }, {
          "data": "status",
          "className": "ui center aligned",
        }, {
          "data": "departmentName",
          "className": "ui center aligned"
        }, {
          "data": "bookNumberWithdrawStamp",
          "className": "ui center aligned"
        }, {
          "data": "dateWithdrawStamp",
          "className": "ui center aligned"
        }, {
          "data": "bookNumberDeliverStamp",
          "className": "ui center aligned"
        }, {
          "data": "dateDeliverStamp",
          "className": "ui center aligned"
        }, {
          "data": "fivePartNumber",
          "className": "ui center aligned"
        }, {
          "data": "fivePartDate",
          "className": "ui center aligned"
        }, {
          "data": "stampCheckDate",
          "className": "ui center aligned"
        }, {
          "data": "stampChecker",
          "className": "ui center aligned"
        }, {
          "data": "stampChecker2",
          "className": "ui center aligned"
        }, {
          "data": "stampChecker3",
          "className": "ui center aligned"
        }, {
          "data": "stampBrand",
          "className": "ui center aligned"
        }, {
          "data": "numberOfBook",
          "className": "ui center aligned"
        }, {
          "data": "numberOfStamp",
          "className": "ui center aligned"
        }, {
          "data": "valueOfStampPrinted",
          "className": "ui center aligned"
        }, {
          "data": "sumOfValue",
          "className": "ui center aligned"
        }, {
          "data": "taxStamp",
          "className": "ui right aligned"
        }, {
          "data": "stampCodeStart",

        }, {
          "data": "stampCodeEnd",

        }, {
          "data": "note",

        }, {
          "data": "note",
          "render": function (data, type, row) {
            var btn = '';
            btn += '<button class="ui mini yellow button btn-edit"><i class="edit icon"></i>แก้ไข</button>';
            btn += '<button class="ui mini red button btn-delete"><i class="trash alternate icon"></i>ลบ</button>';
            return btn;
          },
          "className": "ui center aligned"

        }
      ]
    });
    this.table.clear().draw();
    this.table.rows.add(this.data); // Add new data
    this.table.columns.adjust().draw(); // Redraw the DataTable\

    this.table.on('click', 'tbody tr button.btn-edit', (e) => {
      var closestRow = $(e.target).closest('tr');
      var data = this.table.row(closestRow).data();
      console.log("data : ", data);
      setTimeout(() => {
        this.formModal.dateOfPay = data.dateOfPay;
        this.formModal.bookNumberDeliverStamp = data.bookNumberDeliverStamp;
        this.formModal.bookNumberWithdrawStamp = data.bookNumberWithdrawStamp;
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
        this.formModal.stampBrand = data.stampBrand;
        this.formModal.stampBrandId = data.stampBrandId;
        this.formModal.stampCheckDate = data.stampCheckDate;
        this.formModal.stampChecker = data.stampChecker;
        this.formModal.stampCodeEnd = data.stampCodeEnd;
        this.formModal.stampCodeStart = data.stampCodeStart;
        this.formModal.stampType = data.stampType;
        this.formModal.stampTypeId = data.stampTypeId;
        this.formModal.status = data.status;
        this.formModal.sumOfValue = data.sumOfValue;
        this.formModal.taxStamp = data.taxStamp;
        this.formModal.valueOfStampPrinted = data.valueOfStampPrinted;
        this.formModal.workSheetDetailId = data.workSheetDetailId;
        this.formModal.fileName = data.fileName;
        $("#status").dropdown('set selected', this.formModal.status);
        $("#stampType").dropdown('set selected', this.formModal.stampTypeId);
        setTimeout(() => {
          $("#stampBrand").dropdown('set selected', this.formModal.stampBrandId);
        }, 50);
        $("#edit").val("edit");
        $("#idEdit").val(data.idRandom);

      }, 50);

    });
    this.table.on('click', 'tbody tr button.btn-delete', (e) => {
      var closestRow = $(e.target).closest('tr');
      var data = this.table.row(closestRow).data();
      this.message.comfirm((res) => {
        if (res) {
          let index = this.data.findIndex(obj => obj.idRandom == data.idRandom);

          this.data.splice(index, 1);

          setTimeout(() => {
            this.formModal.dateOfPay = "";
            this.formModal.bookNumberDeliverStamp = "";
            this.formModal.bookNumberWithdrawStamp = "";
            this.formModal.dateDeliverStamp = "";
            this.formModal.dateWithdrawStamp = "";
            this.formModal.departmentName = "";
            this.formModal.exciseDepartment = "";
            this.formModal.exciseDistrict = "";
            this.formModal.exciseRegion = "";
            this.formModal.fivePartDate = "";
            this.formModal.fivePartNumber = "";
            this.formModal.note = "";
            this.formModal.numberOfBook = "";
            this.formModal.numberOfStamp = 0;
            this.formModal.stampBrand = "";
            this.formModal.stampBrandId = "";
            this.formModal.stampCheckDate = "";
            this.formModal.stampChecker = "";
            this.formModal.stampCodeEnd = "";
            this.formModal.stampCodeStart = "";
            this.formModal.stampType = "";
            this.formModal.stampTypeId = "";
            this.formModal.status = "";
            this.formModal.sumOfValue = 0;
            this.formModal.taxStamp = "";
            this.formModal.valueOfStampPrinted = 0;
            this.formModal.workSheetDetailId = "";
            $("#stampType").dropdown('restore defaults');
            $("#stampBrand").dropdown('restore defaults');
            $("#status").dropdown('restore defaults');
          }, 40);

          this.table.clear().draw();
          this.table.rows.add(this.data); // Add new data
          this.table.columns.adjust().draw(); // Redraw the DataTable
        }
      },"คุณต้องการลบข้อมูลใช่หรือไม่ ? ");

    });
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
  stampTypeId: string = null;
  stampBrandId: string = null;
  numberOfBook: string = null;
  numberOfStamp: number = null;
  valueOfStampPrinted: number = null;
  sumOfValue: number = null;
  taxStamp: string = null;
  stampCodeStart: string = null;
  stampCodeEnd: string = null;
  note: string = null;
  fileName: [any];
  idRandom: number = 0;
  file: File[];
}

