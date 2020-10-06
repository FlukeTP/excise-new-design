import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BreadCrumb, ResponseData } from 'models/index';
import { Se01Form } from './se01.model';
import { AuthService } from 'services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { IaService } from 'services/ia.service';
import { Se01Serivce } from './se01.service';
import { formatter, TextDateTH } from 'helpers/datepicker';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AjaxService } from 'services/ajax.service';
import { MessageBarService } from 'services/message-bar.service';
import { MessageService } from 'services/message.service';
import { FactoryVo } from '../factory';
declare var $: any;

const URL = {
  FIND_BY_NEW_REG_ID: "ta/tax-audit/find-by-new-reg-id"
}

@Component({
  selector: 'app-se01',
  templateUrl: './se01.component.html',
  styleUrls: ['./se01.component.css'],
  providers: [Se01Serivce]
})
export class Se01Component implements OnInit {
  

  breadcrumb: BreadCrumb[] = [
    { label: 'ตรวจสอบภาษี', route: '#' },
    { label: 'แผนการตรวจสอบประจำปี', route: '#' },
    { label: 'วิเคราะห์ข้อมูลเบื้องต้น', route: '#' }
  ];

  hideResult: boolean= false;
  loading: boolean = false;

  formGroup: FormGroup;
  checkSearchFlag: boolean = false;

  newRegId: string = "";


  constructor(
    private ajax: AjaxService,
    private router: Router,
    private route: ActivatedRoute,
    private messageBar: MessageBarService,
    private modelService: IaService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      newRegId: [''],
      cusFullname:[''],
      facFullname:[''],
      facAddress:[''],
      secDesc:[''],
      areaDesc:[''],
      dutyDesc: [''],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],     
    });
    this.newRegId = this.route.snapshot.queryParams['newRegId'] || "";
    if(this.newRegId){
      this.setData(this.newRegId);
    }else{
      this.router.navigate(["/tax-audit-new/ta02/02"]);
    }
  }


  ngAfterViewInit(): void {
    this.calendar();
  }

  calendar=()=>{
    $('#date1').calendar({
      endCalendar: $("#date2"),
      type: 'month',
      text: TextDateTH,
      formatter: formatter('month-year'),
      onChange: (date, text, mode) => {
        this.formGroup.patchValue({
          startDate: text
        })
      }
    });
    $('#date2').calendar({
      startCalendar: $("#date1"),
      type: 'month',
      text: TextDateTH,
      formatter: formatter('month-year'),
      onChange: (date, text, mode) => {
        this.formGroup.patchValue({
          endDate: text
        })
      }
    });
  }


  onSearch() {
    this.hideResult = false;
    this.checkSearchFlag=true;
    if(this.formGroup.value.startDate && this.formGroup.value.endDate){
      setTimeout(() => {
        this.loading = false;
        this.hideResult = true;
        this.router.navigate(["/tax-audit-new/select07/se01/s01"], {
          queryParams: {
            newRegId: this.newRegId
          }
        });
      }, 1000);
      this.modelService.setData(this.formGroup.value);
      console.log("model service : ", this.modelService.getData());
      this.loading = true;
    }
  }

  onBackPages() {
    this.router.navigate(["/tax-audit-new/select07"], {
      queryParams: {
        newRegId: this.newRegId
      }
    });
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


  invalidSearchFormControl(control: string) {
    return this.formGroup.get(control).invalid && (this.formGroup.get(control).touched || this.checkSearchFlag);
  }

}
