import { Component, OnInit } from '@angular/core';
import { AjaxService } from 'services/ajax.service';
import { IaService } from 'services/ia.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Ta020202 } from '../ta020202.model';
import * as TA020202ACTION from "../ta020202.action";

declare var $: any;
const URL = {
  SEARCH: AjaxService.CONTEXT_PATH + "ta/basic-analysis/inquiry-tax-filing-data",
}
@Component({
  selector: 'app-ta02020206',
  templateUrl: './ta02020206.component.html',
  styleUrls: ['./ta02020206.component.css']
})
export class Ta02020206Component implements OnInit {

  formVo: FormVo;
  table: any;
  dataStore: any;
  note: any;
  newRegId: string;
  dutyGroupId: string;
  auditPlanCode: string;
  paperBaNumber: string;

  constructor(
    private router: Router,
    private detailService: IaService,
    private route: ActivatedRoute,
    private store: Store<AppState>
  ) { }

  ngOnInit() {
    this.formVo = {
      newRegId: '',
      startDate: '',
      endDate: '',
      dutyGroupId: ''
    }
    this.newRegId = this.route.snapshot.queryParams['newRegId'] || "";
    this.dutyGroupId = this.route.snapshot.queryParams['dutyGroupId'] || "";
    this.auditPlanCode = this.route.snapshot.queryParams['auditPlanCode'] || "";
    this.paperBaNumber = this.route.snapshot.queryParams['paperBaNumber'] || "";
    this.setDataService();
    this.dataStore = this.store.select(state => state.Ta020202.Ta020202.anaResultText6).subscribe(data => {
      this.note = data
    });
  }
  ngAfterViewInit(): void {
    this.dataTable();
    // setTimeout(() => {
    //   this.dataTable();
    // }, 200);
  }

  ngOnDestroy(): void {
    this.dataStore.unsubscribe();
  }

  setDataService() {
    let model = this.detailService.getData();
    if (model == null) {
      this.router.navigate(['/tax-audit-new/ta02/02/02']);
      return false;
    }
    this.formVo = model
    console.log("model service : ", this.formVo);
  }

  onChangeNote() {
    let data;
    this.dataStore = this.store.select(state => state.Ta020202.Ta020202).subscribe(note => {
      data = note
    });
    data['anaResultText6'] = this.note;
    this.store.dispatch(new TA020202ACTION.AddTa020202(data));
  }

  dataTable() {
    if (this.table != null) {
      this.table.destroy();
    }
    this.table = $("#dataTable").DataTableTh({
      lengthChange: true,
      searching: false,
      ordering: false,
      processing: true,
      serverSide: false,
      paging: true,
      ajax: {
        type: "POST",
        url: URL.SEARCH,
        contentType: "application/json",
        data: (d) => {
          return JSON.stringify($.extend({}, d, {
            "newRegId": this.newRegId,
            "startDate": this.formVo.startDate,
            "endDate": this.formVo.endDate,
            "paperBaNumber": this.paperBaNumber,
            "dutyGroupId": this.dutyGroupId
          }));
        }
      },
      columns: [
        {
          className: "ui center aligned",
          render: function (data, type, row, meta) {
            return meta.row + meta.settings._iDisplayStart + 1;
          }
        },
        {
          data: "taxMonth", className: "text-left"
        }, {
          data: "anaTaxSubmissionDate", className: "text-left"
        }, {
          data: "taxSubmissionDate", className: "text-left"
        }, {
          data: "resultTaxSubmission", className: "text-center"
        }
      ],
    });

  }
}

interface FormVo {
  newRegId: string;
  startDate: string;
  endDate: string;
  dutyGroupId: string;
}

class AppState {
  Ta020202: {
    Ta020202: Ta020202,
  }
}