import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ta0110Component } from './ta0110.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { TableCustomModule } from '../../table-custom/table-custom.module';
import { ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  { path: "", component: Ta0110Component },
];

@NgModule({
  declarations: [Ta0110Component],
  imports: [
    CommonModule,
    SharedModule,
    TableCustomModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule
  ]
})
export class Ta0110Module { }
