import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Plan03Component } from './plan03.component';
import { Plan0301Component } from './plan0301/plan0301.component';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Plan03RoutingModule } from './plan03-routing.module';

@NgModule({
  declarations: [Plan03Component, Plan0301Component],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    Plan03RoutingModule
  ]
})
export class Plan03Module { }
