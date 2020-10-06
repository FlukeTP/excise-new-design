import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PaginationComponent } from './pagination.component';
import { PipeModule } from '../../pipes/pipe.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        PipeModule
    ],
    declarations: [
        PaginationComponent
    ],
    exports: [
        // Component
        PaginationComponent,
        // Modules
        CommonModule,
        FormsModule
    ]
})
export class PaginationModule { }
