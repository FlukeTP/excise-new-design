import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DecimalFormat, formatter, TextDateTH } from 'helpers/index';
import { NFDirective, ResponseData } from 'models/index';
import { AjaxService, MessageBarService, MessageService } from 'services/index';
import { Ope040106ButtonVo } from '../ope040106vo.model';
import { Ope04010608Vo } from './ope04010608vo.model';

declare var $: any;

const URL = {
  GET_FIND_CUSTOMER: "oa/04/01/06/customers",
  GET_BUTTONS: "oa/04/01/06/detail",
  GET_DETAILS: "oa/04/01/06/08/detail",
  PUT_UPDATE: "oa/04/01/06/08/save",
};

@Component({
  selector: 'app-ope04010608',
  templateUrl: './ope04010608.component.html',
  styleUrls: ['./ope04010608.component.css']
})
export class Ope04010608Component implements OnInit {
  loading: boolean = false;
  id: string = "";
  descriptions: any[] = [];
  forms: FormGroup = new FormGroup({});
  datas: FormArray = new FormArray([]);
  request: RequestOpe04010608 = {
    save: [],
    delete: []
  };
  buttons: Ope040106ButtonVo = null;
  df = new DecimalFormat('###,###.00');
  constructor(
    private fb: FormBuilder,
    private ajax: AjaxService,
    private route: ActivatedRoute,
    private msg: MessageBarService
  ) {
    this.forms = this.fb.group({
      datas: this.fb.array([])
    });
    this.datas = this.forms.get('datas') as FormArray;
    this.descriptions = [
      { name: "ชนิดสุรา ชื่อสุรา แรงแอลกอฮอล์ ขนาดบรรจุ หน่วยนับ", content: "ชนิดสุรา เช่น สุรากลั่น สุราแช่ ชื่อสุรา แรงแอลกอฮอล์ ขนาดบรรจุ (ลิตร) หน่วยนับ (ขวด กระป๋อง ฯลฯ)" },
      { name: "วัน เดือน ปี", content: "วัน เดือน ปี ตามปฎิทิน โดยให้มีการบันทึกบัญชีทุกวัน หากไม่มีรายการใดเกิดขึ้น ให้ใช้เครื่องหมาย \"-\" เพื่อแสดงว่าไม่มีรายการในวันนั้น" },
      { name: "รายการ", content: "รายการซื้อ หรือรับวัตถุดิบเข้าสถานที่ทำสุรา และการเบิกจ่ายวัตถุดิบไปใช้ทำสุรา" },
      { name: "หลักฐาน", content: "เอากสารแสดงถึงการได้มาของวัตถุดิบหลักที่รับ เช่น เลขที่ใบเสร็จรับเงินหรือใบส่งของที่มากับวัตถุดิบหลักนั้น" },
      { name: "รับ", content: "จำนวนของวัตถุดิบหลักที่รับ" },
      { name: "จ่าย", content: "จำนวนของวัตถุดิบที่จ่ายไปทำสุรา" },
      { name: "คงเหลือ", content: "จำนวนของวัตถุดิบที่คงเหลือในวันนั้น โดยนำยอด คงเหลือของวันก่อนหน้ามาบวกกับจำนวนรับ แล้วหักด้วยจำนวนจ่าย" },
    ];
  }


  ngOnInit(): void {
    this.id = this.route.snapshot.queryParams["id"] || "";
    if (this.id) {
      this.getButtonId();
    }
  }

  ngAfterViewInit(): void {
    $('.ui.accordion').accordion();
  }

  getButtonId(): void {
    this.loading = true;
    this.ajax.doGet(`${URL.GET_BUTTONS}/${this.id}`).subscribe((response: ResponseData<Ope040106ButtonVo>) => {
      if (MessageService.MSG.SUCCESS == response.status) {
        this.buttons = response.data;
        this.getDetail();
      } else {
        this.msg.errorModal(response.message);
      }
      this.loading = false;
    });
  }

  getDetail(): void {
    this.loading = true;
    this.ajax.doGet(`${URL.GET_DETAILS}/${this.buttons.oaAlcoholDtlId}`).subscribe((response: ResponseData<Ope04010608Vo[]>) => {
      if (MessageService.MSG.SUCCESS == response.status) {
        this.request.save = response.data;
        this.datas = this.forms.get('datas') as FormArray;
        if (response.data.length > 0) {
          this.datas.patchValue([]);
          for (let i = 0; i < response.data.length; i++) {
            this.datas.push(
              this.fb.group({
                oaAlcoholLabelId: [this.request.save[i].oaAlcoholLabelId],
                oaAlcoholId: [this.request.save[i].oaAlcoholId],
                seq: [this.request.save[i].seq],
                auditDate: [this.request.save[i].auditDate],
                label: [this.request.save[i].label],
                evidence: [this.request.save[i].evidence],
                receive: [this.df.format(this.request.save[i].receive)],
                pay: [this.df.format(this.request.save[i].pay)],
                balance: [this.df.format(this.request.save[i].balance)],
              })
            );
            setTimeout(() => {
              this.dateCalendar(i, new Date(this.request.save[i].auditDate));
            }, 100);
          }
        } else {
          this.onAddField();
        }
      } else {
        this.msg.errorModal(response.message);
      }
      this.loading = false;
    });
  }

