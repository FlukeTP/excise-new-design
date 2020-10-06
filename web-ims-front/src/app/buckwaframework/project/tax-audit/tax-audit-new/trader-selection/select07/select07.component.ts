import { Component, OnInit } from '@angular/core';
import { BreadCrumb, ResponseData } from 'models/index';
import { AuthService } from 'services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { IaService } from 'services/ia.service';
import { TextDateTH, formatter } from 'helpers/datepicker';
import { Location } from '@angular/common';
import { BreadcrumbContant } from '../../BreadcrumbContant';
import { FormGroup, FormControl } from '@angular/forms';
import { MessageBarService } from 'services/message-bar.service';
import { MessageService } from 'services/message.service';
import { AjaxService } from 'services/ajax.service';
import { FactoryVo } from './factory';

declare var $: any;

const URL = {
  FIND_BY_NEW_REG_ID: "ta/tax-audit/find-by-new-reg-id"
}

@Component({
  selector: 'app-select07',
  templateUrl: './select07.component.html',
  styleUrls: ['./select07.component.css']
})
export class Select07Component implements OnInit {

  b: BreadcrumbContant = new BreadcrumbContant();
  breadcrumb: BreadCrumb[] = [
    { label: this.b.b00.label, route: this.b.b00.route },
    { label: this.b.b05.label, route: this.b.b05.route },
  ];
  loading1: boolean = false;
  button: boolean = false;

  newRegId: string = "";
  // form
  dataForm: FormGroup;

  constructor(
    private ajax: AjaxService,
    private router: Router,
    private route: ActivatedRoute,
    private messageBar: MessageBarService,
  ) { }

  ngOnInit() {

    //initial data    
    this.dataForm = new FormGroup({
      newRegId: new FormControl(''),
      cusFullname: new FormControl(''),
      facFullname: new FormControl(''),
      facAddress: new FormControl(''),

      secDesc: new FormControl(''),
      areaDesc: new FormControl(''),
      dutyDesc: new FormControl(''),


    });
    this.newRegId = this.route.snapshot.queryParams['newRegId'] || "";
    this.setData(this.newRegId);
    if(this.newRegId){
      this.setData(this.newRegId);
    }else{
      this.router.navigate(["/tax-audit-new/ta02/02"]);
    }
  }


  ngAfterViewInit(): void {
  }

  goTo(link :string) {
    this.router.navigate([link], {
      queryParams: {
        newRegId: this.newRegId
      }
    });
  }


  setData(id: String) {
    if (id) {
      this.ajax.doGet(`${URL.FIND_BY_NEW_REG_ID}/${id}`).subscribe((result: ResponseData<FactoryVo>) => {
        if (MessageService.MSG.SUCCESS == result.status) {
          this.dataForm.get('newRegId').patchValue(result.data.newRegId);
          this.dataForm.get('cusFullname').patchValue(result.data.cusFullname);
          this.dataForm.get('facFullname').patchValue(result.data.facFullname);
          this.dataForm.get('facAddress').patchValue(result.data.facAddress);
          this.dataForm.get('secDesc').patchValue(result.data.secDesc);
          this.dataForm.get('areaDesc').patchValue(result.data.areaDesc);
          this.dataForm.get('dutyDesc').patchValue(result.data.dutyDesc);
        } else {
          this.messageBar.errorModal(result.message);
        }
      });
    }
  }

}
