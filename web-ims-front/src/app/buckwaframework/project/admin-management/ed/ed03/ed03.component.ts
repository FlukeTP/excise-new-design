import { Component, OnInit } from '@angular/core';
import { BreadCrumb, ResponseData } from 'models/index';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { formatter, TextDateTH } from "helpers/datepicker";
import { AjaxService } from 'services/ajax.service';
import { MessageBarService } from 'services/message-bar.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'services/message.service';
import { AuthService } from 'services/auth.service';
import { DecimalFormatPipe } from 'app/buckwaframework/common/pipes/decimal-format.pipe';
declare var $: any;

const URL = {
  GET_DEPARTMENT00: "ed/ed03/listDepartment0014"
}

@Component({
  selector: 'app-ed03',
  templateUrl: './ed03.component.html',
  styleUrls: ['./ed03.component.css']
})
export class Ed03Component implements OnInit {

  breadcrumb: BreadCrumb[] = [
    { label: "สินค้าและบริการ", route: "#" }
  ];
  searchProSer: FormGroup;
  saveProSer: FormGroup;
  datas: any = [];
  datasDepartment00: any = [];
  datatable: any;
  isEdit: any;
  submitted: boolean = false;
  constructor(
    private ajax: AjaxService,
    private messageBar: MessageBarService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.searchProSer = this.formBuilder.group({
      dutyGroupName: ["", Validators.required]
    })
    this.saveProSer = this.formBuilder.group({
      id: [""],
      dutyGroupCode: ["", Validators.required],
      dutyGroupName: ["", Validators.required],
      resOffcode: ["", Validators.required]
    })
  }

  ngOnInit() {
    this.onSearch()
    this.ajax.doGet(`${URL.GET_DEPARTMENT00}`).subscribe((response: ResponseData<any>) => {
      if (response.status === MessageService.MSG.SUCCESS) {
        this.datasDepartment00 = response.data
        console.log("datasDepartment00 : ", response.data);
      } else {
        this.messageBar.errorModal(response.message);
      }
    }, error => {
      this.messageBar.errorModal("กรุณาติดต่อผู้ดูแลระบบ");
    });
  }

  viewdetail2() {
    this.saveProSer.reset();
    $("#resOffcode").dropdown("restore defaults");
    $('#detail2').modal('show');
    console.log(this.saveProSer.value);
    this.isEdit = null;
  }

  viewdetail3(dataEdit: any = []) {
    $('#detail2').modal('show');
    this.isEdit = dataEdit.exciseCtrlDutyId;
    console.log("dataEdit :", dataEdit);
    this.saveProSer.patchValue({
      id: dataEdit.exciseCtrlDutyId,
      dutyGroupCode: dataEdit.dutyGroupCode,
      dutyGroupName: dataEdit.dutyGroupName,
    })
    $("#resOffcode").dropdown('set selected', dataEdit.resOffcode);
  }



  onSearch() {
    const URL = "ed/ed03/find-by-dutyGroupName"
    this.ajax.doPost(URL, this.searchProSer.value).subscribe((res: ResponseData<any>) => {
      console.log("getDataTableList", res);
      this.datas = res.data
      console.log(" this.datas :", this.datas);
      this.initDatatable();
    })
    console.log("responData : ", this.searchProSer.value);
  }

  onSaveModal() {
    console.log("responDatasaveProSer : ", this.saveProSer)
    if (this.saveProSer.invalid) {
      this.submitted = true;
      return
    }
    this.submitted = false;
      this.messageBar.comfirm(confirm => {
        if (confirm) {
          const URL = "ed/ed03/saveExciseCtrlDuty"
          this.ajax.doPost(URL, this.saveProSer.value).subscribe((res: ResponseData<any>) => {
            console.log("dataList", res);
            if (MessageService.MSG.SUCCESS == res.status) {
              this.messageBar.successModal(res.message)
              this.onSearch();
              this.datatable.clear().draw()
              this.datatable.rows.add(this.datas).draw()
              this.datatable.columns.adjust().draw();
            } else {
              if (res.data == 'Duplicstion Data') {
                this.messageBar.errorModal('มีข้อมูลอยู่แล้วกรุณาเพิ่มข้อมูลอีกครั้ง')
              } else {
                this.messageBar.errorModal(res.message)
              }
            }
          })
        }
      }, "ยืนยันการบันทึกข้อมูล")
  }

