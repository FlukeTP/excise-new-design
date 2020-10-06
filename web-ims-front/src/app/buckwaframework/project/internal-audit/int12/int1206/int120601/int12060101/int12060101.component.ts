import { Component, OnInit } from '@angular/core';
import { BreadCrumb } from 'models/breadcrumb.model';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { MessageBarService } from 'services/message-bar.service';
import { AuthService } from 'services/auth.service';
import { AjaxService } from 'services/ajax.service';
import { DialogService } from 'services/dialog.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TextDateTH, formatter, stringToDate } from 'helpers/datepicker';
import { Person, List, Int06101 } from './int12060101.model';
import * as moment from 'moment';

declare var $: any;

const ALERT_MSG = {
  refnum: "กรุณากรอกเลขที่เอกสารอ้างอิง",
  withdrawal: "กรุณากรอกวันที่ขอเบิก",
  activity: "กรุณากรอกกิจกรรม",
  budged: "กรุณากรอกงบ",
  category: "กรุณากรอกหมวดย่อย",
  budget: "กรุณากรอกประเภทงบประมาณ",
  amountOfMoney: "กรุณากรอกจำนวนเงินขอเบิก",
  pmmethodPersonType: "กรุณากรอกวิธีการจ่ายเงิน",
  refpersonType: "กรุณากรอกเลขอ้างอิงการจ่ายเงิน",
  persons: {
    pmmethod: "กรุณากรอกวิธีการจ่าย",
    datePersons: "กรุณากรอกวันที่สั่งจ่าย",
    amountPaid: "กรุณากรอกจำนวนเงินที่จ่าย",
    payee: "กรุณากรอกผู้รับเงิน",
  }
}

const URL = {
  GET_LIST: "ia/int06101/withdraw/list",
  GET_PERSON: "ia/int06101/withdraw/person"
}

@Component({
  selector: 'app-int12060101',
  templateUrl: './int12060101.component.html',
  styleUrls: ['./int12060101.component.css']
})
export class Int12060101Component implements OnInit {
  checkRadio1: boolean = false;
  checkRadio2: boolean = false;
  id: string = "";
  breadcrumb: BreadCrumb[];

  // Dropdown Arrays
  list: any[] = [];
  budged: any[] = [];
  category: any[] = [];
  bankList: any[] = [];
  titleList: any[] = [];
  persontitleList: any[] = [];
  budgetList: any[] = [];
  pmmethodList: any[] = [];
  activityList: any[] = [];
  pmmethodPersonTypeList: any[] = [];

  // Forms
  formGroup: FormGroup = new FormGroup({});
  persons: FormArray = new FormArray([]);
  delete: number[] = [];

  // State
  private submitted: boolean = false;
  private unsave: boolean = true;
  private loading: boolean = false;

  constructor(
    private messageBarService: MessageBarService,
    private authService: AuthService,
    private ajax: AjaxService,
    private formBuilder: FormBuilder,
    private dialog: DialogService,
    private router: Router,
    private route: ActivatedRoute
  ) {

    // Initial Breadcrumb
    this.breadcrumb = [
      { label: "ตรวจสอบภายใน", route: "#" },
      { label: "บันทึกข้อมูล", route: "#" },
      { label: "ข้อมูลเบิกจ่าย", route: "#" },
      { label: "เพิ่มข้อมูลเบิกจ่าย", route: "#" },
    ];

    // Initial FormGroup
    this.formGroup = this.formBuilder.group({
      note: ['', [Validators.maxLength(1000)]],
      deductSocial: ['', [Validators.maxLength(7)]],
      withholding: ['', [Validators.maxLength(7)]],
      other: ['', [Validators.maxLength(7)]],
      amountOfMoney1: ['', [Validators.maxLength(7)]],
      numberRequested: ['', [Validators.maxLength(100)]],
      documentNumber: ['', [Validators.maxLength(100)]],
      itemDescription: ['', [Validators.maxLength(1000)]],
      list: ['', [Validators.required, Validators.maxLength(7)]],
      refnum: ['', [Validators.required, Validators.maxLength(100)]],
      withdrawal: ['', [Validators.required, Validators.maxLength(10)]],
      activity: ['', [Validators.required, Validators.maxLength(500)]],
      budged: ['', [Validators.required, Validators.maxLength(20)]],
      category: ['', [Validators.required, Validators.maxLength(100)]],
      budget: ['', [Validators.required, Validators.maxLength(200)]],
      amountOfMoney: ['', [Validators.required, Validators.maxLength(7)]],
      personType: ['', [Validators.required, Validators.maxLength(50)]],
      persontitle: ['', [Validators.required, Validators.maxLength(40)]],
      firstnamePerson: ['', [Validators.required, Validators.maxLength(80)]],
      lastnamePerson: ['', [Validators.required, Validators.maxLength(80)]],
      payeeCorporate: ['', [Validators.required, Validators.maxLength(100)]],

      persons: this.formBuilder.array([])
    });

    // Add Person Form to `persons` FormArray
    this.addPerson();

    // Before Leave this page will ask
    window.addEventListener("beforeunload", (e) => {
      const confirmationMessage = "\o/";
      if (this.unsave) {
        (e || window.event).returnValue = confirmationMessage;
        return confirmationMessage;
      }
    });
  }

