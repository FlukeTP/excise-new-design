import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Int0204RoutingModule } from './int0204-routing.module';
import { Int0204Component } from './int0204.component';
import { Int0204Service } from './int0204.service';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  declarations: [Int0204Component],
  imports: [
    CommonModule,
    Int0204RoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [Int0204Service],
})
export class Int0204Module { }
