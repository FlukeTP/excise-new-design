import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Int0605RoutingModule } from './int0605-routing.module';
import { BreadcrumbModule, ModalModule } from 'components/index';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Int06051Service } from './int0605-1.services';
import { Int060503Component } from './int060503/int060503.component';
// import { Int060502Component } from './int060502/int060502.component';
import { Int060501Component } from './int060501/int060501.component';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';

@NgModule({
  declarations: [
    Int060501Component,
    // Int060502Component,
    Int060503Component
  ],
  imports: [
    CommonModule,
    Int0605RoutingModule,
    FormsModule,
    ReactiveFormsModule,
    // Components
    BreadcrumbModule,
    ModalModule,
    SharedModule
  ],
  providers: [Int06051Service],
})
export class Int0605Module { }
