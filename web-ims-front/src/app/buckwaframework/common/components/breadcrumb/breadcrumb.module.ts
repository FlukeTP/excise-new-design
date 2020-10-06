import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BreadcrumbComponent } from './breadcrumb.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule
    ],
    declarations: [
        BreadcrumbComponent
    ],
    exports: [
        // Component
        BreadcrumbComponent,
        // Modules
        CommonModule,
        FormsModule,
        RouterModule
    ]
})
export class BreadcrumbModule { }