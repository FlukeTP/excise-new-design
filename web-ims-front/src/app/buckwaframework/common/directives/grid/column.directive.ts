import { Directive, ElementRef, Input, SimpleChanges, SimpleChange } from '@angular/core';

@Directive({ selector: '[column]' })
export class ColumnDirective {
     @Input() column: number = 16;
     constructor(private el: ElementRef) { }

     ngAfterViewInit() {
          this.el.nativeElement.className = this.el.nativeElement.className + this.numberToString(this.column) + " wide column ";
     }

     ngOnChanges(changes: SimpleChange) {
          const change: any = changes;
          if(change.column && (change.column.currentValue != change.column.previousValue)) {
               let str: string = this.el.nativeElement.className;
               str = str.replace(this.numberToString(change.column.previousValue) + " wide column ", "");
               this.el.nativeElement.className = str + this.numberToString(this.column) + " wide column ";
          }
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