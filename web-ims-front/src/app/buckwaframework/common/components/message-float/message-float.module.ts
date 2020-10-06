import { CommonModule } from '@angular/common';
import { NgModule } from "@angular/core";
import { MesssageFloatComponent } from './message-float.component';

@NgModule({
    imports: [
        CommonModule
    ],
    exports: [MesssageFloatComponent],
    declarations: [MesssageFloatComponent]
})
export class MessageFloatModule { }