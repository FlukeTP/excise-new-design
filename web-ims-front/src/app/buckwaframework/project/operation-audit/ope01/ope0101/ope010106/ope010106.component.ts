import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { formatter, TextDateTH } from 'helpers/index';
import { BreadCrumb, ResponseData } from 'models/index';
import { AjaxService, MessageBarService, MessageService } from 'services/index';
import { Ope010106ButtonVo } from './ope010106vo.model';
import { Ope01010610Vo } from './ope01010610/ope01010610vo.model';

declare var $: any;

const URL = {
  GET_BUTTONS: "oa/01/01/06/detail",
  GET_FIND_CUSTOMER: "oa/01/01/06/customers",
}

@Component({
  selector: 'app-ope010106',
  templateUrl: './ope010106.component.html',
  styleUrls: ['./ope010106.component.css']
})
export class Ope010106Component implements OnInit {
  breadcrumb: BreadCrumb[] = [
    { label: "ตรวจปฏิบัติการ", route: "#" },
    { label: "สารละลายประเภทไฮโดรคาร์บอน", route: "#" },
    { label: "บันทึกการออกตรวจปฏิบัติการ", route: "#" }
  ];

  id: string = "";
  formatter1: any;
  buttons: Ope010106ButtonVo = null;
  data: Ope01010610Vo = null;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private ajax: AjaxService,
    private msg: MessageBarService
  ) {
    this.formatter1 = formatter('วดป');
  }

  ngOnInit() {
    $('.dropdown').dropdown();
    $("#date1").calendar({
      type: "date",
      text: TextDateTH,
      formatter: this.formatter1
    });
    this.id = this.route.snapshot.queryParams["id"] || "";
    if (this.id) {
      this.getButtonId();
    }
  }

  ngAfterViewInit() {
    $('.tabular.menu .item').tab();
  }

  back() {
    this.router.navigate(['/ope01/02']);
  }

  urlActivate(urlMatch: string) {
    return this.router.url && this.router.url.substring(0, 15) == urlMatch;
  }

  routeTo(route: string, id: number, name?: string) {
    let queryParams = {
      id: this.id
    };
    if (name) {
      queryParams[name] = id;
    }
    this.router.navigate([route], {
      queryParams
    });
  }

  getButtonId() {
    this.ajax.doGet(`${URL.GET_BUTTONS}/${this.id}`).subscribe((response: ResponseData<Ope010106ButtonVo>) => {
      if (MessageService.MSG.SUCCESS == response.status) {
        this.buttons = response.data;
        this.ajax.doGet(`${URL.GET_FIND_CUSTOMER}/${this.buttons.oaCuslicenseId}`).subscribe((res: ResponseData<Ope01010610Vo>) => {
          if (MessageService.MSG.SUCCESS == res.status) {
            this.data = res.data;
            this.routeTo('/ope01/01/06/10', response.data.oaCuslicenseId, 'oaCuslicenseId');
          } else {
            this.msg.errorModal(res.message);
          }
        });
      } else {
        this.msg.errorModal(response.message);
      }
    })
  }

  get licenseTypeUser() {
    return this.buttons && this.buttons.licenseType === "A";
  }
  get licenseTypeAgent() {
    return this.buttons && this.buttons.licenseType === "B";
  }
  get identifyTypeNew() {
    return this.buttons && this.buttons.oldCustomer === "N";
  }
  get identifyTypeOld() {
    return this.buttons && this.buttons.oldCustomer === "Y";
  }
  get licenseTypeUserAndIdentifyTypeNew() {
    return this.licenseTypeUser && this.identifyTypeNew;
  }
  get licenseTypeUserAndIdentifyTypeOld() {
    return this.licenseTypeUser && this.identifyTypeOld;
  }
  get licenseTypeAgentAndIdentifyTypeNew() {
    return this.licenseTypeAgent && this.identifyTypeNew;
  }
  get licenseTypeAgentAndIdentifyTypeOld() {
    return this.licenseTypeAgent && this.identifyTypeOld;
  }

}
