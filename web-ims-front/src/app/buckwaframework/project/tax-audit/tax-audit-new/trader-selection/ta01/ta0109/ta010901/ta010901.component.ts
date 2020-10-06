import { Component, OnInit, AfterViewInit } from '@angular/core';
import { BreadcrumbContant } from 'projects/tax-audit/tax-audit-new/BreadcrumbContant';
import { BreadCrumb } from 'models/index';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'services/index';
import { AjaxService } from 'services/index';
import { MessageBarService } from 'services/index';
import { ActivatedRoute } from '@angular/router';
import { ResponseData } from 'models/index';
import { MessageService } from 'services/index';
import { Observable } from 'rxjs';


declare var $: any;

@Component({
   selector: 'app-ta010901',
   templateUrl: './ta010901.component.html',
   styleUrls: ['./ta010901.component.css']
})
export class Ta010901Component implements OnInit, AfterViewInit {

   b: BreadcrumbContant = new BreadcrumbContant();
   breadcrumb: BreadCrumb[] = [
      { label: this.b.b00.label, route: this.b.b00.route },
      { label: this.b.b01.label, route: this.b.b01.route },
      { label: this.b.b11.label, route: this.b.b11.route }
   ];

   table: any;
   budgetYear: any = '';
   planNumber: any = '';
   analysisNumber: any = '';
   disabledButton: boolean = false;
   disabledButton1: boolean = false;
   disabledButton2: boolean = false;
   loading: boolean = false;
   subdeptLevel: any;
   objMonth: any;
   anlNumber: string;
   sector: any;
   area: any;
   isChild: boolean = false;
   buttonName: string = "ส่งต่อพื้นที่";
   userSector: string;
   officeCode: string = null;
   formGroup: FormGroup;
   checkList: any = [];
   constructor(
      private userDetail: AuthService,
      private ajax: AjaxService,
      private messageBar: MessageBarService,
      private route: ActivatedRoute,
      private formBuilder: FormBuilder,
   ) {
      this.objMonth = {
         yearMonthStart: "",
         yearMonthEnd: ""
      }
   }


   // ==> app function start
   ngOnInit() {
      this.officeCode = null;
      this.formGroup = this.formBuilder.group({
         sector: ['',Validators.required],
         area: ['',Validators.required],

      });

      this.anlNumber = this.route.snapshot.queryParams["analysisNumber"];
      this.budgetYear = this.route.snapshot.queryParams["budgetYear"];
      this.subdeptLevel = this.userDetail.getUserDetails().subdeptLevel;
      this.userDetail.getUserDetails().officeCode;
      this.userDetail.getUserDetails().subdeptCode
      console.log("this.subdeptLevel : ", this.userDetail.getUserDetails());
      this.userSector = this.userDetail.getUserDetails().departmentName;
      this.getMonthStart(this.anlNumber);
      this.getSector();
      // this.chekcIsChlid();
   }

   ngAfterViewInit(): void {

      // this.getBudgetYear().subscribe((resbudgetYear: ResponseData<any>) => {
      //   console.log("Budget Year : ", resbudgetYear);
      //   this.budgetYear = resbudgetYear;
      //   this.getPlanNumber(resbudgetYear).subscribe((resPlanAndAnalysis: any) => {
      //     if (resPlanAndAnalysis != null) {
      //       this.planNumber = resPlanAndAnalysis.planNumber;
      //       this.analysisNumber = resPlanAndAnalysis.analysisNumber;
      //     }
      //     this.getPlantWorkSheetDtl(this.analysisNumber, this.planNumber);
      //     this.checkSubmitDatePlanWorksheetSend(this.planNumber).subscribe(res => {
      //       if (this.subdeptLevel == 1 || this.subdeptLevel == null) {
      //         this.disabledButton1 = false;
      //         if (this.disabledButton != null) {
      //           this.disabledButton1 = this.disabledButton
      //         }
      //       } if (this.subdeptLevel == 2 || this.subdeptLevel == 3) {
      //         this.disabledButton1 = true;
      //       }
      //       this.tablePlan();
      //       this.chekcIsChlid();
      //     });
      //   });
      // });

      this.getPlanNumber(this.budgetYear).subscribe((resPlanAndAnalysis: any) => {
         if (resPlanAndAnalysis != null) {
            this.planNumber = resPlanAndAnalysis.planNumber;
            this.analysisNumber = resPlanAndAnalysis.analysisNumber;
         }
         this.getPlantWorkSheetDtl(this.analysisNumber, this.planNumber);
         this.checkSubmitDatePlanWorksheetSend(this.planNumber).subscribe(res => {
            this.tablePlan();

            if (this.subdeptLevel == 1 || this.subdeptLevel == null) {
               this.disabledButton1 = false;
               if (this.disabledButton != null) {
                  this.disabledButton1 = this.disabledButton
               }
               console.log("this.disabledButton1555 : ", this.disabledButton1);
            } if (this.subdeptLevel == 2 || this.subdeptLevel == 3) {
               this.disabledButton1 = true;
            }

            this.chekcIsChlid();
         });
      });
      // console.log("this.disabledButton :", this.disabledButton);
      $("#sector").dropdown('set selected', 10).css('min-width', '3em');
      $("#area").dropdown('set selected', 10).css('min-width', '3em');

   }
   onSearch() {

      let sector = this.formGroup.get("sector").value;
      let area = this.formGroup.get("area").value;
      if (area != "" && area != "0") {
         this.officeCode = area;
      } else if (sector != "" && sector != "0") {
         this.officeCode = sector;
      } else {
         this.officeCode = null;
      }
      this.getPlantWorkSheetDtlByOfficeCode(this.anlNumber, this.planNumber, this.officeCode);
      // console.log("test onsearch ", sector, " ", area)
      this.tablePlan()

   }

