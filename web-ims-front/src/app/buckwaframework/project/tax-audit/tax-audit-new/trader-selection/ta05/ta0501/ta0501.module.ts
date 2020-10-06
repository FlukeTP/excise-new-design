import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ta0501Component } from './ta0501.component';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { TableCustomModule } from '../../table-custom/table-custom.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  { path: "", component: Ta0501Component },
];

@NgModule({
  declarations: [Ta0501Component],
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
export class Ta0501Module { }