  ngOnInit() {
    // Get Id on url parameter
    this.id = this.route.snapshot.queryParams['id'] || "";
    if (this.id != "") {
      this.loading = true;
      this.getList().then((data: List) => {
        const {
          note, deductSocial, withholding, other, amountOfMoney1,
          numberRequested, documentNumber, itemDescription, list, refnum,
          withdrawal, activity, budged, category, budget, amountOfMoney,
          personType, persontitle, firstnamePerson, lastnamePerson,
          payeeCorporate
        } = this.formGroup.controls;
        note.setValue(data.note);
        deductSocial.setValue(data.socialSecurity);
        withholding.setValue(data.withholdingTax);
        other.setValue(data.anotherAmount);
        amountOfMoney1.setValue(data.receivedAmount);
        numberRequested.setValue(data.withdrawalDocNum);
        documentNumber.setValue(data.paymentDocNum);
        itemDescription.setValue(data.itemDesc);
        refnum.setValue(data.refNum);

        withdrawal.setValue(moment(data.withdrawalDate).format('DD/MM/YYYY')); // Calendar
        $('#dateWithdraw').calendar('set date', data.withdrawalDate); // Calendar

        activity.setValue(data.activities); // Dropdown

        budged.setValue(data.budgetId); // Dropdown
        this.budgedOnchange({ target: { value: data.budgetId } }); // Dropdown

        category.setValue(data.categoryId); // Dropdown
        this.categoryOnchange({ target: { value: data.categoryId } }); // Dropdown

        list.setValue(data.listId); // Dropdown
        budget.setValue(data.budgetType); // Dropdown
        amountOfMoney.setValue(data.withdrawalAmount);

        personType.setValue(data.personType); // RadioButton
        if (data.personType == "บุคคลธรรมดา") {
          this.radioChange('one');
          persontitle.setValue(data.payee.split(' ')[0]);
          firstnamePerson.setValue(data.payee.split(' ')[1]);
          lastnamePerson.setValue(data.payee.split(' ')[2]);
        } else {
          this.radioChange('two');
          payeeCorporate.setValue(data.payee);
        }

        // Loading person
        this.getPerson().then((persons: Person[]) => {
          // console.log("onEdit::EDIT =>", persons, persons.length); 
          this.persons = this.formGroup.get('persons') as FormArray;
          this.persons.removeAt(0);
          for (let key in persons) {
            this.persons.push(this.createPerson({
              id: [persons[key].withdrawalPersonsId],
              amount: [persons[key].amount, [Validators.required, Validators.maxLength(7)]],
              title: [persons[key].payee.split(" ")[0], [Validators.required, Validators.maxLength(40)]],
              payeeFirst: [persons[key].payee.split(" ")[1], [Validators.required, Validators.maxLength(80)]],
              payeeLast: [persons[key].payee.split(" ")[2], [Validators.required, Validators.maxLength(80)]],
              paymentDate: [moment(persons[key].paymentDate).format("DD/MM/YYYY"), [Validators.required, Validators.maxLength(10)]],
              paymentMethod: [persons[key].paymentMethod, [Validators.required, Validators.maxLength(200)]],
              refPayment: [persons[key].refPayment, [Validators.required, Validators.maxLength(50)]],
              bankName: [persons[key].bankName, [Validators.maxLength(200)]]
            }));
          }
          this.loading = false;
        }).catch(() => {
          this.messageBarService.errorModal();
          console.error("PERSONS ไม่สามารถโหลดได้...");
          this.loading = false;
        });

      }).catch(() => {
        this.messageBarService.errorModal();
        this.loading = false;
        console.error("LIST ไม่สามารถโหลดได้...");
      });
    }

    // Initial Calendar
    $("#dateWithdraw").calendar({
      maxDate: new Date(),
      type: "date",
      text: TextDateTH,
      formatter: formatter(),
      onChange: (date, text) => {
        this.formGroup.get('withdrawal').patchValue(text);
      }
    });
    // Initial Dropdowns
    $(".ui.dropdown.ai").dropdown().css('width', '100%');

    // Dropdowns
    this.callAllDropdown();

    // Page Version
    this.authService.reRenderVersionProgram('INT-06101');

  }

