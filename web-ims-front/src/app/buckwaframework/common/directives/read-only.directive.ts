import { Directive, ElementRef, Input } from '@angular/core';

/**
 * example -> read [flag] = "true or false"]
 */
@Directive({
    selector: '[read]',
})
export class ReadOnlyDirective {
    @Input() condition: boolean = true;
    constructor(private elementRef: ElementRef) { }

    // ngAfterViewInit(): void {
    //     console.log("condition: ", this.condition);
    //     this.disabledAndReadOnlyField(this.condition);
    // }

    ngOnInit(): void {
        console.log("condition: ", this.condition);
        this.disabledAndReadOnlyField(this.condition);
    }

    private disabledAndReadOnlyField(condition: boolean) {
        if (condition) {
            this.elementRef.nativeElement.readOnly = true;
            this.elementRef.nativeElement.className = 'custom-readonly';
            this.elementRef.nativeElement.style.pointerEvents = 'none'
        } else {
            this.elementRef.nativeElement.readOnly = false;
            this.elementRef.nativeElement.className.replace('custom-readonly', '');
            this.elementRef.nativeElement.style.pointerEvents = 'auto';
        }

    }
}