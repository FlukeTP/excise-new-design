import { Component, OnInit } from '@angular/core';
import { File } from 'models/file.model';
import { BreadCrumb, ResponseData } from 'app/buckwaframework/common/models/index';
import { Location } from '@angular/common';
import { BreadcrumbContant } from '../../../BreadcrumbContant';
import { AjaxService } from 'app/buckwaframework/common/services/ajax.service';
import { MessageBarService } from 'app/buckwaframework/common/services/message-bar.service';
import { MessageService } from 'app/buckwaframework/common/services/message.service';
import { AuthService } from 'app/buckwaframework/common/services/auth.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TextDateTH, formatter } from 'app/buckwaframework/common/helper/datepicker';
import * as moment from 'moment';
import { Store } from '@ngrx/store';
import { forEach } from '@angular/router/src/utils/collection';

declare var $: any;
const URL = {
  GET_PLAN_NO: "ta/tax-operator/find-one-budget-plan-header",
  UPLOAD: "ta/file-upload/upload",
  FIND_DATA_UP_LOAD: "ta/file-upload/list",
  DELETE: "ta/file-upload/delete",
  DOWNLOAD: "ta/file-upload/download"
}

const CONSTANT_TA0107 = {
  MODULE_CODE: "PLAN_APPROVED",
}

@Component({
  selector: 'app-ta0107',
  templateUrl: './ta0107.component.html',
  styleUrls: ['./ta0107.component.css']
})
export class Ta0107Component implements OnInit {

  b: BreadcrumbContant = new BreadcrumbContant();

  breadcrumb: BreadCrumb[] = [
    { label: this.b.b00.label, route: this.b.b00.route },
    { label: this.b.b01.label, route: this.b.b01.route },
    { label: this.b.b04.label, route: this.b.b04.route }
  ]
  checkoffice: boolean = false;
  approver: FormGroup;
  formYear: FormGroup;
  selected: any;
  selectSector: any[];
  planWsSendData: any[];
  planWsSendDataAll: any[];
  loading: boolean = false;
  showDescApprove: boolean = false;
  toggleButtonTxt: string = 'แสดงความเห็น';
  planStatus: any = { planStatus: "", planStatusDesc: "", approvalComment: "", approvedComment: "" };
  officeCode: any;
  auditStatus: boolean = true;
  budgetYearList: any[];
  budgetYear: string;
  budgetYearNumber: Number;


  //upLoadfile
  file: File[];
  dataDocList: any = [];
  //flag
  showUpload: boolean = true;
  //tableUpload
  tableUpload: any;
  loadingDoc: boolean = false;
  planNumberU: string = '';

  constructor(
    private _location: Location,
    private ajax: AjaxService,
    private msg: MessageBarService,
    private userDetail: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private messageBar: MessageBarService,
  ) {
    this.formYear = this.fb.group({
      budgetYear: ["", Validators.required]
    });
  }


  // ============ Initial setting =================
  ngOnInit() {
    this.auditStatus = true;
    this.officeCode = this.userDetail.getUserDetails().officeCode;
    console.log("this.officeCode : ", this.officeCode);
    if (this.officeCode == '001401') {
      this.checkoffice = true;
    } else {
      this.checkoffice = false;
    }
    console.log(this.userDetail.getRole());
    this.selected = "0";
    this.setApproveForm();
    let currYear
    let currMonth = new Date().getMonth() + 1;
    if (currMonth >= 8 && currMonth <= 12) {
      currYear = new Date().getFullYear() + 543 + 1;
    } else {
      currYear = new Date().getFullYear() + 543;
    }
    this.formYear.get("budgetYear").patchValue(currYear);
    this.getSectorList();
    this.getPlanStatus();
    this.getBudgetYearList();

  }

  setApproveForm() {
    this.approver = this.fb.group({
      approvalComment: ["", Validators.required],
      approvedComment: ["", Validators.required],
      approvedDocNo: ["", Validators.required],
      approvedDocDate: ["", Validators.required],
    })
  }

  ngAfterViewInit(): void {

    // $('#selectSector').dropdown().css('min-width', '3em');
    this.initailCanlendar();

  }

