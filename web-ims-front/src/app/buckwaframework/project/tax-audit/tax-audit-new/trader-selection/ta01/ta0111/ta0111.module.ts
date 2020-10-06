import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ta0111Component } from './ta0111.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { TableCustomModule } from '../../table-custom/table-custom.module';
import { ReactiveFormsModule } from '@angular/forms';
import { Ta011101Component } from './ta011101/ta011101.component';

const routes: Routes = [
  { path: "", component: Ta0111Component },
  { path: "01", component: Ta011101Component },
];

@NgModule({
  declarations: [Ta0111Component,Ta011101Component],
  imports: [
    CommonModule,
    SharedModule,
    TableCustomModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule
  ], exports: [
    RouterModule
  ]
})
export class Ta0111Module { }
