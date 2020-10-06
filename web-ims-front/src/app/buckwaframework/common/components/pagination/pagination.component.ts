/**
 * CREATED BY: KimJaeHa
 * DATE: 21 AUG 2018 16:13
 */
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

declare var $: any;
@Component({
  selector: 'pagination',
  template: `
    <div #paginate class="ui {{ class }} mini pagination menu">

        <a href="javascript:void(0)" *ngIf="active !== 1" (click)="first()" class="icon item{{ disabled ? ' disabled': ''}}">
         หน้าแรก
        </a>
        <a href="javascript:void(0)" *ngIf="active === 1" class="icon item disabled">
          หน้าแรก
        </a>


        <a href="javascript:void(0)" *ngIf="active !== 1" (click)="prev()" class="icon item{{ disabled ? ' disabled': ''}}">
            <i class="left chevron icon"></i>
        </a>
        <a href="javascript:void(0)" *ngIf="active === 1" class="icon item disabled">
            <i class="left chevron icon"></i>
        </a>


        <a href="javascript:void(0)" (click)="change(n.num)" class="{{ n.active ? 'active ' : '' }}item{{ disabled ? ' disabled': ''}}" *ngFor="let n of datas">{{n.num | decimalFormat:"###,###"}}</a>



        <a href="javascript:void(0)" (click)="next()" *ngIf="active !== pages" class="icon item{{ disabled ? ' disabled': ''}}">
            <i class="right chevron icon"></i>
        </a>
        <a href="javascript:void(0)" *ngIf="active === pages" class="icon item disabled">
            <i class="right chevron icon"></i>
        </a>

        <a href="javascript:void(0)" (click)="last()" *ngIf="active !== pages" class="icon item{{ disabled ? ' disabled': ''}}">
             หน้าสุดท้าย
        </a>
        <a href="javascript:void(0)" *ngIf="active === pages" class="icon item disabled">
            หน้าสุดท้าย
        </a>
    </div>
    `
})
export class PaginationComponent {
  // ViewChild
  @ViewChild('paginate') el: ElementRef;
  // Output
  @Output() length: EventEmitter<number> = new EventEmitter<number>();
  // Input
  @Input() active: number;
  @Input() step: number;
  @Input() pages: number;
  // Class
  @Input() class: string;
  @Input() disabled: boolean;

  datas: any[] = [];

  ngOnChanges() {
    const paging = { range: this.pages < 5 ? this.pages : 5, pages: this.pages };
    this.datas = this.doPaging(this.active, paging);
  }

  prev() { // Prev Value
    if (!this.disabled) {
      const { active, step } = this;
      const num = (active * step) - step;
      this.length.emit(num);
    }
  }

  change(n: number) { // Change Value
    if (!this.disabled) {
      const { step } = this;
      const num = (n * step);
      this.length.emit(num);
    }
  }

  next() { // Next Value
    if (!this.disabled) {

      const { active, step } = this;
      const num = parseInt((active * step).toString()) + parseInt(step.toString());
      console.log("active : ", typeof active)
      console.log("step : ", typeof (step + 100))
      console.log("num : ", num)
      this.length.emit(num);
    }
  }

  first() {
    if (!this.disabled) {
      const { step } = this;
      let active = 1
      const num = parseInt((0 * step).toString()) + parseInt(step.toString());
      this.length.emit(num)
    }
  }

  last() {
    if (!this.disabled) {
      const { pages, step } = this;
      this.active = pages;
      const num = parseInt((pages * step).toString());
      // + parseInt(step.toString());
      console.log("active : ", typeof this.active, this.active)
      console.log("step : ", typeof (step + 100))
      console.log("num : ", num)
      this.length.emit(num);
    }
  }

  doPaging(current, { range, pages, start = 1 }) {
    const paging = [];
    var i = Math.min(pages + start - range, Math.max(start, current - (range / 2 | 0)));
    const end = range - i < pages ? i + range : i + 1;
    while (i < end) {
      paging.push(
        i == current ?
          { num: i++, active: true, hidden: false } : { num: i++, active: false, hidden: false }
      )
    }
    return paging;
  }

}
