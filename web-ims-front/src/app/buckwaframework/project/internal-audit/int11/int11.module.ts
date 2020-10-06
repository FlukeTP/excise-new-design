import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Int11RoutingModule } from './int11-routing.module';
import { INT1102Component } from './int1102/int1102.component';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { Int1103Component } from './int1103/int1103.component';
import { Int11Component } from './int11.component';
import { BreadcrumbModule } from 'components/breadcrumb/breadcrumb.module';
import { SegmentModule } from 'components/segment/segment.module';
import { ModalModule } from 'components/modal/modal.module';
import { ButtonModule } from 'components/button/button.module';
import { ReactiveFormsModule } from '@angular/forms';
import { Int1107Component } from './int1107/int1107.component';


@NgModule({
    declarations: [INT1102Component, Int1103Component, Int11Component, Int1107Component],
    imports: [
        CommonModule,
        Int11RoutingModule,
        SharedModule,
        BreadcrumbModule,
        SegmentModule,
        ModalModule,
        ButtonModule,
        ReactiveFormsModule
    ]
})
export class Int11Module { }
