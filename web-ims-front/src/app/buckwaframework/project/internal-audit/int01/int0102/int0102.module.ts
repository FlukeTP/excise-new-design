import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Int0102RoutingModule } from './int0102-routing.module';
import { Int010201Component } from './int010201/int010201.component';
import { Int010202Component } from './int010202/int010202.component';
import { Int010203Component } from './int010203/int010203.component';
import { Int0102Component } from './int0102.component';
import { BreadcrumbModule } from 'components/breadcrumb/breadcrumb.module';
import { SegmentModule } from 'components/segment/segment.module';
import { ModalModule } from 'components/modal/modal.module';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';

@NgModule({
  declarations: [Int0102Component,Int010201Component, Int010202Component, Int010203Component],
  imports: [
    CommonModule,
    Int0102RoutingModule,
    BreadcrumbModule,
    SegmentModule,
    ModalModule,
    SharedModule
  ],
  exports : [Int010202Component],
})
export class Int0102Module {  }
