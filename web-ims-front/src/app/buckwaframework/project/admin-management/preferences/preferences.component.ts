import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AjaxService } from 'services/ajax.service';
import { MessageBarService } from 'services/message-bar.service';
import { Utils } from 'helpers/index';
import { ResponseData } from 'models/index';
import { MessageService } from 'services/message.service';

declare var $: any;

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.css']
})
export class PreferencesComponent implements OnInit {

  formGroup: FormGroup;
  loading: boolean = false;
  breadcrumb: any;
  constructor(
    private fb: FormBuilder,
    private ajax: AjaxService,
    private msg: MessageBarService,
  ) { }

  // ============= setting initial =============
  ngOnInit() {
    this.setFormGroup();
    this.getPreferences();
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this.callDropDown();
  }

  setFormGroup() {
    this.formGroup = this.fb.group({
      sendAllFlag: ["", Validators.required],
      seeFlag: ["", Validators.required],
      selectFlag: ["", Validators.required],
      incomeType: ["", Validators.required]
    })
  }

  callDropDown = () => {
    setTimeout(() => {
      $('.ui.dropdown').dropdown();
    }, 100);
  }

  // ============= Action ===============
  save() {
    const URL = "preferences/admin-preferences/update";
    this.loading = true;
    this.ajax.doPost(URL, this.formGroup.value).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.msg.successModal(res.message);
      } else {
        this.msg.errorModal(res.message);
      }
      this.loading = false;
    })
  }

  reloadCache() {
    const URL = "preferences/reload-cache";
    this.loading = true;
    this.ajax.doGet(URL).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.msg.successModal(res.message);
      } else {
        this.msg.errorModal(res.message);
      }
      this.loading = false;
    })
  }

  // ================ call back-end ===========
  getPreferences() {
    const URL = "preferences/parameter/TA_CONFIG";
    const PARAM_CODE_LIST = [
      { name: "sendAllFlag", path: "SEND_ALL_FLAG" },
      { name: "seeFlag", path: "SEE_FLAG" },
      { name: "selectFlag", path: "SELECT_FLAG" },
      { name: "incomeType", path: "INCOME_TYPE" }
    ];
    this.ajax.doPost(URL, {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        if (0 < res.data.length) {
          PARAM_CODE_LIST.forEach(element => {
            res.data.forEach(e => {
              if (element.path == e.paramCode) {
                this.formGroup.get(element.name).patchValue(e.value1);
                return false;
              }
            });
          });
        }
      } else {
        this.msg.errorModal(res.message);
      }
      this.callDropDown();
    })
  }

}
