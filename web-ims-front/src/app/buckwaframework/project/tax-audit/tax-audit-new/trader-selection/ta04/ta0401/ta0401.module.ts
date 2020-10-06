import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ta0401Component } from './ta0401.component';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { TableCustomModule } from '../../table-custom/table-custom.module';

const routes: Routes = [

  { path: "", component: Ta0401Component, }
]
@NgModule({
  declarations: [
    Ta0401Component
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    SharedModule,
    TableCustomModule
  ],
  exports: [
    RouterModule
  ]
})
export class Ta0401Module { }
