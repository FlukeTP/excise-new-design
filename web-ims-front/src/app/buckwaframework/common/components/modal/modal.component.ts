import { AfterViewInit, Component, Input, OnDestroy } from "@angular/core";
import { COLOR } from "../../constants/color";

declare var $: any;
@Component({
    selector: 'ui-modal',
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.css']
})
export class ModalComponent implements AfterViewInit, OnDestroy {

    @Input() success: boolean; // change button in modal type: alert
    @Input() type: string; // custom confirm alert
    @Input() size: string; // mini tiny small large fullscreen
    @Input() title: string; // title of header
    @Input() id: string; // id of modal

    headerStyles = {
        ...COLOR.SEGMENT_HEADER,
        // More styles
    }

    constructor() {
        // TODO
    }

    ngAfterViewInit(): void {
        $(`#${this.id}`).modal({ closable: false, autofocus: false });
    }

    ngOnDestroy(): void {
        $(`#${this.id}`).remove();
    }

    chkType(_case): boolean { // check type of modal
        return this.type === _case;
    }

}