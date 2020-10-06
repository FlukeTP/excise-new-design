import { Component, Input } from '@angular/core';
@Component({
     templateUrl: 'button-finish.component.html'
})
export class ButtonFinishComponent {
     @Input() type: string = "button";
     @Input() disabled: boolean = false;
     constructor() {

     }
}