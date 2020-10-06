import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { formatter, TextDateTH } from 'helpers/index';
import { BreadCrumb, ResponseData } from 'models/index';
import { AjaxService, MessageBarService, MessageService } from 'services/index';
import { Ope02010603Vo } from './ope02010603/ope02010603vo.model';
import { Ope020106ButtonVo } from './ope020106vo.model';

declare var $: any;

const URL = {
  GET_FIND_CUSTOMER: "oa/02/01/06/customers",
  GET_FIND: "oa/02/01/06/find/customerLicense",
  GET_BUTTONS: "oa/02/01/06/detail"
}

@Component({
  selector: 'app-ope020106',
  templateUrl: './ope020106.component.html',
  styleUrls: ['./ope020106.component.css']
})
export class Ope020106Component implements OnInit {

  id: string = "";
  breadcrumb: BreadCrumb[] = [
    { label: "ตรวจปฏิบัติการ", route: "#" },
    { label: "น้ำมันหล่อลื่น", route: "/ope02/02/" },
    { label: "บันทึกการออกตรวจปฏิบัติการ", route: "#" }
  ]
  formatter1: any;
  data: Ope02010603Vo = null;
  buttons: Ope020106ButtonVo = null;
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
    this.router.navigate(['/ope02/02']);
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
    this.ajax.doGet(`${URL.GET_BUTTONS}/${this.id}`).subscribe((response: ResponseData<Ope020106ButtonVo>) => {
      if (MessageService.MSG.SUCCESS == response.status) {
        this.buttons = response.data;
        this.ajax.doGet(`${URL.GET_FIND_CUSTOMER}/${this.buttons.oaCuslicenseId}`).subscribe((res: ResponseData<Ope02010603Vo>) => {
          if (MessageService.MSG.SUCCESS == res.status) {
            this.data = res.data;
            this.routeTo('/ope02/01/06/03', response.data.oaCuslicenseId, 'oaCuslicenseId');
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
