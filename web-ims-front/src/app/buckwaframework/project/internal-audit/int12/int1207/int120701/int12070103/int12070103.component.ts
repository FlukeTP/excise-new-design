import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'services/auth.service';
import { Router } from '@angular/router';
import { IaService } from 'services/ia.service';
import { MessageBarService } from 'services/message-bar.service';
import { Utils } from 'helpers/utils';
import { TextDateTH, formatter } from 'helpers/datepicker';
import { Int12070103Service } from './int12070103.service';

declare var $: any;
@Component({
  selector: 'app-int12070103',
  templateUrl: './int12070103.component.html',
  styleUrls: ['./int12070103.component.css'],
  providers: [Int12070103Service]
})
export class Int12070103Component implements OnInit, AfterViewInit {
  // tslint:disable: max-line-length

  // ===> params
  formControl: FormGroup;
  items: FormArray;
  loading = false;
  submitted = false;

  // valueRadio: any = {
  //   mateDescription1: 'ไม่เป็นข้าราชการประจำหรือลูกจ้างประจำ',
  //   mateDescription2: 'เป็นข้าราชการ',
  //   mateDescription3: 'ลูกจ้างประจำ',
  //   mateDescription4: 'เป็นพนักงานหรือลูกจ้างใน รัฐวิสาหกิจ/หน่วยงานของทางราชการ ราชการส่วนท้องถิ่น กรุงเทพมหานคร องค์กรอิสระ องค์กรมหาชน หรือหน่วยงานอื่นใด',

  //   status1: 'เป็นบิดาชอบด้วยกฎหมาย',
  //   statsu2: 'เป็นมารดา',

  //   type1: 'เงินบำรุงการศึกษา',
  //   type2: 'เงินค่าเล่าเรียน',

  //   typeRecive1: 'ตามสิทธิ',
  //   typeRecive2: 'เฉพาะส่วนที่ยังขาดจากสิทธิ เป็นเงิน',