  initailCanlendar() {
    $("#calendar").calendar({
      maxDate: new Date(),
      type: "year",
      text: TextDateTH,
      formatter: formatter('ป'),
      onChange: (date) => {
        let newYear = moment(date).year() + 543;
        this.formYear.get("budgetYear").patchValue(newYear);
        this.onClearUpload();
      }
    });

    $("#calendarDocDate").calendar({
      // maxDate: new Date(),
      type: "date",
      text: TextDateTH,
      formatter: formatter('วดป'),
      onChange: (date, text) => {
        this.approver.get("approvedDocDate").patchValue(date);
      }
    });
  } l

  callDropDown() {
    // setTimeout(() => {
    //   $("selectSector").dropdown();
    // }, 200);
  }

  setFormYear() {
  }

  // ================= Action ========================

  checkRole = (compare: string) => {
    return this.userDetail.getRole().some(e => e == compare);
  }

  search() {
    // this.setFormYear()
    console.log("this.formYear : ", this.formYear.value);
    this.getPlanWsSend();
    this.getSectorList();
  }

  onChange() {
    console.log('onChange')
    let checkSelected = "0";
    if (checkSelected == this.selected) {
      this.planWsSendData = this.planWsSendDataAll;
    } else {
      this.planWsSendData = this.planWsSendDataAll.filter((obj) => {
        return obj.planWorksheetSend.officeCode.slice(0, 2) == this.selected.slice(0, 2)
      });
      console.log("onChange PlanWsSend : ", this.planWsSendData);
    }

  }

  onClickDetail(officeCode) {
    console.log('onClickDetail officeCode', officeCode)
    this.router.navigate(['/tax-audit-new/ta01/07/01'], {
      queryParams: {
        officeCode: officeCode,
        budgetYear:this.budgetYear
      }
    });
  }

  onApproved(num: number) {
    this.msg.comfirm(confirm => {
      this.loading = true;
      const URL = "ta/tax-operator/update-plan-comment/";
      let data = {
        budgetYear: this.formYear.get("budgetYear").value,
        approvalComment: this.approver.value.approvalComment,
        approvedComment: this.approver.value.approvedComment,
        docApproveNo: this.approver.value.approvedDocNo,
        docApproveDate: this.approver.value.approvedDocDate,
      }
      if (num == 0) {
        data = {
          budgetYear: this.formYear.get("budgetYear").value,
          approvalComment: this.approver.value.approvalComment,
          approvedComment: null,
          docApproveNo: this.approver.value.approvedDocNo,
          docApproveDate: this.approver.value.approvedDocDate,
        }
      } else {
        data = {
          budgetYear: this.formYear.get("budgetYear").value,
          approvalComment: null,
          approvedComment: this.approver.value.approvedComment,
          docApproveNo: this.approver.value.approvedDocNo,
          docApproveDate: this.approver.value.approvedDocDate,
        }
      }
      if (confirm) {
        this.ajax.doPost(URL, data).subscribe((res: ResponseData<any>) => {
          if (MessageService.MSG.SUCCESS == res.status) {
            this.msg.successModal(res.message);
            this.getPlanStatus();
          } else {
            this.msg.errorModal(res.message);
          }
          this.loading = false;
        });
      } else {
        this.loading = false;
      }
    }, "ยืนยันการบันทึกข้อมูล");

  }

  toggleHideButton() {
    if (this.showDescApprove) {
      this.showDescApprove = false;
      this.toggleButtonTxt = 'แสดงความเห็น'
    } else {
      this.showDescApprove = true;
      this.toggleButtonTxt = 'ซ่อนความเห็น'
    }
  }

  async uploadTemplate() {
    try {
      const planNumber = await this.getPlanNumber();
      await this.findDataUpload(planNumber);
    } catch (error) {
      console.error(error.message)
    }
  }

