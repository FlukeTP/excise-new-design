import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SegmentComponent } from './segment.component';

@NgModule({
    imports: [CommonModule],
    declarations: [SegmentComponent],
    exports: [
        // Component
        SegmentComponent,
        // Modules
        CommonModule
    ]
})
export class SegmentModule { }