  // Before Leave this page will ask
  canDeactivate(): Observable<boolean> | boolean {
    if (this.unsave) {
      let confirm: any = this.dialog.confirm("ต้องการออกจากที่นี่หรือไม่?");
      if (confirm.value) {
        console.log("Exited...");
      }
      return confirm;
    }
    return true;
  }

  // Initial Form `Person`
  createPerson(obj?): FormGroup {
    const data = obj || {
      id: [''],
      amount: ['', [Validators.required, Validators.maxLength(7)]],
      title: ['', [Validators.required, Validators.maxLength(40)]],
      payeeFirst: ['', [Validators.required, Validators.maxLength(80)]],
      payeeLast: ['', [Validators.required, Validators.maxLength(80)]],
      paymentDate: ['', [Validators.required, Validators.maxLength(10)]],
      paymentMethod: ['', [Validators.required, Validators.maxLength(200)]],
      refPayment: ['', [Validators.required, Validators.maxLength(50)]],
      bankName: ['', [Validators.maxLength(200)]]
    }
    return this.formBuilder.group(data);
  }

  // Add Form to FormArray
  addPerson(): void {
    const index = this.persons.length;
    this.persons = this.formGroup.get('persons') as FormArray;
    this.persons.push(this.createPerson());
    setTimeout(() => {
      $(".ui.dropdown.ai").dropdown().css('width', '100%');
      $("#datePersons" + index).calendar({
        maxDate: new Date(),
        type: "date",
        text: TextDateTH,
        formatter: formatter(),
        onChange: (date, text) => {
          this.persons.at(index).get('paymentDate').patchValue(text);
        }
      });
    }, 50);
  }

  // Remove Form from FormArray
  delPerson(index: number): void {
    this.persons = this.formGroup.get('persons') as FormArray;
    if (this.id != "" && this.persons.at(index).get('id').value != "") {
      this.messageBarService.comfirm(e => {
        if (e) {
          this.delete.push(parseInt(this.persons.at(index).get('id').value));
          this.persons.removeAt(index);
        }
      }, "ต้องการเปลี่ยนแปลงข้อมูล ?");
    } else {
      this.persons.removeAt(index);
    }
  }

