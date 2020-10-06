import { Component, OnInit } from '@angular/core';
import { BreadcrumbContant } from 'projects/tax-audit/tax-audit-new/BreadcrumbContant';
import { BreadCrumb, ResponseData } from 'models/index';
import { AjaxService, MessageService, AuthService, MessageBarService } from 'services/index';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DecimalFormatPipe } from 'app/buckwaframework/common/pipes/decimal-format.pipe';
import { TaUtils } from 'projects/tax-audit/tax-audit-new/TaAuthorized';
import { TextDateTH } from 'helpers/index';
import { formatter } from 'helpers/index';
import * as moment from 'moment';
import { Observable } from 'rxjs';
declare var $: any;

@Component({
  selector: 'app-ta0111',
  templateUrl: './ta0111.component.html',
  styleUrls: ['./ta0111.component.css']
})
export class Ta0111Component implements OnInit {
  b: BreadcrumbContant = new BreadcrumbContant();
  breadcrumb: BreadCrumb[] = [
    { label: this.b.b00.label, route: this.b.b00.route },
    { label: this.b.b01.label, route: this.b.b01.route },
    { label: this.b.b01.label, route: this.b.b01.route },
  ];

  showTable: boolean = false;
  loading: boolean = false;
  disabledButton: boolean = false;
  // ==> datas query
  datas: any = []
  sectors: any[] = [];
  areas: any[] = [];
  formsearch: FormGroup;
  table: any;
  officeCode: string;
  budgetYear:string;
  budgetYearList:any[];
  planNumber:string;
  analysisNumber:string;
  constructor(private ajax: AjaxService,
    private messageBar: MessageBarService,
    private auth: AuthService,
    private formBuilder: FormBuilder,
    private router: Router, ) { }

  ngOnInit() {
    this.formsearch = this.formBuilder.group({
      budgetYear: [''],
      sector: [''],
      area: [''],
    });

    this.getSector();
  }

  ngAfterViewInit(): void {
    $("#sector").dropdown('set selected', 0).css('min-width', '3em');
    $("#area").dropdown('set selected', 0).css('min-width', '3em');
    let offCode = this.auth.getUserDetails().officeCode
    if (TaUtils.isCentral(offCode)) {
      // ส่วนกลาง
      
    } else if (TaUtils.isSector(offCode)) {
      // ภาค
      this.formsearch.get("sector").patchValue(offCode);
      this.getArea(offCode);
    } else if (TaUtils.isArea(offCode)) {
      // พื้นที่
      let sector = offCode.substring(0, 2)+"0000";
      this.formsearch.get("sector").patchValue(sector);
      this.getArea(sector);
      this.formsearch.get("area").patchValue(offCode);
    }
    this.calenda();
    // this.onSerch();
    this.getBudgetYearList();
  }


