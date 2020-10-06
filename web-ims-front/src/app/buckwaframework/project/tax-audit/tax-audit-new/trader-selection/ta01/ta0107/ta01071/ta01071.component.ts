import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AuthService } from 'app/buckwaframework/common/services/auth.service';
import { BreadCrumb, ResponseData } from 'app/buckwaframework/common/models/index';
import { ActivatedRoute, Router } from '@angular/router';
import { AjaxService } from 'app/buckwaframework/common/services/ajax.service';
import { Observable } from 'rxjs';
import { MessageService } from 'app/buckwaframework/common/services/message.service';
import { MessageBarService } from 'app/buckwaframework/common/services/message-bar.service';
declare var $: any;
@Component({
  selector: 'app-ta01071',
  templateUrl: './ta01071.component.html',
  styleUrls: ['./ta01071.component.css']
})
export class Ta01071Component implements OnInit, AfterViewInit {
  breadcrumb: BreadCrumb[] = [
    { label: 'ตรวจสอบภาษี', route: '#' },
    { label: 'การคัดเลือกราย', route: '#' },
    { label: 'ตรวจสอบการเลือกรายผู้ประกอบการ', route: '#' },
    { label: 'รายที่เลือกของส่วนกลาง', route: '#' }
  ]
  dataSelect: any[] = [];
  datas: any = [
    {
      data1: "0105514003654-1-001",
      data2: "บริษัท แลคตาซอย จำกัด",
      data3: "บริษัท แลคตาซอย จำกัด ",
      data4: "ภาค 2",
      data5: "ปราจีนบุรี",
      data6: "12,000.00",
      data7: "8,000.00",
      data8: "-33.33",
      data9: "5",
      data10: "เครื่องดื่ม",
      data11: "38/6 หมู่ 5 ถ.สุขุมวิท ต.ทุ่งสุขลา อ.ศรีราชา จ.ชลบุรี 20230",
      data12: "4,000.00",
      data13: "4,000.00",
      data14: "4,000.00",
      data15: "4,000.00",
      data16: "4,000.00",
      data17: "-",
      data18: "5",
    },
    {
      data1: "0105531025482-1-001",
      data2: "บริษัท ชินตร์ ชินตร์ จำกัด",
      data3: "บริษัท ชินตร์ ชินตร์ จำกัด",
      data4: "ภาค 1",
      data5: "นนทบุรี",
      data6: "167,620.32",
      data7: "109,620.00",
      data8: "-34.60",
      data9: "5",
      data10: "เครื่องดื่ม",
      data11: "168 หมู่ที่ 7 ต.ลำโพ อ.บางบัวทอง จ.นนทบุรี 11110",
      data12: "56,462.40",
      data13: "40,252.32",
      data14: "70,905.60",
      data15: "-",
      data16: "53,532.00",
      data17: "56,088.00",
      data18: "5",
    },
    {
      data1: "0105532076862-1-001",
      data2: "บริษัท ทรอปิคอล ฟู้ด อินดัสตรีส์ จำกัด",
      data3: "บริษัท ทรอปิคอล ฟู้ด อินดัสตรีส์ จำกัด",
      data4: "ภาค 10",
      data5: "พท.3",
      data6: "4,320.34",
      data7: "2,974.24",
      data8: "-31.16",
      data9: "5",
      data10: "เครื่องดื่ม",
      data11: "221 ซ.พัฒนาการ 53 ต.สวนหลวง อ.สวนหลวง จ.กรุงเทพมหานคร 10250",
      data12: "1,461.48",
      data13: "1,410.20",
      data14: "1,448.66",
      data15: "-",
      data16: "1,499.94",
      data17: "1,474.30",
      data18: "5",
    },
    {
      data1: "0105546080051-1-001",
      data2: "บริษัท แบรนด์ ซันโทรี่ (ประเทศไทย) จำกัด ",
      data3: "บริษัท แบรนด์ ซันโทรี่ (ประเทศไทย) จำกัด ",
      data4: "ภาค 2",
      data5: "ชลบุรี 2",
      data6: "4,320.34",
      data7: "2,974.24",
      data8: "-31.16",
      data9: "5",
      data10: "เครื่องดื่ม",
      data11: "221 ซ.พัฒนาการ 53 ต.สวนหลวง อ.สวนหลวง จ.กรุงเทพมหานคร 10250",
      data12: "1,989.06 ",
      data13: "- ",
      data14: "- ",
      data15: "- ",
      data16: "670.90 	",
      data17: "1,397.70 ",
      data18: "4",
    },


  ]
  txtHead: string;
  txt: string;

