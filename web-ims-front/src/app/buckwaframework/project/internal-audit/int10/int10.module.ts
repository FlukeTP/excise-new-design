import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Int10RoutingModule } from './int10-routing.module';
import { Int10Component } from './int10.component';
import { BreadcrumbModule } from 'components/breadcrumb/breadcrumb.module';
import { SegmentModule } from 'components/segment/segment.module';
import { ModalModule } from 'components/modal/modal.module';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { Int1001Component } from './int1001/int1001.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ButtonModule } from 'components/button/button.module';
import { Int0102Module } from '../int01/int0102/int0102.module';

@NgModule({
  declarations: [Int10Component, Int1001Component],
  imports: [
    CommonModule,
    Int10RoutingModule,
    SharedModule,
    BreadcrumbModule,
    SegmentModule,
    ModalModule,
    ButtonModule,
    ReactiveFormsModule
    , FormsModule
    ,Int0102Module
  ]
})
export class Int10Module { }
