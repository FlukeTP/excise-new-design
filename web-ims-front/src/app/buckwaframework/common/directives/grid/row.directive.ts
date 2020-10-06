import { Directive, ElementRef, Input } from '@angular/core';

@Directive({ selector: '[row]' })
export class RowDirective {
     @Input() center: boolean = false;
     constructor(private el: ElementRef) { }

     ngAfterViewInit() {
          this.el.nativeElement.className = " row " + this.centerString(this.center);
     }

     private centerString(center: boolean): string {
          if (center) {
               return " centered ";
          } else {
               return " ";
          }
     }
}