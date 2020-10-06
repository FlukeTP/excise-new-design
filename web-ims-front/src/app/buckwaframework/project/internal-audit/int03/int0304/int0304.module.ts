import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { Int0304RoutingModule } from './int0304-routing.module';
import { Int0304Component } from './int0304.component';
import { Int030401Component } from './int030401/int030401.component';
import { Int030402Component } from './int030402/int030402.component';
import { Int030403Component } from './int030403/int030403.component';
import { Int030404Component } from './int030404/int030404.component';
import { Int030405Component } from './int030405/int030405.component';
import { Int030406Component } from './int030406/int030406.component';
import { Int030407Component } from './int030407/int030407.component';
import { Int030408Component } from './int030408/int030408.component';

@NgModule({
  declarations: [
    Int0304Component,
    Int030401Component,
    Int030402Component,
    Int030405Component,
    Int030403Component,
    Int030404Component,
    Int030406Component,
    Int030407Component,
    Int030408Component
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    Int0304RoutingModule,
    SharedModule
  ]
})
export class Int0304Module { }
