import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageBarComponent } from './message-bar.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule
    ],
    declarations: [
        MessageBarComponent
    ],
    exports: [
        // Component
        MessageBarComponent,
        // Modules
        CommonModule,
        FormsModule
    ]
})
export class MessageBarModule { }