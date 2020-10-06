import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Int15RoutingModule } from './int15-routing.module';
import { Int1501Component } from './int1501/int1501.component';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Int1502Component } from './int1502/int1502.component';
import { Int1503Component } from './int1503/int1503.component';
import { Int1504Component } from './int1504/int1504.component';
import { Int1505Component } from './int1505/int1505.component';

@NgModule({
  declarations: [Int1501Component, Int1502Component, Int1503Component, Int1504Component, Int1505Component],
  imports: [
    CommonModule,
    Int15RoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class Int15Module { }
