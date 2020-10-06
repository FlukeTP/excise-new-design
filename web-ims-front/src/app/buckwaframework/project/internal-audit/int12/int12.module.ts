import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Int12RoutingModule } from './int12-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ButtonModule } from 'components/button/button.module';
import { ModalModule } from 'components/modal/modal.module';
import { SegmentModule } from 'components/segment/segment.module';
import { BreadcrumbModule } from 'components/index';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { Int120101Component } from './int1201/int120101/int120101.component';
import { Int120102Component } from './int1201/int120102/int120102.component';
import { Int02010101Component } from './int1201/int120101/int02010101/int02010101.component';

@NgModule({
  declarations: [Int120101Component, Int120102Component, Int02010101Component],
  imports: [
    CommonModule,
    Int12RoutingModule,
    SharedModule,
    BreadcrumbModule,
    SegmentModule,
    ModalModule,
    ButtonModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class Int12Module { }
