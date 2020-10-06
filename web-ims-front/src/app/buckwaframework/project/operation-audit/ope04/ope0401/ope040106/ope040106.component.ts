import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadCrumb, ResponseData } from 'models/index';
import { AjaxService, MessageBarService, MessageService } from 'services/index';
import { Ope04010601Vo } from './ope04010601/ope04010601vo.model';
import { Ope040106ButtonVo } from './ope040106vo.model';

declare var $: any;

const URL = {
  GET_BUTTONS: "oa/04/01/06/detail",
  GET_FIND_CUSTOMER: "oa/04/01/06/customers",
}

@Component({
  selector: 'app-ope040106',
  templateUrl: './ope040106.component.html',
  styleUrls: ['./ope040106.component.css']
})
export class Ope040106Component implements OnInit {

  breadcrumb: BreadCrumb[] = [
    { label: "ตรวจปฏิบัติการ", route: "#" },
    { label: "สุรากลั่นชุมชน", route: "#" },
    { label: "การออกตรวจ", route: "#" }
  ]
  id: string = "";
  buttons: Ope040106ButtonVo = null;
  data: Ope04010601Vo = null;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private ajax: AjaxService,
    private msg: MessageBarService
  ) {
    // TODO Constructor
  }

  ngOnInit() {
    this.id = this.route.snapshot.queryParams["id"] || "";
    if (this.id) {
      this.getButtonId();
    }
  }

  ngAfterViewInit() {
    // TODO AfterviewInit
  }

  getButtonId() {
    this.ajax.doGet(`${URL.GET_BUTTONS}/${this.id}`).subscribe((response: ResponseData<Ope040106ButtonVo>) => {
      if (MessageService.MSG.SUCCESS == response.status) {
        this.buttons = response.data;
        this.ajax.doGet(`${URL.GET_FIND_CUSTOMER}/${this.buttons.oaCuslicenseId}`).subscribe((res: ResponseData<Ope04010601Vo>) => {
          if (MessageService.MSG.SUCCESS == res.status) {
            this.data = res.data;
            if (this.urlActivate('/ope04/01/06/01') || this.urlActivate('/ope04/01/06?id')) {
              this.routeTo('/ope04/01/06/01', response.data.oaCuslicenseId, 'oaCuslicenseId');
            }
          } else {
            this.msg.errorModal(res.message);
          }
        });
      } else {
        this.msg.errorModal(response.message);
      }
    })
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
