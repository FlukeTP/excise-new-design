import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Int0606RoutingModule } from './int0606-routing.module';
import { Int0606Component } from './int0606.component';
import { BreadcrumbModule } from 'components/breadcrumb/breadcrumb.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';


@NgModule({
  declarations: [Int0606Component],
  imports: [
    CommonModule,
    Int0606RoutingModule,
    FormsModule,
    BreadcrumbModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class Int0606Module { }