  // Submit Form
  saveData() {

    // Is submitted
    this.submitted = true;

    // Check Validators 1st and Alert MESSAGE from constant `ALERT_MSG`
    for (let j in ALERT_MSG) {
      for (let i in this.formGroup.controls) {
        if (i == j) {
          if (i == "persons" && this.persons.invalid) {
            for (let h in ALERT_MSG.persons) {
              for (let g in this.persons) {
                if (h == g && this.persons.get(g).invalid) {
                  this.messageBarService.alert(ALERT_MSG[j], "แจ้งเตือน");
                  return;
                }
              }
            }
          } else if (this.formGroup.get(i).invalid) {
            this.messageBarService.alert(ALERT_MSG[j], "แจ้งเตือน");
            return;
          }
        }
        if (this.formGroup.get(i).invalid) {
          console.log(i);
        }
      }
    }

    // Check Validators 2nd
    if (this.formGroup.valid) {
      this.loading = true;
      const URL = "ia/int06101/add";
      const { list, note, deductSocial, withholding, // destruct data from `this.formGroup`
        other, amountOfMoney1, numberRequested, documentNumber,
        itemDescription, refnum, withdrawal, activity,
        budged, category, budget, amountOfMoney, payee,
        persontitle, firstnamePerson, lastnamePerson,
        personType, persons, payeeCorporate } = this.formGroup.value;
      let _persons: Person[] = []; // Person Array
      for (let key in persons) {
        const { amount, paymentMethod, refPayment, paymentDate,
          title, payeeFirst, payeeLast, bankName } = persons[key];
        _persons.push({
          amount: parseFloat(amount),
          paymentMethod: paymentMethod,
          refPayment: refPayment,
          paymentDate: stringToDate(paymentDate),
          payee: `${title} ${payeeFirst} ${payeeLast}`,
          bankName: bankName,
        })
      }
      const payeeCorporat = this.formGroup.get('payeeCorporate');
      const persontitl = this.formGroup.get('persontitle');
      const firstnamePerso = this.formGroup.get('firstnamePerson');
      const lastnamePerso = this.formGroup.get('lastnamePerson');
      if (this.checkRadio1) { // clear validate payeeCorporate
        payeeCorporat.clearValidators(); payeeCorporat.updateValueAndValidity();
        persontitl.setValidators([Validators.required, Validators.maxLength(40)]); persontitl.updateValueAndValidity();
        firstnamePerso.setValidators([Validators.required, Validators.maxLength(80)]); firstnamePerso.updateValueAndValidity();
        lastnamePerso.setValidators([Validators.required, Validators.maxLength(80)]); lastnamePerso.updateValueAndValidity();
      } else if (this.checkRadio2) { // clear validate persontitle, firstnamePerson, lastnamePerson
        this.checkRadio2 = true;
        payeeCorporat.setValidators([Validators.required, Validators.maxLength(100)]); payeeCorporat.updateValueAndValidity();
        persontitl.clearValidators(); persontitl.updateValueAndValidity();
        firstnamePerso.clearValidators(); firstnamePerso.updateValueAndValidity();
        lastnamePerso.clearValidators(); lastnamePerso.updateValueAndValidity();
      }
      const data: Int06101 = { // Binding Data
        refnum: refnum, withdrawal: withdrawal, activity: activity,
        budged: budged, budget: budget, category: category,
        list: list, amountOfMoney: amountOfMoney, deductSocial: deductSocial,
        withholding: withholding, other: other, amountOfMoney1: amountOfMoney1,
        numberRequested: numberRequested, documentNumber: documentNumber,
        itemDescription: itemDescription, note: note,
        budgetName: this.budged.find(obj => obj.budgetId == budged).budgetName,
        listName: this.list.find(obj => obj.listId == list).listName,
        categoryName: this.category.find(obj => obj.categoryId == category).categoryName,
        payee: this.checkRadio1 ? `${persontitle} ${firstnamePerson} ${lastnamePerson}` : payeeCorporate,
        persons: _persons, personType: personType,
      };
      this.ajax.post(URL, data, res => {
        const msg = res.json();
        if (msg.messageType == "C") {
          this.messageBarService.successModal(msg.messageTh);
          this.unsave = false;
          this.router.navigate(['/int12/06/01']);
          this.loading = false;
        } else {
          this.messageBarService.errorModal(msg.messageTh);
          this.loading = false;
        }
      }).catch(() => {
        this.loading = false;
      });
    }
  }