  table: any;

  //==>default value
  officeCode: string;
  frompage:string;
  planNumber: any = '';
  analysisNumber: any = '';
  budgetYear: any = '';
  planType:string;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private ajax: AjaxService,
    private messageBar: MessageBarService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.officeCode = this.route.snapshot.queryParams["officeCode"];
    this.frompage = this.route.snapshot.queryParams["from"];
    this.planType = this.route.snapshot.queryParams["planType"];
    this.budgetYear = this.route.snapshot.queryParams["budgetYear"];
    console.log(this.officeCode);
    this.initDatatable();
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
    //     this.tablePlan();

    //   });
    // });

    this.getPlanNumber(this.budgetYear).subscribe((resPlanAndAnalysis: any) => {
      if (resPlanAndAnalysis != null) {
        this.planNumber = resPlanAndAnalysis.planNumber;
        this.analysisNumber = resPlanAndAnalysis.analysisNumber;
      }
      this.tablePlan();

    });

  }
  initDatatable(): void {
    //this.authService.reRenderVersionProgram('TAX-04000');
  }

  showDetail = (risk) => {
    console.log("risk : ", risk)
    $("#riskModal").modal({
      onShow: () => {
        if ('4' === risk) {
          this.txtHead = 'ผู้เสียภาษีที่มีแนวโน้มการชำระภาษีผิดปกติ มีรายละเอียดดังนี้'
          this.txt = `4) ผู้ประกอบการที่ชำระภาษีไม่สม่ำเสมอในช่วงเวลาที่กำหนด และมีอัตราการชำระภาษีครึ่งหลังเพิ่มขึ้นมากกว่าร้อยละ
20 เทียบกับครึ่งแรก`
        } else if ('5' === risk) {
          this.txtHead = 'ผู้เสียภาษีที่มีแนวโน้มการชำระภาษีผิดปกติ มีรายละเอียดดังนี้'
          this.txt = `5) ผู้ประกอบการที่ชำระภาษีไม่สม่ำเสมอในช่วงเวลาที่กำหนด และมีอัตราการชำระภาษีครึ่งหลังเพิ่มขึ้นไม่เกินร้อยละ 5 
หรือชำระภาษีลดลง เทียบกับครึ่งแรก`

        }

        $("#txt").html(this.txt);
      }, onDeny: () => {
        // this.txt='';
      }
    }).modal('show')
  }
  tablePlan = () => {
    console.log("datatable call");
    const URL = AjaxService.CONTEXT_PATH + "ta/tax-operator/plan-selected-dtl-central-approve";
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
            officeCode: this.officeCode,
            planType:this.planType
          }));
        }
      },
      columns: [
        {
          className: "ui center aligned",
          render: (data, type, row, meta) => {
            return meta.row + meta.settings._iDisplayStart + 1;
          }
        }, {
          data: "newRegId", className: "text-left"
        }, {
          data: "cusFullname", className: "text-left"
        }, {
          data: "facFullname", className: "text-left"
        }, {
          data: "facAddress", className: "text-left"
        }, {
          data: "secDesc", className: "text-left"
        }, {
          data: "areaDesc", className: "text-left"
        }, {
          data: "dutyDesc", className: "text-left"
        }
      ]
    });

    this.table.on("click", "td > button.delete", (event) => {
      let data = this.table.row($(event.currentTarget).closest("tr")).data();
      console.log(data);
    });
  }
  //================call backend=======================
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
  clickBack(){
    if(this.frompage =="08"){
      this.router.navigate(["/tax-audit-new/ta01/08"]);
    }else{
      this.router.navigate(["/tax-audit-new/ta01/07"]);
    }
    
  }
}
