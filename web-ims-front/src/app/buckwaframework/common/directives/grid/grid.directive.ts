import { Directive, ElementRef, Input } from '@angular/core';

@Directive({ selector: '[grid]' })
export class GridDirective {
     @Input() center: boolean = false;
     @Input() col: number = 0;
     constructor(private el: ElementRef) { }

     ngAfterViewInit() {
          this.el.nativeElement.className = " ui grid " + this.centerString(this.center) + this.hasColumn(this.col);
     }

     private centerString(center: boolean): string {
          if (center) {
               return " centered ";
          } else {
               return " ";
          }
     }

     private hasColumn(value: number): string {
          if (value != 0) {
               return this.numberToString(value) + " wide column " + " nomargin ";
          } 
          return "";
     }

     private numberToString(value: number): string {
          switch (value) {
               case 1: return " one";
               case 2: return " two";
               case 3: return " three";
               case 4: return " four";
               case 5: return " five";
               case 6: return " six";
               case 7: return " seven";
               case 8: return " eight";
               case 9: return " nine";
               case 10: return " ten";
               case 11: return " eleven";
               case 12: return " twelve";
               case 13: return " thirteen";
               case 14: return " fourteen";
               case 15: return " fifteen";
               case 16: return " sixteen";
          }
     }
}