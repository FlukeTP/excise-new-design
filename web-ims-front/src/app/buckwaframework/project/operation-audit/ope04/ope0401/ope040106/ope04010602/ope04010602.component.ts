import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { formatter, TextDateTH } from 'helpers/index';

declare var $: any;

@Component({
  selector: 'app-ope04010602',
  templateUrl: './ope04010602.component.html',
  styleUrls: ['./ope04010602.component.css']
})
export class Ope04010602Component implements OnInit {
  add: number;
  obj: ope;
  beans: Bean[];
  submitted: boolean = false;
  forms: FormGroup;
  details: FormArray = new FormArray([]);
  constructor(
    private fb: FormBuilder
    
  ) { 
    this.add = 0;
    this.obj = new ope();
    this.beans = [new Bean()];
  }

  ngOnInit() {
    $(".ui.dropdown").dropdown();
    $(".ui.dropdown.ai").css("width", "100%");
    this.initVariable();
    this.addDetail();
    this.calendar();
  }

  calendar() {
    $("#startCld").calendar({
      endCalendar: $('#endCld'),
      type: "date",
      text: TextDateTH,
      formatter: formatter(),
      onChange: (date, text) => {
        // this.searchForm.get('budgetYear').patchValue(text);
      }
    });

    $("#endCld").calendar({
      startCalendar: $('#startCld'),
      type: "date",
      text: TextDateTH,
      formatter: formatter(),
      onChange: (date, text) => {
        // this.searchForm.get('budgetYear').patchValue(text);
      }
    });
  }

  initVariable = () => {
    this.forms = this.fb.group({
      details: this.fb.array([])
    });
  }

  addDetail() {
    this.details = this.forms.get('details') as FormArray;
    this.details.push(this.fb.group({
      placeKeepHC: ['']
    }));
  }

  deleteDetail(index: number) {
    this.details = this.forms.get('details') as FormArray;
    this.details.removeAt(index);
  }

  //function check validator
  validateField(value: string) {
    return this.submitted && this.forms.get(value).errors;
  }

  handleSearch(event) {

  }

  onDelField = index => {
    this.beans.splice(index, 1);
  };

  onAddField = () => {
    this.beans.push(new Bean());
    this.add++;
    if (this.add >= 1) {

    }
  };

}

class Bean {

}

class ope {

}
