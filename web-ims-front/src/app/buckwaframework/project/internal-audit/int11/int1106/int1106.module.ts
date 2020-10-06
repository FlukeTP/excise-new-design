import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Int1106RoutingModule } from './int1106-routing.module';
import { Int1106Component } from './int1106.component';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  declarations: [Int1106Component],
  imports: [
    CommonModule,
    Int1106RoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class Int1106Module { }
