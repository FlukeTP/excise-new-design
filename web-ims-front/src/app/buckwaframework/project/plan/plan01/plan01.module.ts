import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Plan01Component } from './plan01.component';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Plan01RoutingModule } from './plan01-routing.module';

@NgModule({
  declarations: [Plan01Component],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    Plan01RoutingModule
  ]
})
export class Plan01Module { }
