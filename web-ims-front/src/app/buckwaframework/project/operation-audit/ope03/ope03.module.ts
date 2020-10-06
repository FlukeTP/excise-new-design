import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ope03Component } from './ope03.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { Ope03RoutingModule } from './ope03-routing.module';

@NgModule({
  declarations: [
    Ope03Component,
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    Ope03RoutingModule
  ]
})
export class Ope03Module { }
