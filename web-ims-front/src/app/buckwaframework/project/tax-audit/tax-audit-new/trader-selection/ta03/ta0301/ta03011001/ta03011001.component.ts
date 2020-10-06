import { Component, OnInit } from '@angular/core';
import { TextDateTH, formatter } from 'helpers/datepicker';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { AjaxService } from 'services/ajax.service';

declare var $: any;
@Component({
  selector: 'app-ta03011001',
  templateUrl: './ta03011001.component.html',
  styleUrls: ['./ta03011001.component.css']
})
export class Ta03011001Component implements OnInit {

  taFormTS01101Group: FormGroup;
  taFormTS01101List: FormArray;

  constructor(
    private fb: FormBuilder
  ) { }

  // ============ Initial setting ==================
  ngOnInit() {
    this.setTaFormTS01101Group();
  }

  setTaFormTS01101Group() {
    this.taFormTS01101Group = this.fb.group({
      taFormTS01101List: this.fb.array([this.createTaFormTS01101List()])
    })
  }

  // ============= Action ==================
  createTaFormTS01101List(): FormGroup {
    return this.fb.group({
      testimonyPageNo: ["", Validators.required],
      testimonyOf: ["", Validators.required],
      testimonyText: ["", Validators.required]
    })
  }

  addTaFormTS01101List(): void {
    this.taFormTS01101List = this.taFormTS01101Group.get('taFormTS01101List') as FormArray;
    this.taFormTS01101List.push(this.createTaFormTS01101List());
  }

  removeTaFormTS01101List(index: number): void {
    this.taFormTS01101List = this.taFormTS01101Group.get('taFormTS01101List') as FormArray;
    this.taFormTS01101List.removeAt(index);
  }

}
