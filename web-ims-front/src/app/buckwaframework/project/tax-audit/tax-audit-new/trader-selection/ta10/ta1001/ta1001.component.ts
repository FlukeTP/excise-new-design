import { Component, OnInit } from '@angular/core';
import { AjaxService } from 'services/index';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MessageBarService } from 'services/index';
import { ResponseData, BreadCrumb } from 'models/index';

import { MessageService } from 'app/buckwaframework/common/services/message.service';
import { Department } from 'projects/internal-audit/int02/int0201/int0201vo.model';
import { BreadcrumbContant } from 'projects/tax-audit/tax-audit-new/BreadcrumbContant';
declare var $: any;

@Component({
  selector: 'app-ta1001',
  templateUrl: './ta1001.component.html',
  styleUrls: ['./ta1001.component.css']
})
export class Ta1001Component implements OnInit {
  b: BreadcrumbContant = new BreadcrumbContant();
  breadcrumb: BreadCrumb[] = [
    { label: this.b.b00.label, route: this.b.b00.route },
    { label: this.b.b15.label, route: this.b.b15.route },
    { label: this.b.b17.label, route: this.b.b17.route }
  ];
  loading: boolean = false;
  table: any;
  datas: any;
  detail: any;
  data: any;
  form: FormGroup;
  areas: any;
  constructor(
    private ajax: AjaxService,
    private formBuilder: FormBuilder,
    private messageBar: MessageBarService) {

  }

  ngOnInit() {
    // this.dataTable();
    this.areas = [{
      subdeptCode: "",
      subdeptShortName: ""
    }];
    this.createFrom();
    this.getArea("0");

  }
  ngAfterViewInit(): void {
    // this.getPerson();
    this.dataTable();


  }
  createFrom() {
    this.form = this.formBuilder.group({
      name: [''],
      positioin: [''],
      offname: [''],
      subDeptName: [''],
      level: [''],
    })
  }

  getPerson() {
    this.ajax.doGet("/person/person-list-for-assign").subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.datas = res.data;
        // console.log("getFacTypeList : ", res.data)
      } else {
        this.messageBar.errorModal(res.message);
        console.log("Error getFacTypeList EXCISE_PRODUCT_TYPE Error !!");
      }
    });
  }

  dataTable = () => {
    if ($('#tableDetails').DataTable() != null) { $('#tableDetails').DataTable().destroy(); };

    // let renderString = (data, type, row, meta) => {
    //   if (Utils.isNull(data)) {
    //     data = "-";
    //   }
    //   return data;
    // };

    const URL = AjaxService.CONTEXT_PATH + 'person/person-list-for-assign'
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
            planNumber: ""
          }));
        }
        // data: (d) => {
        // return JSON.stringify($.extend({}, d, {
        //   "facType": this.formGroup.get('facType').value == '0' ? this.formGroup.get('facType').patchValue('') : this.formGroup.get('facType').value,
        //   "dutyCode": this.formGroup.get('dutyCode').value == '0' ? this.formGroup.get('dutyCode').patchValue('') : this.formGroup.get('dutyCode').value,
        //   "cusFullname": this.formGroup.get('cusFullname').value,
        //   "facFullname": this.formGroup.get('facFullname').value,
        // }));
        // }
      },
      columns: [
        {
          render: (data, type, row, meta) => {
            return meta.row + meta.settings._iDisplayStart + 1;
          },
          className: "text-center"
        }, {
          data: "edLogin",
          className: "text-left"
        }, {
          data: "edPersonName",
          className: "text-left"
        }, {
          data: "edPositionName",
          className: "text-left"
        }, {
          data: "officeName",
          className: "text-left"
        }, {
          data: "subDeptName",
          className: "text-left"
        }, {
          data: "level",
          className: "text-left"
        }, {
          render: (data, type, full, meta) => {
            let _btn = '';
            _btn += `<button type="button" class="ui mini button blue">แก้ไข</button>`;
            return _btn;
          },
          className: "center"
        }
      ],
    });

    // this.table.on('click', 'tbody tr a.details', (e) => {
    //   var closestRow = $(e.target).closest('tr');
    //   var data = this.table.row(closestRow).data();
    //   this.detail = data;
    //   console.log("table.on click : ", data);

    //   $("#tableModal").modal({
    //     onShow:()=>{

    //     }
    //   }).modal('show');
    // });

    this.table.on('click', 'tbody tr button.blue', (e) => {
      var closestRow = $(e.target).closest('tr');
      var data = this.table.row(closestRow).data();
      console.log(data);
      this.detail = data;
      $("#tableModal").modal({
        onShow: () => {
          $('#level').dropdown('clear');
          this.form.get("name").patchValue(data.edPersonName);
          this.form.get("positioin").patchValue(data.edPositionName);
          this.form.get("offname").patchValue(data.officeName);
          if (data.edOffcode) {
            this.getArea(data.edOffcode);
            setTimeout(() => $('#subDeptName').dropdown('set selected', data.auSubdeptCode), 500);
            setTimeout(() => $('#level').dropdown('set selected', data.level), 500);
            this.form.get("level").patchValue(data.level);
          }

        }
      }).modal('show');
    });
  }
  getArea(value: string) {
    this.areas = [];
    $('#subDeptName').dropdown('clear');
    this.ajax.doGet("preferences/department/subdept/" + value).subscribe((response: ResponseData<Department[]>) => {
      if (MessageService.MSG.SUCCESS == response.status) {
        this.areas = response.data;
        // console.log("areas " ,response.data)

      } else {
        this.areas = [];
        // this.msg.errorModal(response.message);
      }
    });
  }
  savePerson() {
    this.detail.level = this.form.get("level").value;
    this.detail.subDeptCode = this.form.get("subDeptName").value;
    this.ajax.doPost("person/save-person", this.detail).subscribe((response: ResponseData<Department[]>) => {
      if (MessageService.MSG.SUCCESS == response.status) {
        this.areas = response.data;
        // console.log("areas " ,response.data)
        this.messageBar.successModal(response.message);
        this.areas = [{
          subdeptCode: "",
          subdeptShortName: ""
        }];
        this.dataTable();

      } else {
        this.areas = [];
        // this.msg.errorModal(response.message);
      }
    });
  }
  

}
