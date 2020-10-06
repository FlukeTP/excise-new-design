import { Component, OnInit } from "@angular/core";
import { TextDateTH, formatter, toDateLocale } from "../../../../common/helper/datepicker";
import { AjaxService, MessageBarService, AuthService } from "../../../../common/services";
import { Router, ActivatedRoute } from "@angular/router";
import { IaService } from 'app/buckwaframework/common/services/ia.service';
import { BreadCrumb } from 'models/index';


declare var $: any;
@Component({
  selector: "app-tan01",
  templateUrl: "./tan01.component.html",
  styleUrls: ["./tan01.component.css"]
})
export class Tan01Component implements OnInit {

  searchFlag: String;
  breadcrumb: BreadCrumb[];
  datatable: any;
  
  statusList:  any;
  patterndList:any;

  modalMonth: string = '';
  modalYear: string = '';

  taYearPlanId:any;

  constructor(
    private message: MessageBarService,
    private ajax: AjaxService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private iaService: IaService,
    private msg: MessageBarService
  ) {
    this.breadcrumb = [
      { label: "ตรวจสอบภาษี", route: "#" },
      { label: "ผลการคัดเลือกรายประจำปี", route: "#" }
    ];

  }
  calenda = function () {
    $("#date").calendar({
      minDate: new Date(),
      type: "year",
      text: TextDateTH,
      formatter: formatter("ป")
    });

    $("#modaldate").calendar({
      endCalendar: $("#modaldatedate2"),
      maxDate: new Date(),
      type: "date",
      text: TextDateTH,
      formatter: formatter(),
      onChange: this.changeDate
    });

    $("#modaldate2").calendar({
      startCalendar: $("#modaldate"),
      maxDate: new Date(),
      type: "date",
      text: TextDateTH,
      formatter: formatter(),
      onChange: this.changeDate2
    });
    
   
  }

  clickSearch = function () {
    if ($("#fiscalYear").val() == "") {
      this.message.alert("กรุณาระบุ แผนการตรวจปฏิบัติการประจำปี");
      return false;
    }
    this.modalYear = $("#fiscalYear").val();
    $("#searchFlag").val("TRUE");
    $('#dataTable').DataTable().ajax.reload();
  }

  statusDropdown = () =>{
    const URL = "combobox/controller/getDropByTypeAndParentId";
    this.ajax.post(URL, { type: "TAX_AUDIT_NEW", lovIdMaster: 2292 }, res => {
      this.statusList = res.json();
      // $(".ui.dropdown.tan01").dropdown().css("width", "100%");

    });
  }

  patterndDropdown = () =>{
    const URL = "combobox/controller/getDropByTypeAndParentId";
    this.ajax.post(URL, { type: "TAX_AUDIT_NEW", lovIdMaster: 2296 }, res => {
      this.patterndList = res.json();
      // $(".ui.dropdown.tan01").dropdown().css("width", "100%");

    });
  }


