import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { License, ResponseData } from 'models/index';
import { AjaxService, MessageBarService, MessageService } from 'services/index';
import { Ope020106ButtonVo } from '../ope020106vo.model';
import { Ope02010603Vo } from './ope02010603vo.model';

const URL = {
  GET_FIND_CUSTOMER: "oa/02/01/06/customers",
  GET_FIND: "oa/02/01/06/find/customerLicense",
  GET_BUTTONS: "oa/02/01/06/detail",
}

@Component({
  selector: 'app-ope02010603',
  templateUrl: './ope02010603.component.html',
  styleUrls: ['./ope02010603.component.css']
})
export class Ope02010603Component implements OnInit {
  id: string = "";
  idMain: string = "";
  data: Ope02010603Vo = null;
  license: License = null;
  overViewForm: FormGroup;
  solventForm: FormGroup;
  textDropdown: any;
  array: any = [1, 2, 3];
  tabName: any = ["1", "ข้อมูลภาพรวม", "3", "4", "5", "6"];
  buttons: Ope020106ButtonVo = null;
  loading: boolean = false;
  constructor(
    private ajax: AjaxService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private _location: Location,
    private msg: MessageBarService
  ) {
    this.initialVariable();
  }

  ngOnInit() {
    this.id = this.route.snapshot.queryParams["oaCuslicenseId"] || "";
    this.idMain = this.route.snapshot.queryParams["id"] || "";
    if (this.id && this.idMain) {
      this.getLiciense();
      this.getButtonId();
    }
  }

  initialVariable() {
    this.solventForm = this.fb.group({
      write_at: [{ value: "" }, Validators.required],
    })
  }

  onSave() {
    this.router.navigate(["/cop-home/cop-home-m/cop-plan-level"]);
  }

  onSend() {
    this.router.navigate(["/cop-home/cop-home-m/cop-plan-level"]);
  }

  onBack() {
    this._location.back();
  }

  add() {
    this.array.push(this.array.length + 1);
  }

  delete(num) {
    this.array.splice(num, 1)
  }

  onClass(type: any) {
    if (type == 1) {
      this.textDropdown = "บันทึกเสร็จสิ้น";
      return "check circle outline icon large";
    } else if (type == 2) {
      this.textDropdown = "กำลังดำเนินการ";
      return "exclamation triangle icon large";
    }
  }

  onStyle(type: any) {
    let styles = {
      'color': (type == 1) ? '#1ee02d' : (type == 2) ? '#ff851b' : ''
    };
    return styles;
  }

  getLiciense() {
    this.loading = true;
    this.ajax.doGet(`${URL.GET_FIND}/${this.id}`).subscribe((response: ResponseData<License>) => {
      if (MessageService.MSG.SUCCESS == response.status) {
        this.license = response.data;
      } else {
        this.msg.errorModal(response.message);
      }
      this.loading = false;
    });
  }

  get sumLitre() {
    let sum: number = 0;
    if (this.license && this.license.details && this.license.details.length > 0) {
      for (let i = 0; i < this.license.details.length; i++) {
        sum += this.license.details[i].amount;
      }
    }
    return sum;
  }

  getButtonId() {
    this.loading = true;
    this.ajax.doGet(`${URL.GET_BUTTONS}/${this.idMain}`).subscribe((response: ResponseData<Ope020106ButtonVo>) => {
      if (MessageService.MSG.SUCCESS == response.status) {
        this.buttons = response.data;
        this.loading = false;
      } else {
        this.msg.errorModal(response.message);
        this.loading = false;
      }
    })
  }

}