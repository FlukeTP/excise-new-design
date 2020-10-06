import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';

import { Int08RoutingModule } from './int08-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ButtonModule } from 'components/button/button.module';
import { ModalModule } from 'components/modal/modal.module';
import { SegmentModule } from 'components/segment/segment.module';
import { Int0801Component } from './int0801/int0801.component';
import { Int0803Component } from './int0803/int0803.component';
import { Int0804Component } from './int0804/int0804.component';
import { Int0802Component } from './int0802/int0802.component';

@NgModule({
  declarations: [Int0801Component, Int0803Component, Int0804Component,Int0802Component],
  imports: [
    CommonModule,
    Int08RoutingModule,
    SharedModule,
    SegmentModule,
    ModalModule,
    ButtonModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class Int08Module { }
