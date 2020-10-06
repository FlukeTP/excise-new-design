import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BreadcrumbModule, ButtonModule, MessageBarModule, MessageFloatModule, ModalModule, PaginationModule, SegmentModule } from 'components/index';
import { DirectivesModule } from '../directives/directives.module';
import { PipeModule } from '../pipes/pipe.module';
import { WithBreadcrumbTemplate } from './with-breadcrumb/with-breadcrumb';
import { ScrollingModule } from '@angular/cdk/scrolling';

@NgModule({
    imports: [
        // Components Modules
        BreadcrumbModule,
        ButtonModule,
        CommonModule,
        MessageBarModule,
        MessageFloatModule,
        ModalModule,
        PaginationModule,
        SegmentModule,
        ScrollingModule,
        // Directives
        DirectivesModule,
        // Pipe Modules
        PipeModule,
    ],
    declarations: [
        WithBreadcrumbTemplate
    ],
    exports: [
        // Components Modules
        BreadcrumbModule,
        ButtonModule,
        CommonModule,
        MessageBarModule,
        MessageFloatModule,
        ModalModule,
        PaginationModule,
        SegmentModule,
        ScrollingModule,
        // Directives
        DirectivesModule,
        // Pipe Modules
        PipeModule,
        // Templates
        WithBreadcrumbTemplate,
    ]
})
export class SharedModule { }