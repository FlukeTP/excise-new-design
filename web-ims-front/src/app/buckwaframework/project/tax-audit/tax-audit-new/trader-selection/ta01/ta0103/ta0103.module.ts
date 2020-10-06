import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ta0103Component } from './ta0103.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { TableCustomModule } from '../../table-custom/table-custom.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [

  { path: "", component: Ta0103Component, },
];

@NgModule({
  declarations: [Ta0103Component],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    TableCustomModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports:[
    RouterModule
  ]
})
export class Ta0103Module { }
