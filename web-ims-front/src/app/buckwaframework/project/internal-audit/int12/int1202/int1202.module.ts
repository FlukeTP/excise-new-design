import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Int1202RoutingModule } from './int1202-routing.module';
import { Int1202Component } from './int1202.component';
import { Int120201Component } from './int120201/int120201.component';
import { Int120202Component } from './int120202/int120202.component';
import { Int12020101Component } from './int120201/int12020101/int12020101.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { Int12020102Component } from './int120201/int12020102/int12020102.component';

@NgModule({
  declarations: [
    Int1202Component,
    Int120201Component,
    Int120202Component,
    Int12020101Component,
    Int12020102Component
  ],
  imports: [
    CommonModule,
    Int1202RoutingModule,
    FormsModule,
    SharedModule

  ]
})
export class Int1202Module { }
