import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Int120801RoutingModule } from './int120801-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    Int120801RoutingModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class Int120801Module { }
