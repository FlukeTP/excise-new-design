import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Plan0201Component } from './plan0201/plan0201.component';
import { Plan0202Component } from './plan0202/plan0202.component';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Plan02RoutingModule } from './plan02-routing.module';
import { Plan02Component } from './plan02.component';

@NgModule({
  declarations: [Plan0201Component, Plan0202Component, Plan02Component],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    Plan02RoutingModule
  ]
})
export class Plan02Module { }
