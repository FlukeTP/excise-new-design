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
  selector: 'app-se02',
  templateUrl: './se02.component.html',
  styleUrls: ['./se02.component.css']
})
export class Se02Component implements OnInit, AfterViewInit {

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
  detail : Detail = new Detail();
  startDate:Date;
  endDate:Date;
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
    });
    this.getFacTypeList();
  }
  ngAfterViewInit(): void {
    this.dataTable();
    $("#facType").dropdown('set selected', '0');
    $("#dutyCode").dropdown('set selected', '0');
    this.calendar();
  }
  search() {
    console.log("search", this.formGroup.value)
    this.table.ajax.reload();
  }
  clear() {
    this.formGroup.reset();
    
    $("#facType").dropdown('set selected', '0');
    $("#dutyCode").dropdown('set selected', '0');
    console.log("clear", this.formGroup.value)

    this.table.ajax.reload();
  }
  calendar(){
    $("#dateFromCalendar").calendar({
      type: "date",
      text: TextDateTH,
      formatter: formatter('day-month-year'),
      onChange: (date, text) => {
        this.startDate = text;
      }
    });
    $("#dateToCalendar").calendar({
      type: "date",
      text: TextDateTH,
      formatter: formatter('day-month-year'),
      minDate:this.startDate,
      onChange: (date, text) => {
        this.startDate = text;
      }
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
          }));
        }
      },
      columns: [
        {
          render: (data, type, row, meta) => {
            return `<input class="ui checkbox" type="checkbox">` ;
          },
          className: "text-center"
        },
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
            if(data == null){
              return `-`;
            }else{
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
          data: "dutyDesc",
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
      ],
    });

    this.table.on('click', 'tbody tr a.details', (e) => {
      var closestRow = $(e.target).closest('tr');
      var data = this.table.row(closestRow).data();
      this.detail = data;
      console.log("table.on click : ", data);

      $("#tableModal").modal({
        onShow:()=>{

        }
      }).modal('show');
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

    if (this.formGroup.get("facType").value !== '0') {
      if (this.formGroup.get("facType").value === '2') {
        paramGroupCode = 'EXCISE_PRODUCT_TYPE';
      } else {
        paramGroupCode = 'EXCISE_PRODUCT_TYPE'
      }

      this.getDutyCodeList(paramGroupCode);
    }

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
    this.ajax.doPost(`preferences/parameter/${paramGroupCode}`, {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.dutyCodeList = res.data;
      } else {
        this.messageBar.errorModal(res.message);
        console.log("Error getFacTypeList EXCISE_PRODUCT_TYPE Error !!");
      }
    });
  }

}

class Detail {
  facAddress: string = '';
  regStatus: string = '';
  facFullname: string = '';
}
