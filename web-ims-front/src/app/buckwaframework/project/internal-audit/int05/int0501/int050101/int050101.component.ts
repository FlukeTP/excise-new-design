import { Component, OnInit } from '@angular/core';
import { BreadCrumb } from 'models/index';
import { MessageBarService } from 'services/message-bar.service';
import { AjaxService } from 'services/ajax.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'services/auth.service';
import { TextDateTH } from 'helpers/datepicker';

declare var $: any;
@Component({
  selector: 'app-int050101',
  templateUrl: './int050101.component.html',
  styleUrls: ['./int050101.component.css']
})

export class Int050101Component implements OnInit {
  searchFlag: String;
  documentTypeList: any;
  idProcess: any;
  head: any;
  fileUpload: File[];

  pickedType: any;
  fiscalYear: any;
  departureDate: any;
  returnDate: any;
  travelToDescription: any;

  breadcrumb: BreadCrumb[];


  constructor(
    private message: MessageBarService,
    private ajax: AjaxService,
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {
    this.breadcrumb = [
      { label: "ตรวจสอบภายใน", route: "#" },
      { label: "ประมาณการค่าใช้จ่ายในการเดินทางไปราชการ", route: "#" },
      { label: "รายละเอียดเอกสาร", route: "#" }

    ];

    this.fileUpload = new Array<File>(); // initial file array
  }


  ngOnInit() {
    //this.authService.reRenderVersionProgram('INT-09110');
    this.idProcess = this.route.snapshot.queryParams["idProcess"];
    console.log("idProcess : ", this.idProcess);
    this.getHead();
    this.documentTypeDropdown();
    setTimeout(() => {
      this.dataTable();
      this.dataTable2();
      this.dataTable3();
      this.dataTable4();
      this.dataTable5();
    }, 500);

  }

  ngOnDestroy() {
    $('#modalAddDocument').remove();
  }

  documentTypeDropdown = () => {
    const URL = "combobox/controller/getDropByTypeAndParentId";
    this.ajax.post(URL, { type: "ACC_FEE", lovIdMaster: 1171 }, res => {
      this.documentTypeList = res.json();
      console.log(this.documentTypeList);
    });
  }

  dataTable = function () {
    var table = $('#tableData').DataTable({
      "lengthChange": false,
      "paging": false,
      "info": false,
      "serverSide": true,
      "searching": false,
      "ordering": false,
      "processing": true,
      "scrollX": true,
      "ajax": {
        "url": '/ims-webapp/api/ia/int0911/list',
        "contentType": "application/json",
        "type": "POST",
        "data": (d) => {
          return JSON.stringify($.extend({}, d, {
            "searchFlag": "TRUE",
            "idProcess": this.idProcess,
            "pickedType": "1162",
            "budgetType": "1907"

          }));
        },
      },
      "columns": [
        {
          "data": "id",
          "className": "ui center aligned",
          "render": function (data, type, row, meta) {
            return meta.row + meta.settings._iDisplayStart + 1;
          }
        }, {
          "data": "createdDate",
          "className": "ui center aligned"
        }, {
          "data": "createdBy"
        }, {
          "data": "documentType"
        }, {
          "data": "subject"
        }, {
          "data": "pickedType",
          "render": function (data, type, row) {
            var s = '';
            if (data == 1162) {
              s = 'ก่อนเดินทางไปราชการ';
            } else {
              s = 'หลังเดินทางไปราชการ';
            }
            return s;
          }
        }, {
          "data": "budgetType",
          "render": function (data, type, row) {
            var s = '';
            if (data == '1907') {
              s = 'เงินงบประมาณ';
            } else {
              s = 'เงินนอกงบประมาณ';
            }
            return s;
          }
        }, {
          "data": "status",
          "className": "ui center aligned",
          "render": function (data, type, row) {
            var s = '';

            if (data == 1196) {
              s = 'ไม่อนุมัติ';
            } else if (data == 1195) {
              s = 'อนุมัติ';
            } else if (data == 1194) {
              s = 'รออนุมัติ';
            } else {
              s = 'ยังไม่ได้สร้างเอกสาร';
            }
            return s;
          }
        }, {
          "data": "id",
          "className": "ui center aligned",
          "render": function (data, type, row) {
            var btn = '';
            btn += '<button class="mini ui yellow button btn-download"><i class="download icon"></i>ดาวน์โหลด</button>';
            btn += '<button class="mini ui red button btn-delete"><i class="trash alternate icon"></i>ลบ</button>';
            btn += '<button class="mini ui green button btn-approve"><i class="check icon"></i>อนุมัติ</button>';
            btn += '<button class="mini ui orange button btn-unapproved"><i class="minus circle icon"></i>ไม่อนุมัติ</button>';
            btn += '<button class="mini ui primary button btn-detail"><i class="eye icon"></i>รายละเอียด</button>';
            return btn;
          }
        }
      ]
    });

    //button download>
    table.on('click', 'tbody tr button.btn-download', (e) => {
      var closestRow = $(e.target).closest('tr');
      var data = table.row(closestRow).data();
      this.router.navigate(['/int09/1/1'], {
        queryParams: { idProcess: data.id }
      });
      console.log(data);
    });
    //button delete>
    table.on('click', 'tbody tr button.btn-delete', (e) => {
      var closestRow = $(e.target).closest('tr');
      var data = table.row(closestRow).data();

      const URL = "ia/int0911/delete";
      this.message.comfirm((res) => {
        if (res) {

          this.ajax.post(URL, { id: data.id }, res => {
            const msg = res.json();
            if (msg.messageType == "C") {
              this.message.successModal(msg.messageTh);
            } else {
              this.message.errorModal(msg.messageTh);
            }
            $("#searchFlag").val("TRUE");
            $('#tableData').DataTable().ajax.reload();
          });
        }
      }, "ลบรายการ");

    });

    table.on('click', 'tbody tr button.btn-approve', (e) => {
      var closestRow = $(e.target).closest('tr');
      var data = table.row(closestRow).data();
      const URL = "ia/int0911/approve";
      this.message.comfirm((res) => {
        if (res) {

          this.ajax.post(URL, { id: data.id, approve: "1195" }, res => {
            const msg = res.json();
            if (msg.messageType == "C") {
              this.message.successModal(msg.messageTh);
            } else {
              this.message.errorModal(msg.messageTh);
            }
            $("#searchFlag").val("TRUE");
            $('#tableData').DataTable().ajax.reload();
          });
        }
      }, "อนุมัติ");
    });
    table.on('click', 'tbody tr button.btn-unapproved', (e) => {
      var closestRow = $(e.target).closest('tr');
      var data = table.row(closestRow).data();
      const URL = "ia/int0911/approve";
      this.message.comfirm((res) => {
        if (res) {

          this.ajax.post(URL, { id: data.id, approve: "1196" }, res => {
            const msg = res.json();
            if (msg.messageType == "C") {
              this.message.successModal(msg.messageTh);
            } else {
              this.message.errorModal(msg.messageTh);
            }
            $("#searchFlag").val("TRUE");
            $('#tableData').DataTable().ajax.reload();
          });
        }
      }, "ไม่อนุมัติ");
    });
    //button detail>
    table.on('click', 'tbody tr button.btn-detail', (e) => {
      var closestRow = $(e.target).closest('tr');
      var data = table.row(closestRow).data();
      console.log('data: ', data);
      if (data.subject === 'ประมาณการค่าใช้จ่ายในการเดินทางไปราชการ') {
        this.router.navigate(['/int05/01/01/01'], {
          // queryParams: { idProcess: data.id }
        });
      } else if (data.subject === 'สัญญาการยืมเงิน') {
        this.router.navigate(['/int05/01/01/02'], {
          // queryParams: { idProcess: data.id }
        });
      } else if (data.subject === 'ขอกันเงินงบประมาณ') {
        this.router.navigate(['/int05/01/01/03'], {
          // queryParams: { idProcess: data.id }
        });
      } else if (data.subject === 'ขออนุมัติเดินทางไปราชการ') {
        this.router.navigate(['/int05/01/01/04'], {
          // queryParams: { idProcess: data.id }
        });
      } else if (data.subject === 'ขอใช้รถยนต์ส่วนกลางในการใช้ไปราชการต่างจังหวัด') {
        this.router.navigate(['/int05/01/01/05'], {
          // queryParams: { idProcess: data.id }
        });
      } else {
        this.message.errorModal("เกิดข้อผิดพลาด กรุณาติดต่อเจ้าหน้าที่");
      }

    });
  }
  dataTable3 = function () {
    var table3 = $('#tableData3').DataTable({
      "lengthChange": false,
      "paging": false,
      "info": false,
      "serverSide": true,
      "searching": false,
      "ordering": false,
      "processing": true,
      "scrollX": true,
      "ajax": {
        "url": '/ims-webapp/api/ia/int0911/list',
        "contentType": "application/json",
        "type": "POST",
        "data": (d) => {
          return JSON.stringify($.extend({}, d, {
            "searchFlag": "TRUE",
            "idProcess": this.idProcess,
            "pickedType": "1162",
            "budgetType": "1908"

          }));
        },
      },
      "columns": [
        {
          "data": "id",
          "className": "ui center aligned",
          "render": function (data, type, row, meta) {
            return meta.row + meta.settings._iDisplayStart + 1;
          }
        }, {
          "data": "createdDate",
          "className": "ui center aligned"
        }, {
          "data": "createdBy"
        }, {
          "data": "documentType"
        }, {
          "data": "subject"
        }, {
          "data": "pickedType",
          "render": function (data, type, row) {
            var s = '';
            if (data == 1162) {
              s = 'ก่อนเดินทางไปราชการ';
            } else {
              s = 'หลังเดินทางไปราชการ';
            }
            return s;
          }
        }, {
          "data": "budgetType",
          "render": function (data, type, row) {
            var s = '';
            if (data == '1907') {
              s = 'เงินงบประมาณ';
            } else {
              s = 'เงินนอกงบประมาณ';
            }
            return s;
          }
        }, {
          "data": "status",
          "className": "ui center aligned",
          "render": function (data, type, row) {
            var s = '';

            if (data == 1196) {
              s = 'ไม่อนุมัติ';
            } else if (data == 1195) {
              s = 'อนุมัติ';
            } else if (data == 1194) {
              s = 'รออนุมัติ';
            } else {
              s = 'ยังไม่ได้สร้างเอกสาร';
            }
            return s;
          }
        }, {
          "data": "id",
          "className": "ui center aligned",
          "render": function (data, type, row) {
            var btn = '';
            btn += '<button class="mini ui yellow button btn-download"><i class="download icon"></i>ดาวน์โหลด</button>';
            btn += '<button class="mini ui red button btn-delete"><i class="trash alternate icon"></i>ลบ</button>';
            btn += '<button class="mini ui green button btn-approve"><i class="check icon"></i>อนุมัติ</button>';
            btn += '<button class="mini ui orange button btn-unapproved"><i class="minus circle icon"></i>ไม่อนุมัติ</button>';
            btn += '<button class="mini ui primary button btn-detail"><i class="eye icon"></i>รายละเอียด</button>';
            return btn;
          }
        }
      ]
    });

    //button download>
    table3.on('click', 'tbody tr button.btn-download', (e) => {
      var closestRow = $(e.target).closest('tr');
      var data = table3.row(closestRow).data();
      this.router.navigate(['/int09/1/1'], {
        queryParams: { idProcess: data.id }
      });
      console.log(data);
    });
    //button delete>
    table3.on('click', 'tbody tr button.btn-delete', (e) => {
      var closestRow = $(e.target).closest('tr');
      var data = table3.row(closestRow).data();

      const URL = "ia/int0911/delete";
      this.message.comfirm((res) => {
        if (res) {

          this.ajax.post(URL, { id: data.id }, res => {
            const msg = res.json();
            if (msg.messageType == "C") {
              this.message.successModal(msg.messageTh);
            } else {
              this.message.errorModal(msg.messageTh);
            }
            $("#searchFlag").val("TRUE");
            $('#tableData').DataTable().ajax.reload();
          });
        }
      }, "ลบรายการ");

    });

    table3.on('click', 'tbody tr button.btn-approve', (e) => {
      var closestRow = $(e.target).closest('tr');
      var data = table3.row(closestRow).data();
      const URL = "ia/int0911/approve";
      this.message.comfirm((res) => {
        if (res) {

          this.ajax.post(URL, { id: data.id, approve: "1195" }, res => {
            const msg = res.json();
            if (msg.messageType == "C") {
              this.message.successModal(msg.messageTh);
            } else {
              this.message.errorModal(msg.messageTh);
            }
            $("#searchFlag").val("TRUE");
            $('#tableData').DataTable().ajax.reload();
          });
        }
      }, "อนุมัติ");
    });
    table3.on('click', 'tbody tr button.btn-unapproved', (e) => {
      var closestRow = $(e.target).closest('tr');
      var data = table3.row(closestRow).data();
      const URL = "ia/int0911/approve";
      this.message.comfirm((res) => {
        if (res) {

          this.ajax.post(URL, { id: data.id, approve: "1196" }, res => {
            const msg = res.json();
            if (msg.messageType == "C") {
              this.message.successModal(msg.messageTh);
            } else {
              this.message.errorModal(msg.messageTh);
            }
            $("#searchFlag").val("TRUE");
            $('#tableData').DataTable().ajax.reload();
          });
        }
      }, "ไม่อนุมัติ");
    });
    //button detail>
    table3.on('click', 'tbody tr button.btn-detail', (e) => {
      var closestRow = $(e.target).closest('tr');
      var data = table3.row(closestRow).data();
      this.router.navigate(['/int05/01/01/02'], {
        // queryParams: { idProcess: data.id }
      });
    });
  }
  dataTable4 = function () {
    var table4 = $('#tableData4').DataTable({
      "lengthChange": false,
      "paging": false,
      "info": false,
      "serverSide": true,
      "searching": false,
      "ordering": false,
      "processing": true,
      "scrollX": true,
      "ajax": {
        "url": '/ims-webapp/api/ia/int0911/list',
        "contentType": "application/json",
        "type": "POST",
        "data": (d) => {
          return JSON.stringify($.extend({}, d, {
            "searchFlag": "TRUE",
            "idProcess": this.idProcess,
            "pickedType": "1163",
            "budgetType": "1907"

          }));
        },
      },
      "columns": [
        {
          "data": "id",
          "className": "ui center aligned",
          "render": function (data, type, row, meta) {
            return meta.row + meta.settings._iDisplayStart + 1;
          }
        }, {
          "data": "createdDate",
          "className": "ui center aligned"
        }, {
          "data": "createdBy"
        }, {
          "data": "documentType"
        }, {
          "data": "subject"
        }, {
          "data": "pickedType",
          "render": function (data, type, row) {
            var s = '';
            if (data == 1162) {
              s = 'ก่อนเดินทางไปราชการ';
            } else {
              s = 'หลังเดินทางไปราชการ';
            }
            return s;
          }
        }, {
          "data": "budgetType",
          "render": function (data, type, row) {
            var s = '';
            if (data == '1907') {
              s = 'เงินงบประมาณ';
            } else {
              s = 'เงินนอกงบประมาณ';
            }
            return s;
          }
        }, {
          "data": "status",
          "className": "ui center aligned",
          "render": function (data, type, row) {
            var s = '';

            if (data == 1196) {
              s = 'ไม่อนุมัติ';
            } else if (data == 1195) {
              s = 'อนุมัติ';
            } else if (data == 1194) {
              s = 'รออนุมัติ';
            } else {
              s = 'ยังไม่ได้สร้างเอกสาร';
            }
            return s;
          }
        }, {
          "data": "id",
          "className": "ui center aligned",
          "render": function (data, type, row) {
            var btn = '';
            btn += '<button class="mini ui yellow button btn-download"><i class="download icon"></i>ดาวน์โหลด</button>';
            btn += '<button class="mini ui red button btn-delete"><i class="trash alternate icon"></i>ลบ</button>';
            btn += '<button class="mini ui green button btn-approve"><i class="check icon"></i>อนุมัติ</button>';
            btn += '<button class="mini ui orange button btn-unapproved"><i class="minus circle icon"></i>ไม่อนุมัติ</button>';
            btn += '<button class="mini ui primary button btn-detail"><i class="eye icon"></i>รายละเอียด</button>';
            return btn;
          }
        }
      ]
    });

    //button download>
    table4.on('click', 'tbody tr button.btn-download', (e) => {
      var closestRow = $(e.target).closest('tr');
      var data = table4.row(closestRow).data();
      this.router.navigate(['/int09/1/1'], {
        queryParams: { idProcess: data.id }
      });
      console.log(data);
    });
    //button delete>
    table4.on('click', 'tbody tr button.btn-delete', (e) => {
      var closestRow = $(e.target).closest('tr');
      var data = table4.row(closestRow).data();

      const URL = "ia/int0911/delete";
      this.message.comfirm((res) => {
        if (res) {

          this.ajax.post(URL, { id: data.id }, res => {
            const msg = res.json();
            if (msg.messageType == "C") {
              this.message.successModal(msg.messageTh);
            } else {
              this.message.errorModal(msg.messageTh);
            }
            $("#searchFlag").val("TRUE");
            $('#tableData').DataTable().ajax.reload();
          });
        }
      }, "ลบรายการ");

    });

    table4.on('click', 'tbody tr button.btn-approve', (e) => {
      var closestRow = $(e.target).closest('tr');
      var data = table4.row(closestRow).data();
      const URL = "ia/int0911/approve";
      this.message.comfirm((res) => {
        if (res) {

          this.ajax.post(URL, { id: data.id, approve: "1195" }, res => {
            const msg = res.json();
            if (msg.messageType == "C") {
              this.message.successModal(msg.messageTh);
            } else {
              this.message.errorModal(msg.messageTh);
            }
            $("#searchFlag").val("TRUE");
            $('#tableData').DataTable().ajax.reload();
          });
        }
      }, "อนุมัติ");
    });
    table4.on('click', 'tbody tr button.btn-unapproved', (e) => {
      var closestRow = $(e.target).closest('tr');
      var data = table4.row(closestRow).data();
      const URL = "ia/int0911/approve";
      this.message.comfirm((res) => {
        if (res) {

          this.ajax.post(URL, { id: data.id, approve: "1196" }, res => {
            const msg = res.json();
            if (msg.messageType == "C") {
              this.message.successModal(msg.messageTh);
            } else {
              this.message.errorModal(msg.messageTh);
            }
            $("#searchFlag").val("TRUE");
            $('#tableData').DataTable().ajax.reload();
          });
        }
      }, "ไม่อนุมัติ");
    });
    //button detail>
    table4.on('click', 'tbody tr button.btn-detail', (e) => {
      var closestRow = $(e.target).closest('tr');
      var data = table4.row(closestRow).data();
      this.router.navigate(['/int05/01/01/03'], {
        // queryParams: { idProcess: data.id }
      });
    });
  }
  dataTable5 = function () {
    var table5 = $('#tableData5').DataTable({
      "lengthChange": false,
      "paging": false,
      "info": false,
      "serverSide": true,
      "searching": false,
      "ordering": false,
      "processing": true,
      "scrollX": true,
      "ajax": {
        "url": '/ims-webapp/api/ia/int0911/list',
        "contentType": "application/json",
        "type": "POST",
        "data": (d) => {
          return JSON.stringify($.extend({}, d, {
            "searchFlag": "TRUE",
            "idProcess": this.idProcess,
            "pickedType": "1163",
            "budgetType": "1908"

          }));
        },
      },
      "columns": [
        {
          "data": "id",
          "className": "ui center aligned",
          "render": function (data, type, row, meta) {
            return meta.row + meta.settings._iDisplayStart + 1;
          }
        }, {
          "data": "createdDate",
          "className": "ui center aligned"
        }, {
          "data": "createdBy"
        }, {
          "data": "documentType"
        }, {
          "data": "subject"
        }, {
          "data": "pickedType",
          "render": function (data, type, row) {
            var s = '';
            if (data == 1162) {
              s = 'ก่อนเดินทางไปราชการ';
            } else {
              s = 'หลังเดินทางไปราชการ';
            }
            return s;
          }
        }, {
          "data": "budgetType",
          "render": function (data, type, row) {
            var s = '';
            if (data == '1907') {
              s = 'เงินงบประมาณ';
            } else {
              s = 'เงินนอกงบประมาณ';
            }
            return s;
          }
        }, {
          "data": "status",
          "className": "ui center aligned",
          "render": function (data, type, row) {
            var s = '';

            if (data == 1196) {
              s = 'ไม่อนุมัติ';
            } else if (data == 1195) {
              s = 'อนุมัติ';
            } else if (data == 1194) {
              s = 'รออนุมัติ';
            } else {
              s = 'ยังไม่ได้สร้างเอกสาร';
            }
            return s;
          }
        }, {
          "data": "id",
          "className": "ui center aligned",
          "render": function (data, type, row) {
            var btn = '';
            btn += '<button class="mini ui yellow button btn-download"><i class="download icon"></i>ดาวน์โหลด</button>';
            btn += '<button class="mini ui red button btn-delete"><i class="trash alternate icon"></i>ลบ</button>';
            btn += '<button class="mini ui green button btn-approve"><i class="check icon"></i>อนุมัติ</button>';
            btn += '<button class="mini ui orange button btn-unapproved"><i class="minus circle icon"></i>ไม่อนุมัติ</button>';
            btn += '<button class="mini ui primary button btn-detail"><i class="eye icon"></i>รายละเอียด</button>';
            return btn;
          }
        }
      ]
    });

    //button download>
    table5.on('click', 'tbody tr button.btn-download', (e) => {
      var closestRow = $(e.target).closest('tr');
      var data = table5.row(closestRow).data();
      this.router.navigate(['/int09/1/1'], {
        queryParams: { idProcess: data.id }
      });
      console.log(data);
    });
    //button delete>
    table5.on('click', 'tbody tr button.btn-delete', (e) => {
      var closestRow = $(e.target).closest('tr');
      var data = table5.row(closestRow).data();

      const URL = "ia/int0911/delete";
      this.message.comfirm((res) => {
        if (res) {

          this.ajax.post(URL, { id: data.id }, res => {
            const msg = res.json();
            if (msg.messageType == "C") {
              this.message.successModal(msg.messageTh);
            } else {
              this.message.errorModal(msg.messageTh);
            }
            $("#searchFlag").val("TRUE");
            $('#tableData').DataTable().ajax.reload();
          });
        }
      }, "ลบรายการ");

    });

    table5.on('click', 'tbody tr button.btn-approve', (e) => {
      var closestRow = $(e.target).closest('tr');
      var data = table5.row(closestRow).data();
      const URL = "ia/int0911/approve";
      this.message.comfirm((res) => {
        if (res) {

          this.ajax.post(URL, { id: data.id, approve: "1195" }, res => {
            const msg = res.json();
            if (msg.messageType == "C") {
              this.message.successModal(msg.messageTh);
            } else {
              this.message.errorModal(msg.messageTh);
            }
            $("#searchFlag").val("TRUE");
            $('#tableData').DataTable().ajax.reload();
          });
        }
      }, "อนุมัติ");
    });
    table5.on('click', 'tbody tr button.btn-unapproved', (e) => {
      var closestRow = $(e.target).closest('tr');
      var data = table5.row(closestRow).data();
      const URL = "ia/int0911/approve";
      this.message.comfirm((res) => {
        if (res) {

          this.ajax.post(URL, { id: data.id, approve: "1196" }, res => {
            const msg = res.json();
            if (msg.messageType == "C") {
              this.message.successModal(msg.messageTh);
            } else {
              this.message.errorModal(msg.messageTh);
            }
            $("#searchFlag").val("TRUE");
            $('#tableData').DataTable().ajax.reload();
          });
        }
      }, "ไม่อนุมัติ");
    });
    //button detail>
    table5.on('click', 'tbody tr button.btn-detail', (e) => {
      var closestRow = $(e.target).closest('tr');
      var data = table5.row(closestRow).data();
      this.router.navigate(['/int05/01/01/04'], {
        // queryParams: { idProcess: data.id }
      });
    });
  }

  dataTable2 = function () {
    var table2 = $('#tableData2').DataTable({
      "lengthChange": true,
      "serverSide": false,
      "searching": false,
      "ordering": false,
      "processing": true,
      "scrollX": true,
      "ajax": {
        "url": '/ims-webapp/api/ia/int0911/list2',
        "contentType": "application/json",
        "type": "POST",
        "data": (d) => {
          return JSON.stringify($.extend({}, d, {
            "searchFlag": "TRUE",
            "idProcess": this.idProcess
          }));
        },
      },
      "columns": [
        {
          "data": "id",
          "className": "ui center aligned",
          "render": function (data, type, row, meta) {
            return meta.row + meta.settings._iDisplayStart + 1;
          }
        }, {
          "data": "createdDate",
          "className": "ui center aligned"
        }, {
          "data": "createdBy"
        }, {
          "data": "documentName"
        }, {
          "data": "documantSize",
          "className": "ui right aligned"
        }, {
          "data": "id",
          "className": "ui center aligned",
          "render": function (data, type, row) {
            var btn = '';
            btn += '<button class="mini ui yellow button btn-download"><i class="download icon"></i>ดาวน์โหลด</button>';
            btn += '<button class="mini ui red button btn-delete"><i class="trash alternate icon"></i>ลบ</button>';
            return btn;
          }
        }
      ]
    });

    //button download>
    table2.on('click', 'tbody tr button.btn-download', (e) => {
      var closestRow = $(e.target).closest('tr');
      var data = table2.row(closestRow).data();
      this.router.navigate(['/int09/1/1'], {
        queryParams: { idProcess: data.id }
      });
      console.log(data);
    });
    //button delete>
    table2.on('click', 'tbody tr button.btn-delete', (e) => {
      var closestRow = $(e.target).closest('tr');
      var data = table2.row(closestRow).data();

      const URL = "ia/int0911/deleteT2";
      this.message.comfirm((res) => {
        if (res) {

          this.ajax.post(URL, { id: data.id }, res => {
            const msg = res.json();
            if (msg.messageType == "C") {
              this.message.successModal(msg.messageTh);
            } else {
              this.message.errorModal(msg.messageTh);
            }
            $("#searchFlag").val("TRUE");
            $('#tableData2').DataTable().ajax.reload();
          });
        }
      }, "ลบรายการ");

    });
    table2.on('click', 'tbody tr button.btn-approve', (e) => {
      var closestRow = $(e.target).closest('tr');
      var data = table2.row(closestRow).data();
      const URL = "ia/int0911/approveT2";
      this.message.comfirm((res) => {
        if (res) {

          this.ajax.post(URL, { id: data.id, approve: "1195" }, res => {
            const msg = res.json();
            if (msg.messageType == "C") {
              this.message.successModal(msg.messageTh);
            } else {
              this.message.errorModal(msg.messageTh);
            }
            $("#searchFlag").val("TRUE");
            $('#tableData2').DataTable().ajax.reload();
          });
        }
      }, "อนุมัติ");
    });
    table2.on('click', 'tbody tr button.btn-unapproved', (e) => {
      var closestRow = $(e.target).closest('tr');
      var data = table2.row(closestRow).data();
      const URL = "ia/int0911/approveT2";
      this.message.comfirm((res) => {
        if (res) {

          this.ajax.post(URL, { id: data.id, approve: "1196" }, res => {
            const msg = res.json();
            if (msg.messageType == "C") {
              this.message.successModal(msg.messageTh);
            } else {
              this.message.errorModal(msg.messageTh);
            }
            $("#searchFlag").val("TRUE");
            $('#tableData2').DataTable().ajax.reload();
          });
        }
      }, "ไม่อนุมัติ");
    });


  }
  modalAddDocument() {
    $('#modalAddDocument').modal('show');
  }
  addDocument() {
    console.log("Add Document : True");
    $('#modalAddDocument').modal('hide');
    if ($('#documentType').val() == 1172) {
      this.router.navigate(['/int09/1/1/1'], {
        queryParams: { idProcess: this.idProcess }
      });
    } else if ($('#documentType').val() == 1173) {
      this.router.navigate(['/int09/1/1/2'], {
        queryParams: { idProcess: this.idProcess }
      });
    } else if ($('#documentType').val() == 1174) {
      this.router.navigate(['/int09/1/1/3'], {
        queryParams: { idProcess: this.idProcess }
      });
    } else if ($('#documentType').val() == 1175) {
      this.router.navigate(['/int09/1/1/4'], {
        queryParams: { idProcess: this.idProcess }
      });
    } else if ($('#documentType').val() == 1176) {
      this.router.navigate(['/int09/1/1/5'], {
        queryParams: { idProcess: this.idProcess }
      });
    }

  }
  clickBack() {
    this.router.navigate(['/int09/1']);
  }

  getHead = () => {

    const URL = "ia/int0911/gethead";
    this.ajax.post(URL, { idProcess: this.idProcess }, res => {
      this.head = res.json();
      console.log("Head : ", this.head);

      this.pickedType = this.head.pickedType;
      this.fiscalYear = this.head.fiscalYear;
      this.departureDate = parseInt(this.head.departureDate.split("/")[0]) + " " + TextDateTH.months[parseInt(this.head.departureDate.split("/")[1]) - 1] + " " + this.head.departureDate.split("/")[2];
      this.returnDate = parseInt(this.head.returnDate.split("/")[0]) + " " + TextDateTH.months[parseInt(this.head.returnDate.split("/")[1]) - 1] + " " + this.head.returnDate.split("/")[2];;
      this.travelToDescription = this.head.travelToDescription;
    });
  }
  onUpload = (event: any) => {
    // Prevent actual form submission
    event.preventDefault();

    //send form data
    const form = $("#upload-form")[0];
    var formBody = new FormData(form);
    formBody.append("idProcess", this.idProcess);


    const url = "ia/int0911/uploadFile";
    this.ajax.upload(
      url,
      formBody,
      res => {
        const msg = res.json();
        if (msg.messageType == "C") {
          this.message.successModal(msg.messageTh);
        } else {
          this.message.errorModal(msg.messageTh);
        }
        $("#searchFlag").val("TRUE");
        $('#tableData2').DataTable().ajax.reload();
      },
      err => {
        this.message.errorModal(
          "ไม่สามารถอัพโหลดข้อมูลได้",
          "เกิดข้อผิดพลาด"
        );
      }
    );
  };
  onChangeUpload = (event: any) => {
    if (event.target.files && event.target.files.length > 0) {
      var reader = new FileReader();

      reader.onload = (e: any) => {
        const f = {
          name: event.target.files[0].name,
          type: event.target.files[0].type,
          value: e.target.result
        };
        this.fileUpload = [f];
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };
}

class File {
  [x: string]: any;
  name: string
  type: string
  value: any
}