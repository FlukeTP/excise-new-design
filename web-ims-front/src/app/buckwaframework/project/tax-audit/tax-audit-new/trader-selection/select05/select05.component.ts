import { Component, OnInit } from '@angular/core';
import { ResponseData, BreadCrumb } from 'models/index';
import { AjaxService } from 'services/ajax.service';
import { Observable } from 'rxjs/internal/Observable';
import { MessageService } from 'services/message.service';
import { MessageBarService } from 'services/message-bar.service';
import { BreadcrumbContant } from '../../BreadcrumbContant';

declare var $: any;
@Component({
  selector: 'app-select05',
  templateUrl: './select05.component.html',
  styleUrls: ['./select05.component.css']
})
export class Select05Component implements OnInit {

  b: BreadcrumbContant = new BreadcrumbContant();

  breadcrumb: BreadCrumb[] = [
    { label: this.b.b00.label, route: this.b.b00.route },
    { label: this.b.b04.label, route: this.b.b04.route },
    { label: this.b.b13.label, route: this.b.b13.route },
  ];

  table: any;
  budgetYear: any = '';
  planNumber: any = '';
  analysisNumber: any = '';

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

        if (resPlanAndAnalysis != null) {
          this.planNumber = resPlanAndAnalysis.planNumber;
          this.analysisNumber = resPlanAndAnalysis.analysisNumber;
        }
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
