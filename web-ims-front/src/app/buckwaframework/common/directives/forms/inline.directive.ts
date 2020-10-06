import { Directive, ElementRef, Input } from '@angular/core';

@Directive({ selector: '[inline]' })
export class InlineDirective {
     @Input() fields: boolean = true;
     @Input() center: boolean = false;
     constructor(private el: ElementRef) { }

     ngAfterViewInit() {
          this.el.nativeElement.className = this.checkField(this.fields) + this.centerString(this.center);
     }

     private checkField(fields: boolean): string {
          if (fields) {
               return " inline fields ";
          } else {
               return " inline field ";
          }
     }

     private centerString(center: boolean): string {
          if (center) {
               return " center-all ";
          } else {
               return " ";
          }
     }
}