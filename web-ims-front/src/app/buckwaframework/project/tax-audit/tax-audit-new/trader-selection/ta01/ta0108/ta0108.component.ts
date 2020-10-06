import { Component, OnInit } from '@angular/core';
import { BreadcrumbContant } from 'projects/tax-audit/tax-audit-new/BreadcrumbContant';
import { BreadCrumb, ResponseData } from 'models/index';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AjaxService } from 'services/index';
import { MessageBarService } from 'services/index';
import { AuthService } from 'services/index';
import { Router } from '@angular/router';
import { TextDateTH } from 'helpers/index';
import { formatter } from 'helpers/index';
import { MessageService } from 'services/index';

import * as moment from 'moment';
import { Observable } from 'rxjs';

declare var $: any;

@Component({
  selector: 'app-ta0108',
  templateUrl: './ta0108.component.html',
  styleUrls: ['./ta0108.component.css']
})
export class Ta0108Component implements OnInit {

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
  canApprove:boolean = true;
  planNumber:string ;
  analysisNumber:string;

  budgetYearList:any[];
  budgetYear:string;

  constructor(
    // private _location: Location,
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
    this.getBudgetYearList()
    // this.formYear.get("budgetYear").patchValue(currYear);
    this.getPlanWsSend();
    this.getSectorList();
    this.getPlanStatus();
    this.getPlanNumber(this.formYear.get("budgetYear").value);
  }

  setApproveForm() {
    this.approver = this.fb.group({
      approvalComment: ["", Validators.required],
      approvedComment: ["", Validators.required]
    })
  }

  ngAfterViewInit(): void {
    // $("#calendar").calendar({
    //   maxDate: new Date(),
    //   type: "year",
    //   text: TextDateTH,
    //   formatter: formatter('ป'),
    //   onChange: (date) => {
    //     let newYear = moment(date).year() + 543;
    //     this.formYear.get("budgetYear").patchValue(newYear);
    //   }
    // });
    // console.log("year : ", this.formYear.value);


  }

  callDropDown() {
    setTimeout(() => {
      $("selectSector").dropdown();
    }, 300);
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
        budgetYear:this.budgetYear,
        from: '08'
      }
    });
  }

  onClickDetailAll() {
    // console.log('onClickDetail officeCode', officeCode)
    this.router.navigate(['/tax-audit-new/ta01/07/01'], {
      queryParams: {
        officeCode: '',
        budgetYear:this.budgetYear,
        from: '08'
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
        approvedComment: this.approver.value.approvedComment
      }
      if (num == 0) {
        data = {
          budgetYear: this.formYear.get("budgetYear").value,
          approvalComment: this.approver.value.approvalComment,
          approvedComment: null
        }
      } else {
        data = {
          budgetYear: this.formYear.get("budgetYear").value,
          approvalComment: null,
          approvedComment: this.approver.value.approvedComment
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

  // ======================= Call backend ===============

  getPlanWsSend() {
    console.log("this.formYear.value :", this.formYear.value);
    this.loading = true;
    // const URL = "ta/tax-operator/get-plan-ws-send/";
    const URL = "ta/tax-operator/get-plan-ws-send-approve";
    this.ajax.doPost(URL, this.formYear.value).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.planWsSendData = res.data;

        // this.planWsSendData = res.data.sort(function (a, b) {
        //   if (Number(a.planWorksheetSend.officeCode) < Number(b.planWorksheetSend.officeCode)) {
        //     return -1;
        //   } else if (Number(b.planWorksheetSend.officeCode) < Number(a.planWorksheetSend.officeCode)) {
        //     return 1;
        //   } else {
        //     return 0;
        //   }
        // });
        // console.log("getPlanWsSend : ", this.planWsSendData);
        // this.planWsSendDataAll = this.planWsSendData;
        // //search selectSector
        // this.selected = this.officeCode;
        // if ("00" == this.selected.slice(0, 2)) {
        //   this.selected = "0";
        // }

        // this.onChange();
        this.checkCanApprove();

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
    this.canApprove = true;
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
  
  getPlanNumber(resbudgetYear: any){
      this.ajax.doPost("ta/tax-operator/find-one-budget-plan-header", { "budgetYear": resbudgetYear }).subscribe((res: ResponseData<any>) => {
        if (MessageService.MSG.SUCCESS == res.status) {
          // resObs.next(res.data);
          this.planNumber = res.data.planNumber;
          this.analysisNumber = res.data.analysisNumber;
        } else {
          this.messageBar.errorModal(res.message);
        }

      });
  }

  onApprove(){
    if (this.canApprove == true) {
      this.messageBar.comfirm(res => {
        if (res) {
          this.loading = true;
          this.ajax.doPost("ta/tax-operator/save-plan-worksheet-send-approve", {
            budgetYear: this.formYear.get("budgetYear").value,
            planNumber: this.planNumber,
            analysisNumber: this.analysisNumber

          }).subscribe((res: ResponseData<any>) => {

            this.loading = false;
          });
        }
      }, "ยันยืนการทำรายการ")
    }

  }

  checkCanApprove(){
    this.planWsSendData.forEach(element => {
      // if (!element.submitDate){
      //   this.canApprove = false;
      // }
      this.canApprove = true;
    });
  }
  getBudgetYearList() {
    this.ajax.doGet('ta/tax-operator/budgetYearList').subscribe((res: ResponseData<string[]>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.budgetYearList = res.data;

        if (this.budgetYearList.length != 0) {

          this.formYear.get('budgetYear').patchValue(this.budgetYearList[0]);
          this.budgetYear = this.budgetYearList[0];

          // this.budgetYearNumber = Number(this.budgetYear);
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

  clickSendIn(item: any) {
    console.log(" clickSendIn : ", item);
    this.router.navigate(['/tax-audit-new/ta01/07/01'], {
      queryParams: {
        officeCode: item.officeCode,
        planType: "I",
        budgetYear:this.budgetYear,
        from: '08'
      }
    });
  }

  clickSendRs(item: any) {
    console.log(" clickSendRs : ", item);
    this.router.navigate(['/tax-audit-new/ta01/07/01'], {
      queryParams: {
        officeCode: item.officeCode,
        planType: "R",
        budgetYear:this.budgetYear,
        from: '08'
      }
    });
  }

  clickSendOut(item: any) {
    console.log(" clickSendRs : ", item);
    this.router.navigate(['/tax-audit-new/ta01/07/01'], {
      queryParams: {
        officeCode: item.officeCode,
        planType: "E",
        budgetYear:this.budgetYear,
        from: '08'
      }
    });
  }

  clickSendSum(item: any) {
    console.log(" clickSendRs : ", item);
    this.router.navigate(['/tax-audit-new/ta01/07/01'], {
      queryParams: {
        officeCode: item.officeCode,
        planType: "S",
        budgetYear:this.budgetYear,
        from: '08'
      }
    });
  }
  budgerYearChange(event) {
    this.budgetYear = event.target.value;
  }


}
