import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { DecimalFormat } from 'helpers/index';
import { NFDirective } from 'models/index';

@Directive({ selector: '[format]' })
export class NumberFormatDirective {
    @Input("format") format: NFDirective = {
        form: null,
        control: null,
        format: "###,###.00"
    };
    constructor(private el: ElementRef) {
        // TODO Constructor
    }

    @HostListener("blur", ['$event'])
    onblur(e) {
        const controls = this.format.form.controls;
        const df = new DecimalFormat('###,###.00');
        if (controls[this.format.control].value) {
            controls[this.format.control].patchValue(df.format(Math.round(controls[this.format.control].value*100)/100));
        } else {
            controls[this.format.control].patchValue(df.format(0));
        }
    }

    @HostListener("focus", ['$event'])
    onfocus(e) {
        const controls = this.format.form.controls;
        let data: string = controls[this.format.control].value;
        if (data) {
            data = data.replace(/,/g, '');
        } else {
            const df = new DecimalFormat('###,###.00');
            data = df.format(0);
        }
        controls[this.format.control].patchValue(data);
        if (data) {
            this.el.nativeElement.select();
        }
    }

}