  getSector() {
    this.ajax.doPost("ta/tax-operator/sector-list", {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.sectors = res.data;
      } else {
        //this.messageBar.errorModal(res.message);
        console.log("getSector Error !!");
      }
    })
  }

  getArea(officeCode) {
    this.ajax.doPost("preferences/department/area-list/" + officeCode, {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.areas = res.data;
      } else {
        //   this.messageBar.errorModal(res.message);
        console.log("getArea Error !!");
      }
    })
  }

  getTaxDepartment() {
    const URL = "preferences/department/dept/central-ta";
    this.ajax.doPost(URL, {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.areas = res.data;
      }
    })
  }

  onChangeSector(e: any) {
    this.areas = [];
    if ("0" != e.target.value && "" != e.target.value){
      if( TaUtils.isCentral(e.target.value)){
        this.getTaxDepartment();
      }else{
        this.getArea(e.target.value);
      }
    }
      
  }

  onSerch() {

    let sector = this.formsearch.get("sector").value;
    let area = this.formsearch.get("area").value;
    if (area != "" && area != "0") {
      this.officeCode = area;
    } else if (sector != "" && sector != "0") {
      this.officeCode = sector;
    } else {
      this.officeCode = null;
    }
    this.tablePlan()

  }

  gotoCreatePage(){
    let sector = this.formsearch.get("sector").value;
    let area = this.formsearch.get("area").value;
    let budgetYear = this.budgetYear;
    if (sector && budgetYear ){
      this.router.navigate(['/tax-audit-new/ta01/11/01'], {
        queryParams: {
          sector: sector,
          area:area,
          budgetyear:this.budgetYear
        }
      });
    }else{
      this.messageBar.errorModal("กรุณากรอกข้อมูลเงื่อนไข");
    }

  }


  tablePlan = () => {

    if (this.table != null) {
      this.table.destroy();
    }
    const URL = AjaxService.CONTEXT_PATH + "ta/tax-operator/plan-dtl-outplan";
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
            sendAllFlag: "Y",
            officeCode: this.officeCode,
            planType:"E",
            planNumber: this.planNumber
          }));
        }
      },
      columns: [
        {
          className: "ui center aligned",
          render: function (data, type, row, meta) {
            return meta.row + meta.settings._iDisplayStart + 1;
          }
        }, {
          data: "auditStatusDesc", className: "text-center"
        }, {
          data: "newRegId", className: "text-left"
        },
        {
          data: "facFullname", className: "text-left"
        },
        {
          data: "cusFullname", className: "text-left"
        },{
          className: "text-left",
          render: function (data, type, row, meta) {
            return (row.secDesc+"/"+row.areaDesc);
          }
        },{
          className: "text-right",
          render: function (data, type, row, meta) {
            return  new DecimalFormatPipe().transform(row.regCapital, "###,###.00");
          }
        }, {
          data: "dutyDesc", className: "text-left"
        }, {
          data: "personName", className: "text-left"
        }, {
          data: "replaceReason", className: "text-left"
        }

      ]
    });

    this.table.on('draw.dt', function() {
      $('.paginate_button').not('.previous, .next').each(function(i, a) {
         var val = $(a).text();
         val =  val.toString().replace(/(\d+)(\d{3})/, '$1' + ',' + '$2');
         $(a).text(val);
      })
    });  

    

  }

  calenda = () => {
    $('#date1').calendar({
      type: 'year',
      text: TextDateTH,
      minDate: new Date(),
      formatter: formatter('ป'),
      onChange: (date) => {
        let newYear = moment(date).year() + 543;
        this.budgetYear = newYear.toString();
      }
    });

  }

  getBudgetYearList() {
    this.ajax.doGet('ta/tax-operator/budgetYearList').subscribe((res: ResponseData<string[]>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.budgetYearList = res.data;

        if (this.budgetYearList.length != 0) {

          this.budgetYear = this.budgetYearList[0];
          console.log("get budget year", this.budgetYear);
          $("#budgetYear").dropdown('set selected', this.budgetYear);

          this.getPlanNumber(this.budgetYear).subscribe((resPlanAndAnalysis: any) => {
            // console.log("PlanNumber : ", resPlanAndAnalysis.planNumber);
            // console.log("AnalysisNumber : ", resPlanAndAnalysis.analysisNumber);
            this.planNumber = resPlanAndAnalysis.planNumber;
            this.analysisNumber = resPlanAndAnalysis.analysisNumber;
            this.tablePlan();

          });

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

    this.getPlanNumber(this.budgetYear).subscribe((resPlanAndAnalysis: any) => {
      // console.log("PlanNumber : ", resPlanAndAnalysis.planNumber);
      // console.log("AnalysisNumber : ", resPlanAndAnalysis.analysisNumber);
      this.planNumber = resPlanAndAnalysis.planNumber;
      this.analysisNumber = resPlanAndAnalysis.analysisNumber;
      this.tablePlan();

    });
    
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

  
  get isCentral(){
    return TaUtils.isCentral(this.auth.getUserDetails().officeCode);
  }

  get isSector(){
    return TaUtils.isSector(this.auth.getUserDetails().officeCode);
  }

  get isArea(){
    return TaUtils.isArea(this.auth.getUserDetails().officeCode);
  }

}
