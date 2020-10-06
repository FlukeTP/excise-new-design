import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EnYearToThYear, formatter, TextDateTH } from 'helpers/datepicker';
import { BreadCrumb } from 'models/breadcrumb.model';
import { ResponseData } from 'models/index';
import { AjaxService, MessageBarService, MessageService } from 'services/index';
import { Ope0413Vo, Ope0413ApproveVo } from './ope0413vo.model';

declare var $: any;

const URL = {
  GET_FIND: "oa/04/13/find",
  GET_FIND_APPROVE: "oa/04/13/findApprove",
}

@Component({
  selector: 'app-ope0413',
  templateUrl: './ope0413.component.html',
  styleUrls: ['./ope0413.component.css']
})
export class Ope0413Component implements OnInit {
  breadcrumb: BreadCrumb[] = [
    { label: "ตรวจปฏิบัติการ", route: "#" },
    { label: "สุรากลั่นชุมชน", route: "#" },
    { label: "อนุมัติการออกตรวจ", route: "#" },
  ];
  lists: Ope0413Vo[] = [];
  listsApprove: Ope0413ApproveVo[] = [];
  form: FormGroup = new FormGroup({});
  submitted: boolean = false;
  constructor(
    private ajaxService: AjaxService,
    private fb: FormBuilder,
    private msg: MessageBarService,
    private router: Router
  ) {
    const date: Date = new Date();
    this.form = this.fb.group({
      budgetYear: [EnYearToThYear(date.getFullYear().toString()), Validators.required]
    });
  }

  ngOnInit() {
    // TODO
    this.getByBudgetYear();
  }

  ngAfterViewInit(): void {
    $("#budgetYear").calendar({
      type: "year",
      text: TextDateTH,
      initialDate: new Date(),
      formatter: formatter("ป"),
      onChange: (date, text) => {
        this.form.get('budgetYear').patchValue(text);
      }
    });
    setTimeout(() => $("#budgetYear").calendar('set date', new Date()), 200);
  }

  search() {
    this.submitted = true;
    if (this.form.valid) {
      this.getByBudgetYear();
      this.submitted = false;
    }
  }

  toggleShowList(index: number) {
    this.lists[index].toggleList = !this.lists[index].toggleList;
  }

  toggleShowListApprove(index: number) {
    this.listsApprove[index].toggleList = !this.listsApprove[index].toggleList;
  }

  getByBudgetYear() {
    // WAIT FOR APPROVE
    this.ajaxService.doGet(`${URL.GET_FIND}/${this.form.get('budgetYear').value}`).subscribe((response: ResponseData<Ope0413Vo[]>) => {
      if (MessageService.MSG.SUCCESS == response.status) {
        this.lists = response.data;
        for(let i=0; i<this.lists.length; i++) {
          this.lists[i].toggleList = false;
        }
      } else {
        this.msg.errorModal(response.message);
      }
    });
    // APPROVED
    this.ajaxService.doGet(`${URL.GET_FIND_APPROVE}/${this.form.get('budgetYear').value}`).subscribe((response: ResponseData<Ope0413ApproveVo[]>) => {
      if (MessageService.MSG.SUCCESS == response.status) {
        this.listsApprove = response.data;
        for(let i=0; i<this.listsApprove.length; i++) {
          this.listsApprove[i].toggleList = false;
        }
      } else {
        this.msg.errorModal(response.message);
      }
    });
  }

  redirectTo(id: number) {
    this.router.navigate(['/ope04/13/01'], {
      queryParams: {
        id: id
      }
    });
  }

}