  initDatatable = () => {
    const URL = AjaxService.CONTEXT_PATH + "taxAuditNew/tan010000/list";
    this.datatable = $("#dataTable").DataTableTh({
      // dom: 'rt<"bottom"lp><"clear">',
      serverSide: true,
      searching: false,
      processing: true,
      ordering: false,
      scrollX: true,
     
      ajax: {
        type: "POST",
        url: URL,
        contentType: "application/json",
        data: (d) => {
          return JSON.stringify($.extend({}, d, {
            "searchFlag":$("#searchFlag").val(),
            "fiscalYear":$("#fiscalYear").val(),
            "status":$("#status").val()
          }));
        }
      },
      columns: [
        {
          data: "exciseId",
          className: "ui right aligned"
        },{
          data: "companyName",
          className: "ui left aligned"
        },{
          data: "companyAddress",
          className: "ui left aligned"
        },{
          data: "exciseArea",
          className: "ui left aligned"
        },{
          data: "exciseSubArea",
          className: "ui left aligned"
        },{
          data: "product",
          className: "ui left aligned"
        },{
          data: "riskTypeDesc",
          className: "ui left aligned"
        },{
          data: "status", className: "ui center aligned",
          render: (data, type, row, meta) => {
            let str = '';
            if (data == '2295') {
              str = 'สำเร็จ';
            }if (data == '2294') {
              str = 'กำลังดำเนินการ';
            }if (data == '2293') {
              str = 'รอการดำเนินการ';
            } else {
              str = '-';
            }
         
            return str;
          }
        },{
          data: "startDate", 
          className: "ui center aligned"
        },{
          data: "endDate", 
          className: "ui center aligned"
        },{
          data: "patternd", 
          className: "ui center aligned",
          render: (data, type, row, meta) => {
            let str = '';
            if (data == '2299') {
              str = 'การตรวจตามหนังสือเรียก';
            }else if (data == '2298') {
              str = 'การตรวจแบบเบ็ดเสร็จ';
            }else if (data == '2297') {
              str = 'การตรวจกำกับดูแล';
            } else {
              str = '-';
            }
           
            return str;
          }
        },{
          "data": "exciseId",
          "render": (data, type, row) => {
            var btn = '';
  
              btn += '<button class="mini ui yellow button btn-edit"><i class="edit icon"></i>ระบุรายละเอียดการออกตรวจ</button>';
              btn += '<button class="mini ui primary button btn-description"><i class="eye icon"></i>รายละเอียด</button>';

            return btn;
          }
        }
      ]
    });

    //button description>
    this.datatable.on('click', 'tbody tr button.btn-description', (e) => {
      var closestRow = $(e.target).closest('tr');
      var data = this.datatable.row(closestRow).data();
      var path = '';
      let str = '';
      if (data.patternd == '2297') {
        path = '/tax-audit-new/tan01/01';
        str = 'การตรวจกำกับดูแล';
      } else if (data.patternd == '2298') {
        path = '/tax-audit-new/tan01/02';
        str = 'การตรวจแบบเบ็ดเสร็จ';
      } else if (data.patternd == '2299') {
        path = '/tax-audit-new/tan01/03';
        str = 'การตรวจตามหนังสือเรียก';
      } else {
        path = '/tax-audit-new/tan01/01';
        str = '-';
      }
      this.router.navigate([path], {
        queryParams: {
          id: data.taYearPlanId,
          startDate:data.startDate,
          endDate:data.endDate,
          checkSystem:str,
          exciseNo:data.exciseId,
          companyName:data.companyName,
          addressCompany:data.companyAddress,
          department:data.exciseArea,
          area:data.exciseSubArea,
          product:data.product,
          risk:data.riskTypeDesc
        }
      });
      console.log(data);
      
      
    });

    this.datatable.on('click', 'tbody tr button.btn-edit', (e) => {
      var closestRow = $(e.target).closest('tr');
      var data = this.datatable.row(closestRow).data();

      this.modalEdit(data);
    });


  };



  modalEdit = (data) => {
    console.log("data edit : ", data);

    $('#modalEdit').modal({
      autofocus: false,
      onShow: () => {
        this.calenda();
        this.taYearPlanId = data.taYearPlanId
      }
    }).modal('show');

  }
  validateDate = (req) => {
    var str = req.split("/");
    str = str[1] + str[0];
    var date = new Date();
    var datenow = date.toLocaleDateString()
    var datenowstr = datenow.split("/");
    var result = datenowstr[2] + datenowstr[1];

    var res = false;

    if (result > str) {
      res = true;
    }
    return res;
  }
  editData() {


    console.log("Edit");
    $('modalEdit').modal('hide');
    const URL = "taxAuditNew/tan010000/edit";
    this.ajax.post(URL, {
        id: this.taYearPlanId,
        patternd: $("#patternd").val(),
        startDate: $("#dateFrom").val(),
        endDate: $("#dateTo").val()

    }, res => {
      const commonMessage = res.json();

      if (commonMessage.msg.messageType == "C") {
        this.msg.successModal(commonMessage.msg.messageTh);
      } else {
        this.msg.errorModal(commonMessage.msg.messageTh);
      }
      $("#searchFlag").val("TRUE");
      $('#dataTable').DataTable().ajax.reload();
    });
  }

  ngOnInit() {
    //this.authService.reRenderVersionProgram('OPE-07100');

    this.initDatatable();
    this.calenda();
    this.statusDropdown();
    this.patterndDropdown();

 
    let date = new Date();
    let month = date.getMonth();
    let _year = toDateLocale(date)[0].split("/")[2];    
    $("#fiscalYear").val(_year);
  }

}
