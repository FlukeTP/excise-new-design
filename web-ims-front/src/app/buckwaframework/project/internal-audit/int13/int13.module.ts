import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Int13RoutingModule } from './int13-routing.module';
import { Int1301Component } from './int1301/int1301.component';
import { Int1302Component } from './int1302/int1302.component';
import { Int1303Component } from './int1303/int1303.component';
import { Int1304Component } from './int1304/int1304.component';
import { Int1305Component } from './int1305/int1305.component';
import { Int1306Component } from './int1306/int1306.component';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  declarations: [Int1301Component, Int1302Component, Int1303Component, Int1304Component, Int1305Component, Int1306Component],
  imports: [
    CommonModule,
    Int13RoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class Int13Module { }