  submit(): void {
    this.loading = true;
    if (this.forms.valid) {
      this.request.save = this.forms.value.datas as Ope04010608Vo[];
      for (let i = 0; i < this.request.save.length; i++) {
        this.request.save[i].receive = parseFloat(this.request.save[i].receive.toString().replace(/,/g, ''));
        this.request.save[i].pay = parseFloat(this.request.save[i].pay.toString().replace(/,/g, ''));
        this.request.save[i].balance = parseFloat(this.request.save[i].balance.toString().replace(/,/g, ''));
      }
      this.ajax.doPut(`${URL.PUT_UPDATE}`, this.request).subscribe((response: ResponseData<RequestOpe04010608>) => {
        if (MessageService.MSG.SUCCESS == response.status) {
          this.request = response.data;
          this.datas.patchValue([]);
          for (let i = 0; i < this.request.save.length; i++) {
            this.request.save[i].receive = this.df.format(this.request.save[i].receive);
            this.request.save[i].pay = this.df.format(this.request.save[i].pay);
            this.request.save[i].balance = this.df.format(this.request.save[i].balance);
            this.datas.at(i).patchValue(this.request.save[i]);
            this.loading = true;
            setTimeout(() => {
              this.loading = false;
              this.dateCalendar(i, new Date(this.request.save[i].auditDate));
            }, 100);
          }
          this.msg.successModal(response.message);
        } else {
          this.msg.errorModal(response.message);
        }
        this.loading = false;
      });
    }
  }

  onDelField(index: number, id?: number): void {
    if (id) {
      this.request.delete.push(id);
    }
    this.datas = this.forms.get('datas') as FormArray;
    this.datas.removeAt(index);
  }

  onAddField(): void {
    this.datas = this.forms.get('datas') as FormArray;
    this.datas.push(this.fb.group({
      oaAlcoholLabelId: [null],
      oaAlcoholId: [this.buttons.oaAlcoholDtlId],
      seq: [null],
      auditDate: [new Date],
      label: [''],
      evidence: [''],
      receive: [this.df.format(0)],
      pay: [this.df.format(0)],
      balance: [this.df.format(0)],
    }));
    this.request.save = this.datas.value as Ope04010608Vo[];
    setTimeout(() => {
      this.dateCalendar(this.datas.length - 1);
    }, 100);
  }

  dateCalendar(index: number, _date: Date = new Date()): void {
    this.loading = true;
    $(`#calendar${index}`).calendar({
      type: "date",
      initialDate: _date,
      text: TextDateTH,
      formatter: formatter(),
      onChange: (date, text) => {
        this.datas = this.forms.get('datas') as FormArray;
        this.datas.at(index).get('auditDate').patchValue(date);
      }
    }).css('width', '100%');
    setTimeout(() => {
      $(`#calendar${index}`).calendar('set date', _date);
      this.loading = false;
    }, 100);
  }

  nfDirective(control: string, index: number): NFDirective {
    this.datas = this.forms.get('datas') as FormArray;
    return {
      control: control,
      form: this.datas.at(index) as FormGroup
    };
  }

  get calReceive(): number {
    this.datas = this.forms.get('datas') as FormArray;
    let summary: number = 0;
    for (let i = 0; i < this.datas.length; i++) {
      if (this.datas.at(i).get('receive').value && this.datas.at(i).get('receive').value != '-')
        summary += parseFloat(this.datas.at(i).get('receive').value.replace(/,/g, ''));
    }
    return summary;
  }

  get calPay(): number {
    this.datas = this.forms.get('datas') as FormArray;
    let summary: number = 0;
    for (let i = 0; i < this.datas.length; i++) {
      if (this.datas.at(i).get('pay').value && this.datas.at(i).get('pay').value != '-')
        summary += parseFloat(this.datas.at(i).get('pay').value.replace(/,/g, ''));
    }
    return summary;
  }

  get calBalance(): number {
    this.datas = this.forms.get('datas') as FormArray;
    let summary: number = 0;
    for (let i = 0; i < this.datas.length; i++) {
      if (this.datas.at(i).get('balance').value && this.datas.at(i).get('balance').value != '-')
        summary += parseFloat(this.datas.at(i).get('balance').value.replace(/,/g, ''));
    }
    return summary;
  }

}

interface RequestOpe04010608 {
  save: Ope04010608Vo[];
  delete: number[];
}