  onDelete(id: any) {
    this.messageBar.comfirm(confirm => {
      if (confirm) {
        const URL = "ed/ed03/deleteById/"
        this.ajax.doDelete(URL + id).subscribe((res: ResponseData<any>) => {
          console.log("dataList", res);
          if (MessageService.MSG.SUCCESS == res.status) {
            this.messageBar.successModal(res.message)
            this.onSearch();
            this.datatable.clear().draw()
            this.datatable.rows.add(this.datas).draw()
            this.datatable.columns.adjust().draw();
          } else {
            this.messageBar.errorModal(res.message)
          }
        })
      }
    }, "ยืนยันการลบข้อมูล")
  }

  onEditModal() {
    console.log("EditProSer : ", this.saveProSer.value);
    let id = this.saveProSer.value.id
    this.messageBar.comfirm(confirm => {
      if (confirm) {
        const URL = "ed/ed03/editExciseCtrlDuty/"
        this.ajax.doPut(URL + id, this.saveProSer.value).subscribe((res: ResponseData<any>) => {
          console.log("dataList", res);
          if (MessageService.MSG.SUCCESS == res.status) {
            this.messageBar.successModal(res.message)
            this.onSearch();
            this.datatable.clear().draw()
            this.datatable.rows.add(this.datas).draw()
            this.datatable.columns.adjust().draw();
          } else {
            if (res.data == 'Duplicstion Data') {
              this.messageBar.errorModal('มีข้อมูลอยู่แล้วกรุณาแก้ไขข้อมูลอีกครั้ง')
            } else {
              this.messageBar.errorModal(res.message)
            }
          }
        })
      }
    }, "ยืนยันการแก้ไขข้อมูล")
  }

  initDatatable(): void {
    if (this.datatable != null) {
      this.datatable.destroy();
    }
    this.datatable = $("#dataTable").DataTableTh({
      lengthChange: false,
      searching: false,
      ordering: false,
      processing: true,
      serverSide: false,
      paging: false,
      data: this.datas,
      columns: [
        {
          className: "ui center aligned",
          render: function (data, type, row, meta) {
            return meta.row + meta.settings._iDisplayStart + 1;
          }
        },
        {
          data: "dutyGroupCode",
          className: "center aglined"
        },
        {
          data: "dutyGroupName",
          className: "left aglined"
        },
        {
          data: "exciseDepartmentVo.offShortName",
          className: "left aglined"
        },
        {
          className: "ui center aligned",
          render: function (data, type, row, meta) {
            let btn = ''
            btn += `<button type="button" class="ui mini orange button edit-button"><i class="edit icon"></i>แก้ไข</button>`
            btn += `<button type="button" class="ui mini red button delete-button"><i class="trash icon"></i>ลบ</button>`
            return btn
          }
        }
      ]
    });
    this.datatable.on("click", "td > button.edit-button", (event) => {
      var data = this.datatable.row($(event.currentTarget).closest("tr")).data()
      console.log("dataintable :", data);
      this.viewdetail3(data);
      // this.editData('/management/ed/ed02/01', data.edPersonSeq);
    })

    this.datatable.on("click", "td > button.delete-button", (event) => {
      var id = this.datatable.row($(event.currentTarget).closest("tr")).data().exciseCtrlDutyId
      this.onDelete(id);
    })
  }


  invalidControlConfig(control: string) {
    return this.saveProSer.get(control).invalid && (this.saveProSer.get(control).touched || this.submitted);
  }

}
