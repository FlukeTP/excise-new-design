import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Int120401RoutingModule } from './int120401-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    Int120401RoutingModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class Int120401Module { }
