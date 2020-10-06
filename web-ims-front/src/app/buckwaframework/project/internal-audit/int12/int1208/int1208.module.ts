import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Int1208RoutingModule } from './int1208-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    Int1208RoutingModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class Int1208Module { }
