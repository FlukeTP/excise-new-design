import { Component, Input, OnInit } from '@angular/core';
import { COLOR } from '../../constants/color';

@Component({
    selector: 'segment',
    templateUrl: 'segment.component.html',
})

export class SegmentComponent implements OnInit {

    @Input() header: string = "";
    @Input() loading: boolean = false;
    @Input() right: boolean = false;
    @Input() showBody: boolean = true;
    headerStyles = {
        ...COLOR.SEGMENT_HEADER,
        // More styles
        "margin-top": "1em"
    }

    constructor() { }

    ngOnInit() { }
}