import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { Ta0105Component } from './ta0105.component';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { Se01Component } from './se01/se01.component';
import { Se02Component } from './se02/se02.component';
import { TableCustomModule } from '../../table-custom/table-custom.module';
import { ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  { path: "", component: Ta0105Component },
  { path: "se01", component: Se01Component },
  { path: "se02", component: Se02Component },
];

@NgModule({
  declarations: [
    Ta0105Component,
    Se01Component,
    Se02Component
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    TableCustomModule,
    ReactiveFormsModule
  ],
  exports: [
    RouterModule
  ]
})
export class Ta0105Module { }
