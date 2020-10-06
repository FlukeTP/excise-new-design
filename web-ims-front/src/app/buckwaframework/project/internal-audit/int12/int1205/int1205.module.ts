import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Int1205RoutingModule } from './int1205-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    Int1205RoutingModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class Int1205Module { }