  // Update List and Persons
  updateData() {
    // Is submitted
    this.submitted = true;

    // Check Validators 1st and Alert MESSAGE from constant `ALERT_MSG`
    for (let j in ALERT_MSG) {
      for (let i in this.formGroup.controls) {
        if (i == j) {
          if (i == "persons" && this.persons.invalid) {
            for (let h in ALERT_MSG.persons) {
              for (let g in this.persons) {
                if (h == g && this.persons.get(g).invalid) {
                  this.messageBarService.alert(ALERT_MSG[j], "แจ้งเตือน");
                  return;
                }
              }
            }
          } else if (this.formGroup.get(i).invalid) {
            this.messageBarService.alert(ALERT_MSG[j], "แจ้งเตือน");
            return;
          }
        }
        if (this.formGroup.get(i).invalid) {
          console.log(i);
        }
      }
    }
    // Check Validators 2nd
    if (this.formGroup.valid) {
      this.loading = true;
      const URL = "ia/int06101/update";
      const { list, note, deductSocial, withholding, // destruct data from `this.formGroup`
        other, amountOfMoney1, numberRequested, documentNumber,
        itemDescription, refnum, withdrawal, activity,
        budged, category, budget, amountOfMoney, payee,
        persontitle, firstnamePerson, lastnamePerson,
        personType, persons, payeeCorporate } = this.formGroup.value;
      let _persons: Person[] = []; // Person Array
      for (let key in persons) {
        const { amount, paymentMethod, refPayment, paymentDate,
          title, payeeFirst, payeeLast, bankName } = persons[key];
        _persons.push({
          amount: parseFloat(amount),
          paymentMethod: paymentMethod,
          refPayment: refPayment,
          paymentDate: stringToDate(paymentDate),
          payee: `${title} ${payeeFirst} ${payeeLast}`,
          bankName: bankName,
        })
      }
      const payeeCorporat = this.formGroup.get('payeeCorporate');
      const persontitl = this.formGroup.get('persontitle');
      const firstnamePerso = this.formGroup.get('firstnamePerson');
      const lastnamePerso = this.formGroup.get('lastnamePerson');
      if (this.checkRadio1) { // clear validate payeeCorporate
        payeeCorporat.clearValidators(); payeeCorporat.updateValueAndValidity();
        persontitl.setValidators([Validators.required, Validators.maxLength(40)]); persontitl.updateValueAndValidity();
        firstnamePerso.setValidators([Validators.required, Validators.maxLength(80)]); firstnamePerso.updateValueAndValidity();
        lastnamePerso.setValidators([Validators.required, Validators.maxLength(80)]); lastnamePerso.updateValueAndValidity();
      } else if (this.checkRadio2) { // clear validate persontitle, firstnamePerson, lastnamePerson
        this.checkRadio2 = true;
        payeeCorporat.setValidators([Validators.required, Validators.maxLength(100)]); payeeCorporat.updateValueAndValidity();
        persontitl.clearValidators(); persontitl.updateValueAndValidity();
        firstnamePerso.clearValidators(); firstnamePerso.updateValueAndValidity();
        lastnamePerso.clearValidators(); lastnamePerso.updateValueAndValidity();
      }
      const data: Int06101 = { // Binding Data
        refnum: refnum, withdrawal: withdrawal, activity: activity,
        budged: budged, budget: budget, category: category,
        list: list, amountOfMoney: amountOfMoney, deductSocial: deductSocial,
        withholding: withholding, other: other, amountOfMoney1: amountOfMoney1,
        numberRequested: numberRequested, documentNumber: documentNumber,
        itemDescription: itemDescription, note: note,
        budgetName: this.budged.find(obj => obj.budgetId == budged).budgetName,
        listName: this.list.find(obj => obj.listId == list).listName,
        categoryName: this.category.find(obj => obj.categoryId == category).categoryName,
        payee: this.checkRadio1 ? `${persontitle} ${firstnamePerson} ${lastnamePerson}` : payeeCorporate,
        persons: _persons, personType: personType,
      };
      const request = {
        data: data,
        delete: this.delete
      };
      this.ajax.post(`${URL}/${this.id}`, request, response => {
        const msg = response.json();
        if (msg.messageType == "C") {
          this.messageBarService.successModal(msg.messageTh);
          this.unsave = false;
          this.router.navigate(['/int12/06/01']);
          this.loading = false;
        } else {
          this.messageBarService.errorModal(msg.messageTh);
          this.loading = false;
        }
      }).catch(() => {
        this.messageBarService.errorModal();
        this.loading = false;
      });
    }
  }

  getList(): Promise<List> {
    return this.ajax.get(`${URL.GET_LIST}/${this.id}`, response => {
      const data = response.json() as List;
      // console.log("LIST =>", data);
      return data;
    });
  }

  getPerson(): Promise<Person[]> {
    return this.ajax.get(`${URL.GET_PERSON}/${this.id}`, response => {
      const data = response.json() as Person[];
      // console.log("PERSONS =>", data);
      return data;
    });
  }

