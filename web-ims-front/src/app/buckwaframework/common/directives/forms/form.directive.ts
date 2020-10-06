import { Directive, ElementRef } from '@angular/core';

@Directive({ selector: '[form]' })
export class FormDirective {
     constructor(private el: ElementRef) { }

     ngAfterViewInit() {
          this.el.nativeElement.className = this.el.nativeElement.className + " ui form ";
     }
}