  onClearUpload() {
    setTimeout(() => {
      $("#file").val('');
      this.dataDocList = [];
      this.showUpload = true;
    }, 100);
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

  onUpload = (event: any) => {
    if ($('#file').val() == "") {
      this.messageBar.successModal("เลือกไฟล์ เอกสารแนบ", "แจ้งเตือน")
      return
    } else {
      event.preventDefault();
      const form = $("#upload-form")[0];
      let formBody = new FormData(form);
      formBody.append("moduleCode", 'PLAN_APPROVED');
      formBody.append("refNo", this.planNumberU);
      //call uploadFile
      this.uploadFile(formBody, this.planNumberU);
    }
  }


  // ======================= Call backend ===============

  getPlanWsSend() {
    console.log("this.formYear.value :", this.formYear.value);
    this.loading = true;
    const URL = "ta/tax-operator/get-plan-ws-send/";
    this.ajax.doPost(URL, this.formYear.value).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.planWsSendData = res.data.sort(function (a, b) {
          if (Number(a.planWorksheetSend.officeCode) < Number(b.planWorksheetSend.officeCode)) {
            return -1;
          } else if (Number(b.planWorksheetSend.officeCode) < Number(a.planWorksheetSend.officeCode)) {
            return 1;
          } else {
            return 0;
          }
        });

        this.planWsSendData.forEach(element => {
          if (element.submitDate) {
            this.auditStatus = false;
          }

        });

        console.log("getPlanWsSend : ", this.planWsSendData);
        this.planWsSendDataAll = this.planWsSendData;
        //search selectSector
        this.selected = this.officeCode;
        if ("00" == this.selected.slice(0, 2)) {
          this.selected = "0";
        }
        this.onChange();
      } else {
        this.msg.errorModal(res.message);
        console.log("Error getPlanWsSend : ")
      }
      this.loading = false;
    })
  }

  getSectorList() {
    const URL = "preferences/department/sector-list/";
    this.ajax.doPost(URL, {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.selectSector = res.data.sort(function (a, b) {
          if (Number(a.officeCode) < Number(b.officeCode)) {
            return -1;
          } else if (Number(b.officeCode) < Number(a.officeCode)) {
            return 1;
          } else {
            return 0;
          }
        })
      } else {
        this.msg.errorModal(res.message);
        console.log("Error getSectorList : ")
      }
    })
  }

  getPlanStatus() {
    const URL = "ta/tax-operator/get-plan-status/";
    let data = {
      budgetYear: this.formYear.get("budgetYear").value
    }
    this.ajax.doPost(URL, data).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        if (null != res.data) {
          this.planStatus = res.data;
          if (null != this.planStatus.approvalComment) {
            this.approver.get("approvalComment").patchValue(this.planStatus.approvalComment);
          }
          if (null != this.planStatus.approvedComment) {
            this.approver.get("approvedComment").patchValue(this.planStatus.approvedComment);
          }
        }
      } else {
        this.msg.errorModal(res.message);
        console.log("Error getPlanStatus : ")
      }
    })
  }
  clickSendIn(item: any) {
    console.log(" clickSendIn : ", item);
    this.router.navigate(['/tax-audit-new/ta01/07/01'], {
      queryParams: {
        officeCode: item.planWorksheetSend.officeCode,
        planType: "I",
        budgetYear:this.budgetYear
      }
    });
  }

  clickSendRs(item: any) {
    console.log(" clickSendRs : ", item);
    this.router.navigate(['/tax-audit-new/ta01/07/01'], {
      queryParams: {
        officeCode: item.planWorksheetSend.officeCode,
        planType: "R",
        budgetYear:this.budgetYear
      }
    });
  }

  clickSendOut(item: any) {
    console.log(" clickSendRs : ", item);
    this.router.navigate(['/tax-audit-new/ta01/07/01'], {
      queryParams: {
        officeCode: item.planWorksheetSend.officeCode,
        planType: "E",
        budgetYear:this.budgetYear
      }
    });
  }

  clickSendSum(item: any) {
    console.log(" clickSendRs : ", item);
    this.router.navigate(['/tax-audit-new/ta01/07/01'], {
      queryParams: {
        officeCode: item.planWorksheetSend.officeCode,
        planType: "S",
        budgetYear:this.budgetYear
      }
    });
  }

  clickSendAll(){
    this.router.navigate(['/tax-audit-new/ta01/07/01'], {
      queryParams: {
        budgetYear:this.budgetYear
      }
    });
  }

  getBudgetYearList() {
    this.ajax.doGet('ta/tax-operator/budgetYearList').subscribe((res: ResponseData<string[]>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.budgetYearList = res.data;

        if (this.budgetYearList.length != 0) {

          this.formYear.get('budgetYear').patchValue(this.budgetYearList[0]);
          this.budgetYear = this.budgetYearList[0];

          this.budgetYearNumber = Number(this.budgetYear);
          $("#budgetYear").dropdown('set selected', this.formYear.get('budgetYear').value);

          this.getPlanWsSend();
        } else {
          this.budgetYearList = [];
          this.budgetYear = null;
        }
      } else {
      }
    });

  }

  budgerYearChange(event) {
    this.budgetYear = event.target.value;
    this.getPlanWsSend();
  }

  // clickSendSum(item:any){
  //   console.log(" clickSendSum : ",item);
  // }

  getPlanNumber() {
    return new Promise((resolve) => {
      this.ajax.doPost(URL.GET_PLAN_NO, { "budgetYear": this.formYear.get("budgetYear").value }).subscribe((res: ResponseData<any>) => {
        if (MessageService.MSG.SUCCESS == res.status) {
          let planNumber: any = '';
          if (res.data == null) {
            planNumber = '';
            this.planNumberU = '';
          } else {
            planNumber = res.data.planNumber;
            this.planNumberU = res.data.planNumber;
          }
          resolve(planNumber);
        } else {
          this.messageBar.errorModal("function getPlanNumber error!");
        }
      })
    })
  }

  findDataUpload(planNumber: any) {
    //show from upload
    $("#file").val('');
    this.dataDocList = [];
    this.showUpload = false;
    this.loadingDoc = true;
    this.ajax.doPost(`${URL.FIND_DATA_UP_LOAD}`, { "moduleCode": CONSTANT_TA0107.MODULE_CODE, "refNo": planNumber }).subscribe((res) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.dataDocList = res.data;
      } else {
        this.messageBar.errorModal(res.message);
      }
    });
    setTimeout(() => {
      this.dataTableUpload();
      this.loadingDoc = false;
    }, 1000);
  }

  uploadFile(formBody: any, planNumberU: any) {
    this.ajax.upload(URL.UPLOAD, formBody, res => {
      if (MessageService.MSG.SUCCESS == res.json().status) {
        $("#file").val('');
        this.findDataUpload(planNumberU);
      } else {
        this.messageBar.errorModal("ไม่สามารถอัปโหลดไฟล์ได้", "แจ้งเตือน");
        console.log("error uploadFile :", res.json().message);
      }

    })
  }


  // =====================dataTable =====================
  dataTableUpload() {

    if (this.tableUpload != null) {
      this.tableUpload.destroy();
    }
    this.tableUpload = $("#dataTableUpload").DataTableTh({
      lengthChange: false,
      searching: false,
      loading: true,
      ordering: false,
      pageLength: 10,
      processing: true,
      serverSide: false,
      paging: false,
      data: this.dataDocList,
      columns: [
        {
          render: function (data, type, row, meta) {
            return meta.row + meta.settings._iDisplayStart + 1;
          },
          className: "text-center"
        }, {
          data: 'fileName',
          render: function (data, type, row) {
            let link = '';
            link += `<a href="javascript:void(0)" class="link">`+data+`</a>`;
            return link;
          },
          className: "text-left"
        }, {
          render: function (data, type, full, meta) {
            let btn = '';
            btn += `<button class="ui mini red button del" type="button">
                    <i class="trash icon"></i>
                      ลบ
                  </button>
                    `;
            return btn;
          },
          className: "text-center"
        }
      ],
    });

    this.tableUpload.on("click", "td > button.del", (event) => {
      var data = this.tableUpload.row($(event.currentTarget).closest("tr")).data();
      this.deleteDoc(data.uploadNo);
    });

    this.tableUpload.on("click", "td > a.link", (event) => {
      var data = this.tableUpload.row($(event.currentTarget).closest("tr")).data();
      this.downloadDoc(data.uploadNo);
    });

  }

  deleteDoc(uploadNo: any) {
    this.messageBar.comfirm(event => {
      if (event) {
        this.ajax.doDelete(`${URL.DELETE}/${uploadNo}`).subscribe((res) => {
          if (MessageService.MSG.SUCCESS == res.status) {
            this.messageBar.successModal(res.message);
            this.findDataUpload(this.planNumberU);
          } else {
            this.messageBar.errorModal(res.message);
          }
        });
      }
    }, "ต้องการลบข้อมูลหรือไม่ ?");
  }

  downloadDoc(uploadNo: any) {
    this.ajax.download(`${URL.DOWNLOAD}/${uploadNo}`);
  }

}
