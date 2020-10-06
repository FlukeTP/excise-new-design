import { Component, Input } from "@angular/core";

@Component({
    selector: 'message-float',
    template: `
    <div style="position: fixed !important; z-index: 999 !important; top: calc(69px + 1em); right: 1.5em;">
        <div class="ui floating message {{ type }}" [ngClass]="{ 'visible': show, 'hidden': !show }">
            <p>{{ text }}</p>
        </div>
    </div>
    `
})
export class MesssageFloatComponent {
    @Input() text: string = "";
    @Input() show: boolean = false;
    @Input() type: string = "";
    constructor() { }
}