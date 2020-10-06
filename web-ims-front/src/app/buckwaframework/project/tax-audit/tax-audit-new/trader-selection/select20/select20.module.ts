import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Select20Component } from './select20.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TableCustomModule } from '../table-custom/table-custom.module';

const routes: Routes = [
  { path: "", component: Select20Component },
];

@NgModule({
  declarations: [Select20Component],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
     TableCustomModule,
    ReactiveFormsModule
  ],
  exports:[
    RouterModule
  ]
})
export class Select20Module { }
