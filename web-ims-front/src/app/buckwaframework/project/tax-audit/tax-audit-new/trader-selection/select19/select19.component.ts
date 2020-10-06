import { Component, OnInit } from '@angular/core';
import { BreadcrumbContant } from '../../BreadcrumbContant';
import { BreadCrumb } from 'models/breadcrumb.model';
import { AjaxService } from 'services/ajax.service';
import { MessageBarService } from 'services/message-bar.service';
import { ResponseData } from 'models/response-data.model';
import { MessageService } from 'services/message.service';
import { Observable } from 'rxjs';
declare var $: any;
@Component({
  selector: 'app-select19',
  templateUrl: './select19.component.html',
  styleUrls: ['./select19.component.css']
})
export class Select19Component implements OnInit {
  b: BreadcrumbContant = new BreadcrumbContant();

  breadcrumb: BreadCrumb[] = [
    { label: this.b.b00.label, route: this.b.b00.route },
    { label: this.b.b01.label, route: this.b.b01.route },
    { label: this.b.b14.label, route: this.b.b14.route },
  ];

  table: any;
  budgetYear: any;
  planNumber: any;
  analysisNumber: any;

  constructor(
    private ajax: AjaxService,
    private messageBar: MessageBarService
  ) { }


  //==> app function
  ngOnInit() {

  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this.getBudgetYear().subscribe((resbudgetYear: ResponseData<any>) => {
      console.log("Budget Year : ", resbudgetYear);
      this.budgetYear = resbudgetYear;
      this.getPlanNumber(resbudgetYear).subscribe((resPlanAndAnalysis: any) => {
        console.log("PlanNumber : ", resPlanAndAnalysis.planNumber);
        console.log("AnalysisNumber : ", resPlanAndAnalysis.analysisNumber);
        this.planNumber = resPlanAndAnalysis.planNumber;
        this.analysisNumber = resPlanAndAnalysis.analysisNumber;
        this.tablePlan();

      });
    });
  }

  tablePlan = () => {
    console.log("datatable call");
    const URL = AjaxService.CONTEXT_PATH + "ta/tax-operator/plan-selected-dtl-approve";
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
            planNumber: this.planNumber
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
  Approval() {
    this.messageBar.comfirm(res => {
      if (res) {
        //TODO
      }
    }, "ยืนยันการทำรายการ");
    console.log("Approval");
  }
  //==>app function end

  // ==>call backend start
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
  // ==>call backend end
}
