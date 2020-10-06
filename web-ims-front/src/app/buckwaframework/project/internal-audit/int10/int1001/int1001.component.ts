import { Component, OnInit } from '@angular/core';
import { BreadCrumb, ResponseData } from 'models/index';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { MessageService } from 'services/message.service';
import { MessageBarService } from 'services/message-bar.service';
import { AjaxService } from 'services/ajax.service';

declare var $ : any;

const URL = {
  FIND_INSPECTION_PLAN: "ia/int10/find/ins-plan-params",
}

@Component({
  selector: 'app-int1001',
  templateUrl: './int1001.component.html',
  styleUrls: ['./int1001.component.css']
})
export class Int1001Component implements OnInit {

  breadcrumb: BreadCrumb[] = [
    { label: "ตรวจสอบถายใน", route: "#" },
    { label: "ออกตรวจ", route: "#" }
  ];
  riskType: string = "";
  idinspec: any;
  dataFilterIdParams : any = [];

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private msg: MessageBarService,
    private ajax: AjaxService,
    private router: Router
  ) { }

  ngOnInit() {
    $(".ui.dropdown").dropdown();
    $(".ui.dropdown.ai").css("width", "100%");
    this.idinspec = this.route.snapshot.queryParams["id"];
    console.log("idinspec :",this.idinspec);
    this.getData()
  }

  ngAfterViewInit(): void {
    $('.menu .item')
    .tab()
  ;
  }

  getData() {   
    let  id  = this.idinspec;
    this.ajax.doGet(`${URL.FIND_INSPECTION_PLAN}/${id}`).subscribe((response: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == response.status) {
        this.dataFilterIdParams = response.data;
        console.log(this.dataFilterIdParams.length);
        console.log("response int 10/01 : ", this.dataFilterIdParams);
      } else {
        this.msg.errorModal(response.message);
      }
    }, err => {
      this.msg.errorModal("กรุณาติดต่อผู้ดูแลระบบ");
    });
  }

 

}
