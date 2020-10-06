import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({ selector: '[numberOnly]' })
export class NumberDirective {

    @Input() dash: boolean = false;

    constructor(private el: ElementRef) {
        // console.log('numberOnly');
    }

    @HostListener("keypress", ['$event'])
    onkeypress(e) {
        let theEvent = e || window.event;
        let key;
        // Handle paste
        if (theEvent.type === 'paste') {
            key = theEvent.clipboardData.getData('text/plain');
        } else {
            // Handle key press
            key = theEvent.keyCode || theEvent.which;
            key = String.fromCharCode(key);
        }
        // if has dot (.) to prevent double dot example (..)
        let regexDot = /\./;
        if (regexDot.test(key)) {
            if (this.el.nativeElement.value) {
                if (this.el.nativeElement.value.search(/\./g) != -1) {
                    theEvent.returnValue = false;
                    if (theEvent.preventDefault) theEvent.preventDefault();
                }
            } else {
                theEvent.returnValue = false;
                if (theEvent.preventDefault) theEvent.preventDefault();
            }
        }
        let regexDash = /[-]/;
        if (regexDash.test(key)) {
            if (this.el.nativeElement.value) {
                theEvent.returnValue = false;
                if (theEvent.preventDefault) theEvent.preventDefault();
            }
        }
        let regex = /[0-9-]|\./;
        if (!regex.test(key)) {
            theEvent.returnValue = false;
            if (theEvent.preventDefault) theEvent.preventDefault();
        }
    }

}