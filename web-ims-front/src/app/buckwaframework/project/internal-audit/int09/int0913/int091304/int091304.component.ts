import { Component, OnInit } from '@angular/core';
import { AjaxService } from 'services/ajax.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageBarService } from 'services/message-bar.service';
import { MessageService } from 'services/message.service';
import { BreadCrumb } from 'models/breadcrumb.model';
import { TextDateTH, formatter } from 'helpers/datepicker';
import { ResponseData } from 'models/response-data.model';


const URL = {
  SEARCH: "ia/int091304/filter/budget-year",
}
declare var $: any;
@Component({
  selector: 'app-int091304',
  templateUrl: './int091304.component.html',
  styleUrls: ['./int091304.component.css']
})
export class Int091304Component implements OnInit {
  breadcrumb: BreadCrumb[] = [
    { label: "ตรวจสอบภายใน", route: "#" }
    // path something ??
  ];

  formSearch: FormGroup = new FormGroup({});
  datatable: FormGroup = new FormGroup({});
  data: any = { quarter: [] }
  loading: boolean = false;

  constructor(
    private ajax: AjaxService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private msg: MessageBarService,
    private router: Router
  ) { }

  ngOnInit() {
    this.initVariable();
    this.search();
  }

  ngAfterViewInit(): void {
    this.calendar();
  }

  routeTo(path: string, value?: any, value2?: any) {
    console.log("value: ", value);
    this.router.navigate([path], {
      queryParams: {
        param1: value,  // ubillType
        param2: value2  // budgetYear
      }
    });
  }

  stopLoading() {
    this.loading = false;
  }

  search = () => {
    this.loading = true;
    this.ajax.doPost(URL.SEARCH, { budgetYear: this.formSearch.get('budgetYear').value }).subscribe((response: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == response.status) {
        this.data = response.data;
        this.stopLoading();
      } else {
        this.msg.errorModal(response.message);
        this.stopLoading();
      }
    }, err => {
      this.msg.errorModal(MessageService.MSG.FAILED_CALLBACK);
      this.stopLoading();
    });

  }

  /* _________________ initVariable _________________ */
  initVariable() {
    this.formSearch = this.fb.group({
      budgetYear: [MessageService.budgetYear()],
      totalDepartment: [""]
    });
  }

  /* _________________ calendar _________________ */
  calendar() {
    $('#budgetYearCld').calendar({
      type: "year",
      text: TextDateTH,
      formatter: formatter('year'),
      onChange: (date, text) => {
        this.formSearch.get('budgetYear').patchValue(text);
        this.search();
      }
    }).css("width", "100%");
  }

}
