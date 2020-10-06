import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { formatter, TextDateTH, DecimalFormat } from 'helpers/index';
import { ResponseData, NFDirective } from 'models/index';
import { AjaxService, MessageBarService, MessageService } from 'services/index';
import { Ope040106ButtonVo } from '../ope040106vo.model';
import { Ope04010606Vo } from './ope04010606vo.model';

declare var $: any;

const URL = {
  GET_FIND_CUSTOMER: "oa/04/01/06/customers",
  GET_BUTTONS: "oa/04/01/06/detail",
  GET_DETAILS: "oa/04/01/06/06/detail",
  PUT_UPDATE: "oa/04/01/06/06/save",
};

@Component({
  selector: 'app-ope04010606',
  templateUrl: './ope04010606.component.html',
  styleUrls: ['./ope04010606.component.css']
})
export class Ope04010606Component implements OnInit {
  loading: boolean = false;
  id: string = "";
  descriptions: any[] = [];
  forms: FormGroup = new FormGroup({});
  datas: FormArray = new FormArray([]);
  request: RequestOpe04010606 = {
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
      { name: "วัน เดือน ปี", content: `วัน เดือน ปี ตามปฎิทิน โดยให้มีการบันทึกรายการที่ทำทุกวัน หากไม่มีรายการใดเกิดขึ้น ให้ใช้เครื่องหมาย " - " เพื่อแสดงว่าไม่มีรายการใดเกิดขึ้นในวันนั้น` },
      { name: "การหมักส่า", content: "จำนวนสุราที่หมักในวันนั้น โดยบันทึกเป็นจำนวนและขนาดของภาชนะ เช่น จำนวน ๕ โอ่ง ขนาดโอ่งละ ๑๐๐ ลิตร หรือ จำนวน ๕ ถัง ขนาดถังละ ๒๐๐ ลิตร เป็นต้น" },
      { name: "การกลั่นสุรา", content: "จำนวนน้ำสุราที่กลั่นได้ในวันนั้น โดยบันทึกปริมาณเป็นลิตร" },
      { name: "การบรรจุภาชนะ", content: "การจ่ายน้ำสุราที่ปรุงแต่งแรงแอลกอฮอล์สำเร็จแล้วไปบรรจุภาชนะเพื่อจำหน่ายโดยให้ระบุชื่อสุรา ขนาดบรรจุ และจำนวนที่บรรจุเป็นขวดแยกตามช่องแรงออลกอฮอล์" },
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
    this.ajax.doGet(`${URL.GET_DETAILS}/${this.buttons.oaAlcoholDtlId}`).subscribe((response: ResponseData<Ope04010606Vo[]>) => {
      if (MessageService.MSG.SUCCESS == response.status) {
        this.request.save = response.data;
        this.datas = this.forms.get('datas') as FormArray;
        if (response.data.length > 0) {
          this.datas.patchValue([]);
          for (let i = 0; i < response.data.length; i++) {
            this.datas.push(
              this.fb.group({
                oaAlcoholDistilId: [this.request.save[i].oaAlcoholDistilId],
                oaAlcoholId: [this.request.save[i].oaAlcoholId],
                seq: [this.request.save[i].seq],
                auditDate: [this.request.save[i].auditDate],
                distilDate: [this.request.save[i].distilDate],
                distilDegree: [this.df.format(this.request.save[i].distilDegree)],
                distilVolume: [this.df.format(this.request.save[i].distilVolume)],
                remark: [this.request.save[i].remark],
              })
            );
            setTimeout(() => {
              this.dateCalendar(i, new Date(this.request.save[i].auditDate), new Date(this.request.save[i].distilDate));
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
      this.request.save = this.forms.value.datas as Ope04010606Vo[];
      for (let i = 0; i < this.request.save.length; i++) {
        this.request.save[i].distilDegree = parseFloat(this.request.save[i].distilDegree.toString().replace(/,/g, ''));
        this.request.save[i].distilVolume = parseFloat(this.request.save[i].distilVolume.toString().replace(/,/g, ''));
      }
      this.ajax.doPut(`${URL.PUT_UPDATE}`, this.request).subscribe((response: ResponseData<RequestOpe04010606>) => {
        if (MessageService.MSG.SUCCESS == response.status) {
          this.request = response.data;
          this.datas.patchValue([]);
          for (let i = 0; i < this.request.save.length; i++) {
            this.request.save[i].distilDegree = this.df.format(this.request.save[i].distilDegree);
            this.request.save[i].distilVolume = this.df.format(this.request.save[i].distilVolume);
            this.datas.at(i).patchValue(this.request.save[i]);
            this.loading = true;
            setTimeout(() => {
              this.loading = false;
              this.dateCalendar(i, new Date(this.request.save[i].auditDate), new Date(this.request.save[i].distilDate));
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
      oaAlcoholDistilId: [null],
      oaAlcoholId: [this.buttons.oaAlcoholDtlId],
      seq: [null],
      auditDate: [new Date()],
      distilDate: [new Date()],
      distilDegree: [this.df.format(0)],
      distilVolume: [this.df.format(0)],
      remark: [''],
    }));
    this.request.save = this.datas.value as Ope04010606Vo[];
    setTimeout(() => {
      this.dateCalendar(this.datas.length - 1);
    }, 100);
  }

  dateCalendar(index: number, _date: Date = new Date(), _date2: Date = new Date()): void {
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
    $(`#calendar_${index}`).calendar({
      type: "date",
      initialDate: _date2,
      text: TextDateTH,
      formatter: formatter(),
      onChange: (date, text) => {
        this.datas = this.forms.get('datas') as FormArray;
        this.datas.at(index).get('distilDate').patchValue(date);
      }
    }).css('width', '100%');
    setTimeout(() => {
      $(`#calendar${index}`).calendar('set date', _date);
      $(`#calendar_${index}`).calendar('set date', _date2);
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

}

interface RequestOpe04010606 {
  save: Ope04010606Vo[];
  delete: number[];
}