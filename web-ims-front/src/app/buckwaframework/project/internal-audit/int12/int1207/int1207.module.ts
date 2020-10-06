import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Int1207RoutingModule } from './int1207-routing.module';
import { Int120701Component } from './int120701/int120701.component';
import { Int12070101Component } from './int120701/int12070101/int12070101.component';
import { Int12070102Component } from './int120701/int12070102/int12070102.component';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Int12070103Component } from './int120701/int12070103/int12070103.component';

@NgModule({
  declarations: [Int120701Component, Int12070101Component, Int12070102Component, Int12070103Component],
  imports: [
    CommonModule,
    Int1207RoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class Int1207Module { }
