import { Directive, ElementRef, OnInit, AfterViewInit, Input } from '@angular/core';

declare var $;
@Directive({
  selector: '[appNumberInputFormat]'
})
export class NumberInputFormatDirective implements OnInit, AfterViewInit {

  /*  --> Function to convert decimal format to number ex. 7,789.78 to 7789.78 <-- */
  // convertToNumber(strNumber: any) {
  //   if (!strNumber) {
  //     return strNumber
  //   }
  //   return Number(strNumber.toString().replace(/\,/g, ''))
  // }

  // number of digit decimalnumber
  @Input() numberDecimal: number;

  constructor(private el: ElementRef) { }

  ngOnInit(): void {
    // set 2 to default digit decimal
    if (!this.numberDecimal || this.numberDecimal < 0) {
      this.numberDecimal = 2;
    }
  }

  ngAfterViewInit(): void {
    $(this.el.nativeElement).number(true, this.numberDecimal);
  }
}