  //   offerType1: 'ข้าพเจ้ามีสิทธิได้รับเงินช่วยเหลือตามพระราชกฤษฎีกาเงินสวัสดิการเกี่ยวกับการศึกษาของบุตรและข้อความที่ระบุข้างต้นเป็นความจริง',
  //   offerType2: 'บุตรของข้าพเจ้าอยู่ในข่ายได้รับการช่วยเหลือตามพระราชกฤษฎีกาเงินสวัสดิการเกี่ยวกับการศึกษาของบุตร',
  //   offerType3: 'เป็นผู้ใช้สิทธิเบิกเงินช่วยเหลือตามพระราชกฤษฎีกาเงินสวัสดิการเกี่ยวกับการศึกษาของบุตร แต่เพียงฝ่ายเดียว',
  //   offerType4: 'คู่สมรสของข้าพเจ้าได้รับการช่วยเหลือจากรัฐวิสาหกิจ หน่วยงานของทางราชการ ราชการท้องถิ่นกรุงเทพมหานครองค์กรอิสระ องค์การมหาชน หรือหน่วยงานอื่นใด ต่า กว่าจา นวนที่ได้รับจากทางราชการ'
  // };
  userDetails: any;
  money: any;
  countFrom = 0;
  loadingUL = false;
  flgOnLoad = true;
  tableUpload: any = [];
  page = 0;
  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private myService: Int12070103Service,
    private router: Router,
    private iaService: IaService,
    private msg: MessageBarService
  ) {
    this.newFormControl();
    this.items = this.formControl.get('items') as FormArray;
    // this.items.push(this.createChlidItem());
    // this.items.push(this.createChlidItem());

    // this.money = this.iaService.getData();
    // if (Utils.isNull(this.money)) { this.router.navigate(['/int06/11/3-1']); }
  }

  ngOnInit() {
    // console.log('money : ', this.money);
    // this.checkMoney(this.money);
    // this.authService.reRenderVersionProgram('INT-06113').then(res => {
    //   this.userDetails = res;
    //   this.formControl.controls.name.setValue(this.userDetails.fullName);
    //   this.formControl.controls.pition.setValue(this.userDetails.title);
    //   this.formControl.controls.belong.setValue(this.userDetails.position);
    // });

    // this.items.push(this.createChlidItem());
  }
  ngAfterViewInit() {
    this.calenda();
  }

  onChangeFile() {
    this.flgOnLoad = false;
  }
  onUpload(e) {
    e.preventDefault();
    if ($('#files').val() === '') {
      this.msg.errorModal('กรุณาเลือกไฟล์อัปโหลด');
    } else {
      this.myService.onUpload().then(data => {
        this.tableUpload = data;
      });
    }
  }

  onDel(index: number) {
    this.loadingUL = true;
    this.myService.onDel(index);
    setTimeout(() => {
      this.loadingUL = false;
    }, 300);
  }

  checkMoney(money) {
    this.countFrom = Utils.isNotNull(money.money1) ? this.countFrom += 1 : this.countFrom += 0;
    this.countFrom = Utils.isNotNull(money.money2) ? this.countFrom += 1 : this.countFrom += 0;
    this.countFrom = Utils.isNotNull(money.money3) ? this.countFrom += 1 : this.countFrom += 0;
    console.log('countFrom : ', this.countFrom);

    for (let i = 0; i < this.countFrom; i++) {
      this.items.push(this.createChlidItem());
    }
  }

  newFormControl = () => {
    this.formControl = this.formBuilder.group({
      // ==> 1
      name: ['', Validators.required],
      pition: ['', Validators.required],
      belong: ['', Validators.required],
      // ==> 2
      mate: [''],
      mateDescription: ['1'],
      pitionMate: [''],
      belongMate: [''],
      // ==> 3
      status: ['1'],
      // ==> 4
      type: ['1'],
      typeRecive: ['1'],
      typeReciveAmount: ['', Validators.required],
      offer: ['', Validators.required],
      offerType: ['1'],
      sumAmount: ['', Validators.required],

      items: this.formBuilder.array([])
    });
    // for (let i = 0; i <= 2; i++) {
    //   this.items = this.formControl.get('items') as FormArray;
    //   this.items.push(this.createChlidItem());
    // }
    this.items = this.formControl.get('items') as FormArray;
    this.items.push(this.createChlidItem());
  }

  addIndex() {
    this.items = this.formControl.get('items') as FormArray;
    this.items.push(this.createChlidItem());
  }

  removeIndex(index) {
    this.items = this.formControl.get('items') as FormArray;
    this.items.removeAt(index);
  }

  createChlidItem(): FormGroup {
    return this.formBuilder.group({
      name: ['', Validators.required],
      birth: [''],
      orderFather: ['', Validators.required],
      orderMather: ['', Validators.required],
      orderReplace: '',
      nameReplace: '',
      birthReplace: '',
      dateDeadReplace: '',
      education: ['', Validators.required],
      educationProvince: ['', Validators.required],
      educationDistrict: ['', Validators.required],
      educationClass: ['', Validators.required],
      amount: ['', Validators.required],
      type: [, Validators.required]
    });
  }

  get f() {
    return this.formControl.controls;
  }

  formArrayValid(index, control) {
    return this.submitted && this.items.at(index).get(control).invalid;
  }



  save(event: any) {
    event.preventDefault();
    console.log(this.formControl.value);
    return;
    this.submitted = true;
    if (this.formControl.invalid) {
      return;
    }

    this.msg.comfirm(confirm => {
      if (confirm) {
        const birth = $('.birth input');
        const birthReplace = $('.birthReplace input');
        const dateDeadReplace = $('.dateDeadReplace input');

        for (let i = 0; i < birth.length; i++) {

          const _birth = $(birth[i]).val();
          this.items.value[i].birth = _birth;

          const _birthReplace = $(birthReplace[i]).val();
          this.items.value[i].birthReplace = _birthReplace;

          const _dateDeadReplace = $(dateDeadReplace[i]).val();
          this.items.value[i].dateDeadReplace = _dateDeadReplace;
        }

        this.loading = true;
        // this.checkMateDescription(this.formControl.controls.mateDescription.value);
        // this.checkStatus(this.formControl.controls.status.value);
        // this.checkType(this.formControl.controls.type.value);
        // this.checkTypeRecive(this.formControl.controls.typeRecive.value);
        // this.checkOfferType(this.formControl.controls.offerType.value);


        this.myService.save(this.formControl.value).then(res => {
          this.myService.saveFile(res);
          this.loading = false;
          this.router.navigate(['/int06/11']);
        }).catch(rej => {
          this.router.navigate(['/int06/11']);
        });
      }
    }, 'ยืนยันการบันทึกข้อมูล');


  }

  // checkMateDescription(checkMateDescription) {
  //   if (checkMateDescription == 1) {
  //     this.formControl.controls.mateDescription.setValue(this.valueRadio.mateDescription1);
  //     return;
  //   }
  //   if (checkMateDescription == 2) {
  //     this.formControl.controls.mateDescription.setValue(this.valueRadio.mateDescription2);
  //     return;
  //   }
  //   if (checkMateDescription == 3) {
  //     this.formControl.controls.mateDescription.setValue(this.valueRadio.mateDescription3);
  //     return;
  //   }
  //   if (checkMateDescription == 4) {
  //     this.formControl.controls.mateDescription.setValue(this.valueRadio.mateDescription4);
  //     return;
  //   }
  // }
  // checkStatus(statsu) {
  //   if (statsu == 1) {
  //     this.formControl.controls.status.setValue(this.valueRadio.status1);
  //     return;
  //   }
  //   if (statsu == 2) {
  //     this.formControl.controls.status.setValue(this.valueRadio.status2);
  //     return;
  //   }
  // }

  // checkType(type) {
  //   if (type == 1) {
  //     this.formControl.controls.type.setValue(this.valueRadio.type1);
  //     return;
  //   }
  //   if (type == 2) {
  //     this.formControl.controls.type.setValue(this.valueRadio.type2);
  //     return;
  //   }
  // }
  // checkTypeRecive(typeRecive) {
  //   if (typeRecive == 1) {
  //     this.formControl.controls.typeRecive.setValue(this.valueRadio.typeRecive1);
  //     return;
  //   }
  //   if (typeRecive == 2) {
  //     this.formControl.controls.typeRecive.setValue(this.valueRadio.typeRecive2);
  //     return;
  //   }
  // }

  // checkOfferType(offerType) {
  //   if (offerType == 1) {
  //     this.formControl.controls.offerType.setValue(this.valueRadio.offerType1);
  //     return;
  //   }
  //   if (offerType == 2) {
  //     this.formControl.controls.typeRecive.setValue(this.valueRadio.offerType2);
  //     return;
  //   }
  //   if (offerType == 3) {
  //     this.formControl.controls.typeRecive.setValue(this.valueRadio.offerType3);
  //     return;
  //   }
  //   if (offerType == 4) {
  //     this.formControl.controls.typeRecive.setValue(this.valueRadio.offerType4);
  //     return;
  //   }
  // }

  calenda = () => {
    $('.birth').calendar({
      maxDate: new Date(),
      type: 'date',
      text: TextDateTH,
      formatter: formatter(),
      onChange: (date, text) => {
        //  this.dateChange();
      }
    });

    $('.birthReplace').calendar({
      maxDate: new Date(),
      type: 'date',
      text: TextDateTH,
      formatter: formatter(),
      onChange: (date, text) => {
        // this.dateChange();
      }
    });

    $('.dateDeadReplace').calendar({
      maxDate: new Date(),
      type: 'date',
      text: TextDateTH,
      formatter: formatter(),
      onChange: (date, text) => {
        // this.dateChange();
      }
    });
  }
}