  // Call All Ajax Dropdown
  callAllDropdown = () => {
    this.budgeDropdown();
    this.pmmethod();
    this.activity();
    this.budge();
    this.title();
    this.bank();
    this.persontitle();
    this.pmmethodPersonType();
  }

  radioChange(flag: string) {
    this.checkRadio1 = false;
    this.checkRadio2 = false;
    const payeeCorp = this.formGroup.get('payeeCorporate');
    const persontitle = this.formGroup.get('persontitle');
    const firstnamePerson = this.formGroup.get('firstnamePerson');
    const lastnamePerson = this.formGroup.get('lastnamePerson');
    if (flag === 'one') {
      this.checkRadio1 = true;
      payeeCorp.clearValidators(); payeeCorp.updateValueAndValidity();
      persontitle.setValidators([Validators.required, Validators.maxLength(40)]); persontitle.updateValueAndValidity();
      firstnamePerson.setValidators([Validators.required, Validators.maxLength(80)]); firstnamePerson.updateValueAndValidity();
      lastnamePerson.setValidators([Validators.required, Validators.maxLength(80)]); lastnamePerson.updateValueAndValidity();
    } else {
      this.checkRadio2 = true;
      payeeCorp.setValidators([Validators.required, Validators.maxLength(100)]); payeeCorp.updateValueAndValidity();
      persontitle.clearValidators(); persontitle.updateValueAndValidity();
      firstnamePerson.clearValidators(); firstnamePerson.updateValueAndValidity();
      lastnamePerson.clearValidators(); lastnamePerson.updateValueAndValidity();
    }
    this.formGroup.updateValueAndValidity();
  }

  // Ajax Dropdown
  pmmethod = () => {
    let url = "ia/int06101/pmmethod"
    this.ajax.post(url, {}, res => {
      this.pmmethodList = res.json();
    })
  }

  // Ajax Dropdown
  pmmethodPersonType = () => {
    let url = "ia/int06101/pmmethodPersonType"
    this.ajax.post(url, {}, res => {
      this.pmmethodPersonTypeList = res.json();
    })
  }

  // Ajax Dropdown
  activity = () => {
    let url = "ia/int06101/activity"
    this.ajax.post(url, {}, res => {
      this.activityList = res.json();
    })
  }

  // Ajax Dropdown
  budge = () => {
    let url = "ia/int06101/budge"
    this.ajax.post(url, {}, res => {
      this.budgetList = res.json();
    })
  }

  // Ajax Dropdown
  title = () => {
    let url = "ia/int06101/title"
    this.ajax.post(url, {}, res => {
      this.titleList = res.json();
    })
  }

  // Ajax Dropdown
  persontitle = () => {
    let url = "ia/int06101/persontitle"
    this.ajax.post(url, {}, res => {
      this.persontitleList = res.json();
    })
  }

  // Ajax Dropdown
  bank = () => {
    let url = "ia/int06101/bank"
    this.ajax.post(url, {}, res => {
      this.bankList = res.json();
    })
  }

  // Ajax Dropdown
  budgeDropdown = () => {
    const URL = "ia/int06101/budged";
    this.ajax.post(URL, {}, res => {
      this.budged = res.json();
    });
  }

  // Ajax Dropdown
  budgedOnchange = (e) => {
    $("#category").dropdown('restore defaults');
    const URL = "ia/int06101/category";
    let params = e.target.value;
    if (params != "") {
      this.ajax.post(URL, { budgetId: params }, res => {
        this.category = res.json();
      });
    }
  }

  // Ajax Dropdown
  categoryOnchange = (e) => {
    $("#list").dropdown('restore defaults');
    const URL = "ia/int06101/list";
    let params = e.target.value;
    if (params != "") {
      this.ajax.post(URL, { categoryId: params }, res => {
        this.list = res.json();
      });
    }
  }

  // State Checking
  invalidFormGroup(control) { return this.submitted && this.formGroup.get(control) && this.formGroup.get(control).invalid }
  invalidFormArray(index, control) { return this.submitted && this.persons.at(index).get(control).invalid }

}

interface Request {
  data: Int06101;
  delete: number[];
}
