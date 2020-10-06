import { Component, OnInit, AfterViewInit } from '@angular/core';
import { BreadcrumbContant } from 'app/buckwaframework/project/tax-audit/tax-audit-new/BreadcrumbContant';
import { BreadCrumb } from 'app/buckwaframework/common/models/breadcrumb.model';
import { AjaxService } from 'app/buckwaframework/common/services/ajax.service';
import { Utils } from 'app/buckwaframework/common/helper/utils';
import { MessageService } from 'app/buckwaframework/common/services/message.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ResponseData } from 'app/buckwaframework/common/models/response-data.model';
import { MessageBarService } from 'app/buckwaframework/common/services/message-bar.service';
import { TextDateTH } from 'helpers/index';
import { formatter } from 'helpers/index';
declare var $: any;

@Component({
  selector: 'app-ta0206',
  templateUrl: './ta0206.component.html',
  styleUrls: ['./ta0206.component.css']
})
export class Ta0206Component implements OnInit, AfterViewInit {

  b: BreadcrumbContant = new BreadcrumbContant();
  breadcrumb: BreadCrumb[] = [
    { label: this.b.b00.label, route: this.b.b00.route },
    { label: this.b.b15.label, route: this.b.b15.route },
    { label: this.b.b17.label, route: this.b.b17.route }
  ];
  loading: boolean = false;
  formGroup: FormGroup;

