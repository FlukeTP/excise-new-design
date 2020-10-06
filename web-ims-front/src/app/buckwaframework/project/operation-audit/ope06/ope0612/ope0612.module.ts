import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Ope0612RoutingModule } from './ope0612-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { Ope0612Component } from './ope0612.component';
import { Ope061201Component } from './ope061201/ope061201.component';
import { Ope061202Component } from './ope061202/ope061202.component';
import { Ope061203Component } from './ope061203/ope061203.component';
import { OpeDetailsSearchComponent } from './ope061203/ope-details-search.component';
import { OpeDetailsDatePickerComponent } from './ope061203/ope-details-datepicker.component';

@NgModule({
  declarations: [
    Ope0612Component,
    Ope061201Component,
    Ope061202Component,
    Ope061203Component,
    OpeDetailsSearchComponent,
    OpeDetailsDatePickerComponent,
  ],
  imports: [
    CommonModule,
    Ope0612RoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class Ope0612Module { }
