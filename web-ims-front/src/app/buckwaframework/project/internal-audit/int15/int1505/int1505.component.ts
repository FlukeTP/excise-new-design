import { Component, OnInit } from '@angular/core';
import { BreadCrumb, ResponseData } from 'models/index';
import { MessageBarService } from 'services/message-bar.service';
import { AjaxService } from 'services/ajax.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'services/auth.service';
import { IaService } from 'services/ia.service';
import { TextDateTH, formatter } from 'helpers/datepicker';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { DepartmentDropdownService } from 'services/department-dropdown.service';
import { MessageService } from 'services/message.service';
import { DecimalFormat } from 'helpers/decimalformat';
import { Utils } from 'helpers/utils';
import { IsEmptyPipe } from 'app/buckwaframework/common/pipes/empty.pipe';
import thaibath from 'helpers/thaibath';
import { DecimalFormatPipe } from 'app/buckwaframework/common/pipes/decimal-format.pipe';

declare var $: any;
const URLS = {
  GET_LIST: "ia/int15/02/get-dropdown-coa-code",
  GET_PARAMETER_AOC: "preferences/parameter/IA_ACCOUNT_TYPE",
  SAVE_DATA: "ia/int15/05/save",
  EDIT_DATA:"ia/int15/03/edit",
  DELET:"ia/int15/05/delete"
}

@Component({
  selector: 'app-int1505',
  templateUrl: './int1505.component.html',
  styleUrls: ['./int1505.component.css']
})
export class Int1505Component implements OnInit {
  breadcrumb: BreadCrumb[] = [];
  tap: any = '1';
  dataList: any[] = [];
  coaParametor: any[] = [];
  table: any;
  formsave: FormGroup;
  constructor(
    private messageBar: MessageBarService,
    private ajax: AjaxService,
    private authService: AuthService,
    private fb: FormBuilder,
    private department: DepartmentDropdownService,
    private formBuilder: FormBuilder
  ) {
    this.breadcrumb = [
      { label: "ตรวจสอบภายใน", route: "#" },
      { label: "เตรียมข้อมูล", route: "#" },
      { label: "รหัสบัญชีเงินฝากระบบ GFMIS", route: "#" }
    ];
    this.formsave = this.formBuilder.group({
      coaId :[''],
      coaCode :[''],
      coaName:[''],
      coaDes :[''], 
      coaType:['']
    })
  }

  ngOnInit() {
    this.getDorpdownCoa();
    this.datatableall();
  }

  ngAfterViewInit() {
    this.getlistdata();
    $('.ui.dropdown').dropdown().css('width', '100%')
  }

  getlistdata() {
    this.ajax.doGet(URLS.GET_LIST).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.dataList = res.data;
        this.table.clear().draw()
        this.table.rows.add(this.dataList).draw()
        this.table.columns.adjust().draw();
        this.datatableall();
        console.log("res : ", this.dataList);
      } else {
        //console.log("getauditIncNo findAllDataHeader Error !!");
      }
    })
  }

  getDorpdownCoa() {
    this.ajax.doPost(`${URLS.GET_PARAMETER_AOC}`, {}).subscribe((res: ResponseData<any>) => {
      this.coaParametor = res.data;
      console.log("res : ", this.coaParametor);
    });
  }

  datatableall = () => {
    if (this.table != null) {
      this.table.destroy();
    }
    this.table = $("#datatableall").DataTableTh({
      processing: true,
      serverSide: false,
      paging: true,
      scrollX: true,
      pageLength: 10,
      lengthChange: false,
      
      data: this.dataList,
      columns: [
        {
          data: "coaCode", className: "text-center"
        }, {
          data: "coaName", className: "text-left"
        }, {
          data: "coaDes", className: "text-left"
        }, {
          data: "coaType", className: "text-center",
          render(data) {
            if(this.coaParametor){}
            return new IsEmptyPipe().transform(data, [])
          }
        }, {
          render: function (data, type, full, meta) {
            let btn = '';
            btn += `<button class="ui mini yellow button edit" type="button"><i class="edit icon"></i>แก้ไข</button>`;
            return btn;
          }, className: "text-center"
        }
      ]
    });
    this.table.on("click", "td > button.edit", (event) => {
      var data = this.table.row($(event.currentTarget).closest("tr")).data();
      this.editData(data);
      this.tabSlite(3);
      console.log("test : ", data);
    });
  }

  editData(data: any) {
    this.formsave.patchValue({
      coaId : data.coaId,
      coaCode :data.coaCode,
      coaName:data.coaName,
      coaDes :data.coaDes,
      coaType:data.coaType,
    })
  }

  editApi() {
    console.log("edit : ",this.formsave.value);
    this.messageBar.comfirm(confirm => {
      if (confirm) {
        this.ajax.doPost(URLS.SAVE_DATA, this.formsave.value).subscribe((res: ResponseData<any>) => {
          console.log("dataList", res);
          if (MessageService.MSG.SUCCESS == res.status) {
            this.messageBar.successModal(res.message)
            this.tabSlite(1);
            this.formsave.reset();
          } else {
            this.messageBar.errorModal(res.message)
          }
        })
      }
    }, "ยืนยันการแก้ไขข้อมูล")
  }

  saveTwoData() {
    console.log("save : ",this.formsave.value);
    this.messageBar.comfirm(confirm => {
      if (confirm) {
        this.ajax.doPost(URLS.SAVE_DATA, this.formsave.value).subscribe((res: ResponseData<any>) => {
          console.log("dataList", res);
          if (MessageService.MSG.SUCCESS == res.status) {
            this.messageBar.successModal(res.message)
            this.tabSlite(1);
            this.formsave.reset();
          } else {
            this.messageBar.errorModal(res.message)
          }
        })
      }
    }, "ยืนยันการบันทึกข้อมูล")
  }

  deleteData(){
    console.log("delete : ",this.formsave.value);
    this.messageBar.comfirm(confirm => {
      if (confirm) {
        this.ajax.doPost(URLS.DELET, this.formsave.value).subscribe((res: ResponseData<any>) => {
          if (MessageService.MSG.SUCCESS == res.status) {
            this.messageBar.successModal(res.message)
            this.tabSlite(1);
            this.formsave.reset();
          } else {
            this.messageBar.errorModal(res.message)
          }
        })
      }
    }, "ยืนยันการลบข้อมูลข้อมูล")
  }

  tabSlite(tabin: any) {
    if (tabin == "1") {
      this.tap = "1";
      this.getlistdata();
    } else if (tabin == "2") {
      setTimeout(() => {
        $('.ui.dropdown').dropdown().css('width', '100%')
      }, 50);
      this.tap = "2";
      this.formsave.reset();
    } else if (tabin == "3") {
      setTimeout(() => {
        $('.ui.dropdown').dropdown().css('width', '100%')
      }, 50);
      this.tap = "3";
    }
  }

}