   tablePlan = () => {

      if (this.table != null) {
         this.table.destroy();
      }
      // console.log("datatable call");
      // const URL = AjaxService.CONTEXT_PATH + "ta/tax-operator/plan-selected-dtl";
      const URL = AjaxService.CONTEXT_PATH + "ta/tax-operator/search-plan-selected-by-offcode-assign";
      this.table = $("#tablePlan").DataTableTh({
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
                  planNumber: this.planNumber,
                  sendAllFlag: "Y",
                  officeCode: this.officeCode
               }));
            }
         },
         columns: [
            {
               className: "ui center aligned",
               render: (data, type, full, meta) => {
                  // let disBtn = this.disabledButton ? 'disabled' : '';
                  if (full.auditStatus <= '0300') {
                     return `<button class="ui mini red button delete icon" type="button" >
              <i class="trash icon"></i>
            </button>`;
                  } else {
                     return `<button class="ui mini red button delete icon " type="button" disabled >
              <i class="trash icon"></i>
            </button>`;
                  }

               }
            },
            {
               className: "text-center",
               render: (data, type, full, meta) => {
                  let index = this.checkList.findIndex(obj => obj.planWorksheetDtlId == full.planWorksheetDtlId);
                  if (index == -1) {
                     return '<div class="ui checkbox"><input name="checkDelId" value="' +
                        full.planWorksheetDtlId +
                        '" id="' +
                        full.planWorksheetDtlId +
                        '" type="checkbox" checked ><label></label></div>'
                  } else {
                     // this.checkList.splice(index, 1);
                     return '<div class="ui checkbox"><input name="checkDelId" value="' +
                        full.planWorksheetDtlId +
                        '" id="' +
                        full.planWorksheetDtlId +
                        '" type="checkbox"  ><label></label></div>'
                  }

                  ;
               }
            }, {
               className: "ui center aligned",
               render: function (data, type, row, meta) {
                  return meta.row + meta.settings._iDisplayStart + 1;
               }
            }, {
               data: "newRegId", className: "text-left"
            },
            {
               data: "facFullname", className: "text-left"
            }, {
               data: "dutyDesc", className: "text-left"
            },
            {
               data: "secDesc", className: "text-left"
            }, {
               data: "areaDesc", className: "text-left"
            }, {
               data: "deptShortName", className: "text-left"
            }, {
               data: "auditStatusDesc", className: "text-center"
            }

         ]
      });

      this.table.on("click", "td > button.delete", (event) => {
         let data = this.table.row($(event.currentTarget).closest("tr")).data();
         // console.log(data);
         this.messageBar.comfirm(res => {
            if (res) {
               this.onDelete(data.newRegId);
            }
         }, "ยืนยันการทำรายการ");
      });


      this.table.on("click", "input[type='checkbox']", (event) => {
         let data = this.table.row($(event.currentTarget).closest("tr")).data();
         var chk = $('#' + data.planWorksheetDtlId).prop('checked');

         if (chk) {
            let index = this.checkList.findIndex(obj => obj.planWorksheetDtlId == data.planWorksheetDtlId);
            if (index == -1) {
               // this.checkList.push(data);

               // this.checkList.splice(index, 1);
            } else {
               this.checkList.splice(index, 1);
            }
         } else {
            let index = this.checkList.findIndex(obj => obj.planWorksheetDtlId == data.planWorksheetDtlId);
            if (index >= 0) {
               // this.checkList.splice(index, 1);
               // this.checkList.push(data);
            } else {
               this.checkList.push(data);
            }
         }


      });
   }

   onSave() {
      // console.log("onSave : ");
      // if (this.disabledButton1 == false) {
      let sector = this.formGroup.get("sector").value;
      let area = this.formGroup.get("area").value;
      if (area != "" && area != "0") {
         this.officeCode = area;
      } else if (sector != "" && sector != "0") {
         this.officeCode = sector;
      } else {
         this.officeCode = null;
      }

      console.log("save ", this.budgetYear, " , ", this.planNumber, " ,", this.analysisNumber)
      // if (this.isChild == false) {
      let ids: string[] = [];
      this.checkList.forEach(element => {
         ids.push(element.planWorksheetDtlId);
      });

      let totalRecord = this.table.page.info().recordsTotal;
      let onplan = totalRecord - this.checkList.length;
      let reserve = this.checkList.length;

      if (this.formGroup.valid){
         this.messageBar.comfirm(res => {
            if (res) {
               this.loading = true;
               this.ajax.doPost("ta/tax-operator/save-plan-worksheet-admin", {
                  budgetYear: this.budgetYear,
                  planNumber: this.planNumber,
                  analysisNumber: this.analysisNumber,
                  ids: ids,
                  officeCode: this.officeCode
   
               }).subscribe((res: ResponseData<any>) => {
   
                  this.disabledButton1 = true;
                  if (MessageService.MSG.SUCCESS == res.status) {
                     this.messageBar.successModal(res.message);
                     this.checkSubmitDatePlanWorksheetSend(this.planNumber).subscribe(res => {
                        this.table.ajax.reload();
                     });
                  } else {
                     this.messageBar.errorModal(res.message);
                     console.log("Error onSave!");
                  }
                  this.loading = false;
               });
            }
         }, "จำนวนรายที่คัดเลือกทั้งหมด  <b>" + totalRecord + "</b>  ราย <br> ในแผน จำนวน  <b>" + onplan + "</b>  ราย <br> สำรอง จำนวน  <b>" + reserve + "</b>  ราย")
         // }
      }else{
         this.messageBar.errorModal("กรุณาเลือกสำนักงาน ภาค/พี้นที่");
      }



   }

   getMonthStart = (analysisNumber: string): Promise<any> => {
      return new Promise((resolve, reject) => {
         this.ajax.doPost("ta/tax-operator/get-month-start", { analysisNumber }).subscribe((res: ResponseData<any>) => {

            if (MessageService.MSG.SUCCESS === res.status) {
               // console.log("res getMonthStart : ", res);
               this.objMonth = res.data;

               // this.formVo = this.formVo = this.setForm();
               // resolve(this.formVo);
            } else {
               // this.formVo = this.setForm();
               // reject(this.formVo)
               console.log("error getMonthStart  ");
               this.messageBar.errorModal(res.message);
            }

         })
      });
   }

   getSector() {
      this.ajax.doPost("ta/tax-operator/sector-list", {}).subscribe((res: ResponseData<any>) => {
         if (MessageService.MSG.SUCCESS == res.status) {
            this.sector = res.data;
         } else {
            this.messageBar.errorModal(res.message);
            console.log("getSector Error !!");
         }
      })
   }

   getArea(officeCode) {
      if (officeCode == "001400") {
         const URL = "preferences/department/dept/central-ta";
         this.ajax.doPost(URL, {}).subscribe((res: ResponseData<any>) => {
            if (MessageService.MSG.SUCCESS == res.status) {
               this.area = res.data;
            }
         })
      } else {
         this.ajax.doPost("preferences/department/area-list/" + officeCode, {}).subscribe((res: ResponseData<any>) => {
            if (MessageService.MSG.SUCCESS == res.status) {
               this.area = res.data;
            } else {
               this.messageBar.errorModal(res.message);
               console.log("getArea Error !!");
            }
         })
      }

   }

   export() {
      console.log("export...")
      let url = "ta/report/export-worksheet-selected";
      let param = '';
      param += "?planNumber=" + this.planNumber;
      this.ajax.download(url + param);

   }
   // ==> app function end

   // ==> call backend start
   onDelete(id: string) {
      console.log("onDelete id : ", id);
      this.ajax.doDelete(`ta/tax-operator/delete-plan-worksheet-dtl/${id}/${this.budgetYear}`).subscribe((res: ResponseData<any>) => {
         if (MessageService.MSG.SUCCESS == res.status) {
            this.messageBar.successModal(res.message);
            this.table.ajax.reload();
         } else {
            this.messageBar.errorModal(res.message);
         }
      });
   }
   getBudgetYear(): Observable<any> {
      return new Observable((resObs => {
         this.ajax.doPost("preferences/budget-year", {}).subscribe((res: ResponseData<any>) => {
            if (MessageService.MSG.SUCCESS == res.status) {
               resObs.next(res.data);
            } else {
               this.messageBar.errorModal(res.message);
            }

         });
      }));
   }
   getPlanNumber(resbudgetYear: any): Observable<any> {
      return new Observable((resObs => {
         this.ajax.doPost("ta/tax-operator/find-one-budget-plan-header", { "budgetYear": resbudgetYear }).subscribe((res: ResponseData<any>) => {
            if (MessageService.MSG.SUCCESS == res.status) {
               resObs.next(res.data);
            } else {
               this.messageBar.errorModal(res.message);
            }

         });
      }));
   }

   checkSubmitDatePlanWorksheetSend(planNumber): Observable<any> {
      return new Observable(obs => {
         this.ajax.doPost("ta/tax-operator/check-submit-date-plan-worksheet-send", { planNumber: planNumber }).subscribe((res: ResponseData<any>) => {
            if (MessageService.MSG.SUCCESS == res.status) {
               this.disabledButton = res.data;
               if (this.disabledButton == true) {
                  this.disabledButton1 = this.disabledButton
                  console.log("this.disabledButton1 : ", this.disabledButton1);
               }

               obs.next(res.data)
               console.log("checkSubmitDatePlanWorksheetSend :", res.data)
            } else {
               this.messageBar.errorModal(res.message);
               console.log("Error checkSubmitDatePlanWorksheetSend !");
            }
         });
      });
   }

   // check digit officecode
   chekcIsChlid() {
      var offCode: string = this.userDetail.getUserDetails().officeCode;
      // offCode.substring(2,6);
      if (offCode) {
         console.log("substring ", Number(offCode.substring(2, 6)));
         var substr: Number = Number(offCode.substring(2, 6));
         if (substr > 0 && !this.userDetail.getUserDetails().isCentral) {
            this.isChild = true;
         } else {
            this.isChild = false;
            if (this.disabledButton1) {
               this.isChild = true;
            }
         }
      }
      // this.isChild = false;

      if (this.userDetail.getUserDetails().isCentral) {
         this.buttonName = "ส่งต่อภาค"
      } else {
         this.buttonName = "ส่งต่อพื้นที่"
      }
   }

   getPlantWorkSheetDtl(analysisNumber: string, planNumber: string) {
      this.ajax.doPost("ta/tax-operator/find-plan-worksheet-dtl", { "analysisNumber": analysisNumber, "planNumber": planNumber, sendAllFlag: "N" }).subscribe((res: ResponseData<any>) => {
         if (MessageService.MSG.SUCCESS == res.status) {

            res.data.forEach(element => {
               if (element.planType == 'R') {
                  // if (element.planType == 'R' && this.userDetail.getUserDetails().officeCode == element.officeCode) {
                  this.checkList.push(element);
               }
            });
            console.log("plan type arr ", this.checkList)
         }
      });

   }
   async getPlantWorkSheetDtlByOfficeCode(analysisNumber: string, planNumber: string, officeCode: string) {
      this.checkList = [];
      this.ajax.doPost("ta/tax-operator/find-plan-worksheet-dtl-officecode", { "analysisNumber": analysisNumber, "planNumber": planNumber, sendAllFlag: "N", officeCode: officeCode }).subscribe((res: ResponseData<any>) => {
         if (MessageService.MSG.SUCCESS == res.status) {
            res.data.forEach(element => {
               if (element.planType == 'R') {
                  // if (element.planType == 'R' && this.userDetail.getUserDetails().officeCode == element.officeCode) {
                  this.checkList.push(element);
               }
            });
            console.log("plan type arr offcode", this.checkList)
         }
      });
   }

   onChangeSector(e) {
      $("#area").dropdown('restore defaults');
      this.area = [];
      if ("0" != e.target.value && "" != e.target.value)
         this.getArea(e.target.value);
   }

   // ==> call backend end

}
