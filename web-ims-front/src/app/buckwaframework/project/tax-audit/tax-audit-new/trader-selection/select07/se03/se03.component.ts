import { Component, OnInit } from '@angular/core';
import { BreadCrumb, ResponseData } from 'models/index';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AjaxService } from 'services/ajax.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageBarService } from 'services/message-bar.service';
import { IaService } from 'services/ia.service';
import { MessageService } from 'services/message.service';
import { FactoryVo } from '../factory';
declare var $: any;

const URL = {
  FIND_BY_NEW_REG_ID: "ta/tax-audit/find-by-new-reg-id"
}
@Component({
  selector: 'app-se03',
  templateUrl: './se03.component.html',
  styleUrls: ['./se03.component.css']
})
export class Se03Component implements OnInit {

  breadcrumb: BreadCrumb[] = [
    { label: "ตรวจสอบภาษี", route: "#" },
    { label: "แผนการตรวจสอบประจำปี", route: "#" },
    { label: "บันทึกผลการตรวจ (บริการ)", route: "#" }
  ];
  
  
  newRegId: string = "";
  formGroup: FormGroup;
  
  constructor(    
    private ajax: AjaxService,
    private router: Router,
    private route: ActivatedRoute,
    private messageBar: MessageBarService,
    private modelService: IaService,
    private formBuilder: FormBuilder,) { }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      newRegId: [''],
      cusFullname:[''],
      facFullname:[''],
      facAddress:[''],
      secDesc:[''],
      areaDesc:[''],
      dutyDesc: ['']     
    });
    this.newRegId = this.route.snapshot.queryParams['newRegId'] || "";
    this.setData(this.newRegId);
    if(this.newRegId){
      this.setData(this.newRegId);
    }else{
      this.router.navigate(["/tax-audit-new/ta02/02"]);
    }
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
          this.formGroup.get('newRegId').patchValue(result.data.newRegId);
          this.formGroup.get('cusFullname').patchValue(result.data.cusFullname);
          this.formGroup.get('facFullname').patchValue(result.data.facFullname);
          this.formGroup.get('facAddress').patchValue(result.data.facAddress);
          this.formGroup.get('secDesc').patchValue(result.data.secDesc);
          this.formGroup.get('areaDesc').patchValue(result.data.areaDesc);
          this.formGroup.get('dutyDesc').patchValue(result.data.dutyDesc);
        } else {
          this.messageBar.errorModal(result.message);
        }
      });
    }
  }
  
}