  table: any;
  datas: any;
  facTypeList: any[] = [];
  dutyCodeList: any[] = [];
  detail: Detail = new Detail();
  startDate: Date;
  endDate: Date;
  budgetYear:string;
  budgetYearNumber:number;
  analysisNumber:string;
  planNumber :string;
  regStatusList: any[];
  constructor(
    private ajax: AjaxService,
    private formBuilder: FormBuilder,
    private messageBar: MessageBarService
  ) { }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      cusFullname: [''],
      facFullname: [''],
      facType: [''],
      dutyCode: [''],
      dateFrom:[''],
      dateTo:[''],
      cusType:[''],
      cusId:[''],
      regStatus:[[]],
    });
    this.getFacTypeList();
    this.getBudgetYearAndAnalysisNumber();
    this.getRegStatus();
  }
  ngAfterViewInit(): void {
    this.dataTable();
    // setTimeout(() => {
    //   $("#facType").css('min-width', '3em');
    // }, 200);

    // $("#facType").dropdown('set selected', '0');
    $("#dutyCode").dropdown('set selected', '0');
    $("#cusType").dropdown('set selected', '0');
    this.callDropdown();
    this.calendar();
  }
  search() {
    console.log("search", this.formGroup.value)
    this.table.ajax.reload();
  }
  clear() {
    this.formGroup.reset();
    this.formGroup.patchValue([]);
    $("#facType").dropdown('set selected', '0');
    $("#dutyCode").dropdown('set selected', '0');
    $("#cusType").dropdown('set selected', '0');
    console.log("clear", this.formGroup.value)

    this.table.ajax.reload();
  }

  callDropdown() {
    setTimeout(() => {
      $(".dropdown").dropdown();
    }, 100);
  }

  calendar() {
    $("#dateFromCalendar").calendar({
      endCalendar: $('#dateToCalendar'),
      type: "date",
      text: TextDateTH,
      formatter: formatter('day-month-year'),
      onChange: (date, text) => {
        this.startDate = text;
        this.formGroup.get('dateFrom').patchValue(date);
      }
    });
    $("#dateToCalendar").calendar({
      startCalendar: $('#dateFromCalendar'),
      type: "date",
      text: TextDateTH,
      formatter: formatter('day-month-year'),
      minDate: this.startDate,
      onChange: (date, text) => {
        this.startDate = text;
        this.formGroup.get('dateTo').patchValue(date);
      }
    });
  }

  getBudgetYearAndAnalysisNumber(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.ajax.doPost("preferences/budget-year", {}).subscribe((res: ResponseData<any>) => {
        if (MessageService.MSG.SUCCESS == res.status) {
          this.budgetYear = res.data
          this.budgetYearNumber = Number(this.budgetYear);
          console.log("budgetYear :", res.data)
          this.ajax.doPost("ta/tax-operator/find-one-budget-plan-header", { "budgetYear": this.budgetYear }).subscribe((res: ResponseData<any>) => {
            this.loading = false;
            if (MessageService.MSG.SUCCESS == res.status) {
              console.log("getBudgetYearAndAnalysisNumber :", res)
              if (res.data == null) {
                this.analysisNumber = '';
                this.planNumber = '';
              } else {
                this.analysisNumber = res.data.analysisNumber;
                this.planNumber = res.data.planNumber;
              }
              resolve(res.data);
            } else {
              this.messageBar.errorModal("function checkShowButton error!");
            }

          });
        } else {
          this.messageBar.errorModal("Budget year Error !!");
        }
      });

    });
  }

  dataTable = () => {
    // if ($('#tableData').DataTable() != null) { $('#tableData').DataTable().destroy(); };

    // let renderString = (data, type, row, meta) => {
    //   if (Utils.isNull(data)) {
    //     data = "-";
    //   }
    //   return data;
    // };

    const URL = AjaxService.CONTEXT_PATH + 'ta/tax-audit/outside-plan'
    this.table = $("#tableDetails").DataTableTh({
      processing: true,
      serverSide: true,
      paging: true,
      scrollX: true,
      ajax: {
        type: "POST",
        url: URL,
        contentType: "application/json",
        data: (d) => {
          return JSON.stringify($.extend({}, d, {
            "facType": this.formGroup.get('facType').value == '0' ? this.formGroup.get('facType').patchValue('') : this.formGroup.get('facType').value,
            "dutyCode": this.formGroup.get('dutyCode').value == '0' ? this.formGroup.get('dutyCode').patchValue('') : this.formGroup.get('dutyCode').value,
            "cusFullname": this.formGroup.get('cusFullname').value,
            "facFullname": this.formGroup.get('facFullname').value,
            "fromDate":this.formGroup.get("dateFrom").value,
            "toDate":this.formGroup.get("dateTo").value,
            "cusType":this.formGroup.get("cusType").value,
            "cusId":this.formGroup.get("cusId").value,
            "regStatus":this.formGroup.get("regStatus").value,
            "planNumber":this.planNumber
          }));
        }
      },
      columns: [
        // {
        //   render: (data, type, row, meta) => {
        //     return `<input class="ui checkbox" type="checkbox">`;
        //   },
        //   className: "text-center"
        // },
        {
          render: (data, type, row, meta) => {
            return meta.row + meta.settings._iDisplayStart + 1;
          },
          className: "text-center"
        }, {
          data: "newRegId",
          className: "text-left"
        }, {
          data: "cusFullname",
          className: "text-left"
        }, {
          data: "facFullname",
          className: "text-left",
          render: (data, type, row, meta) => {
            if (data == null) {
              return `-`;
            } else {
              return `<a href="javascript:void(0)" class="details">${data}</a>`;
            }
          }
        }, {
          data: "secDesc",
          className: "text-left"
        }, {
          data: "areaDesc",
          className: "text-left"
        }, {
          data: "regDate",
          className: "text-left"
        }, {
          data: "dutyDesc",
          className: "text-left"
        }, {
          data: "regStatusDesc",
          className: "text-left"
        }
        // {
        //   data: "data6",
        //   className: "text-left"
        // }, {
        //   render: (data, type, full, meta) => {
        //     let _btn = '';
        //     _btn += `<button class="circular ui basic button auditType" type="button" 
        //      >เลือกประเภทการตรวจ</button>`;
        //     _btn += `<button class="circular ui basic button detail" type="button" 
        //     >รายละเอียด</button>`;
        //     return _btn;
        //   },
        //   className: "center"
        // }
      ]
    });

    this.table.on('click', 'tbody tr a.details', (e) => {
      var closestRow = $(e.target).closest('tr');
      var data = this.table.row(closestRow).data();
      this.detail = data;
      console.log("table.on click : ", data);

      $("#tableModal").modal({
        onShow: () => {

        }
      }).modal('show');
    });

    this.table.on('draw.dt', function() {
      $('.paginate_button').not('.previous, .next').each(function(i, a) {
         var val = $(a).text();
         val =  val.toString().replace(/(\d+)(\d{3})/, '$1' + ',' + '$2');
         $(a).text(val);
      })
    });  

    // this.datatable.on('click', 'tbody tr button.detail', (e) => {
    //   var closestRow = $(e.target).closest('tr');
    //   var data = this.datatable.row(closestRow).data();
    //   console.log(data);
    //   var datas = data;
    //   this.modelService.setData(datas);
    //   this.router.navigate(["/tax-audit-new/select07"]);
    // });
  }
  //================= backend ========================

  onChangeFacType(e) {
    this.dutyCodeList = [];
    $("#dutyCode").dropdown('restore defaults');
    let paramGroupCode = '';
    this.formGroup.get("facType").value;

    // if (this.formGroup.get("facType").value !== '0') {
    //   if (this.formGroup.get("facType").value === '2') {
    //     paramGroupCode = 'EXCISE_PRODUCT_TYPE';
    //   } else {
    //     paramGroupCode = 'EXCISE_PRODUCT_TYPE'
    //   }

    // this.getDutyCodeList(paramGroupCode);

    // }
    this.getDutyCodeList(this.formGroup.get("facType").value);

  }
  getFacTypeList() {
    this.ajax.doPost("preferences/parameter/ED_DUTY_GROUP_TYPE", {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.facTypeList = res.data;
        console.log("getFacTypeList : ", res.data)
      } else {
        this.messageBar.errorModal(res.message);
        console.log("Error getFacTypeList EXCISE_PRODUCT_TYPE Error !!");
      }
    });
  }
  getDutyCodeList(paramGroupCode) {
    this.ajax.doPost(`preferences/duty-group/list/${paramGroupCode}`, {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.dutyCodeList = res.data;
      } else {
        this.messageBar.errorModal(res.message);
        console.log("Error getFacTypeList EXCISE_PRODUCT_TYPE Error !!");
      }
    });
  }

  getRegStatus() {
    const URL = "ta/tax-audit/get-reg-status";
    this.ajax.doGet(URL).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.regStatusList = res.data;
      } else {
        this.messageBar.errorModal(res.message);
      }
    })
  }

}

class Detail {
  facAddress: string = '';
  regStatus: string = '';
  facFullname: string = '';
}
