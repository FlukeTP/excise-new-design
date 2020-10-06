import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Int1204RoutingModule } from './int1204-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    Int1204RoutingModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class Int1204Module { }
